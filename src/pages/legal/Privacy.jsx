import LegalLayout, { Section } from '../../components/LegalLayout';

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="February 19, 2026">
      <p className="text-muted-foreground leading-relaxed">
        This Privacy Policy explains what information Stackryze DNS collects, how we use it, and the
        choices you have. Stackryze DNS is a free, non-profit, open-source managed DNS service, and
        we aim to collect only what we need to operate the Service securely and reliably.
      </p>

      <Section title="Information We Collect">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <span className="text-foreground">Account information</span> — provided through our
            single sign-on identity provider (ZITADEL) at{' '}
            <a
              href="https://auth.stackryze.com"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              auth.stackryze.com
            </a>
            , such as your email address, username, and authentication metadata.
          </li>
          <li>
            <span className="text-foreground">Service data</span> — the DNS zones and records you
            create, edit, and delete, along with related configuration.
          </li>
          <li>
            <span className="text-foreground">Query metadata &amp; logs</span> — operational logs
            and aggregated query metadata used to diagnose issues, protect against abuse, and improve
            reliability.
          </li>
          <li>
            <span className="text-foreground">Minimal analytics</span> — limited, privacy-respecting
            usage statistics that help us understand overall product usage.
          </li>
        </ul>
      </Section>

      <Section title="How We Use It">
        <ul className="list-disc space-y-2 pl-6">
          <li>To provide, maintain, and operate the Service.</li>
          <li>To authenticate you and secure your account.</li>
          <li>To detect, prevent, and respond to abuse, fraud, and security incidents.</li>
          <li>To diagnose technical problems and improve performance and reliability.</li>
        </ul>
      </Section>

      <Section title="Cookies & Session">
        <p>
          We use a strictly necessary session cookie named{' '}
          <span className="font-mono text-foreground">dns.sid</span> to keep you signed in and
          maintain your authenticated session. This cookie is essential to the operation of the
          Service and is not used for advertising or cross-site tracking.
        </p>
      </Section>

      <Section title="Data Sharing">
        <p>
          We do not sell your personal information. We share data only with service providers and
          processors that help us operate the Service (for example, our identity provider and
          infrastructure hosts), and only to the extent necessary. We may disclose information when
          required by law or to protect the safety and integrity of the Service.
        </p>
      </Section>

      <Section title="Security">
        <p>
          We use industry-standard technical and organizational measures to protect your data,
          including encryption in transit, access controls, and least-privilege practices. No system
          is perfectly secure, but we work continuously to safeguard your information.
        </p>
      </Section>

      <Section title="Data Retention">
        <p>
          We retain account and service data for as long as your account is active or as needed to
          provide the Service. Operational logs and query metadata are retained for a limited period
          for security and reliability, after which they are deleted or anonymized. When you delete
          your account, we remove associated zones and personal data, subject to legal obligations.
        </p>
      </Section>

      <Section title="Your Rights">
        <p>
          Depending on your jurisdiction, you may have the right to access, correct, export, or
          delete your personal information, and to object to or restrict certain processing. You can
          exercise many of these rights directly in the dashboard or by contacting us. We will honor
          valid requests as required by applicable law.
        </p>
      </Section>

      <Section title="Legal Compliance">
        <p>
          We process personal information in accordance with applicable data protection laws. Where
          such laws apply, we rely on appropriate legal bases, including performing the Service you
          request, our legitimate interests in operating a secure platform, and compliance with legal
          obligations.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          For privacy questions or to exercise your rights, contact us at{' '}
          <a href="mailto:privacy@stackryze.com" className="text-primary hover:underline">
            privacy@stackryze.com
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  );
}
