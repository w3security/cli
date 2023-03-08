import { fakeServer } from '../../acceptance/fake-server';
import { createProjectFromWorkspace } from '../util/createProject';
import { runSnykCLI } from '../util/runSnykCLI';

jest.setTimeout(1000 * 60);

describe('OAuth Token', () => {
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

  it('uses oauth token for authorised requests when testing projects', async () => {
    const project = await createProjectFromWorkspace('fail-on/no-vulns');
    server.setDepGraphResponse(await project.readJSON('vulns-result.json'));

    const { code } = await runSnykCLI(`test --json`, {
      cwd: project.path(),
      env,
    });

    expect(code).toEqual(0);

    expect(server.getRequests().length).toBeGreaterThanOrEqual(1);
    server.getRequests().forEach((request) => {
      expect(request).toMatchObject({
        headers: {
          authorization: 'Bearer oauth-jwt-token',
        },
      });
    });
  });

  it('uses oauth token for authorised requests when monitoring projects', async () => {
    const project = await createProjectFromWorkspace('fail-on/no-vulns');
    server.setDepGraphResponse(await project.readJSON('vulns-result.json'));

    const { code } = await runSnykCLI(`monitor --json`, {
      cwd: project.path(),
      env,
    });

    expect(code).toEqual(0);
    expect(server.getRequests().length).toBeGreaterThanOrEqual(1);
    server.getRequests().forEach((request) => {
      expect(request).toMatchObject({
        headers: {
          authorization: 'Bearer oauth-jwt-token',
        },
      });
    });
  });
});
