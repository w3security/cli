import { fakeServer } from '../../../acceptance/fake-server';
import { runw3securityCLI } from '../../util/runw3securityCLI';
import { createProjectFromWorkspace } from '../../util/createProject';

jest.setTimeout(1000 * 60);
describe('w3security fix', () => {
  let server: ReturnType<typeof fakeServer>;
  let env: Record<string, string>;

  beforeAll((done) => {
    const apiPath = '/api/v1';
    const apiPort = process.env.PORT || process.env.W3SECURITY_PORT || '12345';
    env = {
      ...process.env,
      W3SECURITY_API: 'http://localhost:' + apiPort + apiPath,
      W3SECURITY_OAUTH_TOKEN: 'oauth-jwt-token',
      W3SECURITY_DISABLE_ANALYTICS: '1',
    };

    server = fakeServer(apiPath, env.W3SECURITY_TOKEN);
    server.listen(apiPort, () => done());
  });

  afterEach(() => {
    server.restore();
  });

  afterAll((done) => {
    server.close(() => done());
  });

  it('succeeds when there are no vulns to fix', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    const { code, stdout, stderr } = await runw3securityCLI('fix', {
      cwd: project.path(),
      env,
    });
    expect(code).toBe(0);
    expect(stdout).toMatch('No vulnerable items to fix');
    expect(stderr).toBe('');
  });

  it('fails when FF is not enabled', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    const { code, stdout, stderr } = await runw3securityCLI('fix --org=no-flag', {
      cwd: project.path(),
      env,
    });
    expect(code).toEqual(2);
    expect(stdout).toMatch(
      "`w3security fix` is not supported for org 'no-flag'.\nSee documentation on how to enable this beta feature: https://docs.w3security.io/w3security-cli/fix-vulnerabilities-from-the-cli/automatic-remediation-with-w3security-fix#enabling-w3security-fix",
    );
    expect(stderr).toBe('');
  });

  it('fails when called with --unmanaged', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    const { code, stdout, stderr } = await runw3securityCLI('fix --unmanaged', {
      cwd: project.path(),
      env,
    });
    expect(code).toEqual(2);
    expect(stdout).toMatch("`w3security fix` is not supported for ecosystem 'cpp'");
    expect(stderr).toBe('');
  });

  it('fails when called with --docker (deprecated)', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    const { code, stdout, stderr } = await runw3securityCLI('fix --docker', {
      cwd: project.path(),
      env,
    });
    expect(code).toEqual(2);
    expect(stdout).toMatch(
      "`w3security fix` is not supported for ecosystem 'docker'",
    );
    expect(stderr).toBe('');
  });

  it('fails when called with --code', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    const { code, stdout, stderr } = await runw3securityCLI('fix --code', {
      cwd: project.path(),
      env,
    });
    expect(code).toEqual(2);
    expect(stdout).toMatch("`w3security fix` is not supported for ecosystem 'code'");
    expect(stderr).toBe('');
  });

  it('fails when api requests fail', async () => {
    const project = await createProjectFromWorkspace('no-vulns');
    server.setNextStatusCode(500);
    const { code, stdout, stderr } = await runw3securityCLI(
      'fix --org=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      {
        cwd: project.path(),
        env,
      },
    );
    expect(code).toBe(2);
    expect(stdout).toMatch('No successful fixes');
    expect(stderr).toBe('');
  });
});
