import * as vscode from 'vscode';
import { CONFIG_SECTION } from './constants';
import { debounce } from './debounce';
import { isGrokYamlDocument } from './fileMatching';
import { initLogger, logger } from './logger';
import { getDescriptors, registerAllSchemas } from './schema/registry';
import type { ScannerAdapter } from './scanner/adapter';
import {
  ScannerCodeActionProvider,
  applyScanResult,
  countIssues,
  createDiagnosticCollection,
} from './scanner/diagnostics';
import { resolveScanner } from './scanner/resolver';
import { registerCommands } from './ui/commands';
import { createStatusBar, type StatusBar } from './ui/statusBar';

interface RuntimeState {
  scanner: ScannerAdapter;
  diagnostics: vscode.DiagnosticCollection;
  statusBar: StatusBar;
  inFlight: vscode.CancellationTokenSource | undefined;
}

export async function activate(ctx: vscode.ExtensionContext): Promise<void> {
  initLogger(ctx);
  logger.info('activating vscode-grok-yaml');

  try {
    await registerAllSchemas(ctx);
  } catch (err) {
    logger.error(`schema registration failed: ${(err as Error).message}`);
    void vscode.window.showErrorMessage(
      `GrokInstall: schema registration failed — ${(err as Error).message}`,
    );
  }

  const scanner = await resolveScanner();
  ctx.subscriptions.push({ dispose: () => scanner.dispose() });

  const diagnostics = createDiagnosticCollection();
  ctx.subscriptions.push(diagnostics);

  const statusBar = createStatusBar(ctx);
  statusBar.set({ kind: 'clean' });

  ctx.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      [{ language: 'yaml' }, { language: 'grok-yaml' }],
      new ScannerCodeActionProvider(),
      { providedCodeActionKinds: ScannerCodeActionProvider.providedKinds },
    ),
  );

  const runtime: RuntimeState = { scanner, diagnostics, statusBar, inFlight: undefined };

  registerCommands(ctx, {
    rescan: () => runFullScan(runtime),
  });

  wireScanTriggers(ctx, runtime);

  void runFullScan(runtime);
}

export function deactivate(): void {
  logger.info('deactivating vscode-grok-yaml');
}

async function runFullScan(runtime: RuntimeState): Promise<void> {
  await runScan(runtime, undefined);
}

async function runScan(runtime: RuntimeState, files: string[] | undefined): Promise<void> {
  runtime.inFlight?.cancel();
  runtime.inFlight?.dispose();
  const cts = new vscode.CancellationTokenSource();
  runtime.inFlight = cts;

  runtime.statusBar.set({ kind: 'scanning' });
  try {
    const result = await runtime.scanner.scan(files, cts.token);
    if (cts.token.isCancellationRequested) return;
    applyScanResult(runtime.diagnostics, result, files);

    if (result.errors && result.errors.length > 0) {
      for (const e of result.errors) {
        logger.warn(`scanner error for ${e.file}: ${e.message}`);
      }
    }

    const count = countIssues(runtime.diagnostics);
    if (count === 0) runtime.statusBar.set({ kind: 'clean' });
    else runtime.statusBar.set({ kind: 'issues', count });
  } catch (err) {
    if ((err as Error).message === 'scan cancelled') return;
    logger.error(`scan failed: ${(err as Error).message}`);
    runtime.statusBar.set({ kind: 'error', message: (err as Error).message });
  } finally {
    if (runtime.inFlight === cts) {
      runtime.inFlight.dispose();
      runtime.inFlight = undefined;
    }
  }
}

function wireScanTriggers(ctx: vscode.ExtensionContext, runtime: RuntimeState): void {
  const cfg = () => vscode.workspace.getConfiguration(CONFIG_SECTION);
  const debounceMs = (): number => cfg().get<number>('scanner.debounceMs', 400);
  const runOn = (): 'change' | 'save' => {
    const v = cfg().get<string>('scanner.runOn', 'change');
    return v === 'save' ? 'save' : 'change';
  };

  let debounceWait = debounceMs();
  let debouncedScan = buildDebounced(runtime, debounceWait);

  ctx.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (!e.affectsConfiguration(CONFIG_SECTION)) return;
      const next = debounceMs();
      if (next !== debounceWait) {
        debounceWait = next;
        debouncedScan.cancel();
        debouncedScan = buildDebounced(runtime, debounceWait);
        logger.debug(`debounce updated to ${debounceWait}ms`);
      }
    }),

    vscode.workspace.onDidChangeTextDocument((e) => {
      if (runOn() !== 'change') return;
      if (!isTargetDocument(e.document)) return;
      debouncedScan(e.document.uri.fsPath);
    }),

    vscode.workspace.onDidSaveTextDocument((doc) => {
      if (!isTargetDocument(doc)) return;
      debouncedScan.cancel();
      void runScan(runtime, [doc.uri.fsPath]);
    }),

    vscode.workspace.onDidCloseTextDocument((doc) => {
      runtime.diagnostics.delete(doc.uri);
    }),
  );
}

function buildDebounced(runtime: RuntimeState, waitMs: number): ReturnType<typeof debounce<[string]>> {
  return debounce<[string]>((file) => {
    void runScan(runtime, [file]);
  }, waitMs);
}

function isTargetDocument(doc: vscode.TextDocument): boolean {
  if (doc.languageId !== 'yaml' && doc.languageId !== 'grok-yaml') return false;
  if (doc.uri.scheme !== 'file') return false;
  return isGrokYamlDocument(doc, getDescriptors());
}
