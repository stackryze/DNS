import React, { useState } from 'react';
import { Globe, Zap, ShieldCheck } from 'lucide-react';
import { DottedMap } from '../ui/dotted-map';
import { cn } from '../../lib/utils';

const REGIONS = [
  { code: 'JFK', city: 'New York', cont: 'Americas', ms: 18, ns: 'ns1.stackryze.com', lat: 40.71, lng: -74.0 },
  { code: 'FRA', city: 'Frankfurt', cont: 'Europe', ms: 11, ns: 'ns2.stackryze.com', lat: 50.11, lng: 8.68 },
  { code: 'HYD', city: 'Hyderabad', cont: 'Asia', ms: 24, ns: 'ns3.stackryze.com', lat: 17.38, lng: 78.48 },
];
const FILTERS = ['All', 'Americas', 'Europe', 'Asia'];

export default function GlobalMap() {
  const [filter, setFilter] = useState('All');
  const shown = filter === 'All' ? REGIONS : REGIONS.filter((r) => r.cont === filter);
  const markers = shown.map((r) => ({ lat: r.lat, lng: r.lng, size: 0.85, pulse: true }));

  return (
    <section id="network" className="scroll-mt-28 border-t border-white/[0.06]">
      <div className="container-custom py-32">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow"><Globe className="h-3 w-3" strokeWidth={2} /> Global network</span>
            <h2 className="mt-6 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Nameservers across three continents.</h2>
            <p className="mt-5 text-lg text-muted-foreground">Authoritative nameservers in three regions keep your DNS resilient and highly available — no configuration required.</p>
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

        {/* Big full-width map */}
        <div className="relative mt-12 overflow-hidden rounded-[1.75rem] border border-border bg-card">
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[55%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-[120px]" />
          <div className="relative px-4 py-8 sm:px-10 sm:py-12">
            <DottedMap
              width={165}
              height={78}
              mapSamples={7000}
              markers={markers}
              dotColor="currentColor"
              markerColor="#eac53a"
              dotRadius={0.3}
              className="text-white/[0.13]"
            />
          </div>
          <div className="grid grid-cols-1 divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {REGIONS.map((r) => {
              const active = filter === 'All' || filter === r.cont;
              return (
                <div key={r.code} className={cn('flex items-center justify-between gap-3 px-5 py-4 transition-opacity', !active && 'opacity-35')}>
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
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Globe, v: '3', l: 'Regions' },
            { icon: Zap, v: '<30ms', l: 'Median latency' },
            { icon: ShieldCheck, v: '99.9%', l: 'Uptime target' },
            { icon: Zap, v: '3', l: 'Redundant NS' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card px-5 py-4">
              <s.icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
              <div className="mt-2 font-display text-xl font-bold">{s.v}</div>
              <div className="text-[11px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
