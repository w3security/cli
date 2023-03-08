import * as path from 'path';
import * as fs from 'fs';
import { IacOutputMeta } from '../../../../../../../src/lib/types';
import {
  formatw3securityIacTestTestData,
  formatTestData,
} from '../../../../../../../src/lib/formatters/iac-output/text';
import { FormattedResult } from '../../../../../../../src/cli/commands/test/iac/local-execution/types';
import { w3securityIacTestOutput } from '../../../../../../../src/lib/iac/test/v2/scan/results';
import {
  FormattedOutputResultsBySeverity,
  IacTestData,
} from '../../../../../../../src/lib/formatters/iac-output/text/types';

describe('formatTestData', () => {
  const formattedResultFixtures: FormattedResult[] = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'iac',
        'process-results',
        'fixtures',
        'formatted-results.json',
      ),
      'utf-8',
    ),
  );

  const testDataFixture: FormattedOutputResultsBySeverity = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'iac',
        'process-results',
        'fixtures',
        'test-data.json',
      ),
      'utf-8',
    ),
  );

  const outputMeta: IacOutputMeta = {
    orgName: 'Shmulik.Kipod',
    projectName: 'project-name',
  };

  it('formats the test data correctly', () => {
    expect(
      formatTestData({
        oldFormattedResults: formattedResultFixtures,
        iacOutputMeta: outputMeta,
        ignoresCount: 3,
      }),
    ).toEqual(testDataFixture);
  });
});

describe('formatw3securityIacTestTestData', () => {
  const w3securityIacTestOutputFixture: w3securityIacTestOutput = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'iac',
        'process-results',
        'fixtures',
        'w3security-iac-test-results.json',
      ),
      'utf-8',
    ),
  );
  const w3securityIacTestOutputWithSuppressionsFixture: w3securityIacTestOutput = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'iac',
        'process-results',
        'fixtures',
        'w3security-iac-test-results-with-suppressions.json',
      ),
      'utf-8',
    ),
  );

  const testDataFixture: IacTestData = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'iac',
        'process-results',
        'fixtures',
        'w3security-iac-test-text-output-data.json',
      ),
      'utf-8',
    ),
  );
  const testDataWithSuppressionsFixture: IacTestData = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'iac',
        'process-results',
        'fixtures',
        'w3security-iac-test-text-output-data-with-suppressions.json',
      ),
      'utf-8',
    ),
  );

  it('formats the test data correctly', () => {
    const result = formatw3securityIacTestTestData(
      w3securityIacTestOutputFixture.results,
      'project-name',
      'org-name',
    );

    expect(result).toEqual(testDataFixture);
  });

  it('formats the test data correctly when suppressions are present', () => {
    const result = formatw3securityIacTestTestData(
      w3securityIacTestOutputWithSuppressionsFixture.results,
      'project-name',
      'org-name',
    );

    expect(result).toEqual(testDataWithSuppressionsFixture);
  });
});
