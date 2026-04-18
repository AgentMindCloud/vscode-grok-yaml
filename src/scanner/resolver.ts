import * as vscode from 'vscode';
import { CONFIG_SECTION } from '../constants';
import { logger } from '../logger';
import type { ScannerAdapter } from './adapter';
import { CliScannerAdapter } from './cliAdapter';
import { LibraryScannerAdapter } from './libraryAdapter';

export type ScannerMode = 'cli' | 'library' | 'auto';

export function getScannerMode(): ScannerMode {
  const raw = vscode.workspace
    .getConfiguration(CONFIG_SECTION)
    .get<string>('scanner.mode', 'auto');
  if (raw === 'cli' || raw === 'library' || raw === 'auto') return raw;
  return 'auto';
}

export async function resolveScanner(): Promise<ScannerAdapter> {
  const mode = getScannerMode();

  if (mode === 'cli') {
    const cli = new CliScannerAdapter();
    const available = await cli.isAvailable();
    if (!available) {
      logger.warn(
        'scanner.mode=cli but grok-install CLI is unavailable; using library fallback to avoid silent failure.',
      );
      return new LibraryScannerAdapter();
    }
    logger.info(`using CLI scanner (${cli.cliPath})`);
    return cli;
  }

  if (mode === 'library') {
    const lib = new LibraryScannerAdapter();
    logger.info('using library scanner (mode=library)');
    return lib;
  }

  const cli = new CliScannerAdapter();
  if (await cli.isAvailable()) {
    logger.info(`using CLI scanner (${cli.cliPath})`);
    return cli;
  }

  const lib = new LibraryScannerAdapter();
  if (await lib.isAvailable()) {
    logger.info('CLI unavailable — using library scanner fallback');
    return lib;
  }

  logger.warn(
    'no scanner available: CLI not on PATH and grok-install-cli library not resolvable. Diagnostics will be empty until a scanner is installed.',
  );
  return lib;
}
