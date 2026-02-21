import {
  AlertTriangle,
  Check,
  Clock,
  FileText,
  Info,
  Lock,
  MessageSquare,
  Scale,
  Shield,
  Trash2,
  UserX,
} from "@repo/ui";
import type { Metadata } from "next";
import {
  LegalPageHeader,
  LegalSectionCard,
  LegalTableOfContents,
} from "@/components/legal";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Terms of Service - Scrum Poker Game",
  description:
    "Terms and conditions for using Scrum Poker Game, a free real-time planning poker tool for agile teams.",
};

const tocItems = [
  { id: "acceptance", title: "Acceptance of Terms", icon: FileText },
  { id: "service-description", title: "Description of Service", icon: Info },
  { id: "anonymous-accounts", title: "Anonymous Accounts", icon: UserX },
  { id: "acceptable-use", title: "Acceptable Use", icon: Check },
  { id: "rate-limits", title: "Rate Limits & Fair Use", icon: Clock },
  { id: "intellectual-property", title: "Intellectual Property", icon: Lock },
  { id: "user-content", title: "User-Generated Content", icon: MessageSquare },
  { id: "disclaimers", title: "Disclaimers", icon: AlertTriangle },
  { id: "liability", title: "Limitation of Liability", icon: Shield },
  { id: "termination", title: "Termination", icon: Trash2 },
  { id: "governing-law", title: "Governing Law", icon: Scale },
  { id: "changes", title: "Changes to Terms", icon: FileText },
];

export default function TermsPage() {
  return (
    <>
      <LegalPageHeader
        icon={FileText}
        title="Terms of Service"
        description="Terms and conditions governing your use of our planning poker service."
        documentType="Terms of Service"
        effectiveDate="February 16, 2026"
        version="1.0"
      />

      <LegalTableOfContents items={tocItems} />

      <div className="space-y-6">
        <LegalSectionCard
          id="acceptance"
          icon={FileText}
          title="Acceptance of Terms"
          accentColor="primary"
        >
          <p>
            By accessing or using{" "}
            <strong className="text-foreground">Scrum Poker Game</strong>{" "}
            (&ldquo;scrumpokergame.com&rdquo;, &ldquo;the Service&rdquo;), you
            agree to be bound by these Terms of Service. If you do not agree to
            these terms, please do not use the Service.
          </p>
          <p>
            No account creation or sign-up is required to use the Service. By
            simply accessing and using the platform, you acknowledge that you
            have read, understood, and agree to these terms.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="service-description"
          icon={Info}
          title="Description of Service"
          accentColor="accent"
        >
          <p>
            Scrum Poker Game is a{" "}
            <strong className="text-foreground">
              free, real-time planning poker tool
            </strong>{" "}
            designed for agile teams to collaboratively estimate work effort.
            The Service provides:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              Creation of poker rooms accessible via unique UUID-based URLs
            </li>
            <li>
              Real-time vote submission and synchronization across participants
            </li>
            <li>Vote reveal controlled by a designated facilitator</li>
            <li>
              Voting analytics including averages, consensus detection, and
              distribution
            </li>
            <li>In-room team chat for discussion during estimation sessions</li>
          </ul>
          <p>
            Rooms are{" "}
            <strong className="text-foreground">temporary by design</strong> and
            expire automatically 24 hours after creation, along with all
            associated data.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="anonymous-accounts"
          icon={UserX}
          title="Anonymous Accounts"
          accentColor="warm"
        >
          <p>
            The Service uses{" "}
            <strong className="text-foreground">
              anonymous authentication
            </strong>
            . When you visit the site, a random unique identifier (UUID) is
            automatically generated for your session. This means:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              <strong className="text-foreground">
                No persistent identity
              </strong>{" "}
              — Your session is tied to a random UUID, not to any personal
              account.
            </li>
            <li>
              <strong className="text-foreground">No account recovery</strong> —
              If your session expires or you clear your browser data, there is
              no way to recover your previous session.
            </li>
            <li>
              <strong className="text-foreground">No cross-device sync</strong>{" "}
              — Each device and browser receives its own independent session.
            </li>
          </ul>
          <p>
            You are solely responsible for sharing room URLs with your intended
            team members. Anyone with a room URL can join that room.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="acceptable-use"
          icon={Check}
          title="Acceptable Use"
          accentColor="primary"
        >
          <p>
            You agree to use the Service only for its intended purpose. You must
            not:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              Attempt to circumvent rate limits, security measures, or anti-bot
              protections
            </li>
            <li>
              Use automated scripts, bots, or tools to interact with the Service
              beyond normal usage
            </li>
            <li>
              Submit offensive, abusive, or inappropriate content through room
              names, display names, or chat messages
            </li>
            <li>Impersonate other individuals or team members</li>
            <li>
              Interfere with or disrupt other users&apos; sessions or the
              Service infrastructure
            </li>
            <li>
              Attempt to access rooms, data, or systems you are not authorized
              to access
            </li>
            <li>
              Use the Service for any illegal purpose or in violation of
              applicable laws
            </li>
          </ul>
        </LegalSectionCard>

        <LegalSectionCard
          id="rate-limits"
          icon={Clock}
          title="Rate Limits & Fair Use"
          accentColor="accent"
        >
          <p>
            To ensure fair access for all users, the Service enforces the
            following rate limits:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              <strong className="text-foreground">API Rate Limit</strong> —
              Maximum of 5 room creation requests per minute per IP address.
            </li>
            <li>
              <strong className="text-foreground">User Rate Limit</strong> —
              Maximum of 10 rooms created per hour per user session.
            </li>
          </ul>
          <p>
            Exceeding these limits will result in temporary restriction of room
            creation with an appropriate retry period. Rate limits are enforced
            automatically and exist to protect the quality of service for all
            users.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="intellectual-property"
          icon={Lock}
          title="Intellectual Property"
          accentColor="warm"
        >
          <p>
            The Scrum Poker Game name, logo, visual design, and application
            source code are the proprietary property of the Service operator.
            All rights are reserved unless explicitly stated otherwise.
          </p>
          <p>
            &ldquo;Scrum,&rdquo; &ldquo;Planning Poker,&rdquo; and &ldquo;Story
            Points&rdquo; are industry-standard agile methodology terms and are
            not claimed as trademarks by this Service.
          </p>
          <p>
            You may not copy, modify, distribute, or create derivative works
            based on the Service without prior written consent.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="user-content"
          icon={MessageSquare}
          title="User-Generated Content"
          accentColor="primary"
        >
          <p>
            When using the Service, you may provide content including display
            names, room names, votes, and chat messages. Regarding this content:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              <strong className="text-foreground">Ephemeral nature</strong> —
              All user content is temporary. Room data expires after 24 hours,
              and chat messages are broadcast in real-time without persistent
              storage.
            </li>
            <li>
              <strong className="text-foreground">No ownership claim</strong> —
              We do not claim ownership of any content you submit through the
              Service.
            </li>
            <li>
              <strong className="text-foreground">Your responsibility</strong> —
              You are solely responsible for the content you submit and must
              ensure it complies with the Acceptable Use policy above.
            </li>
          </ul>
        </LegalSectionCard>

        <LegalSectionCard
          id="disclaimers"
          icon={AlertTriangle}
          title="Disclaimers"
          accentColor="accent"
        >
          <p>
            THE SERVICE IS PROVIDED ON AN{" "}
            <strong className="text-foreground">&ldquo;AS IS&rdquo;</strong> AND{" "}
            <strong className="text-foreground">
              &ldquo;AS AVAILABLE&rdquo;
            </strong>{" "}
            BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
            INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>We do not warrant that:</p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>
              The Service will be uninterrupted, timely, secure, or error-free
            </li>
            <li>
              The results obtained from the Service will be accurate or reliable
            </li>
            <li>Any defects in the Service will be corrected</li>
            <li>
              The Service will be available at all times or in all locations
            </li>
          </ul>
        </LegalSectionCard>

        <LegalSectionCard
          id="liability"
          icon={Shield}
          title="Limitation of Liability"
          accentColor="warm"
        >
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SCRUM POKER GAME
            AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT
            LIMITED TO:
          </p>
          <ul className="ml-1 list-inside list-disc space-y-1.5">
            <li>Loss of data, votes, or session information</li>
            <li>Service interruptions or downtime</li>
            <li>Inaccurate vote calculations or analytics</li>
            <li>Unauthorized access to rooms via shared URLs</li>
            <li>
              Any damages arising from the use or inability to use the Service
            </li>
          </ul>
          <p>
            This is a <strong className="text-foreground">free service</strong>{" "}
            with ephemeral data that expires within 24 hours. The total
            aggregate liability of the Service operators shall not exceed zero
            dollars ($0.00 USD).
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="termination"
          icon={Trash2}
          title="Termination"
          accentColor="primary"
        >
          <p>
            We reserve the right to restrict or terminate access to the Service
            for any user who violates these Terms or engages in abusive
            behavior, without prior notice.
          </p>
          <p>
            Rooms expire automatically after 24 hours, effectively terminating
            all associated sessions. Because there are no user accounts, no
            manual account deletion is necessary.
          </p>
          <p>
            We reserve the right to modify, suspend, or discontinue the Service
            (in whole or in part) at any time, with or without notice. We shall
            not be liable to you or any third party for any modification,
            suspension, or discontinuance of the Service.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="governing-law"
          icon={Scale}
          title="Governing Law"
          accentColor="accent"
        >
          <p>
            These Terms shall be governed by and construed in accordance with
            applicable laws, without regard to conflict of law principles. Any
            disputes arising from these Terms or the use of the Service shall be
            resolved through good-faith negotiation first, and if unresolved,
            through the appropriate legal channels in the applicable
            jurisdiction.
          </p>
        </LegalSectionCard>

        <LegalSectionCard
          id="changes"
          icon={FileText}
          title="Changes to Terms"
          accentColor="warm"
        >
          <p>
            We may revise these Terms of Service from time to time. Any changes
            will be reflected by an updated &ldquo;Effective&rdquo; date at the
            top of this page.
          </p>
          <p>
            Your continued use of the Service after changes are posted
            constitutes your acceptance of the revised terms. If you do not
            agree to the updated terms, you should discontinue use of the
            Service.
          </p>
        </LegalSectionCard>
      </div>

      <div className="rounded-lg border border-border/50 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        <p>
          For questions about these terms, please contact us at{" "}
          <strong className="text-foreground">info@scrumpokergame.com</strong>
        </p>
      </div>
    </>
  );
}
