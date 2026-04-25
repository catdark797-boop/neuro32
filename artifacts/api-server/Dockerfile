# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:24-slim AS builder

# UTF-8 locale (needed for correct Russian string handling in fetch bodies)
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8

# Install pnpm globally
RUN npm install -g pnpm@latest

WORKDIR /app

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json tsconfig.base.json ./

# Copy workspace packages
COPY scripts/ ./scripts/
COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# Build the API server bundle
RUN pnpm --filter @workspace/api-server run build

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:24-slim AS runtime

# Install curl for HEALTHCHECK
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Create non-root user (avoid hardcoding UID; base images may already use 1000)
RUN id -u appuser >/dev/null 2>&1 || useradd -m appuser

WORKDIR /app

# Install pnpm (needed for drizzle-kit push at startup)
RUN npm install -g pnpm@latest

# Copy compiled bundle
COPY --from=builder /app/artifacts/api-server/dist ./dist

# Copy db package (schema + drizzle config) and its node_modules for migration on boot
COPY --from=builder /app/lib/db ./lib/db
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./

# Transfer ownership to non-root user
RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

ENV NODE_ENV=production LANG=C.UTF-8 LC_ALL=C.UTF-8

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/healthz || exit 1

# Push schema (idempotent) then start the server.
# `set -e` makes any migration failure kill the boot so we don't silently run
# with a stale schema (as happened with users.deleted_at on the initial
# Step 5 deploy). drizzle-kit needs a writable HOME for the npx cache, so we
# point it at a tmp dir inside the container that's writable for appuser.
CMD ["sh", "-euc", "export HOME=/tmp; echo '>>> Running drizzle-kit push'; cd /app/lib/db && npx --no-install drizzle-kit push --force --config ./drizzle.config.ts; echo '>>> Starting api-server'; cd /app && exec node --enable-source-maps ./dist/index.mjs"]
