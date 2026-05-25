# The Camellias — Navigable Elements

This document is the authoritative reference for the **nav-agent** scenario.
It lists every element on the site that a visitor can reach or view, so the agent can decide exactly when and where to navigate.

---

## Routing overview

The site is a React SPA with two main areas:

| Area | Base path | Notes |
|------|-----------|-------|
| Marketing landing page | `/` | Smooth-scrolling single page |
| Slide presentation viewer | `/slides/…` | Full-screen, no scroll |
| Admin remote-nav panel | `/admin` | Developer use only |

---

## 1 — Landing Page (`/`)

### 1.1 Navbar anchor links

| Label | Anchor | Scrolls to |
|-------|--------|-----------|
| The Project | `#intro` | Narrative introduction section |
| Highlights | `#highlights` | Alternating image + text highlights |
| Sustainability | `#sustainability` | LEED Platinum sustainability pillars |
| Grand Masters | `#masters` | Carousel of master designers |
| Decks | `/slides` | Hard-routes to slide index (React Router) |

### 1.2 Landing sections (in order)

| Order | Section id | Content |
|-------|-----------|---------|
| 1 | *(none)* | Hero — full-screen cinematic cover |
| 2 | `#intro` | Project origin & architectural description |
| 3 | `#highlights` | Key architectural highlights |
| 4 | Marquee band | Press accolades (no anchor) |
| 5 | `#sustainability` | Sustainability story |
| 6 | `#masters` | Grand Masters carousel |
| 7 | *(none)* | Book a Private Consultation — Priya |
| 8 | Footer | Address, explore links, dev section |

### 1.3 Book a Consultation

- Consultant name: **Priya**
- Available via the phone number shown in the consultation section
- Suitable when: visitor expresses interest in pricing, viewing, or a private tour

---

## 2 — Slide Presentation Viewer

### 2.1 Deck index (`/slides`)

Entry point listing all three decks. Navigate here to let the visitor choose a deck.

### 2.2 Decks and slide numbers

| Deck ID | URL base | Slides | When to use |
|---------|----------|--------|-------------|
| `property-type-a` | `/slides/property-type-a` | 5 | Show a 4-BHK wraparound-style residence |
| `property-type-b` | `/slides/property-type-b` | 5 | Show the sky penthouse / duplex |
| `amenities` | `/slides/amenities` | 4 | Show clubhouse, spa, golf, lifestyle |

#### Property Type A (4-BHK Wraparound)

| Slide | URL | Headline |
|-------|-----|---------|
| 1 | `/slides/property-type-a/1` | The Wraparound Residence |
| 2 | `/slides/property-type-a/2` | An open arrival, a private wing |
| 3 | `/slides/property-type-a/3` | Configuration & Areas |
| 4 | `/slides/property-type-a/4` | Light, gathered along the long edge |
| 5 | `/slides/property-type-a/5` | Four bedrooms. Four moods |

#### Property Type B (Sky Penthouse)

| Slide | URL | Headline |
|-------|-----|---------|
| 1 | `/slides/property-type-b/1` | The Sky Penthouse |
| 2 | `/slides/property-type-b/2` | A garden in the sky |
| 3 | `/slides/property-type-b/3` | Configuration & Areas |
| 4 | `/slides/property-type-b/4` | Double-height. Single horizon |
| 5 | `/slides/property-type-b/5` | A suite with three windows of light |

#### Amenities

| Slide | URL | Headline |
|-------|-----|---------|
| 1 | `/slides/amenities/1` | The Sanctuary |
| 2 | `/slides/amenities/2` | Spa, pools and a fitness studio above the trees |
| 3 | `/slides/amenities/3` | Two championship courses, one drive away |
| 4 | `/slides/amenities/4` | A short list, kept short (spec sheet) |

---

## 3 — Agent Scenarios

| Constant | Scenario ID | Purpose | Trigger |
|----------|-------------|---------|---------|
| `NAV_AGENT_SCENARIO_ID` | `6a104b56bd9dee6f4d1ab30d` | Live navigation assistant embedded in page | "Talk to Agent" floating button |
| `GOOGLE_MEET_AGENT_SCENARIO_ID` | *(see config)* | Google Meet bot for virtual property tours | "Meet Agent" floating button (toggle in footer) |

---

## 4 — Navigation Decision Guide (for nav-agent)

Use these rules to decide what to navigate to:

| Visitor intent / query | Recommended action |
|------------------------|-------------------|
| "Tell me about the project / what is this?" | Scroll to `#intro` |
| "What are the highlights?" | Scroll to `#highlights` |
| "Show me the apartments / flats" | Navigate to `/slides/property-type-a/1` |
| "What is the sky penthouse / duplex?" | Navigate to `/slides/property-type-b/1` |
| "Show me amenities / clubhouse / pool" | Navigate to `/slides/amenities/1` |
| "Show me configuration / floor plan / area" | Navigate to Type A Slide 3 or Type B Slide 3 |
| "Sustainability / LEED / green" | Scroll to `#sustainability` |
| "Who designed it / architects / designers" | Scroll to `#masters` |
| "Book a visit / consultation / call Priya" | Scroll to bottom of page (Priya section) |
| "See all decks / presentation" | Navigate to `/slides` |
| "Go back to the main page / home" | Navigate to `/` |

---

## 5 — Remote Navigation Session Protocol

1. Visitor loads `https://[site]/` and clicks **Connect Session** (footer dev section)
2. A 4-character uppercase session ID appears (e.g. `XKQP`)
3. Admin opens `/admin`, enters the session ID, clicks **Set Session**
4. Admin clicks any navigation button to push a command
5. Visitor's browser reacts in real-time (route change or section scroll)

### Command shape

```json
{ "url": "/slides/property-type-a/2" }     // route change
{ "section": "#sustainability" }            // scroll to anchor
```

---

## 6 — URLs reference

| Resource | URL |
|----------|-----|
| Landing page | `/` |
| Slide index | `/slides` |
| Admin panel | `/admin` |
| Website nav doc (this file) | `/website-nav.md` |
| Website sitemap | `/sitemap.md` |
| Website map | `/website-map.md` |
