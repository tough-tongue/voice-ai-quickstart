# The Camellias — Website Map

Complete reference of every route, anchor, and slide in the site.
Accessible at: `/website-map.md`

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page — full marketing site |
| `/slides` | Slide deck index |
| `/slides/property-type-a` | Property Type A — opens at slide 1 |
| `/slides/property-type-a/1` | Property Type A — Slide 1: The Wraparound Residence |
| `/slides/property-type-a/2` | Property Type A — Slide 2: An open arrival, a private wing |
| `/slides/property-type-a/3` | Property Type A — Slide 3: Configuration & Areas |
| `/slides/property-type-a/4` | Property Type A — Slide 4: Light, gathered along the long edge |
| `/slides/property-type-a/5` | Property Type A — Slide 5: Four bedrooms. Four moods |
| `/slides/property-type-b` | Property Type B — opens at slide 1 |
| `/slides/property-type-b/1` | Property Type B — Slide 1: The Sky Penthouse |
| `/slides/property-type-b/2` | Property Type B — Slide 2: A garden in the sky |
| `/slides/property-type-b/3` | Property Type B — Slide 3: Configuration & Areas |
| `/slides/property-type-b/4` | Property Type B — Slide 4: Double-height. Single horizon |
| `/slides/property-type-b/5` | Property Type B — Slide 5: A suite with three windows of light |
| `/slides/amenities` | Amenities — opens at slide 1 |
| `/slides/amenities/1` | Amenities — Slide 1: The Sanctuary |
| `/slides/amenities/2` | Amenities — Slide 2: Spa, pools and a fitness studio above the trees |
| `/slides/amenities/3` | Amenities — Slide 3: Two championship courses, one drive away |
| `/slides/amenities/4` | Amenities — Slide 4: A short list, kept short |
| `/admin` | Admin remote-navigation panel (password-gated) |

---

## Landing Page Sections (scroll anchors)

| Anchor | Navbar Label | Description |
|--------|-------------|-------------|
| `#intro` | The Project | Introductory narrative section |
| `#highlights` | Highlights | Alternating image & text highlights |
| `#sustainability` | Sustainability | LEED Platinum sustainability pillars |
| `#masters` | Grand Masters | Carousel of master designers |
| `#gallery` | Gallery | Site photography gallery |

---

## Slide Decks Summary

| Deck ID | Title | Slide Count | Slides |
|---------|-------|-------------|--------|
| `property-type-a` | Property Type A | 5 | 1 – 5 |
| `property-type-b` | Property Type B | 5 | 1 – 5 |
| `amenities` | Amenities | 4 | 1 – 4 |

---

## Remote Navigation (Session Protocol)

Visitors connect a session from the site's "Connect Session" widget (bottom-right of every page).
This generates a 4-character uppercase session ID (e.g. `XKQP`) and appends `?session=XKQP` to the URL.

The Admin at `/admin` can then target that session ID and dispatch `url` or `section` commands.

### Command shape
```json
{ "url": "/slides/property-type-a/2" }   // navigate to a route
{ "section": "#highlights" }              // scroll to a landing page section
```

### API endpoints
| Method | Path | Body |
|--------|------|------|
| `POST` | `/api/navigate-commands/:sessionId` | `{ url?, section? }` |
| `GET`  | `/api/navigate-commands/:sessionId/poll` | — (long-poll, 29s timeout) |
