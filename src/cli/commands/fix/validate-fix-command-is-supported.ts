import * as Debug from 'debug';

import { getEcosystemForTest } from '../../../lib/ecosystems';

import { isFeatureFlagSupportedForOrg } from '../../../lib/feature-flags';
import { FeatureNotSupportedByEcosystemError } from '../../../lib/errors/not-supported-by-ecosystem';
import { Options, TestOptions } from '../../../lib/types';
import { AuthFailedError } from '../../../lib/errors';
import chalk from 'chalk';

const debug = Debug('w3security-fix');
const w3securityFixFeatureFlag = 'cliw3securityFix';

export async function validateFixCommandIsSupported(
  options: Options & TestOptions,
): Promise<boolean> {
  if (options.docker) {
    throw new FeatureNotSupportedByEcosystemError('w3security fix', 'docker');
  }

  const ecosystem = getEcosystemForTest(options);
  if (ecosystem) {
    throw new FeatureNotSupportedByEcosystemError('w3security fix', ecosystem);
  }

  const w3securityFixSupported = await isFeatureFlagSupportedForOrg(
    w3securityFixFeatureFlag,
    options.org,
  );

  debug('Feature flag check returned: ', w3securityFixSupported);

  if (w3securityFixSupported.code === 401 || w3securityFixSupported.code === 403) {
    throw AuthFailedError(w3securityFixSupported.error, w3securityFixSupported.code);
  }

  if (!w3securityFixSupported.ok) {
    const w3securityFixErrorMessage =
      chalk.red(
        `\`w3security fix\` is not supported${options.org ? ` for org '${options.org}'` : ''
        }.`,
      ) +
      '\nSee documentation on how to enable this beta feature: https://docs.w3security.io/w3security-cli/fix-vulnerabilities-from-the-cli/automatic-remediation-with-w3security-fix#enabling-w3security-fix';
    const unsupportedError = new Error(w3securityFixErrorMessage);
    throw unsupportedError;
  }

  return true;
}
