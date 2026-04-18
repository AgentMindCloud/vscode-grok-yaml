export type Severity = 'error' | 'warning' | 'info' | 'hint';

export interface ScanFindingLocation {
  file: string;
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export interface ScanFix {
  title: string;
  edits: Array<{ range: ScanFindingLocation; newText: string }>;
}

export interface ScanFinding {
  ruleId: string;
  severity: Severity;
  message: string;
  location: ScanFindingLocation;
  yamlPath?: string;
  docsUrl?: string;
  fix?: ScanFix;
}

export interface ScanResult {
  version: '1';
  scannedAt: string;
  cliVersion: string;
  findings: ScanFinding[];
  errors?: Array<{ file: string; message: string }>;
}
