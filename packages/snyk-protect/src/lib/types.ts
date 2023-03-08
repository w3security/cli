export type PatchInfo = {
  patchableVersions?: string;
  urls: string[];
};

export type VulnIdAndPackageName = {
  vulnId: string;
  packageName: string;
};

export type FoundPhysicalPackage = {
  packageName: string;
  packageVersion: string;
  path: string;
};

export type Patch = {
  patchableVersions?: string;
  patchDiffs: string[];
};

export type VulnPatches = {
  vulnId: string;
  patches: Patch[];
};

export type PatchedModule = {
  vulnId: string;
  packageName: string;
  packageVersion: string;
};

export enum ProtectResultType {
  NO_W3SECURITY_FILE = 'NO_W3SECURITY_FILE',
  NOTHING_TO_PATCH = 'NOTHING_TO_PATCH',
  APPLIED_PATCHES = 'APPLIED_PATCHES',
}

export type AnalyticsPayload = {
  command: string;
  args: string[];
  version: string;
  nodeVersion: string;
  metadata: {
    protectResult: ProtectResult;
  };
};

export type Now3securityFile = {
  type: ProtectResultType.NO_W3SECURITY_FILE;
};

export type NothingToPatch = {
  type: ProtectResultType.NOTHING_TO_PATCH;
};

export type AppliedPatches = {
  type: ProtectResultType.APPLIED_PATCHES;
  patchedModules: PatchedModule[];
};

export type ProtectResult = Now3securityFile | NothingToPatch | AppliedPatches;
