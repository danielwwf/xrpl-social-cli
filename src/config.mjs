import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const DEFAULT_BASE_URL = 'https://dev.xrpl.social';
export function configPath() {
  if (process.env.XRPLSOCIAL_CONFIG) return process.env.XRPLSOCIAL_CONFIG;
  return path.join(os.homedir(), '.config', 'xrplsocial', 'config.json');
}
export function readConfig() {
  const file = configPath();
  let fileConfig = {};
  if (fs.existsSync(file)) fileConfig = JSON.parse(fs.readFileSync(file, 'utf8'));
  return {
    baseUrl: process.env.XRPLSOCIAL_BASE_URL || fileConfig.baseUrl || DEFAULT_BASE_URL,
    token: process.env.XRPLSOCIAL_TOKEN || fileConfig.token || null,
  };
}
export function writeConfig(nextConfig) {
  const file = configPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(nextConfig, null, 2) + '\n');
  return file;
}
