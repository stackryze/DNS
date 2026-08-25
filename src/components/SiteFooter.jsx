import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const COLS = [
  {
    title: 'Product',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'DNS Checker', to: '/dns-checker' },
      { label: 'Docs', href: 'https://dns-docs.stackryze.com' },
      { label: 'Status', href: 'https://status.stackryze.com' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Stackryze', href: 'https://stackryze.com' },
      { label: 'Domains', href: 'https://domain.stackryze.com' },
      { label: 'GitHub', href: 'https://github.com/stackryze/DNS' },
      { label: 'Sponsor', href: 'https://github.com/sponsors/sudheerbhuvana/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', to: '/terms' },
      { label: 'Privacy', to: '/privacy' },
      { label: 'Acceptable Use', to: '/aup' },
      { label: 'Report Abuse', to: '/abuse' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="container-custom py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/stackryze_logo_white.png" alt="Stackryze" className="h-7 w-auto" />
              <span className="font-display text-[15px] font-semibold tracking-tight">
                Stackryze <span className="text-primary">DNS</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Free, open-source, globally distributed authoritative DNS for developers.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l.label}</Link>
                    ) : (
                      <a href={l.href} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2026 Stackryze DNS. All rights reserved.</p>
          <a href="https://github.com/stackryze/DNS" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
            <Github className="h-3.5 w-3.5" /> Open source
          </a>
        </div>
      </div>
    </footer>
  );
}
