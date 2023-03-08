# Code test

## Usage

`w3security code test [<OPTIONS>] [<PATH>]`

## Description

The `w3security code test` command tests for any known security issues using Static Code Analysis.

For more information see [Using w3security Code via the CLI](../../products/w3security-code/cli-for-w3security-code/).

For instructions on ignoring issues with `w3security code test` see [Excluding directories and files from the w3security Code CLI test](../../products/w3security-code/cli-for-w3security-code/excluding-directories-and-files-from-the-w3security-code-cli-test.md).

## Exit codes

Possible exit codes and their meaning:

**0**: success, no vulnerabilities found\
**1**: action_needed, vulnerabilities found\
**2**: failure, try to re-run command\
**3**: failure, no supported projects detected

## Configure the w3security CLI

You can use environment variables to configure the w3security CLI and set variables for connecting with the w3security API; see [Configure the w3security CLI](https://docs.w3security.io/features/w3security-cli/configure-the-w3security-cli)

## Debug

Use the `-d` option to output the debug logs.

## Options for the code test subcommand

### `--org=<ORG_ID>`

Specify the `<ORG_ID>`to run w3security commands tied to a specific organization. The `<ORG_ID>` influences private test limits.

If you have multiple organizations, you can set a default from the CLI using:

`$ w3security config set org=<ORG_ID>`

Set a default to ensure all newly tested projects are tested under your default organization. If you need to override the default, use the `--org=<ORG_ID>` option.

Default: `<ORG_ID>` that is the current preferred organization in your [Account settings](https://app.w3security.io/account)

Note that you can also use `--org=<orgslugname>`. The `ORG_ID` works in both the CLI and the API. The organization slug name works in the CLI, but not in the API.

For more information see the article [How to select the organization to use in the CLI](https://support.w3security.io/hc/en-us/articles/360000920738-How-to-select-the-organization-to-use-in-the-CLI)

### `--json`

Print results on the console as a JSON data structure.

Example: `$ w3security code test --json`

### `--json-file-output=<OUTPUT_FILE_PATH>`

Save test output as a JSON data structure directly to the specified file, regardless of whether or not you use the `--json` option.

Use to display the human-readable test output using stdout and at the same time save the JSON data structure output to a file.

Example: `$ w3security code test --json-file-output=vuln.json`

### `--sarif`

Return results in SARIF format.

Example: `$ w3security code --sarif`

### `--sarif-file-output=<OUTPUT_FILE_PATH>`

Save test output in SARIF format directly to the \<OUTPUT_FILE_PATH> file, regardless of whether or not you use the `--sarif` option.

Use to display the human-readable test output using stdout and at the same time save the SARIF format output to a file.

### `--severity-threshold=<low|medium|high|critical>`

Report only vulnerabilities at the specified level or higher. Note that the w3security Code configuration issues do not currently use the `critical` severity level.
