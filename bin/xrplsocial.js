#!/usr/bin/env node
import { run } from '../src/cli.mjs';
import { CliError } from '../src/errors.mjs';
run(process.argv.slice(2)).catch((error) => {
  const payload = { ok: false, error: error.message || String(error) };
  if (error instanceof CliError && error.details) payload.details = error.details;
  console.error(JSON.stringify(payload, null, 2));
  process.exit(error instanceof CliError ? error.exitCode : 1);
});
