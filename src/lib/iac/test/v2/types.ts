import { SEVERITY } from '../../../w3security-test/legacy';

export interface TestConfig {
  paths: string[];
  iacCachePath: string;
  userRulesBundlePath?: string;
  userPolicyEnginePath?: string;
  report: boolean;
  severityThreshold?: SEVERITY;
  targetReference?: string;
  targetName?: string;
  remoteRepoUrl?: string;
  policy?: string;
  scan: string;
  varFile?: string;
  depthDetection?: number;
  cloudContext?: string;
  w3securityCloudEnvironment?: string;
  insecure?: boolean;
  org?: string;
  customRules?: boolean;
  experimental?: boolean;
}
