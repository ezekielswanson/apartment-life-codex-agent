# Apartment Life Codex Agent

Private source repository for the manually delegated Apartment Life Codex agent, AL Task Delivery. Includes the skill/plugin, setup, supporting HubSpot skills, and validation tests.

## Start here

For the manually delegated **AL Task Delivery** agent, read
[`docs/al-task-delivery/SETUP.md`](docs/al-task-delivery/SETUP.md) and
[`docs/al-task-delivery/ACCEPTANCE.md`](docs/al-task-delivery/ACCEPTANCE.md).
The packaged skill is under `plugins/al-task-delivery/skills/al-task-delivery/`.

1. Read `AGENTS.md`.
2. Read `HUBSPOT_AGENT_CLI_SETUP.md` before any HubSpot work.
3. Run `scripts/verify-cloud-environment.sh`.
4. Put each portable task in `threads/YYYY-MM-DD-short-task-name/` using `threads/THREAD_HANDOFF_TEMPLATE.md`.

## Safety boundary

This repository intentionally excludes credentials, `.env` files, CRM exports, logs, generated outputs, spreadsheets, PDFs, archives, and the existing local scripts repository. Add only reviewed, task-specific material that is safe to store in the private cloud repository.

HubSpot authentication and Codex app connections are environment-level. They are not stored in this repository. Always verify the Apartment Life portal before reading CRM data, and obtain explicit approval before making CRM changes.

## Folders

- `threads/` - portable task handoffs for local-to-cloud continuation
- `docs/` - reviewed project documentation
- `prompts/` - reusable, non-sensitive prompts
- `working/` - temporary, non-sensitive working files
- `audits/` - reviewed audit artifacts
- `exports/` - intentionally empty; exports are ignored by default
- `agent-skills/` - reusable HubSpot Agent CLI skills; install or copy these into `.agents/skills/` when the cloud environment allows it
