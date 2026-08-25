import { Link } from 'react-router-dom';
import LegalLayout, { Section } from '../../components/LegalLayout';

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="February 19, 2026">
      <p className="text-muted-foreground leading-relaxed">
        These Terms of Service (the &ldquo;Terms&rdquo;) govern your access to and use of Stackryze
        DNS (the &ldquo;Service&rdquo;), a free, non-profit, open-source managed authoritative DNS
        platform. By using the Service you agree to these Terms. If you do not agree, do not use the
        Service.
      </p>

      <Section title="1. Acceptance of Terms">
        <p>
          By accessing, browsing, or using Stackryze DNS, you acknowledge that you have read,
          understood, and agree to be bound by these Terms and by our{' '}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link to="/aup" className="text-primary hover:underline">
            Acceptable Use Policy
          </Link>
          . These documents together form a binding agreement between you and Stackryze DNS.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <p>
          You must be at least 18 years of age, or the age of legal majority in your jurisdiction, to
          create an account or use the Service. By using Stackryze DNS you represent and warrant that
          you meet this requirement and that any information you provide is accurate and complete.
        </p>
      </Section>

      <Section title="3. Description of Service">
        <p>
          Stackryze DNS provides managed authoritative DNS hosting, allowing you to create and manage
          DNS zones and records for domains you own or control. The Service is provided free of
          charge as a community and non-profit initiative.
        </p>
        <p>
          We operate a globally distributed network and target a best-effort availability of 99.9%
          uptime. This target is a goal, not a contractual guarantee, and does not constitute a
          service level agreement.
        </p>
      </Section>

      <Section title="4. Account & Security">
        <p>
          Access to the Service requires an account authenticated through our single sign-on provider
          at{' '}
          <a
            href="https://auth.stackryze.com"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            auth.stackryze.com
          </a>
          . You are responsible for maintaining the confidentiality of your credentials and for all
          activity that occurs under your account.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Keep your authentication factors secure and do not share them.</li>
          <li>Notify us promptly of any unauthorized access or suspected compromise.</li>
          <li>You are responsible for the accuracy of the DNS records you publish.</li>
        </ul>
      </Section>

      <Section title="5. Acceptable Use">
        <p>
          Your use of the Service must comply with our{' '}
          <Link to="/aup" className="text-primary hover:underline">
            Acceptable Use Policy
          </Link>
          . Prohibited activity includes, without limitation, hosting DNS for malware, phishing,
          botnet command-and-control, illegal content, or any use that abuses shared infrastructure.
          We may suspend or terminate accounts that violate the AUP.
        </p>
      </Section>

      <Section title="6. Service Availability & No Warranty">
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without
          warranties of any kind, whether express or implied, including but not limited to
          warranties of merchantability, fitness for a particular purpose, and non-infringement. We
          do not warrant that the Service will be uninterrupted, error-free, or secure.
        </p>
      </Section>

      <Section title="7. Limitation of Liability">
        <p>
          To the maximum extent permitted by applicable law, Stackryze DNS and its contributors,
          maintainers, and operators shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or any loss of data, revenue, or goodwill, arising out
          of or related to your use of, or inability to use, the Service. Because the Service is
          provided free of charge, our aggregate liability shall not exceed zero.
        </p>
      </Section>

      <Section title="8. Termination">
        <p>
          You may stop using the Service at any time and delete your zones and account. We may
          suspend or terminate your access, with or without notice, if you violate these Terms or the
          AUP, if required by law, or if we discontinue the Service. Upon termination, your right to
          use the Service ceases immediately and associated DNS records may be removed.
        </p>
      </Section>

      <Section title="9. Changes to These Terms">
        <p>
          We may update these Terms from time to time. When we make material changes we will update
          the &ldquo;Last updated&rdquo; date above and, where appropriate, provide additional
          notice. Your continued use of the Service after changes take effect constitutes acceptance
          of the revised Terms.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about these Terms can be sent to{' '}
          <a href="mailto:legal@stackryze.com" className="text-primary hover:underline">
            legal@stackryze.com
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  );
}
