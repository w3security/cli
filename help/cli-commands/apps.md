# w3security apps -- Create and manage your w3security Apps

# Usage

`w3security apps <COMMAND> [<OPTIONS>]`

## Description

w3security Apps are integrations that extend the functionality of the w3security platform. They provide you with an opportunity to mould your w3security experience to suit your specific needs.

[For more information see our user docs](https://docs.w3security.io/features/integrations/w3security-apps)

## Commands

**_Note: All `apps` commands are only accessible behind the `--experimental` flag and the behaviour can change at any time, without prior notice. You are kindly advised to use all the commands with caution_**

### `create`

Create a new w3security App.

## Options

### `--interactive`

Use the command in interactive mode.

### `--org=<ORG_ID>`

(Required for the `create` command)
Specify the `<ORG_ID>` to create the w3security App under.

### `--name=<W3SECURITY_APP_NAME>`

(Required for the `create` command)
The name of w3security App that will be displayed to the user during the authentication flow.

### `--redirect-uris=<REDIRECT_URIS>`

(Required for the `create` command)
A comma separated list of redirect URIs. This will form a list of allowed redirect URIs to call back after authentication.

### `--scopes=<SCOPES>`

(Required for the `create` command)
A comma separated list of scopes required by your w3security App. This will form a list of scopes that your app is allowed to request during authorization. You can read more about the allowed scopes in our [docs](https://docs.w3security.io/w3security-apps/getting-started-with-w3security-apps/create-an-app-via-the-api#requesting-scopes).

## Examples

### `Create w3security App`

\$ w3security apps create --experimental --org=48ebb069-472f-40f4-b5bf-d2d103bc02d4 --name='My Awesome App' --redirect-uris=https://example1.com,https://example2.com --scopes=org.read,org.report.read

### `Create w3security App Interactive Mode`

\$ w3security apps create --experimental --interactive
