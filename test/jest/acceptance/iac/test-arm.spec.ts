import { EOL } from 'os';
import { startMockServer, isValidJSONString } from './helpers';
jest.setTimeout(50000);

describe('ARM single file scan', () => {
  let run: (
    cmd: string,
  ) => Promise<{ stdout: string; stderr: string; exitCode: number }>;
  let teardown: () => void;

  beforeAll(async () => {
    const result = await startMockServer();
    run = result.run;
    teardown = result.teardown;
  });

  afterAll(async () => teardown());

  it('finds issues in ARM JSON file', async () => {
    const { stdout, exitCode } = await run(
      `w3security iac test ./iac/arm/rule_test.json`,
    );
    expect(stdout).toContain(
      'Azure Firewall Network Rule Collection allows public access',
    );
    expect(stdout).toContain(
      '  Path:    resources[1] > properties > networkRuleCollections[0] > properties >' +
      EOL +
      '           rules[0] > sourceAddresses',
    );
    expect(stdout).toContain('File:    ./iac/arm/rule_test.json');
    expect(exitCode).toBe(1);
  });

  it('filters out issues when using severity threshold', async () => {
    const { stdout, exitCode } = await run(
      `w3security iac test ./iac/arm/rule_test.json --severity-threshold=high`,
    );
    expect(stdout).toContain('No vulnerable paths were found!');
    expect(exitCode).toBe(0);
  });

  it('outputs an error for files with no valid JSON', async () => {
    const { stdout, exitCode } = await run(
      `w3security iac test ./iac/arm/invalid_rule_test.json`,
    );

    expect(stdout).toContain(
      'Failed to parse JSON file' +
      EOL +
      '  Path: ./iac/arm/invalid_rule_test.json',
    );
    expect(exitCode).toBe(2);
  });

  it('outputs the expected text when running with --sarif flag', async () => {
    const { stdout, exitCode } = await run(
      `w3security iac test ./iac/arm/rule_test.json --sarif`,
    );

    expect(stdout).toContain('"id": "W3SECURITY-CC-TF-20",');
    expect(stdout).toContain('"ruleId": "W3SECURITY-CC-TF-20",');
    expect(exitCode).toBe(1);
  });

  it('outputs the expected text when running with --json flag', async () => {
    const { stdout, exitCode } = await run(
      `w3security iac test ./iac/arm/rule_test.json --json`,
    );

    expect(isValidJSONString(stdout)).toBe(true);
    expect(stdout).toContain('"id": "W3SECURITY-CC-TF-20",');
    expect(stdout).toContain('"packageManager": "armconfig",');
    expect(stdout).toContain('"projectType": "armconfig",');
    expect(exitCode).toBe(1);
  });
});
