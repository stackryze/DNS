import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Globe2, Boxes, Gauge, Code2, ShieldCheck, LayoutDashboard, Github, Terminal } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import WorldMap from '../components/WorldMap';
import StatsDisplay from '../components/StatsDisplay';

const EASE = [0.16, 1, 0.3, 1];

// Above-the-fold uses mount animation (visible immediately, then enhances);
// below-the-fold uses scroll-triggered reveal.
function Reveal({ children, delay = 0, className, mount = false }) {
  const reduce = useReducedMotion();
  const anim = { opacity: 1, y: 0, filter: 'blur(0px)' };
  const init = reduce ? false : { opacity: 0, y: 28, filter: 'blur(8px)' };
  return (
    <motion.div
      className={className}
      initial={init}
      {...(mount ? { animate: anim } : { whileInView: anim, viewport: { once: true, amount: 0.25 } })}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// Button-in-button pill CTA with a nested circular trailing icon.
function CTA({ to, href, children, tone = 'solid' }) {
  const solid = 'bg-foreground text-background';
  const glass = 'border border-white/10 bg-white/[0.03] text-foreground hover:bg-white/[0.06]';
  const inner = tone === 'solid' ? 'bg-background/15' : 'bg-white/[0.06]';
  const cls = `group inline-flex items-center gap-3 rounded-full py-1.5 pl-6 pr-1.5 text-[15px] font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${tone === 'solid' ? solid : glass}`;
  const body = (
    <>
      {children}
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${inner} transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-[1px]`}>
        <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
      </span>
    </>
  );
  return to ? <Link to={to} className={cls}>{body}</Link> : <a href={href} target="_blank" rel="noreferrer" className={cls}>{body}</a>;
}

const POPS = [
  { city: 'New York', region: 'North America', code: 'JFK', ms: '18ms' },
  { city: 'Frankfurt', region: 'Europe', code: 'FRA', ms: '11ms' },
  { city: 'Hyderabad', region: 'Asia', code: 'HYD', ms: '24ms' },
];

const STEPS = [
  { n: '01', title: 'Add your domain', body: 'Create a zone in seconds. We generate your records and nameservers instantly.' },
  { n: '02', title: 'Point your nameservers', body: 'Update NS records at your registrar to ns1–ns3.stackryze.com.' },
  { n: '03', title: 'Resolve worldwide', body: 'Queries answer from the nearest edge the moment propagation completes.' },
];

export default function Landing() {
  return (
    <div className="flex min-h-[100dvh] flex-col text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade opacity-30" />
          <div className="container-custom grid items-center gap-16 pt-40 pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:pt-44 lg:pb-32">
            <div>
              <Reveal mount>
                <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Global anycast DNS</span>
              </Reveal>
              <Reveal mount delay={0.06}>
                <h1 className="text-fade mt-6 text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-[4.75rem]">
                  Authoritative DNS,<br />resolved everywhere.
                </h1>
              </Reveal>
              <Reveal mount delay={0.12}>
                <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">
                  Free, open-source DNS on a global anycast network. Manage every zone from a clean dashboard and answer queries from the nearest edge.
                </p>
              </Reveal>
              <Reveal mount delay={0.18}>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <CTA to="/login">Start for free</CTA>
                  <CTA href="https://dns-docs.stackryze.com" tone="glass">Read the docs</CTA>
                </div>
              </Reveal>
              <Reveal mount delay={0.24}>
                <div className="mt-14 flex items-center gap-8">
                  {[{ v: '3', l: 'Global regions' }, { v: '<30ms', l: 'Median latency' }, { v: '100%', l: 'Free forever' }].map((s, i) => (
                    <React.Fragment key={s.l}>
                      {i > 0 && <span className="h-8 w-px bg-white/10" />}
                      <div>
                        <div className="font-display text-2xl font-semibold tracking-tight">{s.v}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{s.l}</div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Double-bezel product panel */}
            <Reveal mount delay={0.15}>
              <div className="shell">
                <div className="core overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="font-mono text-xs text-muted-foreground">anycast · stackryze.com</span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-success">
                      <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full rounded-full bg-success/60" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" /></span>
                      Live
                    </span>
                  </div>
                  <div className="border-t border-white/[0.06] px-2"><WorldMap /></div>
                  <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.06]">
                    {POPS.map((r) => (
                      <div key={r.code} className="px-4 py-3.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold">{r.code}</span>
                          <span className="font-mono text-[10px] text-success">{r.ms}</span>
                        </div>
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{r.city}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Live stats */}
        <section className="relative">
          <div className="container-custom pb-8">
            <Reveal>
              <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Live nameserver statistics</p>
              <StatsDisplay />
            </Reveal>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-28">
          <div className="container-custom py-32">
            <Reveal className="max-w-2xl">
              <span className="eyebrow">Built for developers</span>
              <h2 className="mt-6 text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">Everything you need to run DNS.</h2>
              <p className="mt-5 text-lg text-muted-foreground">No enterprise tiers, no hidden limits. Fast, standards-compliant DNS with the records modern apps actually use.</p>
            </Reveal>

            <div className="mt-16 grid gap-5 lg:grid-cols-3">
              <Reveal className="lg:col-span-2">
                <article className="group flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-white/[0.02] p-9 transition-colors duration-500 hover:border-white/[0.12]">
                  <div className="flex items-start justify-between">
                    <Globe2 className="h-6 w-6 text-primary" strokeWidth={1.5} />
                    <Boxes className="h-28 w-28 text-white/[0.04] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 group-hover:text-primary/10" strokeWidth={1} />
                  </div>
                  <div className="mt-10">
                    <h3 className="text-xl font-semibold">Global anycast network</h3>
                    <p className="mt-2 max-w-md text-muted-foreground">Authoritative nameservers across three continents answer every query from the location closest to your visitor.</p>
                  </div>
                </article>
              </Reveal>

              <Reveal delay={0.08} className="lg:row-span-2">
                <article className="flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-primary/15 bg-gradient-to-b from-primary/[0.12] to-transparent p-9">
                  <ShieldCheck className="h-6 w-6 text-primary" strokeWidth={1.5} />
                  <div className="mt-10">
                    <h3 className="text-xl font-semibold">Open source &amp; non-profit</h3>
                    <p className="mt-2 text-muted-foreground">Built on transparent, community-driven software and free for everyone. No lock-in, no upsell, ever.</p>
                    <a href="https://github.com/stackryze/DNS" target="_blank" rel="noreferrer" className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary">
                      <Github className="h-4 w-4" strokeWidth={1.5} /> Star on GitHub
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                    </a>
                  </div>
                </article>
              </Reveal>

              <Reveal delay={0.04}>
                <article className="h-full rounded-[1.75rem] border border-white/[0.07] bg-white/[0.02] p-9 transition-colors duration-500 hover:border-white/[0.12]">
                  <div className="flex items-center gap-3"><Boxes className="h-5 w-5 text-primary" strokeWidth={1.5} /><h3 className="text-lg font-semibold">Modern record types</h3></div>
                  <p className="mt-3 text-sm text-muted-foreground">Native support for SVCB, HTTPS, TLSA, CAA and every common record.</p>
                </article>
              </Reveal>

              <Reveal delay={0.12}>
                <article className="h-full rounded-[1.75rem] border border-white/[0.07] bg-white/[0.02] p-9 transition-colors duration-500 hover:border-white/[0.12]">
                  <div className="flex items-center gap-3"><LayoutDashboard className="h-5 w-5 text-primary" strokeWidth={1.5} /><h3 className="text-lg font-semibold">Fast, clean dashboard</h3></div>
                  <p className="mt-3 text-sm text-muted-foreground">Manage zones and records in a UI that stays out of your way.</p>
                </article>
              </Reveal>

              <Reveal delay={0.16} className="lg:col-span-2">
                <article className="flex h-full flex-col justify-between gap-6 rounded-[1.75rem] border border-white/[0.07] bg-white/[0.02] p-9 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <Code2 className="h-5 w-5 text-primary" strokeWidth={1.5} />
                      <span className="rounded-full border border-warning/25 bg-warning/10 px-2.5 py-0.5 text-[11px] font-medium text-warning">In development</span>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold">Developer REST API</h3>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">Automate zones and records with a standards-compliant JSON API.</p>
                  </div>
                  <div className="w-full max-w-xs rounded-2xl border border-white/[0.07] bg-black/40 p-4 font-mono text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 text-muted-foreground/70"><Terminal className="h-3.5 w-3.5" strokeWidth={1.5} /> curl</div>
                    <p className="mt-2 leading-relaxed"><span className="text-primary">POST</span> /api/zones/:id/records</p>
                  </div>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Network */}
        <section id="network" className="scroll-mt-28 border-t border-white/[0.06]">
          <div className="container-custom grid items-center gap-16 py-32 lg:grid-cols-2">
            <Reveal>
              <div className="shell"><div className="core overflow-hidden p-2"><WorldMap /></div></div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <span className="eyebrow"><Gauge className="h-3 w-3" strokeWidth={2} /> Low latency, worldwide</span>
                <h2 className="mt-6 text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">Strategically placed edge locations.</h2>
                <p className="mt-5 max-w-md text-lg text-muted-foreground">Every query is answered from the nearest authoritative nameserver, keeping resolution fast and resilient no matter where your users are.</p>
                <ul className="mt-9 divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.07]">
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
        <section className="border-t border-white/[0.06]">
          <div className="container-custom py-32">
            <Reveal className="max-w-2xl">
              <span className="eyebrow">Quickstart</span>
              <h2 className="mt-6 text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">From registrar to resolved in minutes.</h2>
            </Reveal>
            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.1}>
                  <div className="h-full rounded-[1.75rem] border border-white/[0.07] bg-white/[0.02] p-9">
                    <span className="font-mono text-sm text-primary">{step.n}</span>
                    <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-white/[0.06]">
          <div className="container-custom py-32">
            <Reveal>
              <div className="shell">
                <div className="core relative overflow-hidden px-8 py-20 text-center sm:px-16">
                  <div className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-30" />
                  <div className="pointer-events-none absolute left-1/2 top-full -z-10 h-80 w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[130px]" />
                  <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">Point your first domain at Stackryze DNS.</h2>
                  <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">Free, open, and ready when you are. Create a zone in under a minute.</p>
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    <CTA to="/login">Start for free</CTA>
                    <CTA href="https://github.com/stackryze/DNS" tone="glass">View on GitHub</CTA>
                  </div>
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
