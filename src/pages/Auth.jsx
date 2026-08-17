import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isCallback = location.pathname === '/auth/callback';

    // After ZITADEL redirects back, the backend has already set the session cookie.
    useEffect(() => {
        if (isCallback) {
            const params = new URLSearchParams(location.search);
            const error = params.get('error');
            if (error) {
                navigate('/login', { replace: true });
                return;
            }
            localStorage.setItem('sr_auth', '1');
            navigate('/dashboard', { replace: true });
        } else {
            // Auto-check if user is already logged in via ZITADEL session cookie
            api.get('/auth/me')
                .then((res) => {
                    if (res.data && (res.data._id || res.data.id || res.data.email)) {
                        localStorage.setItem('sr_auth', '1');
                        navigate('/dashboard', { replace: true });
                    }
                })
                .catch(() => {
                    // Stay on login page if unauthenticated
                });
        }
    }, [isCallback, location.search, navigate]);

    const signIn = () => {
        window.location.href = `${API_URL}/auth/zitadel`;
    };

    if (isCallback) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
                <div className="flex items-center gap-3 text-gray-300">
                    <Loader2 className="w-5 h-5 animate-spin text-[#38BDF8]" />
                    Signing you in…
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white font-sans px-4 bg-[url('/pixel_art_large.png')] bg-fixed bg-cover">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm -z-10"></div>

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1A1A1A]/70 backdrop-blur-xl p-8 shadow-2xl">
                <div className="flex flex-col items-center text-center">
                    <img src="/stackryze_logo_white.png" alt="Stackryze" className="h-10 w-auto mb-4" />
                    <h1 className="text-2xl font-bold tracking-tight">
                        Stackryze <span className="text-[#38BDF8]">DNS</span>
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign in with your Stackryze account to continue.
                    </p>
                </div>

                <button
                    onClick={signIn}
                    className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#38BDF8] px-4 py-3 font-medium text-black transition-all hover:bg-[#38BDF8]/90 active:scale-[0.98]"
                >
                    <ShieldCheck className="w-5 h-5" />
                    Continue with Stackryze
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                <p className="mt-6 text-center text-xs text-gray-500">
                    You'll be redirected to sign in securely.
                </p>
            </div>
        </div>
    );
};

export default Auth;
