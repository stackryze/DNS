import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings as SettingsIcon, Plus, Globe, LogOut, ExternalLink, FileText, CornerDownLeft } from 'lucide-react';
import { getZones } from '../services/api';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandShortcut } from './ui/command';

export default function CommandMenu({ open, onOpenChange }) {
  const navigate = useNavigate();
  const [zones, setZones] = React.useState([]);

  React.useEffect(() => {
    if (!open || zones.length) return;
    getZones().then((d) => setZones(d.zones || d || [])).catch(() => {});
  }, [open, zones.length]);

  const run = (fn) => { onOpenChange(false); fn(); };

  const logout = () => {
    localStorage.removeItem('sr_auth');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    window.location.href = `${API_URL}/auth/logout`;
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search zones, pages, and actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => run(() => navigate('/dashboard'))}><LayoutDashboard /> Dashboard</CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/dns-checker'))}><Activity /> DNS Checker</CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/settings'))}><SettingsIcon /> Settings</CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(() => { navigate('/dashboard'); setTimeout(() => document.querySelector('[data-add-zone]')?.click(), 120); })}>
            <Plus /> Add a domain <CommandShortcut>then ↵</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(logout)}><LogOut /> Sign out</CommandItem>
        </CommandGroup>

        {zones.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Your zones">
              {zones.slice(0, 8).map((z) => (
                <CommandItem key={z._id} value={`zone ${z.name}`} onSelect={() => run(() => navigate(`/zones/${z._id}`))}>
                  <Globe /> {z.name} <CommandShortcut><CornerDownLeft className="h-3 w-3" /></CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />

        <CommandGroup heading="Resources">
          <CommandItem onSelect={() => run(() => window.open('https://dns-docs.stackryze.com', '_blank', 'noopener'))}>
            <FileText /> Documentation <ExternalLink className="ml-auto h-3.5 w-3.5" />
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open('https://status.stackryze.com', '_blank', 'noopener'))}>
            <Activity /> Status page <ExternalLink className="ml-auto h-3.5 w-3.5" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
