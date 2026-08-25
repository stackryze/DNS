import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Shield, Copy, Check, KeyRound } from 'lucide-react';
import { snippets, API_BASE_URL } from '../lib/code-snippets';
import { cn } from '../lib/utils';

const ENDPOINTS = [
  { method: 'GET', path: '/zones', desc: 'List your zones and limits.' },
  { method: 'GET', path: '/zones/:id', desc: 'Zone details (add ?rrsets=true for records).' },
  { method: 'GET', path: '/zones/:id/records', desc: 'List records (q, max query params).' },
  { method: 'POST', path: '/zones/:id/records', desc: 'Add a record: { type, name, content, ttl }.' },
  { method: 'DELETE', path: '/zones/:id/records', desc: 'Delete a record: { type, name, content }.' },
  { method: 'POST', path: '/zones/:id/records/batch', desc: 'Batch: { create: [...], delete: [...] }.' },
  { method: 'POST', path: '/zones/:id/clone', desc: 'Copy records into another zone: { targetId }.' },
];

const METHOD_TONE = {
  GET: 'text-success', POST: 'text-primary', DELETE: 'text-destructive',
};

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card">
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="absolute right-2 top-2 rounded-md border border-border bg-background/80 p-1.5 text-muted-foreground opacity-0 transition-all hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-muted-foreground"><code>{code}</code></pre>
    </div>
  );
}

export default function ApiDocs() {
  const examples = snippets();

  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="container-custom flex h-16 items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Back to home
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
            <Shield className="h-5 w-5 text-primary" />
            <span>Stackryze <span className="text-primary">DNS</span></span>
          </Link>
        </div>
      </header>

      <main className="container-custom max-w-3xl py-16">
        <h1 className="text-4xl font-semibold tracking-tight">API reference</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Manage your zones and records programmatically. All endpoints are under <code className="font-mono text-foreground">{API_BASE_URL}</code>.</p>

        <section className="mt-12 space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-semibold"><KeyRound className="h-5 w-5 text-primary" /> Authentication</h2>
          <p className="text-muted-foreground">Create a token in <Link to="/settings" className="text-primary hover:underline">Settings → API tokens</Link> and send it as a Bearer header. Write scope is required for any create or delete.</p>
          <CodeBlock code={`Authorization: Bearer sk_dns_xxxxxxxxxxxx`} />
        </section>

        <section className="mt-12 space-y-3">
          <h2 className="text-xl font-semibold">Endpoints</h2>
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            {ENDPOINTS.map((e) => (
              <div key={e.method + e.path} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                <span className={cn('w-16 shrink-0 font-mono text-xs font-bold', METHOD_TONE[e.method])}>{e.method}</span>
                <code className="shrink-0 font-mono text-xs text-foreground">{e.path}</code>
                <span className="text-xs text-muted-foreground sm:ml-auto sm:text-right">{e.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <h2 className="text-xl font-semibold">Examples</h2>
          {examples.map((ex) => (
            <div key={ex.id} className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">{ex.label}</h3>
              <CodeBlock code={ex.code} />
            </div>
          ))}
        </section>

        <footer className="mt-16 border-t border-border pt-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Stackryze DNS</Link>
        </footer>
      </main>
    </div>
  );
}
