# scenario-manager

Manage ToughTongue AI scenarios as YAML files — version-control your scenario
definitions and sync them to the API with one command.

```
ttcli push            # push all scenarios in scenarios/
ttcli pull <id>       # pull a remote scenario to a local file
ttcli list            # list all scenarios in your account
ttcli diff <file>     # preview changes before pushing
ttcli delete <id>     # delete a scenario
```

---

## Quick Start

### 1. Get your API key

Go to [app.toughtongueai.com/developer](https://app.toughtongueai.com/developer?tab=api-keys)
and create a Personal Access Token (PAT).

### 2. Set environment variables

```bash
export TTAI_PAT_TOKEN="your_pat_token_here"

# Optional: scope all operations to an org
export TTAI_ORG_ID="your_org_id"
```

Or add them to your shell profile (`~/.zshrc`, `~/.bashrc`).

### 3. Add `ttcli` to your PATH

```bash
# From the repo root
export PATH="$PATH:$(pwd)/scenario-manager"

# Or copy it somewhere permanent
cp scenario-manager/ttcli /usr/local/bin/ttcli
```

### 4. Create a scenario YAML

```bash
cp scenario-manager/scenarios/example.yml scenario-manager/scenarios/my-scenario.yml
# Edit the file — set name and ai_instructions at minimum
```

### 5. Push it

```bash
ttcli push scenario-manager/scenarios/my-scenario.yml
# → Creates the scenario, writes the ID back into the file
# → Commit the file — the ID is now tracked in version control
```

---

## Scenario YAML Format

All fields map directly to the ToughTongue AI scenario schema.

```yaml
---
id: ""                    # blank for new; filled in after ttcli push

# Required
name: "My Scenario"
ai_instructions: |-
  You are a [role]. Your behavior: ...

# Optional
description: "Internal team note about this scenario"
user_friendly_description: "What the end-user sees on the landing page"
rubrik: |-
  Scoring criteria for the AI evaluator:
  1. Category (0–N): description

is_public: true           # true = no SAT token required to embed
is_recording: true        # record audio for session analysis
restrict_analysis: false  # if true, users can't see their own results

appearance:
  voice: "Aoede"          # Aoede | Charon | Fenrir | Kore | Puck

session_analysis:
  is_auto_analysis: false
  # admin_email: "team@company.com"

memory:
  is_memory: false
```

See [`scenarios/example.yml`](scenarios/example.yml) for a fully annotated reference.

---

## Workflow

### Creating a new scenario

1. Copy `scenarios/example.yml` → `scenarios/your-scenario.yml`
2. Edit `name`, `ai_instructions`, and any optional fields
3. Run `ttcli push scenarios/your-scenario.yml`
4. The `id` is written back into the file automatically
5. Commit the file

### Updating an existing scenario

1. Edit the YAML file (the `id` field must be present)
2. Run `ttcli diff scenarios/your-scenario.yml` to preview changes
3. Run `ttcli push scenarios/your-scenario.yml`

### Pulling an existing scenario from the API

Useful for migrating scenarios you created in the Scenario Studio UI:

```bash
ttcli pull 69577496bd7c000fa3f4fc2a scenarios/personality-test.yml
```

### Pushing all scenarios at once

```bash
ttcli push        # pushes all .yml files in scenarios/
```

### Org-scoped usage

If you're managing scenarios for an organization:

```bash
export TTAI_ORG_ID="your-org-id"
ttcli list        # lists org scenarios
ttcli push        # pushes as org admin
```

---

## Commands

| Command                        | Description                                     |
| ------------------------------ | ----------------------------------------------- |
| `ttcli list`                   | List all scenarios with IDs and names           |
| `ttcli push [file.yml ...]`    | Push one or more files (or all in `scenarios/`) |
| `ttcli pull <id> [output.yml]` | Pull a remote scenario to a local file          |
| `ttcli diff <file.yml>`        | Show what would change without pushing          |
| `ttcli delete <id>`            | Delete a scenario (prompts for confirmation)    |
| `ttcli help`                   | Show usage                                      |
| `ttcli version`                | Print version                                   |

---

## Environment Variables

| Variable              | Required | Description                                                     |
| --------------------- | -------- | --------------------------------------------------------------- |
| `TTAI_PAT_TOKEN`      | ✅ Yes    | Personal Access Token from Developer Portal                     |
| `TTAI_ORG_ID`         | Optional | Org ID — scopes all operations to your organization             |
| `TTCLI_SCENARIOS_DIR` | Optional | Directory for `ttcli push` default scan (default: `scenarios/`) |

---

## Requirements

- **bash 4+** (`bash --version`)
- **curl** (pre-installed on macOS/Linux)
- **python3** with stdlib only — no `pip install` needed

macOS ships with python3. On Linux: `apt install python3` or `yum install python3`.

---

## Directory Layout

```
scenario-manager/
├── ttcli               # CLI script (add to PATH or copy to /usr/local/bin)
└── scenarios/
    ├── example.yml     # Fully annotated reference scenario
    └── *.yml           # Your scenario definitions
```

---

## Tips

- **Version-control everything.** The `id` field is the link between your file and
  the live scenario. Commit it after the first push.
- **One file per scenario.** Keeps diffs clean and history meaningful.
- **Use `ttcli diff` before CI pushes.** Helps catch accidental changes.
- **Org admins:** set `TTAI_ORG_ID` in CI secrets alongside `TTAI_PAT_TOKEN` to
  deploy org-scoped scenarios from GitHub Actions.

---

## CI/CD Example (GitHub Actions)

```yaml
# .github/workflows/deploy-scenarios.yml
name: Deploy Scenarios

on:
  push:
    branches: [main]
    paths: ['scenario-manager/scenarios/**']

jobs:
  push-scenarios:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Push all scenarios
        env:
          TTAI_PAT_TOKEN: ${{ secrets.TTAI_PAT_TOKEN }}
          TTAI_ORG_ID: ${{ secrets.TTAI_ORG_ID }}     # optional
        run: |
          export PATH="$PATH:$(pwd)/scenario-manager"
          ttcli push
```
