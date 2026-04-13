# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the **Нейро 32** (Neuro 32) React web app — a luxury dark-themed Russian AI education lab website for Novozybkov city.

## Нейро 32 — artifacts/neuro32

React + Vite multi-page application. Dark luxury theme (amber #f0a500 + navy #0e0e1a).

### Pages
- `/` — Home (hero, typewriter, directions carousel, tools grid, reviews, CTA)
- `/kids` — Kids 7–12 program with full roadmap (24+ sessions)
- `/teens` — Teens 13–17 program with roadmap
- `/adults` — Adults 18+ program with roadmap
- `/cyber` — Cybersecurity program with roadmap
- `/packages` — Pricing packages (5500/7000/8500/11000 ₽/мес)
- `/about` — About the expert (Степан Денис Марьянович)
- `/safety` — Digital safety guide
- `/reviews` — Reviews with user-submittable reviews (localStorage)
- `/contact` — Contact form (saves to localStorage)
- `/aisecretary` — Full-page AI assistant "Нейра"
- `/auth` — Login/register (localStorage-based)
- `/lk` — Personal cabinet (dashboard, schedule, payment, profile)
- `/admin` — Admin panel (stats, requests, users, price editor)

### Architecture
- **Router**: wouter
- **State**: localStorage via `src/lib/store.ts`
- **AI**: Smart local fallback (smartFallback function) — no API key needed
- **Auth**: Demo mode — any email + password "demo" logs in; @DSM1322 → admin
- **No backend**: fully frontend-only SPA

### Key Files
- `src/App.tsx` — main router + layout
- `src/index.css` — complete design system (CSS variables, all components)
- `src/lib/store.ts` — localStorage data layer
- `src/components/` — Nav, Footer, AIWidget, Cursor, Loader, Roadmap
- `src/pages/` — all 14 page components

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
