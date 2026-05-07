import * as vscode from 'vscode';
import * as cmds from '../commands';
import { COMMANDS } from '../constants';
import { logger } from '../logger';
import { refreshRemoteSchemas } from '../schema/refresh';

export interface CommandHandlers {
  rescan: () => Promise<void>;
}

export function registerCommands(
  ctx: vscode.ExtensionContext,
  handlers: CommandHandlers,
): void {
  const safe = (name: string, fn: () => Promise<void> | void): (() => Promise<void>) => {
    return async () => {
      try {
        await fn();
      } catch (err) {
        const message = (err as Error).message ?? String(err);
        logger.error(`${name} failed: ${message}`);
        void vscode.window.showErrorMessage(`GrokInstall: ${name} failed — ${message}`);
      }
    };
  };

  ctx.subscriptions.push(
    vscode.commands.registerCommand(COMMANDS.showOutput, () => logger.show()),
    vscode.commands.registerCommand(COMMANDS.rescan, safe('rescan', () => handlers.rescan())),
    vscode.commands.registerCommand(
      COMMANDS.refreshSchemas,
      safe('schema refresh', async () => {
        await refreshRemoteSchemas(ctx);
        void vscode.window.showInformationMessage('GrokInstall: schemas refreshed.');
      }),
    ),
    vscode.commands.registerCommand(COMMANDS.initAgent, safe('initAgent', () => cmds.initAgent())),
    vscode.commands.registerCommand(
      COMMANDS.validateCurrent,
      safe('validateCurrent', () => cmds.validateCurrent()),
    ),
    vscode.commands.registerCommand(
      COMMANDS.validateProject,
      safe('validateProject', () => cmds.validateProject()),
    ),
    vscode.commands.registerCommand(COMMANDS.scanSafety, safe('scanSafety', () => cmds.scanSafety())),
    vscode.commands.registerCommand(COMMANDS.deploy, safe('deploy', () => cmds.deploy())),
    vscode.commands.registerCommand(
      COMMANDS.generateInstallLink,
      safe('generateInstallLink', () => cmds.generateInstallLink()),
    ),
    vscode.commands.registerCommand(
      COMMANDS.openMarketplace,
      safe('openMarketplace', () => cmds.openMarketplace()),
    ),
    vscode.commands.registerCommand(
      COMMANDS.openTemplateGallery,
      safe('openTemplateGallery', () => cmds.openTemplateGallery(ctx)),
    ),
  );
}
