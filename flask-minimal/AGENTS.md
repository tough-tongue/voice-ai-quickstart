# `flask-minimal/` — Flask Starter Template

> Onboarding for agents and humans working on the Flask starter.
> Cross-cutting standards: root `AGENTS.md`.

Lightweight Python starter for ToughTongue AI integration.
No build tools — Preact served as vanilla JS via CDN.

---

## Stack

Python 3.9+ · Flask 2.0+ · Preact (CDN, no build step) · Vercel serverless

---

## Directory Map

```
flask-minimal/
├── app.py              # Flask application — static file server + config
├── api/
│   └── index.py        # API routes (proxy to ToughTongue API)
├── www/                # Frontend (no build step)
│   ├── index.html      # Main HTML page
│   ├── app.js          # Main Preact app logic
│   ├── assessment.js   # Assessment page — iframe embed + event handling
│   ├── config.js       # Scenario ID, API endpoints, iframe styles
│   ├── styles.css      # Application styling
│   └── components/
│       └── results.js  # Results display component
├── requirements.txt    # Python dependencies
└── vercel.json         # Vercel serverless deployment config
```

---

## Key Patterns

### Config (`www/config.js`)

Scenario IDs and embed options live here:

```javascript
export const toughTongueConfig = {
  baseUrl: "https://app.toughtongueai.com",
  scenarioId: "YOUR_SCENARIO_ID_HERE",
  defaultStyles: { name: "Personality Assessment", color: "indigo-500", background: "white" },
};
```

### API Proxy (`api/index.py`)

All ToughTongue API calls go through Flask to protect the `TTAI_TOKEN`.
Never expose the token to the frontend.

```python
@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.json
    response = requests.post(
        f"{API_BASE_URL}/sessions/analyze",
        json=data,
        headers={"Authorization": f"Bearer {TTAI_TOKEN}"},
    )
    return jsonify(response.json()), response.status_code
```

### Iframe Events (`www/assessment.js`)

```javascript
window.addEventListener("message", (event) => {
  if (!event.data?.event) return;
  if (event.data.event === "onStop") {
    // session completed — event.data.sessionId available
  }
});
```

---

## Environment Variables

```env
TTAI_TOKEN=your_api_token_here
API_BASE_URL=https://api.toughtongueai.com/api/public  # optional
PORT=8008                                               # optional
```

---

## Commands

```bash
# From flask-minimal/
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python app.py   # do not run — user manages dev server
```

---

## Key Files

- `flask-minimal/api/index.py` — API proxy routes
- `flask-minimal/www/config.js` — scenario config (change scenario ID here)
- `flask-minimal/www/assessment.js` — iframe embed + postMessage event handling
- `flask-minimal/requirements.txt` — Python dependencies
- `flask-minimal/vercel.json` — Vercel serverless deployment config
