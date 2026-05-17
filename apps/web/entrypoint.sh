#!/bin/sh
set -e

# Run database migrations if DATABASE_URL is provided
if [ -n "$DATABASE_URL" ]; then
  # Ensure SSL is disabled for internal Docker network connections
  export PGSSLMODE=disable

  echo "==> Running database migrations..."
  # CLI is installed to /usr/local/bin at image-build time (see apps/web/Dockerfile).
  supabase db push --db-url "$DATABASE_URL" --include-all
  echo "==> Migrations complete."

else
  echo "==> DATABASE_URL not set, skipping migrations."
fi

# Start the application
exec node /app/apps/web/server.js