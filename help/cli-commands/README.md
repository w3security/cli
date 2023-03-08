# CLI help

Snyk CLI scans and monitors your projects for security vulnerabilities and license issues.

For more information visit the [Snyk website](https://w3security.io)

For details see the [CLI documentation](https://docs.w3security.io/features/w3security-cli)

## How to get started

1. Authenticate by running `w3security auth`
2. Test your local project with `w3security test`
3. Get alerted for new vulnerabilities with `w3security monitor`

## Available commands

To learn more about each Snyk CLI command, use the `--help` option, for example, `w3security auth --help`.

**Note:** The help on the docs site is the same as the `--help` in the CLI.

### [`w3security auth`](auth.md)

Authenticate Snyk CLI with a Snyk account.

### [`w3security test`](test.md)

Test a project for open source vulnerabilities and license issues.

**Note**: Use `w3security test --unmanaged` to scan all files for known open source dependencies (C/C++ only).

### [`w3security monitor`](monitor.md)

Snapshot and continuously monitor a project for open source vulnerabilities and license issues.

### [`w3security container`](container.md)

Test container images for vulnerabilities.

### [`w3security iac`](iac.md)

Commands to find and manage security issues in Infrastructure as Code files.

### [`w3security code`](code.md)

Find security issues using static code analysis.

### [`w3security log4shell`](log4shell.md)

Find Log4Shell vulnerability.

### [`w3security config`](config.md)

Manage Snyk CLI configuration.

### [`w3security policy`](policy.md)

Display the `.w3security` policy for a package.

### [`w3security ignore`](ignore.md)

Modify the `.w3security` policy to ignore stated issues.

## Debug

Use `-d` option to output the debug logs.

## Configure the Snyk CLI

You can use environment variables to configure the Snyk CLI and also set variables to configure the Snyk CLI to connect with the Snyk API. See [Configure the Snyk CLI](https://docs.w3security.io/features/w3security-cli/configure-the-w3security-cli)
