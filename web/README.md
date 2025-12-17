## 2020news Frontend

Production Next.js App Router frontend for the official 2020news ACS feeds (futsal + beach soccer). The UI renders ACS data with deterministic fallbacks so deployments never rely on local-only artifacts.

### Quick start
```bash
npm install
npm run lint
npm run build
npm run dev
```

### Project structure
- `app/` – App Router pages plus ACS route handlers.
- `components/` – Homepage widgets, layout chrome, live widgets, etc.
- `lib/` – ACS clients, fallbacks, shared utilities, and typed models.
- `data/` – Navigation/content JSON that can change without touching components.
- `docs/` – Detailed English/Persian guides (`frontend-en.md`, `frontend-fa.md`).

### Development notes
- `npm run lint` must stay clean; it uses the same configuration as production CI.
- `npm run build` intentionally triggers ACS fallbacks, so warnings about skipped scrapes are expected locally.
- Do not commit `.next/`, `node_modules/`, caches, or Finder duplicates (see `.gitignore`).

### Documentation
Full English and Persian documentation lives in `docs/frontend-en.md` and `docs/frontend-fa.md` (project purpose, folder layout, local setup, limitations).
