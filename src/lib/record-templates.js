// One-click DNS record presets. Tokens {domain} and {domain-dashed} are replaced
// with the zone name at apply time. Records use '@' for the apex.
export const RECORD_TEMPLATES = [
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    category: 'Email',
    description: 'Route email through Google Workspace (Gmail) with SPF.',
    records: [
      { type: 'MX', name: '@', content: '1 smtp.google.com', ttl: 3600 },
      { type: 'TXT', name: '@', content: 'v=spf1 include:_spf.google.com ~all', ttl: 3600 },
    ],
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    category: 'Email',
    description: 'Exchange Online mail routing, autodiscover and SPF.',
    records: [
      { type: 'MX', name: '@', content: '0 {domain-dashed}.mail.protection.outlook.com', ttl: 3600 },
      { type: 'CNAME', name: 'autodiscover', content: 'autodiscover.outlook.com', ttl: 3600 },
      { type: 'TXT', name: '@', content: 'v=spf1 include:spf.protection.outlook.com -all', ttl: 3600 },
    ],
  },
  {
    id: 'zoho-mail',
    name: 'Zoho Mail',
    category: 'Email',
    description: 'Zoho Mail exchangers with SPF.',
    records: [
      { type: 'MX', name: '@', content: '10 mx.zoho.com', ttl: 3600 },
      { type: 'MX', name: '@', content: '20 mx2.zoho.com', ttl: 3600 },
      { type: 'TXT', name: '@', content: 'v=spf1 include:zoho.com ~all', ttl: 3600 },
    ],
  },
  {
    id: 'email-security',
    name: 'Email security (SPF + DMARC)',
    category: 'Email',
    description: 'Lock down spoofing for a domain that sends no mail.',
    records: [
      { type: 'TXT', name: '@', content: 'v=spf1 -all', ttl: 3600 },
      { type: 'TXT', name: '_dmarc', content: 'v=DMARC1; p=reject; rua=mailto:dmarc@{domain}', ttl: 3600 },
    ],
  },
  {
    id: 'github-pages',
    name: 'GitHub Pages',
    category: 'Hosting',
    description: 'Point an apex domain at GitHub Pages (IPv4 + IPv6).',
    records: [
      { type: 'A', name: '@', content: '185.199.108.153', ttl: 3600 },
      { type: 'A', name: '@', content: '185.199.109.153', ttl: 3600 },
      { type: 'A', name: '@', content: '185.199.110.153', ttl: 3600 },
      { type: 'A', name: '@', content: '185.199.111.153', ttl: 3600 },
      { type: 'AAAA', name: '@', content: '2606:50c0:8000::153', ttl: 3600 },
      { type: 'AAAA', name: '@', content: '2606:50c0:8001::153', ttl: 3600 },
    ],
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'Hosting',
    description: 'Apex A record and www CNAME for a Vercel deployment.',
    records: [
      { type: 'A', name: '@', content: '76.76.21.21', ttl: 3600 },
      { type: 'CNAME', name: 'www', content: 'cname.vercel-dns.com', ttl: 3600 },
    ],
  },
  {
    id: 'netlify',
    name: 'Netlify',
    category: 'Hosting',
    description: 'Apex A record for Netlify load balancing.',
    records: [
      { type: 'A', name: '@', content: '75.2.60.5', ttl: 3600 },
    ],
  },
  {
    id: 'basic-website',
    name: 'Basic website (A + www)',
    category: 'Hosting',
    description: 'A record on the apex with a www alias — edit the IP after applying.',
    records: [
      { type: 'A', name: '@', content: '93.184.216.34', ttl: 3600 },
      { type: 'CNAME', name: 'www', content: '{domain}', ttl: 3600 },
    ],
  },
];

const strip = (s) => (s && s.endsWith('.') ? s.slice(0, -1) : s);

// Replace tokens in a template record with the concrete zone name.
export function applyTemplateTokens(record, zoneName) {
  const domain = strip(zoneName);
  const dashed = domain.replace(/\./g, '-');
  return {
    ...record,
    content: record.content.replace(/\{domain-dashed\}/g, dashed).replace(/\{domain\}/g, domain),
  };
}
