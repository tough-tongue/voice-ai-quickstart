# `docs/` — Mintlify Documentation Site

> Onboarding for agents and humans editing the public ToughTongue AI docs.
> Cross-cutting standards: root `AGENTS.md`.

Mintlify-powered documentation at [docs.toughtongueai.com](https://docs.toughtongueai.com).
`docs.json` is the source of truth for navigation — directory structure must mirror it exactly.

---

## Critical Rules

- **Do not run `mintlify dev`** — user manages the dev server (`localhost:3000`).
- **`docs.json` is law.** Every `.mdx` file must have a matching entry in `docs.json` navigation
  to appear in the sidebar. Every navigation entry must have a matching file.
- **Directory structure mirrors navigation.** Navigation groups → directories; pages → `.mdx` files.
- **No JSX artifacts.** Never use `{" "}` — causes rendering issues.
- **No external TypeScript imports.** Mintlify doesn't support `import from '.ts'` files.
  Use inline `export const` within `.mdx` if you need dynamic data.

---

## Directory Map

```
docs/
├── docs.json                # Mintlify config (nav, tabs, API settings) — SINGLE SOURCE OF TRUTH
├── getting-started/         # Intro & quickstart
├── product/                 # Product features (Scenario Studio, Meet, Phone, Enterprise, Use Cases)
├── developer/               # API & integration guides + starter docs
│   ├── integration/         # iframe, API, authentication
│   ├── nextjs-starter/      # Next.js starter guide (5 pages)
│   └── flask-starter.mdx    # Flask starter (single page)
├── api-reference/           # Interactive API playground
│   ├── openapi.json         # OpenAPI spec
│   └── endpoints/           # One .mdx per endpoint
└── public/                  # Static assets (logos, favicons)
```

---

## MDX Guidelines

### Frontmatter (every page)

```yaml
---
title: "Page Title"
sidebarTitle: "Short Name"   # optional — different name in sidebar
description: "Brief description for SEO and cards"
---
```

### Mintlify Components

```mdx
<Note>Informational callout</Note>
<Tip>Helpful suggestion</Tip>
<Warning>Important caution</Warning>

<Card title="Title" icon="icon-name" href="/path">Description</Card>

<CardGroup cols={2}>
  <Card>...</Card>
  <Card>...</Card>
</CardGroup>

<Accordion title="Expandable section">Content here</Accordion>

<CodeGroup>
```bash Terminal
command here
```
```python Python
code here
```
</CodeGroup>
```

### Line Length

Keep under ~100 characters per line.

---

## API Reference Pages

Use `api` frontmatter for interactive playground:

```yaml
---
title: "Create Scenario"
api: "POST /scenarios"
description: "Create a new scenario"
---
```

Parameter and example blocks:

```mdx
<ParamField body="name" type="string" required>Description here</ParamField>

<RequestExample>
```json
{ "name": "Example" }
```
</RequestExample>

<ResponseExample>
```json 200
{ "id": "scenario_123" }
```
</ResponseExample>
```

API playground config in `docs.json`:

```json
"api": {
  "openapi": "api-reference/openapi.json",
  "playground": { "display": "interactive" },
  "mdx": {
    "server": "https://api.toughtongueai.com/api/public",
    "auth": { "method": "bearer" }
  }
}
```

---

## Common Tasks

### Add a New Page

1. Determine which group it belongs to in `docs.json` navigation.
2. Create `.mdx` file in the **matching directory** (directory = group).
3. Add the page path to `docs.json` navigation.
4. Add frontmatter.

Example — adding to the "Integration" group:
- Navigation path: `developer/integration/new-page`
- File: `docs/developer/integration/new-page.mdx`

### Add a New Group

1. Create directory matching the group name (kebab-case).
2. Add `.mdx` files inside.
3. Update `docs.json` with the new group entry.

### Add API Endpoint

1. Create `api-reference/endpoints/<resource>/<endpoint-name>.mdx`.
2. Use `api` frontmatter with relative path.
3. Add `<ParamField>`, `<RequestExample>`, `<ResponseExample>`.
4. Register in `docs.json` under API Reference tab.

### Update Navigation

Edit `docs.json` → `navigation.tabs[*].groups`. Structure:

```json
{
  "group": "Group Name",
  "pages": ["path/to/page", "path/to/other"]
}
```

---

## Content Do's and Don'ts

| Do                                             | Don't                                  |
| ---------------------------------------------- | -------------------------------------- |
| Be concise — no filler                         | Hallucinate features or rate limits    |
| Use action-oriented titles ("Create Scenario") | Use noun phrases ("Scenario Creation") |
| `<Note>` for beta features                     | Add unnecessary sections               |
| Link to related pages                          | Exceed ~100 char line length           |
| Use code examples sparingly                    | Use `{" "}` in MDX                     |

---

## Testing Changes Locally

```bash
cd docs
pnpm dev   # localhost:3000 — do not run, user manages
```

After any edit, verify:
- Page renders (no disappearing content)
- Navigation links work
- Code blocks display correctly
- API playground functions (for `api:` frontmatter pages)

---

## Key Files

- `docs/docs.json` — Mintlify config and navigation (source of truth)
- `docs/api-reference/openapi.json` — OpenAPI spec
- `docs/developer/` — developer-facing guides and starter docs
- `docs/public/` — static assets (logos, favicons)
