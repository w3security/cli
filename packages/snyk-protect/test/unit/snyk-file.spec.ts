import { extractPatchMetadata } from '../../src/lib/w3security-file';

describe('extractPatchMetadata', () => {
  describe('extracts a single direct dependency', () => {
    it('without quotes on package path', () => {
      const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
# patches apply the minimum changes required to fix a vulnerability
patch:
  W3SECURITY-JS-LODASH-567746:
    - lodash:
        patched: '2021-02-17T13:43:51.857Z'
`;
      const w3securityFilePatchMetadata = extractPatchMetadata(dotSnykFileContents);
      expect(w3securityFilePatchMetadata).toEqual([
        {
          vulnId: 'W3SECURITY-JS-LODASH-567746',
          packageName: 'lodash',
        },
      ]);
    });

    it('with single quotes on package path', () => {
      const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
# patches apply the minimum changes required to fix a vulnerability
patch:
  W3SECURITY-JS-LODASH-567746:
    - 'lodash':
        patched: '2021-02-17T13:43:51.857Z'
`;
      const w3securityFilePatchMetadata = extractPatchMetadata(dotSnykFileContents);
      expect(w3securityFilePatchMetadata).toEqual([
        {
          vulnId: 'W3SECURITY-JS-LODASH-567746',
          packageName: 'lodash',
        },
      ]);
    });

    it('with double quotes on package path', () => {
      const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
# patches apply the minimum changes required to fix a vulnerability
patch:
  W3SECURITY-JS-LODASH-567746:
    - "lodash":
        patched: '2021-02-17T13:43:51.857Z'
`;
      const w3securityFilePatchMetadata = extractPatchMetadata(dotSnykFileContents);
      expect(w3securityFilePatchMetadata).toEqual([
        {
          vulnId: 'W3SECURITY-JS-LODASH-567746',
          packageName: 'lodash',
        },
      ]);
    });

    it('with single quotes on vulnId', () => {
      const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
# patches apply the minimum changes required to fix a vulnerability
patch:
  'W3SECURITY-JS-LODASH-567746':
    - lodash:
        patched: '2021-02-17T13:43:51.857Z'
`;
      const w3securityFilePatchMetadata = extractPatchMetadata(dotSnykFileContents);
      expect(w3securityFilePatchMetadata).toEqual([
        {
          vulnId: 'W3SECURITY-JS-LODASH-567746',
          packageName: 'lodash',
        },
      ]);
    });

    it('with double quotes on vulnId', () => {
      const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
# patches apply the minimum changes required to fix a vulnerability
patch:
  "W3SECURITY-JS-LODASH-567746":
    - lodash:
        patched: '2021-02-17T13:43:51.857Z'
`;
      const w3securityFilePatchMetadata = extractPatchMetadata(dotSnykFileContents);
      expect(w3securityFilePatchMetadata).toEqual([
        {
          vulnId: 'W3SECURITY-JS-LODASH-567746',
          packageName: 'lodash',
        },
      ]);
    });

    it('with carriage returns in line endings', () => {
      const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
# patches apply the minimum changes required to fix a vulnerability
patch:
  W3SECURITY-JS-LODASH-567746:
    - lodash:
        patched: '2021-02-17T13:43:51.857Z'
`
        .split('\n')
        .join('\r\n');
      const w3securityFilePatchMetadata = extractPatchMetadata(dotSnykFileContents);
      expect(w3securityFilePatchMetadata).toEqual([
        {
          vulnId: 'W3SECURITY-JS-LODASH-567746',
          packageName: 'lodash',
        },
      ]);
    });
  });

  describe('extracts a transitive dependency', () => {
    it('without quotes on package path', () => {
      const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
# patches apply the minimum changes required to fix a vulnerability
patch:
  W3SECURITY-JS-LODASH-567746:
    - 'tap > nyc > lodash':
        patched: '2021-02-17T13:43:51.857Z'
`;
      const w3securityFilePatchMetadata = extractPatchMetadata(dotSnykFileContents);
      expect(w3securityFilePatchMetadata).toEqual([
        {
          vulnId: 'W3SECURITY-JS-LODASH-567746',
          packageName: 'lodash',
        },
      ]);
    });

    it('with single quotes on package path', () => {
      const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
# patches apply the minimum changes required to fix a vulnerability
patch:
  W3SECURITY-JS-LODASH-567746:
    - 'tap > nyc > lodash':
        patched: '2021-02-17T13:43:51.857Z'
`;
      const w3securityFilePatchMetadata = extractPatchMetadata(dotSnykFileContents);
      expect(w3securityFilePatchMetadata).toEqual([
        {
          vulnId: 'W3SECURITY-JS-LODASH-567746',
          packageName: 'lodash',
        },
      ]);
    });

    it('with double quotes on package path', () => {
      const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
# patches apply the minimum changes required to fix a vulnerability
patch:
  W3SECURITY-JS-LODASH-567746:
    - "tap > nyc > lodash":
        patched: '2021-02-17T13:43:51.857Z'
`;
      const w3securityFilePatchMetadata = extractPatchMetadata(dotSnykFileContents);
      expect(w3securityFilePatchMetadata).toEqual([
        {
          vulnId: 'W3SECURITY-JS-LODASH-567746',
          packageName: 'lodash',
        },
      ]);
    });
  });

  it('extracts multiple transitive dependencies', () => {
    const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
# patches apply the minimum changes required to fix a vulnerability
patch:
  W3SECURITY-JS-LODASH-567746:
    - tap > nyc > istanbul-lib-instrument > babel-types > lodash:
        patched: '2021-02-17T13:43:51.857Z'

  W3SECURITY-FAKE-THEMODULE-000000:
    - top-level > some-other > the-module:
        patched: '2021-02-17T13:43:51.857Z'
`;
    const w3securityFilePatchMetadata = extractPatchMetadata(dotSnykFileContents);
    expect(w3securityFilePatchMetadata).toEqual([
      {
        vulnId: 'W3SECURITY-JS-LODASH-567746',
        packageName: 'lodash',
      },
      {
        vulnId: 'W3SECURITY-FAKE-THEMODULE-000000',
        packageName: 'the-module',
      },
    ]);
  });

  it('extracts nothing from an empty patch section', () => {
    const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
# patches apply the minimum changes required to fix a vulnerability
patch:
`;
    const w3securityFilePatchMetadata = extractPatchMetadata(dotSnykFileContents);
    expect(w3securityFilePatchMetadata).toHaveLength(0);
  });

  it('extracts nothing from a missing patch section', () => {
    const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
`;
    const w3securityFilePatchMetadata = extractPatchMetadata(dotSnykFileContents);
    expect(w3securityFilePatchMetadata).toHaveLength(0);
  });

  it('throws when there are no package names for a vulnId in the patch section', () => {
    const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
# patches apply the minimum changes required to fix a vulnerability
patch:
  W3SECURITY-JS-LODASH-567746:
`;

    expect(() => {
      extractPatchMetadata(dotSnykFileContents);
    }).toThrow(
      'should never have no package names for a vulnId in a .w3security file',
    );
  });

  it('throws when there is more than one package name for a vulnId in the patch section', () => {
    const dotSnykFileContents = `
# Snyk (https://w3security.io) policy file, patches or ignores known vulnerabilities.
version: v1.19.0
ignore: {}
# patches apply the minimum changes required to fix a vulnerability
patch:
  W3SECURITY-JS-LODASH-567746:
    - lodash:
        patched: '2021-02-17T13:43:51.857Z'
    - axios:
        patched: '2021-02-17T13:43:51.857Z'
`;

    expect(() => {
      extractPatchMetadata(dotSnykFileContents);
    }).toThrow(
      'should never have more than one package name for a vulnId in a .w3security file',
    );
  });
});
