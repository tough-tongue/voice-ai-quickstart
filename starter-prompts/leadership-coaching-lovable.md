# Leadership Coaching — Lovable

**Use case:** Leadership & executive coaching — difficult conversations, team feedback, stakeholder management.
**Target platform:** [Lovable](https://lovable.dev)
**Generates:** Full React (Vite + TypeScript + Tailwind) single-page app.

---

## Prompt

> Copy everything below this line and paste it as your Lovable project prompt.

---

Build a beautiful, production-ready web application called **"LeadWell"** that uses
ToughTongue AI for voice-based leadership coaching — practicing difficult management
conversations, delivering feedback, and handling stakeholder pressure.

### Application Overview

React app (Vite, TypeScript, Tailwind CSS, shadcn/ui) for managers and leaders
to practice high-stakes conversations.

Pages:
1. **Home** — scenario library with progress tracking
2. **Setup** — configure the conversation context
3. **Session** — full-page ToughTongue AI iframe
4. **Reflection** — structured coaching debrief with leadership competency scores
5. **Growth Plan** — personal improvement tracker across sessions

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
  PERFORMANCE_REVIEW:  { id: import.meta.env.VITE_PERF_REVIEW_SCENARIO_ID   || "performance-review-v1",  label: "Performance Review" },
  DIFFICULT_FEEDBACK:  { id: import.meta.env.VITE_FEEDBACK_SCENARIO_ID      || "difficult-feedback-v1",  label: "Difficult Feedback" },
  STAKEHOLDER_PRESSURE:{ id: import.meta.env.VITE_STAKEHOLDER_SCENARIO_ID   || "stakeholder-pressure-v1",label: "Stakeholder Pressure" },
  TEAM_CONFLICT:       { id: import.meta.env.VITE_CONFLICT_SCENARIO_ID      || "team-conflict-v1",       label: "Team Conflict" },
} as const;
type ScenarioKey = keyof typeof SCENARIOS;
```

#### Embed URL

```
https://app.toughtongueai.com/embed/<SCENARIO_ID>?bg=black&userName=<MANAGER_NAME>&t_direct_report_name=<NAME>&t_issue=<ISSUE>&t_context=<CONTEXT>
```

Dynamic variables:
- `t_direct_report_name` — name of the person being managed (e.g. "Jordan Kim")
- `t_direct_report_role` — their role (e.g. "Senior Engineer")
- `t_issue` — the performance or interpersonal issue (e.g. "consistently missing deadlines")
- `t_context` — additional context about the team or situation

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

### Leadership Competency Model

Score sessions across 5 competencies (extract from analysis feedback):

```typescript
type Competency =
  | "clarity"       // Was the message clear and direct?
  | "empathy"       // Did they acknowledge the human side?
  | "accountability"// Did they set clear expectations/consequences?
  | "listening"     // Did they give space for the other person to speak?
  | "resolution";   // Did the conversation end with a path forward?

type CompetencyScores = Record<Competency, number>;  // 0–20 each
```

---

### State

```typescript
type CoachingSession = {
  id: string;
  scenarioKey: ScenarioKey;
  managerName: string;
  directReportName: string;
  issue: string;
  sessionId: string;
  overallScore?: number;
  competencies?: CompetencyScores;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  completedAt: string;
};

type GrowthGoal = {
  competency: Competency;
  note: string;
  addedAt: string;
};

type AppState = {
  sessions: CoachingSession[];
  growthGoals: GrowthGoal[];
  pendingSetup: Partial<CoachingSession> | null;
  setPendingSetup: (s: AppState['pendingSetup']) => void;
  addSession: (s: CoachingSession) => void;
  addGrowthGoal: (g: GrowthGoal) => void;
};
```

---

### Page Details

#### Home

- Warm, professional aesthetic — deep navy/indigo with warm beige cards
- Headline: "Lead with Clarity. Coach with Confidence."
- Four scenario cards with icons: Performance Review / Difficult Feedback / Stakeholder Pressure / Team Conflict
- Progress radar chart — show avg competency scores across all sessions
  (use a simple SVG radar chart with 5 axes for the 5 competencies)
- "Continue Growth" section showing current growth goals

#### Setup (`/setup?type=performance_review`)

Form adapts by scenario type. For Performance Review:
- Your name (manager)
- Direct report's name + role
- Performance issue (what you need to address)
- Any context (team situation, prior conversations)
- "Start Conversation" button

#### Session (`/session`)

- Full-viewport iframe, deep navy background
- Subtle "In Session" indicator
- On `onStop`/`onTerminated`: "Processing your session…" → reflection page

#### Reflection (`/reflection`)

Header: scenario type + direct report name + date.

Competency spider/radar display — 5 axes rendered as SVG radar chart:
- Each axis: Clarity, Empathy, Accountability, Listening, Resolution (0–20)
- Show current session scores vs. your personal average as two overlaid polygons

Written feedback below the radar chart.

"Moments that Mattered" — 3 transcript excerpts, labeled Good/Improve.

Growth Goals section: for each weakness, show a "Add to Growth Plan" button.

CTAs: "Practice Again", "Different Scenario", "View Growth Plan".

#### Growth Plan (`/growth-plan`)

Personal development tracker:

- Competency trend charts — line charts showing score over last 10 sessions per competency
- Active goals list (added from reflection page)
- "Areas of Strength" vs "Areas to Build" based on avg scores
- Tips per weak competency (e.g. for low Empathy: "Try naming the emotion: 'I can see this is frustrating…'")

---

### Config (`src/lib/config.ts`)

```typescript
// Note: VITE_TTAI_API_KEY must only be used in vite.config.ts (Node context).
// Do NOT read it in this module — it runs in the browser.
export const SCENARIOS = { ... } as const;
export const COMPETENCIES = ['clarity','empathy','accountability','listening','resolution'] as const;
```

---

### Design System

- **Colors:** indigo-800/900 primary, warm beige/amber accents, white cards
- **Radar chart:** indigo fill (current) overlaid on amber (personal avg)
- **Competency colors:** each axis gets a distinct color in the radar
- **Professional tone:** no gamification — this is for serious leadership development

---

### Environment Variables

```env
VITE_TTAI_API_KEY=your_api_key_here
VITE_PERF_REVIEW_SCENARIO_ID=your_scenario_id
VITE_FEEDBACK_SCENARIO_ID=your_scenario_id
VITE_STAKEHOLDER_SCENARIO_ID=your_scenario_id
VITE_CONFLICT_SCENARIO_ID=your_scenario_id
```

Get your API key: https://app.toughtongueai.com/developer?tab=api-keys

---

### File Structure

```
src/
├── lib/
│   ├── config.ts         # scenario IDs + competency list (no API key)
│   ├── store.ts          # Zustand with persistence
│   ├── ttai.ts           # iframe listener, analysis fetch
│   └── competencies.ts   # score parsing helpers
├── components/
│   ├── TTAIIframe.tsx    # full-page iframe component
│   ├── RadarChart.tsx    # SVG radar chart for 5 competencies
│   ├── TrendLine.tsx     # simple SVG line chart for growth page
│   └── ui/
├── pages/
│   ├── Home.tsx
│   ├── Setup.tsx
│   ├── Session.tsx
│   ├── Reflection.tsx
│   └── GrowthPlan.tsx
├── App.tsx
└── main.tsx
```

Generate this application fully working. Include all files. The radar chart and
trend lines should be pure SVG — no chart library dependency required.
