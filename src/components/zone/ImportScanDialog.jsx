import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Search, Download, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';
import { scanDomain, batchRecords } from '../../services/api';

const strip = (s) => (s && s.endsWith('.') ? s.slice(0, -1) : s);

// Turn Node DNS resolver output into normalized records.
function normalize(type, records) {
  if (!records) return [];
  if (type === 'MX') return records.map((r) => `${r.priority} ${strip(r.exchange)}`);
  if (type === 'TXT') return records.map((r) => (Array.isArray(r) ? r.join('') : String(r)));
  if (type === 'CNAME') return records.map((r) => strip(r));
  return records.map((r) => String(r)); // A / AAAA
}

export default function ImportScanDialog({ open, onOpenChange, zoneId, zoneName, onApplied }) {
  const [domain, setDomain] = useState(strip(zoneName || ''));
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState(null); // [{ key, type, name, content, checked }]
  const [importing, setImporting] = useState(false);

  const labelFor = (scanned) => {
    const z = strip(zoneName);
    const d = strip(scanned).toLowerCase();
    if (d === z) return '@';
    if (d.endsWith(`.${z}`)) return d.slice(0, -(z.length + 1));
    return '@';
  };

  const doScan = async () => {
    if (!domain.trim()) return;
    setScanning(true);
    setFound(null);
    try {
      const results = await scanDomain(domain.trim());
      const name = labelFor(domain.trim());
      const items = [];
      for (const { type, data } of results) {
        if (!data?.results) continue;
        const firstOk = Object.values(data.results).find((r) => r.success && r.records);
        if (!firstOk) continue;
        for (const content of normalize(type, firstOk.records)) {
          // Skip Stackryze NS/verification noise.
          if (type === 'TXT' && content.startsWith('sryze-verify')) continue;
          items.push({ key: `${type}-${name}-${content}`, type, name, content, checked: true });
        }
      }
      if (items.length === 0) toast.message('No importable records found for that domain');
      setFound(items);
    } catch (err) {
      toast.error('Scan failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setScanning(false);
    }
  };

  const toggle = (key) => setFound((prev) => prev.map((i) => (i.key === key ? { ...i, checked: !i.checked } : i)));

  const doImport = async () => {
    const create = found.filter((i) => i.checked).map(({ type, name, content }) => ({ type, name, content, ttl: 3600 }));
    if (create.length === 0) return;
    setImporting(true);
    try {
      const res = await batchRecords(zoneId, { create });
      if (res.created > 0) toast.success(`Imported ${res.created} record${res.created > 1 ? 's' : ''}`);
      if (res.errors?.length) toast.warning(`${res.errors.length} skipped (duplicates or conflicts)`);
      onApplied?.();
      onOpenChange(false);
      setFound(null);
    } catch (err) {
      toast.error('Import failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setImporting(false);
    }
  };

  const selectedCount = found?.filter((i) => i.checked).length || 0;

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setFound(null); }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> Import existing DNS</DialogTitle>
          <DialogDescription>Scan a domain's current live records and import the ones you want.</DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Domain to scan</Label>
          <div className="flex gap-2">
            <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" onKeyDown={(e) => e.key === 'Enter' && doScan()} />
            <Button onClick={doScan} disabled={scanning || !domain.trim()}>
              {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Scan
            </Button>
          </div>
        </div>

        {found && found.length > 0 && (
          <div className="rounded-xl border border-border">
            <div className="max-h-56 divide-y divide-border overflow-y-auto">
              {found.map((i) => (
                <button key={i.key} onClick={() => toggle(i.key)} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-secondary/40">
                  <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded border', i.checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>
                    {i.checked && <Check className="h-3 w-3" />}
                  </span>
                  <span className="w-12 shrink-0 font-mono text-xs font-semibold text-primary">{i.type}</span>
                  <span className="w-14 shrink-0 truncate font-mono text-xs text-foreground">{i.name}</span>
                  <span className="truncate font-mono text-xs text-muted-foreground">{i.content}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={doImport} disabled={!selectedCount || importing}>
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Import {selectedCount || ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
