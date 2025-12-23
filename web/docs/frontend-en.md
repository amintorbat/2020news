## Frontend Guide – 2020news

### Project Purpose
2020news renders production content from the official ACS feeds (futsal + beach soccer) with zero editorial tooling. The goal is to show the current hero stories, curated league data, and fallback-friendly match information without depending on private build artifacts.

### Folder Structure
- `app/` – App Router routes and route handlers. Homepage orchestrates ACS calls, `/news` and `/news/[slug]` render article feeds, `/futsal|/beach` host sport hubs, and `/api/acs/*` wraps the scrapers.
- `components/` – Shared UI blocks. `home/` widgets render homepage sections, `layout/` holds persistent chrome, `matches/`, `news/`, `tables/`, and `live/` expose feature-specific pieces.
- `lib/acs/` – Adaptive Content Sync clients plus fallbacks, `lib/data.ts` bundles deterministic mock data for offline rendering, and `lib/acs/types.ts` defines all contract models.
- `data/` – Navigation, copy decks, and structured content that can change without touching components.
- `assets/` and `public/` – Static icons/images that Next.js can serve directly.
- `docs/` – This guide (`frontend-en.md` / `frontend-fa.md`) so engineering onboarding stays in sync.

### ACS Pipeline
- All remote calls run server-side through `fetchWithRetry`, which adds timeouts, retries, and consistent headers.
- Responses are normalized into strict models (`Article`, `Match`, `StandingsRow`) so downstream components never deal with undefined fields. Each article always has a `slug`, `sport`, and safe `imageUrl`.
- Every ACS module has a companion fallback (`fallback.ts`). When the origin fails, we log once with `logWarnOnce` and immediately serve cached/local data.
- In-memory caches prevent repeated scraping for the same request window, and Next.js ISR (`revalidate`) keeps responses fresh without hammering the source.

### Featured Image Selection (ACS News)
- Featured images are selected only from the main article body containers to avoid page chrome or sidebar assets.
- Any image inside ad/banner/trust/badge containers is ignored, and `trustseal.e-rasaneh.ir` is always excluded.
- Tiny/icon-like files (e.g., `logo`, `badge`, `icon`) are skipped; if nothing qualifies, `featuredImage` becomes `null`.
- Debug quickly with `node docs/acs-featured-image-smoke.mjs <fullcontent-url>` to see title, host, and exclusion status.

### Component Responsibilities
- **HeroSlider** displays up to six curated stories with image on the right, text on the left, centered pagination dots, and guaranteed placeholder imagery.
- **NewsList / NewsCard** show only six priority stories on the homepage, always linking internally to `/news/[slug]` and enforcing the RTL image-right layout.
- **MatchesTabs** groups fixtures into "Today" and "This Week", color-codes LIVE/upcoming/finished states, and gracefully handles empty datasets per league tab.
- **LeagueTablesPreview** renders a single compact standings card (Futsal by default) with tabs for other sports and an explicit empty state when ACS returns nothing.
- **News pages** present the remaining stories by sport on `/news`, and `/news/[slug]` renders the ACS article body with a fallback narrative when scraping fails.

### Error Handling Philosophy
- All scrapers run inside try/catch blocks; on failure we emit one concise warning per scope and serve deterministic fallback data.
- Links never point to `2020news.ir`. Even when ACS cannot fetch an image or article body, we keep the UI responsive by using placeholders and cached summaries.
- Components check for empty arrays before rendering so the layout never collapses into blank cards or throws hydration errors.

### Future Extensions
- Add another ACS module for historical archives or specific competitions and feed it into `/news` pagination.
- Introduce a shared KV/Redis cache to persist ACS responses across regions, reducing cold-start latency.
- Generate SEO metadata (OpenGraph & JSON-LD) from `articleDetail` so that share previews reflect the live ACS content.

### Running Locally
1. `npm install` – installs Next.js + ACS scraping dependencies. No global binaries are required.
2. `npm run lint` – runs `next lint` with the production rule-set and must be clean before merging.
3. `npm run build` – validates the App Router tree and executes the ACS fallbacks. This must succeed locally because CI reproduces the same steps.
4. `npm run dev` – launches the dev server on port 3000 for manual QA.

### Known Limitations (WIP)
- Remote ACS endpoints (`2020news.ir`) are blocked during local builds; scrapers rely on curated fallback JSON.
- The live ticker and schedule components use mocked data until ACS exposes a reliable endpoint for real-time fixtures.
- No CMS is wired in; updating navigation copy or hero ordering still requires editing `data/` or `lib/data.ts`.
- Redis / KV cache is not yet connected, so each production request recomputes ACS payloads.
