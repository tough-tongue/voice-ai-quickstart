# Sales Training — Lovable

**Use case:** AI-powered sales training — cold call practice, objection handling, deal coaching.
**Target platform:** [Lovable](https://lovable.dev)
**Generates:** Full React (Vite + TypeScript + Tailwind) single-page app.

---

## Prompt

> Copy everything below this line and paste it as your Lovable project prompt.

---

Build a beautiful, production-ready web application called **"SalesReady"** that uses
ToughTongue AI for voice-based sales training — cold calls, discovery calls, and objection handling.

### Application Overview

A React app (Vite, TypeScript, Tailwind CSS, shadcn/ui) for sales teams to practice
high-stakes conversations with AI-simulated prospects.

Pages:
1. **Home** — training hub with module selection
2. **Module Select** — choose a scenario (cold call, discovery, objection handling)
3. **Session** — full-page ToughTongue AI iframe for the live practice call
4. **Debrief** — call score, what worked, what to improve, transcript
5. **Leaderboard** — team scores (localStorage-based, single user for now)

### Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Zustand (persisted to localStorage)
- Vite proxy for API calls

---

### ToughTongue AI Integration

#### Scenario IDs

```typescript
const SCENARIOS = {
  COLD_CALL:          "cold-call-practice-v1",         // user will replace
  DISCOVERY_CALL:     "discovery-call-practice-v1",    // user will replace
  OBJECTION_HANDLING: "objection-handling-v1",         // user will replace
} as const;

type ScenarioKey = keyof typeof SCENARIOS;
```

Users create or find scenarios in Scenario Studio:
https://app.toughtongueai.com/scenario-studio

#### Embed URL

```
https://app.toughtongueai.com/embed/<SCENARIO_ID>?bg=black&userName=<REP_NAME>&t_product_name=<PRODUCT>&t_prospect_name=<PROSPECT_NAME>&t_prospect_role=<ROLE>
```

Dynamic variables (prefix `t_`):
- `t_product_name` — product/service being sold
- `t_prospect_name` — fictional prospect name (e.g. "Sarah Chen")
- `t_prospect_role` — prospect's job title (e.g. "VP of Engineering")
- `t_company_name` — prospect's company
- `t_pain_point` — key pain point to address

Iframe must have `allow="microphone"`.

#### Iframe Events

```typescript
function listenForIframeEvents(handlers: {
  onStart?:      (sessionId: string) => void;
  onStop?:       (sessionId: string) => void;
  onTerminated?: (sessionId: string) => void;
}): () => void {
  const handle = (event: MessageEvent) => {
    if (event.origin !== "https://app.toughtongueai.com") return;
    const d = event.data;
    if (!d || typeof d !== "object") return;

    // Format A
    if (d.event && d.sessionId) {
      if (d.event === "onStop")        { handlers.onStop?.(d.sessionId);       return; }
      if (d.event === "onStart")       { handlers.onStart?.(d.sessionId);      return; }
      if (d.event === "onTerminated")  { handlers.onTerminated?.(d.sessionId); return; }
    }

    // Format B
    if (d.type && d.data?.session_id) {
      if (d.type === "onStop")        { handlers.onStop?.(d.data.session_id);       return; }
      if (d.type === "onStart")       { handlers.onStart?.(d.data.session_id);      return; }
      if (d.type === "onTerminated")  { handlers.onTerminated?.(d.data.session_id); return; }
    }
  };
  window.addEventListener("message", handle);
  return () => window.removeEventListener("message", handle);
}
```

#### Session Analysis

```typescript
// vite.config.ts proxy
proxy: {
  "/api/ttai": {
    target: "https://api.toughtongueai.com/api/public",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/ttai/, ""),
    headers: { Authorization: `Bearer ${process.env.VITE_TTAI_API_KEY}` },
  },
}

const res = await fetch("/api/ttai/sessions/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ session_id: sessionId }),
});
const analysis = await res.json();
// analysis.evaluation.score       — 0–100
// analysis.evaluation.feedback    — summary paragraph
// analysis.evaluation.strengths   — string[]
// analysis.evaluation.improvements — string[]
// analysis.transcript             — Array<{ role, content, timestamp }>
```

---

### Application State (Zustand, persisted)

```typescript
type TrainingSession = {
  id: string;
  scenarioKey: ScenarioKey;
  scenarioLabel: string;
  repName: string;
  productName: string;
  sessionId: string;
  score?: number;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  completedAt: string;
};

type SessionSetup = {
  scenarioKey: ScenarioKey;
  repName: string;
  productName: string;
  prospectName: string;
  prospectRole: string;
  companyName: string;
  painPoint: string;
};

type AppState = {
  sessions: TrainingSession[];
  pendingSetup: SessionSetup | null;
  setPendingSetup: (setup: SessionSetup | null) => void;
  addSession: (session: TrainingSession) => void;
};
```

---

### Page Details

#### Home Page

- Dark background with green/emerald gradient (sales = money = green)
- Headline: "Train Like a Top Performer"
- Stats bar: total sessions, average score, best score
- Three module cards (Cold Call / Discovery / Objections) — each shows session count + average score
- CTA per card: "Start Training"
- Recent sessions list (last 5, with score badges)

#### Module Select / Setup Page (`/setup`)

Form:
- Module selection (tabs: Cold Call / Discovery Call / Objection Handling)
- Your name (text input)
- Product/service name (text input)
- Prospect name (text input, e.g. "Sarah Chen")
- Prospect title (text input, e.g. "VP of Sales")
- Company (text input)
- Primary pain point (text input)
- "Start Practice Call" button

#### Session Page (`/session`)

- Full-viewport ToughTongue AI iframe, dark background
- Subtle "Live" indicator (pulsing red dot) during session
- On `onStart`: show "Connected" toast
- On `onStop`: "Analyzing call..." overlay → call analysis API → redirect to `/debrief`
- On `onTerminated`: same flow as `onStop` (call ended early — still analyze and debrief)

#### Debrief Page (`/debrief`)

Call scorecard layout:
- Large score number with color coding (red/amber/green)
- "Call Summary" paragraph
- Two columns: "What Worked" (green bullets) / "Improve Next Time" (amber bullets)
- "Key Moments" — highlight 3 quotes from the transcript (best and worst exchanges)
- Full transcript (collapsible, styled as a phone call — right-aligned rep, left-aligned prospect)
- CTAs: "Run It Again" (same setup) + "New Scenario"

#### Leaderboard (`/leaderboard`)

Single-user view (localStorage):
- Tabs: All Time / Last 30 Days / By Scenario
- Table: scenario, sessions count, avg score, best score, last practice
- "Practice Streak" counter (consecutive days with at least one session)
- Empty state: "No sessions yet — start your first practice call"

#### Config (`src/lib/config.ts`)

```typescript
export const config = {
  // Note: VITE_TTAI_API_KEY must only be used in vite.config.ts (Node context).
  // Do NOT read it here — this module runs in the browser.
};

export const SCENARIOS = {
  COLD_CALL:          { id: import.meta.env.VITE_COLD_CALL_SCENARIO_ID    || "cold-call-practice-v1",    label: "Cold Call" },
  DISCOVERY_CALL:     { id: import.meta.env.VITE_DISCOVERY_SCENARIO_ID    || "discovery-call-practice-v1", label: "Discovery Call" },
  OBJECTION_HANDLING: { id: import.meta.env.VITE_OBJECTION_SCENARIO_ID    || "objection-handling-v1",    label: "Objection Handling" },
} as const;
```

---

### Environment Variables (`.env`)

```env
VITE_TTAI_API_KEY=your_api_key_here
VITE_COLD_CALL_SCENARIO_ID=your_cold_call_scenario_id
VITE_DISCOVERY_SCENARIO_ID=your_discovery_scenario_id
VITE_OBJECTION_SCENARIO_ID=your_objection_scenario_id
```

Get your API key: https://app.toughtongueai.com/developer?tab=api-keys
Create scenarios: https://app.toughtongueai.com/scenario-studio

---

### Design System

- **Colors:** emerald-600 primary, green accents, dark (`gray-950`, `gray-900`)
- **Score colors:** `green-500` ≥ 70, `amber-500` 40–69, `red-500` < 40
- **Call transcript:** rep bubbles right-aligned (emerald), prospect left-aligned (gray)
- **Components:** shadcn/ui cards, tabs, progress, badge, toast, accordion
- **"Live" indicator:** `animate-pulse` with `bg-red-500` dot during session

---

### File Structure

```
src/
├── lib/
│   ├── config.ts          # env vars + scenario IDs
│   ├── store.ts           # Zustand store with persistence
│   └── ttai.ts            # iframe listener, analysis fetch
├── components/
│   ├── TTAIIframe.tsx     # full-page iframe component
│   ├── ScoreCard.tsx      # score display with color coding
│   ├── TranscriptView.tsx # call transcript (bubble layout)
│   └── ui/                # shadcn/ui primitives
├── pages/
│   ├── Home.tsx
│   ├── Setup.tsx
│   ├── Session.tsx
│   ├── Debrief.tsx
│   └── Leaderboard.tsx
├── App.tsx
└── main.tsx
```

---

Generate this application fully working, with all files. The app should work when
`VITE_TTAI_API_KEY` is set and at least one scenario ID is configured.
