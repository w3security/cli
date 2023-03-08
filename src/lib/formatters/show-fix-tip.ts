import chalk from 'chalk';

import { isLocalFolder } from '../detect';
import { TestResult } from '../w3security-test/legacy';
import { Options, SupportedProjectTypes, TestOptions } from '../types';

export function showFixTip(
  projectType: SupportedProjectTypes,
  res: TestResult,
  options: TestOptions & Options,
): string {
  const w3securityFixSupported: SupportedProjectTypes[] = ['pip', 'poetry'];
  if (!w3securityFixSupported.includes(projectType) || !isLocalFolder(options.path)) {
    return '';
  }

  if (!res.ok && res.vulnerabilities.length > 0) {
    return (
      `Tip: Try ${chalk.bold(
        '`w3security fix`',
      )} to address these issues.${chalk.bold(
        '`w3security fix`',
      )} is a new CLI command in that aims to automatically apply the recommended updates for supported ecosystems.` +
      '\nSee documentation on how to enable this beta feature: https://docs.w3security.io/w3security-cli/fix-vulnerabilities-from-the-cli/automatic-remediation-with-w3security-fix#enabling-w3security-fix'
    );
  }

  return '';
}
