import React, { useState } from 'react';
import { Globe, Zap, ShieldCheck } from 'lucide-react';
import WorldMap from '../WorldMap';
import { cn } from '../../lib/utils';

const REGIONS = [
  { code: 'JFK', city: 'New York', cont: 'Americas', ms: 18, ns: 'ns1.stackryze.com' },
  { code: 'FRA', city: 'Frankfurt', cont: 'Europe', ms: 11, ns: 'ns2.stackryze.com' },
  { code: 'HYD', city: 'Hyderabad', cont: 'Asia', ms: 24, ns: 'ns3.stackryze.com' },
];
const FILTERS = ['All', 'Americas', 'Europe', 'Asia'];

export default function GlobalMap() {
  const [filter, setFilter] = useState('All');
  const shown = filter === 'All' ? REGIONS : REGIONS.filter((r) => r.cont === filter);

  return (
    <section id="network" className="scroll-mt-28 border-t border-white/[0.06]">
      <div className="container-custom py-32">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow"><Globe className="h-3 w-3" strokeWidth={2} /> Global anycast</span>
            <h2 className="mt-6 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Answered from the nearest edge.</h2>
            <p className="mt-5 text-lg text-muted-foreground">Authoritative nameservers on three continents resolve every query from the closest location — no configuration required.</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-300',
                  filter === f ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-white/[0.02] text-muted-foreground hover:text-foreground'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card p-2">
            <WorldMap />
          </div>
          <div className="flex flex-col gap-3">
            {shown.map((r) => (
              <div key={r.code} className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:border-border-strong">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-primary">{r.code}</span>
                    <span className="font-medium text-foreground">{r.city}</span>
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{r.ns}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-success">{r.ms}ms</div>
                  <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-success" /> online</div>
                </div>
              </div>
            ))}
            <div className="mt-1 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card px-4 py-3.5">
                <Zap className="h-4 w-4 text-primary" strokeWidth={1.75} />
                <div className="mt-2 font-display text-lg font-bold">&lt;30ms</div>
                <div className="text-[11px] text-muted-foreground">Median latency</div>
              </div>
              <div className="rounded-2xl border border-border bg-card px-4 py-3.5">
                <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.75} />
                <div className="mt-2 font-display text-lg font-bold">99.9%</div>
                <div className="text-[11px] text-muted-foreground">Uptime target</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
