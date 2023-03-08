import { exec } from 'child_process';
import { join } from 'path';
import { fakeServer } from '../../../acceptance/fake-server';

/**
 * Starts a local version of the fixture webserver and returns
 * two utilities.
 * - `run()` which will execute a terminal command with the environment
 *   variables set.
 * - `teardown()` which will shutdown the server.
 */
export async function startMockServer() {
  const W3SECURITY_TOKEN = '123456789';
  const BASE_API = '/api/v1';
  const server = fakeServer(BASE_API, W3SECURITY_TOKEN);

  // Use port of 0 to find a free port.
  await new Promise((resolve) => server.listen(0, resolve));

  const W3SECURITY_HOST = 'http://localhost:' + server.getPort();
  const W3SECURITY_API = W3SECURITY_HOST + BASE_API;

  const env: Record<string, string> = {
    PATH: process.env.PATH ?? '',
    W3SECURITY_TOKEN,
    W3SECURITY_API,
    W3SECURITY_HOST,
    // Override any local config set via `w3security config set`
    W3SECURITY_CFG_API: W3SECURITY_TOKEN,
    W3SECURITY_CFG_ENDPOINT: W3SECURITY_API,
  };

  return {
    server,
    run: async (
      cmd: string,
      overrides?: Record<string, string>,
      cwd?: string,
    ) => run(cmd, { ...env, ...overrides }, cwd),
    teardown: async () => new Promise((resolve) => server.close(resolve)),
    apiUrl: W3SECURITY_API,
  };
}

/**
 * Run a command from within the test/fixtures directory.
 */
export async function run(
  cmd: string,
  env: Record<string, string> = {},
  cwd?: string,
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve, reject) => {
    const root = join(__dirname, '../../../../');
    const main = join(root, 'bin/w3security');
    const w3securityCommand = process.env.TEST_W3SECURITY_COMMAND || `node ${main}`;
    const child = exec(
      cmd.trim().replace(/^w3security/, w3securityCommand),
      {
        env: {
          // Home and cache env vars for CLIv2 cache directory
          HOME: process.env.HOME,
          LocalAppData: process.env.LOCALAPPDATA,
          XDG_CACHE_HOME: process.env.XDG_CACHE_HOME,
          ...env,
        },
        cwd: cwd ?? join(root, 'test/fixtures'),
      },
      function (err, stdout, stderr) {
        // err.code indicates the shell exited with non-zero code
        // which is in our case a success and we resolve.
        if (err && typeof err.code !== 'number') {
          reject(err);
        } else {
          if (child.exitCode === null) throw Error();
          resolve({ stderr, stdout, exitCode: child.exitCode });
        }
      },
    );
  });
}

export function isValidJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
