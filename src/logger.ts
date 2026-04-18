import * as vscode from 'vscode';
import { OUTPUT_CHANNEL_NAME } from './constants';

let channel: vscode.OutputChannel | undefined;

export function initLogger(ctx: vscode.ExtensionContext): vscode.OutputChannel {
  if (!channel) {
    channel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
    ctx.subscriptions.push(channel);
  }
  return channel;
}

function write(level: string, message: string, ...rest: unknown[]): void {
  const ch = channel;
  if (!ch) return;
  const prefix = `[${new Date().toISOString()}] ${level}`;
  const extra = rest.length
    ? ' ' + rest.map((r) => (typeof r === 'string' ? r : safeJson(r))).join(' ')
    : '';
  ch.appendLine(`${prefix} ${message}${extra}`);
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export const logger = {
  info: (msg: string, ...rest: unknown[]) => write('INFO ', msg, ...rest),
  warn: (msg: string, ...rest: unknown[]) => write('WARN ', msg, ...rest),
  error: (msg: string, ...rest: unknown[]) => write('ERROR', msg, ...rest),
  debug: (msg: string, ...rest: unknown[]) => write('DEBUG', msg, ...rest),
  show: () => channel?.show(true),
  channel: (): vscode.OutputChannel | undefined => channel,
};
