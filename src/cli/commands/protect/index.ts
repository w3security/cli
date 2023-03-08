import * as theme from '../../../lib/theme';

export default function protectFunc() {
  console.log(
    theme.color.status.warn(
      `\n${theme.icon.WARNING} WARNING: w3security protect was removed at 31 March 2022.\nPlease use '@w3security/protect' package instead: https://updates.w3security.io/w3security-wizard-and-w3security-protect-removal-224137 \n`,
    ),
  );
}
