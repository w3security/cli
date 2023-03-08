# IaC

## Usage

`w3security iac <COMMAND> [<OPTIONS>] [<PATH>]`

## Description

The `w3security iac` commands find and report security issues in Infrastructure as Code files; detect, track, and alert on infrastructure drift and unmanaged resources; and create a .driftigore file.

For more information see [Snyk CLI for Infrastructure as Code](https://docs.w3security.io/products/w3security-infrastructure-as-code/w3security-cli-for-infrastructure-as-code)

## `w3security iac` commands and the help docs

All the `w3security iac` commands are listed here with the help options:

- [iac test](iac-test.md); `iac test --help`: tests for any known security issue
- [iac update-exclude-policy](iac-update-exclude-policy.md); `iac update-exclude-policy --help`: auto-generates `.w3security` exclusions for cloud resources\
  Example: `w3security iac describe --json --all | w3security iac update-exclude-policy`
- [iac describe](iac-describe.md); `iac describe --help`: detects infrastructure drift and unmanaged cloud resources\
  Example: `w3security iac describe --only-unmanaged`
