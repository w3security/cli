import { packageJsonBelongsToWorkspace } from '../../../../../src/lib/plugins/nodejs-plugin/yarn-workspaces-parser';

const yarnWorkspacesMap = {
  'w3security/test/acceptance/workspaces/yarn-workspace-out-of-sync/package.json': {
    workspaces: ['packages/*'],
  },
  'w3security/test/acceptance/workspaces/yarn-workspace/package.json': {
    workspaces: ['libs/*/**', 'tools/*'],
  },
};

const yarnWorkspacesMapWindows = {
  'C:\\w3security\\test\\acceptance\\workspaces\\yarn-workspace-out-of-sync\\package.json': {
    workspaces: ['packages'],
  },
  'C:\\w3security\\test\\acceptance\\workspaces\\yarn-workspace\\package.json': {
    workspaces: ['libs/*/**', 'tools/*'],
  },
  'C:\\w3security\\yarn-workspace\\package.json': {
    workspaces: ['libs\\*\\**', 'tools\\*'],
  },
};
describe('packageJsonBelongsToWorkspace', () => {
  test('does not match workspace root', () => {
    const packageJsonFileName =
      'w3security/test/acceptance/workspaces/yarn-workspace-out-of-sync/package.json';
    const workspaceRoot =
      'w3security/test/acceptance/workspaces/yarn-workspace-out-of-sync/package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMap,
        workspaceRoot,
      ),
    ).toBeFalsy();
  });
  test('correctly matches a workspace with /* globs (meaning all folders)', () => {
    // docs: https://yarnpkg.com/features/workspaces#how-to-declare-a-worktree
    const packageJsonFileName =
      'w3security/test/acceptance/workspaces/yarn-workspace-out-of-sync/packages/apple/package.json';
    const workspaceRoot =
      'w3security/test/acceptance/workspaces/yarn-workspace-out-of-sync/package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMap,
        workspaceRoot,
      ),
    ).toBeTruthy();
  });

  test('correctly matches a workspace with /*/** globs', () => {
    const packageJsonFileName =
      'w3security/test/acceptance/workspaces/yarn-workspace/libs/a/package.json';
    const workspaceRoot =
      'w3security/test/acceptance/workspaces/yarn-workspace/package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMap,
        workspaceRoot,
      ),
    ).toBeTruthy();
  });

  test('does not match a workspace outside declared globs', () => {
    const packageJsonFileName =
      'w3security/test/acceptance/workspaces/yarn-workspace/packages/a/package.json';
    const workspaceRoot =
      'w3security/test/acceptance/workspaces/yarn-workspace/package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMap,
        workspaceRoot,
      ),
    ).toBeFalsy();
  });
});

describe('packageJsonBelongsToWorkspace Windows', () => {
  test('does not match workspace root', () => {
    const packageJsonFileName =
      'C:\\w3security\\test\\acceptance\\workspaces\\yarn-workspace-out-of-sync\\package.json';
    const workspaceRoot =
      'C:\\w3security\\test\\acceptance\\workspaces\\yarn-workspace-out-of-sync\\package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMapWindows,
        workspaceRoot,
      ),
    ).toBeFalsy();
  });
  test('correctly matches a workspace with /* globs (meaning all folders)', () => {
    // docs: https://yarnpkg.com/features/workspaces#how-to-declare-a-worktree
    const packageJsonFileName =
      'C:\\w3security\\test\\acceptance\\workspaces\\yarn-workspace-out-of-sync\\packages\\apple\\package.json';
    const workspaceRoot =
      'C:\\w3security\\test\\acceptance\\workspaces\\yarn-workspace-out-of-sync\\package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMapWindows,
        workspaceRoot,
      ),
    ).toBeTruthy();
  });

  test('correctly matches a workspace with \\* globs (meaning all folders)', () => {
    // docs: https://yarnpkg.com/features/workspaces#how-to-declare-a-worktree
    const packageJsonFileName =
      'C:\\w3security\\yarn-workspace\\tools\\apple\\package.json';
    const workspaceRoot = 'C:\\w3security\\yarn-workspace\\package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMapWindows,
        workspaceRoot,
      ),
    ).toBeTruthy();
  });

  test('correctly matches a workspace with /*/** globs', () => {
    const packageJsonFileName =
      'C:\\w3security\\test\\acceptance\\workspaces\\yarn-workspace\\libs\\a\\package.json';
    const workspaceRoot =
      'C:\\w3security\\test\\acceptance\\workspaces\\yarn-workspace\\package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMapWindows,
        workspaceRoot,
      ),
    ).toBeTruthy();
  });

  test('does not match a workspace outside declared globs', () => {
    const packageJsonFileName =
      'C:\\w3security\\test\\acceptance\\workspaces\\yarn-workspace\\packages\\a\\package.json';
    const workspaceRoot =
      'C:\\w3security\\test\\acceptance\\workspaces\\yarn-workspace\\package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMapWindows,
        workspaceRoot,
      ),
    ).toBeFalsy();
  });
});
