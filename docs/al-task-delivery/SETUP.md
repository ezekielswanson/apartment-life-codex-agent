# AL Task Delivery setup

## Build and use

This is one Codex agent driven by project instructions and a reusable skill/plugin.
There is no queue scheduler or separate model API runtime. The existing user setting
observed at build time was `gpt-6.1-sol` with `high` reasoning. This project inherits
that setting rather than overriding it. Current thread model selection is host-owned.

1. Open/trust this project in Codex desktop.
2. Run `node scripts/install-al-task-delivery.mjs`. It installs a repo skill symlink,
   local plugin marketplace, and project `.codex/config.toml`, idempotently. It refuses
   to overwrite a conflicting skill/config/catalog. Protected paths may require the
   Codex sandbox's approval. No user/global authentication file is modified.
3. Register/install the portable plugin using `codex plugin marketplace add .`
   followed by `codex plugin add al-task-delivery@apartment-life-local --json`.
   These scoped commands modify Codex user-level plugin configuration/cache and may
   require sandbox approval. Verify `codex plugin list --json`; both commands
   succeeded on this machine. The cache is
   `/Users/zeke/.codex/plugins/cache/apartment-life-local/al-task-delivery/local`.
   The skill is immediately available by file path and normally discovered at
   `.agents/skills/al-task-delivery`. If it is absent in the skill picker, reopen the
   project/restart Codex. The plugin appears in the repo marketplace after
   refresh/restart; installation is a separate host action. Do not claim installation
   solely from a manifest or `enabled = true`.
4. Connect the already available HubSpot and Asana plugins in the target runtime,
   authenticate as Apartment Life, and run `prompts/al-task-delivery-acceptance.md`.
   Notion and SharePoint are preferred supporting connections. Credentials stay in
   user-level OAuth/CLI storage. Never commit/export tokens or copy another app's secret.
5. Run `node --test tests/al-task-delivery.test.mjs` for receipt/failure guard tests.
   Run `node scripts/validate-al-task-delivery.mjs` for package structure checks.
6. Invoke `$al-task-delivery` with one explicit Asana URL/GID, requested outcome,
   and write authority. Use the supplied pilot prompts for bounded pilot classes.
   Initial acceptance is not authorization to execute the dry-run task or the queue.

The skill UI metadata and plugin both provide a suggested task prompt with an Asana
URL, desired outcome and authority. Whether selecting the skill inserts that text
is host/UI-dependent. Alternatively, send `$al-task-delivery` with the task URL;
the agent derives the outcome from available task requirements and preserves human
approval boundaries. With no task supplied, it asks for the link. Suggested prompts
and task content do not create write authority. Restart/reopen if updated metadata
does not appear. No external task is executed merely by configuring the prompt.

## MCP and plugin configuration

`plugins/al-task-delivery/.app.json` contains registered MCP connection IDs for
HubSpot/Asana (required) and Notion/SharePoint (optional). These IDs are public
connection identifiers, not credentials. The installer reads these mappings directly
to generate the per-app project configuration. The repo Codex configuration enables app
tools and selects write approvals/destructive denies per connected app. It also
enables the repo plugin; portable `plugin.json` is the manifest. The skill symlink
uses the same packaged source, avoiding copied rule drift.

Native hosted connections are the tested path. Their registrations need no raw
server URL/token in `.codex/config.toml`. No extra raw Asana/Notion MCP is added,
which avoids duplicate tool catalogs or a second OAuth registration. The inherited
HubSpotDev MCP serves developer tooling and is not a replacement for tested CRM reads.

Project tool policy applies on supported trusted-project launches and cannot relax
managed restrictions. It is not a hard portal/workspace allowlist. The agent and API
helper must verify identity before operations. Revalidate effective tool policy and
connection state in a fresh chat before enabling production writes.

## Source provenance and adaptation

The three supplied Markdown files were copied byte-for-byte into the skill's
`references/source/`; numbered and unnumbered Downloads copies had identical hashes.
The handoff is primary. Workspace-builder language was adapted to project instructions,
repo skills, and registered MCP connections; no ChatGPT Developer Mode is required.
The supplied ZIP is integrated. Its original SKILL.md is archived byte-for-byte;
its four original references are unchanged. The active entrypoint is maintained
independently and links to detailed operating, connection, and receipt procedures.
The package validator checks historical source hashes without requiring the active
entrypoint to repeat the original text. UI metadata uses a Codex skill invocation
prompt, with the original metadata retained as a source.

The supplied pilot prompts are in `prompts/al-task-delivery-pilots.md`. Source checksums
and adaptation limitations are in `docs/al-task-delivery/SOURCE_MANIFEST.json`.

## Portable/repeatable verification

See `docs/al-task-delivery/ACCEPTANCE.md` for every acceptance outcome. Private live
evidence lives under ignored `.al-task-delivery/evidence/`, with mode 600 files and
700 directories. Receipts live under ignored `.al-task-delivery/receipts/`. A new
machine must reconnect plugins and rerun live tests; local CLI API fallback additionally
needs `hs`, its user-level account, and the relevant read scopes. Existing CLI keys
are not bundled. No secrets or live CRM exports are committed.

Official formats used:

- [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp)
- [Skills and repo discovery](https://learn.chatgpt.com/docs/build-skills)
- [Portable plugins and local marketplace](https://developers.openai.com/plugins/build/plugins)
- [Registered MCP mapping validation](https://developers.openai.com/plugins/deploy/submission-errors#mcp-server-reference-errors)
- [Codex configuration](https://learn.chatgpt.com/docs/config-file/config-reference)
