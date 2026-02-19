import React, { useEffect, useState } from 'react';
import { getLiveStats } from '../services/api';

const StatsDisplay = () => {
    const [stats, setStats] = useState({
        totalQueries: 0,
        totalZones: 0,
        totalRecords: 0,
        uptime: 0,
        avgLatency: 0,
        udpAnswers: 0,
        tcpAnswers: 0
    });
    const [loading, setLoading] = useState(true);
    const [rateLimited, setRateLimited] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const fetchStats = async () => {
        try {
            const data = await getLiveStats();
            if (data) {
                setStats(data);
                setRateLimited(false);
            }
        } catch (error) {
            if (error.response?.status === 429) {
                setRateLimited(true);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000);
            }
            console.error("Failed to fetch stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Stats are cached on backend for 2 hours, so no need to poll frequently
    }, []);

    const formatUptime = (seconds) => {
        if (!seconds) return "0h";
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        if (days > 0) return `${days}d ${hours}h`;
        return `${hours}h ${Math.floor((seconds % 3600) / 60)}m`;
    };

    const formatLatency = (us) => {
        if (!us) return "0ms";
        // Convert microseconds to ms
        return `${(us / 1000).toFixed(2)}ms`;
    };

    const formatNumber = (num) => {
        return (num || 0).toLocaleString();
    };

    return (
        <div className="w-full mt-8">
            <div className={`grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 divide-y md:divide-y-0 xl:divide-x divide-white/10 bg-[#262626]/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${loading ? 'opacity-90' : 'opacity-100'}`}>
                {loading ? (
                    Array(7).fill(0).map((_, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-4 xl:p-6 animate-pulse">
                            <div className="h-2 w-16 bg-white/10 rounded mb-3"></div>
                            <div className="h-6 w-20 bg-white/10 rounded"></div>
                        </div>
                    ))
                ) : (
                    <>
                        <StatItem
                            label="Global Queries"
                            value={formatNumber(stats.totalQueries)}
                            color="text-[#38BDF8]"
                        />
                        <StatItem
                            label="UDP Answers"
                            value={formatNumber(stats.udpAnswers)}
                            color="text-[#F472B6]"
                        />
                        <StatItem
                            label="TCP Answers"
                            value={formatNumber(stats.tcpAnswers)}
                            color="text-[#FB923C]"
                        />
                        <StatItem
                            label="Active Zones"
                            value={formatNumber(stats.totalZones)}
                            color="text-[#FFD23F]"
                        />
                        <StatItem
                            label="Total Records"
                            value={formatNumber(stats.totalRecords)}
                            color="text-[#C084FC]"
                        />
                        <StatItem
                            label="Avg Latency"
                            value={formatLatency(stats.avgLatency)}
                            color="text-[#10B981]"
                        />
                        <StatItem
                            label="Uptime"
                            value={formatUptime(stats.uptime)}
                            color="text-[#A78BFA]"
                        />

                        {stats.updatedAt && (
                            <div className="col-span-full flex flex-col items-center justify-center p-4 border-t border-white/10 opacity-60 hover:opacity-100 transition-opacity">
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#D4D4D4] font-bold mb-1.5 text-center">Last Updated</p>
                                <p className="text-xs font-mono text-white text-center">
                                    {new Date(stats.updatedAt).toLocaleTimeString()}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Rate Limit Warning - Near Stats */}
            {rateLimited && (
                <div className="mt-3 flex justify-center">
                    <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-2 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        Rate limit reached. Data may be slightly stale.
                    </div>
                </div>
            )}

            {/* Custom Simple Toast */}
            {showToast && (
                <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-red-500 text-black font-bold py-3 px-6 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-center gap-3 border-2 border-red-400">
                        <div className="w-2 h-2 rounded-full bg-black animate-ping"></div>
                        Too many requests! Please wait a moment.
                    </div>
                </div>
            )}
        </div>
    );
};

const StatItem = ({ label, value, color }) => (
    <div className="flex flex-col items-center justify-center p-4 xl:p-6 hover:bg-white/10 transition-all duration-300 group">
        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#D4D4D4] font-bold mb-1.5 group-hover:text-white transition-colors text-center">{label}</p>
        <p className={`text-lg sm:text-xl md:text-2xl font-bold font-mono tracking-tight ${color} drop-shadow-[0_0_15px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform`}>
            {value}
        </p>
    </div>
);

export default StatsDisplay;
