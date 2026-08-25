import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Globe2, Boxes, Gauge, Code2, ShieldCheck, LayoutDashboard, Github, Terminal } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import WorldMap from '../components/WorldMap';
import StatsDisplay from '../components/StatsDisplay';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

function Reveal({ children, delay = 0, className }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const POPS = [
  { city: 'New York', region: 'North America', code: 'JFK' },
  { city: 'Frankfurt', region: 'Europe', code: 'FRA' },
  { city: 'Hyderabad', region: 'Asia', code: 'HYD' },
];

const STEPS = [
  { n: '01', title: 'Add your domain', body: 'Create a zone in seconds. We generate your records and nameservers instantly.' },
  { n: '02', title: 'Point your nameservers', body: 'Update NS records at your registrar to ns1–ns3.stackryze.com.' },
  { n: '03', title: 'Resolve worldwide', body: 'Queries answer from the nearest edge the moment propagation completes.' },
];

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade opacity-40" />
          <div className="container-custom grid items-center gap-14 pt-28 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-32 lg:pb-28">
            <Reveal>
              <div className="max-w-xl">
                <a href="#network" className="group mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] py-1 pl-1.5 pr-3 text-sm text-muted-foreground backdrop-blur transition-colors hover:border-border-strong hover:text-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Live
                  </span>
                  Serving from 3 global regions
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>

                <h1 className="text-fade text-4xl font-semibold leading-[1.03] tracking-[-0.02em] sm:text-5xl lg:text-[3.75rem]">
                  Authoritative DNS
                  <br />
                  built for developers.
                </h1>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                  Free, open-source DNS hosting on a global anycast network. Manage every zone from a clean dashboard and serve queries from the nearest edge.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg"><Link to="/login">Get started free <ArrowRight className="h-4 w-4" /></Link></Button>
                  <Button asChild size="lg" variant="outline"><a href="https://dns-docs.stackryze.com" target="_blank" rel="noreferrer">Read the docs</a></Button>
                </div>

                <dl className="mt-12 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
                  {[{ v: '3', l: 'Regions' }, { v: '<30ms', l: 'Median' }, { v: '100%', l: 'Free' }].map((s) => (
                    <div key={s.l} className="bg-card px-4 py-3.5">
                      <dt className="font-display text-xl font-semibold text-foreground">{s.v}</dt>
                      <dd className="mt-0.5 text-xs text-muted-foreground">{s.l}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="panel hairline-top glow-ring overflow-hidden rounded-2xl p-2.5">
                <div className="flex items-center gap-2 px-2 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                  <span className="ml-2 font-mono text-xs text-muted-foreground">anycast-network · live</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-2 py-0.5 font-mono text-[10px] text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> operational
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-background/50 px-3 pt-2"><WorldMap /></div>
                <div className="mt-2.5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
                  {[{ code: 'JFK', city: 'New York', ms: '18ms' }, { code: 'FRA', city: 'Frankfurt', ms: '11ms' }, { code: 'HYD', city: 'Hyderabad', ms: '24ms' }].map((r) => (
                    <div key={r.code} className="bg-card px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-foreground">{r.code}</span>
                        <span className="font-mono text-[10px] text-success">{r.ms}</span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{r.city}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Live stats */}
        <section className="relative">
          <div className="container-custom py-12">
            <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Live nameserver statistics</p>
            <StatsDisplay />
          </div>
        </section>

        {/* Features bento */}
        <section id="features" className="scroll-mt-24">
          <div className="container-custom py-24">
            <Reveal className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything you need to run DNS.</h2>
              <p className="mt-4 text-lg text-muted-foreground">No enterprise pricing, no hidden tiers. Just fast, standards-compliant DNS with the records modern apps actually use.</p>
            </Reveal>

            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              <Reveal className="lg:col-span-2">
                <article className="panel group flex h-full flex-col justify-between overflow-hidden rounded-xl p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-secondary text-primary"><Globe2 className="h-5 w-5" /></div>
                    <Boxes className="h-24 w-24 text-primary/10 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold">Global anycast network</h3>
                    <p className="mt-2 max-w-md text-muted-foreground">Authoritative nameservers across three continents answer every query from the location closest to your visitor.</p>
                  </div>
                </article>
              </Reveal>

              <Reveal delay={0.06} className="lg:row-span-2">
                <article className="hairline-top flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-gradient-to-b from-primary/12 to-card p-8 shadow-[var(--shadow-elev-2)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary"><ShieldCheck className="h-5 w-5" /></div>
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold">Open source &amp; non-profit</h3>
                    <p className="mt-2 text-muted-foreground">Built on transparent, community-driven software and free for everyone. No lock-in, no upsell.</p>
                    <a href="https://github.com/stackryze/DNS" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"><Github className="h-4 w-4" /> Star on GitHub</a>
                  </div>
                </article>
              </Reveal>

              <Reveal delay={0.04}>
                <article className="panel h-full rounded-xl p-8">
                  <div className="flex items-center gap-3"><Boxes className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Modern record types</h3></div>
                  <p className="mt-3 text-sm text-muted-foreground">Native support for SVCB, HTTPS, TLSA, CAA and every common record.</p>
                </article>
              </Reveal>

              <Reveal delay={0.08}>
                <article className="panel h-full rounded-xl p-8">
                  <div className="flex items-center gap-3"><LayoutDashboard className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Fast, clean dashboard</h3></div>
                  <p className="mt-3 text-sm text-muted-foreground">Manage zones and records in a UI that stays out of your way.</p>
                </article>
              </Reveal>

              <Reveal delay={0.1} className="lg:col-span-2">
                <article className="panel flex h-full flex-col justify-between gap-6 rounded-xl p-8 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-secondary text-primary"><Code2 className="h-5 w-5" /></div>
                      <Badge variant="warning">In development</Badge>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold">Developer REST API</h3>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">Automate zones and records with a standards-compliant JSON API.</p>
                  </div>
                  <div className="w-full max-w-xs rounded-lg border border-border bg-background/60 p-4 font-mono text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 text-muted-foreground/70"><Terminal className="h-3.5 w-3.5" /> curl</div>
                    <p className="mt-2 leading-relaxed"><span className="text-primary">POST</span> /api/zones/:id/records</p>
                  </div>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Network */}
        <section id="network" className="scroll-mt-24 border-t border-border">
          <div className="container-custom grid items-center gap-14 py-24 lg:grid-cols-2">
            <Reveal>
              <div className="panel hairline-top overflow-hidden rounded-2xl p-4"><WorldMap /></div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <Badge variant="default" className="mb-5"><Gauge className="h-3.5 w-3.5" /> Low latency, worldwide</Badge>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Strategically placed edge locations.</h2>
                <p className="mt-4 max-w-md text-lg text-muted-foreground">Every query is answered from the nearest authoritative nameserver, keeping resolution fast and resilient no matter where your users are.</p>
                <ul className="mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border">
                  {POPS.map((pop) => (
                    <li key={pop.code} className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-success" />
                        <span className="font-medium">{pop.city}</span>
                        <span className="text-sm text-muted-foreground">{pop.region}</span>
                      </div>
                      <span className="font-mono text-sm text-muted-foreground">{pop.code}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Quickstart */}
        <section className="border-t border-border">
          <div className="container-custom py-24">
            <Reveal className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">From registrar to resolved in minutes.</h2>
            </Reveal>
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.08}>
                  <div className="panel h-full rounded-xl p-8">
                    <span className="font-mono text-sm text-primary">{step.n}</span>
                    <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border">
          <div className="container-custom py-24">
            <Reveal>
              <div className="panel hairline-top relative overflow-hidden rounded-2xl px-8 py-16 text-center sm:px-16">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-40" />
                <div className="pointer-events-none absolute left-1/2 top-full -z-10 h-72 w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
                <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Point your first domain at Stackryze DNS.</h2>
                <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">Free, open, and ready when you are. Create a zone in under a minute.</p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                  <Button asChild size="lg"><Link to="/login">Get started free <ArrowUpRight className="h-4 w-4" /></Link></Button>
                  <Button asChild size="lg" variant="outline"><a href="https://github.com/stackryze/DNS" target="_blank" rel="noreferrer">View on GitHub</a></Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
