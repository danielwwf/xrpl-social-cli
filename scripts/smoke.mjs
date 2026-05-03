import { execFileSync } from 'node:child_process';
const bin = new URL('../bin/xrplsocial.js', import.meta.url).pathname;
for (const args of [
  ['auth','whoami'],
  ['profile','get'],
  ['links','list'],
  ['shorts','list'],
  ['analytics','summary'],
]) {
  const out = execFileSync('node', [bin, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  JSON.parse(out);
}
console.log(JSON.stringify({ ok: true }, null, 2));
