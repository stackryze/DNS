import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

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
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? 'border-border bg-background/80 backdrop-blur-md' : 'border-transparent'
      }`}
    >
      <div className="container-custom flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/stackryze_logo_white.png" alt="Stackryze" className="h-7 w-auto" />
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Stackryze <span className="text-primary">DNS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noreferrer' : undefined} className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
          <Button asChild size="sm"><Link to="/login">Get started</Link></Button>
        </div>

        <button onClick={() => setOpen((v) => !v)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur md:hidden">
          <div className="container-custom flex flex-col gap-1 py-3">
            {LINKS.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">{l.label}</Link>
              ) : (
                <a key={l.label} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noreferrer' : undefined} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">{l.label}</a>
              )
            )}
            <Button asChild className="mt-2"><Link to="/login">Get started</Link></Button>
          </div>
        </div>
      )}
    </header>
  );
}
