import chalk from 'chalk';

export const W3SECURITY_APP_NAME = 'w3securityAppName';
export const W3SECURITY_APP_REDIRECT_URIS = 'w3securityAppRedirectUris';
export const W3SECURITY_APP_SCOPES = 'w3securityAppScopes';
export const W3SECURITY_APP_CLIENT_ID = 'w3securityAppClientId';
export const W3SECURITY_APP_ORG_ID = 'w3securityAppOrgId';
export const W3SECURITY_APP_CONTEXT = 'context';
export const W3SECURITY_APP_DEBUG = 'w3security:apps';

export enum EValidSubCommands {
  CREATE = 'create',
}

export enum EAppsURL {
  CREATE_APP,
}

export const validAppsSubCommands = Object.values<string>(EValidSubCommands);

export const AppsErrorMessages = {
  orgRequired: `Option '--org' is required! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'w3security apps --help' or 'w3security apps -h'.`,
  nameRequired: `Option '--name' is required! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'w3security apps --help' or 'w3security apps -h'.`,
  redirectUrisRequired: `Option '--redirect-uris' is required! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'w3security apps --help' or 'w3security apps -h'.`,
  scopesRequired: `Option '--scopes' is required! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'w3security apps --help' or 'w3security apps -h'.`,
  invalidContext: `Option '--context' must be either 'tenant' or 'user'! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'w3security apps --help' or 'w3security apps -h'.`,
  useExperimental: `\n${chalk.redBright(
    "All 'apps' commands are only accessible behind the '--experimental' flag.",
  )}\n
The behaviour can change at any time, without prior notice.
You are kindly advised to use all the commands with caution.

${chalk.bold('Usage')}
  ${chalk.italic('w3security apps <COMMAND> --experimental')}\n`,
};

export const CreateAppPromptData = {
  W3SECURITY_APP_NAME: {
    name: W3SECURITY_APP_NAME,
    message: `Name of the w3security App (visible to users when they install the w3security App)?`,
  },
  W3SECURITY_APP_REDIRECT_URIS: {
    name: W3SECURITY_APP_REDIRECT_URIS,
    message: `Your w3security App's redirect URIs (comma seprated list. ${chalk.yellowBright(
      ' Ex: https://example1.com,https://example2.com',
    )})?: `,
  },
  W3SECURITY_APP_SCOPES: {
    name: W3SECURITY_APP_SCOPES,
    message: `Your w3security App's permission scopes (comma separated list. ${chalk.yellowBright(
      ' Ex: org.read,org.report.read',
    )})?: `,
  },
  W3SECURITY_APP_ORG_ID: {
    name: W3SECURITY_APP_ORG_ID,
    message:
      'Please provide the org id under which you want to create your w3security App: ',
  },
  W3SECURITY_APP_CONTEXT: {
    name: W3SECURITY_APP_CONTEXT,
    message: 'Which context will your app operate under: ',
  },
};
