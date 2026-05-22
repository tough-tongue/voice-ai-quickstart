# Negotiation Trainer — Lovable

**Use case:** Salary and business negotiation practice with AI counterpart + debrief.
**Target platform:** [Lovable](https://lovable.dev)
**Generates:** Full React (Vite + TypeScript + Tailwind) single-page app.

---

## Prompt

> Copy everything below this line and paste it as your Lovable project prompt.

---

Build a beautiful, production-ready web application called **"NegotiateIQ"** that uses
ToughTongue AI for voice-based negotiation practice — salary negotiations, vendor deals, and
contract discussions.

### Application Overview

A React app (Vite, TypeScript, Tailwind CSS, shadcn/ui) with:
1. **Home** — choose your negotiation type
2. **Setup** — configure the scenario context
3. **Negotiation** — full-page ToughTongue AI iframe
4. **Debrief** — scored breakdown of your negotiation strategy
5. **Playbook** — tips page with negotiation frameworks

### Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Zustand (persisted to localStorage)
- Vite proxy for API calls (API key stays server-side)

---

### ToughTongue AI Integration

#### Scenario Config

```typescript
export const SCENARIOS = {
  SALARY:  { id: import.meta.env.VITE_SALARY_SCENARIO_ID  || "salary-negotiation-v1",  label: "Salary Negotiation" },
  VENDOR:  { id: import.meta.env.VITE_VENDOR_SCENARIO_ID  || "vendor-negotiation-v1",  label: "Vendor Deal" },
  RAISE:   { id: import.meta.env.VITE_RAISE_SCENARIO_ID   || "raise-negotiation-v1",   label: "Asking for a Raise" },
} as const;
type ScenarioKey = keyof typeof SCENARIOS;
```

#### Embed URL

```
https://app.toughtongueai.com/embed/<SCENARIO_ID>?bg=black&userName=<NAME>&t_current_salary=<AMT>&t_target_salary=<AMT>&t_role=<ROLE>&t_company=<COMPANY>
```

Dynamic variables (prefix `t_`):
- `t_current_salary` — user's current salary (string, e.g. "$85,000")
- `t_target_salary` — target they want to reach
- `t_role` — the role being negotiated
- `t_company` — company name
- `t_years_experience` — years of experience

Iframe must have `allow="microphone"`. Fill the visible viewport.

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
      if (d.event === "onStop")       { handlers.onStop?.(d.sessionId);       return; }
      if (d.event === "onStart")      { handlers.onStart?.(d.sessionId);      return; }
      if (d.event === "onTerminated") { handlers.onTerminated?.(d.sessionId); return; }
    }
    // Format B
    if (d.type && d.data?.session_id) {
      if (d.type === "onStop")       { handlers.onStop?.(d.data.session_id);       return; }
      if (d.type === "onStart")      { handlers.onStart?.(d.data.session_id);      return; }
      if (d.type === "onTerminated") { handlers.onTerminated?.(d.data.session_id); return; }
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
```

---

### State

```typescript
type NegotiationSession = {
  id: string;
  scenarioKey: ScenarioKey;
  role: string;
  currentSalary: string;
  targetSalary: string;
  sessionId: string;
  score?: number;
  outcome?: string;       // "accepted" | "countered" | "rejected" | "unknown"
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  completedAt: string;
};

type AppState = {
  sessions: NegotiationSession[];
  pendingSetup: Omit<NegotiationSession, 'id' | 'sessionId' | 'completedAt'> | null;
  setPendingSetup: (s: AppState['pendingSetup']) => void;
  addSession: (s: NegotiationSession) => void;
};
```

---

### Page Details

#### Home

- Dark background, gold/amber accents (money = gold)
- Headline: "Master the Art of Negotiation"
- Three scenario cards: Salary Negotiation / Vendor Deal / Asking for a Raise
- Each card shows: avg score from past sessions, session count
- Last session summary banner if sessions exist

#### Setup (`/setup?type=salary`)

Form adapts by negotiation type. For salary:
- Your name, current salary, target salary, role title, company name, years of experience
- "Enter Negotiation" button

For vendor:
- Your name, product/service you're buying, your budget, vendor's asking price, company name

#### Negotiation (`/negotiate`)

- Full-viewport iframe
- Countdown-style "preparation" overlay for 3 seconds before iframe loads
- Pulsing amber dot indicator during session
- On `onStop`/`onTerminated`: "Analyzing your negotiation…" → redirect to `/debrief`

#### Debrief (`/debrief`)

Outcome banner at top:
- "Deal Reached" (green), "Counteroffer Made" (amber), "No Deal" (red)
  — infer from `analysis.evaluation.feedback` text

Score display + breakdown:
- Opening anchor (0–20)
- Justification (0–25): did they back up their ask with data?
- Handling pressure (0–25)
- Closing (0–20)
- Communication (0–10)

"What You Won" section: highlight best moments from transcript.
Transcript (collapsible). CTAs: "Try Again" / "New Scenario".

#### Playbook (`/playbook`)

Static page with 3 negotiation frameworks:
- **BATNA** — Know your walk-away point
- **Anchoring** — Always make the first offer
- **The Silence technique** — After your ask, stop talking

Short explanation + a "Practice This" button per framework linking to `/setup`.

---

### Design System

- **Colors:** amber-500/600 primary, gold accents, dark slate background
- **Outcome badges:** green (deal), amber (counter), red (no deal)
- **Animations:** score counter, outcome reveal animation

---

### Config (`src/lib/config.ts`)

```typescript
// Note: VITE_TTAI_API_KEY must only be used in vite.config.ts (Node context).
// Do NOT read it in this module — it runs in the browser.
export const SCENARIOS = { ... } as const;
```

---

### Environment Variables

```env
VITE_TTAI_API_KEY=your_api_key_here
VITE_SALARY_SCENARIO_ID=your_scenario_id
VITE_VENDOR_SCENARIO_ID=your_scenario_id
VITE_RAISE_SCENARIO_ID=your_scenario_id
```

Get your API key: https://app.toughtongueai.com/developer?tab=api-keys

---

### File Structure

```
src/
├── lib/
│   ├── config.ts       # scenario IDs (no API key here)
│   ├── store.ts        # Zustand with persistence
│   └── ttai.ts         # iframe listener, analysis fetch
├── components/
│   ├── TTAIIframe.tsx  # full-page iframe component
│   ├── ScoreBar.tsx    # horizontal score bar with label
│   └── ui/
├── pages/
│   ├── Home.tsx
│   ├── Setup.tsx
│   ├── Negotiate.tsx
│   ├── Debrief.tsx
│   └── Playbook.tsx
├── App.tsx
└── main.tsx
```

Generate this application fully working. Include all files.
