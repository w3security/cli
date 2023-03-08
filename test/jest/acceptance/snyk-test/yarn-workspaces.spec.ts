import { createProjectFromWorkspace } from '../../util/createProject';
import { runw3securityCLI } from '../../util/runw3securityCLI';
import { fakeServer } from '../../../acceptance/fake-server';

jest.setTimeout(1000 * 60);

describe('w3security test --yarn-workspaces (mocked server only)', () => {
  let server;
  let env: Record<string, string>;

  beforeAll((done) => {
    const port = process.env.PORT || process.env.W3SECURITY_PORT || '12345';
    const baseApi = '/api/v1';
    env = {
      ...process.env,
      W3SECURITY_API: 'http://localhost:' + port + baseApi,
      W3SECURITY_HOST: 'http://localhost:' + port,
      W3SECURITY_TOKEN: '123456789',
      W3SECURITY_DISABLE_ANALYTICS: '1',
    };
    server = fakeServer(baseApi, env.W3SECURITY_TOKEN);
    server.listen(port, () => {
      done();
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    server.restore();
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  test('`test yarn-out-of-sync` out of sync fails by default', async () => {
    const project = await createProjectFromWorkspace(
      'yarn-workspace-out-of-sync',
    );

    const { code, stdout, stderr } = await runw3securityCLI(
      'test --yarn-workspaces',
      {
        cwd: project.path(),
        env,
      },
    );

    expect(code).toEqual(2);

    expect(stdout).toMatch(
      'Your package.json and yarn.lock are probably out of sync',
    );
    expect(stderr).toEqual('');
  });
  test('`test yarn-out-of-sync` out of sync succeeds', async () => {
    const project = await createProjectFromWorkspace(
      'yarn-workspace-out-of-sync',
    );

    const { code, stdout, stderr } = await runw3securityCLI(
      'test --yarn-workspaces --strict-out-of-sync=false',
      {
        cwd: project.path(),
        env,
      },
    );
    expect(code).toEqual(0);

    expect(stdout).toMatch('Tested 3 projects, no vulnerable paths were found');
    expect(stderr).toEqual('');
  });

  test('`test empty --yarn-workspaces`', async () => {
    const project = await createProjectFromWorkspace('empty');

    const { code, stdout, stderr } = await runw3securityCLI(
      'test --yarn-workspaces',
      {
        cwd: project.path(),
        env,
      },
    );
    expect(code).toEqual(3);

    expect(stdout).toMatch('Could not detect supported target files');
    expect(stderr).toEqual('');
  });
});
