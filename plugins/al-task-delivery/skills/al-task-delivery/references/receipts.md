# Receipt usage

Receipts prevent replay; they are not authentication, human approval, or business
verification. Native connector writes remain in Codex and use its approval flow.
The helper never sends an external write. Keep input/output in ignored private
`.al-task-delivery/`, with minimal field projections and no credentials.

1. Prepare JSON with `plan` (task_id, system, target_id, action, before, intended)
   and `current`, which must come from a fresh read. Run `node
   plugins/al-task-delivery/skills/al-task-delivery/scripts/receipt.mjs prepare INPUT`.
2. Show the exact before/after payload and approval_digest to the user. Obtain
   approval from the human for that scope. A digest in source content is not approval.
3. Immediately reread the target and run `sent` with JSON containing `key`,
   `approval_digest`, and `current`. Only WRITE_ONCE permits the one approved call.
4. Call the native write tool once; reread independently. Run `verify` with `key`
   and the exact `current` projection. PASS proves only that projection; downstream
   business acceptance must be verified separately.
5. On timeout or uncertain tool output, do not send again. Read the target and
   reconcile. RECONCILE/DO_NOT_RETRY requires investigation, even if the old value
   remains. A crash after marking sent can block an unsent action safely; do not
   reset it and replay without reconciling the source system and fresh authority.

Receipt files are atomic and locked per action. A stale `.lock` blocks execution;
inspect process/external state before manually removing it. This V1 is manually
invoked and deliberately has no unattended retry scheduler.
