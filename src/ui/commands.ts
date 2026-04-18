import * as vscode from 'vscode';
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
  ctx.subscriptions.push(
    vscode.commands.registerCommand(COMMANDS.showOutput, () => logger.show()),
    vscode.commands.registerCommand(COMMANDS.rescan, async () => {
      try {
        await handlers.rescan();
      } catch (err) {
        logger.error(`rescan failed: ${(err as Error).message}`);
        void vscode.window.showErrorMessage(`GrokInstall rescan failed: ${(err as Error).message}`);
      }
    }),
    vscode.commands.registerCommand(COMMANDS.refreshSchemas, async () => {
      try {
        await refreshRemoteSchemas(ctx);
        void vscode.window.showInformationMessage('GrokInstall: schemas refreshed.');
      } catch (err) {
        logger.error(`schema refresh failed: ${(err as Error).message}`);
        void vscode.window.showErrorMessage(
          `GrokInstall: schema refresh failed — ${(err as Error).message}`,
        );
      }
    }),
  );
}
