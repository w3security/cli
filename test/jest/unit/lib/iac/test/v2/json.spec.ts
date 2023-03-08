import * as fs from 'fs';
import * as path from 'path';
import { w3securityIacTestError } from '../../../../../../../src/lib/iac/test/v2/errors';
import {
  convertEngineToJsonResults,
  Result,
} from '../../../../../../../src/lib/iac/test/v2/json';
import { ScanError } from '../../../../../../../src/lib/iac/test/v2/scan/results';

describe('convertEngineToJsonResults', () => {
  const w3securityIacTestFixtureContent = fs.readFileSync(
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
  );

  const w3securityIacTestFixture = JSON.parse(w3securityIacTestFixtureContent);
  w3securityIacTestFixture.errors = w3securityIacTestFixture.errors?.map((item) => {
    const isError = 'code' in item;
    return isError ? new w3securityIacTestError(item) : item;
  });

  const integratedJsonOutputFixtureContent = fs.readFileSync(
    path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'iac',
      'process-results',
      'fixtures',
      'integrated-json-output.json',
    ),
    'utf-8',
  );
  let integratedJsonOutputFixture: Array<Result | ScanError> = JSON.parse(
    integratedJsonOutputFixtureContent,
  );

  integratedJsonOutputFixture = integratedJsonOutputFixture.map((item) =>
    !('error' in item) ? { ...item, path: process.cwd() } : item,
  );

  it('returns expected JSON result', () => {
    const result = convertEngineToJsonResults({
      results: w3securityIacTestFixture,
      projectName: 'org-name',
    });

    integratedJsonOutputFixture.forEach((item) => {
      if ('targetFilePath' in item) {
        item.targetFilePath = path.resolve(item.targetFile);
      }
    });

    expect(result).toEqual(integratedJsonOutputFixture);
  });
});
