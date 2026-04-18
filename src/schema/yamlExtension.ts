import * as vscode from 'vscode';

export interface YamlSchemaContributorApi {
  registerContributor(
    schema: string,
    requestSchema: (resource: string) => string | undefined,
    requestSchemaContent: (uri: string) => string | Promise<string>,
    label?: string,
  ): boolean;
}

export async function getYamlApi(): Promise<YamlSchemaContributorApi> {
  const ext = vscode.extensions.getExtension<YamlSchemaContributorApi>('redhat.vscode-yaml');
  if (!ext) {
    throw new Error(
      "redhat.vscode-yaml is required — declared as extensionDependency in package.json.",
    );
  }
  const exports: YamlSchemaContributorApi = ext.isActive ? ext.exports : await ext.activate();
  if (typeof exports.registerContributor !== 'function') {
    throw new Error(
      'redhat.vscode-yaml did not expose registerContributor — the extension API may have changed.',
    );
  }
  return exports;
}
