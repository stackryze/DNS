import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ChevronLeft } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
            <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-[#10B981]" />
                        <span className="font-bold tracking-tight">Stackryze <span className="text-[#38BDF8]">DNS</span></span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                <div className="space-y-2 mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
                    <p className="text-gray-400">Last Updated: February 20, 2026</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-12 text-gray-300 font-sans">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Introduction</h2>
                        <p className="leading-relaxed">
                            At Stackryze DNS ("we", "us", or "our"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our DNS hosting service. Please read this policy carefully. If you do not agree with the terms of this policy, please do not use the Service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Data Controller</h2>
                        <p className="leading-relaxed">
                            Stackryze is the data controller responsible for your personal data. For questions about this policy or our data practices, contact us at <span className="text-[#38BDF8]">privacy@stackryze.com</span>.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Information We Collect</h2>
                        <p className="leading-relaxed">We collect information in the following categories:</p>
                        
                        <div className="space-y-4 mt-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Account Information</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Email address (required for account creation and authentication)</li>
                                    <li>Username or display name</li>
                                    <li>Password (stored in hashed format)</li>
                                    <li>Account creation date and last login timestamp</li>
                                    <li>Authentication tokens and session data</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">DNS Configuration Data</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Domain names and DNS zones you create</li>
                                    <li>DNS records (A, AAAA, CNAME, MX, TXT, etc.) and their values</li>
                                    <li>Zone metadata, including creation and modification timestamps</li>
                                    <li>Nameserver configurations</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Usage and Technical Data</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>IP addresses (for authentication, rate limiting, and security purposes)</li>
                                    <li>Browser type, version, and user agent strings</li>
                                    <li>Access times and dates</li>
                                    <li>API request logs and endpoint usage</li>
                                    <li>Error logs and diagnostic information</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">DNS Query Metadata (Limited)</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Aggregated query statistics (counts, record types queried)</li>
                                    <li>Geographic distribution of queries (country-level only)</li>
                                    <li>Query response times and performance metrics</li>
                                    <li>We do NOT log individual DNS queries from end users, ensuring privacy of DNS lookups</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Communications</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Emails or support tickets you send to us</li>
                                    <li>Your communication preferences</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">How We Use Your Data</h2>
                        <p className="leading-relaxed">We use your personal data for the following purposes:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Service Provision</strong>: To create and manage your account, provide DNS hosting and resolution services, and maintain zone configurations.</li>
                            <li><strong>Security and Fraud Prevention</strong>: To detect, prevent, and respond to security incidents, abuse, fraud, and illegal activities.</li>
                            <li><strong>Rate Limiting</strong>: To prevent service abuse and ensure fair usage through IP-based rate limiting.</li>
                            <li><strong>Communication</strong>: To send transactional emails (account verification, password resets, service notifications) and important service updates.</li>
                            <li><strong>Improvement</strong>: To analyze usage patterns, troubleshoot technical issues, and improve service performance and features.</li>
                            <li><strong>Legal Compliance</strong>: To comply with legal obligations, respond to lawful requests, and enforce our Terms of Service and Acceptable Use Policy.</li>
                        </ul>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Legal Basis for Processing (GDPR)</h2>
                        <p className="leading-relaxed">For users in the European Economic Area (EEA), UK, or Switzerland, we process your data based on:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Contract Performance</strong>: Processing is necessary to provide the Service you've requested.</li>
                            <li><strong>Legitimate Interests</strong>: We have legitimate interests in securing our platform, preventing fraud, and improving our services.</li>
                            <li><strong>Legal Obligations</strong>: We must process data to comply with legal requirements.</li>
                            <li><strong>Consent</strong>: Where required, we obtain your explicit consent for specific processing activities.</li>
                        </ul>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 font-sans">Data Sharing and Disclosure</h2>
                        <p className="leading-relaxed font-sans">We do not sell, rent, or trade your personal data. We may share your data only in the following circumstances:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Service Providers</strong>: We use third-party services to operate our platform, including:
                                <ul className="list-circle pl-6 mt-2 space-y-1">
                                    <li>Cloud hosting providers (servers, storage, databases)</li>
                                    <li>Email delivery services (AWS SES) for transactional emails</li>
                                    <li>Monitoring and analytics tools for performance and error tracking</li>
                                    <li>These providers are contractually obligated to protect your data and use it only for specified purposes.</li>
                                </ul>
                            </li>
                            <li><strong>Legal Requirements</strong>: We may disclose data when required by law, court order, subpoena, or to respond to lawful requests from public authorities.</li>
                            <li><strong>Protection of Rights</strong>: We may disclose data to protect our rights, property, or safety, or that of our users or the public.</li>
                            <li><strong>Business Transfers</strong>: If we undergo a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity.</li>
                            <li><strong>With Your Consent</strong>: We may share data with third parties when you've given explicit consent.</li>
                        </ul>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Data Retention</h2>
                        <p className="leading-relaxed">
                            We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Active Accounts</strong>: Data is retained while your account is active.</li>
                            <li><strong>Deleted Accounts</strong>: Account data is deleted within 30 days of account deletion, except where we must retain data for legal, security, or fraud prevention purposes.</li>
                            <li><strong>Logs</strong>: Access logs and IP addresses are retained for 90 days for security purposes.</li>
                            <li><strong>Backups</strong>: Data may persist in backups for up to 90 days after deletion.</li>
                        </ul>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 font-sans">Data Security</h2>
                        <p className="leading-relaxed font-sans">
                            We implement industry-standard security measures to protect your data:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Encryption in transit using TLS/SSL (HTTPS)</li>
                            <li>Encryption at rest for database storage</li>
                            <li>Password hashing using strong, modern algorithms (bcrypt)</li>
                            <li>Regular security audits and vulnerability assessments</li>
                            <li>Access controls and authentication mechanisms</li>
                            <li>Rate limiting and DDoS protection</li>
                        </ul>
                        <p className="leading-relaxed mt-4">
                            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">International Data Transfers</h2>
                        <p className="leading-relaxed">
                            Your data may be transferred to and processed in countries other than your country of residence. Our servers are located in India and other regions. We ensure that such transfers comply with applicable data protection laws and that appropriate safeguards are in place to protect your data.
                        </p>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Your Rights</h2>
                        <p className="leading-relaxed">
                            Depending on your location, you may have the following rights regarding your personal data:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Access</strong>: Request a copy of the personal data we hold about you.</li>
                            <li><strong>Correction</strong>: Request correction of inaccurate or incomplete data.</li>
                            <li><strong>Deletion</strong>: Request deletion of your personal data ("right to be forgotten").</li>
                            <li><strong>Portability</strong>: Request a copy of your data in a structured, machine-readable format.</li>
                            <li><strong>Objection</strong>: Object to processing of your data based on legitimate interests.</li>
                            <li><strong>Restriction</strong>: Request restriction of processing under certain circumstances.</li>
                            <li><strong>Withdrawal of Consent</strong>: Withdraw consent for processing where consent was the legal basis.</li>
                        </ul>
                        <p className="leading-relaxed mt-4">
                            To exercise these rights, contact us at <span className="text-[#38BDF8]">privacy@stackryze.com</span>. We will respond to your request within 30 days. You also have the right to lodge a complaint with your local data protection authority.
                        </p>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Cookies and Tracking Technologies</h2>
                        <p className="leading-relaxed">
                            We use essential cookies and similar technologies to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Maintain your authenticated session</li>
                            <li>Remember your preferences and settings</li>
                            <li>Ensure security and prevent fraud</li>
                        </ul>
                        <p className="leading-relaxed mt-4">
                            We do not use advertising or third-party tracking cookies. You can control cookies through your browser settings, but disabling essential cookies may affect functionality.
                        </p>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Children's Privacy</h2>
                        <p className="leading-relaxed">
                            Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a child, please contact us immediately, and we will delete it.
                        </p>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Changes to This Policy</h2>
                        <p className="leading-relaxed">
                            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes by posting the updated policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically. Continued use of the Service after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section className="space-y-4 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Contact Us</h2>
                        <p className="leading-relaxed">
                            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-6 mt-4">
                            <p className="font-semibold text-white mb-2">Privacy Team</p>
                            <p className="text-gray-300">Email: <span className="text-[#38BDF8]">privacy@stackryze.com</span></p>
                            <p className="text-gray-300 mt-1">Data Protection: <span className="text-[#38BDF8]">dpo@stackryze.com</span></p>
                            <p className="text-gray-300 mt-1">General Inquiries: <span className="text-[#38BDF8]">support@stackryze.com</span></p>
                        </div>
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

export default Privacy;
