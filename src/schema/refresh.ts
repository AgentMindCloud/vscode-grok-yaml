import * as vscode from 'vscode';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { CONFIG_SECTION } from '../constants';
import { logger } from '../logger';
import { registerAllSchemas } from './registry';
import type { SchemaManifest } from './types';

export async function refreshRemoteSchemas(ctx: vscode.ExtensionContext): Promise<void> {
  const cfg = vscode.workspace.getConfiguration(CONFIG_SECTION);
  const baseUrl = cfg.get<string>('schemas.remoteBaseUrl');
  if (!baseUrl) throw new Error('grokYaml.schemas.remoteBaseUrl is not configured.');

  const manifestUrl = `${baseUrl.replace(/\/$/, '')}/schemas/index.json`;
  logger.info(`refreshing schemas from ${manifestUrl}`);

  const manifest = await fetchJson<SchemaManifest>(manifestUrl);
  const cacheDir = path.join(ctx.globalStorageUri.fsPath, 'schemas');
  await fs.mkdir(cacheDir, { recursive: true });
  await fs.writeFile(path.join(cacheDir, 'index.json'), JSON.stringify(manifest, null, 2), 'utf8');

  let fetched = 0;
  for (const desc of manifest.schemas) {
    const schemaUrl = `${baseUrl.replace(/\/$/, '')}/schemas/${desc.file}`;
    try {
      const body = await fetchText(schemaUrl);
      JSON.parse(body);
      await fs.writeFile(path.join(cacheDir, desc.file), body, 'utf8');
      fetched += 1;
    } catch (err) {
      logger.warn(`failed to fetch schema ${desc.file}: ${(err as Error).message}`);
    }
  }

  logger.info(`refreshed ${fetched}/${manifest.schemas.length} schemas into ${cacheDir}`);
  await registerAllSchemas(ctx);
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.text();
}

async function fetchJson<T>(url: string): Promise<T> {
  return JSON.parse(await fetchText(url)) as T;
}
