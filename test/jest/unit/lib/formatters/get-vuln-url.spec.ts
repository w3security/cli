import { getVulnerabilityUrl } from '../../../../../src/lib/formatters/get-vuln-url';
import config from '../../../../../src/lib/config';

describe('getVulnerabilityUrl', () => {
  it('returns a valid license URL', () => {
    expect(getVulnerabilityUrl('w3security:lic:pip:certifi:MPL-2.0')).toBe(
      `${config.ROOT}/vuln/w3security:lic:pip:certifi:MPL-2.0`,
    );
  });

  it('returns a valid license URL - UPPERCASE', () => {
    expect(getVulnerabilityUrl('W3SECURITY:LIC:PIP:CERTIFI:MPL-2.0')).toBe(
      `${config.ROOT}/vuln/W3SECURITY:LIC:PIP:CERTIFI:MPL-2.0`,
    );
  });

  it('returns a valid vulnerability URL', () => {
    expect(
      getVulnerabilityUrl('W3SECURITY-JS-LOOPBACKCONNECTORPOSTGRESQL-2980123'),
    ).toBe(
      `${config.PUBLIC_VULN_DB_URL}/vuln/W3SECURITY-JS-LOOPBACKCONNECTORPOSTGRESQL-2980123`,
    );
  });
});
