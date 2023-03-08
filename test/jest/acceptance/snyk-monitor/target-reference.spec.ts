import { runw3securityCLI } from '../../util/runw3securityCLI';
import { fakeServer } from '../../../acceptance/fake-server';
import { createProjectFromWorkspace } from '../../util/createProject';

jest.setTimeout(1000 * 60);

describe('--target-reference', () => {
  let server: ReturnType<typeof fakeServer>;
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
      DEBUG: 'w3security*',
    };
    server = fakeServer(baseApi, env.W3SECURITY_TOKEN);
    server.listen(port, () => {
      done();
    });
  });

  afterEach(() => {
    server.restore();
  });

  afterAll((done) => {
    server.close(() => done());
  });

  it('forwards value to monitor endpoint', async () => {
    const project = await createProjectFromWorkspace('fail-on/no-vulns');
    const { code } = await runw3securityCLI(
      'monitor --target-reference=test-target-ref',
      {
        env,
        cwd: project.path(),
      },
    );
    expect(code).toEqual(0);

    const monitorRequests = server
      .getRequests()
      .filter((request) => request.url?.includes('/monitor/'));

    expect(monitorRequests.length).toBeGreaterThanOrEqual(1);
    monitorRequests.forEach((request) => {
      expect(request).toMatchObject({
        body: {
          targetReference: 'test-target-ref',
        },
      });
    });
  });

  it('forwards value to test endpoint', async () => {
    const project = await createProjectFromWorkspace('fail-on/no-vulns');
    const { code } = await runw3securityCLI(
      'test --target-reference=test-target-ref',
      {
        env,
        cwd: project.path(),
      },
    );
    expect(code).toEqual(0);

    const testRequests = server
      .getRequests()
      .filter((request) => request.url?.includes('/test-dep-graph'));

    expect(testRequests.length).toBeGreaterThanOrEqual(1);
    testRequests.forEach((request) => {
      expect(request).toMatchObject({
        body: {
          targetReference: 'test-target-ref',
        },
      });
    });
  });
});
