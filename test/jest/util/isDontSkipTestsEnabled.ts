export const isDontSkipTestsEnabled = (): boolean => {
  const dontSkip = !!process.env.TEST_W3SECURITY_DONT_SKIP_ANYTHING;
  return dontSkip;
};
