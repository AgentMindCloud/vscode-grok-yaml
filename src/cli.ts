import { spawn } from 'node:child_process';
import * as vscode from 'vscode';

export interface CliResult {
  code: number;
  stdout: string;
  stderr: string;
}

const NOT_INSTALLED_HINT =
  'grok-install CLI not found. Install it with `npm i -g grok-install` or see the extension README.';

export async function runCli(
  args: string[],
  opts: { cwd?: string; output?: vscode.OutputChannel } = {},
): Promise<CliResult> {
  return new Promise((resolve, reject) => {
    const child = spawn('grok-install', args, {
      cwd: opts.cwd,
      shell: process.platform === 'win32',
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk: Buffer) => {
      const text = chunk.toString();
      stdout += text;
      opts.output?.append(text);
    });

    child.stderr.on('data', (chunk: Buffer) => {
      const text = chunk.toString();
      stderr += text;
      opts.output?.append(text);
    });

    child.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'ENOENT') {
        reject(new Error(NOT_INSTALLED_HINT));
      } else {
        reject(err);
      }
    });

    child.on('close', (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

export function runCliInTerminal(args: string[], name = 'GrokInstall'): vscode.Terminal {
  const terminal = vscode.window.createTerminal({ name });
  terminal.sendText(`grok-install ${args.map(shellQuote).join(' ')}`);
  terminal.show();
  return terminal;
}

function shellQuote(arg: string): string {
  if (/^[A-Za-z0-9_\-./:=]+$/.test(arg)) {
    return arg;
  }
  return `'${arg.replace(/'/g, `'\\''`)}'`;
}
