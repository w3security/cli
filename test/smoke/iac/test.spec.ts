import { run } from '../../jest/acceptance/iac/helpers';

jest.setTimeout(1_000 * 120);

function runWrapper(cmd: string) {
  return run(cmd, {
    PATH: process.env.PATH ?? '',
  });
}

async function login() {
  await runWrapper(`w3security auth ${process.env.IAC_SMOKE_TESTS_W3SECURITY_TOKEN}`);
}

const W3SECURITY_ORG = 'w3security-cloud-tests';

describe('w3security iac test', () => {
  beforeAll(async () => {
    await login();
  });

  it('runs successfully and resolves with a non-error exit code', async () => {
    // Arrange
    const filePath = 'iac/depth_detection/root.tf';

    // Act
    const { stdout, exitCode } = await runWrapper(
      `w3security iac test ${filePath} --org=${W3SECURITY_ORG}`,
    );

    // Assert
    expect(stdout).toContain('Infrastructure as Code');
    expect(stdout).toContain('Test completed');
    expect(exitCode).toBeLessThan(2);
  });

  it('Share Results successfully and resolves with a non-error exit code', async () => {
    // Arrange
    const filePath = 'iac/depth_detection/root.tf';

    // Act
    const { stdout, exitCode } = await runWrapper(
      `w3security iac test ${filePath} --org=${W3SECURITY_ORG} --report`,
    );

    // Assert
    expect(stdout).toContain('Infrastructure as Code');
    expect(stdout).toContain('Test completed');
    expect(stdout).toContain('Report Complete');
    expect(stdout).toContain(
      `Your test results are available at: https://w3security.io/org/${W3SECURITY_ORG}/cloud/issues?environment_name=fixtures`,
    );
    expect(exitCode).toBeLessThan(2);
  });
});
