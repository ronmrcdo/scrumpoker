"use client";

import { BarChart3, EyeOff, MessageSquare, Users } from "@repo/ui";
import {
  MiniAnalyticsDemo,
  MiniAnonymousDemo,
  MiniChatDemo,
  MiniVotingDemo,
} from "./demos";
import { FeatureCard } from "./feature-card";
import { ScrollReveal } from "./scroll-reveal";

const features = [
  {
    title: "Real-time Voting",
    description:
      "See everyone's votes update instantly as they select their cards. No more waiting for emails or messages - your entire team estimates together in real-time.",
    icon: Users,
    demo: <MiniVotingDemo />,
  },
  {
    title: "Team Chat",
    description:
      "Discuss estimates with your team without leaving the room. Built-in chat keeps the conversation flowing and helps resolve differing opinions quickly.",
    icon: MessageSquare,
    demo: <MiniChatDemo />,
  },
  {
    title: "Anonymous Voting",
    description:
      "Votes stay hidden until the facilitator reveals them. This prevents anchoring bias and ensures everyone provides their honest estimate.",
    icon: EyeOff,
    demo: <MiniAnonymousDemo />,
  },
  {
    title: "Instant Analytics",
    description:
      "Get consensus detection and statistical analysis automatically. See the average, spread, and whether your team agrees - all calculated in real-time.",
    icon: BarChart3,
    demo: <MiniAnalyticsDemo />,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything you need for efficient estimation
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Collaborative tools designed for agile teams to estimate faster
              and more accurately.
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Cards */}
        <div className="space-y-20 sm:space-y-28">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              reverse={index % 2 === 1}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={400}>
          <div className="mt-20 sm:mt-28 text-center">
            <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border/50 shadow-soft-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Ready to start planning?
              </h3>
              <p className="text-muted-foreground">
                Create a room in seconds and invite your team.
              </p>
              <a
                href="#top"
                className="inline-flex items-center justify-center h-11 px-8 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Get Started Free
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
