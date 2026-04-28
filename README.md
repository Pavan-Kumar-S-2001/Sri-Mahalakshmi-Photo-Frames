## Sri Mahalakshmi Photo Frames — Photo Frames E‑commerce

Monorepo:
- `apps/web`: React + Vite + Tailwind + Framer Motion
- `apps/api`: Express + TypeScript + Prisma + Postgres
- `packages/shared`: shared types + pricing helpers

### Local development

Install once at repo root:

```bash
npm i
```

Run web + api together:

```bash
npm run dev
```

Web:
- `http://localhost:5173`

API:
- `http://localhost:4000/health`

### Environment variables

- Web: copy `apps/web/.env.example` → `apps/web/.env`
- API: copy `apps/api/.env.example` → `apps/api/.env`

### Deployment

See `DEPLOYMENT.md`.

