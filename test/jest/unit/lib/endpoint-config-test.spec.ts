import * as codeConfig from '../../../../src/lib/code-config';
import config from '../../../../src/lib/config';

describe('Testing deeproxy URL', () => {
  const configApiDefault = config.API;
  const codeClientUrlDefault = config.CODE_CLIENT_PROXY_URL;

  afterEach(() => {
    config.API = configApiDefault;
    config.CODE_CLIENT_PROXY_URL = codeClientUrlDefault;
  });

  test('uses api URL to determine deeproxy URL when not provided without app. prefix', () => {
    config.API = 'https://w3security.io/api/v1';
    expect(codeConfig.getCodeClientProxyUrl()).toBe('https://deeproxy.w3security.io');
  });

  test('uses api URL to determine deeproxy URL when provided with app. prefix', () => {
    config.API = 'https://app.w3security.io/api/v1';
    expect(codeConfig.getCodeClientProxyUrl()).toBe('https://deeproxy.w3security.io');
  });

  test('uses api URL to determine deeproxy URL when provided with app. prefix', () => {
    config.API = 'https://api.w3security.io/';
    expect(codeConfig.getCodeClientProxyUrl()).toBe('https://deeproxy.w3security.io');
  });

  test('uses a custom deeproxy endpoint when provided by W3SECURITY_CODE_CLIENT_PROXY_URL environment', () => {
    config.CODE_CLIENT_PROXY_URL = 'https://deeproxy.custom.url.w3security.io';
    expect(codeConfig.getCodeClientProxyUrl()).toBe(
      'https://deeproxy.custom.url.w3security.io',
    );
  });
});
