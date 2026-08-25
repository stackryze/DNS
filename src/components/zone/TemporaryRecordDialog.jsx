import React, { useState } from 'react';
import { toast } from 'sonner';
import { Timer, Loader2, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { addTemporaryRecord } from '../../services/api';

const TYPES = ['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'SRV', 'CAA'];
const EXPIRIES = [
  { v: '30', l: '30 minutes' },
  { v: '60', l: '1 hour' },
  { v: '360', l: '6 hours' },
  { v: '1440', l: '1 day' },
  { v: '10080', l: '7 days' },
];

export default function TemporaryRecordDialog({ open, onOpenChange, zoneId, zoneName, onApplied }) {
  const [type, setType] = useState('TXT');
  const [name, setName] = useState('_acme-challenge');
  const [content, setContent] = useState('');
  const [expires, setExpires] = useState('60');
  const [saving, setSaving] = useState(false);

  const strip = (s) => (s && s.endsWith('.') ? s.slice(0, -1) : s);

  const save = async () => {
    if (!name.trim() || !content.trim()) { toast.error('Name and content are required'); return; }
    setSaving(true);
    try {
      const res = await addTemporaryRecord(zoneId, {
        type,
        name: name.trim(),
        content: type === 'TXT' && !content.startsWith('"') ? `"${content.trim()}"` : content.trim(),
        ttl: 3600,
        expiresInMinutes: parseInt(expires),
      });
      toast.success(`Temporary record created — expires ${new Date(res.expiresAt).toLocaleString()}`);
      onApplied?.();
      onOpenChange(false);
      setContent('');
    } catch (err) {
      toast.error('Failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Timer className="h-4 w-4 text-primary" /> Temporary record</DialogTitle>
          <DialogDescription>Auto-deletes after the chosen time. Great for ACME challenges and short-lived tests.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Expires after</Label>
              <Select value={expires} onValueChange={setExpires}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{EXPIRIES.map((e) => <SelectItem key={e.v} value={e.v}>{e.l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="_acme-challenge" />
            <p className="font-mono text-[11px] text-muted-foreground">{name && name !== '@' ? `${name}.` : ''}{strip(zoneName)}</p>
          </div>
          <div className="space-y-1.5">
            <Label>Content</Label>
            <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="value" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
