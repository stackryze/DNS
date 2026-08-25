import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getZoneDetails, getZoneRecords, addRecord, deleteRecord, deleteZone, verifyZone, verifyOwnership, exportZone, batchRecords, getRecordMeta } from '../services/api';
import { ArrowLeft, Plus, Trash2, Globe, AlertCircle, Loader2, Copy, Check, AlertTriangle, Download, ShieldOff, RotateCw, MoreHorizontal, Pencil, X, Sparkles, FileUp, Search, Wrench, Activity, Stethoscope, Timer, CalendarClock, Tag, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../components/ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from '../components/ui/tooltip';
import TemplatesDialog from '../components/zone/TemplatesDialog';
import ImportScanDialog from '../components/zone/ImportScanDialog';
import BulkImportDialog from '../components/zone/BulkImportDialog';
import RecordBuilders from '../components/zone/RecordBuilders';
import DiagnoseDialog from '../components/zone/DiagnoseDialog';
import TemporaryRecordDialog from '../components/zone/TemporaryRecordDialog';
import ScheduleDialog from '../components/zone/ScheduleDialog';
import RecordMetaDialog from '../components/zone/RecordMetaDialog';
import ActivityTimeline from '../components/ActivityTimeline';
import { cn } from '../lib/utils';

const stripDot = (s) => (s && s.endsWith('.') ? s.slice(0, -1) : s);
const metaKey = (r) => `${stripDot(r.name)}|${r.type}|${stripDot(r.content)}`;

const TYPE_TONE = {
  A: 'text-primary', AAAA: 'text-primary', CNAME: 'text-foreground', NS: 'text-foreground',
  MX: 'text-warning', TXT: 'text-muted-foreground', SRV: 'text-primary', CAA: 'text-success', SOA: 'text-muted-foreground',
};

function RecordTypeBadge({ type }) {
  return <span className={cn('inline-flex w-14 justify-center rounded-md border border-border bg-secondary py-0.5 font-mono text-[11px] font-semibold', TYPE_TONE[type] || 'text-foreground')}>{type}</span>;
}

const STATUS = {
  active: { label: 'Active', variant: 'success', dot: 'bg-success' },
  suspended: { label: 'Suspended', variant: 'destructive', dot: 'bg-destructive' },
  pending_ownership: { label: 'Verify ownership', variant: 'warning', dot: 'bg-warning' },
  pending_verification: { label: 'Pending setup', variant: 'warning', dot: 'bg-warning' },
  pending: { label: 'Pending setup', variant: 'warning', dot: 'bg-warning' },
};
function StatusBadge({ status }) {
  const s = STATUS[status] || { label: status, variant: 'default', dot: 'bg-muted-foreground' };
  return <Badge variant={s.variant}><span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />{s.label}</Badge>;
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="rounded p-1 text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </TooltipTrigger>
      <TooltipContent>{copied ? 'Copied' : 'Copy'}</TooltipContent>
    </Tooltip>
  );
}

const TTL_OPTIONS = [
  { v: '3600', l: '1 hour' }, { v: '7200', l: '2 hours' }, { v: '21600', l: '6 hours' },
  { v: '43200', l: '12 hours' }, { v: '86400', l: '1 day' }, { v: '604800', l: '1 week' },
];
const EDITABLE_TYPES = ['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'SRV', 'CAA'];

function decompose(type, content) {
  const base = { content, mxPriority: '10', srvPriority: '10', srvWeight: '5', srvPort: '443', caaFlags: '0', caaTag: 'issue' };
  if (type === 'MX') { const [p, ...rest] = content.split(/\s+/); return { ...base, mxPriority: p, content: rest.join(' ') }; }
  if (type === 'SRV') { const [p, w, port, ...rest] = content.split(/\s+/); return { ...base, srvPriority: p, srvWeight: w, srvPort: port, content: rest.join(' ') }; }
  if (type === 'CAA') { const m = content.match(/^(\d+)\s+(\S+)\s+"?(.*?)"?$/); if (m) return { ...base, caaFlags: m[1], caaTag: m[2], content: m[3] }; }
  if (type === 'TXT') return { ...base, content: content.replace(/^"|"$/g, '') };
  return base;
}

function RecordForm({ zoneName, initial, onSubmit, submitting }) {
  const isEdit = !!initial;
  const [type, setType] = useState(initial ? initial.type : 'A');
  const [name, setName] = useState(initial ? (stripDot(initial.name).replace(`.${stripDot(zoneName)}`, '') || '@') : '@');
  const [ttl, setTtl] = useState(initial ? String(initial.ttl || 3600) : '3600');
  const [fields, setFields] = useState(() => (initial ? decompose(initial.type, stripDot(initial.content)) : decompose('A', '')));
  const setField = (k, v) => setFields((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const c = fields.content.trim();
    if (!name || !c) return 'Name and content are required.';
    if (name.includes('*')) return 'Wildcard records are not allowed.';
    if (parseInt(ttl) < 3600) return 'TTL must be at least 1 hour.';
    if (type === 'A' && !/^(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)$/.test(c)) return 'Invalid IPv4 address.';
    if (type === 'AAAA' && !c.includes(':')) return 'Invalid IPv6 address.';
    if (type === 'MX') { const p = +fields.mxPriority; if (isNaN(p) || p < 0 || p > 65535) return 'MX priority must be 0–65535.'; }
    if (type === 'SRV') { const [p, w, po] = [+fields.srvPriority, +fields.srvWeight, +fields.srvPort]; if ([p, w].some((n) => isNaN(n) || n < 0 || n > 65535)) return 'SRV priority/weight must be 0–65535.'; if (isNaN(po) || po < 1 || po > 65535) return 'SRV port must be 1–65535.'; }
    if (type === 'CAA') { const fl = +fields.caaFlags; if (isNaN(fl) || fl < 0 || fl > 255) return 'CAA flags must be 0–255.'; if (!['issue', 'issuewild', 'iodef'].includes(fields.caaTag)) return 'CAA tag must be issue, issuewild, or iodef.'; }
    return null;
  };
  const compose = () => {
    const c = fields.content.trim();
    if (type === 'MX') return `${fields.mxPriority} ${c}`;
    if (type === 'SRV') return `${fields.srvPriority} ${fields.srvWeight} ${fields.srvPort} ${c}`;
    if (type === 'CAA') return `${fields.caaFlags} ${fields.caaTag} "${c}"`;
    if (type === 'TXT') return c.startsWith('"') ? c : `"${c}"`;
    return c;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { toast.error(err); return; }
    onSubmit({ type, name, content: compose(), ttl: parseInt(ttl) }, initial);
  };

  const fqdn = name && name !== '@' ? `${name}.${stripDot(zoneName)}` : stripDot(zoneName);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => { setType(v); setFields(decompose(v, '')); }} disabled={isEdit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{EDITABLE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="rec-name">Name</Label>
          <Input id="rec-name" className="font-mono" placeholder="@ or subdomain" value={name === '@' ? '' : name} onChange={(e) => setName(e.target.value || '@')} />
        </div>
        <div className="space-y-1.5">
          <Label>TTL</Label>
          <Select value={ttl} onValueChange={setTtl}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{TTL_OPTIONS.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <p className="truncate font-mono text-xs text-muted-foreground"><span className="text-muted-foreground/60">FQDN: </span>{fqdn}</p>

      {type === 'MX' && (
        <div className="space-y-1.5"><Label htmlFor="mx-pri">Priority</Label><Input id="mx-pri" className="font-mono" value={fields.mxPriority} onChange={(e) => setField('mxPriority', e.target.value)} /></div>
      )}
      {type === 'SRV' && (
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5"><Label>Priority</Label><Input className="font-mono" value={fields.srvPriority} onChange={(e) => setField('srvPriority', e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Weight</Label><Input className="font-mono" value={fields.srvWeight} onChange={(e) => setField('srvWeight', e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Port</Label><Input className="font-mono" value={fields.srvPort} onChange={(e) => setField('srvPort', e.target.value)} /></div>
        </div>
      )}
      {type === 'CAA' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Flags</Label><Input className="font-mono" value={fields.caaFlags} onChange={(e) => setField('caaFlags', e.target.value)} /></div>
          <div className="space-y-1.5">
            <Label>Tag</Label>
            <Select value={fields.caaTag} onValueChange={(v) => setField('caaTag', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="issue">issue</SelectItem><SelectItem value="issuewild">issuewild</SelectItem><SelectItem value="iodef">iodef</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="rec-content">{type === 'CAA' ? 'Value' : 'Content'}</Label>
        <Input id="rec-content" className="font-mono" placeholder={type === 'A' ? '192.0.2.1' : type === 'CNAME' ? 'target.example.com' : 'value'} value={fields.content} onChange={(e) => setField('content', e.target.value)} />
      </div>

      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
        <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{isEdit ? 'Save changes' : 'Add record'}</Button>
      </DialogFooter>
    </form>
  );
}

function RecordFormDialog({ open, onOpenChange, zoneName, initial, onSubmit, submitting }) {
  const isEdit = !!initial;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit record' : 'Add DNS record'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Saving replaces the existing record.' : 'Create a new record for this zone.'}</DialogDescription>
        </DialogHeader>
        {open && <RecordForm zoneName={zoneName} initial={initial} onSubmit={onSubmit} submitting={submitting} />}
      </DialogContent>
    </Dialog>
  );
}

function Callout({ tone = 'warning', icon: Icon, title, children }) {
  const tones = { warning: 'border-warning/25 bg-warning/5', destructive: 'border-destructive/25 bg-destructive/5' };
  const iconTone = { warning: 'text-warning', destructive: 'text-destructive' };
  return (
    <div className={cn('rounded-xl border p-6', tones[tone])}>
      <div className="mb-3 flex items-center gap-2"><Icon className={cn('h-5 w-5', iconTone[tone])} /><h3 className="text-base font-semibold text-foreground">{title}</h3></div>
      {children}
    </div>
  );
}

export default function ZoneDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zone, setZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [verifying, setVerifying] = useState(false);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [recordDialog, setRecordDialog] = useState({ open: false, initial: null });
  const [submitting, setSubmitting] = useState(false);
  const [deletingKey, setDeletingKey] = useState(null);
  const [deletingZone, setDeletingZone] = useState(false);
  const [toolsDialog, setToolsDialog] = useState(null); // 'templates' | 'import' | 'bulk'
  const [selected, setSelected] = useState(() => new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [activityKey, setActivityKey] = useState(0);
  const [diagnoseOpen, setDiagnoseOpen] = useState(false);
  const [meta, setMeta] = useState({}); // recordKey -> { comment, labels }
  const [metaDialog, setMetaDialog] = useState(null); // { key, label, initial }
  const [labelFilter, setLabelFilter] = useState('all');

  const fetchZoneMetadata = useCallback(async () => {
    try { setZone(await getZoneDetails(id, false)); }
    catch (err) { setError('Failed to fetch zone details'); console.error(err); }
    finally { setLoading(false); }
  }, [id]);

  const fetchRecords = useCallback(async (query = '') => {
    setLoadingRecords(true);
    try { setRecords((await getZoneRecords(id, query)) || []); }
    catch (err) { console.error('Failed to fetch records:', err); }
    finally { setLoadingRecords(false); }
  }, [id]);

  const fetchMeta = useCallback(async () => {
    try {
      const data = await getRecordMeta(id);
      const map = {};
      (data.meta || []).forEach((m) => { map[m.recordKey] = { comment: m.comment, labels: m.labels || [] }; });
      setMeta(map);
    } catch { /* metadata is best-effort */ }
  }, [id]);

  useEffect(() => { fetchZoneMetadata(); fetchRecords(''); fetchMeta(); }, [fetchZoneMetadata, fetchRecords, fetchMeta]);
  useEffect(() => { const t = setTimeout(() => fetchRecords(searchQuery), 400); return () => clearTimeout(t); }, [searchQuery, fetchRecords]);

  const handleVerifyZone = async () => {
    setVerifying(true); setVerificationDetails(null);
    try { await verifyZone(id); toast.success('Zone verified successfully'); fetchZoneMetadata(); }
    catch (err) { const d = err.response?.data; toast.error(d?.error || err.message); if (d?.current) setVerificationDetails(d); }
    finally { setVerifying(false); }
  };
  const handleVerifyOwnership = async () => {
    setVerifying(true);
    try { await verifyOwnership(id); toast.success('Ownership verified successfully'); fetchZoneMetadata(); }
    catch (err) { const d = err.response?.data; toast.error((d?.error || err.message) + (d?.hint ? ` ${d.hint}` : '')); }
    finally { setVerifying(false); }
  };
  const handleExportZone = async () => {
    try { await exportZone(id, zone.name); toast.success(`Exported ${zone.name}`); }
    catch (err) { toast.error('Failed to export: ' + (err.response?.data?.error || err.message)); }
  };
  const handleCopyCode = (code) => { navigator.clipboard.writeText(code); setCodeCopied(true); toast.success('Verification code copied'); setTimeout(() => setCodeCopied(false), 2000); };

  const submitRecord = async (payload, original) => {
    setSubmitting(true);
    try {
      await addRecord(id, payload);
      if (original) await deleteRecord(id, original.name, original.type, original.content).catch(() => {});
      toast.success(original ? 'Record updated' : `${payload.type} record added`);
      setRecordDialog({ open: false, initial: null });
      fetchRecords(searchQuery);
    } catch (err) { toast.error('Failed to save record: ' + (err.response?.data?.error || err.message)); }
    finally { setSubmitting(false); }
  };

  const deleteOne = async (row) => {
    const key = `${row.name}-${row.type}-${row.content}`;
    setDeletingKey(key);
    const snapshot = records;
    setRecords((prev) => prev.map((rr) => (rr.name === row.name && rr.type === row.type ? { ...rr, records: rr.records.filter((r) => r.content !== row.content) } : rr)).filter((rr) => rr.records.length > 0));
    try { await deleteRecord(id, row.name, row.type, row.content); toast.success(`${row.type} record deleted`); }
    catch (err) { setRecords(snapshot); toast.error('Failed to delete: ' + (err.response?.data?.error || err.message)); }
    finally { setDeletingKey(null); }
  };

  const afterTool = () => { fetchRecords(searchQuery); fetchZoneMetadata(); fetchMeta(); setActivityKey((k) => k + 1); };

  const toggleSelect = (key) => setSelected((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const bulkDelete = async (selectedRows) => {
    setBulkDeleting(true);
    try {
      const del = selectedRows.map((r) => ({ name: r.name, type: r.type, content: r.content }));
      const res = await batchRecords(id, { delete: del });
      if (res.deleted > 0) toast.success(`Deleted ${res.deleted} record${res.deleted > 1 ? 's' : ''}`);
      if (res.errors?.length) toast.warning(`${res.errors.length} could not be deleted`);
      setSelected(new Set());
      afterTool();
    } catch (err) {
      toast.error('Bulk delete failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleDeleteZone = async () => {
    setDeletingZone(true);
    try { await deleteZone(id); toast.success('Zone deleted'); navigate('/dashboard'); }
    catch (err) { toast.error('Failed to delete zone: ' + (err.response?.data?.error || err.message)); setDeletingZone(false); }
  };

  const rows = useMemo(() => {
    const flat = (records || []).flatMap((rr) => (rr.records || []).map((r) => ({ name: rr.name, type: rr.type, ttl: rr.ttl, content: r.content })));
    let list = typeFilter === 'all' ? flat : flat.filter((r) => r.type === typeFilter);
    if (labelFilter !== 'all') list = list.filter((r) => (meta[metaKey(r)]?.labels || []).includes(labelFilter));
    return list;
  }, [records, typeFilter, labelFilter, meta]);
  const availableTypes = useMemo(() => Array.from(new Set((records || []).map((rr) => rr.type))).sort(), [records]);
  const availableLabels = useMemo(() => Array.from(new Set(Object.values(meta).flatMap((m) => m.labels || []))).sort(), [meta]);

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <AlertCircle className="mb-4 h-10 w-10 text-destructive" />
      <h2 className="text-xl font-semibold text-foreground">Unable to load zone</h2>
      <p className="mt-2 text-muted-foreground">{error}</p>
      <Button asChild variant="outline" className="mt-6"><Link to="/dashboard">Return to dashboard</Link></Button>
    </div>
  );
  if (!zone) return <div className="mt-20 text-center text-foreground">Zone not found</div>;

  const isPending = zone.status === 'pending_verification' || zone.status === 'pending';
  const isPendingOwnership = zone.status === 'pending_ownership';
  const isSuspended = zone.status === 'suspended';
  const isBlocked = isPending || isPendingOwnership || isSuspended;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Back to dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          <div className="min-w-0">
            <h1 className="truncate font-mono text-xl font-semibold text-foreground">{stripDot(zone.name)}</h1>
            <div className="mt-1"><StatusBadge status={zone.status} /></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setDiagnoseOpen(true)}><Stethoscope className="h-4 w-4" /> Diagnose</Button>
          <Button variant="outline" onClick={handleExportZone}><Download className="h-4 w-4" /> Export</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline" size="icon" aria-label="Zone actions"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleExportZone}><Download /> Export zone file</DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive"><Trash2 /> Delete zone</DropdownMenuItem></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this zone?</AlertDialogTitle>
                    <AlertDialogDescription>This permanently deletes <span className="font-mono text-foreground">{stripDot(zone.name)}</span> and all its DNS records. This cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteZone} disabled={deletingZone}>{deletingZone ? 'Deleting…' : 'Delete zone'}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isPendingOwnership && zone.ownershipCode && (
        <Callout tone="warning" icon={AlertTriangle} title="Verify domain ownership">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">{stripDot(zone.name)}</span> is a platform subdomain. Copy the code below and add it on the <a href="https://domain.stackryze.com/my-domains" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Domains platform</a>.</p>
              <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <code className="truncate font-mono text-sm text-primary">{zone.ownershipCode}</code>
                <Button size="sm" variant="secondary" onClick={() => handleCopyCode(zone.ownershipCode)}>{codeCopied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}</Button>
              </div>
              <Button onClick={handleVerifyOwnership} disabled={verifying}>{verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Verify ownership</Button>
            </div>
            <div className="rounded-lg border border-border bg-background/60 p-4">
              <h4 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Steps</h4>
              <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                <li>Copy the verification code.</li>
                <li>Go to <a href="https://domain.stackryze.com/my-domains" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">domain.stackryze.com</a>.</li>
                <li>Open <span className="font-mono text-foreground">{stripDot(zone.name)}</span> → Manage.</li>
                <li>Paste the code and confirm, then verify here.</li>
              </ol>
            </div>
          </div>
        </Callout>
      )}

      {isPending && (
        <Callout tone="warning" icon={AlertTriangle} title="Complete your setup">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">{stripDot(zone.name)}</span> is not active yet. Replace your current nameservers with Stackryze nameservers.</p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Required nameservers</h4>
                  <div className="flex flex-col gap-2">
                    {['ns1.stackryze.com', 'ns2.stackryze.com', 'ns3.stackryze.com'].map((ns) => (
                      <button key={ns} onClick={() => { navigator.clipboard.writeText(ns); toast.success('Copied'); }} className="group flex items-center justify-between rounded-lg border border-success/20 bg-success/5 px-3 py-2 font-mono text-sm text-success transition-colors hover:bg-success/10">{ns}<Copy className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" /></button>
                    ))}
                  </div>
                </div>
                {verificationDetails?.current && (
                  <div>
                    <h4 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-destructive">Current nameservers</h4>
                    <div className="flex flex-col gap-2">
                      {verificationDetails.current.length > 0 ? verificationDetails.current.map((ns) => (
                        <div key={ns} className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 font-mono text-sm text-destructive"><X className="h-3.5 w-3.5" /> {ns}</div>
                      )) : <div className="py-2 text-sm italic text-muted-foreground">No nameservers found</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Button onClick={handleVerifyZone} disabled={verifying} className="shrink-0">{verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />} Check nameservers</Button>
          </div>
        </Callout>
      )}

      {isSuspended && (
        <Callout tone="destructive" icon={ShieldOff} title="Zone suspended">
          <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">{stripDot(zone.name)}</span> has been suspended by an administrator. Your DNS records are safe. Think this is an error? <a href="mailto:support@stackryze.com" className="text-primary hover:underline">Contact support</a>.</p>
        </Callout>
      )}

      <div className={cn('space-y-4', isBlocked && 'pointer-events-none opacity-60')}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">DNS records</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{zone.records_count || rows.length}/{zone.recordLimit || 200} records</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56"><Input placeholder="Search records…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search records" /></div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-28"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All types</SelectItem>{availableTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            {availableLabels.length > 0 && (
              <Select value={labelFilter} onValueChange={setLabelFilter}>
                <SelectTrigger className="w-28"><SelectValue placeholder="Label" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All labels</SelectItem>{availableLabels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            )}
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => fetchRecords(searchQuery)} aria-label="Refresh records"><RotateCw className={cn('h-4 w-4', loadingRecords && 'animate-spin')} /></Button></TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline"><Wrench className="h-4 w-4" /> Tools</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setToolsDialog('templates')}><Sparkles /> Record templates</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setToolsDialog('import')}><Search /> Import existing DNS</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setToolsDialog('bulk')}><FileUp /> Bulk import</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setToolsDialog('builder')}><Wrench /> SPF / DMARC builder</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setToolsDialog('temporary')}><Timer /> Temporary record</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setToolsDialog('schedule')}><CalendarClock /> Schedule change</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setRecordDialog({ open: true, initial: null })}><Plus className="h-4 w-4" /> Add record</Button>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5">
            <span className="text-sm text-foreground">{selected.size} record{selected.size > 1 ? 's' : ''} selected</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Clear</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="destructive" size="sm" disabled={bulkDeleting}>{bulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete selected</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Delete {selected.size} record{selected.size > 1 ? 's' : ''}?</AlertDialogTitle><AlertDialogDescription>This permanently removes the selected DNS records. This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => bulkDelete(rows.filter((r) => selected.has(`${r.name}-${r.type}-${r.content}`)))}>Delete</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}

        <div className="panel overflow-hidden rounded-xl">
          {loadingRecords && rows.length === 0 ? (
            <div className="divide-y divide-border">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="flex items-center gap-4 px-4 py-4"><Skeleton className="h-5 w-14 rounded-md" /><Skeleton className="h-4 w-32" /><Skeleton className="h-4 flex-1" /><Skeleton className="h-4 w-16" /></div>))}</div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center"><Globe className="mb-3 h-8 w-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">{searchQuery ? 'No matching records.' : 'No DNS records yet.'}</p></div>
          ) : (
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10">
                    <button
                      aria-label="Select all records"
                      onClick={() => {
                        const keys = rows.filter((r) => r.type !== 'SOA' && r.type !== 'NS').map((r) => `${r.name}-${r.type}-${r.content}`);
                        setSelected((prev) => (keys.every((k) => prev.has(k)) ? new Set() : new Set(keys)));
                      }}
                      className={cn('flex h-4 w-4 items-center justify-center rounded border', selected.size > 0 ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}
                    >
                      {selected.size > 0 && <Check className="h-3 w-3" />}
                    </button>
                  </TableHead>
                  <TableHead className="w-20">Type</TableHead><TableHead className="w-48">Name</TableHead><TableHead>Content</TableHead><TableHead className="w-24">TTL</TableHead><TableHead className="w-16 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => {
                  const key = `${row.name}-${row.type}-${row.content}`;
                  const locked = row.type === 'SOA' || row.type === 'NS';
                  return (
                    <TableRow key={`${key}-${i}`} className="group hover:bg-secondary/40">
                      <TableCell className="align-top">
                        {!locked && (
                          <button
                            aria-label="Select record"
                            onClick={() => toggleSelect(key)}
                            className={cn('flex h-4 w-4 items-center justify-center rounded border', selected.has(key) ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}
                          >
                            {selected.has(key) && <Check className="h-3 w-3" />}
                          </button>
                        )}
                      </TableCell>
                      <TableCell className="align-top"><RecordTypeBadge type={row.type} /></TableCell>
                      <TableCell className="align-top break-all font-mono text-xs text-foreground">{stripDot(row.name)}</TableCell>
                      <TableCell className="align-top break-all font-mono text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">{stripDot(row.content)}<CopyButton value={stripDot(row.content)} /></span>
                        {(() => {
                          const m = meta[metaKey(row)];
                          if (!m || (!m.comment && (!m.labels || m.labels.length === 0))) return null;
                          return (
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              {m.comment && <span className="inline-flex items-center gap-1 font-sans text-[11px] italic text-muted-foreground"><MessageSquare className="h-3 w-3" />{m.comment}</span>}
                              {(m.labels || []).map((l) => <span key={l} className="rounded-full border border-border bg-secondary px-2 py-0.5 font-sans text-[10px] text-foreground">{l}</span>)}
                            </div>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="align-top text-xs text-muted-foreground">{row.ttl}s</TableCell>
                      <TableCell className="align-top text-right">
                        {!locked && (
                          <div className="flex items-center justify-end gap-0.5">
                            <Tooltip>
                              <TooltipTrigger asChild><button onClick={() => setMetaDialog({ key: metaKey(row), label: `${stripDot(row.name)} ${row.type}`, initial: meta[metaKey(row)] })} className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Tag className="h-3.5 w-3.5" /></button></TooltipTrigger>
                              <TooltipContent>Comment &amp; labels</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild><button onClick={() => setRecordDialog({ open: true, initial: row })} className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Pencil className="h-3.5 w-3.5" /></button></TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                            <AlertDialog>
                              <AlertDialogTrigger asChild><button aria-label="Delete record" disabled={deletingKey === key} className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">{deletingKey === key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}</button></AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Delete {row.type} record?</AlertDialogTitle><AlertDialogDescription className="break-all font-mono text-xs">{stripDot(row.content)}</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteOne(row)}>Delete</AlertDialogAction></AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <RecordFormDialog open={recordDialog.open} onOpenChange={(o) => setRecordDialog((d) => ({ ...d, open: o }))} zoneName={zone.name} initial={recordDialog.initial} onSubmit={submitRecord} submitting={submitting} />

      {!isBlocked && (
        <div className="panel rounded-xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>
          </div>
          <ActivityTimeline key={activityKey} zoneId={id} limit={15} onChanged={afterTool} />
        </div>
      )}

      <TemplatesDialog open={toolsDialog === 'templates'} onOpenChange={(o) => setToolsDialog(o ? 'templates' : null)} zoneId={id} zoneName={zone.name} onApplied={afterTool} />
      <ImportScanDialog open={toolsDialog === 'import'} onOpenChange={(o) => setToolsDialog(o ? 'import' : null)} zoneId={id} zoneName={zone.name} onApplied={afterTool} />
      <BulkImportDialog open={toolsDialog === 'bulk'} onOpenChange={(o) => setToolsDialog(o ? 'bulk' : null)} zoneId={id} zoneName={zone.name} onApplied={afterTool} />
      <RecordBuilders open={toolsDialog === 'builder'} onOpenChange={(o) => setToolsDialog(o ? 'builder' : null)} zoneId={id} onApplied={afterTool} />
      <TemporaryRecordDialog open={toolsDialog === 'temporary'} onOpenChange={(o) => setToolsDialog(o ? 'temporary' : null)} zoneId={id} zoneName={zone.name} onApplied={afterTool} />
      <ScheduleDialog open={toolsDialog === 'schedule'} onOpenChange={(o) => setToolsDialog(o ? 'schedule' : null)} zoneId={id} zoneName={zone.name} onApplied={afterTool} />
      <DiagnoseDialog open={diagnoseOpen} onOpenChange={setDiagnoseOpen} zoneName={zone.name} />
      <RecordMetaDialog
        open={!!metaDialog}
        onOpenChange={(o) => !o && setMetaDialog(null)}
        zoneId={id}
        recordKey={metaDialog?.key}
        recordLabel={metaDialog?.label}
        initial={metaDialog?.initial}
        onSaved={(key, val) => setMeta((prev) => ({ ...prev, [key]: val }))}
      />
    </div>
  );
}
