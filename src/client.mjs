import { readConfig } from './config.mjs';
import { CliError } from './errors.mjs';
export async function api(path, options = {}) {
  const { baseUrl, token } = readConfig();
  if (!token) throw new CliError('Missing XRPLSOCIAL_TOKEN or config token', 2);
  const res = await fetch(`${baseUrl}/api/cli/v1${path}`, {
    method: options.method || 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await res.text();
  let data = {};
  if (text) {
    try { data = JSON.parse(text); }
    catch { throw new CliError(`Non-JSON response (${res.status})`, 1, { preview: text.slice(0, 300) }); }
  }
  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new CliError(msg, res.status === 401 || res.status === 403 ? 4 : 1, { status: res.status, response: data });
  }
  return data;
}
