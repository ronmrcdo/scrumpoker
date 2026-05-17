# syntax=docker/dockerfile:1.7
# NEXT_PUBLIC_* vars must be present at build time — they get inlined into JS.

# ============================================================
# Stage 1: Base — Alpine with Node.js, corepack, and pnpm
# ============================================================
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# ============================================================
# Stage 2: Pruner — Use Turbo to prune the monorepo
# ============================================================
FROM base AS pruner

WORKDIR /app

RUN pnpm add -g turbo@2

COPY . .

# Prune to only web app and its workspace dependencies
RUN turbo prune web --docker

# ============================================================
# Stage 3: Builder — Install dependencies and build
# ============================================================
FROM base AS builder

WORKDIR /app

# Copy pruned package.json files + lockfile (cached unless deps change)
COPY --from=pruner /app/out/json/ .

RUN pnpm install --frozen-lockfile

# Copy full pruned source code
COPY --from=pruner /app/out/full/ .

# Build-time environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL=$NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL
ENV NEXT_TELEMETRY_DISABLED=1


RUN pnpm turbo build --filter=web

# ============================================================
# Stage 4: Runner — Minimal production image
# ============================================================
FROM base AS runner

WORKDIR /app

# Install postgresql-client for migrations/seeding and curl for healthcheck
RUN apk add --no-cache postgresql-client curl

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone server output
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

# Copy static assets and public directory
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Copy migration files for runtime migrations
COPY --from=pruner /app/supabase/migrations ./supabase/migrations

# Install Supabase CLI directly from the official GitHub release.
# The `supabase` npm package's postinstall downloads the same binary but has
# been unreliable on Alpine (Coolify build was failing on the postinstall),
# so we fetch it ourselves and pin the version.
ARG SUPABASE_CLI_VERSION=2.20.5
ARG TARGETARCH
RUN set -eux; \
    case "${TARGETARCH:-amd64}" in \
      amd64) SUPABASE_ARCH=amd64 ;; \
      arm64) SUPABASE_ARCH=arm64 ;; \
      *) echo "Unsupported TARGETARCH: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    curl -fsSL -o /tmp/supabase.tar.gz \
      "https://github.com/supabase/cli/releases/download/v${SUPABASE_CLI_VERSION}/supabase_linux_${SUPABASE_ARCH}.tar.gz"; \
    tar -xzf /tmp/supabase.tar.gz -C /usr/local/bin supabase; \
    rm /tmp/supabase.tar.gz; \
    supabase --version

# Copy entrypoint script
COPY --from=pruner /app/apps/web/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:3000/api/health || exit 1

ENTRYPOINT ["./entrypoint.sh"]