import React, { useState } from 'react';
import { Server, LayoutDashboard, Activity, Code2, Check, ArrowUpRight } from 'lucide-react';
import { CodeWindow, K, C, V, M } from '../CodeWindow';
import { cn } from '../../lib/utils';

const TABS = [
  { id: 'records', label: 'Records', icon: Server },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'checker', label: 'DNS Checker', icon: Activity },
  { id: 'api', label: 'API', icon: Code2 },
];

const CONTENT = {
  records: {
    title: 'Manage records in seconds',
    body: 'Add, edit, and delete every record type from one fast table — with per-type validation and instant propagation.',
    bullets: ['A, AAAA, CNAME, MX, TXT', 'SRV, CAA, NS, SVCB & HTTPS', 'Inline editing with rollback', 'Copy-ready values'],
  },
  dashboard: {
    title: 'Every zone at a glance',
    body: 'A clean, sortable dashboard for all your domains — status, record counts, and quick actions.',
    bullets: ['Sortable, filterable zones', 'Live status badges', '⌘K command palette', 'One-click zone creation'],
  },
  checker: {
    title: 'Verify from every resolver',
    body: 'Check records and nameserver propagation across public resolvers worldwide, instantly.',
    bullets: ['Google, Cloudflare, Quad9…', 'Propagation percentage', 'Per-resolver breakdown', 'Shareable results'],
  },
  api: {
    title: 'Automate everything',
    body: 'A standards-compliant JSON API and zone file export to script your DNS however you like.',
    bullets: ['REST API for zones & records', 'BIND zone file export', 'Idempotent operations', 'Token authentication'],
  },
};

const TYPE_TONE = { A: 'text-primary', CNAME: 'text-foreground', MX: 'text-warning', TXT: 'text-muted-foreground', AAAA: 'text-primary' };
function Chip({ t }) {
  return <span className={cn('inline-flex w-12 justify-center rounded border border-border bg-secondary py-0.5 font-mono text-[10px] font-semibold', TYPE_TONE[t] || 'text-foreground')}>{t}</span>;
}

function MockRecords() {
  const rows = [
    { t: 'A', n: '@', c: '192.0.2.10', ttl: '300' },
    { t: 'AAAA', n: '@', c: '2606:4700::6810', ttl: '300' },
    { t: 'CNAME', n: 'www', c: 'stackryze.com', ttl: '3600' },
    { t: 'MX', n: '@', c: '10 mail.stackryze.com', ttl: '3600' },
    { t: 'TXT', n: '@', c: 'v=spf1 include:_spf…', ttl: '3600' },
  ];
  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-[3rem_3rem_1fr_2.5rem] items-center gap-3 border-b border-border px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <span>Type</span><span>Name</span><span>Content</span><span className="text-right">TTL</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[3rem_3rem_1fr_2.5rem] items-center gap-3 border-b border-border px-4 py-3 last:border-0 transition-colors hover:bg-secondary/40">
          <Chip t={r.t} />
          <span className="font-mono text-xs text-foreground">{r.n}</span>
          <span className="truncate font-mono text-xs text-muted-foreground">{r.c}</span>
          <span className="text-right font-mono text-[11px] text-muted-foreground">{r.ttl}</span>
        </div>
      ))}
    </div>
  );
}

function MockDashboard() {
  const zones = [
    { n: 'stackryze.com', s: 'Active', tone: 'text-success', dot: 'bg-success', rec: 12 },
    { n: 'api.stackryze.dev', s: 'Active', tone: 'text-success', dot: 'bg-success', rec: 8 },
    { n: 'edge.stackryze.io', s: 'Pending', tone: 'text-warning', dot: 'bg-warning', rec: 3 },
  ];
  return (
    <div className="p-4">
      <div className="mb-3 grid grid-cols-3 gap-2">
        {[{ k: 'Zones', v: '3' }, { k: 'Active', v: '2' }, { k: 'Records', v: '23' }].map((s) => (
          <div key={s.k} className="rounded-lg border border-border bg-secondary/40 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
            <div className="font-display text-lg font-bold text-primary">{s.v}</div>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        {zones.map((z, i) => (
          <div key={i} className="flex items-center justify-between border-b border-border px-3 py-2.5 last:border-0">
            <span className="font-mono text-xs text-foreground">{z.n}</span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground">{z.rec} rec</span>
              <span className={cn('inline-flex items-center gap-1.5 text-[11px]', z.tone)}><span className={cn('h-1.5 w-1.5 rounded-full', z.dot)} />{z.s}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockChecker() {
  const res = [
    { p: 'Google', ok: true, v: 'ns1.stackryze.com' },
    { p: 'Cloudflare', ok: true, v: 'ns2.stackryze.com' },
    { p: 'Quad9', ok: true, v: 'ns3.stackryze.com' },
    { p: 'OpenDNS', ok: false, v: 'propagating…' },
  ];
  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Propagation</span>
        <span className="font-display text-lg font-bold text-primary">75%</span>
      </div>
      <div className="space-y-1.5">
        {res.map((r, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
            <span className="text-xs font-medium text-foreground">{r.p}</span>
            <span className={cn('font-mono text-[11px]', r.ok ? 'text-success' : 'text-warning')}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockApi() {
  return (
    <CodeWindow title="api.stackryze.com" lang="json" className="rounded-none border-0"
      stats={[{ label: 'method', value: 'POST' }, { label: 'status', value: '201' }, { label: 'time', value: '38ms' }]}>
      <div><M>$</M> <K>curl</K> -X POST https://api.stackryze.com<M>/zones/:id/records</M> \</div>
      <div className="pl-4"><M>-H</M> <V>"Authorization: Bearer •••"</V> \</div>
      <div className="pl-4"><M>-d</M> <V>{'{ "type":"A", "name":"@", "content":"192.0.2.10" }'}</V></div>
      <div className="mt-2"><C>// 201 Created</C></div>
      <div><M>{'{ '}</M><K>"id"</K><M>: </M><V>"rec_8f2a"</V><M>, </M><K>"status"</K><M>: </M><V>"active"</V><M>{' }'}</M></div>
    </CodeWindow>
  );
}

const MOCKS = { records: MockRecords, dashboard: MockDashboard, checker: MockChecker, api: MockApi };

export default function Capabilities() {
  const [tab, setTab] = useState('records');
  const c = CONTENT[tab];
  const Mock = MOCKS[tab];
  return (
    <section className="border-t border-white/[0.06]">
      <div className="container-custom py-32">
        <div className="max-w-2xl">
          <span className="eyebrow">Built-in capabilities</span>
          <h2 className="mt-6 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Everything, in one console.</h2>
          <p className="mt-5 text-lg text-muted-foreground">From records to propagation to automation — manage your entire DNS from a single fast interface.</p>
        </div>

        {/* Tab bar */}
        <div className="mt-12 flex flex-wrap gap-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                tab === id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-white/[0.02] text-muted-foreground hover:border-border-strong hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} /> {label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[1.5rem] border border-border bg-white/[0.02] p-8">
            <h3 className="text-2xl font-bold tracking-tight">{c.title}</h3>
            <p className="mt-3 text-muted-foreground">{c.body}</p>
            <ul className="mt-6 space-y-2.5">
              {c.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-foreground">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary"><Check className="h-3 w-3" strokeWidth={3} /></span>
                  {b}
                </li>
              ))}
            </ul>
            <a href="/login" className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Try it free <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
            </a>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card">
            <Mock />
          </div>
        </div>
      </div>
    </section>
  );
}
