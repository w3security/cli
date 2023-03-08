import * as path from 'path';
import { fakeServer } from '../../../acceptance/fake-server';
import { createProjectFromFixture } from '../../util/createProject';
import { runw3securityCLI } from '../../util/runw3securityCLI';

jest.setTimeout(1000 * 60);

describe('`w3security test` with `--file=`', () => {
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

  describe('without `.w3security` file', () => {
    it('policy field is empty in payload when using relative path', async () => {
      const project = await createProjectFromFixture(
        'npm/with-vulnerable-lodash-dep',
      );
      server.setDepGraphResponse(
        await project.readJSON('test-dep-graph-result.json'),
      );

      const cwd = __dirname;
      const relPath = path.relative(
        cwd,
        path.join(project.path(), 'package-lock.json'),
      );

      const { stdout } = await runw3securityCLI(`test --file=${relPath}`, {
        cwd,
        env,
      });

      const testDepGraphRequest = server.getRequests()[0];
      expect(testDepGraphRequest.body.policy).not.toBeDefined();
      expect(stdout).toContain('W3SECURITY-JS-LODASH-590103');
    });

    it('policy field is empty in payload when using absolute path', async () => {
      const project = await createProjectFromFixture(
        'npm/with-vulnerable-lodash-dep',
      );
      server.setDepGraphResponse(
        await project.readJSON('test-dep-graph-result.json'),
      );

      const absPath = path.resolve(project.path(), 'package-lock.json');

      const { stdout } = await runw3securityCLI(`test --file=${absPath}`, {
        cwd: __dirname,
        env,
      });

      const testDepGraphRequest = server.getRequests()[0];
      expect(testDepGraphRequest.body.policy).not.toBeDefined();
      expect(stdout).toContain('W3SECURITY-JS-LODASH-590103');
    });
  });

  describe('with `.w3security` file', () => {
    it('picks up the `.w3security` file when using relative path', async () => {
      const project = await createProjectFromFixture(
        'npm/with-vulnnerable-lodash-and-w3security-file',
      );
      server.setDepGraphResponse(
        await project.readJSON('test-dep-graph-result.json'),
      );

      const cwd = __dirname;
      const relPath = path.relative(
        cwd,
        path.join(project.path(), 'package-lock.json'),
      );

      const { stdout } = await runw3securityCLI(`test --file=${relPath}`, {
        cwd,
        env,
      });

      // check that we're including the policy file in the request and that the policy
      // includes the ignored vuln id from the .w3security file
      const testDepGraphRequest = server.getRequests().find((value) => {
        return value.url == '/api/v1/test-dep-graph?org=';
      });
      expect(testDepGraphRequest.body.policy).toBeDefined();
      expect(testDepGraphRequest.body.policy).toContain(
        'W3SECURITY-JS-LODASH-590103',
      );
      expect(stdout).not.toContain('W3SECURITY-JS-LODASH-590103');
    });

    it('picks up the `.w3security` file when using absolute path', async () => {
      const project = await createProjectFromFixture(
        'npm/with-vulnnerable-lodash-and-w3security-file',
      );
      server.setDepGraphResponse(
        await project.readJSON('test-dep-graph-result.json'),
      );

      const absPath = path.resolve(project.path(), 'package-lock.json');

      const { stdout } = await runw3securityCLI(`test --file=${absPath}`, {
        cwd: __dirname,
        env,
      });

      // check that we're including the policy file in the request and that the policy
      // includes the ignored vuln id from the .w3security file
      const testDepGraphRequest = server.getRequests().find((value) => {
        return value.url == '/api/v1/test-dep-graph?org=';
      });
      expect(testDepGraphRequest.body.policy).toBeDefined();
      expect(testDepGraphRequest.body.policy).toContain(
        'W3SECURITY-JS-LODASH-590103',
      );
      expect(stdout).not.toContain('W3SECURITY-JS-LODASH-590103');
    });
  });
});
