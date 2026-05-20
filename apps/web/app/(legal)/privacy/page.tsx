import {
  BarChart3,
  Cookie,
  Database,
  Eye,
  FileText,
  Globe,
  Info,
  Lock,
  Shield,
  Trash2,
  UserX,
} from "@repo/ui";
import type { Metadata } from "next";
import {
  LegalCallout,
  LegalContactFooter,
  LegalNav,
  LegalPageHeader,
  LegalSectionCard,
  LegalTableOfContents,
} from "@/components/legal";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy Policy - Scrum Poker Game",
  description:
    "Learn how Scrum Poker Game collects, uses, and protects your information. We prioritize minimal data collection and privacy by design.",
  alternates: {
    canonical: "/privacy",
  },
};

const tocItems = [
  { id: "introduction", title: "Introduction", icon: Info },
  {
    id: "information-collected",
    title: "Information We Collect",
    icon: Database,
  },
  { id: "how-we-use", title: "How We Use Your Information", icon: Eye },
  { id: "cookies", title: "Cookies & Local Storage", icon: Cookie },
  { id: "analytics", title: "Analytics", icon: BarChart3 },
  { id: "data-retention", title: "Data Retention", icon: Trash2 },
  { id: "infrastructure", title: "Infrastructure & Hosting", icon: Globe },
  { id: "your-rights", title: "Your Rights", icon: Shield },
  { id: "security", title: "Security", icon: Lock },
  { id: "children", title: "Children's Privacy", icon: UserX },
  { id: "changes", title: "Changes to This Policy", icon: FileText },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <LegalPageHeader
        icon={Shield}
        title="Privacy Policy"
        description="How we collect, use, and protect your information."
        documentType="Privacy Policy"
        effectiveDate="February 16, 2026"
        version="1.0"
        readingTimeMinutes={5}
      />

      <LegalNav currentPath="/privacy" />

      <LegalTableOfContents items={tocItems} />

      <div className="space-y-8">
        <LegalSectionCard id="introduction" icon={Info} title="Introduction">
          <p>
            Welcome to{" "}
            <strong className="text-foreground">Scrum Poker Game</strong>{" "}
            (&ldquo;scrumpokergame.com&rdquo;, &ldquo;we&rdquo;,
            &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We are committed to
            protecting your privacy and being transparent about how we handle
            information when you use our real-time planning poker service.
          </p>
          <p>
            Our service is designed with{" "}
            <strong className="text-foreground">privacy by default</strong>. We
            do not require account creation, email addresses, or any personal
            identifying information to use our platform. This policy explains
            what minimal data we do collect and why.
          </p>
          <p>
            Our service runs on{" "}
            <strong className="text-foreground">
              infrastructure we operate directly
            </strong>
            , including self-hosted database, authentication, and analytics
            software. Your data is not transferred to any third-party cloud
            provider or commercial SaaS vendor.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="information-collected"
          icon={Database}
          title="Information We Collect"
        >
          <p>
            We collect the{" "}
            <strong className="text-foreground">
              minimum amount of information
            </strong>{" "}
            necessary to provide our planning poker service:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              <strong className="text-foreground">Anonymous Session ID</strong>{" "}
              — A randomly generated UUID assigned automatically when you visit
              the site. This is not linked to any personal identity.
            </li>
            <li>
              <strong className="text-foreground">Display Name</strong> — The
              name you choose when creating or joining a poker room. This can be
              any name and does not need to be your real name.
            </li>
            <li>
              <strong className="text-foreground">Room Name</strong> — The title
              you give to a poker room when creating one.
            </li>
            <li>
              <strong className="text-foreground">Votes</strong> — Story point
              estimates you submit during planning poker sessions.
            </li>
          </ul>
          <LegalCallout variant="success" title="We do NOT collect:">
            email addresses, phone numbers, passwords, real names, physical
            addresses, payment information, or any other personally identifiable
            information.
          </LegalCallout>
        </LegalSectionCard>

        <LegalSectionCard
          id="how-we-use"
          icon={Eye}
          title="How We Use Your Information"
        >
          <p>
            We process the information described above based on our{" "}
            <strong className="text-foreground">legitimate interest</strong>{" "}
            (GDPR Art. 6(1)(f)) in operating and securing the service, and on
            the necessity of performing the service you request when you join a
            room (Art. 6(1)(b)). The information is used solely for the
            following purposes:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              <strong className="text-foreground">Providing the Service</strong>{" "}
              — Enabling real-time planning poker sessions, vote
              synchronization, and team collaboration.
            </li>
            <li>
              <strong className="text-foreground">Session Management</strong> —
              Maintaining your active session within a poker room using
              anonymous authentication.
            </li>
            <li>
              <strong className="text-foreground">
                Security & Rate Limiting
              </strong>{" "}
              — Protecting the service from abuse by enforcing rate limits and
              anti-bot measures. IP addresses are used transiently for rate
              limiting and are not stored permanently.
            </li>
            <li>
              <strong className="text-foreground">Service Improvement</strong> —
              Aggregated, anonymized analytics data (via Plausible) helps us
              understand how the service is used and where to improve. No opt-in
              is required as Plausible does not collect personal data.
            </li>
          </ul>
          <p>
            We do not sell, rent, or share your information with third parties
            for marketing purposes.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="cookies"
          icon={Cookie}
          title="Cookies & Local Storage"
        >
          <p>
            We use a minimal set of strictly-necessary cookies and local storage
            entries for essential functionality. No tracking or advertising
            cookies are used.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border/50 bg-muted/20">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Cookies and local storage used by the service
              </caption>
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th
                    scope="col"
                    className="py-2 pr-4 pl-3 text-left font-medium text-foreground"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="py-2 pr-4 text-left font-medium text-foreground"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="py-2 pr-4 text-left font-medium text-foreground"
                  >
                    Purpose
                  </th>
                  <th
                    scope="col"
                    className="py-2 pr-3 text-left font-medium text-foreground"
                  >
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr>
                  <td className="py-2 pr-4 pl-3 font-mono text-xs">
                    sb-*-auth-token
                  </td>
                  <td className="py-2 pr-4">Cookie (Necessary)</td>
                  <td className="py-2 pr-4">
                    Anonymous session authentication
                  </td>
                  <td className="py-2 pr-3">1 hour</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 pl-3 font-mono text-xs">
                    scrumpoker-theme
                  </td>
                  <td className="py-2 pr-4">Local Storage</td>
                  <td className="py-2 pr-4">
                    Stores your light/dark theme preference
                  </td>
                  <td className="py-2 pr-3">Persistent</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Our self-hosted Plausible analytics installation does not use
            cookies or persistent client-side identifiers. You can clear local
            storage at any time through your browser settings.
          </p>
        </LegalSectionCard>

        <LegalSectionCard id="analytics" icon={BarChart3} title="Analytics">
          <p>
            We run a{" "}
            <strong className="text-foreground">self-hosted instance</strong> of
            the open-source{" "}
            <strong className="text-foreground">Plausible Analytics</strong>{" "}
            software on our own infrastructure. Analytics data is{" "}
            <strong className="text-foreground">
              not shared with Plausible Insights OÜ
            </strong>{" "}
            or any other third party.
          </p>
          <p>
            Our analytics installation collects only an aggregate visitor count
            and is configured to be{" "}
            <strong className="text-foreground">cookie-free</strong>. It does
            not create user profiles, does not track individuals across
            sessions, and does not use device fingerprinting. IP addresses are
            processed transiently to derive the visitor count and are not
            written to persistent storage.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="data-retention"
          icon={Trash2}
          title="Data Retention"
        >
          <p>
            Our service is designed to be{" "}
            <strong className="text-foreground">ephemeral by nature</strong>:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              <strong className="text-foreground">Poker rooms</strong> expire
              automatically{" "}
              <strong className="text-foreground">24 hours</strong> after
              creation.
            </li>
            <li>
              <strong className="text-foreground">Player data</strong> (display
              names, votes) is cascade-deleted when the room expires.
            </li>
            <li>
              <strong className="text-foreground">IP addresses</strong> used for
              rate limiting are held in-memory only and are never written to
              persistent storage.
            </li>
          </ul>
          <p>
            We do not maintain long-term user profiles, browsing histories, or
            activity logs.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="infrastructure"
          icon={Globe}
          title="Infrastructure & Hosting"
        >
          <p>
            We operate our own infrastructure rather than relying on commercial
            cloud or SaaS providers. The platform is powered by the following
            open-source software, all of which we{" "}
            <strong className="text-foreground">host ourselves</strong>:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              <strong className="text-foreground">Supabase</strong>{" "}
              (self-hosted) — Open-source software used for our database,
              anonymous authentication, and real-time communication. The
              Supabase company has no access to our data.
            </li>
            <li>
              <strong className="text-foreground">Plausible Analytics</strong>{" "}
              (self-hosted) — Open-source software used to produce an aggregate
              visitor count. Plausible Insights OÜ has no access to our data.
            </li>
          </ul>
          <p>
            Your data is processed entirely on infrastructure under our direct
            control and is{" "}
            <strong className="text-foreground">
              not transferred to third parties
            </strong>{" "}
            for any purpose. We do not sell, rent, or share your data.
          </p>
        </LegalSectionCard>

        <LegalSectionCard id="your-rights" icon={Shield} title="Your Rights">
          <p>
            Depending on your jurisdiction, you may have the following rights
            regarding your data:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              <strong className="text-foreground">Right to Access</strong> —
              Request information about what data we hold about you.
            </li>
            <li>
              <strong className="text-foreground">Right to Deletion</strong> —
              Request deletion of your data. Note that all room and player data
              is automatically deleted within 24 hours.
            </li>
            <li>
              <strong className="text-foreground">Right to Opt Out</strong> —
              Our analytics provider (Plausible) does not use cookies and does
              not track individual users. You can block the analytics script
              using any ad blocker or browser privacy extension.
            </li>
            <li>
              <strong className="text-foreground">Right to Portability</strong>{" "}
              — Request a copy of your data in a portable format.
            </li>
            <li>
              <strong className="text-foreground">
                Right to Lodge a Complaint
              </strong>{" "}
              — If you are in the EU, UK, or EEA, you have the right to lodge a
              complaint with your local data protection supervisory authority if
              you believe your rights have been infringed.
            </li>
            <li>
              <strong className="text-foreground">
                Right to Withdraw Consent / Object
              </strong>{" "}
              — Where processing is based on consent or legitimate interest, you
              may withdraw consent or object to processing at any time.
            </li>
          </ul>
          <p>
            We do not engage in automated decision-making or profiling within
            the meaning of GDPR Art. 22.
          </p>
          <p>
            Because we collect minimal, anonymous data that auto-deletes within
            24 hours, most data subject requests are satisfied automatically by
            the design of our service. For any specific requests, please contact
            us using the information below.
          </p>
        </LegalSectionCard>

        <LegalSectionCard id="security" icon={Lock} title="Security">
          <p>
            We implement multiple layers of security to protect the service and
            your data:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              <strong className="text-foreground">
                Row-Level Security (RLS)
              </strong>{" "}
              — Database policies ensure users can only access and modify their
              own data.
            </li>
            <li>
              <strong className="text-foreground">Rate Limiting</strong> —
              API-level (5 requests per minute per IP) and database-level (10
              rooms per hour per user) limits prevent abuse.
            </li>
            <li>
              <strong className="text-foreground">Anti-Bot Protection</strong> —
              Honeypot fields and form timing validation prevent automated
              abuse.
            </li>
            <li>
              <strong className="text-foreground">Vote Masking</strong> — During
              voting rounds, other participants&apos; votes are hidden until the
              facilitator reveals them.
            </li>
            <li>
              <strong className="text-foreground">Encrypted Connections</strong>{" "}
              — All data is transmitted over HTTPS/WSS encrypted connections.
            </li>
          </ul>
        </LegalSectionCard>

        <LegalSectionCard id="children" icon={UserX} title="Children's Privacy">
          <p>
            Our service is not directed at children under the age of 13. We do
            not knowingly collect personal information from children. Because
            our service requires no personal identifying information to use, the
            risk of inadvertent collection of children&apos;s data is minimal.
          </p>
          <p>
            If we become aware that data associated with a child under 13 has
            been collected, it will be automatically deleted within the standard
            24-hour data retention window.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="changes"
          icon={FileText}
          title="Changes to This Policy"
        >
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or for legal, operational, or regulatory
            reasons. Any changes will be reflected by an updated
            &ldquo;Effective&rdquo; date at the top of this page.
          </p>
          <p>
            Your continued use of the service after changes are posted
            constitutes your acceptance of the updated policy.
          </p>
        </LegalSectionCard>
      </div>

      <LegalContactFooter subject="privacy inquiries" />
    </>
  );
}
