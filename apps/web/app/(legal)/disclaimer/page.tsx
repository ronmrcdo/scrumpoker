import {
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Eye,
  Globe,
  Info,
  Scale,
  Shield,
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
  title: "Disclaimer - Scrum Poker Game",
  description:
    "Important disclaimers about the Scrum Poker Game service, including limitation of liability and third-party service information.",
  alternates: {
    canonical: "/disclaimer",
  },
};

const tocItems = [
  { id: "general", title: "General Disclaimer", icon: AlertTriangle },
  { id: "no-advice", title: "No Professional Advice", icon: Info },
  { id: "as-is", title: '"As-Is" Service', icon: Shield },
  { id: "third-party", title: "Third-Party Services", icon: Globe },
  { id: "liability", title: "Limitation of Liability", icon: Scale },
  { id: "links", title: "External Links", icon: ChevronRight },
  { id: "accuracy", title: "Accuracy of Information", icon: Eye },
];

export default function DisclaimerPage() {
  return (
    <>
      <LegalPageHeader
        icon={AlertTriangle}
        title="Disclaimer"
        description="Important information about the use of our planning poker service."
        documentType="Disclaimer"
        effectiveDate="February 16, 2026"
        version="1.0"
        readingTimeMinutes={4}
      />

      <LegalNav currentPath="/disclaimer" />

      <LegalTableOfContents items={tocItems} />

      <div className="space-y-8">
        <LegalSectionCard
          id="general"
          icon={AlertTriangle}
          title="General Disclaimer"
        >
          <p>
            The information provided on{" "}
            <strong className="text-foreground">Scrum Poker Game</strong>{" "}
            (&ldquo;scrumpokergame.com&rdquo;) is for general informational and
            collaborative estimation purposes only. While we strive to keep the
            service functional and reliable, we make no representations or
            warranties of any kind, express or implied, about the completeness,
            accuracy, reliability, suitability, or availability of the service.
          </p>
          <p>
            Any reliance you place on the service and its outputs is strictly at
            your own risk.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="no-advice"
          icon={Info}
          title="No Professional Advice"
        >
          <p>
            Scrum Poker Game is a{" "}
            <strong className="text-foreground">collaboration tool</strong>, not
            a source of professional advice. Specifically:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              The service does not constitute project management advice, agile
              coaching, or methodology certification.
            </li>
            <li>
              Story point estimates produced during sessions are{" "}
              <strong className="text-foreground">
                opinions of participants
              </strong>
              , not binding commitments or guaranteed timelines.
            </li>
            <li>
              Voting analytics (averages, consensus detection, suggested
              estimates) are algorithmic calculations and should not be the sole
              basis for project planning decisions.
            </li>
            <li>
              The service does not replace professional judgment, experience, or
              formal estimation methodologies.
            </li>
          </ul>
        </LegalSectionCard>

        <LegalSectionCard id="as-is" icon={Shield} title={'"As-Is" Service'}>
          <p>
            Scrum Poker Game is provided{" "}
            <strong className="text-foreground">
              without warranty of any kind, express or implied
            </strong>
            . This includes, but is not limited to:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              <strong className="text-foreground">No uptime guarantee</strong> —
              The service may experience downtime for maintenance, updates, or
              unforeseen technical issues.
            </li>
            <li>
              <strong className="text-foreground">
                No data persistence guarantee
              </strong>{" "}
              — All poker rooms and associated data expire automatically after
              24 hours. Chat messages are ephemeral and not stored.
            </li>
            <li>
              <strong className="text-foreground">
                No error-free operation
              </strong>{" "}
              — Real-time features depend on network connectivity and browser
              compatibility, which may vary.
            </li>
            <li>
              <strong className="text-foreground">
                No backward compatibility
              </strong>{" "}
              — The service may be updated or changed at any time without prior
              notice.
            </li>
          </ul>
        </LegalSectionCard>

        <LegalSectionCard
          id="third-party"
          icon={Globe}
          title="Third-Party Services"
        >
          <p>
            Scrum Poker Game relies on third-party infrastructure to operate. We
            are not responsible for the availability, performance, or data
            handling practices of these services beyond our own configuration:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              <strong className="text-foreground">Supabase</strong> — Provides
              database hosting, anonymous authentication, and real-time
              communication. Service availability depends on Supabase&apos;s
              infrastructure.{" "}
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
            Disruptions to these third-party services may affect the
            availability or functionality of Scrum Poker Game. We shall not be
            held liable for any such disruptions.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="liability"
          icon={Scale}
          title="Limitation of Liability"
        >
          <p>
            Under no circumstances shall the operators of Scrum Poker Game be
            liable for any direct, indirect, incidental, special, consequential,
            or punitive damages arising from:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>Use of or inability to use the service</li>
            <li>Loss of session data, votes, or room information</li>
            <li>
              Decisions made based on estimates or analytics produced by the
              service
            </li>
            <li>Unauthorized access to rooms by unintended participants</li>
            <li>Service interruptions, errors, or security breaches</li>
          </ul>
          <LegalCallout variant="info">
            This is a <strong>free service</strong> with no paid tier. All data
            is ephemeral and expires within 24 hours. Users acknowledge these
            limitations when using the service.
          </LegalCallout>
        </LegalSectionCard>

        <LegalSectionCard id="links" icon={ChevronRight} title="External Links">
          <p>
            Our service may contain links to third-party websites or resources,
            such as privacy policies of our service providers. These links are
            provided for your convenience and informational purposes only.
          </p>
          <p>
            We do not endorse and are not responsible for the content, accuracy,
            or practices of any third-party websites. Visiting external links is
            at your own risk, and you should review the terms and privacy
            policies of any third-party sites you visit.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="accuracy"
          icon={Eye}
          title="Accuracy of Information"
        >
          <p>
            The voting analytics provided by Scrum Poker Game — including
            averages, median values, consensus detection, vote distribution, and
            suggested estimates — are{" "}
            <strong className="text-foreground">
              algorithmic approximations
            </strong>{" "}
            based on participant input.
          </p>
          <p>These calculations:</p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              Are provided as decision-support aids, not definitive assessments
            </li>
            <li>
              Depend entirely on the accuracy and honesty of participant votes
            </li>
            <li>
              Should be interpreted in conjunction with team discussion and
              professional judgment
            </li>
            <li>
              May not account for complexity factors, dependencies, or risks not
              captured by simple numeric estimates
            </li>
          </ul>
        </LegalSectionCard>
      </div>

      <LegalContactFooter subject="questions about this disclaimer" />
    </>
  );
}
