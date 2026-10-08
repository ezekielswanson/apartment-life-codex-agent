# AL Task Delivery repeatable acceptance

Use `$al-task-delivery` in this project. This request is an acceptance run only;
do not execute the real queue or fix/close the sampled task. Read AGENTS.md, the
skill, connection procedures, and current acceptance report. Preserve live evidence
in ignored private evidence files. Use native plugins; configuration is not proof
of connectivity. Do not perform an external test write without exact human approval.

1. **Asana read**: verify identity/workspace; retrieve task 1218017270372751 with
   notes, latest available comments (limit 50), parent, dependencies, subtasks and
   count. Retrieve relevant parent 1217826077357626. State coverage limits.
2. **HubSpot identity**: call user details, then organization account information;
   require 5627913 / Apartment Life. Stop CRM reads/writes on mismatch.
3. **Known record**: retrieve ticket 48489581088 with hs_object_id, subject,
   hs_pipeline, hs_pipeline_stage. Query associated deals scoped to that ticket,
   with totals/pagination; retrieve deal 64463200875. Read relevant association
   labels through the account-bound API helper where needed. Return source URLs.
4. **Cross-system dry run**: parse ticket 47924141373 from the sampled Asana task,
   retrieve live ticket and associated deal 62491634974. Compare latest requirement
   with current observed state. Produce a precise next action and independent
   completion criteria. Do not infer a sync fix from ticket closure.
5. **Approved low-risk write**: first select and preview an exact test target.
   Obtain explicit human approval for the payload. Prepare receipt, reread before,
   mark sent, execute once, read back changed fields and preserved completion state,
   reconcile. No approval means BLOCKED, not a claimed PASS.
6. **Duplicate prevention**: run the same prepared action again. It must read the
   existing desired state, return SKIP, and make no additional write. Run the local
   repeated-action/ambiguous-timeout tests; distinguish simulated and live evidence.
7. **Failure modes**: run local tests for permission, unavailable record, partial
   search, timeouts, changed-before state, and portal mismatch. Live encountered
   CLI MISSING_SCOPES must yield BLOCKED with no fabricated data, not absence.

Test Notion search/fetch and SharePoint profile/site/document retrieval when useful.
Do not claim SharePoint SitePages body coverage from document search alone.

Return PASS/FAIL/UNKNOWN/BLOCKED per test with evidence, connection read/write limits,
package/skill activation status, and READY FOR PILOT / PARTIALLY READY / BLOCKED.
Do not mark ready unless mandatory HubSpot and other definition-of-done gates pass.
