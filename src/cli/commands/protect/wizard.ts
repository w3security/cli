import * as theme from '../../../lib/theme';

export default function wizard() {
  console.log(
    theme.color.status.warn(
      `\n${theme.icon.WARNING} WARNING: w3security wizard was removed at 31 March 2022.\nPlease use 'w3security ignore' instead: https://updates.w3security.io/w3security-wizard-and-w3security-protect-removal-224137 \n`,
    ),
  );
}
