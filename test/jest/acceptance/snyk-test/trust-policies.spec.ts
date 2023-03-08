import { createProject } from '../../util/createProject';
import { runw3securityCLI } from '../../util/runw3securityCLI';
import { fakeServer } from '../../../acceptance/fake-server';

jest.setTimeout(1000 * 60);

describe('trust policies', () => {
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
    server.restore();
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  test('`w3security test` detects suggested ignore policies', async () => {
    const project = await createProject('qs-package');
    server.setDepGraphResponse(
      await project.readJSON('test-dep-graph-result.json'),
    );

    const { code, stdout } = await runw3securityCLI('test', {
      cwd: project.path(),
      env,
    });

    expect(code).toEqual(1);
    expect(stdout).toMatch(
      'suggests ignoring this issue, with reason: test trust policies',
    );
    expect(stdout).toMatch('npm:hawk:20160119');
    expect(stdout).toMatch('npm:request:20160119');
  });

  test('`w3security test --trust-policies` applies suggested ignore policies', async () => {
    const project = await createProject('qs-package');
    server.setDepGraphResponse(
      await project.readJSON('test-dep-graph-result-trust-policies.json'),
    );

    const { code, stdout } = await runw3securityCLI('test --trust-policies', {
      cwd: project.path(),
      env,
    });

    expect(code).toEqual(1);
    expect(stdout).not.toMatch(
      'suggests ignoring this issue, with reason: test trust policies',
    );
    expect(stdout).not.toMatch('npm:hawk:20160119');
    expect(stdout).not.toMatch('npm:request:20160119');
  });
});
