import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { KeyRound, Plus, Trash2, Copy, Check, Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listTokens, createToken, revokeToken } from '../../services/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog';
import { cn } from '../../lib/utils';

const SCOPES = [
  { id: 'read', label: 'Read', desc: 'List zones and records' },
  { id: 'write', label: 'Write', desc: 'Create and delete records' },
];

export default function ApiTokens() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [scopes, setScopes] = useState(['read']);
  const [creating, setCreating] = useState(false);
  const [newToken, setNewToken] = useState(null);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(null);

  const load = async () => {
    setLoading(true);
    try { setTokens((await listTokens()).tokens || []); }
    catch { setTokens([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const toggleScope = (id) => setScopes((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const doCreate = async () => {
    if (!name.trim()) { toast.error('Give your token a name'); return; }
    setCreating(true);
    try {
      const res = await createToken(name.trim(), scopes.length ? scopes : ['read']);
      setNewToken(res.token);
      setCreateOpen(false);
      setName('');
      setScopes(['read']);
      load();
    } catch (err) {
      toast.error('Failed to create token: ' + (err.response?.data?.error || err.message));
    } finally {
      setCreating(false);
    }
  };

  const doRevoke = async (id) => {
    setRevoking(id);
    try { await revokeToken(id); toast.success('Token revoked'); load(); }
    catch (err) { toast.error('Failed to revoke: ' + (err.response?.data?.error || err.message)); }
    finally { setRevoking(null); }
  };

  return (
    <section className="panel rounded-xl p-6 md:p-8">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground"><KeyRound className="h-5 w-5 text-primary" /> API tokens</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">Programmatic access to your zones and records. See the <Link to="/api-docs" className="text-primary hover:underline">API docs <ExternalLink className="inline h-3 w-3" /></Link>.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> New token</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /></div>
      ) : tokens.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">No tokens yet.</div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {tokens.map((t) => (
            <div key={t._id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">{t.name}</span>
                  {t.scopes.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
                <div className="mt-0.5 font-mono text-xs text-muted-foreground">{t.prefix}…&nbsp;·&nbsp;{t.lastUsedAt ? `used ${new Date(t.lastUsedAt).toLocaleDateString()}` : 'never used'}</div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="ghost" size="icon" aria-label="Revoke token" disabled={revoking === t._id}>{revoking === t._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Revoke this token?</AlertDialogTitle><AlertDialogDescription>Any integration using <span className="font-medium text-foreground">{t.name}</span> will stop working immediately.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => doRevoke(t._id)}>Revoke</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API token</DialogTitle>
            <DialogDescription>The token is shown once. Store it somewhere safe.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="CI pipeline" />
            </div>
            <div className="space-y-1.5">
              <Label>Scopes</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {SCOPES.map((s) => (
                  <button key={s.id} onClick={() => toggleScope(s.id)} className={cn('rounded-lg border p-3 text-left transition-colors', scopes.includes(s.id) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40')}>
                    <div className="flex items-center gap-2">
                      <span className={cn('flex h-4 w-4 items-center justify-center rounded border', scopes.includes(s.id) ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>{scopes.includes(s.id) && <Check className="h-3 w-3" />}</span>
                      <span className="text-sm font-medium text-foreground">{s.label}</span>
                    </div>
                    <p className="mt-1 pl-6 text-xs text-muted-foreground">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={doCreate} disabled={creating}>{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create token</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reveal-once dialog */}
      <Dialog open={!!newToken} onOpenChange={(o) => { if (!o) { setNewToken(null); setCopied(false); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy your token</DialogTitle>
            <DialogDescription>This is the only time you'll see it. Copy it now.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <code className="min-w-0 flex-1 truncate font-mono text-xs text-primary">{newToken}</code>
            <Button size="sm" variant="secondary" onClick={() => { navigator.clipboard.writeText(newToken); setCopied(true); toast.success('Copied'); setTimeout(() => setCopied(false), 1500); }}>
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => { setNewToken(null); setCopied(false); }}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
