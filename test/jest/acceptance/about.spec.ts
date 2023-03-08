import { runw3securityCLI } from '../util/runw3securityCLI';

describe('--about', () => {
  it('prints open source attribution information', async () => {
    const { code, stdout } = await runw3securityCLI(`--about`);

    expect(code).toBe(0);
    expect(stdout).toContain('w3security CLI Open Source Attributions');
    expect(stdout).toContain('MIT');
    expect(stdout).toContain('John-David Dalton'); // lodash author
  });
});
