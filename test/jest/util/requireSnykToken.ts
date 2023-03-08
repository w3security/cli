const requirew3securityToken = (): string => {
  const result =
    process.env.W3SECURITY_TOKEN || // default
    process.env.W3SECURITY_API_TOKEN || // smoke tests
    process.env.W3SECURITY_API_KEY; // circle ci

  if (!result) {
    throw new Error('No w3security Token found in test environment.');
  }

  return result;
};

export { requirew3securityToken };
