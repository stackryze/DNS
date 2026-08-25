import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Webhook as WebhookIcon, Plus, Trash2, Copy, Check, Loader2 } from 'lucide-react';
import { listWebhooks, createWebhook, deleteWebhook } from '../../services/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog';
import { cn } from '../../lib/utils';

const ALL_EVENTS = ['record.created', 'record.deleted', 'zone.created', 'zone.deleted'];

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState(['record.created', 'record.deleted']);
  const [creating, setCreating] = useState(false);
  const [secret, setSecret] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try { setWebhooks((await listWebhooks()).webhooks || []); }
    catch { setWebhooks([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const toggleEvent = (e) => setEvents((p) => (p.includes(e) ? p.filter((x) => x !== e) : [...p, e]));

  const doCreate = async () => {
    if (!/^https:\/\/.+/.test(url)) { toast.error('Enter a valid https:// URL'); return; }
    setCreating(true);
    try {
      const res = await createWebhook(url, events.length ? events : ['record.created', 'record.deleted']);
      setSecret(res.secret);
      setCreateOpen(false);
      setUrl('');
      load();
    } catch (err) {
      toast.error('Failed to create webhook: ' + (err.response?.data?.error || err.message));
    } finally {
      setCreating(false);
    }
  };

  const doDelete = async (id) => {
    setDeleting(id);
    try { await deleteWebhook(id); toast.success('Webhook deleted'); load(); }
    catch (err) { toast.error('Failed: ' + (err.response?.data?.error || err.message)); }
    finally { setDeleting(null); }
  };

  return (
    <section className="panel rounded-xl p-6 md:p-8">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground"><WebhookIcon className="h-5 w-5 text-primary" /> Webhooks</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">Get an HMAC-signed POST when records change. Verify with the <span className="font-mono text-xs">X-Stackryze-Signature</span> header.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Add webhook</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /></div>
      ) : webhooks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">No webhooks yet.</div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {webhooks.map((w) => (
            <div key={w._id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate font-mono text-sm text-foreground">{w.url}</div>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  {w.events.map((e) => <Badge key={e} variant="secondary">{e}</Badge>)}
                  {w.lastStatus != null && <span className={cn('text-[11px]', w.lastStatus >= 200 && w.lastStatus < 300 ? 'text-success' : 'text-destructive')}>last: {w.lastStatus || 'failed'}</span>}
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="ghost" size="icon" aria-label="Delete webhook" disabled={deleting === w._id}>{deleting === w._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Delete webhook?</AlertDialogTitle><AlertDialogDescription>Events will stop being delivered to <span className="font-mono text-foreground">{w.url}</span>.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => doDelete(w._id)}>Delete</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add webhook</DialogTitle>
            <DialogDescription>We POST a JSON payload to this URL when selected events happen.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Endpoint URL</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/hooks/dns" />
            </div>
            <div className="space-y-1.5">
              <Label>Events</Label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_EVENTS.map((e) => (
                  <button key={e} onClick={() => toggleEvent(e)} className={cn('flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-mono transition-colors', events.includes(e) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40')}>
                    <span className={cn('flex h-4 w-4 items-center justify-center rounded border', events.includes(e) ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>{events.includes(e) && <Check className="h-3 w-3" />}</span>
                    <span className="truncate text-foreground">{e}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={doCreate} disabled={creating}>{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!secret} onOpenChange={(o) => { if (!o) { setSecret(null); setCopied(false); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signing secret</DialogTitle>
            <DialogDescription>Use this to verify payload signatures. Shown once.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <code className="min-w-0 flex-1 truncate font-mono text-xs text-primary">{secret}</code>
            <Button size="sm" variant="secondary" onClick={() => { navigator.clipboard.writeText(secret); setCopied(true); toast.success('Copied'); setTimeout(() => setCopied(false), 1500); }}>
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <DialogFooter><Button onClick={() => { setSecret(null); setCopied(false); }}>Done</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
