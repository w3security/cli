import * as os from 'os';
import { startw3securityCLI, TestCLI } from '../../util/startw3securityCLI';

describe('w3security container', () => {
  if (os.platform() === 'win32') {
    // eslint-disable-next-line jest/no-focused-tests
    it.only('Windows not yet supported', () => {
      console.warn(
        "Skipping as we don't have a Windows-compatible image to test against.",
      );
    });
  }

  let cli: TestCLI | null = null;

  afterEach(async () => {
    if (cli) {
      await cli.stop();
      cli = null;
    }
  });

  it('finds dependencies in rpm sqlite databases', async () => {
    cli = await startw3securityCLI(
      'container test amazonlinux:2022.0.20220504.1 --print-deps',
    );
    await expect(cli).toDisplay(`yum @ 4.9.0`, { timeout: 20 * 1000 });
  });
});
