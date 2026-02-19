import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronLeft } from 'lucide-react';

const Terms = () => {
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
                        <Shield className="w-5 h-5 text-[#38BDF8]" />
                        <span className="font-bold tracking-tight">Stackryze <span className="text-[#38BDF8]">DNS</span></span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                <div className="space-y-2 mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
                    <p className="text-gray-400">Last Updated: February 19, 2026</p>
                </div>

                <div className="prose prose-invert prose-blue max-w-none space-y-12 text-gray-300">
                    <section className="space-y-4 text-gray-300">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">1. Acceptance of Terms</h2>
                        <p className="leading-relaxed">
                            By accessing or using Stackryze DNS ("the Service", "we", "us", or "our"), you ("User", "you", or "your") agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these terms, you must not access or use the Service. Your continued use of the Service constitutes acceptance of any modifications to these Terms.
                        </p>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">2. Eligibility</h2>
                        <p className="leading-relaxed font-sans">
                            You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms. Organizations using the Service must ensure their authorized representatives have the authority to bind the organization to these Terms.
                        </p>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">3. Description of Service</h2>
                        <p className="leading-relaxed font-sans">
                            Stackryze DNS provides managed DNS hosting and resolution services, including domain name zone management, DNS record configuration, and nameserver infrastructure. We grant you a non-exclusive, non-transferable, revocable license to use the Service in accordance with these Terms. The Service is provided on a best-effort basis with target uptime of 99.9%, though actual availability may vary.
                        </p>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">4. Account Registration and Security</h2>
                        <ul className="list-disc pl-6 space-y-2 font-sans">
                            <li>You must provide accurate, current, and complete information during registration.</li>
                            <li>You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
                            <li>You must immediately notify us of any unauthorized use of your account or any other security breach.</li>
                            <li>We reserve the right to refuse service, terminate accounts, or remove or edit content at our sole discretion.</li>
                            <li>You may not share, transfer, or sell your account to any third party without our prior written consent.</li>
                        </ul>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">5. User Responsibilities and Acceptable Use</h2>
                        <ul className="list-disc pl-6 space-y-2 font-sans">
                            <li>You agree not to use the Service for any illegal, harmful, or unauthorized purposes as outlined in our <Link to="/aup" className="text-[#38BDF8] hover:underline">Acceptable Use Policy</Link>.</li>
                            <li>You are responsible for all DNS zones and records created under your account.</li>
                            <li>You must ensure you have proper authorization to manage any domain names you add to the Service.</li>
                            <li>You agree not to attempt to gain unauthorized access to any part of the Service or any systems or networks connected to the Service.</li>
                            <li>You must comply with all applicable laws and regulations in your use of the Service.</li>
                            <li>You are responsible for backing up your DNS configurations; we are not liable for any data loss.</li>
                        </ul>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">6. Service Modifications and Availability</h2>
                        <p className="leading-relaxed font-sans">
                            We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We may also impose limits on certain features or restrict access to parts or all of the Service without notice or liability. We are not liable to you or any third party for any modification, suspension, or discontinuation of the Service.
                        </p>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">7. Intellectual Property Rights</h2>
                        <p className="leading-relaxed font-sans">
                            The Service and its original content, features, and functionality are owned by Stackryze and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, create derivative works, reverse engineer, or attempt to extract the source code of the Service without our express written permission.
                        </p>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">8. Termination</h2>
                        <p className="leading-relaxed font-sans">
                            We reserve the right to suspend or terminate your access to the Service immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms, violation of our <Link to="/aup" className="text-[#38BDF8] hover:underline">Acceptable Use Policy</Link>, non-payment of fees (if applicable), or conduct that we believe is harmful to other users, us, or third parties. Upon termination, your right to use the Service will cease immediately, and we may delete your account and all associated data. You may also terminate your account at any time by contacting us.
                        </p>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">9. Disclaimer of Warranties</h2>
                        <p className="leading-relaxed font-sans italic opacity-80">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE. STACKRYZE DNS DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED. NO ADVICE OR INFORMATION OBTAINED FROM US OR THROUGH THE SERVICE CREATES ANY WARRANTY NOT EXPRESSLY STATED IN THESE TERMS.
                        </p>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">10. Limitation of Liability</h2>
                        <p className="leading-relaxed font-sans">
                            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL STACKRYZE DNS, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 font-sans">
                            <li>Your access to or use of or inability to access or use the Service;</li>
                            <li>Any conduct or content of any third party on the Service;</li>
                            <li>Any content obtained from the Service;</li>
                            <li>Unauthorized access, use, or alteration of your transmissions or content;</li>
                            <li>DNS resolution failures or propagation delays;</li>
                            <li>Service downtime or interruptions.</li>
                        </ul>
                        <p className="leading-relaxed font-sans mt-4">
                            IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, OR CAUSES OF ACTION EXCEED THE AMOUNT YOU HAVE PAID US IN THE LAST SIX (6) MONTHS, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS LESS.
                        </p>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">11. Indemnification</h2>
                        <p className="leading-relaxed font-sans">
                            You agree to defend, indemnify, and hold harmless Stackryze DNS and its officers, directors, employees, contractors, agents, licensors, and suppliers from and against any claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from your use of the Service, your violation of these Terms, or your violation of any rights of a third party.
                        </p>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">12. Governing Law and Dispute Resolution</h2>
                        <p className="leading-relaxed font-sans">
                            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall first be attempted to be resolved through good faith negotiations. If negotiations fail, disputes shall be resolved through binding arbitration in accordance with the rules of the Indian Arbitration and Conciliation Act, 1996. You agree to waive any right to a jury trial or to participate in a class action.
                        </p>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">13. Changes to Terms</h2>
                        <p className="leading-relaxed font-sans">
                            We reserve the right to modify or replace these Terms at any time at our sole discretion. We will provide notice of any material changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms. It is your responsibility to review these Terms periodically.
                        </p>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">14. Severability</h2>
                        <p className="leading-relaxed font-sans">
                            If any provision of these Terms is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not be affected or impaired in any way.
                        </p>
                    </section>

                    <section className="space-y-4 text-gray-300 font-sans">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">15. Contact Information</h2>
                        <p className="leading-relaxed font-sans">
                            If you have any questions about these Terms, please contact us at: <span className="text-[#38BDF8]">legal@stackryze.com</span>
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

export default Terms;
