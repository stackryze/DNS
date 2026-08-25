import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Check, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { setRecordMeta } from '../../services/api';

export default function RecordMetaDialog({ open, onOpenChange, zoneId, recordKey, recordLabel, initial, onSaved }) {
  const [comment, setComment] = useState(initial?.comment || '');
  const [labels, setLabels] = useState((initial?.labels || []).join(', '));
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (open) {
      setComment(initial?.comment || '');
      setLabels((initial?.labels || []).join(', '));
    }
  }, [open, initial]);

  const save = async () => {
    setSaving(true);
    try {
      const labelArr = labels.split(',').map((l) => l.trim()).filter(Boolean);
      const res = await setRecordMeta(zoneId, recordKey, comment.trim(), labelArr);
      toast.success('Saved');
      onSaved?.(recordKey, { comment: res.comment, labels: res.labels });
      onOpenChange(false);
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
          <DialogTitle className="flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> Annotate record</DialogTitle>
          <DialogDescription className="font-mono text-xs">{recordLabel}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Comment</Label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Production API server" className="h-20" maxLength={280} />
          </div>
          <div className="space-y-1.5">
            <Label>Labels</Label>
            <Input value={labels} onChange={(e) => setLabels(e.target.value)} placeholder="production, api (comma separated)" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
