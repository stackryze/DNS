// Parse pasted BIND zone files or CSV into normalized record objects
// { type, name, content, ttl }. Names are relative labels ('@' for apex).
const SUPPORTED = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'SRV', 'CAA'];
const DEFAULT_TTL = 3600;

const strip = (s) => (s && s.endsWith('.') ? s.slice(0, -1) : s);

function toLabel(name, origin) {
  if (!name || name === '@') return '@';
  let n = strip(name);
  if (origin) {
    const o = strip(origin);
    if (n === o) return '@';
    if (n.endsWith(`.${o}`)) return n.slice(0, -(o.length + 1));
  }
  return n;
}

function parseBind(text, origin) {
  const records = [];
  let curOrigin = origin || '';
  let curTtl = DEFAULT_TTL;
  let lastName = '@';

  for (const raw of text.split('\n')) {
    let line = raw.replace(/;.*$/, '').trim(); // strip comments
    if (!line) continue;

    if (line.startsWith('$ORIGIN')) { curOrigin = line.split(/\s+/)[1] || curOrigin; continue; }
    if (line.startsWith('$TTL')) { const t = parseInt(line.split(/\s+/)[1]); if (!isNaN(t)) curTtl = t; continue; }
    if (line.startsWith('$')) continue;

    // Leading whitespace means "reuse previous name".
    const hasName = !/^\s/.test(raw);
    const tokens = line.split(/\s+/);
    let i = 0;
    let name = lastName;
    if (hasName) { name = tokens[i++]; lastName = name; }

    let ttl = curTtl;
    if (/^\d+$/.test(tokens[i])) ttl = parseInt(tokens[i++]);
    if ((tokens[i] || '').toUpperCase() === 'IN') i++;
    if (/^\d+$/.test(tokens[i])) ttl = parseInt(tokens[i++]);

    const type = (tokens[i++] || '').toUpperCase();
    if (!SUPPORTED.includes(type)) continue;

    let content = tokens.slice(i).join(' ').trim();
    if (type === 'TXT') content = content.replace(/^"|"$/g, '');
    else content = strip(content);
    if (!content) continue;

    records.push({ type, name: toLabel(name, curOrigin), content, ttl });
  }
  return records;
}

function parseCsv(text) {
  const rows = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (rows.length === 0) return [];
  const first = rows[0].toLowerCase();
  const hasHeader = first.includes('type') && first.includes('content');
  const out = [];
  for (const row of rows.slice(hasHeader ? 1 : 0)) {
    const cols = row.split(',').map((c) => c.trim());
    if (cols.length < 3) continue;
    const [type, name, content, ttl] = cols;
    const t = type.toUpperCase();
    if (!SUPPORTED.includes(t)) continue;
    out.push({ type: t, name: name || '@', content, ttl: parseInt(ttl) || DEFAULT_TTL });
  }
  return out;
}

// Auto-detects CSV vs BIND. Returns parsed records (may be empty).
export function parseZoneText(text, origin) {
  if (!text || !text.trim()) return [];
  const looksCsv = /(^|\n)\s*type\s*,/i.test(text) || text.split('\n')[0].split(',').length >= 3;
  return looksCsv ? parseCsv(text) : parseBind(text, origin);
}

export { SUPPORTED as SUPPORTED_TYPES };
