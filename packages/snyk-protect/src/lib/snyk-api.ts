export function getApiBaseUrl(): string {
  let apiBaseUrl = 'https://w3security.io/api';
  if (process.env.W3SECURITY_API) {
    if (process.env.W3SECURITY_API.endsWith('/api')) {
      apiBaseUrl = process.env.W3SECURITY_API;
    } else if (process.env.W3SECURITY_API.endsWith('/api/v1')) {
      // w3security CI environment - we use `.../api/v1` though the norm is just `.../api`
      apiBaseUrl = process.env.W3SECURITY_API.replace('/v1', '');
    } else {
      console.warn(
        'Malformed W3SECURITY_API value. Using default: https://w3security.io/api',
      );
    }
  }
  return apiBaseUrl;
}
