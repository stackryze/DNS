import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Plus, Trash2, Globe, Copy, Layers, Loader2 } from 'lucide-react';
import { getAudit, getZoneAudit } from '../services/api';
import { cn } from '../lib/utils';

const ACTION_META = {
  'zone.create': { icon: Globe, label: 'Created zone', tone: 'text-success' },
  'zone.delete': { icon: Trash2, label: 'Deleted zone', tone: 'text-destructive' },
  'zone.clone': { icon: Copy, label: 'Cloned zone', tone: 'text-primary' },
  'record.create': { icon: Plus, label: 'Added record', tone: 'text-success' },
  'record.delete': { icon: Trash2, label: 'Deleted record', tone: 'text-destructive' },
  'records.batch': { icon: Layers, label: 'Batch update', tone: 'text-primary' },
};

function relativeTime(date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function ActivityTimeline({ zoneId, limit = 20 }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = zoneId ? await getZoneAudit(zoneId, limit) : await getAudit(limit);
      setLogs(data.logs || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [zoneId, limit]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <div className="flex items-center justify-center py-8 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /></div>;
  }
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <Activity className="mb-2 h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      </div>
    );
  }

  return (
    <ol className="relative space-y-1">
      {logs.map((log, i) => {
        const meta = ACTION_META[log.action] || { icon: Activity, label: log.action, tone: 'text-muted-foreground' };
        const Icon = meta.icon;
        const detail = log.target || (log.meta ? Object.entries(log.meta).map(([k, v]) => `${k}: ${v}`).join(', ') : '');
        return (
          <li key={log._id || i} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-secondary/40">
            <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-card', meta.tone)}>
              <Icon className="h-3 w-3" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-foreground">{meta.label}{!zoneId && log.zoneName ? <span className="text-muted-foreground"> · <span className="font-mono text-xs">{log.zoneName}</span></span> : null}</span>
                <span className="shrink-0 text-[11px] text-muted-foreground">{relativeTime(log.createdAt)}</span>
              </div>
              {detail && <p className="truncate font-mono text-xs text-muted-foreground">{detail}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
