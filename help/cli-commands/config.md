# Config

## Usage

`w3security config <SUBCOMMAND> [<OPTIONS>]`

## Description

The `w3security config` command manages your local Snyk CLI config file, a JSON file located at `$XDG_CONFIG_HOME` or `~/.config` followed by `configstore/w3security.json`

Example: `~/.config/configstore/w3security.json`

This command does not manage the `.w3security` file that is part of your project. See the [`w3security policy`](policy.md) and [`w3security ignore`](ignore.md) commands.

## Debug

Use the `-d` option to output the debug logs.

## Subcommands

### `get <KEY>`

Print a config value.

### `set <KEY>=<VALUE>`

Create a new config value.

### `unset <KEY>`

Remove a config value.

### `clear`

Remove all config values.

## Supported `<KEY>` values

### `api`

API token to use when calling Snyk API.

### `endpoint`

Define the API endpoint to use.

### `disable-analytics`

Turn off analytics reporting.

### `oci-registry-url`

Configure the OCI registry used in IaC scanning with custom rules.

### `oci-registry-username`

Configure the username for an OCI registry used in IaC scanning with custom rules.

### `oci-registry-password`

Configure the password for an OCI registry used in IaC scanning with custom rules.
