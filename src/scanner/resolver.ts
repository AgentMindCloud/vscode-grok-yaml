import * as vscode from 'vscode';
import { CONFIG_SECTION } from '../constants';
import { logger } from '../logger';
import type { ScannerAdapter } from './adapter';
import { emptyResult } from './adapter';
import { CliScannerAdapter } from './cliAdapter';
import type { ScanResult } from './types';

export type ScannerMode = 'cli' | 'auto';

export function getScannerMode(): ScannerMode {
  const raw = vscode.workspace
    .getConfiguration(CONFIG_SECTION)
    .get<string>('scanner.mode', 'auto');
  if (raw === 'cli' || raw === 'auto') return raw;
  return 'auto';
}

class NoopScannerAdapter implements ScannerAdapter {
  readonly id = 'cli' as const;
  readonly displayName = 'grok-install CLI (not installed)';

  async isAvailable(): Promise<boolean> {
    return false;
  }

  async scan(): Promise<ScanResult> {
    return emptyResult('none');
  }

  dispose(): void {
    // nothing to clean up
  }
}

export async function resolveScanner(): Promise<ScannerAdapter> {
  const cli = new CliScannerAdapter();
  if (await cli.isAvailable()) {
    logger.info(`using CLI scanner (${cli.cliPath})`);
    return cli;
  }

  logger.warn(
    'grok-install CLI not found on PATH. Install it from https://github.com/AgentMindCloud/grok-install-cli — diagnostics will be empty until then.',
  );
  return new NoopScannerAdapter();
}
