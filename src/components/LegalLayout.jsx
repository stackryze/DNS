import { Link } from 'react-router-dom';
import { ChevronLeft, Shield } from 'lucide-react';

export function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

const footerLinks = [
  { to: '/terms', label: 'Terms' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/aup', label: 'Acceptable Use' },
  { to: '/abuse', label: 'Report Abuse' },
];

export default function LegalLayout({ title, updated, children }) {
  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="container-custom flex h-16 items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
            <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>
              Stackryze <span className="text-primary">DNS</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="container-custom max-w-3xl py-16">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground font-mono">Last updated: {updated}</p>
        <div className="mt-10 space-y-10">{children}</div>
      </main>

      <footer className="border-t border-border">
        <div className="container-custom flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-sm text-muted-foreground">© 2026 Stackryze DNS</p>
        </div>
      </footer>
    </div>
  );
}
