#!/usr/bin/env node
import { run } from '../src/cli.mjs';
run(process.argv.slice(2)).catch((error) => {
  const payload = { ok: false, error: error.message || String(error) };
  console.error(JSON.stringify(payload, null, 2));
  process.exit(1);
});
