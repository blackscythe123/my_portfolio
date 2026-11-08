// Shared env helper: SITE_URL / BLOG_URL from process.env, falling back to a root .env file, then defaults.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

function parseEnvFile(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    else v = v.replace(/\s+#.*$/, '');
    out[m[1]] = v;
  }
  return out;
}

export function loadEnv() {
  const file = parseEnvFile(path.join(root, '.env'));
  const get = (k) => (process.env[k] || file[k] || '').trim().replace(/\/+$/, '');
  const SITE_URL = get('SITE_URL') || 'https://www.simiyonvinscentsamuel.tech';
  const BLOG_URL = get('BLOG_URL') || SITE_URL.replace('://www.', '://blog.');
  return { SITE_URL, BLOG_URL };
}
