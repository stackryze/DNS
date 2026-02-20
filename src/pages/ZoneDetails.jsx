import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getZoneDetails, getZoneRecords, addRecord, deleteRecord, deleteZone, verifyZone, exportZone } from '../services/api';
import { ArrowLeft, Plus, Trash2, Globe, AlertCircle, Loader2, Copy, ShieldCheck, AlertTriangle, MoreHorizontal, Check, X, RotateCw, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash.debounce';
import { useToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

// Helper to remove trailing dot from FQDN for display
const stripTrailingDot = (str) => {
    if (!str) return str;
    return str.endsWith('.') ? str.slice(0, -1) : str;
};

const RecordBadge = ({ type }) => {
    const colors = {
        A: 'bg-[#003666] text-[#6FB2E8] border-[#004B8D]',
        AAAA: 'bg-[#2A0F45] text-[#C485FB] border-[#441970]',
        CNAME: 'bg-[#0F2D1F] text-[#4CC495] border-[#16432E]',
        TXT: 'bg-[#2B2B2B] text-[#A6A6A6] border-[#404040]',
        MX: 'bg-[#451E11] text-[#F99B7D] border-[#662C19]',
        NS: 'bg-[#2B2B2B] text-[#E0E0E0] border-[#404040]',
        SOA: 'bg-[#1A1A1A] text-[#808080] border-[#333]'
    };
    return (
        <span className={`w-14 text-center inline-block py-0.5 rounded text-[10px] font-mono font-bold border ${colors[type] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
            {type}
        </span>
    );
};

const ZoneDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [zone, setZone] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Confirmation Dialog State
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    // Records State
    const [records, setRecords] = useState([]);
    const [loadingRecords, setLoadingRecords] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Verification State
    const [verifying, setVerifying] = useState(false);
    const [verificationError, setVerificationError] = useState(null);
    const [verificationDetails, setVerificationDetails] = useState(null);

    // New Record State
    const [recordType, setRecordType] = useState('A');
    const [recordName, setRecordName] = useState('@');
    const [recordContent, setRecordContent] = useState('');
    const [recordTTL, setRecordTTL] = useState(3600); // Default: 1 hour (minimum allowed)
    const [adding, setAdding] = useState(false);
    const [deleting, setDeleting] = useState(null); // ID or name of record being deleted
    const [deletingZone, setDeletingZone] = useState(false);

    // UI State
    const [isAddMode, setIsAddMode] = useState(false);

    useEffect(() => {
        fetchZoneMetadata();
        fetchRecords(''); // Initial load
    }, [id]);

    // Debounced search
    const debouncedSearch = useCallback(
        debounce((query) => {
            fetchRecords(query);
        }, 500),
        [id]
    );

    useEffect(() => {
        debouncedSearch(searchQuery);
        return () => debouncedSearch.cancel();
    }, [searchQuery, debouncedSearch]);

    const fetchZoneMetadata = async () => {
        try {
            // Fetch zone metadata WITHOUT records (rrsets=false)
            // This ensures instant loading for the page header/status
            const data = await getZoneDetails(id, false);
            setZone(data);
        } catch (err) {
            setError('Failed to fetch zone details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecords = async (query = searchQuery) => {
        setLoadingRecords(true); 
        try {
            const data = await getZoneRecords(id, query);
            setRecords(data);
        } catch (err) {
            console.error("Failed to fetch records:", err);
            // Don't block UI mostly, just show empty
        } finally {
            setLoadingRecords(false);
        }
    };

    const handleVerifyZone = async () => {
        setVerifying(true);
        setVerificationError(null);
        setVerificationDetails(null);
        try {
            await verifyZone(id);
            toast.success('Zone verified successfully!');
            fetchZoneMetadata();
        } catch (err) {
            const msg = err.response?.data?.error || err.message;
            setVerificationError(msg);
            if (err.response?.data?.current) {
                setVerificationDetails(err.response.data);
            }
        } finally {
            setVerifying(false);
        }
    };

    const handleExportZone = async () => {
        try {
            await exportZone(id, zone.name);
            toast.success(`Zone ${zone.name} exported successfully!`);
        } catch (err) {
            toast.error('Failed to export zone: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleAddRecord = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!recordName || !recordContent) {
            toast.error('Name and content are required');
            return;
        }

        // Wildcard check
        if (recordName.includes('*')) {
            toast.warning('Wildcard records are not allowed');
            return;
        }

        // TTL validation (minimum 1 hour)
        if (parseInt(recordTTL) < 3600) {
            toast.error('TTL must be at least 1 hour (3600 seconds)');
            return;
        }

        // Type-specific validation
        if (recordType === 'A') {
            const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            if (!ipv4Regex.test(recordContent.trim())) {
                toast.error('Invalid IPv4 address format');
                return;
            }
        } else if (recordType === 'AAAA') {
            // Basic IPv6 validation
            if (!recordContent.includes(':')) {
                toast.error('Invalid IPv6 address format');
                return;
            }
        } else if (recordType === 'MX') {
            const mxParts = recordContent.trim().split(/\s+/);
            if (mxParts.length !== 2) {
                toast.error('MX record must be in format: priority hostname (e.g., "10 mail.example.com")');
                return;
            }
            const priority = parseInt(mxParts[0]);
            if (isNaN(priority) || priority < 0 || priority > 65535) {
                toast.error('MX priority must be a number between 0 and 65535');
                return;
            }
        }

        setAdding(true);
        try {
            await addRecord(id, {
                type: recordType,
                name: recordName,
                content: recordContent,
                ttl: recordTTL
            });
            // Reset form
            setRecordName('@');
            setRecordContent('');
            setIsAddMode(false);

            toast.success(`${recordType} record added successfully`);
            // Refresh records AND update count in metadata (if needed)
            fetchRecords(searchQuery);
            // Optional: fetchZoneMetadata() to update record count if backend updates it
        } catch (err) {
            toast.error('Failed to add record: ' + (err.response?.data?.error || err.message));
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteRecord = async (rName, rType) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Record',
            message: `Are you sure you want to delete this ${rType} record?`,
            onConfirm: async () => {
                setDeleting(`${rName}-${rType}`);
                try {
                    await deleteRecord(id, rName, rType);
                    toast.success(`${rType} record deleted successfully`);
                    fetchRecords(searchQuery);
                } catch (err) {
                    toast.error('Failed to delete record: ' + (err.response?.data?.error || err.message));
                } finally {
                    setDeleting(null);
                }
            }
        });
    };

    const handleDeleteZone = async () => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Zone',
            message: `Are you absolutely sure you want to delete "${zone.name}"? This action cannot be undone and will permanently delete all DNS records.`,
            confirmText: 'Delete Zone',
            onConfirm: async () => {
                setDeletingZone(true);
                try {
                    await deleteZone(id);
                    toast.success('Zone deleted successfully');
                    navigate('/dashboard');
                } catch (err) {
                    toast.error('Failed to delete zone: ' + (err.response?.data?.error || err.message));
                    setDeletingZone(false);
                }
            }
        });
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="w-10 h-10 text-[#F48120] animate-spin" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-white">Unable to load zone</h2>
            <p className="text-gray-400 mt-2">{error}</p>
            <Link to="/dashboard" className="mt-6 text-[#F48120] hover:underline font-medium">Return to Dashboard</Link>
        </div>
    );

    if (!zone) return <div className="text-white text-center mt-20">Zone not found</div>;

    const isPending = zone.status === 'pending_verification' || zone.status === 'pending';

    return (
        <>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                confirmText={confirmDialog.confirmText}
            />
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-white/5 pb-4 md:pb-6">
                <div className="flex items-center gap-3 md:gap-4">
                    <Link to="/dashboard" className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2 md:gap-3">
                            <span className="truncate">{zone.name}</span>
                            <span className={`text-[9px] md:text-[11px] px-2 md:px-2.5 py-0.5 md:py-1 rounded-md uppercase tracking-wider font-bold shadow-sm whitespace-nowrap ${zone.status === 'active'
                                ? 'bg-[#10B981] text-black'
                                : 'bg-[#F48120] text-black'
                                }`}>
                                {zone.status === 'pending_verification' ? 'Pending' : zone.status}
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={handleDeleteZone}
                        disabled={deletingZone}
                        className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 border border-red-500/50"
                    >
                        {deletingZone ? <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                        <span className="hidden sm:inline">{deletingZone ? 'Deleting...' : 'Delete Zone'}</span>
                        <span className="sm:hidden">Delete</span>
                    </button>
                    <button 
                        onClick={handleExportZone}
                        className="flex-1 md:flex-none bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all shadow-lg shadow-[#38BDF8]/20 flex items-center justify-center gap-2"
                    >
                        <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Export Zone</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                </div>
            </div>

            {/* Verification Banner */}
            <AnimatePresence>
                {isPending && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-black/60 backdrop-blur-xl border border-white/10 border-l-4 border-l-[#F48120] p-6 rounded-r-lg shadow-2xl relative z-10 mt-6 backdrop-brightness-75"
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="space-y-4 w-full">
                                <div>
                                    <h3 className="text-[#F48120] font-bold text-base flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        Complete your setup
                                    </h3>
                                    <p className="text-gray-300 text-sm max-w-2xl leading-relaxed">
                                        <span className="font-semibold text-white">{zone.name}</span> is not yet active.
                                        Replace your current nameservers with Stackryze nameservers.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Required NS */}
                                    <div>
                                        <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">Required Nameservers</h4>
                                        <div className="flex flex-col gap-2">
                                            {['ns1.stackryze.com', 'ns2.stackryze.com'].map(ns => (
                                                <div key={ns} className="flex items-center justify-between bg-[#10B981]/10 px-3 py-2 rounded text-sm font-mono text-[#10B981] border border-[#10B981]/20 group cursor-pointer hover:bg-[#10B981]/20 transition-colors" onClick={() => navigator.clipboard.writeText(ns)}>
                                                    {ns}
                                                    <Copy className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Current NS (if failed) */}
                                    {verificationDetails?.current && (
                                        <div>
                                            <h4 className="text-[10px] uppercase font-bold text-red-400 mb-2 tracking-wider">Current Nameservers</h4>
                                            <div className="flex flex-col gap-2">
                                                {verificationDetails.current.length > 0 ? (
                                                    verificationDetails.current.map(ns => (
                                                        <div key={ns} className="flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded text-sm font-mono text-red-300 border border-red-500/20">
                                                            <X className="w-3.5 h-3.5" />
                                                            {ns}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-gray-500 text-sm italic py-2">No nameservers found</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleVerifyZone}
                                disabled={verifying}
                                className="bg-[#F48120] hover:bg-[#F48120]/90 text-black px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap shadow-lg shadow-orange-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-2"
                            >
                                {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check Nameservers'}
                            </button>
                        </div>
                        {verificationError && !verificationDetails && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {verificationError}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DNS Records Section */}
            <div className={`space-y-4 ${isPending ? 'opacity-70 pointer-events-none grayscale-[0.5]' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 pt-4">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            <Globe className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                            DNS Records
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            {zone.records_count || 0}/{zone.recordLimit || 200} records
                            {zone.records_count >= (zone.recordLimit || 200) && (
                                <span className="text-orange-400 ml-2">• Limit reached - Contact support to increase</span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            onClick={() => fetchRecords(searchQuery)}
                            disabled={loadingRecords}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            title="Refresh Records"
                        >
                            <RotateCw className={`w-4 h-4 ${loadingRecords ? 'animate-spin' : ''}`} />
                        </button>
                        <div className="relative group flex-1 md:flex-none">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search records..."
                                className="bg-[#0A0A0A] border border-white/10 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm text-white w-full md:w-64 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all placeholder-gray-600 shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-[#171717] border border-white/5 rounded-lg overflow-hidden">
                    {/* Add Record Bar */}
                    <div className="p-3 md:p-4 border-b border-white/5 bg-[#1F1F1F]">
                        {/* Quick Add Record Row */}
                        <div className="p-3 md:p-4 bg-[#1F1F1F]/50 border-b border-white/5">
                            <form onSubmit={handleAddRecord} className="flex flex-col gap-3 md:gap-4">
                                {/* Preview Full Domain Name */}
                                {recordName && recordName !== '@' && (
                                    <div className="px-3 py-2 bg-[#0A0A0A] border border-[#38BDF8]/30 rounded-lg">
                                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Full Record Name</span>
                                        <div className="text-sm font-mono text-[#38BDF8] mt-1">{recordName}.{stripTrailingDot(zone.name)}</div>
                                    </div>
                                )}
                                
                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                    {/* Type */}
                                    <div className="w-full sm:w-28 md:w-32">
                                        <select
                                            value={recordType}
                                            onChange={(e) => setRecordType(e.target.value)}
                                            className="w-full bg-[#171717] border border-white/10 rounded-lg px-3 py-2 text-xs md:text-sm text-white font-bold focus:border-[#38BDF8] focus:outline-none transition-colors cursor-pointer"
                                        >
                                            {['A', 'AAAA', 'CNAME', 'TXT', 'MX'].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>

                                    {/* Name */}
                                    <div className="flex-1 sm:flex-none sm:w-40 md:w-48 relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-xs">@</span>
                                        <input
                                            type="text"
                                            value={recordName === '@' ? '' : recordName}
                                            onChange={(e) => setRecordName(e.target.value || '@')}
                                            placeholder="name"
                                            className="w-full bg-[#171717] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs md:text-sm text-white focus:border-[#38BDF8] focus:outline-none font-mono transition-colors"
                                        />
                                    </div>

                                    {/* TTL - Moved to same row on mobile */}
                                    <div className="w-full sm:w-24 md:w-32">
                                        <select
                                            value={recordTTL}
                                            onChange={(e) => setRecordTTL(e.target.value)}
                                            className="w-full bg-[#171717] border border-white/10 rounded-lg px-3 py-2 text-xs md:text-sm text-white focus:border-[#38BDF8] focus:outline-none transition-colors cursor-pointer"
                                            title="Minimum TTL: 1 hour"
                                        >
                                            <option value="3600">1 hr</option>
                                            <option value="7200">2 hrs</option>
                                            <option value="21600">6 hrs</option>
                                            <option value="43200">12 hrs</option>
                                            <option value="86400">1 day</option>
                                            <option value="604800">1 week</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Content - Full width row */}
                                <div className="flex gap-3 md:gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={recordContent}
                                            onChange={(e) => setRecordContent(e.target.value)}
                                            placeholder={
                                                recordType === 'A' ? '192.0.2.1' :
                                                recordType === 'AAAA' ? '2001:db8::1' :
                                                recordType === 'CNAME' ? 'example.com' :
                                                recordType === 'MX' ? '10 mail.example.com' :
                                                recordType === 'TXT' ? 'v=spf1 include:_spf.example.com ~all' :
                                                'content'
                                            }
                                            className="w-full bg-[#171717] border border-white/10 rounded-lg px-3 py-2 text-xs md:text-sm text-white focus:border-[#38BDF8] focus:outline-none font-mono transition-colors"
                                        />
                                    </div>

                                    {/* Add Button */}
                                    <button
                                        type="submit"
                                        disabled={adding || !recordContent}
                                        className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#38BDF8]/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    >
                                        {adding ? <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Records Table */}
                    <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                        <thead>
                            <tr className="bg-[#1F1F1F] border-b border-white/5 text-[10px] md:text-xs text-gray-500 uppercase">
                                <th className="px-3 md:px-6 py-2 md:py-3 font-semibold w-20 md:w-24">Type</th>
                                <th className="px-3 md:px-6 py-2 md:py-3 font-semibold w-32 md:w-48">Name</th>
                                <th className="px-3 md:px-6 py-2 md:py-3 font-semibold">Content</th>
                                <th className="px-3 md:px-6 py-2 md:py-3 font-semibold w-20 md:w-32">TTL</th>
                                <th className="px-3 md:px-6 py-2 md:py-3 font-semibold w-16 md:w-24 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(!records || records.length === 0) ? (
                                <tr>
                                    <td colSpan="5" className="px-3 md:px-6 py-8 md:py-12 text-center text-gray-500 text-xs md:text-sm">
                                        {loadingRecords ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Loading records...
                                            </div>
                                        ) : (
                                            searchQuery ? 'No matching records found via Search API.' : 'No DNS records found.'
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                records.map((rrset) => (
                                    <React.Fragment key={`${rrset.name}-${rrset.type}`}>
                                        {rrset.records.map((record, rIndex) => (
                                            <tr key={`${rrset.name}-${rrset.type}-${rIndex}`} className="hover:bg-[#1F1F1F] transition-colors group">
                                                <td className="px-3 md:px-6 py-2 md:py-3 align-top">
                                                    <RecordBadge type={rrset.type} />
                                                </td>
                                                <td className="px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm text-gray-300 font-mono align-top break-all" title={stripTrailingDot(rrset.name)}>
                                                    {stripTrailingDot(rrset.name)}
                                                </td>
                                                <td className="px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm text-gray-300 font-mono align-top break-all">
                                                    {stripTrailingDot(record.content)}
                                                </td>
                                                <td className="px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm text-gray-400 align-top">
                                                    {rrset.ttl}s
                                                </td>
                                                <td className="px-3 md:px-6 py-2 md:py-3 text-right align-top">
                                                    {rrset.type !== 'SOA' && rrset.type !== 'NS' && (
                                                        <button
                                                            onClick={() => handleDeleteRecord(rrset.name, rrset.type)}
                                                            disabled={deleting === `${rrset.name}-${rrset.type}`}
                                                            className="text-red-400 hover:text-red-500 p-2 hover:bg-red-500/10 rounded transition-all disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            {deleting === `${rrset.name}-${rrset.type}` ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))
                            )}  
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default ZoneDetails;
