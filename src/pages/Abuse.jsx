import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ChevronLeft, Mail, AlertCircle } from 'lucide-react';

const Abuse = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
            <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <span className="font-bold tracking-tight font-sans">Stackryze <span className="text-[#38BDF8]">DNS</span></span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Report Abuse</h1>
                        <p className="text-gray-400">Help us keep the internet safe.</p>
                    </div>
                </div>

                <div className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12 mb-12">
                    <h2 className="text-2xl font-bold mb-6">How to report?</h2>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                        If you have identified a domain using Stackryze DNS for malicious purposes (Malware, Phishing, Spam, or DDoS C2), please send a detailed report to our abuse team.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="mailto:abuse@stackryze.com" className="flex items-center justify-center gap-3 bg-[#38BDF8] hover:bg-[#0EA5E9] text-black font-bold py-4 px-8 rounded-2xl transition-all font-sans">
                            <Mail className="w-5 h-5" />
                            Email abuse@stackryze.com
                        </a>
                        <a href="mailto:reportabuse@stackryze.com" className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-8 rounded-2xl border border-white/10 transition-all font-sans">
                            Alternative: reportabuse@stackryze.com
                        </a>
                    </div>
                </div>

                <div className="prose prose-invert max-w-none text-gray-400 space-y-6 text-sm font-sans">
                    <p className="font-sans">Please include the following in your report:</p>
                    <ul className="list-disc pl-6 space-y-2 font-sans">
                        <li>The infringing domain name.</li>
                        <li>Evidence of the malicious activity (logs, screenshots, links).</li>
                        <li>Your contact information (if you wish to receive updates).</li>
                    </ul>
                    <p className="pt-4 border-t border-white/5 font-sans">
                        We take abuse reports seriously and aim to review all submissions within 24-48 hours.
                    </p>
                </div>
            </main>

            <footer className="border-t border-white/5 py-12 bg-black/30">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-500">
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/aup" className="hover:text-white transition-colors">Acceptable Use</Link>
                        <Link to="/abuse" className="hover:text-white transition-colors">Report Abuse</Link>
                    </div>
                    <div className="text-center text-gray-600 text-xs">
                        <p>&copy; 2026 Stackryze DNS. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Abuse;
