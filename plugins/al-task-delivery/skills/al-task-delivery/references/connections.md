# Connection procedures

## Primary runtime

Use Codex desktop in this trusted project. Native connected plugins already expose
HubSpot, Asana, Notion, and SharePoint. The plugin's `.app.json` maps the existing
registered MCP connections; no tokens are stored in the repository. Authentication
is per user/environment and must be checked again on another host/cloud runtime.
The mapping is not proof of authentication or of a particular permission.

## HubSpot — required

Call `get_user_details` first, then `get_organization_details` with account information
when establishing a runtime. Expected account ID: **5627913**, portal **Apartment Life**.
Stop CRM operations on mismatch. Check object read/write availability separately.
Use `get_crm_objects` for exact IDs, `search_crm_objects` for scoped association
reads with totals/pagination, and property/schema discovery before enum/custom work.
Include source record URLs. Do not infer association labels from an unlabeled join.

Known read-only acceptance records: ticket **48489581088** and deal **64463200875**.
The deal's contact/company associations can also be retrieved through
`node scripts/al-hubspot-read.mjs record deals 64463200875 dealname,pipeline,dealstage contacts,companies`.
The API helper binds every invocation to `apartment_life_prod` and verifies portal
5627913 before reading. It exposes GET only for allowed CRM types; no write method.
Credentials remain in the CLI's existing user-level authentication store.

The separate `hubspot` CLI was expired on 2026-10-07. `hs api` is authenticated for
deals/contacts/companies/custom objects but ticket reads returned MISSING_SCOPES.
Use the connected plugin for tickets. Do not log tokens, dump CLI config, expand
scopes, or switch to another client portal to bypass a failure.

The plugin reports onboarding incomplete. This did not prevent the verified reads.
Onboarding is a separate optional action, not authorized by this build request.
The current runtime exposes CRM read tools, but no CRM create/update tool despite
the identity response reporting some object write availability. The API fallback
is intentionally GET-only. Therefore CRM corrections and workflow/release writes
are BLOCKED until an appropriate secure write tool and exact authority are available.
Do not infer executable write capability from the availability metadata alone.

## Asana — required

Expected workspace **4486534842270**, `apartmentlife.org`. Confirm `get_me` and a
known task's workspace. Read by exact GID with comments/subtasks enabled and
`comment_limit: 50`; request notes, parent, dependencies, num_subtasks, completion,
modified_at, memberships, workspace, and permalink_url. Read relevant parents.
Inspect returned metadata and counts. If comments hit 50 or subtasks differ from
num_subtasks, coverage is incomplete. The connected `get_task` exposes no comments
cursor, so do not claim exhaustive discussion coverage at the cap; use a separately
authorized paginated API or report UNKNOWN/BLOCKED. Bounded search is discovery,
never a full queue ingest.

Use the existing-task update tool for notes/completion when approved. Its results
can contain partial failures; reread each attempted field. The current comment
tool restricts use to human-authored discussion/context and excludes automated
status logs; do not use it for generated execution receipts. Keep agent evidence
in an approved notes update or another permitted connector surface.

Asana's already connected plugin is the V1 connection. Do not copy Cursor OAuth
credentials or register another developer app. The old Cursor MCP V2 configuration
is a different runtime; its connection is not evidence that Codex is authenticated.

## Notion — preferred

Search narrowly using `notion_search`, fetch exact returned IDs with `notion_fetch`.
Check truncation/unknown-block indicators and material source conflicts. Observed
missing indicators do not prove complete extraction. Keep original URLs. No writes
are needed for agent setup; Asana remains the task record.

## SharePoint/LiferHub — supporting

Verify the authenticated profile and exact site hostname/path. The tested tenant is
`apartmentlifeinc.sharepoint.com`; LiferHub path `/sites/LiferHub`. Document search
and site metadata passed. These do not prove SitePages body access. Do not treat
Graph document search as complete LiferHub process coverage. Fetch a relevant exact
document when a task needs it; report SitePages gaps explicitly. Do not grant new
tenant scopes or implement the separate LiferHub ingestion project during this build.
