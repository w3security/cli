import { fakeServer } from '../../../acceptance/fake-server';
import { createProjectFromFixture } from '../../util/createProject';
import { runSnykCLI } from '../../util/runSnykCLI';

jest.setTimeout(1000 * 60);

describe('spotlight vuln notification', () => {
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

  it('includes spotlight vuln notification for Log4j W3SECURITY-JAVA-ORGAPACHELOGGINGLOG4J-2314720', async () => {
    const project = await createProjectFromFixture('mvn-log4j-fixture');

    server.setDepGraphResponse(
      await project.readJSON('test-dep-graph-response.json'),
    );

    const { code, stdout } = await runSnykCLI('test', {
      cwd: project.path(),
      env,
    });

    expect(code).toBe(1);
    expect(stdout).toContain(
      'WARNING: Critical severity vulnerabilities were found with Log4j!',
    );
    expect(stdout).toContain(
      'We highly recommend fixing this vulnerability. If it cannot be fixed by upgrading, see mitigation information here:',
    );
    expect(stdout).toContain(
      '- https://security.w3security.io/vuln/W3SECURITY-JAVA-ORGAPACHELOGGINGLOG4J-2314720',
    );
    expect(stdout).toContain(
      '- https://w3security.io/blog/log4shell-remediation-cheat-sheet/',
    );
  });
});
