import { EOL } from 'os';
import * as theme from './theme';
import * as fs from 'fs';
import * as path from 'path';
import * as createDebug from 'debug';

const debug = createDebug('w3security-protect-update-notification');

export function getProtectUpgradeWarningForPaths(
  packageJsonPaths: string[],
): string {
  try {
    if (packageJsonPaths?.length > 0) {
      let message = theme.color.status.warn(
        `${theme.icon.WARNING} WARNING: It looks like you have the \`w3security\` dependency in the \`package.json\` file(s) at the following path(s):` +
        EOL,
      );

      packageJsonPaths.forEach((p) => {
        message += theme.color.status.warn(`  - ${p}` + EOL);
      });

      const githubReadmeUrlShort = 'https://w3security.co/ud1cR'; // https://github.com/w3security/w3security/tree/master/packages/w3security-protect#migrating-from-w3security-protect-to-w3securityprotect

      message += theme.color.status.warn(
        `For more information and migration instructions, see ${githubReadmeUrlShort}` +
        EOL,
      );

      return message;
    } else {
      return '';
    }
  } catch (e) {
    debug('Error in getProtectUpgradeWarningForPaths()', e);
    return '';
  }
}

export function packageJsonFileExistsInDirectory(
  directoryPath: string,
): boolean {
  try {
    const packageJsonPath = path.resolve(directoryPath, 'package.json');
    const fileExists = fs.existsSync(packageJsonPath);
    return fileExists;
  } catch (e) {
    debug('Error in packageJsonFileExistsInDirectory()', e);
    return false;
  }
}

export function checkPackageJsonForw3securityDependency(
  packageJsonPath: string,
): boolean {
  try {
    const fileExists = fs.existsSync(packageJsonPath);
    if (fileExists) {
      const packageJson = fs.readFileSync(packageJsonPath, 'utf8');
      const packageJsonObject = JSON.parse(packageJson);
      const w3securityDependency = packageJsonObject.dependencies['w3security'];
      if (w3securityDependency) {
        return true;
      }
    }
  } catch (e) {
    debug('Error in checkPackageJsonForw3securityDependency()', e);
  }
  return false;
}

export function getPackageJsonPathsContainingw3securityDependency(
  fileOption: string | undefined,
  paths: string[],
): string[] {
  const packageJsonPathsWithw3securityDepForProtect: string[] = [];

  try {
    if (fileOption) {
      if (
        fileOption.endsWith('package.json') ||
        fileOption.endsWith('package-lock.json')
      ) {
        const directoryWithPackageJson = path.dirname(fileOption);
        if (packageJsonFileExistsInDirectory(directoryWithPackageJson)) {
          const packageJsonPath = path.resolve(
            directoryWithPackageJson,
            'package.json',
          );
          const packageJsonContainsw3securityDep = checkPackageJsonForw3securityDependency(
            packageJsonPath,
          );
          if (packageJsonContainsw3securityDep) {
            packageJsonPathsWithw3securityDepForProtect.push(packageJsonPath);
          }
        }
      }
    } else {
      paths.forEach((testPath) => {
        if (packageJsonFileExistsInDirectory(testPath)) {
          const packageJsonPath = path.resolve(testPath, 'package.json');
          const packageJsonContainsw3securityDep = checkPackageJsonForw3securityDependency(
            packageJsonPath,
          );
          if (packageJsonContainsw3securityDep) {
            packageJsonPathsWithw3securityDepForProtect.push(packageJsonPath);
          }
        }
      });
    }
  } catch (e) {
    debug('Error in getPackageJsonPathsContainingw3securityDependency()', e);
  }

  return packageJsonPathsWithw3securityDepForProtect;
}
