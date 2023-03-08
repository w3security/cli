# Test

## Usage

`w3security test [<OPTIONS>]`

## Description

The `w3security test` command checks projects for open source vulnerabilities and license issues. The test command tries to auto-detect supported manifest files with dependencies and test those.

## Exit codes

Possible exit codes and their meaning:

**0**: success, no vulnerabilities found\
**1**: action_needed, vulnerabilities found\
**2**: failure, try to re-run command\
**3**: failure, no supported projects detected

## Configure the w3security CLI

You can use environment variables to configure the w3security CLI and set variables for connecting with the w3security API. See [Configure the w3security CLI](https://docs.w3security.io/features/w3security-cli/configure-the-w3security-cli)

## Debug

Use the `-d` option to output the debug logs.

## Options

See also subsequent sections for options for specific build environments, package managers, languages, and `[<CONTEXT-SPECIFIC OPTIONS>]` which you specify last.

### `--all-projects`

Auto-detect all projects in the working directory (including Yarn workspaces).

For more information see the article [Does the w3security CLI support monorepos or multiple manifest files?](https://support.w3security.io/hc/en-us/articles/360000910577-Does-the-w3security-CLI-support-monorepos-or-multiple-manifest-files-)

If you see the invalid string length error, refer to [Invalid string length error when scanning projects](https://docs.w3security.io/w3security-cli/test-for-vulnerabilities/invalid-string-length-error-when-scanning-projects)

### `--fail-fast`

Use with `--all-projects` to cause scans to be interrupted when errors occur and to report these errors back to the user.

The exit code is 2 and the scan ends. No vulnerability information is reported for projects that did not produce errors.

To perform the scan, resolve the error and scan again.

Note: If you do not use `--fail-fast`, w3security scans all the projects but does not report any vulnerabilities for projects it could not scan due to misconfiguration or another error.

### `--detection-depth=<DEPTH>`

Use with `--all-projects` or `--yarn-workspaces` to indicate how many subdirectories to search. `DEPTH` must be a number, 1 or greater; zero (0) is the current directory.

Default: 4 , the current working directory (0) and 4 subdirectories.

Example: `--detection-depth=3` limits search to the specified directory (or the current directory if no `<PATH>` is specified) plus three levels of subdirectories; zero (0) is the current directory.

### `--exclude=<NAME>[,<NAME>]...>`

Can be used with `--all-projects` and `--yarn-workspaces` to indicate directory names and file names to exclude. Must be comma separated.

Example: `$ w3security test --all-projects --exclude=dir1,file2`

This will exclude any directories and files named `dir1` and `file2` when scanning for project manifest files such as: `./dir1`, `./src/dir1`, `./file2`, `./src/file2` and so on.

### `--prune-repeated-subdependencies`, `-p`

Prune dependency trees, removing duplicate sub-dependencies.

Continues to find all vulnerabilities, but may not find all of the vulnerable paths.

### `--print-deps`

Print the dependency tree before sending it for analysis.

### `--remote-repo-url=<URL>`

Set or override the remote URL for the repository that you would like to monitor.

### `--dev`

Include development-only dependencies. Applicable only for some package managers, for example, `devDependencies` in npm or `:development` dependencies in Gemfile.

Default: scan only production dependencies.

### `--org=<ORG_ID>`

Specify the `<ORG_ID>` to run w3security commands tied to a specific organization. The `<ORG_ID>` influences some features availability and private test limits.

If you have multiple organizations, you can set a default from the CLI using:

`$ w3security config set org=<ORG_ID>`

Set a default to ensure all newly tested projects are tested under your default organization. If you need to override the default, use the `--org=<ORG_ID>` option.

Default: `<ORG_ID>` that is the current preferred organization in your [Account settings](https://app.w3security.io/account)

Note that you can also use `--org=<orgslugname>.` The `ORG_ID` works in both the CLI and the API. The organization slug name works in the CLI, but not in the API.

For more information see the article [How to select the organization to use in the CLI](https://support.w3security.io/hc/en-us/articles/360000920738-How-to-select-the-organization-to-use-in-the-CLI)

### `--file=<FILE>`

Specify a package file.

When testing locally or monitoring a project, you can specify the file that w3security should inspect for package information. When the file is not specified, w3security tries to detect the appropriate file for your project.

### `--package-manager=<PACKAGE_MANAGER_NAME>`

Specify the name of the package manager when the filename specified with the `--file=<FILE>` option is not standard. This allows w3security to find the file.

Example: `$ w3security test --file=req.txt --package-manager=pip`

### `--unmanaged`

For C++ only, scan all files for known open source dependencies.

For options you can use with `--unmanaged` see [Options for scanning using `--unmanaged`](https://docs.w3security.io/w3security-cli/commands/test#options-for-scanning-using-unmanaged)

For more information see [w3security for C/C++](https://docs.w3security.io/products/w3security-open-source/language-and-package-manager-support/w3security-for-c-c++)

### `--ignore-policy`

Ignore all set policies, the current policy in the `.w3security` file, org level ignores, and the project policy on w3security.io.

### `--trust-policies`

Apply and use ignore rules from the w3security policies in your dependencies; otherwise ignore rules in the dependencies are only shown as a suggestion.

### `--show-vulnerable-paths=<none|some|all>`

Display the dependency paths from the top level dependencies down to the vulnerable packages. Not supported with `--json-file-output`.

Default: `some` (a few example paths shown). `false` is an alias for `none`

Example: `--show-vulnerable-paths=none`

### `--project-name=<PROJECT_NAME>`

Specify a custom w3security project name.

### `--target-reference=<TARGET_REFERENCE>`

Specify a reference which differentiates this project, for example, a branch name or version. Projects having the same reference can be grouped based on that reference. Only supported for w3security Open Source.

For more information see [Separating projects by branch or version](https://docs.w3security.io/w3security-cli/secure-your-projects-in-the-long-term/grouping-projects-by-branch-or-version)

### `--policy-path=<PATH_TO_POLICY_FILE>`

Manually pass a path to a `.w3security` policy file.

### `--json`

Print results on the console as a JSON data structure.

Example: `$ w3security test --json`

If you see the invalid string length error, refer to [Invalid string length error when scanning projects](https://docs.w3security.io/w3security-cli/test-for-vulnerabilities/invalid-string-length-error-when-scanning-projects)

### `--json-file-output=<OUTPUT_FILE_PATH>`

Save test output as a JSON data structure directly to the specified file, regardless of whether or not you use the `--json` option.

Use to display the human-readable test output using stdout and at the same time save the JSON data structure output to a file.

Example: `$ w3security test --json-file-output=vuln.json`

If you see the invalid string length error, refer to [Invalid string length error when scanning projects](https://docs.w3security.io/w3security-cli/test-for-vulnerabilities/invalid-string-length-error-when-scanning-projects)

### `--sarif`

Return results in SARIF format.

### `--sarif-file-output=<OUTPUT_FILE_PATH>`

Save test output in SARIF format directly to the \<OUTPUT_FILE_PATH> file, regardless of whether or not you use the `--sarif` option.

This is especially useful if you want to display the human-readable test output using stdout and at the same time save the SARIF format output to a file.

### `--severity-threshold=<low|medium|high|critical>`

Report only vulnerabilities at the specified level or higher.

### `--fail-on=<all|upgradable|patchable>`

Fail only when there are vulnerabilities that can be fixed.

- `all`: fail when there is at least one vulnerability that can be either upgraded or patched.
- `upgradable`: fail when there is at least one vulnerability that can be upgraded.
- `patchable`: fail when there is at least one vulnerability that can be patched.

To fail on any vulnerability (the default behavior), do not use the `--fail-on` option. If vulnerabilities do not have a fix and this option is being used, tests pass.

## Options for Maven projects

For more information about Maven CLI options see [w3security for Java and Kotlin](https://docs.w3security.io/products/w3security-open-source/language-and-package-manager-support/w3security-for-java-gradle-maven)

### `--maven-aggregate-project`

Use `--maven-aggregate-project` instead of `--all-projects` when scanning Maven aggregate projects, that is, ones that use modules and inheritance.

When scanning these types of projects, w3security performs a compile to ensure all modules are resolvable by the Maven reactor.

Be sure to run the scan in the same directory as the root pom.xml file.

w3security reports test results per pom.xml file.

### `--scan-all-unmanaged`

Auto-detect maven jars, aars, and wars in given directory. To test individually use `--file=<JAR_FILE_NAME>`

**Note**: Custom-built jar files, even with open source dependencies, are out of scope.

## Options for Gradle projects

For more information about Gradle CLI options see [w3security for Java and Kotlin](https://docs.w3security.io/products/w3security-open-source/language-and-package-manager-support/w3security-for-java-gradle-maven)

**Note:** If you see the invalid string length error, refer to [Invalid string length error when scanning projects](https://docs.w3security.io/w3security-cli/test-for-vulnerabilities/invalid-string-length-error-when-scanning-projects)

### `--sub-project=<NAME>`, `--gradle-sub-project=<NAME>`

For Gradle "multi project" configurations, test a specific sub-project.

### `--all-sub-projects`

For "multi project" configurations, test all sub-projects.

### `--configuration-matching=<CONFIGURATION_REGEX>`

Resolve dependencies using only configuration(s) that match the specified Java regular expression

Example: `^releaseRuntimeClasspath$`

### `--configuration-attributes=<ATTRIBUTE>[,<ATTRIBUTE>]...`

Select certain values of configuration attributes to install dependencies and perform dependency resolution.

Example: `buildtype:release,usage:java-runtime`

### `--init-script=<FILE>`

Use for projects that contain a Gradle initialization script.

## Options for NuGet projects

### `--assets-project-name`

When monitoring a .NET project using NuGet `PackageReference` use the project name in `project.assets.json` if found.

### `--packages-folder`

Specify a custom path to the packages folder.

### `--project-name-prefix=<PREFIX_STRING>`

When monitoring a .NET project, use this option to add a custom prefix to the name of files inside a project along with any desired separators.

Example: `w3security monitor --file=my-project.sln --project-name-prefix=my-group/`

This is useful when you have multiple projects with the same name in other `.sln` files.

## Option for npm projects

### `--strict-out-of-sync=true|false`

Control testing out-of-sync lockfiles.

Default: true

## Options for Yarn projects

### `--strict-out-of-sync=true|false`

Control testing out-of-sync lockfiles.

Default: true

### `--yarn-workspaces`

Detect and scan Yarn workspaces. You can specify how many sub-directories to search using `--detection-depth` and exclude directories and files using `--exclude`. Alternatively scan Yarn workspaces with other projects using `--all-projects`

## Option for CocoaPods projects

### `--strict-out-of-sync=true|false`

Control testing out-of-sync lockfiles.

Default: false

## Options for Python projects

### `--command=<COMMAND>`

Indicate which specific Python commands to use based on Python version. The default is `python` which executes your default python version. Run 'python -V' to find out what version it is. If you are using multiple Python versions, use this parameter to specify the correct Python command for execution.

Default: `python` Example: `--command=python3`

### `--skip-unresolved=true|false`

Allow skipping packages that are not found in the environment.

## Options for Go projects

Currently the following options are not supported:

`--fail-on=<all|upgradable|patchable>`

## Options for scanning using `--unmanaged`

The following standard `w3security test` options can be used with `--unmanaged` as documented in this help.

`--org=<ORG_ID>`

`--json`

`--json-file-output=<OUTPUT_FILE_PATH>`

`--remote-repo-url=<URL>`

`--severity-threshold=<low|medium|high|critical>`

There are also special options as follows.

### `--max-depth`

Specify the maximum level of archive extraction.

Usage: `--max-depth=1`

Use 0 (zero, the default) to disable archive extraction completely.

### `--print-dep-paths`

Display dependencies.

Use use this option to see what files contributed to each dependency identified.

To see how confident w3security is about the identified dependency and its version, use the `--print-deps` or `--print-dep-paths` option.

For more information on uses of CLI options for C/C++ projects see [w3security for C / C++](https://docs.w3security.io/products/w3security-open-source/language-and-package-manager-support/w3security-for-c-c++)

## Options for build tools

### `-- [<CONTEXT-SPECIFIC_OPTIONS>]`

Use a double dash (`--`) after the complete w3security command to pass options (arguments, flags) that follow directly to the build tool, for example Gradle or Maven.

The format is `w3security <command> -- [<context-specific_options>]`

Example: `w3security test -- --build-cache`

## Examples for the w3security test command

Test a project in the current folder for known vulnerabilities:

`$ w3security test`

Test a specific dependency for vulnerabilities:

`$ w3security test ionic@1.6.5`

Test the latest version of an npm package:

`$ w3security test lodash`

Test a public GitHub repository:

`$ w3security test https://github.com/w3security-labs/nodejs-goof`
