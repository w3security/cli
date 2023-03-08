import { LegalInstruction, SEVERITY } from '../../lib/w3security-test/legacy';

export interface BasicVulnInfo {
  type: string;
  title: string;
  severity: SEVERITY;
  originalSeverity?: SEVERITY;
  isNew: boolean;
  name: string;
  version: string;
  fixedIn: string[];
  legalInstructions?: LegalInstruction[];
  paths: string[][];
  note: string | false;
}

interface TopLevelPackageUpgrade {
  name: string;
  version: string;
}

export interface UpgradesByAffectedPackage {
  [pkgNameAndVersion: string]: TopLevelPackageUpgrade[];
}
