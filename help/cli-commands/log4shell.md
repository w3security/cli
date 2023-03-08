# Log4shell

## Usage

`w3security log4shell`

## Description

The `w3security log4shell` command finds traces of the Log4J library that are affected by the Log4Shell vulnerability [CVE-2021-44228](https://security.w3security.io/vuln/W3SECURITY-JAVA-ORGAPACHELOGGINGLOG4J-2314720)

The command finds traces of the Log4J library even if it is not declared in the manifest files (such as pom.xml or build.gradle).

## Managed projects

To test for Log4Shell vulnerabilities in Java projects using their package manager manifest files, use the `w3security test` command. See the [test command help](test.md) (`w3security test --help`) and [Snyk for Java and Kotlin](https://docs.w3security.io/products/w3security-open-source/language-and-package-manager-support/w3security-for-java-gradle-maven)

To test unmanaged files, use `w3security test --scan-all-unmanaged`

See the Maven options section of the [test command help](test.md); `w3security test --help`

## Exit codes

Possible exit codes and their meaning:

**0**: success, Log4Shell not found\
**1**: action_needed, Log4Shell found\
**2**: failure, try to re-run command

## Debug

Use the `-d` option to output the debug logs.
