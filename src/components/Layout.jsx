import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, Globe, Settings, LogOut, Search, Command, Bell, Menu, X, Activity, ExternalLink, Heart, FileText, Github } from 'lucide-react';
import api from '../services/api';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
        ${active
            ? 'text-white font-medium bg-[#38BDF8]/10 border border-[#38BDF8]/20'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}>
        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#38BDF8] shadow-[0_0_10px_#38BDF8]"></div>}
        <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-[#38BDF8]' : ''}`} />
        <span className="">{label}</span>
    </Link>
);

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Fetch user data
        const fetchUser = async () => {
            try {
                const response = await api.get('/auth/me');
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-[#121212] text-white font-sans selection:bg-[#38BDF8] selection:text-white bg-[url('/pixel_art_large.png')] bg-fixed bg-cover">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm -z-10"></div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-72 flex flex-col bg-[#1A1A1A]/60 backdrop-blur-xl border-r border-white/5 p-6 fixed h-full z-50 transition-transform duration-300 ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}>
                <div className="flex items-center justify-between mb-10">
                    <Link to="/" className="flex items-center gap-3 px-2 hover:opacity-80 transition-opacity">
                        <img src="/stackryze_logo_white.png" alt="Stackryze" className="h-9 w-auto object-contain" />
                        <h1 className="text-base font-bold text-white tracking-wide leading-tight">Stackryze <span className="text-[#38BDF8]">DNS</span></h1>
                    </Link>
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
                    <SidebarItem icon={Activity} label="DNS Checker" to="/dns-checker" active={location.pathname === '/dns-checker'} />
                    <SidebarItem icon={Settings} label="Settings" to="/settings" active={location.pathname === '/settings'} />
                </nav>

                <div className="pt-6 border-t border-white/5">
                    <Link to="/settings" className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg hover:bg-white/5 transition-colors group">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#38BDF8] to-purple-600 ring-2 ring-[#121212] group-hover:ring-[#38BDF8]/20 transition-all"></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors truncate">
                                {user?.username || user?.name || 'Loading...'}
                            </p>
                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                                {user?.email || ''}
                            </p>
                        </div>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 h-screen overflow-hidden flex flex-col relative">
                {/* Topbar */}
                <header className="px-4 md:px-8 py-4 md:py-5 flex justify-between items-center border-b border-white/5 bg-[#121212]/80 backdrop-blur-md z-30 shrink-0">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        
                        {/* Quick Links */}
                        <div className="hidden lg:flex items-center gap-2">
                            <a 
                                href="https://domain.stackryze.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <Globe className="w-3.5 h-3.5" />
                                <span>Domains</span>
                                <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                            <a 
                                href="https://status.stackryze.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <Activity className="w-3.5 h-3.5" />
                                <span>Status</span>
                                <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                            <a 
                                href="https://dns-docs.stackryze.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Docs</span>
                                <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                            <a 
                                href="https://github.com/stackryze/DNS" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <Github className="w-3.5 h-3.5" />
                                <span>GitHub</span>
                                <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                            <a 
                                href="https://github.com/sponsors/sudheerbhuvana/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-300 border border-pink-500/20 transition-all"
                            >
                                <Heart className="w-3.5 h-3.5" />
                                <span>Donate</span>
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="relative group">
                            <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#38BDF8] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchParams.get('q') || ''}
                                onChange={(e) => {
                                    const query = e.target.value;
                                    setSearchParams(query ? { q: query } : {});
                                    if (location.pathname !== '/dashboard') {
                                        navigate(`/dashboard?q=${query}`);
                                    }
                                }}
                                className="w-32 md:w-64 bg-black/20 border border-white/10 rounded-lg py-1.5 md:py-2 pl-8 md:pl-10 pr-2 md:pr-4 text-xs md:text-sm focus:outline-none focus:border-[#38BDF8]/50 focus:ring-1 focus:ring-[#38BDF8]/50 transition-all placeholder-gray-600 text-white"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 opacity-50">
                                <Command className="w-3 h-3 text-gray-400" />
                                <span className="text-[10px] text-gray-400 font-mono">K</span>
                            </div>
                        </div>
                        <button className="p-1.5 md:p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#121212]"></span>
                        </button>
                    </div>
                </header>

                <div className="px-4 md:px-8 py-4 md:py-6 w-full flex-1 overflow-y-auto relative z-0">
                    {children}
                </div>

                <footer className="py-4 text-center shrink-0 border-t border-white/5 bg-[#121212] z-30">
                    <div className="flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                        <span className="text-xs font-medium text-gray-500">A project by</span>
                        <a href="https://stackryze.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 group">
                            <img src="/stackryze_logo_white.png" alt="Stackryze" className="h-4 w-auto opacity-90 group-hover:opacity-100 transition-opacity" />
                            <span className="text-white font-bold text-xs group-hover:text-[#38BDF8] transition-colors">Stackryze</span>
                        </a>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Layout;
