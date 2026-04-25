# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:24-slim AS builder

RUN npm install -g pnpm@latest
WORKDIR /app

# Workspace manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json tsconfig.base.json ./

# Workspace packages needed by the frontend build
COPY scripts/ ./scripts/
COPY lib/ ./lib/
COPY artifacts/neuro32/ ./artifacts/neuro32/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/neuro32 run build

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM nginx:1.29-alpine AS runtime

COPY artifacts/neuro32/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/artifacts/neuro32/dist/public/ /usr/share/nginx/html/

EXPOSE 80
