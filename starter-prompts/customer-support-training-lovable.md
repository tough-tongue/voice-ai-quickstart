# Customer Support Training — Lovable

**Use case:** Customer support rep training — handle angry customers, refund requests, escalations.
**Target platform:** [Lovable](https://lovable.dev)
**Generates:** Full React (Vite + TypeScript + Tailwind) single-page app.

---

## Prompt

> Copy everything below this line and paste it as your Lovable project prompt.

---

Build a beautiful, production-ready web application called **"SupportPro"** that uses
ToughTongue AI to train customer support representatives — handling irate customers,
refund requests, product complaints, and escalation scenarios.

### Application Overview

React app (Vite, TypeScript, Tailwind CSS, shadcn/ui) for support team training.

Pages:
1. **Hub** — dashboard with scenario selection, team stats, streak tracker
2. **Scenario Select** — choose scenario type + configure context
3. **Call** — full-page ToughTongue AI iframe (the training call)
4. **Scorecard** — detailed CSAT score breakdown + empathy analysis
5. **Leaderboard** — team performance board (single-user, localStorage-based)

### Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Zustand (persisted to localStorage)
- Vite proxy for API calls

---

### ToughTongue AI Integration

#### Scenarios

```typescript
export const SCENARIOS = {
  ANGRY_CUSTOMER:  { id: import.meta.env.VITE_ANGRY_SCENARIO_ID    || "angry-customer-v1",    label: "Angry Customer" },
  REFUND_REQUEST:  { id: import.meta.env.VITE_REFUND_SCENARIO_ID   || "refund-request-v1",    label: "Refund Request" },
  ESCALATION:      { id: import.meta.env.VITE_ESCALATION_SCENARIO_ID || "escalation-v1",      label: "Escalation" },
  PRODUCT_ISSUE:   { id: import.meta.env.VITE_PRODUCT_SCENARIO_ID  || "product-issue-v1",     label: "Product Issue" },
} as const;
type ScenarioKey = keyof typeof SCENARIOS;
```

#### Embed URL

```
https://app.toughtongueai.com/embed/<SCENARIO_ID>?bg=black&userName=<REP_NAME>&t_customer_name=<NAME>&t_issue_type=<ISSUE>&t_product_name=<PRODUCT>
```

Dynamic variables:
- `t_customer_name` — fictional customer name (e.g. "Marcus Williams")
- `t_issue_type` — what went wrong (e.g. "package never arrived")
- `t_product_name` — product involved
- `t_order_id` — fake order ID for realism (e.g. "ORD-2024-8847")

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
// analysis.evaluation.score        — 0–100 CSAT proxy
// analysis.evaluation.feedback     — paragraph summary
// analysis.evaluation.strengths    — string[]
// analysis.evaluation.improvements — string[]
// analysis.transcript              — Array<{ role, content, timestamp }>
```

---

### State

```typescript
type SupportSession = {
  id: string;
  scenarioKey: ScenarioKey;
  repName: string;
  productName: string;
  issueType: string;
  sessionId: string;
  score?: number;
  csatLabel?: "Excellent" | "Good" | "Needs Work" | "Poor";
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  completedAt: string;
};

type AppState = {
  sessions: SupportSession[];
  pendingSetup: Omit<SupportSession, 'id' | 'sessionId' | 'score' | 'completedAt'> | null;
  setPendingSetup: (s: AppState['pendingSetup']) => void;
  addSession: (s: SupportSession) => void;
};
```

CSAT label mapping: score ≥ 85 → "Excellent", ≥ 70 → "Good", ≥ 50 → "Needs Work", < 50 → "Poor".

---

### Page Details

#### Hub

- Clean blue/teal dashboard aesthetic (professional, corporate feel)
- Four scenario tiles: Angry Customer / Refund Request / Escalation / Product Issue
- Each tile: icon, name, session count, avg CSAT, "Train" button
- Stats row: total sessions, average CSAT, best streak (consecutive days)
- Recent sessions list (last 5)

#### Scenario Select (`/setup?type=angry_customer`)

Form:
- Rep name (text input)
- Product/service name
- Customer name (suggest "Marcus Williams" as placeholder)
- Issue description (what the customer is upset about)
- Order ID (optional, for realism)

"Start Training Call" button.

#### Call (`/call`)

- Full-viewport iframe, dark background
- "Connecting…" overlay for 2 seconds
- Green "Live" pill indicator during session
- On `onStop`/`onTerminated`: "Analyzing call…" overlay → debrief

#### Scorecard (`/scorecard`)

Simulate a real support quality scorecard layout:

CSAT Score (large, color-coded) at top.

Five scored categories in card layout:
- **Empathy** (0–20): Did they acknowledge the customer's frustration?
- **Resolution** (0–25): Did they solve or escalate appropriately?
- **Tone** (0–20): Professional and calm under pressure?
- **Efficiency** (0–20): No unnecessary filler or repetition?
- **Policy knowledge** (0–15): Handled within realistic policy bounds?

Transcript (collapsible, alternating bubbles — rep right/customer left).

Quality badge: "QA Approved" (green) / "Needs Coaching" (amber) / "Flagged for Review" (red).

CTAs: "Practice Again", "Different Scenario".

#### Leaderboard (`/leaderboard`)

- Tabs: All Time / This Week / By Scenario
- Table: scenario type, calls completed, avg CSAT, best CSAT, last practice
- CSAT color-coded badges per row
- Streak tracker at top (flame icon + count)

---

### Config (`src/lib/config.ts`)

```typescript
// Note: VITE_TTAI_API_KEY must only be used in vite.config.ts (Node context).
// Do NOT read it in this module — it runs in the browser.
export const SCENARIOS = { ... } as const;
```

---

### Design System

- **Colors:** blue-600 primary, teal accents, white/gray backgrounds (professional, not dark)
- **CSAT colors:** emerald (Excellent), green (Good), amber (Needs Work), red (Poor)
- **Transcript:** rep bubbles right-aligned (blue), customer left-aligned (gray)
- **QA badge:** large badge with icon in scorecard header

---

### Environment Variables

```env
VITE_TTAI_API_KEY=your_api_key_here
VITE_ANGRY_SCENARIO_ID=your_scenario_id
VITE_REFUND_SCENARIO_ID=your_scenario_id
VITE_ESCALATION_SCENARIO_ID=your_scenario_id
VITE_PRODUCT_SCENARIO_ID=your_scenario_id
```

Get your API key: https://app.toughtongueai.com/developer?tab=api-keys
Create scenarios: https://app.toughtongueai.com/scenario-studio

---

### File Structure

```
src/
├── lib/
│   ├── config.ts        # scenario IDs (no API key here)
│   ├── store.ts         # Zustand with persistence
│   └── ttai.ts          # iframe listener, analysis fetch, CSAT helpers
├── components/
│   ├── TTAIIframe.tsx   # full-page iframe component
│   ├── ScenarieTile.tsx # scenario selection card
│   ├── CsatBadge.tsx    # CSAT label + color badge
│   └── ui/
├── pages/
│   ├── Hub.tsx
│   ├── Setup.tsx
│   ├── Call.tsx
│   ├── Scorecard.tsx
│   └── Leaderboard.tsx
├── App.tsx
└── main.tsx
```

Generate this application fully working. Include all files.
