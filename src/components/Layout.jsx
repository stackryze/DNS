import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Globe, Settings, LogOut, Search, Command as CommandIcon, Bell,
  Menu, Activity, ExternalLink, Heart, FileText, Github, ChevronsUpDown, User, Gauge,
} from 'lucide-react';
import { getMe } from '../services/api';
import CommandMenu from './CommandMenu';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { cn } from '../lib/utils';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: Activity, label: 'DNS Checker', to: '/dns-checker' },
  { icon: Gauge, label: 'Edge monitoring', to: '/edge' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

const QUICK_LINKS = [
  { icon: Globe, label: 'Domains', href: 'https://domain.stackryze.com' },
  { icon: Activity, label: 'Status', href: 'https://status.stackryze.com' },
  { icon: FileText, label: 'Docs', href: 'https://dns-docs.stackryze.com' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/stackryze/DNS' },
];

const isActive = (pathname, to) =>
  to === '/dashboard' ? pathname === '/dashboard' || pathname.startsWith('/zones') : pathname === to;

function SidebarNav({ pathname, onNavigate }) {
  return (
    <nav className="flex-1 space-y-0.5">
      {NAV.map(({ icon: Icon, label, to }) => {
        const active = isActive(pathname, to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200',
              active ? 'bg-secondary font-medium text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
            )}
          >
            <Icon className={cn('h-[18px] w-[18px]', active && 'text-primary')} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-2 transition-opacity hover:opacity-80">
      <img src="/stackryze_logo_white.png" alt="Stackryze" className="h-8 w-auto" />
      <span className="font-display text-[15px] font-semibold tracking-tight">
        Stackryze <span className="text-primary">DNS</span>
      </span>
    </Link>
  );
}

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe()
      .then((u) => { setUser(u); localStorage.setItem('sr_auth', '1'); })
      .catch(() => { localStorage.removeItem('sr_auth'); navigate('/login'); });
  }, [navigate]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('sr_auth');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    window.location.href = `${API_URL}/auth/logout`;
  }, []);

  const displayName = user?.username || user?.name || 'Account';
  const initials = (user?.username || user?.name || '?').slice(0, 1).toUpperCase();

  return (
    <div className="flex min-h-screen font-sans text-foreground">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground">
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card p-4 md:flex">
        <div className="mb-8 px-1 pt-2"><Brand /></div>
        <SidebarNav pathname={location.pathname} />
        <div className="mt-4 border-t border-border pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-secondary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar>
                {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={displayName} />}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">{user?.email || ''}</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56">
              <DropdownMenuLabel>Signed in</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => navigate('/settings')}><User /> Account settings</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => window.open('https://auth.stackryze.com', '_blank', 'noopener')}><ExternalLink /> Security (SSO)</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive"><LogOut /> Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden">
                <Menu className="h-5 w-5" /><span className="sr-only">Open navigation</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="mb-6 mt-1"><Brand /></div>
                <SidebarNav pathname={location.pathname} onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <nav className="hidden items-center gap-0.5 lg:flex">
              {QUICK_LINKS.map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground">
                  <Icon className="h-3.5 w-3.5" />{label}<ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              ))}
              <a href="https://github.com/sponsors/sudheerbhuvana/" target="_blank" rel="noopener noreferrer" className="ml-1 flex items-center gap-1.5 rounded-lg border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10">
                <Heart className="h-3.5 w-3.5" /> Donate
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setCmdOpen(true)} className="group flex h-9 items-center gap-2 rounded-lg border border-input bg-secondary/40 pl-2.5 pr-2 text-sm text-muted-foreground transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search…</span>
              <kbd className="ml-2 hidden items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] text-muted-foreground sm:flex"><CommandIcon className="h-3 w-3" />K</kbd>
            </button>
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="border-b border-border px-4 py-3"><p className="text-sm font-semibold text-foreground">Notifications</p></div>
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">You're all caught up.</div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <main id="main-content" className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>

        <footer className="shrink-0 border-t border-border py-4 text-center">
          <div className="flex items-center justify-center gap-2 opacity-60 transition-opacity hover:opacity-100">
            <span className="text-xs text-muted-foreground">A project by</span>
            <a href="https://stackryze.com" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5">
              <img src="/stackryze_logo_white.png" alt="Stackryze" className="h-4 w-auto" />
              <span className="text-xs font-semibold text-foreground transition-colors group-hover:text-primary">Stackryze</span>
            </a>
          </div>
        </footer>
      </div>

      <CommandMenu open={cmdOpen} onOpenChange={setCmdOpen} />
    </div>
  );
}
