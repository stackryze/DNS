import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw, Globe, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DNSChecker = () => {
    const [domain, setDomain] = useState('');
    const [recordType, setRecordType] = useState('NS');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'SRV', 'CAA', 'PTR', 'NAPTR'];

    const checkDNS = async () => {
        if (!domain) return;

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/dns-checker/check/${domain}/${recordType}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to check DNS');
            }

            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkPropagation = async () => {
        if (!domain) return;

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/dns-checker/propagation/${domain}`);
            const data = await response.json();

            console.log('[DNS-Checker] Raw API response:', data);
            console.log('[DNS-Checker] Details object:', data.details);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to check propagation');
            }

            // Transform propagation data to match results format
            const transformedResults = Object.entries(data.details || {}).reduce((acc, [key, value]) => {
                console.log(`[DNS-Checker] Processing ${key}:`, value);
                acc[key] = {
                    provider: value.provider,
                    success: value.hasStackryzeNS,
                    records: value.currentNS || [],
                    error: value.error || null
                };
                console.log(`[DNS-Checker] Transformed ${key}:`, acc[key]);
                return acc;
            }, {});

            console.log('[DNS-Checker] Final transformed results:', transformedResults);

            setResults({
                domain: data.domain,
                recordType: 'NS',
                propagation: data,
                results: transformedResults
            });
        } catch (err) {
            console.error('[DNS-Checker] Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (success) => {
        return success ? 'text-green-400' : 'text-red-400';
    };

    const getStatusIcon = (success) => {
        return success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />;
    };

    return (
        <div className="h-full flex flex-col gap-4 md:gap-8 pb-2">
            {/* Header */}
            <div className="shrink-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-8 h-8 text-[#38BDF8]" />
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">DNS Checker</h1>
                        </div>
                        <p className="text-gray-200 text-base font-medium">Check DNS records across multiple public resolvers</p>
                    </div>
                </div>

                {/* Input Section */}
                <div className="bg-[#1A1A1A] rounded-xl p-4 md:p-6 border border-white/10 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Domain Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Globe className={`h-4 w-4 transition-colors ${isInputFocused ? 'text-[#38BDF8]' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    type="text"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                    placeholder="example.com"
                                    className="w-full bg-transparent border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 focus:outline-none transition-all placeholder:text-gray-500 font-medium"
                                    onKeyPress={(e) => e.key === 'Enter' && checkDNS()}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Record Type</label>
                            <select
                                value={recordType}
                                onChange={(e) => setRecordType(e.target.value)}
                                className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 focus:outline-none transition-all cursor-pointer font-medium"
                            >
                                {recordTypes.map(type => (
                                    <option key={type} value={type} className="bg-[#1A1A1A]">{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <button
                            onClick={checkDNS}
                            disabled={loading || !domain}
                            className="flex-1 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#38BDF8]/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            Check DNS Records
                        </button>
                        <button
                            onClick={checkPropagation}
                            disabled={loading || !domain}
                            className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#10B981]/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                            Check NS Propagation
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 shadow-lg"
                        >
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <span className="text-red-400 font-medium">{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Section */}
                <AnimatePresence>
                    {results && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="space-y-3"
                        >
                            {/* Propagation Summary (if available) */}
                            {results.propagation && (
                                <div className="bg-[#1A1A1A] rounded-lg p-3 border border-white/10">
                                    <h3 className="text-sm font-bold mb-3 text-white uppercase tracking-wider">Propagation Status</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-[#0A0A0A] rounded-lg p-2.5 border border-white/5">
                                            <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Propagation</div>
                                            <div className="text-xl font-extrabold text-[#38BDF8]">
                                                {results.propagation.propagationPercentage}%
                                            </div>
                                        </div>
                                        <div className="bg-[#0A0A0A] rounded-lg p-2.5 border border-white/5">
                                            <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Valid Resolvers</div>
                                            <div className="text-xl font-extrabold text-green-400">
                                                {results.propagation.summary.valid}/{results.propagation.summary.total}
                                            </div>
                                        </div>
                                        <div className="bg-[#0A0A0A] rounded-lg p-2.5 border border-white/5">
                                            <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Status</div>
                                            <div className={`text-base font-bold ${results.propagation.propagated ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {results.propagation.propagated ? 'Fully Propagated' : 'Propagating...'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Resolver Results */}
                            <div className="bg-[#1A1A1A] rounded-lg p-3 border border-white/10">
                                <h3 className="text-sm font-bold mb-3 text-white uppercase tracking-wider">
                                    Results for <span className="text-[#38BDF8]">{results.domain}</span> ({results.recordType})
                                </h3>
                                <div className="space-y-2">
                                    {Object.entries(results.results).map(([key, result]) => (
                                        <motion.div
                                            key={key}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: Object.keys(results.results).indexOf(key) * 0.05 }}
                                            className={`bg-[#0A0A0A] rounded-lg p-3 border transition-all duration-300 ${
                                                result.error 
                                                    ? 'border-red-500/20 hover:border-red-500/40' 
                                                    : results.propagation && result.success
                                                    ? 'border-green-500/20 hover:border-green-500/40'
                                                    : 'border-[#38BDF8]/20 hover:border-[#38BDF8]/40'
                                            }`}
                                        >
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1.5 rounded-md ${
                                                        result.error 
                                                            ? 'bg-red-500/10' 
                                                            : results.propagation && result.success
                                                            ? 'bg-green-500/10'
                                                            : 'bg-[#38BDF8]/10'
                                                    }`}>
                                                        <div className={result.error ? 'text-red-400' : results.propagation && result.success ? 'text-green-400' : 'text-[#38BDF8]'}>
                                                            {result.error ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{result.provider}</div>
                                                        {result.servers && (
                                                            <div className="text-[10px] text-gray-500 font-mono">
                                                                {result.servers.join(' • ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Only show badge for propagation checks (not regular DNS queries) */}
                                                {results.propagation && result.success && (
                                                    <div className="bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                                        ✓ Stackryze
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Content */}
                                            {result.error ? (
                                                <div className="bg-red-500/5 rounded p-2 border border-red-500/20">
                                                    <div className="flex items-start gap-1.5">
                                                        <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <div className="text-red-400 text-xs font-medium mb-0.5">Query Failed</div>
                                                            <div className="text-red-300/80 text-[10px] font-mono">
                                                                {result.error}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : result.records && Array.isArray(result.records) && result.records.length > 0 ? (
                                                <div className={`rounded p-2 ${
                                                    results.propagation && result.success
                                                        ? 'bg-green-500/5 border border-green-500/20' 
                                                        : 'bg-[#38BDF8]/5 border border-[#38BDF8]/20'
                                                }`}>
                                                    <div className="space-y-1">
                                                        {result.records.map((record, idx) => (
                                                            <div 
                                                                key={idx} 
                                                                className={`flex items-center gap-1.5 ${
                                                                    results.propagation && result.success ? 'text-green-400' : 'text-[#38BDF8]'
                                                                }`}
                                                            >
                                                                <div className="w-1 h-1 rounded-full bg-current flex-shrink-0"></div>
                                                                <div className="font-mono text-xs font-medium">
                                                                    {typeof record === 'object' 
                                                                        ? JSON.stringify(record) 
                                                                        : record
                                                                    }
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : result.records && typeof result.records === 'object' ? (
                                                <div className={`rounded p-2 ${
                                                    results.propagation && result.success
                                                        ? 'bg-green-500/5 border border-green-500/20' 
                                                        : 'bg-[#38BDF8]/5 border border-[#38BDF8]/20'
                                                }`}>
                                                    <div className={`${results.propagation && result.success ? 'text-green-400' : 'text-[#38BDF8]'} font-mono text-xs`}>
                                                        {JSON.stringify(result.records, null, 2)}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-gray-500/5 rounded p-2 border border-gray-500/20">
                                                    <div className="text-gray-400 text-xs text-center italic">
                                                        No records found
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
        </div>
    );
};

export default DNSChecker;
