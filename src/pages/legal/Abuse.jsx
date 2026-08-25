import { ShieldAlert, Mail } from 'lucide-react';
import LegalLayout, { Section } from '../../components/LegalLayout';

export default function Abuse() {
  return (
    <LegalLayout title="Report Abuse" updated="February 19, 2026">
      <p className="text-muted-foreground leading-relaxed">
        Stackryze DNS takes abuse seriously. If you believe a zone or account hosted on our service
        is being used for malicious or illegal activity, please let us know. Every report is reviewed
        by our team.
      </p>

      <div className="panel rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <ShieldAlert className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">Report abuse</h2>
            <p className="text-sm text-muted-foreground">
              Send full details to our abuse team and we will investigate promptly.
            </p>
            <a
              href="mailto:abuse@stackryze.com"
              className="mt-1 inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              abuse@stackryze.com
            </a>
          </div>
        </div>
      </div>

      <Section title="How to Report">
        <p>
          Email{' '}
          <a href="mailto:abuse@stackryze.com" className="text-primary hover:underline">
            abuse@stackryze.com
          </a>{' '}
          with as much detail as possible so we can act quickly. A strong report includes:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>The affected domain or zone name.</li>
          <li>Evidence of the abuse (URLs, screenshots, message headers, or log excerpts).</li>
          <li>Timestamps, including the time zone, of when the activity was observed.</li>
          <li>A brief description of the harm and any relevant context.</li>
        </ul>
      </Section>

      <Section title="What We Action">
        <p>We investigate and take action on reports involving, among other things:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Malware distribution and botnet command-and-control.</li>
          <li>Phishing and credential harvesting.</li>
          <li>Illegal content prohibited under applicable law.</li>
          <li>Network attacks and abuse of shared infrastructure.</li>
        </ul>
      </Section>

      <Section title="Response Process & Timelines">
        <p>
          We acknowledge reports as soon as practicable, typically within one to two business days.
          High-severity issues, such as active malware or phishing campaigns, are prioritized and may
          be actioned within hours. We assess each report against our{' '}
          <a href="/aup" className="text-primary hover:underline">
            Acceptable Use Policy
          </a>{' '}
          and applicable law before taking action.
        </p>
      </Section>

      <Section title="What Happens to the Zone">
        <p>
          When a violation is confirmed, we may disable individual records, suspend the affected
          zone, or suspend the responsible account. In severe cases we may terminate the account and
          preserve relevant information for law enforcement. We aim to act proportionately based on
          the severity and nature of the abuse.
        </p>
      </Section>
    </LegalLayout>
  );
}
