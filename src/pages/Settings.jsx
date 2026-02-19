import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Mail, Lock, Shield, Key, Loader2, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Password Change State
    const [passwords, setPasswords] = useState({ old: '', new: '' });
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Input Passwords, 2: Enter OTP
    const [passLoading, setPassLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
        } catch (error) {
            console.error("Failed to fetch user", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!passwords.old || !passwords.new) {
            setMessage({ type: 'error', text: 'Please fill in all fields' });
            return;
        }

        if (passwords.new.length < 8) {
            setMessage({ type: 'error', text: 'New password must be at least 8 characters' });
            return;
        }

        try {
            setPassLoading(true);
            await api.post('/auth/send-password-otp');
            setStep(2);
            setMessage({ type: 'success', text: 'OTP sent to your email' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to send OTP' });
        } finally {
            setPassLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            setPassLoading(true);
            await api.post('/auth/change-password', {
                oldPassword: passwords.old,
                newPassword: passwords.new,
                otp
            });
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setStep(1);
            setPasswords({ old: '', new: '' });
            setOtp('');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update password' });
        } finally {
            setPassLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 text-[#38BDF8] animate-spin" /></div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
                <p className="text-gray-400 text-sm">Manage your profile and security preferences.</p>
            </div>

            {/* Profile Card */}
            <div className="bg-[#262626]/40 backdrop-blur-md border border-white/5 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#38BDF8]" /> Profile Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5 text-gray-300">
                            <User className="w-5 h-5 text-gray-500" />
                            {user?.name}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5 text-gray-300">
                            <Mail className="w-5 h-5 text-gray-500" />
                            {user?.email}
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-[#262626]/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-[#38BDF8]/5 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#38BDF8]" /> Security
                </h2>

                <div className="max-w-md">
                    <h3 className="text-sm font-bold text-gray-300 mb-4">Change Password</h3>

                    {message.text && (
                        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {message.text}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Current Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="password"
                                        value={passwords.old}
                                        onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8] transition-all placeholder-gray-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">New Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8] transition-all placeholder-gray-600"
                                        placeholder="Min 8 characters"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={passLoading}
                                className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)] disabled:opacity-50"
                            >
                                {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Verify & Update
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="p-4 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-xl mb-4">
                                <p className="text-sm text-[#38BDF8]">We sent a verification code to <strong>{user?.email}</strong>. Please enter it below.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Verification Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8] transition-all placeholder-gray-600 text-center text-2xl font-mono tracking-[0.5em]"
                                    placeholder="000000"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={passLoading}
                                    className="flex-1 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)] disabled:opacity-50"
                                >
                                    {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                    Confirm Change
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
