import { TwaManifest, TwaGenerator, ConsoleLog } from '@bubblewrap/core';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

const dir = process.cwd();
const manifestFile = path.join(dir, 'twa-manifest.json');
const twaManifest = await TwaManifest.fromFile(manifestFile);

const error = twaManifest.validate();
if (error) {
  console.error('twa-manifest.json is invalid:', error);
  process.exit(1);
}

const generator = new TwaGenerator();
const log = new ConsoleLog('scaffold');
await generator.createTwaProject(dir, twaManifest, log, (cur, total) => {
  process.stdout.write(`\r  ${Math.round((cur / total) * 100)}%`);
});
console.log('\ndone generating project');

// build.js expects a manifest-checksum.txt matching the current twa-manifest.json,
// otherwise it re-prompts to regenerate the project on every `build` invocation.
const contents = fs.readFileSync(manifestFile);
const checksum = crypto.createHash('sha1').update(contents).digest('hex');
fs.writeFileSync(path.join(dir, 'manifest-checksum.txt'), checksum);
console.log('wrote manifest-checksum.txt');
