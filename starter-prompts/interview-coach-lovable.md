# Interview Coach — Lovable

**Use case:** AI-powered interview practice — resume-aware coach, session tracking, feedback.
**Target platform:** [Lovable](https://lovable.dev)
**Generates:** Full React (Vite + TypeScript + Tailwind) single-page app.

---

## Prompt

> Copy everything below this line and paste it as your Lovable project prompt.

---

Build a beautiful, production-ready web application called **"InterviewIQ"** that uses
ToughTongue AI for voice-based interview practice with an AI coach.

### Application Overview

A React app (Vite, TypeScript, Tailwind CSS, shadcn/ui) that lets users practice job interviews
with an AI coach, track their sessions, and review detailed feedback.

Pages:
1. **Home** — landing with features + CTA
2. **Setup** — enter job title, company, and paste job description before starting
3. **Practice** — full-page ToughTongue AI iframe for interview session
4. **Feedback** — post-session analysis: score, strengths, improvements, transcript
5. **History** — list of past sessions with feedback summaries

### Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Zustand for state (persisted to localStorage)
- Vite proxy for API calls (hides API key from client)

---

### ToughTongue AI Integration

#### Scenario ID

```typescript
const INTERVIEW_COACH_SCENARIO_ID = "interview-coach-v1"; // user will replace with their scenario ID
```

Users get their scenario ID from the ToughTongue AI Scenario Studio at
https://app.toughtongueai.com/scenario-studio

#### Iframe Embed URL

```
https://app.toughtongueai.com/embed/<SCENARIO_ID>?bg=black&userName=<NAME>&t_job_title=<JOB_TITLE>&t_company_name=<COMPANY>&t_job_description=<DESCRIPTION>
```

Dynamic variables (prefix `t_`) pass context to the AI coach:
- `t_job_title` — the role being interviewed for
- `t_company_name` — company name
- `t_job_description` — full job description text (URL-encoded)

Iframe must have `allow="microphone"` attribute.

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

// Fetch analysis after session ends
const res = await fetch("/api/ttai/sessions/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ session_id: sessionId }),
});
const analysis = await res.json();
// analysis.evaluation.score       — 0–100
// analysis.evaluation.feedback    — paragraph summary
// analysis.evaluation.strengths   — string[]
// analysis.evaluation.improvements — string[]
// analysis.transcript             — Array<{ role, content, timestamp }>
```

---

### Application State (Zustand, persisted)

```typescript
type InterviewSession = {
  id: string;
  jobTitle: string;
  company: string;
  sessionId: string;
  score?: number;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  completedAt: string;
};

type AppState = {
  userName: string;
  sessions: InterviewSession[];
  pendingSetup: { jobTitle: string; company: string; jobDescription: string } | null;
  setUserName: (name: string) => void;
  setPendingSetup: (setup: AppState["pendingSetup"]) => void;
  addSession: (session: InterviewSession) => void;
};
```

---

### Page Details

#### Home Page

- Dark background with blue/indigo gradient accents
- Headline: "Practice Interviews. Land the Job."
- Subheadline: "AI-powered mock interviews with instant, detailed feedback"
- Feature cards: "Role-Specific Questions", "Real-Time Voice Practice", "Instant Feedback"
- CTA: "Start Practicing" → `/setup`
- If sessions exist, show "Continue" link to `/history`

#### Setup Page (`/setup`)

Form with:
- Name (text input)
- Job title (text input, e.g. "Senior Product Manager")
- Company name (text input)
- Job description (textarea — paste from job posting)
- "Start Interview" button → saves to store, navigates to `/practice`

Validate: name and job title are required.

#### Practice Page (`/practice`)

- Full-viewport ToughTongue AI iframe
- Reads `pendingSetup` from store to build the embed URL with dynamic variables
- Shows a loading overlay while the iframe initializes
- On `onStart`: hide overlay, show a "Recording" indicator
- On `onStop`: show "Analyzing your interview..." spinner, call analysis API,
  save session to store, redirect to `/feedback`
- On `onTerminated`: same flow as `onStop` (session ended early — still analyze)

#### Feedback Page (`/feedback`)

Shows the analysis for the most recently completed session:

- Score displayed as a large circular progress indicator (0–100)
- Score color: green ≥ 70, yellow 40–69, red < 40
- Summary paragraph
- Two columns: "Strengths" (green checkmarks) and "Areas to Improve" (amber arrows)
- Collapsible transcript section: alternating user/AI message bubbles
- CTAs: "Practice Again" (same role) + "New Interview" → `/setup`

#### History Page (`/history`)

- List of past sessions, most recent first
- Each card: job title, company, date, score badge, "View Feedback" button
- Filter by score range (All / Good ≥70 / Needs Work <70)
- Empty state: "No sessions yet — start your first practice interview"

#### Config (`src/lib/config.ts`)

```typescript
export const config = {
  // Note: VITE_TTAI_API_KEY must only be used in vite.config.ts (Node context).
  // Do NOT read it here — this module runs in the browser.
  scenarioId: import.meta.env.VITE_SCENARIO_ID || "interview-coach-v1",
  adminToken: import.meta.env.VITE_ADMIN_TOKEN || "TTAI-STARTER-ADMIN-TOKEN",
};
```

---

### Environment Variables (`.env`)

```env
VITE_TTAI_API_KEY=your_api_key_here
VITE_SCENARIO_ID=your_interview_scenario_id
```

Get your API key: https://app.toughtongueai.com/developer?tab=api-keys
Create a scenario: https://app.toughtongueai.com/scenario-studio

---

### Design System

- **Colors:** blue-600 primary, indigo accents, dark background (`slate-950`, `slate-900`)
- **Score colors:** `green-500` (good), `amber-500` (average), `red-500` (needs work)
- **Typography:** Inter, large score display, clear hierarchy
- **Components:** shadcn/ui cards, progress, badges, accordion (transcript), dialog
- **Animations:** Score counter animation on Feedback page, fade-in transitions

---

### File Structure

```
src/
├── lib/
│   ├── config.ts          # env vars + scenario ID
│   ├── store.ts           # Zustand store with persistence
│   └── ttai.ts            # iframe event listener, analysis fetch
├── components/
│   ├── TTAIIframe.tsx     # full-page iframe with event handling
│   ├── ScoreCircle.tsx    # animated circular score display
│   ├── FeedbackCard.tsx   # strengths/improvements display
│   └── ui/                # shadcn/ui primitives
├── pages/
│   ├── Home.tsx
│   ├── Setup.tsx
│   ├── Practice.tsx
│   ├── Feedback.tsx
│   └── History.tsx
├── App.tsx
└── main.tsx
```

---

Generate this application fully working, with all files. The app should work
when `VITE_TTAI_API_KEY` and `VITE_SCENARIO_ID` are set.
