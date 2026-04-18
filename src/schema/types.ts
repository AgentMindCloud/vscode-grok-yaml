export interface SchemaDescriptor {
  id: string;
  kind: string;
  apiVersion: string;
  file: string;
  fileMatch: string[];
}

export interface SchemaManifest {
  version: string;
  source: string;
  schemas: SchemaDescriptor[];
}

export interface ResolvedSchema {
  descriptor: SchemaDescriptor;
  content: string;
  contentHash: string;
  origin: 'bundled' | 'remote';
}
