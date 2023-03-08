import { SEVERITY } from '../../../../w3security-test/common';
import { IacProjectType } from '../../../constants';
import { w3securityIacTestError } from '../errors';
import * as PolicyEngineTypes from './policy-engine';
import { IaCErrorCodes } from '../../../../../cli/commands/test/iac/local-execution/types';
import { UnsupportedEntitlementError } from '../../../../errors/unsupported-entitlement-error';
import { FailedToGetIacOrgSettingsError } from '../../../../../cli/commands/test/iac/local-execution/org-settings/get-iac-org-settings';

export function mapw3securityIacTestOutputToTestOutput(
  w3securityIacOutput: w3securityIacTestOutput,
): TestOutput {
  const entitlementError = w3securityIacOutput.errors?.find(
    (err) => err.code === IaCErrorCodes.EntitlementNotEnabled,
  );

  if (entitlementError) {
    throw new UnsupportedEntitlementError(
      entitlementError?.fields?.entitlement || '',
    );
  }

  const readSettingsError = w3securityIacOutput.errors?.find(
    (err) => err.code === IaCErrorCodes.ReadSettings,
  );

  if (readSettingsError) {
    throw new FailedToGetIacOrgSettingsError();
  }

  const errors = w3securityIacOutput.errors?.map((err) => new w3securityIacTestError(err));

  const errWithoutPath = errors?.find((err) => !err.fields?.path);

  if (errWithoutPath) {
    throw errWithoutPath;
  }

  return {
    results: w3securityIacOutput.results,
    settings: w3securityIacOutput.settings,
    errors,
  };
}

export interface TestOutput {
  results?: Results;
  errors?: w3securityIacTestError[];
  settings: Settings;
}

export interface w3securityIacTestOutput {
  results?: Results;
  rawResults?: PolicyEngineTypes.Results;
  errors?: ScanError[];
  settings: Settings;
}

export interface Results {
  resources?: Resource[];
  vulnerabilities?: Vulnerability[];
  metadata: Metadata;
  scanAnalytics: ScanAnalytics;
}

export interface Metadata {
  projectName: string;
  ignoredCount: number;
}

export interface Settings {
  org: string;
  ignoreSettings: IgnoreSettings;
}

export interface IgnoreSettings {
  adminOnly: boolean;
  disregardFilesystemIgnores: boolean;
  reasonRequired: boolean;
}

export interface ScanAnalytics {
  suppressedResults?: Record<string, string[]>;
  ignoredCount: number;
}

export interface Vulnerability {
  rule: Rule;
  message: string;
  remediation: string;
  severity: SEVERITY;
  ignored: boolean;
  resource: Resource;
}

export interface Rule {
  id: string;
  title: string;
  description: string;
  references?: string;
  labels?: string[];
  category?: string;
  documentation?: string;
  isGeneratedByCustomRule?: boolean;
}

export interface Resource {
  id: string;
  type: string;
  path?: any[];
  formattedPath: string;
  file: string;
  kind: ResourceKind;
  line?: number;
  column?: number;
}

export type ResourceKind =
  | IacProjectType
  | PolicyEngineTypes.State.InputTypeEnum;

export interface ScanError {
  message: string;
  code: number;
  fields?: Record<string, string>;
}
