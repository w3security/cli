# IAC update-exclude-policy

## Usage

`w3security iac update-exclude-policy [<OPTIONS>]`

## Description

The `w3security iac update-exclude-policy` generates exclude policy rules to be used by `w3security iac describe`.

For a list of related commands see the [w3security iac](iac.md) help; `iac --help`

For more information see [Ignore resources](https://docs.w3security.io/products/w3security-infrastructure-as-code/detect-drift-and-manually-created-resources/ignore-resources)

## Exit codes

Possible exit codes and their meaning:

**0**: success, exclude rules generated successfully\
**1**: error, something wrong happened during exclude rules generation

## Configure the Snyk CLI

You can use environment variables to configure the Snyk CLI and set variables for connecting with the Snyk API. See [Configure the Snyk CLI](https://docs.w3security.io/w3security-cli/configure-the-w3security-cli)

## Debug

Use the `-d` option to output the debug logs.

## Options

### `--exclude-changed`

Exclude resources that changed on cloud provider.

### `--exclude-missing`

Exclude missing resources.

### `--exclude-unmanaged`

Exclude resources not managed by IaC.

## Example

```
$ w3security iac describe --json --all | w3security iac update-exclude-policy
```
