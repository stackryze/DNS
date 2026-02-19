import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronLeft } from 'lucide-react';

const AUP = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
            {/* Header */}
            <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-[#F472B6]" />
                        <span className="font-bold tracking-tight">Stackryze <span className="text-[#38BDF8]">DNS</span></span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                <div className="space-y-2 mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Acceptable Use Policy</h1>
                    <p className="text-gray-400">Protecting our network and users.</p>
                </div>

                <div className="prose prose-invert prose-pink max-w-none space-y-12 text-gray-300 font-sans">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 font-sans">Introduction</h2>
                        <p className="leading-relaxed font-sans">
                            This Acceptable Use Policy ("AUP") defines prohibited uses of Stackryze DNS. Our goal is to ensure a safe, reliable, and high-performance environment for all users while protecting our infrastructure and reputation. This policy applies to all users of Stackryze DNS without exception.
                        </p>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 font-sans">Prohibited Activities</h2>
                        <p className="leading-relaxed font-sans">You may not use Stackryze DNS for, or to facilitate:</p>
                        
                        <div className="space-y-4 mt-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Security Threats & Attacks</h3>
                                <ul className="list-disc pl-6 space-y-2 font-sans">
                                    <li>Distributed Denial of Service (DDoS) attacks or any activity intended to disrupt network services</li>
                                    <li>Port scanning, network vulnerability scanning, or penetration testing without authorization</li>
                                    <li>Brute-force attacks, password cracking, or unauthorized access attempts</li>
                                    <li>DNS amplification attacks or other reflection attacks</li>
                                    <li>DNS tunneling for unauthorized data exfiltration or bypassing security controls</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Malicious Content & Malware</h3>
                                <ul className="list-disc pl-6 space-y-2 font-sans">
                                    <li>Hosting or resolving domains that distribute malware, viruses, trojans, ransomware, or other harmful software</li>
                                    <li>Command and Control (C2) infrastructure for botnets or malware</li>
                                    <li>Cryptojacking scripts or unauthorized cryptocurrency mining</li>
                                    <li>Exploit kits or vulnerability exploitation tools</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Fraud & Deception</h3>
                                <ul className="list-disc pl-6 space-y-2 font-sans">
                                    <li>Phishing campaigns or social engineering attacks</li>
                                    <li>Identity theft or impersonation of individuals, organizations, or brands</li>
                                    <li>Typosquatting or domain squatting to deceive users</li>
                                    <li>Fake websites designed to mislead or defraud users</li>
                                    <li>Pyramid schemes, Ponzi schemes, or other financial fraud</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Illegal Activities</h3>
                                <ul className="list-disc pl-6 space-y-2 font-sans">
                                    <li>Sale or distribution of illegal goods, including drugs, weapons, or stolen items</li>
                                    <li>Child exploitation material or any content involving minors in harmful situations</li>
                                    <li>Copyright infringement, piracy, or unauthorized distribution of protected content</li>
                                    <li>Money laundering, terrorist financing, or other financial crimes</li>
                                    <li>Hacking services, stolen credentials, or compromised systems</li>
                                    <li>Any activity prohibited by applicable local, national, or international law</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Abusive Behavior</h3>
                                <ul className="list-disc pl-6 space-y-2 font-sans">
                                    <li>Spam, unsolicited bulk email (UCE), or mass marketing campaigns</li>
                                    <li>Harassment, stalking, or threats directed at individuals or groups</li>
                                    <li>Hate speech, discrimination, or incitement to violence</li>
                                    <li>Non-consensual sharing of private information (doxxing)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Service Abuse</h3>
                                <ul className="list-disc pl-6 space-y-2 font-sans">
                                    <li>Excessive API usage or automated queries designed to overwhelm the service</li>
                                    <li>Creating multiple accounts to circumvent limitations or bans</li>
                                    <li>Reselling the service without authorization</li>
                                    <li>Reverse engineering, decompiling, or attempting to extract source code</li>
                                    <li>Intentionally introducing bugs, viruses, or malicious code to the service</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 font-sans">Resource Usage Limits</h2>
                        <p className="leading-relaxed font-sans">
                            While we aim to provide generous service limits, you must use resources responsibly:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 font-sans">
                            <li>DNS queries must be legitimate and not designed to overwhelm infrastructure</li>
                            <li>Zone and record creation must be for legitimate use cases</li>
                            <li>We reserve the right to implement rate limiting or usage caps at our discretion</li>
                            <li>Accounts exhibiting abnormal usage patterns may be investigated and restricted</li>
                        </ul>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 font-sans">Monitoring and Investigation</h2>
                        <p className="leading-relaxed font-sans">
                            We reserve the right to monitor usage of the Service for compliance with this AUP and to investigate potential violations. This may include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 font-sans">
                            <li>Analyzing DNS query patterns and zone configurations</li>
                            <li>Reviewing reported abuse complaints from third parties</li>
                            <li>Examining account activity and authentication patterns</li>
                            <li>Cooperating with law enforcement and security researchers</li>
                        </ul>
                        <p className="leading-relaxed font-sans mt-4">
                            We respect user privacy and will only access user data when necessary for security, compliance, or legal reasons as outlined in our <Link to="/privacy" className="text-[#38BDF8] hover:underline">Privacy Policy</Link>.
                        </p>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 font-sans">Enforcement</h2>
                        <p className="leading-relaxed font-sans">
                            Violation of this AUP may result in immediate action, including but not limited to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 font-sans">
                            <li>Warning notices and requests to cease prohibited activities</li>
                            <li>Temporary suspension of specific DNS zones or records</li>
                            <li>Permanent suspension or termination of your account without refund</li>
                            <li>Deletion of DNS zones and associated data</li>
                            <li>Legal action for damages or injunctive relief</li>
                            <li>Reporting to law enforcement, security organizations, or regulatory authorities</li>
                            <li>Sharing information with affected third parties or abuse databases</li>
                        </ul>
                        <p className="leading-relaxed font-sans mt-4">
                            The severity of enforcement action depends on the nature and severity of the violation. We reserve the right to take immediate action without prior notice in cases of severe abuse or legal violations. Repeated violations may result in permanent bans.
                        </p>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 font-sans">Appeals</h2>
                        <p className="leading-relaxed font-sans">
                            If you believe your account was suspended or terminated in error, you may submit an appeal to <span className="text-[#38BDF8]">appeals@stackryze.com</span> within 30 days of the action. Include your account email, a detailed explanation, and any supporting evidence. We will review appeals on a case-by-case basis, but our decisions are final.
                        </p>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 font-sans">Reporting Abuse</h2>
                        <p className="leading-relaxed font-sans">
                            If you become aware of any violations of this policy, please report them immediately to our security team at <span className="text-[#38BDF8]">abuse@stackryze.com</span>. Please include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 font-sans">
                            <li>The domain name or zone in question</li>
                            <li>Specific description of the abusive behavior</li>
                            <li>Any evidence, logs, or screenshots</li>
                            <li>Your contact information for follow-up</li>
                        </ul>
                        <p className="leading-relaxed font-sans mt-4">
                            We take all abuse reports seriously and will investigate promptly. Reports may be anonymous, but providing contact information helps us gather additional details if needed.
                        </p>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 font-sans">Changes to This Policy</h2>
                        <p className="leading-relaxed font-sans">
                            We reserve the right to modify this AUP at any time. Changes will be posted on this page. Continued use of the Service after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>
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

export default AUP;
