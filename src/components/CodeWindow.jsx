import React from 'react';
import { cn } from '../lib/utils';

// Terminal / code window — ClickHouse-signature element.
// Renders a titled window with mono content and optional stat rows.
export function CodeWindow({ title = 'terminal', lang, children, stats = [], className }) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-[oklch(0.12_0.004_250)]', className)}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">{title}</span>
        {lang && <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50">{lang}</span>}
      </div>
      <div className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.7]">{children}</div>
      {stats.length > 0 && (
        <div className="grid grid-cols-1 divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center justify-between gap-2 px-4 py-2.5 sm:flex-col sm:items-start sm:gap-0.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <span className="font-mono text-xs font-semibold text-primary">{s.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Syntax fragments for the mono content.
export const K = ({ children }) => <span className="text-primary">{children}</span>; // keyword / accent
export const C = ({ children }) => <span className="text-muted-foreground/60">{children}</span>; // comment
export const V = ({ children }) => <span className="text-success">{children}</span>; // value / ok
export const M = ({ children }) => <span className="text-muted-foreground">{children}</span>; // muted
