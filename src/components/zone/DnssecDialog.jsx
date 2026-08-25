import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ShieldCheck, ShieldAlert, Loader2, Copy, Check, Lock, Unlock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { getDnssec, enableDnssec, disableDnssec } from '../../services/api';

function DsField({ label, value }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2">
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <code className="block truncate font-mono text-xs text-foreground">{value}</code>
      </div>
      <button onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200); }} className="shrink-0 rounded p-1.5 text-muted-foreground hover:text-foreground">
        {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

export default function DnssecDialog({ open, onOpenChange, zoneId, zoneName }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setStatus(await getDnssec(zoneId)); }
    catch { setStatus(null); }
    finally { setLoading(false); }
  }, [zoneId]);

  useEffect(() => { if (open) load(); }, [open, load]);

  const enable = async () => {
    setBusy(true);
    try { setStatus(await enableDnssec(zoneId)); toast.success('DNSSEC enabled — add the DS record at your registrar'); }
    catch (err) { toast.error('Failed: ' + (err.response?.data?.error || err.message)); }
    finally { setBusy(false); }
  };
  const disable = async () => {
    setBusy(true);
    try { await disableDnssec(zoneId); await load(); toast.success('DNSSEC disabled — remove the DS record at your registrar'); }
    catch (err) { toast.error('Failed: ' + (err.response?.data?.error || err.message)); }
    finally { setBusy(false); }
  };

  const secured = status?.secured;
  const ds = status?.ds || [];
  const unavailable = status?.available === false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {secured ? <ShieldCheck className="h-4 w-4 text-success" /> : <ShieldAlert className="h-4 w-4 text-warning" />} DNSSEC
          </DialogTitle>
          <DialogDescription>Cryptographically sign this zone to prevent DNS spoofing.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
              <span className="text-sm text-foreground">Status</span>
              {secured ? <Badge variant="success"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Signed</Badge> : <Badge variant="secondary">Not signed</Badge>}
            </div>

            {unavailable ? (
              <p className="text-sm text-muted-foreground">This zone is still being provisioned. DNSSEC can be enabled once the zone is active.</p>
            ) : secured ? (
              <>
                <div className="space-y-2">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">DS record — add this at your registrar</div>
                  {ds.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Generating DS records… reopen in a moment.</p>
                  ) : ds.map((d, i) => <DsField key={i} label="DS" value={d} />)}
                </div>
                <p className="text-xs text-muted-foreground">DNSSEC becomes active once the DS record is published in your parent zone (registrar). Until then the zone is signed but the chain of trust is incomplete.</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Enabling creates a signing key (ECDSAP256SHA256) and produces a DS record you paste at your domain registrar.</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          {secured ? (
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="destructive" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />} Disable DNSSEC</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Disable DNSSEC?</AlertDialogTitle><AlertDialogDescription>Remove the DS record at your registrar <span className="font-medium text-foreground">before</span> disabling, or resolution for {zoneName?.replace(/\.$/, '')} may break.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={disable}>Disable</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button onClick={enable} disabled={busy || unavailable}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Enable DNSSEC</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
