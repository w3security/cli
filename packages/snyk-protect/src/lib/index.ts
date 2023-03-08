import * as fs from 'fs';
import * as path from 'path';
import { extractPatchMetadata } from './w3security-file';
import { applyPatchToFile } from './patch';
import { findPhysicalModules } from './explore-node-modules';
import {
  VulnIdAndPackageName,
  VulnPatches,
  PatchedModule,
  ProtectResultType,
} from './types';
import { getAllPatches } from './fetch-patches';
import { sendAnalytics } from './analytics';

async function protect(projectFolderPath: string) {
  // Handle runs with flags
  if (process.argv.includes('--help')) {
    console.log(getHelp());
    return;
  }
  if (process.argv.includes('--version')) {
    console.log(getVersion());
    return;
  }

  const w3securityFilePath = path.resolve(projectFolderPath, '.w3security');

  if (!fs.existsSync(w3securityFilePath)) {
    console.log('No .w3security file found.');
    sendAnalytics({
      type: ProtectResultType.NO_W3SECURITY_FILE,
    });
    return;
  }

  const w3securityFileContents = fs.readFileSync(w3securityFilePath, 'utf8');
  const w3securityFilePatchMetadata = extractPatchMetadata(w3securityFileContents);
  const vulnIdAndPackageNames: VulnIdAndPackageName[] = w3securityFilePatchMetadata;
  const targetPackageNames = [
    ...new Set(w3securityFilePatchMetadata.map((vpn) => vpn.packageName)), // get a list of unique package names by converting to Set and then back to array
  ];

  // find instances of the target packages by spelunking through the node_modules looking for modules with a target packageName
  const foundPhysicalPackages = findPhysicalModules(
    projectFolderPath,
    targetPackageNames,
  );

  // Map of package name to versions (for the target package names).
  // For each package name, we might have found multiple versions and we'll need to fetch patches for each version.
  // We will use this to lookup the versions of packages to get patches for.
  const packageNameToVersionsMap = new Map<string, string[]>();
  foundPhysicalPackages.forEach((p) => {
    if (packageNameToVersionsMap.has(p.packageName)) {
      const versions = packageNameToVersionsMap.get(p.packageName);
      if (!versions?.includes(p.packageVersion)) {
        versions?.push(p.packageVersion);
      }
    } else {
      packageNameToVersionsMap.set(p.packageName, [p.packageVersion]);
    }
  });

  const packageAtVersionsToPatches: Map<
    string,
    VulnPatches[]
  > = await getAllPatches(vulnIdAndPackageNames, packageNameToVersionsMap);

  if (packageAtVersionsToPatches.size === 0) {
    console.log('Nothing to patch.');
    sendAnalytics({
      type: ProtectResultType.NOTHING_TO_PATCH,
    });
    return;
  }

  const patchedModules: PatchedModule[] = [];
  foundPhysicalPackages.forEach((fpp) => {
    const packageNameAtVersion = `${fpp.packageName}@${fpp.packageVersion}`;
    const vuldIdAndPatches = packageAtVersionsToPatches.get(
      packageNameAtVersion,
    );
    vuldIdAndPatches?.forEach((vp) => {
      vp.patches.forEach((patchDiffs) => {
        patchDiffs.patchDiffs.forEach((diff) => {
          const patchedPath = applyPatchToFile(diff, fpp.path, vp.vulnId);
          console.log(`Patched: ${patchedPath}`);
        });
      });
      patchedModules.push({
        vulnId: vp.vulnId,
        packageName: fpp.packageName,
        packageVersion: fpp.packageVersion,
      });
    });
  });

  console.log('Applied w3security patches.');

  sendAnalytics({
    type: ProtectResultType.APPLIED_PATCHES,
    patchedModules,
  });
}

export function getHelp(): string {
  const filePath = path.resolve(__dirname, '../../help.txt');
  const helpText = fs.readFileSync(filePath, 'utf8');
  return helpText;
}

export function getVersion() {
  const filePath = path.resolve(__dirname, '../../package.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const packageJSON = JSON.parse(rawData);
  return packageJSON.version;
}

export default protect;
