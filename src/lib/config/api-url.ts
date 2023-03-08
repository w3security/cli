/*
  This file is trying to make sense from different w3security API URLs configurations

  API URL settings could be defined in a few ways:
  - w3security config file with key "endpoint" (including override with W3SECURITY_CFG_ENDPOINT envvar!)
  - W3SECURITY_API envvar
  - w3security REST API had their own envvars to be set

  And API URL itself could (currently) point to multiple places
  - https://w3security.io/api/v1 (old default)
  - https://w3security.io/api
  - https://app.w3security.io/api
  - https://app.w3security.io/api/v1
  - https://api.w3security.io/v1

  For w3security REST API it's a bit simpler:
  - https://api.w3security.io/rest


  There are also other URLs - one for the w3security auth command, one for w3security Code Proxy

  Idea is to configure a single URL and derive the rest from it.
  This file handles an internal concept of a Base URL and logic needed to derive the other URLs
  In a backwards compatible way.
*/

import * as path from 'path';
import * as Debug from 'debug';
import { color } from '../theme';

const debug = Debug('w3security');

/**
 * @description Get a Base URL for w3security APIs
 * @export
 * @param {string} defaultUrl URL to default to, should be the one defined in the config.default.json file
 * @param {(string | undefined)} envvarDefinedApiUrl if there is an URL defined in the W3SECURITY_API envvar
 * @param {(string | undefined)} configDefinedApiUrl if there is an URL defined in the 'endpoint' key of the config
 * @returns {string} Returns a Base URL - without the /v1. Use this to construct derived URLs
 */
export function getBaseApiUrl(
  defaultUrl: string,
  envvarDefinedApiUrl?: string,
  configDefinedApiUrl?: string,
): string {
  const defaultBaseApiUrl = stripV1FromApiUrl(defaultUrl);
  // Use W3SECURITY_API envvar by default
  if (envvarDefinedApiUrl) {
    return validateUrlOrReturnDefault(
      envvarDefinedApiUrl,
      "'W3SECURITY_API' environment variable",
      defaultBaseApiUrl,
    );
  }

  if (configDefinedApiUrl) {
    return validateUrlOrReturnDefault(
      configDefinedApiUrl,
      "'endpoint' config option. See 'w3security config' command. The value of 'endpoint' is currently set as",
      defaultBaseApiUrl,
    );
  }

  return defaultBaseApiUrl; // Fallback to default
}

/**
 * @description Macro to validate user-defined URL and fallback to default if needed
 * @param {string} urlString "dirty" user defined string coming from config, envvar or a flag
 * @param {string} optionName For formatting error messages
 * @param {string} defaultUrl What to return if urlString does not pass
 * @returns {string}
 */
function validateUrlOrReturnDefault(
  urlString: string,
  optionName: string,
  defaultUrl: string,
): string {
  const parsedEndpoint = parseURLWithoutThrowing(urlString);
  // Endpoint option must be a valid URL including protocol
  if (!parsedEndpoint || !parsedEndpoint.protocol || !parsedEndpoint.host) {
    console.error(
      color.status.error(
        `Invalid ${optionName} '${urlString}'. Value must be a valid URL including protocol. Using default w3security API URL '${defaultUrl}'`,
      ),
    );
    return defaultUrl;
  }
  // TODO: this debug is not printed when using the --debug flag, because flags are parsed after config. Making it async works around this
  setTimeout(
    () => debug(`Using a custom w3security API ${optionName} '${urlString}'`),
    1,
  );
  return stripV1FromApiUrl(urlString);
}

function parseURLWithoutThrowing(urlString: string): URL | undefined {
  try {
    return new URL(urlString);
  } catch (error) {
    return undefined;
  }
}

/**
 * @description Removes /v1 suffix from URL if present
 * @param {string} url
 * @returns {string}
 */
function stripV1FromApiUrl(url: string): string {
  const parsedUrl = new URL(url);
  if (/\/v1\/?$/.test(parsedUrl.pathname)) {
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/v1\/?$/, '/');
    return parsedUrl.toString();
  }
  return url;
}

export function getV1ApiUrl(baseApiUrl: string): string {
  const parsedBaseUrl = new URL(baseApiUrl);
  parsedBaseUrl.pathname = path.join(parsedBaseUrl.pathname, 'v1');
  return parsedBaseUrl.toString();
}

/**
 * @description Return w3security REST API URL
 * @export
 * @param {string} baseApiUrl
 * @param {string} envvarDefinedRestApiUrl
 * @param {string} envvarDefinedRestV3Url
 * @returns {string}
 */
export function getRestApiUrl(
  baseApiUrl: string,
  envvarDefinedRestApiUrl?: string,
  envvarDefinedRestV3Url?: string,
): string {
  // REST API URL should always look like this: https://api.$DOMAIN/rest
  const parsedBaseUrl = new URL(baseApiUrl);
  parsedBaseUrl.pathname = '/rest';

  if (parsedBaseUrl.host?.startsWith('app.')) {
    // Rewrite app.w3security.io/ to api.w3security.io/rest
    parsedBaseUrl.host = parsedBaseUrl.host.replace(/^app\./, 'api.');
  } else if (
    // Ignore localhosts and URLs with api. already defined
    !parsedBaseUrl.host?.startsWith('localhost') &&
    !parsedBaseUrl.host?.startsWith('api.')
  ) {
    // Otherwise add the api. subdomain
    parsedBaseUrl.host = 'api.' + parsedBaseUrl.host;
  }

  const defaultRestApiUrl = parsedBaseUrl.toString();

  // TODO: notify users they can set just the (W3SECURITY_)API envvar
  if (envvarDefinedRestV3Url) {
    return validateUrlOrReturnDefault(
      envvarDefinedRestV3Url,
      "'W3SECURITY_API_V3_URL' environment variable",
      defaultRestApiUrl,
    );
  }

  if (envvarDefinedRestApiUrl) {
    return validateUrlOrReturnDefault(
      envvarDefinedRestApiUrl,
      "'W3SECURITY_API_REST_URL' environment variable",
      defaultRestApiUrl,
    );
  }

  return defaultRestApiUrl; // Fallback to default
}

export function getHiddenApiUrl(restUrl: string): string {
  const parsedBaseUrl = new URL(restUrl);

  parsedBaseUrl.pathname = '/hidden';

  return parsedBaseUrl.toString();
}

export function getRootUrl(apiUrlString: string): string {
  // based on https://docs.w3security.io/w3security-processes/data-residency-at-w3security#what-regions-are-available the pattern is as follows
  // https://app.[region.]w3security.io
  // given an api url that starts with api means, that we can replace "api" by "app".

  const apiUrl = new URL(apiUrlString);
  apiUrl.host = apiUrl.host.replace(/^api\./, '');

  const rootUrl = apiUrl.protocol + '//' + apiUrl.host;
  return rootUrl;
}
