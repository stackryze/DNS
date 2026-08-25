import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Loader2, ExternalLink } from 'lucide-react';
import { getMe } from '../services/api';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then(setUser).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Account settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile and security preferences.</p>
      </div>

      <section className="panel rounded-xl p-6 md:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground"><User className="h-5 w-5 text-primary" /> Profile</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field icon={User} label="Full name" value={user?.name} loading={loading} />
          <Field icon={Mail} label="Email address" value={user?.email} loading={loading} />
        </div>
      </section>

      <section className="panel rounded-xl p-6 md:p-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground"><Shield className="h-5 w-5 text-primary" /> Security &amp; passwords</h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Credentials, passkeys, and multi-factor authentication are managed centrally through <span className="font-medium text-foreground">Stackryze SSO</span>.
        </p>
        <Button asChild variant="outline" className="mt-5">
          <a href="https://auth.stackryze.com" target="_blank" rel="noreferrer">Manage security <ExternalLink className="h-4 w-4" /></a>
        </Button>
      </section>
    </div>
  );
}

function Field({ icon: Icon, label, value, loading }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-3 text-foreground">
        <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
        {loading ? <Skeleton className="h-4 w-40" /> : <span className="truncate">{value || '—'}</span>}
      </div>
    </div>
  );
}
