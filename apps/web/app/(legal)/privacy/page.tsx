import {
  BarChart3,
  Cookie,
  Database,
  ExternalLink,
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
  { id: "third-party", title: "Third-Party Services", icon: Globe },
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
            <li>
              <strong className="text-foreground">Chat Messages</strong> —
              Messages sent within a poker room. These are transmitted in
              real-time via broadcast channels and are{" "}
              <strong className="text-foreground">
                not permanently stored
              </strong>{" "}
              in our database.
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
            The information we collect is used solely for the following
            purposes:
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
            We use a minimal set of cookies and local storage for essential
            functionality:
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
                    cookie-consent
                  </td>
                  <td className="py-2 pr-4">Local Storage</td>
                  <td className="py-2 pr-4">
                    Stores your cookie consent preference
                  </td>
                  <td className="py-2 pr-3">Persistent</td>
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
            Our analytics provider (Plausible) does not use cookies. You can
            manage your storage preferences at any time through the consent
            banner.
          </p>
        </LegalSectionCard>

        <LegalSectionCard id="analytics" icon={BarChart3} title="Analytics">
          <p>
            We use{" "}
            <strong className="text-foreground">Plausible Analytics</strong> for
            website analytics, which is a{" "}
            <strong className="text-foreground">
              privacy-focused, cookie-free
            </strong>{" "}
            analytics tool. Plausible does not use cookies, does not collect
            personal data, and is fully compliant with GDPR, CCPA, and PECR
            without requiring cookie consent.
          </p>
          <p>Plausible collects only aggregate, anonymized data including:</p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>Page views and referral sources</li>
            <li>
              Country-level location (derived from IP, which is never stored)
            </li>
            <li>Browser and operating system type</li>
            <li>Device type (desktop, mobile, tablet)</li>
          </ul>
          <p>
            <strong className="text-foreground">
              No personal data is collected.
            </strong>{" "}
            Plausible does not track individual users across sessions, does not
            create user profiles, and does not use fingerprinting. All data is
            aggregated and cannot be used to identify individual visitors.
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
              <strong className="text-foreground">Chat messages</strong> are
              transmitted via real-time broadcast channels and are never stored
              in our database.
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
          id="third-party"
          icon={Globe}
          title="Third-Party Services"
        >
          <p>
            We rely on the following third-party services to operate our
            platform:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              <strong className="text-foreground">Supabase</strong> — Provides
              our database, anonymous authentication, and real-time
              communication infrastructure. Supabase processes session data on
              our behalf.{" "}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Supabase Privacy Policy (opens in new tab)"
                className="inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Supabase Privacy Policy
                <ExternalLink aria-hidden="true" className="size-3 shrink-0" />
              </a>
            </li>
            <li>
              <strong className="text-foreground">Plausible Analytics</strong> —
              Provides privacy-focused, cookie-free website analytics. No
              personal data is collected or shared.{" "}
              <a
                href="https://plausible.io/privacy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Plausible Analytics Privacy Policy (opens in new tab)"
                className="inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Plausible Privacy Policy
                <ExternalLink aria-hidden="true" className="size-3 shrink-0" />
              </a>
            </li>
          </ul>
          <p>
            We do not sell or share your data with any third parties for
            advertising or marketing purposes.
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
          </ul>
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
