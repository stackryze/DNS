import React, { useState } from 'react';
import { toast } from 'sonner';
import { Rocket, Plus, Minus, Loader2, Trash2, GitBranch } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { cn } from '../../lib/utils';
import { batchRecords } from '../../services/api';

const TYPES = ['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'SRV', 'CAA'];
const strip = (s) => (s && s.endsWith('.') ? s.slice(0, -1) : s);

// Stage a changeset, review the diff, then deploy in one batch (revertible from history).
export default function DeploymentDialog({ open, onOpenChange, zoneId, onApplied }) {
  const [op, setOp] = useState('create');
  const [type, setType] = useState('A');
  const [name, setName] = useState('@');
  const [content, setContent] = useState('');
  const [staged, setStaged] = useState([]);
  const [deploying, setDeploying] = useState(false);

  const add = () => {
    if (!name.trim() || !content.trim()) { toast.error('Name and content are required'); return; }
    const rec = {
      op,
      type,
      name: name.trim(),
      content: type === 'TXT' && !content.startsWith('"') ? `"${content.trim()}"` : content.trim(),
      ttl: 3600,
    };
    setStaged((s) => [...s, rec]);
    setContent('');
  };

  const remove = (i) => setStaged((s) => s.filter((_, idx) => idx !== i));

  const deploy = async () => {
    if (staged.length === 0) return;
    setDeploying(true);
    try {
      const create = staged.filter((s) => s.op === 'create').map(({ type, name, content, ttl }) => ({ type, name, content, ttl }));
      const del = staged.filter((s) => s.op === 'delete').map(({ type, name, content }) => ({ type, name, content }));
      const res = await batchRecords(zoneId, { create, delete: del });
      const parts = [];
      if (res.created) parts.push(`+${res.created}`);
      if (res.deleted) parts.push(`−${res.deleted}`);
      toast.success(`Deployment applied ${parts.join(' ')}`.trim());
      if (res.errors?.length) toast.warning(`${res.errors.length} change(s) skipped`);
      onApplied?.();
      onOpenChange(false);
      setStaged([]);
    } catch (err) {
      toast.error('Deploy failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setDeploying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setStaged([]); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Rocket className="h-4 w-4 text-primary" /> New deployment</DialogTitle>
          <DialogDescription>Stage a set of changes, review the diff, then deploy together. Roll back anytime from Recent activity.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-xl border border-border p-3">
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
            <div className="flex gap-2">
              <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="value" onKeyDown={(e) => e.key === 'Enter' && add()} />
              <Button variant="outline" onClick={add}><Plus className="h-4 w-4" /> Stage</Button>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"><GitBranch className="h-3 w-3" /> Staged changes ({staged.length})</div>
          {staged.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No changes staged yet.</p>
          ) : (
            <div className="max-h-40 space-y-0.5 overflow-y-auto rounded-lg border border-border p-2">
              {staged.map((s, i) => (
                <div key={i} className="group flex items-center gap-2 rounded px-1.5 py-1 font-mono text-xs hover:bg-secondary/40">
                  <span className={cn('w-2 font-semibold', s.op === 'create' ? 'text-success' : 'text-destructive')}>{s.op === 'create' ? '+' : '−'}</span>
                  <span className="w-10 shrink-0 text-primary">{s.type}</span>
                  <span className="w-16 shrink-0 truncate text-foreground">{s.name}</span>
                  <span className="flex-1 truncate text-muted-foreground">{strip(s.content)}</span>
                  <button onClick={() => remove(i)} className="text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={deploy} disabled={staged.length === 0 || deploying}>{deploying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />} Deploy {staged.length || ''}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
