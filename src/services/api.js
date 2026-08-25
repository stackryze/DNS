import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true, // send the ZITADEL session cookie (dns.sid)
  headers: { 'Content-Type': 'application/json' },
});

// Redirect to login on session expiry / unauthenticated.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const p = window.location.pathname;
      if (!p.includes('/login') && !p.includes('/signup')) {
        localStorage.removeItem('sr_auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/* ----------------------------- Auth ----------------------------- */
export const getMe = async () => (await api.get('/auth/me')).data;

/* ----------------------------- Zones ---------------------------- */
// -> { zones: [], limits: { zoneLimit, currentZones, remainingZones } }
export const getZones = async () => (await api.get('/zones')).data;

export const createZone = async (name) => (await api.post('/zones', { name })).data;

export const getZoneDetails = async (id, includeRecords = true) =>
  (await api.get(`/zones/${id}?rrsets=${includeRecords}`)).data;

// -> [ { name, type, ttl, records: [{ content, disabled }] } ]  (PowerDNS rrsets)
export const getZoneRecords = async (id, query = '', max = 100) =>
  (await api.get(`/zones/${id}/records`, { params: { q: query, max } })).data;

export const addRecord = async (zoneId, recordData) =>
  (await api.post(`/zones/${zoneId}/records`, recordData)).data; // { type, name, content, ttl }

export const deleteRecord = async (zoneId, name, type, content = null) =>
  (await api.delete(`/zones/${zoneId}/records`, { data: { name, type, content } })).data;

// Batch create/delete records in one request. -> { created, deleted, errors }
export const batchRecords = async (zoneId, { create = [], delete: del = [] }) =>
  (await api.post(`/zones/${zoneId}/records/batch`, { create, delete: del })).data;

// Copy all records from one zone into another. -> { created, errors }
export const cloneZone = async (zoneId, targetId) =>
  (await api.post(`/zones/${zoneId}/clone`, { targetId })).data;

export const deleteZone = async (id) => (await api.delete(`/zones/${id}`)).data;

export const verifyZone = async (id) => (await api.post(`/zones/${id}/verify`)).data;

export const verifyOwnership = async (id) => (await api.post(`/zones/${id}/verify-ownership`)).data;

export const exportZone = async (id, zoneName) => {
  const res = await api.get(`/zones/${id}/export`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${zoneName}.zone`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/* -------------------------- DNS Checker ------------------------- */
export const checkDnsRecord = async (domain, recordType) =>
  (await api.get(`/dns-checker/check/${domain}/${recordType}`)).data;

export const checkPropagation = async (domain) =>
  (await api.get(`/dns-checker/propagation/${domain}`)).data;

// One-click diagnostics for a domain. -> { domain, checks: { dns, email, website } }
export const diagnoseDomain = async (domain) =>
  (await api.get(`/dns-checker/diagnose/${domain}`)).data;

// Scan a domain's current live records across common types (for import).
export const scanDomain = async (domain, types = ['A', 'AAAA', 'CNAME', 'MX', 'TXT']) => {
  const results = await Promise.all(
    types.map(async (type) => {
      try {
        const data = await checkDnsRecord(domain, type);
        return { type, data };
      } catch {
        return { type, data: null };
      }
    })
  );
  return results;
};

/* --------------------------- API Tokens ------------------------- */
export const listTokens = async () => (await api.get('/tokens')).data;
export const createToken = async (name, scopes) => (await api.post('/tokens', { name, scopes })).data;
export const revokeToken = async (id) => (await api.delete(`/tokens/${id}`)).data;

/* ---------------------------- Audit ----------------------------- */
export const getAudit = async (limit = 50) => (await api.get('/audit', { params: { limit } })).data;
export const getZoneAudit = async (zoneId, limit = 50) =>
  (await api.get(`/audit/zone/${zoneId}`, { params: { limit } })).data;
export const revertAudit = async (auditId) => (await api.post(`/audit/${auditId}/revert`)).data;

/* ------------------------ Record metadata ----------------------- */
export const getRecordMeta = async (zoneId) => (await api.get(`/zones/${zoneId}/record-meta`)).data;
export const setRecordMeta = async (zoneId, recordKey, comment, labels) =>
  (await api.put(`/zones/${zoneId}/record-meta`, { recordKey, comment, labels })).data;

/* ------------------------- Temporary records -------------------- */
export const addTemporaryRecord = async (zoneId, payload) =>
  (await api.post(`/zones/${zoneId}/records/temporary`, payload)).data; // { type,name,content,ttl,expiresInMinutes }

/* ------------------------- Scheduled changes -------------------- */
export const getSchedule = async (zoneId) => (await api.get(`/zones/${zoneId}/schedule`)).data;
export const scheduleChange = async (zoneId, payload) =>
  (await api.post(`/zones/${zoneId}/schedule`, payload)).data; // { op, record, runAt }
export const cancelSchedule = async (zoneId, sid) =>
  (await api.delete(`/zones/${zoneId}/schedule/${sid}`)).data;

/* ----------------------------- DNSSEC --------------------------- */
export const getDnssec = async (zoneId) => (await api.get(`/zones/${zoneId}/dnssec`)).data;
export const enableDnssec = async (zoneId) => (await api.post(`/zones/${zoneId}/dnssec`)).data;
export const disableDnssec = async (zoneId) => (await api.delete(`/zones/${zoneId}/dnssec`)).data;

/* ---------------------------- Webhooks -------------------------- */
export const listWebhooks = async () => (await api.get('/webhooks')).data;
export const createWebhook = async (url, events) => (await api.post('/webhooks', { url, events })).data;
export const deleteWebhook = async (id) => (await api.delete(`/webhooks/${id}`)).data;

/* ---------------------------- Public ---------------------------- */
export const getLiveStats = async () => (await api.get('/public/stats')).data;

export default api;
