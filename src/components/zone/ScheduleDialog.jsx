import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { CalendarClock, Loader2, Check, Trash2, Plus, Minus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { cn } from '../../lib/utils';
import { getSchedule, scheduleChange, cancelSchedule } from '../../services/api';

const TYPES = ['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'SRV', 'CAA'];
const strip = (s) => (s && s.endsWith('.') ? s.slice(0, -1) : s);

function toLocalInput(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ScheduleDialog({ open, onOpenChange, zoneId, zoneName, onApplied }) {
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [op, setOp] = useState('create');
  const [type, setType] = useState('A');
  const [name, setName] = useState('@');
  const [content, setContent] = useState('');
  const [runAt, setRunAt] = useState(() => toLocalInput(new Date(Date.now() + 3600000)));
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setChanges((await getSchedule(zoneId)).changes || []); }
    catch { setChanges([]); }
    finally { setLoading(false); }
  }, [zoneId]);

  useEffect(() => { if (open) load(); }, [open, load]);

  const save = async () => {
    if (!name.trim() || !content.trim()) { toast.error('Name and content are required'); return; }
    const when = new Date(runAt);
    if (isNaN(when.getTime()) || when.getTime() < Date.now()) { toast.error('Pick a future time'); return; }
    setSaving(true);
    try {
      await scheduleChange(zoneId, {
        op,
        record: { name: name.trim(), type, content: type === 'TXT' && !content.startsWith('"') ? `"${content.trim()}"` : content.trim(), ttl: 3600 },
        runAt: when.toISOString(),
      });
      toast.success('Change scheduled');
      setContent('');
      load();
    } catch (err) {
      toast.error('Failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const cancel = async (sid) => {
    try { await cancelSchedule(zoneId, sid); toast.success('Canceled'); load(); }
    catch (err) { toast.error('Failed: ' + (err.response?.data?.error || err.message)); }
  };

  const pending = changes.filter((c) => c.status === 'pending');

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) onApplied?.(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" /> Schedule a change</DialogTitle>
          <DialogDescription>Queue a record change to apply automatically at a future time.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex gap-1 rounded-lg border border-border p-1">
            {[['create', 'Add', Plus], ['delete', 'Remove', Minus]].map(([v, l, I]) => (
              <button key={v} onClick={() => setOp(v)} className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors', op === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>
                <I className="h-3.5 w-3.5" /> {l}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="@" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Content</Label>
            <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="value" />
          </div>
          <div className="space-y-1.5">
            <Label>Run at</Label>
            <Input type="datetime-local" value={runAt} onChange={(e) => setRunAt(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button onClick={save} disabled={saving} size="sm">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Schedule</Button>
          </div>
        </div>

        <div>
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Pending ({pending.length})</div>
          {loading ? (
            <div className="flex justify-center py-4 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /></div>
          ) : pending.length === 0 ? (
            <p className="py-3 text-center text-sm text-muted-foreground">No pending changes.</p>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border">
              {pending.map((c) => (
                <div key={c._id} className="flex items-center justify-between gap-3 px-3 py-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className={cn('font-semibold', c.op === 'create' ? 'text-success' : 'text-destructive')}>{c.op === 'create' ? '+' : '−'}</span>
                      <span className="text-primary">{c.record.type}</span>
                      <span className="truncate text-foreground">{c.record.name}</span>
                      <span className="truncate text-muted-foreground">{strip(c.record.content)}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">{new Date(c.runAt).toLocaleString()}</div>
                  </div>
                  <Button variant="ghost" size="icon" aria-label="Cancel" onClick={() => cancel(c._id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
