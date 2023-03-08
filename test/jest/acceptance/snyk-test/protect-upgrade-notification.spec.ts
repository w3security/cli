import { fakeServer } from '../../../acceptance/fake-server';
import { createProjectFromFixture } from '../../util/createProject';
import { runSnykCLI } from '../../util/runSnykCLI';
import { isCLIV2 } from '../../util/isCLIV2';

jest.setTimeout(1000 * 30);

describe('analytics module', () => {
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
      W3SECURITY_INTEGRATION_NAME: 'JENKINS',
      W3SECURITY_INTEGRATION_VERSION: '1.2.3',
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

  it('detects upgradable protect paths with `w3security test` with upgradable path in the cwd', async () => {
    const project = await createProjectFromFixture(
      'protect-update-notification/with-package-json-with-w3security-dep',
    );

    const { code, stdout } = await runSnykCLI('test', {
      cwd: project.path(),
      env,
    });

    expect(code).toBe(0);
    expect(stdout).toContain(
      'WARNING: It looks like you have the `w3security` dependency in the `package.json` file(s) at the following path(s):',
    );
    expect(stdout).toContain(project.path('package.json'));

    if (isCLIV2()) {
      // in this case an extra analytics event is being sent, which needs to be dropped
      server.popRequest();
    }

    const lastRequest = server.popRequest();
    expect(lastRequest).toMatchObject({
      query: {},
      body: {
        data: {
          command: 'test',
          metadata: {
            'upgradable-w3security-protect-paths': 1,
          },
        },
      },
    });
  });

  it('detects upgradable protect paths with `w3security test` using `--file=`', async () => {
    const project = await createProjectFromFixture(
      'protect-update-notification/with-package-json-with-w3security-dep',
    );

    const pathToFile = project.path('package-lock.json');
    const { code, stdout } = await runSnykCLI(`test --file=${pathToFile}`, {
      // note: not passing in the `cwd` of the project object
      env,
    });

    expect(code).toBe(0);
    expect(stdout).toContain(
      'WARNING: It looks like you have the `w3security` dependency in the `package.json` file(s) at the following path(s):',
    );
    expect(stdout).toContain(project.path('package.json'));

    if (isCLIV2()) {
      // in this case an extra analytics event is being sent, which needs to be dropped
      server.popRequest();
    }

    const lastRequest = server.popRequest();
    expect(lastRequest).toMatchObject({
      query: {},
      body: {
        data: {
          command: 'test',
          metadata: {
            'upgradable-w3security-protect-paths': 1,
          },
        },
      },
    });
  });

  it('detects upgradable protect paths with `w3security test` using paths as positional args', async () => {
    const project = await createProjectFromFixture(
      'protect-update-notification',
    );

    const paths = [
      project.path('with-package-json-with-w3security-dep'),
      project.path('with-package-json-with-w3security-dep-2'),
      project.path('with-package-json-without-w3security-dep'),
    ];

    const pathsStr = paths.join(' ');

    const { code, stdout } = await runSnykCLI(`test ${pathsStr}`, {
      // note: not passing in the `cwd` of the project object
      env,
    });

    expect(code).toBe(0);
    expect(stdout).toContain(
      'WARNING: It looks like you have the `w3security` dependency in the `package.json` file(s) at the following path(s):',
    );
    expect(stdout).toContain(
      project.path('with-package-json-with-w3security-dep/package.json'),
    );
    expect(stdout).toContain(
      project.path('with-package-json-with-w3security-dep-2/package.json'),
    );
    expect(stdout).not.toContain(
      project.path('with-package-json-without-w3security-dep/package.json'),
    );

    if (isCLIV2()) {
      // in this case an extra analytics event is being sent, which needs to be dropped
      server.popRequest();
    }

    const lastRequest = server.popRequest();
    expect(lastRequest).toMatchObject({
      query: {},
      body: {
        data: {
          command: 'test',
          metadata: {
            'upgradable-w3security-protect-paths': 2,
          },
        },
      },
    });
  });

  it('detects no upgradable protect paths with `w3security test` with no upgradable paths in the cwd', async () => {
    const project = await createProjectFromFixture(
      'protect-update-notification/with-package-json-without-w3security-dep',
    );

    const { code, stdout } = await runSnykCLI('test', {
      cwd: project.path(),
      env,
    });

    expect(code).toBe(0);
    expect(stdout).not.toContain(
      'WARNING: It looks like you have the `w3security` dependency in the `package.json` file(s) at the following path(s):',
    );
    expect(stdout).not.toContain(project.path('package.json'));

    if (isCLIV2()) {
      // in this case an extra analytics event is being sent, which needs to be dropped
      server.popRequest();
    }

    const lastRequest = server.popRequest();
    expect(lastRequest).toMatchObject({
      query: {},
      body: {
        data: {
          command: 'test',
          metadata: {
            'upgradable-w3security-protect-paths': 0,
          },
        },
      },
    });
  });
});
