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

                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#38BDF8]" /> Centralized Security & Passwords
                </h2>

                <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                    Authentication credentials, Passkeys, Multi-Factor Authentication (2FA), and password management are centralized through <strong>Stackryze SSO</strong> at <a href="https://auth.stackryze.com" target="_blank" rel="noreferrer" className="text-[#38BDF8] underline font-medium hover:text-sky-300">auth.stackryze.com</a>.
                </p>
            </div>
        </div>
    );
};

export default Settings;