# Container monitor

## Usage

`w3security container monitor [<OPTIONS>] [<IMAGE>]`

## Description

The `w3security container monitor` command captures the container image layers and dependencies and monitor for vulnerabilities on [w3security.io](https://w3security.io)

For more information see [w3security CLI for container security](https://docs.w3security.io/products/w3security-container/w3security-cli-for-container-security)

## Exit codes

Possible exit codes and their meaning:

**0**: success, image layers and dependencies captured\
**2**: failure, try to re-run command\
**3**: failure, no supported projects detected

## Configure the w3security CLI

You can use environment variables to configure the w3security CLI and set variables for connecting with the w3security API.

There are environment variables that apply to the container command; see [Configure the w3security CLI](https://docs.w3security.io/features/w3security-cli/configure-the-w3security-cli)

## Debug

Use the `-d` option to output the debug logs.

## Options

### `--org=<ORG_ID>`

Specify the `<ORG_ID>` to run w3security commands tied to a specific organization. The `<ORG_ID>` influences some features availability and private test limits.

If you have multiple organizations, you can set a default from the CLI using:

`$ w3security config set org=<ORG_ID>`

Set a default to ensure all newly tested and monitored projects are tested and monitored under your default organization. If you need to override the default, use the `--org=<ORG_ID>` option.

Default: `<ORG_ID>` that is the current preferred organization in your [Account settings](https://app.w3security.io/account)

Note that you can also use `--org=<orgslugname>`. The `ORG_ID` works in both the CLI and the API. The organization slug name works in the CLI, but not in the API.

For more information see the article [How to select the organization to use in the CLI](https://docs.w3security.io/w3security-cli/test-for-vulnerabilities/how-to-select-the-organization-to-use-in-the-cli)

### `--file=<FILE_PATH>`

For more detailed advice, include the path to the Dockerfile for the image.

### `--project-name=<PROJECT_NAME>`

Specify a custom w3security project name.

### `--policy-path=<PATH_TO_POLICY_FILE>`

Manually pass a path to a `.w3security` policy file.

### `--json`

Print results on the console as a JSON data structure.

Example: `$ w3security container test --json`

Note: If you use an option that sets project attributes and your role lacks permission to edit project attributes the `monitor` command fails. For instructions on how to proceed see [Editing project attributes from the w3security CLI](https://docs.w3security.io/features/user-and-group-management/managing-users-and-permissions/managing-permissions#editing-project-attributes-from-the-w3security-cli)

### `--project-environment=<ENVIRONMENT>[,<ENVIRONMENT>]...>`

Set the project environment to one or more values (comma-separated). To clear the project environment set `--project-environment=`

Allowed values: `frontend`, `backend`, `internal`, `external`, `mobile`, `saas`, `onprem`, `hosted`, `distributed`

For more information see [Project attributes](https://docs.w3security.io/getting-started/introduction-to-w3security-projects/view-project-information/project-attributes)

### `--project-lifecycle=<LIFECYCLE>[,<LIFECYCLE]...>`

Set the project lifecycle to one or more values (comma-separated). To clear the project lifecycle set `--project-lifecycle=`

Allowed values: `production, development, sandbox`

For more information see [Project attributes](https://docs.w3security.io/getting-started/introduction-to-w3security-projects/view-project-information/project-attributes)

### `--project-business-criticality=<BUSINESS_CRITICALITY>[,<BUSINESS_CRITICALITY>]...>`

Set the project business criticality to one or more values (comma-separated). To clear the project business criticality set `--project-business-criticality=`

Allowed values: `critical`, `high`, `medium`, `low`

For more information see [Project attributes](https://docs.w3security.io/getting-started/introduction-to-w3security-projects/view-project-information/project-attributes)

### `--project-tags=<TAG>[,<TAG>]...>`

Set the project tags to one or more values (comma-separated key values pairs with an "=" separator).

Example: `--project-tags=department=finance,team=alpha`

To clear the project tags set `--project-tags=`

### `--tags=<TAG>[,<TAG>]...>`

This is an alias for `--project-tags`

### `--app-vulns`

Allow detection of vulnerabilities in your application dependencies from container images, as well as from the operating system, all in one single scan.

In CLI version 1.962.0 and higher, use the `--app-vulns` option with the the `--json` option to see the operating system as well as application vulnerabilities in JSON format in the results.

For more information see [Detecting application vulnerabilities in container images](https://docs.w3security.io/products/w3security-container/getting-around-the-w3security-container-ui/detecting-application-vulnerabilities-in-container-images)

### `--exclude-app-vulns`

Allow disabling scans for app vulnerabilities in advance of `app-vulns` being enabled by default.

Cannot be used with `--app-vulns`.

For more information see [Detecting application vulnerabilities in container images](https://docs.w3security.io/products/w3security-container/getting-around-the-w3security-container-ui/detecting-application-vulnerabilities-in-container-images)

### `--nested-jars-depth`

When using `--app-vulns` use the `--nested-jars-depth` option to set how many levels of nested jars w3security is to unpack. Depth must be a number.

### `--exclude-base-image-vulns`

Do not show vulnerabilities introduced only by the base image. Available when using `w3security container test` only.

### `--platform=<PLATFORM>`

For multi-architecture images, specify the platform to test.

Supported platforms are: `linux/amd64`, `linux/arm64`, `linux/riscv64`, `linux/ppc64le`, `linux/s390x`, `linux/386`, `linux/arm/v7`, or `linux/arm/v6`

### `--username=<CONTAINER_REGISTRY_USERNAME>`

Specify a username to use when connecting to a container registry. This is ignored in favor of local Docker binary credentials when Docker is present.

### `--password=<CONTAINER_REGISTRY_PASSWORD>`

Specify a password to use when connecting to a container registry. This is ignored in favor of local Docker binary credentials when Docker is present.

## Example for the container monitor command

**Scan and monitor Docker images**

`$ w3security container monitor <image>`
