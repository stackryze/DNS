import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Check, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { RECORD_TEMPLATES, applyTemplateTokens } from '../../lib/record-templates';
import { batchRecords } from '../../services/api';

export default function TemplatesDialog({ open, onOpenChange, zoneId, zoneName, onApplied }) {
  const [selected, setSelected] = useState(null);
  const [applying, setApplying] = useState(false);

  const preview = selected ? selected.records.map((r) => applyTemplateTokens(r, zoneName)) : [];

  const apply = async () => {
    if (!selected) return;
    setApplying(true);
    try {
      const res = await batchRecords(zoneId, { create: preview });
      if (res.created > 0) toast.success(`Added ${res.created} record${res.created > 1 ? 's' : ''} from ${selected.name}`);
      if (res.errors?.length) toast.warning(`${res.errors.length} record(s) skipped (duplicates or conflicts)`);
      if (res.created === 0 && res.errors?.length) toast.error('No records were added');
      onApplied?.();
      onOpenChange(false);
      setSelected(null);
    } catch (err) {
      toast.error('Failed to apply template: ' + (err.response?.data?.error || err.message));
    } finally {
      setApplying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setSelected(null); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Record templates</DialogTitle>
          <DialogDescription>Add a common provider setup in one step. Records are added to your existing zone.</DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[280px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {RECORD_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className={cn(
                'rounded-xl border p-3 text-left transition-colors',
                selected?.id === t.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">{t.name}</span>
                <Badge variant="secondary">{t.category}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="rounded-xl border border-border bg-background/60 p-3">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{preview.length} records</div>
            <div className="max-h-32 space-y-1 overflow-y-auto font-mono text-xs">
              {preview.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-12 shrink-0 font-semibold text-primary">{r.type}</span>
                  <span className="w-16 shrink-0 truncate text-foreground">{r.name}</span>
                  <span className="truncate">{r.content}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={apply} disabled={!selected || applying}>
            {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Apply template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
