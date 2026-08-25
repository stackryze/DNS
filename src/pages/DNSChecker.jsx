import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw, Globe, Activity } from 'lucide-react';
import { checkDnsRecord, checkPropagation } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { cn } from '../lib/utils';

const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'SRV', 'CAA', 'PTR'];

// Normalize either { results:[{resolver,records,status}] } or a keyed object into rows.
function normalizeResolvers(data) {
  if (!data) return [];
  const list = Array.isArray(data.results)
    ? data.results
    : Array.isArray(data.details)
      ? data.details
      : Object.values(data.results || data.details || {});
  return list.map((r, i) => ({
    id: i,
    provider: r.provider || r.resolver || r.name || 'Resolver',
    records: r.records || r.currentNS || [],
    ok: r.status === 'success' || r.status === 'ok' || r.success || r.hasStackryzeNS || (r.records && r.records.length > 0),
    error: r.error || (r.status === 'error' ? 'Query failed' : null),
    servers: r.servers,
  }));
}

export default function DNSChecker() {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('NS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // { title, domain, rows, propagation? }

  const run = async (mode) => {
    if (!domain) return;
    setLoading(true); setError(null); setResult(null);
    try {
      if (mode === 'propagation') {
        const data = await checkPropagation(domain.trim());
        setResult({ title: 'NS propagation', domain: data.domain || domain, rows: normalizeResolvers(data), propagation: data });
      } else {
        const data = await checkDnsRecord(domain.trim(), recordType);
        setResult({ title: `${recordType} records`, domain: data.domain || domain, rows: normalizeResolvers(data) });
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Lookup failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary"><Activity className="h-5 w-5 text-primary" /></span>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">DNS Checker</h1>
        </div>
        <p className="text-sm text-muted-foreground">Check DNS records and nameserver propagation across public resolvers.</p>
      </div>

      <div className="panel rounded-xl p-4 md:p-6">
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="dns-domain" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Domain name</label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="dns-domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" className="pl-10 font-mono" onKeyDown={(e) => e.key === 'Enter' && run('check')} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Record type</label>
            <Select value={recordType} onValueChange={setRecordType}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>{RECORD_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => run('check')} disabled={loading || !domain} className="flex-1">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Check DNS records</Button>
          <Button variant="secondary" onClick={() => run('propagation')} disabled={loading || !domain}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Check NS propagation</Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
          <span className="font-medium text-destructive">{error}</span>
        </div>
      )}

      {loading && (
        <div className="panel space-y-3 rounded-xl p-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-3">
          {result.propagation && (
            <div className="panel grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-border">
              <Metric label="Propagation" value={`${result.propagation.propagationPercentage ?? 0}%`} tone="text-primary" />
              <Metric label="Resolvers" value={`${result.propagation.summary?.valid ?? result.rows.filter(r => r.ok).length}/${result.propagation.summary?.total ?? result.rows.length}`} tone="text-success" />
              <Metric label="Status" value={result.propagation.propagated ? 'Propagated' : 'Propagating…'} tone={result.propagation.propagated ? 'text-success' : 'text-warning'} />
            </div>
          )}

          <div className="panel overflow-hidden rounded-xl">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-sm font-medium text-foreground">Results for <span className="font-mono text-primary">{result.domain}</span> · {result.title}</h3>
            </div>
            <div className="divide-y divide-border">
              {result.rows.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">No records returned.</div>
              ) : result.rows.map((r) => (
                <div key={r.id} className="flex items-start gap-3 px-4 py-3">
                  <div className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md', r.error ? 'bg-destructive/10 text-destructive' : r.ok ? 'bg-success/10 text-success' : 'bg-secondary text-muted-foreground')}>
                    {r.error ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{r.provider}</span>
                      {result.propagation && r.ok && <Badge variant="success">Stackryze NS</Badge>}
                    </div>
                    {r.error ? (
                      <p className="mt-1 font-mono text-xs text-destructive/80">{r.error}</p>
                    ) : (
                      <div className="mt-1 space-y-0.5">
                        {(Array.isArray(r.records) ? r.records : [r.records]).filter(Boolean).map((rec, i) => (
                          <p key={i} className="break-all font-mono text-xs text-muted-foreground">{typeof rec === 'object' ? JSON.stringify(rec) : rec}</p>
                        ))}
                        {(!r.records || r.records.length === 0) && <p className="text-xs italic text-muted-foreground">No records</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, tone }) {
  return (
    <div className="bg-card px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('mt-1 font-display text-lg font-semibold', tone)}>{value}</p>
    </div>
  );
}
