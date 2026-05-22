# ToughTongue AI Docs & Starter Templates

Official documentation and starter templates for [ToughTongue AI](https://toughtongueai.com) — the voice AI platform for building high-stakes conversation training applications.

## What's Inside

> **⚠️ `docs/` is deprecated.** The Mintlify documentation site has moved.
> Documentation is now maintained externally. The `docs/` directory remains
> for historical reference but is no longer actively updated or deployed.

- **`nextjs-minimal/`** — Production-ready Next.js starter with Firebase auth
- **`flask-minimal/`** — Simple Flask starter with iframe embedding
- **`starter-prompts/`** — One-shot prompts to generate working ToughTongue AI apps
- **`scenario-manager/`** — `ttcli`: sync YAML scenario definitions to the ToughTongue API
- ~~**`docs/`** — Mintlify documentation site (deprecated)~~

## ~~📚 Documentation~~ (Deprecated)

> **⚠️ The `docs/` directory is deprecated.** The Mintlify documentation site
> is no longer actively maintained in this repo.
>
> For current documentation see: [docs.toughtongueai.com](https://docs.toughtongueai.com)

## 🚀 Next.js Starter

Production-ready starter template with Firebase authentication.

### Quick Start

```bash
cd nextjs-minimal
pnpm install

# Copy and configure environment variables
cp .env.example .env.local
# Add your TOUGH_TONGUE_API_KEY and Firebase config

pnpm dev
```

### What's Included

- **Landing Page** — Hero section with feature cards
- **Firebase Auth** — Email/password and Google sign-in
- **Protected Routes** — Middleware for authenticated pages
- **Iframe Embedding** — ToughTongue AI conversation widget
- **Session Analysis** — Post-conversation analytics
- **Course Example** — Multi-scenario learning path

### Tech Stack

- Next.js 16.1+ (App Router)
- TypeScript + React 19
- Firebase Authentication
- Tailwind CSS
- Zustand (state management)

### Environment Variables

Create `.env.local` with:

```env
TOUGH_TONGUE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Get your API key from the [Developer Portal](https://app.toughtongueai.com/developer?tab=api-keys).

## 🐍 Flask Starter

Minimal Python starter for quick prototyping.

### Quick Start

```bash
cd flask-minimal
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env with your API key
echo "TTAI_TOKEN=your_api_key" > .env

python app.py
```

Server runs at `http://localhost:5001`

### What's Included

- Landing page with iframe embedding
- Server-side API proxy for security
- Session management and analysis
- Vanilla JavaScript (Preact, no build tools)

## 📖 Repository Structure

```
/
├── nextjs-minimal/                # Next.js 16.1+ starter (Firebase, shadcn/ui)
│   ├── app/                       # App router pages + API routes
│   ├── components/                # React components
│   └── lib/                       # ttai client, config, store
│
├── flask-minimal/                 # Flask + Preact minimal starter
│   ├── api/                       # API proxy routes
│   └── www/                       # Frontend assets (no build tools)
│
├── starter-prompts/               # One-shot prompts → working TT AI apps (6 prompts)
│
├── scenario-manager/              # ttcli — YAML-driven scenario sync
│   ├── ttcli                      # Bash CLI (bash 4+, curl, python3)
│   └── scenarios/                 # Your scenario YAML definitions
│
├── docs/                          # [DEPRECATED] Mintlify documentation
│
└── _0ven/                         # Internal notes (gitignored)
```

## 🔑 Getting Your API Key

1. Sign up at [app.toughtongueai.com](https://app.toughtongueai.com)
2. Go to [Developer Portal](https://app.toughtongueai.com/developer?tab=api-keys)
3. Create a new API key
4. Copy and securely store your token

## 🛠 Scenario Manager

Manage ToughTongue AI scenarios as version-controlled YAML files.

```bash
export TTAI_PAT_TOKEN="your_api_key"
export PATH="$PATH:$(pwd)/scenario-manager"

ttcli list                                      # list all your scenarios
ttcli push scenarios/cold-call.yml              # create or update
ttcli pull 69577496bd7c000fa3f4fc2a             # pull remote → local YAML
ttcli diff scenarios/cold-call.yml              # preview changes
```

See [`scenario-manager/README.md`](scenario-manager/README.md) for full docs,
YAML format reference, and GitHub Actions CI/CD example.

## 🚀 Starter Prompts

One-shot prompts for [Lovable](https://lovable.dev), [v0](https://v0.dev), and [Bolt](https://bolt.new)
that generate fully working ToughTongue AI apps in a single paste.

| Prompt                                                                                         | Use Case                                                         |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`personality-assessment-lovable.md`](starter-prompts/personality-assessment-lovable.md)       | MBTI test + AI personality coach                                 |
| [`interview-coach-lovable.md`](starter-prompts/interview-coach-lovable.md)                     | Resume-aware interview practice                                  |
| [`sales-training-lovable.md`](starter-prompts/sales-training-lovable.md)                       | Cold call + objection handling training                          |
| [`negotiation-trainer-lovable.md`](starter-prompts/negotiation-trainer-lovable.md)             | Salary & deal negotiation practice                               |
| [`customer-support-training-lovable.md`](starter-prompts/customer-support-training-lovable.md) | Support rep training — angry customers, refunds, escalations     |
| [`leadership-coaching-lovable.md`](starter-prompts/leadership-coaching-lovable.md)             | Manager coaching — feedback, conflict, stakeholder conversations |

See [`starter-prompts/README.md`](starter-prompts/README.md) for usage instructions.

## 🚢 Deployment

Both templates include `vercel.json` for one-click Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd nextjs-minimal  # or flask-minimal
vercel
```

Remember to add environment variables in your deployment platform.

## 📋 Contributing

See `AGENTS.md` for repo-wide agent rules and area guides.

- **Next.js starter** — see `nextjs-minimal/AGENTS.md`
- **Flask starter** — see `flask-minimal/AGENTS.md`
- **Docs site** — see `docs/AGENTS.md` (note: docs/ is deprecated)

## 📞 Support

- **Documentation:** [docs.toughtongueai.com](https://docs.toughtongueai.com)
- **Discord:** [Join our community](https://discord.com/invite/NfTPT3HsSj)
- **Developer Portal:** [app.toughtongueai.com/developer](https://app.toughtongueai.com/developer/)

## 📄 License

MIT — See individual directories for details.

---

**Ready to build?** Start with a [starter prompt](starter-prompts/README.md) or clone a starter template.
