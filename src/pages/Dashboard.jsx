import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getZones, createZone, cloneZone } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Plus, Globe, ArrowUpDown, Loader2, Search, Server, ShieldCheck, ShieldOff, Clock, ChevronRight, RotateCw, Inbox, MoreHorizontal, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Label } from '../components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../components/ui/dropdown-menu';
import { cn } from '../lib/utils';

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

function StatCard({ icon: Icon, label, value, tone, subtitle }) {
  return (
    <div className="panel flex items-center gap-3 rounded-xl p-4 md:gap-4 md:p-5">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-secondary md:h-11 md:w-11', tone)}><Icon className="h-5 w-5" /></div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-display text-xl font-semibold text-foreground md:text-2xl">{value}</p>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

const DOMAIN_RE = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{1,63})+$/i;

function CreateZoneDialog({ onCreated, remaining }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const value = name.trim().toLowerCase();
    if (!DOMAIN_RE.test(value)) { setErr('Enter a valid domain, e.g. example.com'); return; }
    setErr(''); setCreating(true);
    try {
      await createZone(value);
      toast.success(`Zone “${value}” created`);
      setName(''); setOpen(false); onCreated();
    } catch (e2) {
      toast.error('Failed to create zone: ' + (e2.response?.data?.error || e2.message));
    } finally { setCreating(false); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-add-zone disabled={remaining <= 0} title={remaining <= 0 ? 'Zone limit reached' : undefined}><Plus className="h-4 w-4" /> Add domain</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a domain</DialogTitle>
          <DialogDescription>Create a new DNS zone. You can verify ownership and add records right after.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zone-name">Domain name</Label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="zone-name" autoFocus placeholder="example.com" value={name} onChange={(e) => { setName(e.target.value); setErr(''); }} className="pl-10 font-mono" aria-invalid={!!err} />
            </div>
            {err && <p className="text-xs text-destructive">{err}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit" disabled={creating}>{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create zone</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SortHeader({ label, active, onClick, className }) {
  return (
    <TableHead className={className}>
      <button onClick={onClick} className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
        {label}<ArrowUpDown className={cn('h-3.5 w-3.5', active ? 'text-primary' : 'opacity-40')} />
      </button>
    </TableHead>
  );
}

function CloneDialog({ source, zones, onOpenChange, onDone }) {
  const [targetId, setTargetId] = useState('');
  const [cloning, setCloning] = useState(false);
  const targets = zones.filter((z) => z._id !== source?._id);

  const doClone = async () => {
    if (!targetId) return;
    setCloning(true);
    try {
      const res = await cloneZone(source._id, targetId);
      if (res.created > 0) toast.success(`Copied ${res.created} record${res.created > 1 ? 's' : ''}`);
      if (res.errors?.length) toast.warning(`${res.errors.length} skipped (duplicates or limits)`);
      if (res.created === 0) toast.message('No records were copied');
      onDone?.();
      onOpenChange(false);
    } catch (err) {
      toast.error('Clone failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setCloning(false);
    }
  };

  return (
    <Dialog open={!!source} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clone records</DialogTitle>
          <DialogDescription>Copy all records from <span className="font-mono text-foreground">{source?.name}</span> into another zone.</DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Target zone</Label>
          <Select value={targetId} onValueChange={setTargetId}>
            <SelectTrigger><SelectValue placeholder="Choose a zone…" /></SelectTrigger>
            <SelectContent>
              {targets.length === 0 ? <SelectItem value="none" disabled>No other zones</SelectItem> : targets.map((z) => <SelectItem key={z._id} value={z._id}>{z.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={doClone} disabled={!targetId || cloning}>{cloning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />} Clone records</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [limits, setLimits] = useState({ zoneLimit: 3, remainingZones: 3 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState({ key: 'updatedAt', dir: 'desc' });
  const [cloneSource, setCloneSource] = useState(null);

  const fetchZones = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await getZones();
      setZones(data.zones || data || []);
      if (data.limits) setLimits(data.limits);
    } catch (err) {
      setError('Failed to load zones. Please check your connection.');
      console.error(err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchZones(); }, [fetchZones]);

  const counts = useMemo(() => ({
    total: zones.length,
    active: zones.filter((z) => z.status === 'active').length,
    pending: zones.filter((z) => String(z.status || '').startsWith('pending')).length,
    suspended: zones.filter((z) => z.status === 'suspended').length,
  }), [zones]);

  const toggleSort = (key) => setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  const visible = useMemo(() => {
    let list = zones.filter((z) => z.name.toLowerCase().includes(query.toLowerCase()));
    if (statusFilter !== 'all') {
      list = list.filter((z) => statusFilter === 'pending' ? String(z.status || '').startsWith('pending') : z.status === statusFilter);
    }
    const { key, dir } = sort;
    const mul = dir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      if (key === 'name') return a.name.localeCompare(b.name) * mul;
      let av = key === 'records_count' ? (a.records_count || 0) : new Date(a.updatedAt).getTime();
      let bv = key === 'records_count' ? (b.records_count || 0) : new Date(b.updatedAt).getTime();
      return (av > bv ? 1 : av < bv ? -1 : 0) * mul;
    });
  }, [zones, query, statusFilter, sort]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Domains</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your zones and DNS records.</p>
        </div>
        <CreateZoneDialog onCreated={fetchZones} remaining={limits.remainingZones ?? (limits.zoneLimit - zones.length)} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatCard icon={Server} label="Total zones" value={`${counts.total}/${limits.zoneLimit}`} tone="text-primary" subtitle={(limits.remainingZones ?? 0) > 0 ? `${limits.remainingZones} remaining` : 'Limit reached'} />
        <StatCard icon={Clock} label="Pending" value={counts.pending} tone="text-warning" />
        <StatCard icon={ShieldCheck} label="Active" value={counts.active} tone="text-success" />
        <StatCard icon={ShieldOff} label="Suspended" value={counts.suspended} tone="text-destructive" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search domains…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" aria-label="Search domains" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <ZonesSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-12 text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
          <Button variant="outline" onClick={fetchZones}><RotateCw className="h-4 w-4" /> Retry</Button>
        </div>
      ) : visible.length === 0 ? (
        <EmptyState hasZones={zones.length > 0} onClear={() => { setQuery(''); setStatusFilter('all'); }} />
      ) : (
        <>
          <div className="panel hidden overflow-hidden rounded-xl md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <SortHeader label="Domain" active={sort.key === 'name'} onClick={() => toggleSort('name')} />
                  <TableHead>Status</TableHead>
                  <SortHeader label="Records" active={sort.key === 'records_count'} onClick={() => toggleSort('records_count')} />
                  <SortHeader label="Updated" active={sort.key === 'updatedAt'} onClick={() => toggleSort('updatedAt')} />
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((zone) => (
                  <TableRow key={zone._id} className="cursor-pointer" onClick={() => navigate(`/zones/${zone._id}`)}>
                    <TableCell className="font-mono font-medium text-foreground">{zone.name}</TableCell>
                    <TableCell><StatusBadge status={zone.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{zone.records_count || 0}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(zone.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Zone actions"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => navigate(`/zones/${zone._id}`)}><ChevronRight /> Open zone</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setCloneSource(zone)}><Copy /> Clone records…</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {visible.map((zone) => (
              <button key={zone._id} onClick={() => navigate(`/zones/${zone._id}`)} className="panel flex items-center justify-between gap-3 rounded-xl p-4 text-left transition-colors hover:border-border-strong">
                <div className="min-w-0">
                  <p className="truncate font-mono font-medium text-foreground">{zone.name}</p>
                  <div className="mt-2 flex items-center gap-2"><StatusBadge status={zone.status} /><span className="text-xs text-muted-foreground">{zone.records_count || 0} records</span></div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </>
      )}

      <CloneDialog source={cloneSource} zones={zones} onOpenChange={(o) => !o && setCloneSource(null)} onDone={fetchZones} />
    </div>
  );
}

function ZonesSkeleton() {
  return (
    <div className="panel overflow-hidden rounded-xl">
      <div className="border-b border-border px-4 py-3"><Skeleton className="h-4 w-24" /></div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 border-b border-border px-4 py-4 last:border-0">
          <Skeleton className="h-4 w-48" /><Skeleton className="h-5 w-20 rounded-full" /><Skeleton className="h-4 w-10" /><Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasZones, onClear }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card/40 py-20 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-secondary"><Inbox className="h-7 w-7 text-muted-foreground" /></div>
      <h3 className="text-lg font-semibold text-foreground">{hasZones ? 'No matching domains' : 'No domains yet'}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{hasZones ? 'Try a different search or clear the filters.' : 'Add your first domain to start managing DNS records.'}</p>
      {hasZones && <Button variant="outline" className="mt-6" onClick={onClear}>Clear filters</Button>}
    </div>
  );
}
