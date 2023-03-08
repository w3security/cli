import config from '../config';

const licenseRegex = /^w3security:lic/i;

export function getVulnerabilityUrl(vulnerabilityId: string): string {
  return licenseRegex.test(vulnerabilityId)
    ? `${config.ROOT}/vuln/${vulnerabilityId}`
    : `${config.PUBLIC_VULN_DB_URL}/vuln/${vulnerabilityId}`;
}
