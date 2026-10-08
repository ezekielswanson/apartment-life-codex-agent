# AL Task Delivery acceptance — 2026-10-07

## Readiness

**READY FOR PILOT** — all seven implementation acceptance tests passed, including
the approved live Asana write/readback and repeat suppression. HubSpot portal
5627913 and known ticket access were reconfirmed after the write test. No production
tasks were processed, closed, or changed. Readiness covers manually selected tasks
within the capabilities listed below; CRM writes and workflow releases remain unverified.

## Build

Runtime: Codex desktop, trusted existing Apartment Life project; CLI 0.144.5 was
used for plugin installation. User configuration observed: `gpt-6.1-sol`, `high`
reasoning, inherited. Current thread model selection remains host-owned.

- Existing AGENTS.md, README.md, HUBSPOT_AGENT_CLI_SETUP.md, and .gitignore updated.
- Original ZIP skill and references packaged under `plugins/al-task-delivery/`;
  source bytes and SHA-256 digests retained. Active instructions subsequently
  consolidated into a shorter entrypoint and linked operating rules.
- Repo skill installed at `.agents/skills/al-task-delivery`; discovered by Codex.
- Local marketplace registered; `al-task-delivery@apartment-life-local` installed
  and enabled, independently confirmed by `codex plugin list --json`.
- Registered MCP mappings in the plugin `.app.json`; trusted-project config at
  `.codex/config.toml` selects per-app write approvals and destructive denies.
- Setup, connection procedures, task rules, supplied pilot prompts, repeatable
  acceptance prompt, cross-system dry run, and exact write-test plan delivered.
- Read-only account-bound HubSpot API helper plus durable receipt helper added.
- Local acceptance tests added; **13/13 passed**. Package validator passed.
  Bundled skill validator passed using a temporary PyYAML validation environment.
  `git diff --check` passed. No new runtime package dependency is required.

## Connections

| System | Method | Read tested | Write tested | Limits |
|---|---|---|---|---|
| HubSpot | Existing connected plugin/registered MCP; secure `hs` API fallback | PASS: identity, known tickets/deals, association search; fallback deal and labeled contact/company associations | Not attempted; CRM write tool unavailable in current catalog | Portal 5627913 / Apartment Life. Fallback lacks ticket scopes and is GET-only; separate `hubspot` CLI expired. Availability metadata is not executable write capability. |
| Asana | Existing connected plugin/registered MCP | PASS: identity, description, comments, parent/subtasks, dependencies | PASS: one isolated task created, exact notes updated once and independently read back | Workspace 4486534842270 / apartmentlife.org. Native task comments capped at 50, with no exposed comments cursor. Automated execution logs cannot use its restricted discussion-comment tool; approved task notes are tested. Completion changes were not tested. |
| Notion | Existing connected plugin/registered MCP | PASS: narrow search and exact fetch of Apartment Life overview and Lifer hub MCP plan | Not attempted | Sources read selectively; missing extraction indicators are not proof of full-page coverage. |
| SharePoint | Existing connected plugin/registered MCP | PASS: Apartment Life profile, LiferHub site, document search and exact document text retrieval | Not attempted | Retrieved program overview is historical and points to newer SitePages. Current SitePages bodies are unverified; no tenant scope changes. |

## Required acceptance tests

| # | Test | State | Evidence and practical limit |
|---|---|---|---|
| 1 | Asana read | PASS | Task 1218017270372751: notes, one returned latest comment, parent 1217826077357626, zero subtasks/dependencies, incomplete. Parent: 12 reported/returned subtask relationships and 8 comments below cap. Available relevant context read; no full-queue claim. |
| 2 | HubSpot identity/access | PASS | `get_user_details` returned accountId 5627913 and Apartment Life user; `get_organization_details` independently returned portalName Apartment Life, America/Chicago, USD. API helper also verified account before read. |
| 3 | Known HubSpot record | PASS | Ticket 48489581088 retrieved by ID with hs_object_id, subject, hs_pipeline, hs_pipeline_stage. Associated-deal search total=1 → 64463200875, independently retrieved. API GET returned deal properties plus labeled contact/company associations. |
| 4 | Cross-system dry run | PASS | Asana 1218017270372751 → exact ticket 47924141373 → associated deal 62491634974. Latest requirement still requires sync confirmation despite closed ticket. Exact next verification actions and empty proposed production change set in CROSS_SYSTEM_DRY_RUN.md. Incident resolution itself is UNKNOWN. |
| 5 | Approved low-risk write/readback | PASS | Human approved WRITE_TEST_PLAN.md. Created task 1219287422604254 once, assigned to authenticated user, with no project/due date/additional collaborator. Exact initial notes read back; one notes update read back exactly. Completed=false throughout. Private live-asana-write.json records payload, authority, results and receipt. |
| 6 | Duplicate prevention | PASS (live + local) | Same notes action run again using a fresh live read: receipt returned PASS/SKIP; no second update. Independent read after repeat showed identical notes and modified_at. One create, one notes update, zero repeat writes. Local tests also cover ambiguous results and drift. |
| 7 | Failure modes | PASS | Live ticket API failure classified BLOCKED/MISSING_SCOPES with data=null. Local tests cover permission failure, unavailable record, partial search, timeout, before-state drift, and portal mismatch; none claims absence or completion. |

## Evidence

Private source receipts and excerpts are under ignored `.al-task-delivery/evidence/`.
`manifest.json` records hashes. Files have mode 600; directories have mode 700.
Evidence remains local, with no secrets copied into this repository. Public/source
package hashes are in SOURCE_MANIFEST.json. No Git commit, push, deployment, queue
automation, or production CRM/Asana write was performed. Only the approved isolated
Asana test task was created and updated. Final local tests passed 13/13 again;
package validation passed and plugin installation/enabled status was reconfirmed.

Known records:

- [Ticket 48489581088](https://app.hubspot.com/contacts/5627913/record/0-5/48489581088?utm_source=al_task_delivery&utm_medium=agent&utm_campaign=acceptance)
- [Deal 64463200875](https://app.hubspot.com/contacts/5627913/record/0-3/64463200875?utm_source=al_task_delivery&utm_medium=agent&utm_campaign=acceptance)
- [Asana dry-run task](https://app.asana.com/1/4486534842270/task/1218017270372751)
- [Verified isolated Asana test](https://app.asana.com/1/4486534842270/task/1219287422604254)
- [Cross-system dry-run evidence](CROSS_SYSTEM_DRY_RUN.md)

## Pilot boundary

No implementation acceptance gate remains. The isolated test remains incomplete
for user review, as approved; it was not deleted or closed. CRM write tools,
SharePoint SitePages, task-completion changes, and workflow-release access must be
verified if a particular future task depends on them. They are not blockers for a
CRM-evidence research or documentation pilot using approved Asana notes updates.
The human must explicitly select the first real pilot task.
Do not automatically execute the sampled dry-run task or any assigned queue.

## Source cleanup — 2026-10-07

The active skill was reduced from 263 to 59 lines and now links to the detailed
operating rules. The implementation/handoff conflict was removed. Unused
`readiness()` and `coverageState()` helpers and their test-only assertions were
removed; the installer now reads connector IDs from `.app.json`. Archived sources
and their hash checks remain intact, while active instructions can evolve.

Post-cleanup checks: **12/12 local tests passed**, package and skill validation
passed, and `git diff --check` passed. An isolated installer check confirmed
byte-identical configuration output, repeat installation, the skill symlink, and
refusal to overwrite conflicting configuration. The earlier 13-test results above
are the historical build acceptance. No live acceptance tests were rerun and no
external systems or installed plugin cache were changed by this source cleanup.
