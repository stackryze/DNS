import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Loader2, FileUp, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { parseZoneText } from '../../lib/zone-parser';
import { batchRecords } from '../../services/api';

export default function BulkImportDialog({ open, onOpenChange, zoneId, zoneName, onApplied }) {
  const [text, setText] = useState('');
  const [importing, setImporting] = useState(false);

  const parsed = useMemo(() => parseZoneText(text, zoneName), [text, zoneName]);

  const doImport = async () => {
    if (parsed.length === 0) return;
    setImporting(true);
    try {
      const res = await batchRecords(zoneId, { create: parsed });
      if (res.created > 0) toast.success(`Imported ${res.created} record${res.created > 1 ? 's' : ''}`);
      if (res.errors?.length) toast.warning(`${res.errors.length} skipped (invalid, duplicate or unsupported)`);
      if (res.created === 0) toast.error('No records were imported');
      onApplied?.();
      onOpenChange(false);
      setText('');
    } catch (err) {
      toast.error('Import failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setText(''); }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FileUp className="h-4 w-4 text-primary" /> Bulk import</DialogTitle>
          <DialogDescription>Paste a BIND zone file or CSV (type,name,content,ttl). SOA/NS lines are ignored.</DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Records</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'www 3600 IN A 93.184.216.34\n@ 3600 IN MX "10 mail.example.com"\n\n— or —\ntype,name,content,ttl\nA,www,93.184.216.34,3600'}
            className="h-40 font-mono text-xs"
          />
          {text.trim() && (
            <p className="text-xs text-muted-foreground">
              {parsed.length > 0 ? `${parsed.length} valid record${parsed.length > 1 ? 's' : ''} detected` : 'No valid records detected yet'}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={doImport} disabled={parsed.length === 0 || importing}>
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Import {parsed.length || ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
