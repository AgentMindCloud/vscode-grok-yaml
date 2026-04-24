import * as vscode from 'vscode';
import type { ScanResult } from './types';

export interface ScannerAdapter {
  readonly id: 'cli';
  readonly displayName: string;
  scan(files?: string[], token?: vscode.CancellationToken): Promise<ScanResult>;
  isAvailable(): Promise<boolean>;
  dispose(): void;
}

export function emptyResult(cliVersion = 'none'): ScanResult {
  return {
    version: '1',
    scannedAt: new Date().toISOString(),
    cliVersion,
    findings: [],
  };
}
