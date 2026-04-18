import * as path from 'node:path';
import * as fs from 'node:fs';
import Mocha from 'mocha';

export async function run(): Promise<void> {
  const mocha = new Mocha({ ui: 'bdd', color: true, timeout: 30_000 });
  const testsRoot = path.resolve(__dirname);

  const files = fs
    .readdirSync(testsRoot)
    .filter((f) => f.endsWith('.test.js'))
    .map((f) => path.join(testsRoot, f));

  for (const file of files) mocha.addFile(file);

  await new Promise<void>((resolve, reject) => {
    try {
      mocha.run((failures) => {
        if (failures > 0) reject(new Error(`${failures} tests failed.`));
        else resolve();
      });
    } catch (err) {
      reject(err as Error);
    }
  });
}
