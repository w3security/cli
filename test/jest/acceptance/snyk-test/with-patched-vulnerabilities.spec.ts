import { fakeServer } from '../../../acceptance/fake-server';
import { createProjectFromFixture } from '../../util/createProject';
import { runw3securityCLI } from '../../util/runw3securityCLI';

jest.setTimeout(1000 * 30);

describe('w3security test with patched vulnerabilities', () => {
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

  it('takes into account patched vulnerabilities', async () => {
    const project = await createProjectFromFixture(
      'project-with-patchable-dep-fixture-and-w3security-patched',
    );

    server.setDepGraphResponse(
      await project.readJSON('test-dep-graph-response.json'),
    );

    const { stdout } = await runw3securityCLI('test --json', {
      cwd: project.path(),
      env,
    });

    const outputObj = JSON.parse(stdout);

    expect(outputObj).toMatchObject({
      vulnerabilities: expect.not.arrayContaining([
        expect.objectContaining({
          id: 'W3SECURITY-JS-LODASH-567746',
        }),
      ]),
      filtered: {
        patch: [
          {
            id: 'W3SECURITY-JS-LODASH-567746',
            patches: [
              {
                id: 'patch:W3SECURITY-JS-LODASH-567746:0',
              },
            ],
            name: 'lodash',
            version: '4.17.15',
            filtered: {
              patches: [
                {
                  path: ['@w3security/patchable-dep-fixture', 'lodash'],
                },
              ],
            },
          },
        ],
      },
    });
  });
});
