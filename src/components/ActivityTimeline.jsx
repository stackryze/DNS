import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Activity, Plus, Trash2, Globe, Copy, Layers, Loader2, Undo2, RotateCcw } from 'lucide-react';
import { getAudit, getZoneAudit, revertAudit } from '../services/api';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from './ui/alert-dialog';
import { cn } from '../lib/utils';

const ACTION_META = {
  'zone.create': { icon: Globe, label: 'Created zone', tone: 'text-success' },
  'zone.delete': { icon: Trash2, label: 'Deleted zone', tone: 'text-destructive' },
  'zone.clone': { icon: Copy, label: 'Cloned zone', tone: 'text-primary' },
  'record.create': { icon: Plus, label: 'Added record', tone: 'text-success' },
  'record.delete': { icon: Trash2, label: 'Deleted record', tone: 'text-destructive' },
  'records.batch': { icon: Layers, label: 'Batch update', tone: 'text-primary' },
  'change.revert': { icon: RotateCcw, label: 'Reverted a change', tone: 'text-warning' },
  'dnssec.enable': { icon: Globe, label: 'Enabled DNSSEC', tone: 'text-success' },
  'dnssec.disable': { icon: Globe, label: 'Disabled DNSSEC', tone: 'text-warning' },
};

const REVERTIBLE = new Set(['record.create', 'record.delete', 'records.batch']);
const strip = (s) => (s && s.endsWith('.') ? s.slice(0, -1) : s);

function relativeTime(date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

// Builds the +/- diff lines for a change.
function diffLines(log) {
  const added = [];
  const removed = [];
  const m = log.meta || {};
  if (log.action === 'record.create' && m.after) added.push(m.after);
  else if (log.action === 'record.delete' && m.before) removed.push(m.before);
  else if (log.action === 'records.batch') {
    (m.createdRecords || []).forEach((r) => added.push(r));
    (m.deletedRecords || []).forEach((r) => removed.push(r));
  }
  return { added, removed };
}

function DiffRow({ sign, record }) {
  return (
    <div className={cn('flex items-center gap-2 font-mono text-[11px]', sign === '+' ? 'text-success' : 'text-destructive')}>
      <span className="w-2 shrink-0">{sign}</span>
      <span className="w-10 shrink-0 font-semibold">{record.type}</span>
      <span className="w-16 shrink-0 truncate">{record.name}</span>
      <span className="truncate opacity-90">{strip(record.content)}</span>
    </div>
  );
}

export default function ActivityTimeline({ zoneId, limit = 20, onChanged }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reverting, setReverting] = useState(null);

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

  const doRevert = async (id) => {
    setReverting(id);
    try {
      const res = await revertAudit(id);
      const parts = [];
      if (res.created) parts.push(`restored ${res.created}`);
      if (res.deleted) parts.push(`removed ${res.deleted}`);
      toast.success(`Change reverted${parts.length ? ` — ${parts.join(', ')}` : ''}`);
      if (res.errors?.length) toast.warning(`${res.errors.length} record(s) could not be reverted`);
      load();
      onChanged?.();
    } catch (err) {
      toast.error('Revert failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setReverting(null);
    }
  };

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
        const { added, removed } = diffLines(log);
        const hasDiff = added.length > 0 || removed.length > 0;
        const canRevert = zoneId && REVERTIBLE.has(log.action) && !log.reverted && hasDiff;
        return (
          <li key={log._id || i} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-secondary/40">
            <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-card', meta.tone)}>
              <Icon className="h-3 w-3" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm text-foreground">
                  {meta.label}
                  {!zoneId && log.zoneName ? <span className="text-muted-foreground"> · <span className="font-mono text-xs">{log.zoneName}</span></span> : null}
                  {log.reverted && <Badge variant="secondary">reverted</Badge>}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">{relativeTime(log.createdAt)}</span>
                  {canRevert && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" disabled={reverting === log._id}>
                          {reverting === log._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Undo2 className="h-3 w-3" />} Revert
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revert this change?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This restores the zone to its state before <span className="font-medium text-foreground">{meta.label.toLowerCase()}</span>
                            {log.target ? <> (<span className="font-mono text-foreground">{log.target}</span>)</> : null}. Records added by this change are removed and records it deleted are recreated.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => doRevert(log._id)}>Revert change</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
              {hasDiff ? (
                <div className="mt-1 space-y-0.5">
                  {removed.map((r, idx) => <DiffRow key={`r${idx}`} sign="−" record={r} />)}
                  {added.map((r, idx) => <DiffRow key={`a${idx}`} sign="+" record={r} />)}
                </div>
              ) : log.target ? (
                <p className="truncate font-mono text-xs text-muted-foreground">{log.target}</p>
              ) : log.meta ? (
                <p className="truncate font-mono text-xs text-muted-foreground">{Object.entries(log.meta).filter(([k]) => !['createdRecords', 'deletedRecords'].includes(k)).map(([k, v]) => `${k}: ${v}`).join(', ')}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
