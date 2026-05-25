# ToughTongue AI Documentation — Mintlify Site (Archived)

> **Archived.** Moved from `docs/` to `archived/mintlify-docs/` while the repo is
> renamed to `voice-ai-quickstart`. Content is preserved and ready to re-activate.

## To reactivate

1. Move this directory back to `docs/` (or any path you prefer).
2. In the [Mintlify dashboard](https://dashboard.mintlify.com), update the
   **Repository source path** to match the new directory location.
3. Optionally re-point `docs.toughtongueai.com` CNAME if DNS was removed.
4. Run `pnpm install && pnpm dev` to verify locally before deploying.

---

# Developer Guide

Welcome to the ToughTongue AI documentation repository. This is a [Mintlify](https://mintlify.com) documentation site with interactive API playground.

## 🏗️ Directory Structure

The directory structure mirrors the navigation hierarchy defined in `docs.json`:

```
docs/
├── docs.json                      # Main configuration (navigation, branding, API)
├── package.json                   # Dependencies & scripts
│
├── getting-started/               # New user onboarding
│
├── product/                       # Product documentation
│   ├── *-*.mdx                    # Feature pages (Scenario Studio, Conversation Experience, etc.)
│   └── use-cases/                 # Real-world examples (Sales Coaching, Courses)
│
├── developer/                     # Developer integration docs
│   ├── overview.mdx               # Developer docs overview
│   ├── iframe.mdx, api.mdx, authentication.mdx
│   ├── guides/                    # How-to guides (Webhooks, Troubleshooting)
│   └── starters/                  # Starter template docs (Next.js, Flask, Firebase)
│
├── api-reference/                 # API documentation
│   ├── overview.mdx               # API overview & test endpoint
│   ├── openapi.json               # OpenAPI 3.0 specification
│   └── endpoints/                 # Individual endpoint pages
│
└── public/                        # Static assets (logos, favicon)
```

## 🎯 Configuration: docs.json

The `docs.json` file controls everything:

- **Branding:** Colors, logos, name
- **Navigation:** Sidebar structure with tabs and groups
- **API Settings:** OpenAPI spec location, authentication, playground config
- **Global Anchors:** Top navigation links (Discord, Developer Portal)

**Key rule:** All pages must be listed in the `navigation` section to appear in the sidebar.

## 📝 Content Format

All pages use **MDX** (Markdown + JSX components) with frontmatter:

```mdx
---
title: "Page Title"
description: "Brief description"
---

Content here...
```

### Mintlify Components

```mdx
<Note>Informational callout</Note>
<Warning>Important caution</Warning>

<Card title="Title" icon="icon-name" href="/path">
  Description
</Card>

<Accordion title="Click to expand">Content</Accordion>
```

### API Endpoint Pages

```mdx
---
title: "Create Scenario"
api: "POST /scenarios"
---

<ParamField body="name" type="string" required>
  Parameter description
</ParamField>
```

## 🚀 Local Development

```bash
# Install dependencies
pnpm install

# Start dev server (localhost:3000)
pnpm dev

# Check for broken links
pnpm broken-links
```

## ✅ Adding New Content

### 1. Create the MDX file

Place it in the appropriate directory based on the navigation structure:

- Getting started → `getting-started/`
- Product features → `product/`
- Developer docs → `developer/`, `developer/guides/`, or `developer/starters/`
- API endpoints → `api-reference/endpoints/`

### 2. Add to docs.json navigation

```json
{
  "group": "Get Started",
  "pages": ["getting-started/introduction", "getting-started/your-new-page"]
}
```

### 3. Test locally

Run `pnpm dev` and verify:

- Page renders correctly
- Navigation works
- Links are functional
- Code blocks display properly

## 📋 Best Practices

**Writing**

- Be concise and action-oriented
- Use code examples
- Link to related pages
- Label beta features clearly

**Technical**

- Test all code examples
- Keep line length under ~100 characters
- Don't use `{" "}` for spacing (causes rendering issues)
- Don't import from external `.ts` files (inline data instead)

**Navigation**

- Match directory structure to `docs.json` hierarchy
- Use descriptive group names
- Order pages logically (overview first, advanced last)

## 🎨 Assets

- **Logos:** `public/logo-light.svg`, `public/logo-dark.svg`
- **Favicon:** `public/favicon.ico`
- **Images:** Place in `public/` and reference as `/public/your-image.png`

## 🆘 Resources

- [Mintlify Docs](https://mintlify.com/docs)
- [Component Reference](https://mintlify.com/docs/content/components)
- [Discord Community](https://discord.com/invite/NfTPT3HsSj)

---

**Quick tip:** The navigation structure in `docs.json` is the source of truth. Keep the directory structure aligned with it for clarity.
