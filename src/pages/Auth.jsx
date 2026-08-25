import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { getMe } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);
  const isCallback = location.pathname === '/auth/callback';

  useEffect(() => {
    if (isCallback) {
      const params = new URLSearchParams(location.search);
      if (params.get('error')) { navigate('/login', { replace: true }); return; }
      localStorage.setItem('sr_auth', '1');
      navigate('/dashboard', { replace: true });
    } else {
      getMe()
        .then((u) => {
          if (u && (u._id || u.id || u.email)) {
            localStorage.setItem('sr_auth', '1');
            navigate('/dashboard', { replace: true });
          }
        })
        .catch(() => {});
    }
  }, [isCallback, location.search, navigate]);

  const signIn = () => {
    setSigningIn(true);
    window.location.href = `${API_URL}/auth/zitadel`;
  };

  if (isCallback) {
    return (
      <div className="flex min-h-screen items-center justify-center text-foreground">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" /> Signing you in…
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade opacity-40" />
      <div className="panel hairline-top glow-ring w-full max-w-md rounded-2xl p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-secondary">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Stackryze <span className="text-primary">DNS</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in with your Stackryze account to continue.</p>
        </div>

        <button
          onClick={signIn}
          disabled={signingIn}
          className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(180deg,var(--primary-bright),var(--primary))] px-4 py-3 font-medium text-primary-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/25%)] transition-all hover:brightness-[1.08] active:translate-y-px disabled:opacity-70"
        >
          {signingIn ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Redirecting…</>
          ) : (
            <><ShieldCheck className="h-5 w-5" /> Continue with Stackryze <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
          )}
        </button>

        <p className="mt-6 text-center text-xs text-muted-foreground/70">You'll be redirected to sign in securely.</p>
      </div>
    </div>
  );
}
