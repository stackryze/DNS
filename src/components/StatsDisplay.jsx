import React, { useState, useEffect } from 'react';
import { getLiveStats } from '../services/api';
import { Skeleton } from './ui/skeleton';

const fmt = (n) => {
  if (n == null) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

export default function StatsDisplay() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getLiveStats()
      .then((d) => alive && setStats(d))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const items = [
    { label: 'Global Queries', value: fmt(stats?.totalQueries) },
    { label: 'UDP Answers', value: fmt(stats?.udpAnswers) },
    { label: 'TCP Answers', value: fmt(stats?.tcpAnswers) },
    { label: 'Active Zones', value: fmt(stats?.totalZones) },
    { label: 'Total Records', value: fmt(stats?.totalRecords) },
    { label: 'Avg Latency', value: stats?.avgLatency != null ? `${stats.avgLatency}ms` : '0ms' },
    { label: 'Uptime', value: stats?.uptime != null ? `${stats.uptime}h` : '0h' },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4 lg:grid-cols-7">
      {items.map((it) => (
        <div key={it.label} className="bg-card px-4 py-5 text-center">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{it.label}</p>
          {loading ? (
            <Skeleton className="mx-auto mt-2 h-6 w-14" />
          ) : (
            <p className="mt-1 font-display text-xl font-semibold text-primary">{it.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}
