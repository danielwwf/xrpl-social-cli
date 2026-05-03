import { readConfig } from './config.mjs';
export async function api(path, options = {}) {
  const { baseUrl, token } = readConfig();
  if (!token) throw new Error('Missing XRPLSOCIAL_TOKEN or config token');
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
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 300)}`); }
  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}
