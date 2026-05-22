# Personality Assessment — Lovable

**Use case:** MBTI personality test + AI personality coach, powered by ToughTongue AI.
**Target platform:** [Lovable](https://lovable.dev)
**Generates:** Full React (Vite + TypeScript + Tailwind) single-page app.

---

## Prompt

> Copy everything below this line and paste it as your Lovable project prompt.

---

Build a beautiful, production-ready web application called **"Discover Your Personality"** that
integrates ToughTongue AI for voice-based MBTI personality assessment and AI coaching.

### Application Overview

A single-page React app (Vite, TypeScript, Tailwind CSS, shadcn/ui) with these pages:

1. **Home / Landing** — hero section explaining the app, CTA to start the assessment
2. **Test** — MBTI personality assessment via ToughTongue AI iframe
3. **Results** — show the user's personality type + description, option to start coaching
4. **Coach** — AI personality coach that knows your MBTI type
5. **Admin** — session overview + balance info, gated by an admin token

### Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Zustand for state management
- No backend required — API calls via a Vite proxy (vite.config.ts)

---

### ToughTongue AI Integration

#### Iframe Embed

The ToughTongue AI conversation runs inside an `<iframe>`. Use this URL pattern:

```
https://app.toughtongueai.com/embed/<SCENARIO_ID>?bg=black&userName=<NAME>
```

Query parameters:
- `bg` — `black` | `white` | `transparent`
- `userName` — pre-fills the user's name
- `userEmail` — pre-fills the user's email
- `promptUserInfo` — `true` to show a name/email form before starting

The iframe must have `allow="microphone"` and fill the visible viewport.

#### Scenario IDs (use these exact values)

```typescript
const SCENARIOS = {
  PERSONALITY_TEST: "69577496bd7c000fa3f4fc2a",
  PERSONALITY_COACH: "6958f1a646e4227d62efbd61",
} as const;
```

#### Iframe Events (postMessage)

Listen for events from the iframe. Handle **both** payload formats:

```typescript
type IframeEventHandlers = {
  onStart?:      (sessionId: string) => void;
  onStop?:       (sessionId: string) => void;
  onTerminated?: (sessionId: string) => void;
};

function listenForIframeEvents(handlers: IframeEventHandlers): () => void {
  const handle = (event: MessageEvent) => {
    if (event.origin !== "https://app.toughtongueai.com") return;
    const d = event.data;
    if (!d || typeof d !== "object") return;

    // Format A: { event: "onStop", sessionId: "...", timestamp: 123 }
    if (d.event && d.sessionId) {
      if (d.event === "onStop")        { handlers.onStop?.(d.sessionId as string);       return; }
      if (d.event === "onStart")       { handlers.onStart?.(d.sessionId as string);      return; }
      if (d.event === "onTerminated")  { handlers.onTerminated?.(d.sessionId as string); return; }
    }

    // Format B: { type: "onStop", data: { session_id: "...", ... } }
    if (d.type && d.data?.session_id) {
      if (d.type === "onStop")        { handlers.onStop?.(d.data.session_id as string);       return; }
      if (d.type === "onStart")       { handlers.onStart?.(d.data.session_id as string);      return; }
      if (d.type === "onTerminated")  { handlers.onTerminated?.(d.data.session_id as string); return; }
    }
  };
  window.addEventListener("message", handle);
  return () => window.removeEventListener("message", handle);
}
```

#### Session Analysis API

After `onStop`, call the analysis API through a Vite proxy:

```typescript
// In vite.config.ts — proxy to hide API key
server: {
  proxy: {
    "/api/ttai": {
      target: "https://api.toughtongueai.com/api/public",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/ttai/, ""),
      headers: { Authorization: `Bearer ${process.env.VITE_TTAI_API_KEY}` },
    },
  },
}
```

```typescript
// Analyze session
const res = await fetch("/api/ttai/sessions/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ session_id: sessionId }),
});
const analysis = await res.json();
// analysis.summary — text summary of the personality test result
// analysis.evaluation.feedback — detailed MBTI type description
```

**Important:** Never expose `VITE_TTAI_API_KEY` in client code. Always proxy through vite.config.ts.

---

### Application State (Zustand)

```typescript
type AppState = {
  userName: string;
  mbtiResult: string | null;         // e.g. "INTJ"
  mbtiDescription: string | null;    // full description from analysis
  lastTestSessionId: string | null;
  coachSessions: string[];           // array of session IDs
  setUserName: (name: string) => void;
  setMbtiResult: (result: string, description: string, sessionId: string) => void;
  addCoachSession: (sessionId: string) => void;
};
```

Persist state to `localStorage` using Zustand `persist` middleware.

---

### Page Details

#### Home Page

- Dark gradient hero (indigo → purple → black)
- Headline: "Discover Your Personality Type"
- Subheadline: "Take a 10-minute AI-powered conversation to uncover your MBTI type"
- Two CTAs:
  - "Take the Test" → `/test`
  - "Meet Your Coach" → `/coach` (disabled if no MBTI result yet)
- Feature cards: "Voice-Powered", "Instant Results", "Personal Coach"
- If MBTI result exists, show a banner: "Your type: INTJ — [Retake / Meet Coach]"

#### Test Page (`/test`)

- Full-page ToughTongue AI iframe for `SCENARIOS.PERSONALITY_TEST`
- Show a "Starting..." overlay while iframe loads
- On `onStop`: call session analysis, extract MBTI type from `analysis.summary` or
  `analysis.evaluation.feedback`, save to store, redirect to `/results`
- On `onTerminated`: same flow as `onStop` — treat as a completed session
- Show a loading spinner while analysis is running

#### Results Page (`/results`)

- Display MBTI type in large text (e.g. "INTJ")
- Show a personality type description card (use the analysis feedback)
- Four-letter breakdown with trait descriptions (I/E, N/S, T/F, J/P)
- CTA: "Meet Your Personality Coach" → `/coach`
- Secondary: "Retake Test" → `/test`

#### Coach Page (`/coach`)

- Full-page ToughTongue AI iframe for `SCENARIOS.PERSONALITY_COACH`
- Pass `userName` from store and `mbtiResult` as a dynamic variable:
  ```
  &t_user_personality_assessment=<mbtiResult + description>
  ```
- On `onStop`: save session ID to store, show "Session complete" toast
- Past sessions list below the iframe (session IDs + timestamps from store)

#### Admin Page (`/admin`)

- Accessible at `/admin?token=<ADMIN_TOKEN>`
- Default token: `TTAI-STARTER-ADMIN-TOKEN` (show a banner if default is in use)
- Show: API balance (`GET /api/ttai/balance`), recent sessions list, store state viewer
- Store state viewer: display raw `localStorage` content in a `<pre>` block with a "Clear" button

---

### Config File (`src/lib/config.ts`)

Central place for all environment variable reads:

```typescript
export const config = {
  // Note: VITE_TTAI_API_KEY must only be used in vite.config.ts (Node context).
  // Do NOT read it here — this module runs in the browser.
  adminToken: import.meta.env.VITE_ADMIN_TOKEN || "TTAI-STARTER-ADMIN-TOKEN",
};

export const SCENARIOS = {
  PERSONALITY_TEST: "69577496bd7c000fa3f4fc2a",
  PERSONALITY_COACH: "6958f1a646e4227d62efbd61",
} as const;
```

---

### Environment Variables (`.env`)

```env
VITE_TTAI_API_KEY=your_api_key_here
VITE_ADMIN_TOKEN=change-me-in-production
```

Get your API key at: https://app.toughtongueai.com/developer?tab=api-keys

---

### Design System

- **Colors:** indigo-600 primary, purple-600 secondary, dark backgrounds (`gray-950`, `gray-900`)
- **Typography:** Inter font, large headings for personality type display
- **Components:** shadcn/ui cards, buttons, badges, toast notifications
- **Layout:** Full-viewport iframe pages, max-w-4xl content pages, centered layouts
- **Animations:** Fade-in on page load, smooth transitions between states

---

### File Structure

```
src/
├── lib/
│   ├── config.ts          # env vars + scenario IDs
│   ├── store.ts           # Zustand store with persistence
│   └── ttai.ts            # iframe event listener, session analysis fetch
├── components/
│   ├── TTAIIframe.tsx     # reusable full-page iframe component
│   ├── PersonalityCard.tsx # MBTI type display card
│   └── ui/                # shadcn/ui primitives
├── pages/
│   ├── Home.tsx
│   ├── Test.tsx
│   ├── Results.tsx
│   ├── Coach.tsx
│   └── Admin.tsx
├── App.tsx                # routes
└── main.tsx
```

---

Generate this application fully working. Include all files. The app should work
when `VITE_TTAI_API_KEY` is set and the user opens it in a browser.
