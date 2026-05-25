# `nextjs-minimal/` — Next.js Starter Template

> Onboarding for agents and humans working on the Next.js starter.
> Cross-cutting standards: root `AGENTS.md`.

Production-ready Next.js 16.1+ starter for ToughTongue AI integration.
Demo app: "Discover Your Personality" — MBTI assessment + personality coaching.

---

## Stack

Next.js 16.1+ (App Router) · TypeScript · React 19 · Tailwind CSS 4 · shadcn/ui
Zustand · Firebase Auth · `lib/ttai/` (ToughTongue AI client)

---

## Directory Map

```
nextjs-minimal/
├── app/
│   ├── page.tsx              # Home (landing page)
│   ├── layout.tsx            # Root layout
│   ├── test/page.tsx         # Personality test (MBTI scenario)
│   ├── results/page.tsx      # Results viewing
│   ├── coach/page.tsx        # AI coaching (Personality Coach scenario)
│   ├── admin/                # Admin dashboard (split by feature file)
│   ├── auth/                 # Auth context & sign-in page
│   └── api/                  # Server-side API routes (proxy)
│       ├── balance/route.ts
│       ├── sat/route.ts
│       ├── sessions/
│       │   ├── route.ts               # GET — list sessions (v1)
│       │   ├── [sessionId]/route.ts   # GET — session detail
│       │   ├── analyze/route.ts       # POST — legacy analysis trigger
│       │   └── post-process/route.ts  # POST — v2 async analysis + extraction
│       └── ttai/client.ts             # Server-side TTAI API client
├── components/               # Shared components
│   ├── ui/                   # shadcn/ui primitives
│   ├── auth/                 # Auth components
│   ├── TTAIIframe.tsx        # Reusable iframe embed with postMessage
│   ├── PageHeader.tsx
│   ├── EmptyState.tsx
│   └── StatusCards.tsx
└── lib/
    ├── config.ts             # Central env-var loader (all process.env here)
    ├── constants.ts          # MBTI types, route constants
    ├── store.ts              # Zustand app store
    ├── auth.ts               # Admin route auth helpers
    └── ttai/                 # ToughTongue AI client library
        ├── client.ts         # buildEmbedUrl, fetchSAT, createIframeEventListener, sendSessionNotes
        ├── types.ts          # IframeEvent, SAT, EmbedOptions, SessionDetail, SessionV2
        ├── constants.ts      # Scenario IDs, embed base URLs
        └── index.ts          # Public API barrel
```

---

## Key Patterns

### Embed URL Building

Use `buildEmbedUrl` from `lib/ttai`. The `embedStyle` defaults to `"basic"` (recommended).

```typescript
import { buildEmbedUrl } from "@/lib/ttai";

const url = buildEmbedUrl({
  scenarioId: "YOUR_SCENARIO_ID",
  embedStyle: "basic", // "full" | "basic" | "minimal"
  userName: user.displayName,
  userEmail: user.email,
  dynamicVariables: { t_role: "Senior Engineer" },
  hidePoweredBy: true,
  maxDuration: 600, // auto-end after 10 minutes
});
```

For private scenarios, use `getEmbedUrlWithSAT` — auto-fetches a SAT server-side:

```typescript
const url = await getEmbedUrlWithSAT({ scenarioId: "...", userName });
```

### Iframe Events

Use `createIframeEventListener` from `lib/ttai/`. Always clean up on unmount.

```typescript
import { createIframeEventListener } from "@/lib/ttai";

useEffect(() => {
  return createIframeEventListener({
    onStop: ({ data }) => fetchAndStoreResults(data.session_id),
    onTerminated: ({ data }) => markSessionTerminated(data.session_id),
    onSubmit: ({ data }) => router.push(`/results/${data.session_id}`),
    onError: ({ code, message }) => console.error(code, message),
  });
}, []);
```

Two iframe payload formats (event-keyed / type+data-keyed) are normalized automatically.

### Session Post-Processing (v2 — preferred)

After `onStop`, trigger background analysis:

```typescript
// Client calls your proxy:
await fetch("/api/sessions/post-process", {
  method: "POST",
  body: JSON.stringify({ session_id, run_analysis: true, run_extraction: true }),
});
// Returns { ok: true } immediately — poll GET /api/sessions/[id] for results
```

Use `POST /api/sessions/analyze` (legacy) only when you need synchronous results.

### Enriched Session List (v2)

`GET /v2/sessions` returns evaluation scores + extraction results in one call:

```typescript
import { listSessionsV2 } from "@/app/api/ttai/client"; // server-side only
const { sessions } = await listSessionsV2({ scenario_id, limit: 20 });
// sessions[i].evaluation_score, .report_card, .extraction_results available
```

### Sending Evaluator Notes to Running Session

```typescript
import { sendSessionNotes } from "@/lib/ttai";
const iframe = document.querySelector<HTMLIFrameElement>("#ttai-frame")!;
sendSessionNotes(iframe, [{ text: "Hesitated on pricing", timestamp: Date.now() }]);
```

### API Routes (server-side proxy)

All ToughTongue API calls go through `app/api/` to keep the API key server-side.
Never call the ToughTongue API directly from client components.

The server-side client is at `app/api/ttai/client.ts` (not `lib/ttai/client.ts`).

### SAT (Scenario Access Token)

Feature-flagged via `NEXT_PUBLIC_USE_SAT=true` / `FeatureFlags.useSAT` in `lib/config.ts`.
When enabled, `getEmbedUrlWithSAT` calls `POST /api/sat` to fetch a 1-hour token.
Tokens must always be fetched server-side — never from a client component.

### State Management

- **Zustand** (`lib/store.ts`) — persistent state (session data, personality result).
  Access with selectors: `useAppStore((s) => s.specificField)`.
- **`useState`** — UI-only ephemeral state.
- **`localStorage`** — personality test result (no DB required in this demo).

### `lib/config.ts` — Single Env Loader

All `process.env` reads go through `lib/config.ts`. Never read env vars directly elsewhere.

---

## Code Style

### Section Separators

```typescript
// =============================================================================
// Section Name
// =============================================================================
```

### TypeScript

- Explicit prop types (`type ComponentProps = { ... }`).
- `type` for simple shapes, `interface` for objects with methods.
- No `any` — use `Record<string, unknown>` for opaque JSON blobs.
- API keys only in `app/api/` (server-side code).

### Naming

| Kind       | Convention              | Example            |
| ---------- | ----------------------- | ------------------ |
| Files      | PascalCase (components) | `SessionsCard.tsx` |
| Files      | camelCase (utils/hooks) | `fetchSession.ts`  |
| Components | PascalCase              | `SessionsCard`     |
| Functions  | camelCase               | `fetchSession`     |
| Constants  | SCREAMING_SNAKE_CASE    | `SCENARIOS`        |

### Tailwind

- Primary: `teal-500/600`. Accents: `cyan-*`.
- Theme tokens: `bg-card`, `border-border`, `text-foreground`.

---

## Environment Variables

```env
TOUGH_TONGUE_API_KEY=your_api_key          # server-side only — never NEXT_PUBLIC_
NEXT_PUBLIC_USE_SAT=false                  # set true for private scenarios
SAT_DURATION_HOURS=4                       # optional, default 4
NEXT_PUBLIC_IS_DEV=false                   # set true on dev/preview deployments — disables SEO indexing
NEXT_PUBLIC_APP_URL=https://your-domain.com  # canonical URL — used in sitemap.xml + robots.txt
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

All loaded via `lib/config.ts`.

---

## Commands

```bash
pnpm install
pnpm build    # production build
pnpm lint     # run linter
```

---

## Key Files

| Path                                     | Purpose                                              |
| ---------------------------------------- | ---------------------------------------------------- |
| `lib/config.ts`                          | Central env-var loader                               |
| `lib/constants.ts`                       | MBTI types, route constants                          |
| `lib/ttai/client.ts`                     | Client-side: buildEmbedUrl, events, sendSessionNotes |
| `lib/ttai/types.ts`                      | Iframe events, embed options, session types          |
| `lib/ttai/index.ts`                      | Public barrel export                                 |
| `app/robots.ts`                          | robots.txt — blocks all crawlers when isDev          |
| `app/sitemap.ts`                         | sitemap.xml — empty when isDev                       |
| `app/layout.tsx`                         | Root layout — injects noindex meta when isDev        |
| `app/api/ttai/client.ts`                 | Server-side TTAI HTTP client (all API calls)         |
| `app/api/sessions/post-process/route.ts` | V2 async post-process route (preferred)              |
| `app/api/sessions/analyze/route.ts`      | Legacy synchronous analysis route                    |
| `app/api/sat/route.ts`                   | Scenario Access Token endpoint                       |
| `components/TTAIIframe.tsx`              | Reusable iframe embed + postMessage component        |
| `app/admin/`                             | Admin dashboard (ADMIN_TOKEN gated)                  |
