# Starter Prompts

One-shot prompts that generate fully working ToughTongue AI applications —
paste directly into [Lovable](https://lovable.dev), [v0](https://v0.dev),
[Bolt](https://bolt.new), or Cursor Agent.

## What's Here

| File                                   | App                                                  | Platform |
| -------------------------------------- | ---------------------------------------------------- | -------- |
| `personality-assessment-lovable.md`    | Discover Your Personality — MBTI test + coach        | Lovable  |
| `interview-coach-lovable.md`           | Interview Practice — resume-aware AI coach           | Lovable  |
| `sales-training-lovable.md`            | Sales Training — cold call + objection handling      | Lovable  |
| `negotiation-trainer-lovable.md`       | NegotiateIQ — salary & deal negotiation              | Lovable  |
| `customer-support-training-lovable.md` | SupportPro — CSAT training for support reps          | Lovable  |
| `leadership-coaching-lovable.md`       | LeadWell — management coaching with competency radar | Lovable  |

## How to Use

1. Open a prompt file.
2. Copy the entire prompt (the block under **Prompt**).
3. Paste into Lovable / v0 / Bolt new-project dialog.
4. Set the environment variable `VITE_TTAI_API_KEY` (or `NEXT_PUBLIC_TTAI_API_KEY`
   for Next.js targets) to your ToughTongue AI API key.
5. Deploy.

## ToughTongue AI Integration Reference

Every prompt uses this pattern — good to know when editing:

### Embed URL

```
https://app.toughtongueai.com/embed/<SCENARIO_ID>?bg=black&userName=...
```

### Iframe Events (postMessage)

Two payload formats are both in use — always handle both:

```js
// Format A
{ event: "onStart", sessionId: "...", timestamp: 1234567890 }
{ event: "onStop",  sessionId: "...", timestamp: 1234567890 }

// Format B
{ type: "onStart", data: { session_id: "...", timestamp: "..." } }
{ type: "onStop",  data: { session_id: "...", timestamp: "..." } }
```

Always filter by `event.origin === "https://app.toughtongueai.com"`.

### Session Analysis API

```
POST https://api.toughtongueai.com/api/public/sessions/analyze
Authorization: Bearer <TTAI_API_KEY>
Content-Type: application/json

{ "session_id": "<session_id>" }
```

Returns `{ session_id, summary, evaluation: { score, feedback, strengths, improvements }, transcript }`.

### Getting an API Key

[app.toughtongueai.com/developer](https://app.toughtongueai.com/developer?tab=api-keys)

---

## Adding a New Prompt

1. Create `<use-case>-<platform>.md` in this directory.
2. Follow the template in any existing prompt file.
3. Test: paste into the target platform and verify the generated app works end-to-end.
4. Update this README table.

## Key Files

- `starter-prompts/README.md` — this file
- `nextjs-minimal/` — reference implementation (source of truth for patterns)
- `nextjs-minimal/lib/ttai/client.ts` — iframe event handling reference
