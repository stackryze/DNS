// Generate copy-paste API snippets for the DNS API.
const BASE = import.meta.env.VITE_API_URL || 'https://api.stackryze.com/api';
const TOKEN_PLACEHOLDER = 'YOUR_API_TOKEN';

export function snippets(zoneId = 'ZONE_ID', token = TOKEN_PLACEHOLDER) {
  const auth = `-H "Authorization: Bearer ${token}"`;
  return [
    {
      id: 'list-zones',
      label: 'List zones',
      lang: 'bash',
      code: `curl ${BASE}/zones \\\n  ${auth}`,
    },
    {
      id: 'list-records',
      label: 'List records',
      lang: 'bash',
      code: `curl ${BASE}/zones/${zoneId}/records \\\n  ${auth}`,
    },
    {
      id: 'add-record',
      label: 'Add a record',
      lang: 'bash',
      code: `curl -X POST ${BASE}/zones/${zoneId}/records \\\n  ${auth} \\\n  -H "Content-Type: application/json" \\\n  -d '{"type":"A","name":"www","content":"93.184.216.34","ttl":3600}'`,
    },
    {
      id: 'batch',
      label: 'Batch create + delete',
      lang: 'bash',
      code: `curl -X POST ${BASE}/zones/${zoneId}/records/batch \\\n  ${auth} \\\n  -H "Content-Type: application/json" \\\n  -d '{"create":[{"type":"A","name":"@","content":"1.2.3.4","ttl":3600}],"delete":[]}'`,
    },
    {
      id: 'delete-record',
      label: 'Delete a record',
      lang: 'bash',
      code: `curl -X DELETE ${BASE}/zones/${zoneId}/records \\\n  ${auth} \\\n  -H "Content-Type: application/json" \\\n  -d '{"type":"A","name":"www","content":"93.184.216.34"}'`,
    },
  ];
}

export const API_BASE_URL = BASE;
