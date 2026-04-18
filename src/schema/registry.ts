import * as vscode from 'vscode';
import * as fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { CONFIG_SECTION, SCHEMA_CONTRIBUTOR_LABEL, SCHEMA_CONTRIBUTOR_NAMESPACE } from '../constants';
import { resolveByContent, resolveByGlob, contentSniffEnabled } from '../fileMatching';
import { logger } from '../logger';
import { getYamlApi } from './yamlExtension';
import type { ResolvedSchema, SchemaDescriptor, SchemaManifest } from './types';

const SCHEME = 'grokinstall-schema';

interface RegistryState {
  descriptors: SchemaDescriptor[];
  contentByFile: Map<string, ResolvedSchema>;
  registered: boolean;
}

const state: RegistryState = {
  descriptors: [],
  contentByFile: new Map(),
  registered: false,
};

export async function registerAllSchemas(ctx: vscode.ExtensionContext): Promise<void> {
  await loadManifestAndSchemas(ctx);

  if (state.registered) {
    logger.info(`schema registry refreshed: ${state.descriptors.length} descriptor(s)`);
    return;
  }

  const api = await getYamlApi();
  const ok = api.registerContributor(
    SCHEMA_CONTRIBUTOR_NAMESPACE,
    (resource) => requestSchema(resource),
    (uri) => requestSchemaContent(uri),
    SCHEMA_CONTRIBUTOR_LABEL,
  );
  if (!ok) {
    throw new Error(
      `Another schema contributor already owns namespace "${SCHEMA_CONTRIBUTOR_NAMESPACE}".`,
    );
  }
  state.registered = true;
  logger.info(`registered schema contributor: ${state.descriptors.length} descriptor(s)`);
}

function resolveSource(): 'bundled' | 'remote' | 'auto' {
  const cfg = vscode.workspace.getConfiguration(CONFIG_SECTION);
  const raw = cfg.get<string>('schemas.source', 'auto');
  if (raw === 'bundled' || raw === 'remote' || raw === 'auto') return raw;
  return 'auto';
}

async function readBundledManifest(ctx: vscode.ExtensionContext): Promise<SchemaManifest> {
  const manifestPath = path.join(ctx.extensionPath, 'schemas', 'index.json');
  const raw = await fs.readFile(manifestPath, 'utf8');
  return JSON.parse(raw) as SchemaManifest;
}

async function readCachedManifest(ctx: vscode.ExtensionContext): Promise<SchemaManifest | undefined> {
  const cachePath = path.join(ctx.globalStorageUri.fsPath, 'schemas', 'index.json');
  try {
    const raw = await fs.readFile(cachePath, 'utf8');
    return JSON.parse(raw) as SchemaManifest;
  } catch {
    return undefined;
  }
}

async function readBundledSchema(ctx: vscode.ExtensionContext, file: string): Promise<string> {
  return fs.readFile(path.join(ctx.extensionPath, 'schemas', file), 'utf8');
}

async function readCachedSchema(ctx: vscode.ExtensionContext, file: string): Promise<string | undefined> {
  try {
    return await fs.readFile(path.join(ctx.globalStorageUri.fsPath, 'schemas', file), 'utf8');
  } catch {
    return undefined;
  }
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 12);
}

async function loadManifestAndSchemas(ctx: vscode.ExtensionContext): Promise<void> {
  const source = resolveSource();
  const bundled = await readBundledManifest(ctx);
  const cached = await readCachedManifest(ctx);

  const manifest: SchemaManifest =
    source === 'bundled' ? bundled : (source === 'remote' ? (cached ?? bundled) : (cached ?? bundled));

  state.descriptors = manifest.schemas;
  state.contentByFile.clear();

  for (const desc of manifest.schemas) {
    let origin: 'bundled' | 'remote' = 'bundled';
    let content: string | undefined;
    if (source !== 'bundled') {
      content = await readCachedSchema(ctx, desc.file);
      if (content) origin = 'remote';
    }
    if (!content) {
      content = await readBundledSchema(ctx, desc.file);
      origin = 'bundled';
    }
    state.contentByFile.set(desc.file, {
      descriptor: desc,
      content,
      contentHash: sha256(content),
      origin,
    });
  }
}

function buildSchemaUri(desc: SchemaDescriptor, hash: string): string {
  return `${SCHEME}://${desc.id}/${desc.file}#v=${hash}`;
}

function parseSchemaUri(uri: string): { file: string } | undefined {
  try {
    const parsed = new URL(uri);
    if (parsed.protocol !== `${SCHEME}:`) return undefined;
    const segments = parsed.pathname.replace(/^\//, '').split('/');
    const file = segments[segments.length - 1];
    if (!file) return undefined;
    return { file };
  } catch {
    return undefined;
  }
}

function requestSchema(resource: string): string | undefined {
  const uri = tryParseUri(resource);
  if (!uri) return undefined;

  const byGlob = resolveByGlob(uri, state.descriptors);
  if (byGlob) {
    const resolved = state.contentByFile.get(byGlob.file);
    return resolved ? buildSchemaUri(byGlob, resolved.contentHash) : undefined;
  }

  if (contentSniffEnabled() && uri.scheme === 'file') {
    const text = tryReadFileSync(uri.fsPath);
    if (text) {
      const byContent = resolveByContent(text, state.descriptors);
      if (byContent) {
        const resolved = state.contentByFile.get(byContent.file);
        return resolved ? buildSchemaUri(byContent, resolved.contentHash) : undefined;
      }
    }
  }
  return undefined;
}

function tryParseUri(resource: string): vscode.Uri | undefined {
  try {
    return vscode.Uri.parse(resource, true);
  } catch {
    return undefined;
  }
}

function tryReadFileSync(fsPath: string): string | undefined {
  try {
    return readFileSync(fsPath, 'utf8');
  } catch {
    return undefined;
  }
}

function requestSchemaContent(uri: string): string | Promise<string> {
  const parsed = parseSchemaUri(uri);
  if (!parsed) return '';
  const resolved = state.contentByFile.get(parsed.file);
  return resolved?.content ?? '';
}

export function getDescriptors(): SchemaDescriptor[] {
  return [...state.descriptors];
}
