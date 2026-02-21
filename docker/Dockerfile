# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate
WORKDIR /app

# Copy lockfile and workspace manifests first (cache-friendly layer)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/tailwind-config/package.json packages/tailwind-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

RUN pnpm install --frozen-lockfile

# ── Stage 2: Build the application ───────────────────────────────────────────
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY . .

# NEXT_PUBLIC_* vars must be present at build time — they get inlined into JS
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
ARG NEXT_PUBLIC_POSTHOG_SESSION_REPLAY=false

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_POSTHOG_SESSION_REPLAY=$NEXT_PUBLIC_POSTHOG_SESSION_REPLAY

RUN pnpm build --filter=web

# ── Stage 3: Production runner ───────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone server output
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
# Copy static assets (not included in standalone)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

ENV HOSTNAME=0.0.0.0
ENV PORT=3000

CMD ["node", "apps/web/server.js"]
