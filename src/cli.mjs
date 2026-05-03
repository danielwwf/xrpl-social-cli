import { api } from './client.mjs';
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
      'xrplsocial profile get',
      'xrplsocial profile update --title "..." --bio "..."',
      'xrplsocial links list',
      'xrplsocial links sync --file links.json [--delete-missing]',
      'xrplsocial shorts list',
      'xrplsocial analytics summary [--window all|today|7d|30d]'
    ]
  };
}
export async function run(argv) {
  const { positional, flags } = parseArgs(argv);
  const [group, command] = positional;
  if (!group || flags.help) return print(usage());
  if (group === 'auth' && command === 'whoami') return print(await api('/me'));
  if (group === 'profile' && command === 'get') return print(await api('/profile'));
  if (group === 'profile' && command === 'update') {
    const body = {};
    for (const key of ['title','bio','location','website','theme']) if (flags[key] !== undefined) body[key] = flags[key];
    return print(await api('/profile', { method: 'PATCH', body }));
  }
  if (group === 'links' && command === 'list') return print(await api('/links'));
  if (group === 'links' && command === 'sync') {
    if (!flags.file) throw new Error('Missing --file <links.json>');
    const fs = await import('node:fs');
    const body = JSON.parse(fs.readFileSync(flags.file, 'utf8'));
    if (flags['delete-missing']) body.delete_missing = true;
    return print(await api('/links/sync', { method: 'POST', body }));
  }
  if (group === 'shorts' && command === 'list') return print(await api('/shorts'));
  if (group === 'analytics' && command === 'summary') {
    const query = flags.window ? `?window=${encodeURIComponent(flags.window)}` : '';
    return print(await api(`/analytics/summary${query}`));
  }
  throw new Error(`Unknown command: ${positional.join(' ')}`);
}
