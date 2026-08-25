import React from 'react';

const TYPES = [
  { t: 'A', d: 'IPv4 address' },
  { t: 'AAAA', d: 'IPv6 address' },
  { t: 'CNAME', d: 'Canonical name' },
  { t: 'MX', d: 'Mail exchange' },
  { t: 'TXT', d: 'Text / SPF / DKIM' },
  { t: 'SRV', d: 'Service locator' },
  { t: 'CAA', d: 'Cert authority' },
  { t: 'NS', d: 'Nameserver' },
  { t: 'SOA', d: 'Start of authority' },
  { t: 'PTR', d: 'Reverse DNS' },
  { t: 'SVCB', d: 'Service binding' },
  { t: 'HTTPS', d: 'HTTPS service' },
  { t: 'TLSA', d: 'TLS association' },
  { t: 'NAPTR', d: 'Naming authority' },
];

export default function RecordTypes() {
  return (
    <section className="border-t border-white/[0.06]">
      <div className="container-custom py-32">
        <div className="max-w-2xl">
          <span className="eyebrow">Standards-compliant</span>
          <h2 className="mt-6 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Every record type modern apps need.</h2>
          <p className="mt-5 text-lg text-muted-foreground">Native support for the full record set — including the modern SVCB and HTTPS records most providers still don't offer.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {TYPES.map((r) => (
            <div key={r.t} className="group rounded-2xl border border-border bg-white/[0.02] p-4 transition-colors duration-300 hover:border-primary/40">
              <div className="font-mono text-base font-bold text-primary">{r.t}</div>
              <div className="mt-1 text-[11px] leading-tight text-muted-foreground">{r.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
