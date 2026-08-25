import React, { useState } from 'react';
import { toast } from 'sonner';
import { Stethoscope, CheckCircle2, AlertTriangle, XCircle, Info, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { diagnoseDomain } from '../../services/api';

const strip = (s) => (s && s.endsWith('.') ? s.slice(0, -1) : s);

const ICONS = {
  pass: { icon: CheckCircle2, tone: 'text-success' },
  warn: { icon: AlertTriangle, tone: 'text-warning' },
  fail: { icon: XCircle, tone: 'text-destructive' },
  info: { icon: Info, tone: 'text-muted-foreground' },
};

function CheckRow({ check }) {
  const meta = ICONS[check.status] || ICONS.info;
  const Icon = meta.icon;
  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', meta.tone)} />
      <div className="min-w-0">
        <div className="text-sm text-foreground">{check.label}</div>
        {check.detail && <div className="text-xs text-muted-foreground">{check.detail}</div>}
      </div>
    </div>
  );
}

const GROUPS = [
  { key: 'dns', label: 'DNS' },
  { key: 'email', label: 'Email' },
  { key: 'website', label: 'Website' },
];

export default function DiagnoseDialog({ open, onOpenChange, zoneName }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    setLoading(true);
    setResult(null);
    try {
      setResult(await diagnoseDomain(strip(zoneName)));
    } catch (err) {
      toast.error('Diagnostics failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Auto-run when opened fresh.
  React.useEffect(() => {
    if (open && !result && !loading) run();
    if (!open) setResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Stethoscope className="h-4 w-4 text-primary" /> Diagnose {strip(zoneName)}</DialogTitle>
          <DialogDescription>DNS, email and website posture from public resolvers.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : result ? (
          <div className="space-y-4">
            {GROUPS.map((g) => (
              <div key={g.key}>
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{g.label}</div>
                <div className="divide-y divide-border rounded-lg border border-border px-3">
                  {(result.checks?.[g.key] || []).map((c, i) => <CheckRow key={i} check={c} />)}
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={run}>Re-run</Button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center"><Button onClick={run}>Run diagnostics</Button></div>
        )}
      </DialogContent>
    </Dialog>
  );
}
