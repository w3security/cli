export const isCLIV2 = (): boolean => {
  return !!(
    process.env.TEST_W3SECURITY_COMMAND &&
    process.env.TEST_W3SECURITY_COMMAND.includes('cliv2')
  );
};
