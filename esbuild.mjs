import { build, context } from 'esbuild';
import { argv } from 'node:process';

const watch = argv.includes('--watch');

const extensionConfig = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  platform: 'node',
  target: 'node16',
  format: 'cjs',
  external: ['vscode'],
  sourcemap: true,
  logLevel: 'info',
};

const webviewConfig = {
  entryPoints: ['src/webview/gallery/main.tsx'],
  bundle: true,
  outfile: 'dist/webview/gallery.js',
  platform: 'browser',
  target: 'es2020',
  format: 'iife',
  jsx: 'automatic',
  sourcemap: true,
  loader: { '.css': 'css' },
  logLevel: 'info',
};

const cssConfig = {
  entryPoints: ['src/webview/gallery/styles.css'],
  bundle: true,
  outfile: 'dist/webview/gallery.css',
  loader: { '.css': 'css' },
  logLevel: 'info',
};

if (watch) {
  const ctxs = await Promise.all([
    context(extensionConfig),
    context(webviewConfig),
    context(cssConfig),
  ]);
  await Promise.all(ctxs.map((c) => c.watch()));
  console.log('[esbuild] watching for changes...');
} else {
  await Promise.all([
    build(extensionConfig),
    build(webviewConfig),
    build(cssConfig),
  ]);
}
