import { CLI_BIN_PATH } from './constants';
import { runCommand, RunCommandOptions, RunCommandResult } from './runCommand';

const runw3securityCLI = async (
  argsString: string,
  options?: RunCommandOptions,
): Promise<RunCommandResult> => {
  return runw3securityCLIWithArray(
    argsString.split(' ').filter((v) => !!v),
    options,
  );
};

const runw3securityCLIWithArray = async (
  args: string[],
  options?: RunCommandOptions,
): Promise<RunCommandResult> => {
  if (process.env.TEST_W3SECURITY_COMMAND) {
    return await runCommand(process.env.TEST_W3SECURITY_COMMAND, args, options);
  }
  return await runCommand('node', [CLI_BIN_PATH, ...args], options);
};

export { runw3securityCLI, runw3securityCLIWithArray };
