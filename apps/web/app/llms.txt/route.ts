import { SITE_URL } from "@/lib/config";

export const dynamic = "force-static";

export function GET(): Response {
  const body = `# Scrum Poker Game

> Free real-time planning poker for agile teams. Estimate user stories together with no sign-up, no accounts, and no tracking — just share a link and start voting.

Scrum Poker Game is a privacy-first web application for distributed agile teams that need to run planning poker (also called Scrum poker) sessions. A facilitator creates a room, shares the URL, and up to 24 participants join with a display name to vote on story estimates using a Fibonacci deck. Votes stay hidden until reveal to prevent anchoring bias. Rooms auto-delete 24 hours after creation.

## Key facts

- **Name**: Scrum Poker Game
- **URL**: ${SITE_URL}
- **Category**: Agile estimation tool / Project management software
- **Pricing**: Free, no paid tiers, no ads
- **Sign-up required**: No
- **Account required**: No
- **Max participants per room**: 24
- **Default deck**: Modified Fibonacci (1, 2, 3, 5, 8, 13, 21, + "need more info")
- **Room lifetime**: 24 hours, then automatic deletion
- **Tracking**: Cookie-free analytics via Plausible; no personal data collected
- **Real-time sync latency**: Under 80ms typical
- **Platform**: Web (any modern browser, desktop or mobile)
- **License**: Free to use

## How to use Scrum Poker Game

1. Visit ${SITE_URL}
2. Enter your display name and a room name
3. Click "Create Room" — a unique room URL is generated instantly
4. Share the URL with teammates (up to 24)
5. Each player picks a card to estimate the current story
6. The facilitator clicks "Reveal" to flip all cards at once
7. Discuss outliers, re-vote if needed, then move to the next story

## Features

- Real-time voting with sub-100ms sync via Supabase Realtime
- Anonymous sessions (no email, no password, no profile)
- Vote masking until reveal — no anchoring or peeking
- Consensus metrics: median, spread, agreement index, suggested estimate
- Vote distribution visualization
- Live team chat with typing indicators
- Light/dark theme
- Mobile-friendly responsive layout

## Pages

- [Home](${SITE_URL}): Create or join a planning poker room
- [Privacy Policy](${SITE_URL}/privacy): How we handle data (spoiler: minimally)
- [Terms of Service](${SITE_URL}/terms): Usage terms
- [Disclaimer](${SITE_URL}/disclaimer): Service disclaimers

## Frequently asked questions

**What is planning poker?**
A consensus-based estimation technique used by agile teams. Each participant privately picks a card representing their estimate of a user story's effort; all cards reveal simultaneously to prevent the loudest voice from anchoring the group.

**Why use Scrum Poker Game instead of other tools?**
No sign-up, no cost, no tracking, no software install. Works in any browser. Built for teams that want to estimate now, not after a 5-minute onboarding flow.

**What estimation scale is used?**
The modified Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) plus a "need more info" card — the most common scale for Scrum story point estimation.

**Where is data stored and for how long?**
Room data lives in a PostgreSQL database (Supabase) for 24 hours, then is permanently deleted. No long-term user profiles, browsing histories, or activity logs are kept.

**Is the source available?**
Scrum Poker Game is built with Next.js, Supabase, and TypeScript. Operated by the Scrum Poker Game team.

## Contact

- Email: info@scrumpokergame.com
- Site: ${SITE_URL}
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
