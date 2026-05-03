import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const bin = path.join(repoRoot, 'bin', 'xrplsocial.js');
function run(args, env = process.env) {
  return JSON.parse(execFileSync('node', [bin, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env }));
}
const tempConfigDir = fs.mkdtempSync(path.join(os.tmpdir(), 'xrplsocial-cli-'));
const env = { ...process.env, XRPLSOCIAL_CONFIG: path.join(tempConfigDir, 'config.json') };
run(['config','init','--base-url','https://dev.xrpl.social','--token','xrsoc_pat_example'], env);
run(['config','show'], env);
run(['auth','doctor'], env);
console.log(JSON.stringify({ ok: true }, null, 2));
