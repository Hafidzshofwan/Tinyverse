# TinyVerse (platform monorepo)

> **Phase 1 scaffold — tooling only, no product code.**
> This repository is being built **alongside** the live `v17` single-file app
> (Strangler Fig migration). Nothing here points production traffic anywhere.
> See the architecture and roadmap docs in Notion for the full plan.

## What this is

An empty Turborepo monorepo with shared tooling. It installs, lints,
type-checks, and builds an **empty** Next.js app. No clinical logic, no design
tokens, no UI has been migrated yet — those are later phases.

## Layout

```
tinyverse/
├─ apps/
│  └─ web/            # empty Next.js App Router shell (blank page)
├─ packages/
│  └─ config/         # shared tsconfig, eslint (FSD boundaries), prettier, tailwind preset
├─ package.json       # workspace root scripts
├─ turbo.json         # task pipeline
└─ pnpm-workspace.yaml
```

## Commands

```bash
pnpm install        # install workspace deps
pnpm dev            # run apps/web in dev
pnpm build          # turbo build (empty app)
pnpm lint           # eslint incl. FSD boundary rules
pnpm typecheck      # tsc --noEmit across the workspace
pnpm format:check   # prettier check
```

## Guardrails already wired

- **FSD layer boundaries** (`eslint-plugin-boundaries`): imports may only point
  downward `app → processes → widgets → features → entities → shared`.
- **TypeScript strict** shared base config.
- **Prettier** shared config.
- **Tailwind preset** is intentionally **empty** (tokens arrive in Phase 2).
