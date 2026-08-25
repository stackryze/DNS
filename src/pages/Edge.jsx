import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Activity, Gauge, Globe2, Loader2, RefreshCw, ShieldCheck, ShieldAlert, Copy, Check } from 'lucide-react';
import { getEdgeOverview, getEdgeMetrics } from '../services/api';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { cn } from '../lib/utils';

function statusOf(item) {
  if (item.successRate >= 99 && item.targetsDown === 0) return { label: 'Healthy', tone: 'success', dot: 'bg-success' };
  if (item.successRate >= 90) return { label: 'Degraded', tone: 'warning', dot: 'bg-warning' };
  return { label: 'Unhealthy', tone: 'destructive', dot: 'bg-destructive' };
}

// Minimal dependency-free line chart for latency over time.
function LatencyChart({ points }) {
  const { p50Path, p95Path, max } = useMemo(() => {
    if (!points.length) return { p50Path: '', p95Path: '', max: 0 };
    const w = 600, h = 140, pad = 8;
    const max = Math.max(10, ...points.map((p) => p.latencyP95 || 0));
    const x = (i) => pad + (i / Math.max(1, points.length - 1)) * (w - pad * 2);
    const y = (v) => h - pad - (v / max) * (h - pad * 2);
    const line = (key) => points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p[key] || 0).toFixed(1)}`).join(' ');
    return { p50Path: line('latencyP50'), p95Path: line('latencyP95'), max };
  }, [points]);

  if (!points.length) return <div className="flex h-[140px] items-center justify-center text-sm text-muted-foreground">No data in range.</div>;
  return (
    <div>
      <svg viewBox="0 0 600 140" className="h-[140px] w-full">
        <path d={p95Path} fill="none" stroke="var(--warning)" strokeWidth="1.5" opacity="0.7" />
        <path d={p50Path} fill="none" stroke="var(--primary)" strokeWidth="1.5" />
      </svg>
      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> p50</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> p95</span>
        <span className="ml-auto font-mono">peak {Math.round(max)}ms</span>
      </div>
    </div>
  );
}

function SetupCard() {
  const [copied, setCopied] = useState(false);
  const cmd = 'docker run -d --name stackryze-edge \\\n  -e STACKRYZE_API_TOKEN=sk_dns_xxx \\\n  -e STACKRYZE_EDGE_REGION=mumbai \\\n  ghcr.io/stackryze/stackryze-edge:latest';
  return (
    <div className="panel rounded-xl p-6">
      <div className="mb-2 flex items-center gap-2"><Globe2 className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold text-foreground">Deploy an Edge agent</h2></div>
      <p className="mb-4 max-w-xl text-sm text-muted-foreground">
        Run the agent on your own compute in each region you care about. It measures DNS latency and target health from that location and reports aggregates here. No raw data leaves your infrastructure.
      </p>
      <div className="relative overflow-hidden rounded-lg border border-border bg-card">
        <button onClick={() => { navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="absolute right-2 top-2 rounded-md border border-border bg-background/80 p-1.5 text-muted-foreground hover:text-foreground">
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
        <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-muted-foreground"><code>{cmd}</code></pre>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Create a write-scoped token in <a href="/settings" className="text-primary hover:underline">Settings → API tokens</a>. Docs: <a href="https://github.com/stackryze/stackryze-edge" target="_blank" rel="noreferrer" className="text-primary hover:underline">stackryze-edge</a>.</p>
    </div>
  );
}

export default function Edge() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState([]);
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState('all');
  const [selected, setSelected] = useState(null); // { zoneId, zoneName }
  const [points, setPoints] = useState([]);
  const [loadingChart, setLoadingChart] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEdgeOverview();
      setOverview(data.overview || []);
      setRegions(data.regions || []);
    } catch {
      setOverview([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const loadChart = useCallback(async (zoneId, zoneName) => {
    setSelected({ zoneId, zoneName });
    setLoadingChart(true);
    try {
      const data = await getEdgeMetrics({ zoneId, region: region === 'all' ? undefined : region, hours: 24 });
      setPoints(data.points || []);
    } catch {
      setPoints([]);
    } finally {
      setLoadingChart(false);
    }
  }, [region]);

  const visible = useMemo(
    () => (region === 'all' ? overview : overview.filter((o) => o.region === region)),
    [overview, region]
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground"><Gauge className="h-6 w-6 text-primary" /> Edge monitoring</h1>
          <p className="mt-1 text-sm text-muted-foreground">DNS latency and target health from your own regions.</p>
        </div>
        <Button variant="outline" onClick={load}><RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} /> Refresh</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
      ) : overview.length === 0 ? (
        <SetupCard />
      ) : (
        <>
          {regions.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {['all', ...regions].map((r) => (
                <button key={r} onClick={() => setRegion(r)} className={cn('rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors', region === r ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground')}>
                  {r === 'all' ? 'All regions' : r}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => {
              const st = statusOf(item);
              const zoneId = item._id?.zone;
              const active = selected?.zoneId === zoneId;
              return (
                <button
                  key={`${zoneId}-${item.region}`}
                  onClick={() => loadChart(zoneId, item.zoneName)}
                  className={cn('panel rounded-xl p-4 text-left transition-colors', active ? 'border-primary' : 'hover:border-border-strong')}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-sm font-medium text-foreground">{item.zoneName}</span>
                    <Badge variant={st.tone}><span className={cn('h-1.5 w-1.5 rounded-full', st.dot)} />{st.label}</Badge>
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{item.region}</div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div><div className="font-display text-lg font-bold text-foreground">{Math.round(item.latencyP50)}<span className="text-xs text-muted-foreground">ms</span></div><div className="text-[10px] text-muted-foreground">p50</div></div>
                    <div><div className="font-display text-lg font-bold text-foreground">{Math.round(item.latencyP95)}<span className="text-xs text-muted-foreground">ms</span></div><div className="text-[10px] text-muted-foreground">p95</div></div>
                    <div><div className="font-display text-lg font-bold text-foreground">{item.successRate.toFixed(1)}<span className="text-xs text-muted-foreground">%</span></div><div className="text-[10px] text-muted-foreground">success</div></div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 text-success"><ShieldCheck className="h-3.5 w-3.5" /> {item.targetsUp} up</span>
                    {item.targetsDown > 0 && <span className="inline-flex items-center gap-1 text-destructive"><ShieldAlert className="h-3.5 w-3.5" /> {item.targetsDown} down</span>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="panel rounded-xl p-5">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Latency (24h){selected ? <span className="text-muted-foreground"> · <span className="font-mono">{selected.zoneName}</span></span> : ''}</h2>
            </div>
            {!selected ? (
              <div className="flex h-[140px] items-center justify-center text-sm text-muted-foreground">Select a zone above to see its latency trend.</div>
            ) : loadingChart ? (
              <div className="flex h-[140px] items-center justify-center text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /></div>
            ) : (
              <LatencyChart points={points} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
