import { Link } from 'react-router-dom';
import LegalLayout, { Section } from '../../components/LegalLayout';

export default function AUP() {
  return (
    <LegalLayout title="Acceptable Use Policy" updated="February 19, 2026">
      <p className="text-muted-foreground leading-relaxed">
        This Acceptable Use Policy (the &ldquo;AUP&rdquo;) describes conduct that is prohibited when
        using Stackryze DNS. It exists to protect our users, our shared infrastructure, and the
        broader internet. This AUP is incorporated into and forms part of our{' '}
        <Link to="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>
        .
      </p>

      <Section title="Overview">
        <p>
          Stackryze DNS is a free, non-profit, open-source managed DNS service operated on shared
          infrastructure. By using the Service you agree not to engage in, facilitate, or encourage
          any of the activities described below. We interpret this policy broadly and reserve the
          right to determine what constitutes a violation.
        </p>
      </Section>

      <Section title="Prohibited Uses">
        <p>You must not use Stackryze DNS to host, distribute, facilitate, or point to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Malware, ransomware, spyware, exploit kits, or botnet command-and-control (C2)
            infrastructure.
          </li>
          <li>
            Phishing, credential harvesting, spoofing, or any deceptive practice intended to defraud
            or mislead users.
          </li>
          <li>
            Content that is illegal under applicable law, including child sexual abuse material,
            content that incites violence, or unlawful sale of regulated goods.
          </li>
          <li>Spam, unsolicited bulk messaging, or infrastructure that supports such activity.</li>
          <li>
            Abuse of open or public resolvers, including DNS amplification, reflection, or
            tunneling designed to exfiltrate data or evade controls.
          </li>
          <li>
            Content or services that infringe intellectual property, copyright, trademark, or other
            proprietary rights.
          </li>
          <li>
            Network attacks of any kind, including denial-of-service (DoS/DDoS), port scanning,
            intrusion attempts, or vulnerability exploitation.
          </li>
        </ul>
      </Section>

      <Section title="DNS-Specific Rules">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            You may only create and manage zones for domains you own or are authorized to control.
          </li>
          <li>
            Do not use zones or records to facilitate abuse, obfuscate malicious infrastructure, or
            circumvent takedowns.
          </li>
          <li>
            Fast-flux DNS, rapid record cycling to evade blocklists, and similar evasion techniques
            are strictly prohibited.
          </li>
          <li>
            Do not configure records that overload, disrupt, or degrade the Service or third-party
            systems.
          </li>
        </ul>
      </Section>

      <Section title="Enforcement & Suspension">
        <p>
          We may investigate suspected violations and take any action we deem appropriate, including
          removing or disabling records, suspending or terminating accounts, and cooperating with law
          enforcement. Depending on severity, action may be taken with or without prior notice.
          Serious or repeated violations will result in permanent termination.
        </p>
      </Section>

      <Section title="Reporting Abuse">
        <p>
          If you believe a zone or account hosted on Stackryze DNS violates this policy, please
          report it. Visit our{' '}
          <Link to="/abuse" className="text-primary hover:underline">
            Report Abuse
          </Link>{' '}
          page or email{' '}
          <a href="mailto:abuse@stackryze.com" className="text-primary hover:underline">
            abuse@stackryze.com
          </a>{' '}
          with the affected domain, supporting evidence, and timestamps.
        </p>
      </Section>
    </LegalLayout>
  );
}
