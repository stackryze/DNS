import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Network', href: '#network' },
  { label: 'DNS Checker', to: '/dns-checker' },
  { label: 'Docs', href: 'https://dns-docs.stackryze.com', external: true },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4">
      <div className="container-custom flex justify-center">
        <div
          className={`mt-4 flex w-full max-w-4xl items-center justify-between rounded-full border py-2 pl-5 pr-2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            scrolled
              ? 'border-white/10 bg-background/70 shadow-[0_20px_50px_-30px_oklch(0_0_0/90%)] backdrop-blur-xl'
              : 'border-white/[0.06] bg-background/30 backdrop-blur-md'
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/stackryze_logo_white.png" alt="Stackryze" className="h-6 w-auto" />
            <span className="font-display text-[15px] font-semibold tracking-tight">
              Stackryze <span className="text-primary">DNS</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {LINKS.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors duration-300 hover:bg-white/[0.04] hover:text-foreground">
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noreferrer' : undefined} className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors duration-300 hover:bg-white/[0.04] hover:text-foreground">
                  {l.label}
                </a>
              )
            )}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login" className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground">
              Sign in
            </Link>
            <Link
              to="/login"
              className="group flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,var(--primary-bright),var(--primary))] py-1 pl-4 pr-1 text-sm font-medium text-primary-foreground transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
            >
              Get started
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/15 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
            </Link>
          </div>

          <button onClick={() => setOpen((v) => !v)} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground md:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="container-custom mt-2 flex justify-center md:hidden">
          <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-background/90 p-3 backdrop-blur-xl">
            <div className="flex flex-col gap-1">
              {LINKS.map((l) =>
                l.to ? (
                  <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-white/[0.05] hover:text-foreground">{l.label}</Link>
                ) : (
                  <a key={l.label} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noreferrer' : undefined} className="rounded-2xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-white/[0.05] hover:text-foreground">{l.label}</a>
                )
              )}
              <Link to="/login" onClick={() => setOpen(false)} className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,var(--primary-bright),var(--primary))] px-4 py-2.5 text-sm font-medium text-primary-foreground">
                Get started <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
