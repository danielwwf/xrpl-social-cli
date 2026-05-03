import fs from 'node:fs';
import { api } from './client.mjs';
import { configPath, readConfig, writeConfig } from './config.mjs';
function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) flags[key] = true;
      else { flags[key] = next; i += 1; }
    } else positional.push(arg);
  }
  return { positional, flags };
}
function print(obj) { console.log(JSON.stringify(obj, null, 2)); }
function usage() {
  return {
    ok: true,
    usage: [
      'xrplsocial auth whoami',
      'xrplsocial config show',
      'xrplsocial config init --base-url https://dev.xrpl.social --token xrsoc_pat_...',
      'xrplsocial profile get',
      'xrplsocial profile update --title "..." --bio "..."',
      'xrplsocial links list',
      'xrplsocial links sync --file links.json [--delete-missing]',
      'xrplsocial shorts list',
      'xrplsocial shorts create --title "..." --destination-url https://...',
      'xrplsocial shorts update --id 123 --title "..." --destination-url https://...',
      'xrplsocial shorts toggle --id 123',
      'xrplsocial shorts delete --id 123',
      'xrplsocial analytics summary [--window all|today|7d|30d]'
    ]
  };
}
function requireId(flags) {
  if (!flags.id) throw new Error('Missing --id <short_id>');
  return String(flags.id);
}
export async function run(argv) {
  const { positional, flags } = parseArgs(argv);
  const [group, command] = positional;
  if (!group || flags.help) return print(usage());
  if (group === 'auth' && command === 'whoami') return print(await api('/me'));
  if (group === 'config' && command === 'show') {
    const cfg = readConfig();
    return print({ ok: true, result: { config_path: configPath(), baseUrl: cfg.baseUrl, token_present: Boolean(cfg.token) } });
  }
  if (group === 'config' && command === 'init') {
    const next = { baseUrl: flags['base-url'] || readConfig().baseUrl, token: flags.token || readConfig().token };
    const file = writeConfig(next);
    return print({ ok: true, result: { config_path: file, baseUrl: next.baseUrl, token_present: Boolean(next.token) } });
  }
  if (group === 'profile' && command === 'get') return print(await api('/profile'));
  if (group === 'profile' && command === 'update') {
    const body = {};
    for (const key of ['title','bio','location','website','theme']) if (flags[key] !== undefined) body[key] = flags[key];
    return print(await api('/profile', { method: 'PATCH', body }));
  }
  if (group === 'links' && command === 'list') return print(await api('/links'));
  if (group === 'links' && command === 'sync') {
    if (!flags.file) throw new Error('Missing --file <links.json>');
    const body = JSON.parse(fs.readFileSync(flags.file, 'utf8'));
    if (flags['delete-missing']) body.delete_missing = true;
    return print(await api('/links/sync', { method: 'POST', body }));
  }
  if (group === 'shorts' && command === 'list') return print(await api('/shorts'));
  if (group === 'shorts' && command === 'create') {
    return print(await api('/shorts', { method: 'POST', body: { title: flags.title, destination_url: flags['destination-url'], is_active: flags['is-active'] === undefined ? true : flags['is-active'] === 'true' || flags['is-active'] === true } }));
  }
  if (group === 'shorts' && command === 'update') {
    const id = requireId(flags);
    if (flags['destination-url'] === undefined) throw new Error('Missing --destination-url for shorts update');
    const body = { destination_url: flags['destination-url'] };
    if (flags.title !== undefined) body.title = flags.title;
    if (flags['is-active'] !== undefined) body.is_active = flags['is-active'] === 'true' || flags['is-active'] === true;
    return print(await api(`/shorts/${id}`, { method: 'PATCH', body }));
  }
  if (group === 'shorts' && command === 'toggle') return print(await api(`/shorts/${requireId(flags)}/toggle`, { method: 'POST' }));
  if (group === 'shorts' && command === 'delete') return print(await api(`/shorts/${requireId(flags)}`, { method: 'DELETE' }));
  if (group === 'analytics' && command === 'summary') {
    const query = flags.window ? `?window=${encodeURIComponent(flags.window)}` : '';
    return print(await api(`/analytics/summary${query}`));
  }
  throw new Error(`Unknown command: ${positional.join(' ')}`);
}
