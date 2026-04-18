import * as vscode from 'vscode';
import { createRequire } from 'node:module';
import * as path from 'node:path';
import { logger } from '../logger';
import type { ScannerAdapter } from './adapter';
import { emptyResult } from './adapter';
import type { ScanResult } from './types';

interface GrokInstallScannerModule {
  scan(options: { files?: string[]; cwd?: string }): Promise<ScanResult> | ScanResult;
  version?: string;
}

export class LibraryScannerAdapter implements ScannerAdapter {
  readonly id = 'library' as const;
  readonly displayName = 'grok-install-cli (library fallback)';

  private cachedModule: GrokInstallScannerModule | undefined;

  async isAvailable(): Promise<boolean> {
    try {
      this.cachedModule ??= await this.loadModule();
      return !!this.cachedModule;
    } catch (err) {
      logger.debug(`library probe failed: ${(err as Error).message}`);
      return false;
    }
  }

  async scan(files?: string[]): Promise<ScanResult> {
    const mod = this.cachedModule ?? (await this.loadModule());
    if (!mod) return emptyResult();
    const cwd = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    const options: { files?: string[]; cwd?: string } = {};
    if (files && files.length > 0) options.files = files;
    if (cwd) options.cwd = cwd;
    const res = await Promise.resolve(mod.scan(options));
    return res;
  }

  dispose(): void {
    this.cachedModule = undefined;
  }

  private async loadModule(): Promise<GrokInstallScannerModule | undefined> {
    const candidates = resolutionBases();
    for (const base of candidates) {
      try {
        const req = createRequire(base);
        const resolved = req.resolve('grok-install-cli/scanner');
        const mod = req(resolved) as GrokInstallScannerModule;
        if (typeof mod.scan === 'function') {
          logger.info(`loaded library scanner from ${resolved}`);
          return mod;
        }
      } catch {
        // try next base
      }
    }
    return undefined;
  }
}

function resolutionBases(): string[] {
  const bases: string[] = [];
  const folder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (folder) bases.push(path.join(folder, 'package.json'));
  bases.push(path.join(__dirname, 'package.json'));
  return bases;
}
