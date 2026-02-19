import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, Zap, Heart, CheckCircle, XCircle, Loader2, Code, Users, Play, LayoutDashboard } from 'lucide-react';
import WorldMap from '../components/WorldMap';
import StatsDisplay from '../components/StatsDisplay';

const Landing = () => {
    const navigate = useNavigate();
    const [domain, setDomain] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Mock check for now, or redirect to dashboard
    const handleCheck = () => {
        if (!domain) return;
        setIsChecking(true);
        setTimeout(() => {
            setIsChecking(false);
            navigate('/dashboard');
        }, 1000);
    };

    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <div className="min-h-screen bg-[#1A1A1A] font-sans text-white selection:bg-[#38BDF8] selection:text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-white/5 w-full transition-all duration-300">
                <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 h-16 sm:h-20 flex items-center justify-between">
                    {/* Left Side: Logo */}
                    <div className="flex items-center gap-12">
                        <a href="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
                            <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-8 sm:h-10 w-auto" />
                            <span className="text-sm sm:text-lg md:text-xl font-bold text-white tracking-tight">Stackryze <span className="text-[#38BDF8]">DNS</span></span>
                        </a>

                        {/* Desktop Navigation */}
                        <nav className="hidden xl:flex items-center gap-8">
                            <a href="#features" className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#38BDF8] transition-colors">Features</a>
                            <a href="#network" className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#38BDF8] transition-colors">Network</a>
                            <a href="https://dns-docs.stackryze.com" target="_blank" className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#38BDF8] transition-colors">Docs</a>
                            <a href="https://status.stackryze.com" target="_blank" className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#38BDF8] transition-colors">Status</a>
                            <a href="https://github.com/stackryze/DNS" target="_blank" className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#38BDF8] transition-colors">GitHub</a>
                        </nav>
                    </div>

                    {/* Right Side: CTA & Mobile Menu Toggle */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden sm:flex items-center gap-6 mr-2">
                            {!isLoggedIn && <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Login</Link>}
                        </div>
                        <Link
                            to={isLoggedIn ? "/dashboard" : "/login"}
                            className={`${isLoggedIn
                                ? "bg-[#1A1A1A] text-white hover:bg-[#FFD23F] hover:text-[#1A1A1A]"
                                : "bg-[#FFD23F] text-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A]"
                                } px-4 py-2 md:px-6 md:py-2.5 font-bold uppercase text-xs md:text-sm tracking-widest border-2 border-white transition-all duration-150 shadow-[4px_4px_0px_0px_white] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] flex items-center gap-2 group`}
                        >
                            {isLoggedIn && <LayoutDashboard className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
                            <span>{isLoggedIn ? "Dashboard" : "Get Started"}</span>
                        </Link>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="xl:hidden p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <div className="w-6 h-5 relative flex flex-col justify-between overflow-hidden">
                                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0 translate-x-10' : ''}`}></span>
                                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`xl:hidden absolute top-full left-0 right-0 bg-[#1A1A1A] border-b border-white/5 transition-all duration-500 overflow-hidden ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <nav className="p-8 flex flex-col gap-6 text-center">
                        <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#38BDF8]">Features</a>
                        <a href="#network" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#38BDF8]">Network</a>
                        <a href="https://dns-docs.stackryze.com" target="_blank" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#38BDF8]">Documentation</a>
                        <a href="https://status.stackryze.com" target="_blank" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#38BDF8]">Status</a>
                        <a href="https://github.com/stackryze/DNS" target="_blank" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#38BDF8]">GitHub</a>
                        {!isLoggedIn && <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold uppercase tracking-widest text-[#FFD23F]">Login</Link>}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative w-full min-h-screen flex flex-col justify-center pt-20 pb-12 bg-[#1A1A1A] bg-[url('/pixel_art_large.png')] bg-cover bg-center bg-no-repeat overflow-hidden border-b border-[#333]">
                <div className="absolute inset-0 bg-black/60 z-0"></div>

                <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-center items-center text-center">
                    <div className="max-w-5xl mx-auto space-y-8">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white tracking-tight">
                            Modern DNS Hosting<br />
                            <span className="text-[#38BDF8]">for Everyone.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                            Stackryze DNS is a free DNS hosting service, designed with security in mind.<br className="hidden md:block" />
                            Running on <span className="font-bold text-[#FFD23F] font-mono">open-source software</span>, it is free for everyone to use.
                        </p>

                        <div className="pt-4">
                            <Link
                                to="/dashboard"
                                className="inline-flex bg-[#FFD23F] text-[#1A1A1A] py-4 px-8 font-bold uppercase text-sm hover:bg-white hover:text-[#1A1A1A] transition-all shadow-[4px_4px_0px_0px_white] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] items-center gap-2 border-2 border-transparent"
                            >
                                Start Managing Now <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features & Global Infrastructure - Side by Side */}
            <section className="w-full py-24 bg-[#1A1A1A] text-white border-t border-[#333]">
                <div className="w-full px-6 md:px-12 lg:px-16 max-w-[1800px] mx-auto">
                    {/* Full Width Stats - "Cover the entire row" */}
                    <div className="mb-24 w-full relative z-10">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="h-px bg-gradient-to-r from-transparent via-[#333] to-transparent w-full max-w-xs"></div>
                            <h3 className="text-center text-sm font-bold text-[#38BDF8] uppercase tracking-widest whitespace-nowrap">Live Name Server Statistics</h3>
                            <div className="h-px bg-gradient-to-r from-transparent via-[#333] to-transparent w-full max-w-xs"></div>
                        </div>
                        <StatsDisplay />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">

                        {/* LEFT: World Map & Stats */}
                        <div id="network" className="space-y-8 order-2 xl:order-1 sticky top-24 scroll-mt-32">
                            <div className="space-y-4 text-center xl:text-left">
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                                    Global <span className="text-[#38BDF8]">Infrastructure.</span>
                                </h2>
                                <p className="text-lg text-[#D4D4D4] max-w-xl mx-auto xl:mx-0">
                                    Strategically located authoritative name servers ensure low latency and high availability worldwide.
                                </p>
                            </div>
                            <div className="relative w-full">
                                <WorldMap />
                            </div>
                        </div>

                        {/* RIGHT: Features Grid */}
                        <div id="features" className="space-y-12 order-1 xl:order-2 scroll-mt-32">
                            <div className="text-center xl:text-left space-y-6">
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                                    Built for <span className="text-[#38BDF8]">Developers.</span>
                                </h2>
                                <p className="text-lg md:text-xl text-[#D4D4D4] leading-relaxed max-w-xl mx-auto xl:mx-0">
                                    No complex enterprise pricing. No hidden fees.<br className="hidden xl:block" />
                                    Just pure, high-performance DNS.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                                {[
                                    { title: "Modern Records", desc: "Native support for SVCB, HTTPS, and TLSA records.", icon: Globe, color: "text-[#38BDF8]" },
                                    { title: "Simple Interface", desc: "The easiest way to manage DNS. Clean, fast, and intuitive.", icon: LayoutDashboard, color: "text-[#38BDF8]" },
                                    { title: "API First (Under Dev)", desc: "Full automation using standards compliant JSON/REST.", icon: Code, color: "text-[#38BDF8]" },
                                    { title: "Open Source", desc: "100% Free & Non-Profit. Transparent and community driven.", icon: Users, color: "text-[#38BDF8]" },
                                ].map((feature, idx) => (
                                    <div key={idx} className="group flex flex-col items-center xl:items-start text-center xl:text-left space-y-3 sm:space-y-4 p-4 sm:p-5 rounded-2xl border border-transparent hover:border-[#38BDF8]/20 hover:bg-[#38BDF8]/5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.05)]">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#262626] flex items-center justify-center mb-1 group-hover:bg-[#38BDF8]/10 group-hover:scale-110 transition-all duration-300 ring-1 ring-[#333] group-hover:ring-[#38BDF8]/30`}>
                                            <feature.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color} group-hover:brightness-125`} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2 group-hover:text-[#38BDF8] transition-colors">{feature.title}</h3>
                                            <p className="text-[#D4D4D4] leading-relaxed text-[11px] sm:text-sm max-w-[280px] group-hover:text-white transition-colors">
                                                {feature.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center xl:text-left pt-4">
                                <a href="https://dns-docs.stackryze.com" target="_blank" className="inline-flex items-center text-white font-bold border-b-2 border-[#FFD23F] hover:text-[#FFD23F] transition-colors pb-1 group">
                                    READ THE DOCS <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer - Stackryze Design */}
            <footer className="bg-[#1A1A1A] text-white pt-12 pb-4 px-6">
                <div className="w-full max-w-[1600px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between gap-12 mb-8 md:items-start">
                        {/* Brand Section */}
                        <div className="space-y-6">
                            <a href="/" className="flex items-center gap-4 group">
                                <div className="flex items-center gap-3">
                                    <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-10 w-auto" />
                                    <span className="text-2xl font-bold text-white tracking-tight">Stackryze DNS</span>
                                </div>
                            </a>
                            <p className="text-[#E5E3DF] text-sm max-w-sm leading-relaxed">
                                Free DNS for Developers.<br />
                                Built by developers, for developers.
                            </p>

                            <div className="space-y-1">
                                <h5 className="text-[#38BDF8] font-bold text-xs uppercase tracking-wide mb-2">Verified Contact</h5>
                                <p className="text-[#E5E3DF] text-sm font-mono">support@stackryze.com</p>
                                <p className="text-[#E5E3DF] text-sm font-mono">reportabuse@stackryze.com</p>
                                <p className="text-[#E5E3DF] text-sm font-mono">no-reply@stackryze.com</p>
                                <p className="text-[#6B6B6B] text-xs max-w-sm mt-2 italic leading-relaxed">
                                    Note: We don't send any messages from any other domains or prefixes whatsoever.
                                </p>
                            </div>
                        </div>

                        {/* Links Section */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-20">
                            {/* Platform */}
                            <div>
                                <h4 className="font-bold text-base mb-4 text-white">Platform</h4>
                                <ul className="space-y-3 text-sm">
                                    <li><Link to="/dashboard" className="text-[#E5E3DF] hover:text-[#38BDF8] transition-colors">Dashboard</Link></li>
                                    <li><a href="https://dns-docs.stackryze.com" target="_blank" className="text-[#E5E3DF] hover:text-[#38BDF8] transition-colors">Documentation</a></li>
                                    <li><a href="https://status.stackryze.com/" target="_blank" className="text-[#E5E3DF] hover:text-[#38BDF8] transition-colors">System Status</a></li>
                                    <li><Link to="/about" className="text-[#E5E3DF] hover:text-[#38BDF8] transition-colors">About</Link></li>
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <h4 className="font-bold text-base mb-4 text-white">Legal</h4>
                                <ul className="space-y-3 text-sm">
                                    <li><Link to="/terms" className="text-[#E5E3DF] hover:text-[#38BDF8] transition-colors">Terms of Service</Link></li>
                                    <li><Link to="/privacy" className="text-[#E5E3DF] hover:text-[#38BDF8] transition-colors">Privacy Policy</Link></li>
                                    <li><Link to="/aup" className="text-[#E5E3DF] hover:text-[#38BDF8] transition-colors">Acceptable Use</Link></li>
                                    <li><Link to="/abuse" className="text-[#E5E3DF] hover:text-[#38BDF8] transition-colors">Report Abuse</Link></li>
                                </ul>
                            </div>

                            {/* Connect */}
                            <div>
                                <h4 className="font-bold text-base mb-4 text-white">Connect</h4>
                                <ul className="space-y-3 text-sm">
                                    <li><a href="https://github.com/stackryze/DNS" target="_blank" rel="noreferrer" className="text-[#E5E3DF] hover:text-[#38BDF8] transition-colors">GitHub</a></li>
                                    <li><a href="https://github.com/sponsors/sudheerbhuvana" target="_blank" rel="noreferrer" className="text-[#E5E3DF] hover:text-[#38BDF8] transition-colors">Sponsor ❤️</a></li>
                                    <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[#E5E3DF] hover:text-[#38BDF8] transition-colors">Twitter/X</a></li>
                                    <li><a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noreferrer" className="text-[#E5E3DF] hover:text-[#38BDF8] transition-colors">Discord</a></li>
                                    <li><a href="mailto:support@stackryze.com" className="text-[#E5E3DF] hover:text-[#38BDF8] transition-colors">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Attribution - No Border */}
                    <div className="mt-8 flex justify-end">
                        <p className="text-xs text-[#E5E3DF] text-right flex items-center gap-2">
                            A project by <a href="https://stackryze.com" target="_blank" rel="noreferrer" className="font-bold text-white hover:text-[#38BDF8] transition-colors">Stackryze</a>
                            <span className="px-1.5 py-0.5 rounded bg-[#333] text-[10px] text-white">Registered MSME, India</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
