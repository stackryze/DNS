import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Check, Wand2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { cn } from '../../lib/utils';
import { batchRecords } from '../../services/api';

const SPF_INCLUDES = [
  { id: '_spf.google.com', label: 'Google Workspace' },
  { id: 'spf.protection.outlook.com', label: 'Microsoft 365' },
  { id: 'zoho.com', label: 'Zoho' },
  { id: 'mailgun.org', label: 'Mailgun' },
  { id: 'sendgrid.net', label: 'SendGrid' },
  { id: 'amazonses.com', label: 'Amazon SES' },
];

export default function RecordBuilders({ open, onOpenChange, zoneId, onApplied }) {
  const [mode, setMode] = useState('spf');
  const [applying, setApplying] = useState(false);

  // SPF state
  const [includes, setIncludes] = useState([]);
  const [spfPolicy, setSpfPolicy] = useState('~all');

  // DMARC state
  const [dmarcPolicy, setDmarcPolicy] = useState('none');
  const [rua, setRua] = useState('');
  const [pct, setPct] = useState('100');

  const toggleInclude = (id) => setIncludes((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const spfValue = `v=spf1 ${includes.map((i) => `include:${i}`).join(' ')}${includes.length ? ' ' : ''}${spfPolicy}`.replace(/\s+/g, ' ').trim();
  const dmarcValue = `v=DMARC1; p=${dmarcPolicy}${rua ? `; rua=mailto:${rua}` : ''}${pct && pct !== '100' ? `; pct=${pct}` : ''}`;

  const record = mode === 'spf'
    ? { type: 'TXT', name: '@', content: spfValue, ttl: 3600 }
    : { type: 'TXT', name: '_dmarc', content: dmarcValue, ttl: 3600 };

  const apply = async () => {
    setApplying(true);
    try {
      const res = await batchRecords(zoneId, { create: [record] });
      if (res.created > 0) toast.success(`${mode.toUpperCase()} record added`);
      else if (res.errors?.length) toast.error(res.errors[0].error || 'Could not add record');
      onApplied?.();
      onOpenChange(false);
    } catch (err) {
      toast.error('Failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setApplying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Wand2 className="h-4 w-4 text-primary" /> Email record builder</DialogTitle>
          <DialogDescription>Generate a valid SPF or DMARC TXT record.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-1 rounded-lg border border-border p-1">
          {['spf', 'dmarc'].map((m) => (
            <button key={m} onClick={() => setMode(m)} className={cn('flex-1 rounded-md py-1.5 text-sm font-medium transition-colors', mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        {mode === 'spf' ? (
          <div className="space-y-3">
            <div>
              <Label>Allowed senders</Label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {SPF_INCLUDES.map((s) => (
                  <button key={s.id} onClick={() => toggleInclude(s.id)} className={cn('flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors', includes.includes(s.id) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40')}>
                    <span className={cn('flex h-4 w-4 items-center justify-center rounded border', includes.includes(s.id) ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>{includes.includes(s.id) && <Check className="h-3 w-3" />}</span>
                    <span className="text-foreground">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Policy for others</Label>
              <Select value={spfPolicy} onValueChange={setSpfPolicy}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="~all">Soft fail (~all) — recommended</SelectItem>
                  <SelectItem value="-all">Hard fail (-all) — strict</SelectItem>
                  <SelectItem value="?all">Neutral (?all)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Policy</Label>
              <Select value={dmarcPolicy} onValueChange={setDmarcPolicy}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Monitor only (none)</SelectItem>
                  <SelectItem value="quarantine">Quarantine</SelectItem>
                  <SelectItem value="reject">Reject — strict</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Report address (optional)</Label>
              <Input value={rua} onChange={(e) => setRua(e.target.value)} placeholder="dmarc@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Apply to % of mail</Label>
              <Input value={pct} onChange={(e) => setPct(e.target.value.replace(/\D/g, ''))} placeholder="100" />
            </div>
          </div>
        )}

        <div className="rounded-lg border border-border bg-background/60 p-3">
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Preview · {record.name}</div>
          <code className="block break-all font-mono text-xs text-primary">{record.content}</code>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={apply} disabled={applying || (mode === 'spf' && includes.length === 0)}>{applying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Add record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
