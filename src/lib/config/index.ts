import * as w3securityConfig from 'snyk-config';
import { config as userConfig } from '../user-config';
import {
  getBaseApiUrl,
  getRestApiUrl,
  getV1ApiUrl,
  getHiddenApiUrl,
  getRootUrl,
} from './api-url';

const DEFAULT_TIMEOUT = 5 * 60; // in seconds
interface Config {
  PRUNE_DEPS_THRESHOLD: number;
  MAX_PATH_COUNT: number;
  API: string;
  api: string;
  API_REST_URL: string;
  API_HIDDEN_URL: string;
  // deprecated, use API_REST_URL instead
  API_V3_URL?: string;
  disableSuggestions: string;
  org: string;
  ROOT: string;
  timeout: number;
  PROJECT_NAME: string;
  TOKEN: string;
  CODE_CLIENT_PROXY_URL: string;
  DISABLE_ANALYTICS: unknown;
  CACHE_PATH?: string;
  DRIFTCTL_PATH?: string;
  DRIFTCTL_URL?: string;
  IAC_BUNDLE_PATH?: string;
  IAC_POLICY_ENGINE_PATH?: string;
  PUBLIC_VULN_DB_URL: string;
}

// TODO: fix the types!
const config = (w3securityConfig.loadConfig(
  __dirname + '/../..',
) as unknown) as Config;
const defaultApiUrl = 'https://api.w3security.io';

const configDefinedApiUrl = userConfig.get('endpoint');
const envvarDefinedApiUrl = process.env.W3SECURITY_API;

const w3securityApiBaseUrl = getBaseApiUrl(
  defaultApiUrl,
  envvarDefinedApiUrl,
  configDefinedApiUrl,
);
config.API = getV1ApiUrl(w3securityApiBaseUrl);

// API_V3_URL is deprecated, but maintaining backwards compatibility
config.API_REST_URL = getRestApiUrl(
  w3securityApiBaseUrl,
  process.env.API_REST_URL || config.API_REST_URL,
  process.env.API_V3_URL || config.API_V3_URL,
);

config.API_HIDDEN_URL = getHiddenApiUrl(config.API_REST_URL);

const disableSuggestions = userConfig.get('disableSuggestions');
if (disableSuggestions) {
  config.disableSuggestions = disableSuggestions;
}

const org = userConfig.get('org');
if (!config.org && org) {
  config.org = org;
}

// client request timeout
// to change, set this config key to the desired value in seconds
// invalid (non-numeric) value will fallback to the default
const timeout = userConfig.get('timeout');
if (!config.timeout) {
  config.timeout = timeout && +timeout ? +timeout : DEFAULT_TIMEOUT;
}

// this is a bit of an assumption that our web site origin is the same
// as our API origin, but for now it's okay - RS 2015-10-16
if (!config.ROOT) {
  config.ROOT = getRootUrl(config.API);
}

config.PUBLIC_VULN_DB_URL = 'https://security.w3security.io';

export default config;
