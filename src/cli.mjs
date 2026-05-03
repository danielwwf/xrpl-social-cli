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
      'xrplsocial links create --label "..." --url https://...',
      'xrplsocial links update --id 123 --label "..." --url https://...',
      'xrplsocial links delete --id 123',
      'xrplsocial links reorder --file order.json',
      'xrplsocial links sync --file links.json [--delete-missing]',
      'xrplsocial shorts list',
      'xrplsocial shorts create --title "..." --destination-url https://...',
      'xrplsocial shorts update --id 123 --title "..." --destination-url https://...',
      'xrplsocial shorts toggle --id 123',
      'xrplsocial shorts delete --id 123',
      'xrplsocial shorts qr --id 123 --out short-123.png',
      'xrplsocial analytics summary [--window all|today|7d|30d]',
      'xrplsocial analytics links [--window all|today|7d|30d]',
      'xrplsocial analytics shorts [--window all|today|7d|30d]'
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
  if (group === 'links' && command === 'create') {
    return print(await api('/links', { method: 'POST', body: { label: flags.label, url: flags.url, subtitle: flags.subtitle, type: flags.type, is_active: flags['is-active'] === undefined ? true : flags['is-active'] === 'true' || flags['is-active'] === true } }));
  }
  if (group === 'links' && command === 'update') {
    const id = requireId(flags);
    const body = {};
    for (const [flag, key] of [['label','label'],['url','url'],['subtitle','subtitle'],['type','type']]) if (flags[flag] !== undefined) body[key] = flags[flag];
    if (flags['is-active'] !== undefined) body.is_active = flags['is-active'] === 'true' || flags['is-active'] === true;
    return print(await api(`/links/${id}`, { method: 'PATCH', body }));
  }
  if (group === 'links' && command === 'delete') return print(await api(`/links/${requireId(flags)}`, { method: 'DELETE' }));
  if (group === 'links' && command === 'reorder') {
    if (!flags.file) throw new Error('Missing --file <order.json>');
    const body = JSON.parse(fs.readFileSync(flags.file, 'utf8'));
    return print(await api('/links/reorder', { method: 'POST', body }));
  }
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
  if (group === 'shorts' && command === 'qr') {
    const id = requireId(flags);
    const out = flags.out || `short-${id}-qr.png`;
    const { baseUrl, token } = readConfig();
    if (!token) throw new Error('Missing XRPLSOCIAL_TOKEN or config token');
    const res = await fetch(`${baseUrl}/api/cli/v1/shorts/${id}/qr`, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'image/png' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(out, buf);
    return print({ ok: true, result: { path: out, bytes: buf.length } });
  }
  if (group === 'analytics' && command === 'summary') {
    const query = flags.window ? `?window=${encodeURIComponent(flags.window)}` : '';
    return print(await api(`/analytics/summary${query}`));
  }
  if (group === 'analytics' && command === 'links') {
    const query = flags.window ? `?window=${encodeURIComponent(flags.window)}` : '';
    return print(await api(`/analytics/links${query}`));
  }
  if (group === 'analytics' && command === 'shorts') {
    const query = flags.window ? `?window=${encodeURIComponent(flags.window)}` : '';
    return print(await api(`/analytics/shorts${query}`));
  }
  throw new Error(`Unknown command: ${positional.join(' ')}`);
}
