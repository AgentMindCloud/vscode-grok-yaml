import * as vscode from 'vscode';
import { spawn } from 'node:child_process';
import { CONFIG_SECTION } from '../constants';
import { logger } from '../logger';
import type { ScannerAdapter } from './adapter';
import { emptyResult } from './adapter';
import type { ScanResult } from './types';

export class CliScannerAdapter implements ScannerAdapter {
  readonly id = 'cli' as const;
  readonly displayName = 'grok-install CLI';

  private cachedVersion: string | undefined;

  get cliPath(): string {
    return vscode.workspace
      .getConfiguration(CONFIG_SECTION)
      .get<string>('scanner.cliPath', 'grok-install');
  }

  async isAvailable(): Promise<boolean> {
    try {
      const version = await runCapture(this.cliPath, ['--version'], undefined, 4000);
      this.cachedVersion = version.stdout.trim() || 'unknown';
      return version.code === 0;
    } catch (err) {
      logger.debug(`cli probe failed: ${(err as Error).message}`);
      return false;
    }
  }

  async scan(files?: string[], token?: vscode.CancellationToken): Promise<ScanResult> {
    const args = ['scan', '--json'];
    if (files && files.length > 0) args.push(...files);

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    const { code, stdout, stderr } = await runCapture(this.cliPath, args, workspaceFolder, 60_000, token);

    if (stderr) logger.debug(`cli stderr: ${stderr.trim()}`);

    if (code !== 0 && code !== 1) {
      throw new Error(`grok-install scan exited with code ${code}: ${stderr.trim() || 'unknown error'}`);
    }

    const trimmed = stdout.trim();
    if (!trimmed) return emptyResult(this.cachedVersion ?? 'unknown');

    try {
      return JSON.parse(trimmed) as ScanResult;
    } catch (err) {
      throw new Error(`failed to parse CLI JSON output: ${(err as Error).message}`);
    }
  }

  dispose(): void {
    // nothing to clean up — each scan spawns its own child
  }
}

interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
}

function runCapture(
  cmd: string,
  args: string[],
  cwd: string | undefined,
  timeoutMs: number,
  token?: vscode.CancellationToken,
): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, shell: false });
    let stdout = '';
    let stderr = '';
    let settled = false;

    const done = (result: RunResult | Error): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cancelSub?.dispose();
      if (result instanceof Error) reject(result);
      else resolve(result);
    };

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      done(new Error(`command timed out after ${timeoutMs}ms: ${cmd} ${args.join(' ')}`));
    }, timeoutMs);

    const cancelSub = token?.onCancellationRequested(() => {
      child.kill('SIGTERM');
      done(new Error('scan cancelled'));
    });

    child.stdout.on('data', (chunk: Buffer) => (stdout += chunk.toString('utf8')));
    child.stderr.on('data', (chunk: Buffer) => (stderr += chunk.toString('utf8')));
    child.on('error', (err) => done(err));
    child.on('close', (code) => done({ code: code ?? -1, stdout, stderr }));
  });
}
