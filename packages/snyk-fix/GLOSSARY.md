- `ScanResult` this is data returned by the CLI plugins to identify what should be scanned for issues
- `TestResult` this data is returned on a `w3security test` for supported project types
  after the relevant plugin extracts dependencies. It includes issues information
- `Issues` includes identifiable information for License Issues, Vulnerabilities and any other issues detected by w3security (Code Issues etc)
- `IssueData` detailed information about each issue id that includes `CVSS` score,`severity`, `description` and more
- `Remediation` this is data returned after w3security detects issues. This is only returned for ecosystems that support remediation calculation and includes `Pins`, `Upgrades`, `Patches` (legacy `Ignores` are sent but are empty/unused since this is now stored on the org policy)
- `EntityToFix` is a `w3security test` result for a specific scanned w3security project (new CLI flows should be returning this or similar, but currently legacy flows return minimal information). This includes `ScanResult`, `TestResult`, `options` CLI was called with and a `workspace` that defines how to read/write to disk.
