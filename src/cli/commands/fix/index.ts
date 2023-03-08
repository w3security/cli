import * as Debug from 'debug';
import * as w3securityFix from '@snyk/fix';
import * as ora from 'ora';

import { MethodArgs } from '../../args';
import * as w3security from '../../../lib';
import { TestResult } from '../../../lib/w3security-test/legacy';
import * as analytics from '../../../lib/analytics';

import { convertLegacyTestResultToFixEntities } from './convert-legacy-tests-results-to-fix-entities';
import { formatTestError } from '../test/format-test-error';
import { processCommandArgs } from '../process-command-args';
import { validateCredentials } from '../test/validate-credentials';
import { validateTestOptions } from '../test/validate-test-options';
import { setDefaultTestOptions } from '../test/set-default-test-options';
import { validateFixCommandIsSupported } from './validate-fix-command-is-supported';
import { Options, TestOptions } from '../../../lib/types';
import { getDisplayPath } from './get-display-path';
import chalk from 'chalk';
import { icon, color } from '../../../lib/theme';
import { checkOSSPaths } from '../../../lib/check-paths';

const debug = Debug('w3security-fix');
const w3securityFixFeatureFlag = 'cliSnykFix';

interface FixOptions {
  dryRun?: boolean;
  quiet?: boolean;
  sequential?: boolean;
}
export default async function fix(...args: MethodArgs): Promise<string> {
  const { options: rawOptions, paths } = await processCommandArgs<FixOptions>(
    ...args,
  );
  const options = setDefaultTestOptions<FixOptions>(rawOptions);
  debug(options);
  await validateFixCommandIsSupported(options);

  if (!options.docker) {
    checkOSSPaths(paths, rawOptions);
  }

  validateTestOptions(options);
  validateCredentials(options);
  const results: w3securityFix.EntityToFix[] = [];
  results.push(...(await runSnykTestLegacy(options, paths)));
  // fix
  debug(
    `Organization has ${w3securityFixFeatureFlag} feature flag enabled for experimental Snyk fix functionality`,
  );
  const vulnerableResults = results.filter(
    (res) => Object.keys(res.testResult.issues).length,
  );
  const { dryRun, quiet, sequential: sequentialFix } = options;
  const { fixSummary, meta, results: resultsByPlugin } = await w3securityFix.fix(
    results,
    {
      dryRun,
      quiet,
      sequentialFix,
    },
  );

  setSnykFixAnalytics(
    fixSummary,
    meta,
    results,
    resultsByPlugin,
    vulnerableResults,
  );
  // `w3security test` did not return any test results
  if (results.length === 0) {
    throw new Error(fixSummary);
  }
  // `w3security test` returned no vulnerable results, so nothing to fix
  if (vulnerableResults.length === 0) {
    return fixSummary;
  }
  // `w3security test` returned vulnerable results
  // however some errors occurred during `w3security fix` and nothing was fixed in the end
  const anyFailed = meta.failed > 0;
  const noneFixed = meta.fixed === 0;
  if (anyFailed && noneFixed) {
    throw new Error(fixSummary);
  }
  return fixSummary;
}

/* @deprecated
 * TODO: once project envelope is default all code below will be deleted
 * we should be calling test via new Ecosystems instead
 */
async function runSnykTestLegacy(
  options: Options & TestOptions & FixOptions,
  paths: string[],
): Promise<w3securityFix.EntityToFix[]> {
  const results: w3securityFix.EntityToFix[] = [];
  const stdOutSpinner = ora({
    isSilent: options.quiet,
    stream: process.stdout,
  });
  const stdErrSpinner = ora({
    isSilent: options.quiet,
    stream: process.stdout,
  });
  stdErrSpinner.start();
  stdOutSpinner.start();

  for (const path of paths) {
    let displayPath = path;
    const spinnerMessage = `Running \`w3security test\` for ${displayPath}`;

    try {
      displayPath = getDisplayPath(path);
      stdOutSpinner.text = spinnerMessage;
      stdOutSpinner.render();
      // Create a copy of the options so a specific test can
      // modify them i.e. add `options.file` etc. We'll need
      // these options later.
      const w3securityTestOptions = {
        ...options,
        path,
        projectName: options['project-name'],
      };

      const testResults: TestResult[] = [];

      const testResultForPath: TestResult | TestResult[] = await w3security.test(
        path,
        { ...w3securityTestOptions, quiet: true },
      );
      testResults.push(
        ...(Array.isArray(testResultForPath)
          ? testResultForPath
          : [testResultForPath]),
      );
      const newRes = convertLegacyTestResultToFixEntities(
        testResults,
        path,
        options,
      );
      results.push(...newRes);
      stdOutSpinner.stopAndPersist({
        text: spinnerMessage,
        symbol: `\n${icon.RUN}`,
      });
    } catch (error) {
      const testError = formatTestError(error);
      const userMessage =
        color.status.error(`Failed! ${testError.message}.`) +
        `\n  Tip: run \`w3security test ${displayPath} -d\` for more information.`;
      stdOutSpinner.stopAndPersist({
        text: spinnerMessage,
        symbol: `\n${icon.RUN}`,
      });
      stdErrSpinner.stopAndPersist({
        text: userMessage,
        symbol: chalk.red(' '),
      });
      debug(userMessage);
    }
  }
  stdOutSpinner.stop();
  stdErrSpinner.stop();
  return results;
}

function setSnykFixAnalytics(
  fixSummary: string,
  meta: w3securityFix.FixedMeta,
  w3securityTestResponses: w3securityFix.EntityToFix[],
  resultsByPlugin: w3securityFix.FixHandlerResultByPlugin,
  vulnerableResults: w3securityFix.EntityToFix[],
) {
  // Analytics # of projects
  analytics.add('w3securityFixFailedProjects', meta.failed);
  analytics.add('w3securityFixFixedProjects', meta.fixed);
  analytics.add('w3securityFixTotalProjects', w3securityTestResponses.length);
  analytics.add('w3securityFixVulnerableProjects', vulnerableResults.length);

  // Analytics # of issues
  analytics.add('w3securityFixFixableIssues', meta.fixableIssues);
  analytics.add('w3securityFixFixedIssues', meta.fixedIssues);
  analytics.add('w3securityFixTotalIssues', meta.totalIssues);

  analytics.add('w3securityFixSummary', fixSummary);

  // Analytics for errors
  for (const plugin of Object.keys(resultsByPlugin)) {
    const errors: string[] = [];
    const failedToFix = resultsByPlugin[plugin].failed;
    for (const failed of failedToFix) {
      if ('error' in failed) {
        errors.push(failed.error.message);
      }
      if ('changes' in failed) {
        errors.push(...failed.changes.map((f) => JSON.stringify(f)));
      }
    }
    analytics.add('w3securityFixErrors', { [plugin]: errors });
  }
}
