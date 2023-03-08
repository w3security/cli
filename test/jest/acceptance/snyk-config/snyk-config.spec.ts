import { runw3securityCLI } from '../../util/runw3securityCLI';
import { FakeServer, fakeServer } from '../../../acceptance/fake-server';
import { createProjectFromWorkspace } from '../../util/createProject';
import { isCLIV2 } from '../../util/isCLIV2';

jest.setTimeout(1000 * 60);

test('returns value in one line', async () => {
  const expectedToken = 'my-test-token';

  const { code, stdout } = await runw3securityCLI('config get api', {
    env: {
      ...process.env,
      W3SECURITY_CFG_API: expectedToken,
    },
  });
  expect(code).toEqual(0);
  expect(stdout).toEqual(expectedToken + '\n');
});

describe('w3security config set endpoint', () => {
  let server: FakeServer;
  const port = process.env.PORT || process.env.W3SECURITY_PORT || '12345';
  const baseApi = '/api';
  const token = '123456789';

  beforeAll((done) => {
    server = fakeServer(baseApi + '/v1', token);
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

  it('set and use endpoint', async () => {
    const env = {
      ...process.env,
      W3SECURITY_TOKEN: token,
      W3SECURITY_HTTP_PROTOCOL_UPGRADE: '0',
    };

    delete env['W3SECURITY_API'];

    // ensure that we start from scratch
    const requestCount0 = server.getRequests().length;
    expect(requestCount0).toEqual(0);

    // set endpoint
    const endpoint = 'http://127.0.0.1:' + server.getPort() + baseApi;
    const resultconfigSet = await runw3securityCLI(
      'config set endpoint=' + endpoint + ' -d',
      {
        env: env,
      },
    );
    expect(resultconfigSet.code).toEqual(0);

    // run a tests against the endpoint
    const project = await createProjectFromWorkspace('npm-package');

    const resultTest = await runw3securityCLI(
      'test --debug --org=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      {
        cwd: project.path(),
        env: env,
      },
    );
    expect(resultTest.code).toEqual(0);
    expect(resultTest.stderr).toContain(endpoint);
    expect(resultTest.stderr).not.toContain('w3security.io');

    const requestCount1 = server.getRequests().length;
    expect(requestCount1).toBeGreaterThan(requestCount0);

    if (isCLIV2()) {
      // generate an sbom against the endpoint
      const resultSBOM = await runw3securityCLI(
        `sbom --experimental --debug --org aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee --format cyclonedx1.4+json`,
        {
          env: env,
        },
      );
      expect(resultSBOM.code).toEqual(0);
      expect(resultSBOM.stderr).toContain(endpoint);
      expect(resultSBOM.stderr).not.toContain('w3security.io');

      const requestCount2 = server.getRequests().length;
      expect(requestCount2).toBeGreaterThan(requestCount1);
    }

    await runw3securityCLI('config unset endpoint');
  });
});
