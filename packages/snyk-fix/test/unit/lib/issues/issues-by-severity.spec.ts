import { getIssueCountBySeverity } from '../../../../src/lib/issues/issues-by-severity';
import { IssuesData, SEVERITY } from '../../../../src/types';

describe('getIssueCountBySeverity', () => {
  it('correctly returns when no issues', () => {
    const issueData = [];
    const res = getIssueCountBySeverity(issueData);
    expect(res).toEqual({
      critical: [],
      high: [],
      low: [],
      medium: [],
    });
  });

  it('correctly returns when all severities are present', () => {
    const issueData: IssuesData[] = [
      {
        'W3SECURITY-1': {
          title: 'Critical severity issue',
          severity: SEVERITY.CRITICAL,
          id: 'W3SECURITY-1',
        },
      },
      {
        'W3SECURITY-2': {
          title: 'High severity issue',
          severity: SEVERITY.HIGH,
          id: 'W3SECURITY-2',
        },
      },
      {
        'W3SECURITY-3': {
          title: 'High severity issue',
          severity: SEVERITY.MEDIUM,
          id: 'W3SECURITY-3',
        },
      },
      {
        'W3SECURITY-4': {
          title: 'High severity issue',
          severity: SEVERITY.LOW,
          id: 'W3SECURITY-4',
        },
      },
    ];
    const res = getIssueCountBySeverity(issueData);
    expect(res).toEqual({
      critical: ['W3SECURITY-1'],
      high: ['W3SECURITY-2'],
      low: ['W3SECURITY-4'],
      medium: ['W3SECURITY-3'],
    });
  });

  it('correctly returns when some severities are present', () => {
    const issueData: IssuesData[] = [
      {
        'W3SECURITY-1': {
          title: 'Critical severity issue',
          severity: SEVERITY.CRITICAL,
          id: 'W3SECURITY-1',
        },
      },
      {
        'W3SECURITY-2': {
          title: 'Critical severity issue',
          severity: SEVERITY.CRITICAL,
          id: 'W3SECURITY-2',
        },
      },
      {
        'W3SECURITY-3': {
          title: 'Critical severity issue',
          severity: SEVERITY.CRITICAL,
          id: 'W3SECURITY-3',
        },
      },
      {
        'W3SECURITY-4': {
          title: 'High severity issue',
          severity: SEVERITY.MEDIUM,
          id: 'W3SECURITY-4',
        },
      },
      {
        'W3SECURITY-5': {
          title: 'High severity issue',
          severity: SEVERITY.MEDIUM,
          id: 'W3SECURITY-5',
        },
      },
    ];
    const res = getIssueCountBySeverity(issueData);
    expect(res).toEqual({
      critical: ['W3SECURITY-1', 'W3SECURITY-2', 'W3SECURITY-3'],
      high: [],
      low: [],
      medium: ['W3SECURITY-4', 'W3SECURITY-5'],
    });
  });
});
