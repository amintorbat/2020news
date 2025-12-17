## Frontend Guide – 2020news

### Project Structure
- `app/` holds all App Router routes. The homepage (`app/page.tsx`) orchestrates ACS data, while `app/news`, `app/matches`, and `app/standings` provide dedicated archive views.
- `components/` contains reusable UI blocks. Files under `components/home/` power the homepage (slider, news list, matches, standings) and `components/layout/` covers global chrome such as the navbar and footer.
- `lib/acs/` implements the Adaptive Content Sync layer. Each file (`home.ts`, `matches.ts`, `standings.ts`, `articleDetail.ts`) focuses on a single upstream source.
- `lib/data.ts` stores curated mock data for fallbacks only; it never pushes external URLs directly to the UI.

### ACS Pipeline
- All remote calls run server-side through `fetchWithRetry`, which adds timeouts, retries, and consistent headers.
- Responses are normalized into strict models (`Article`, `Match`, `StandingsRow`) so downstream components never deal with undefined fields. Each article always has a `slug`, `sport`, and safe `imageUrl`.
- Every ACS module has a companion fallback (`fallback.ts`). When the origin fails, we log once with `logWarnOnce` and immediately serve cached/local data.
- In-memory caches prevent repeated scraping for the same request window, and Next.js ISR (`revalidate`) keeps responses fresh without hammering the source.

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
