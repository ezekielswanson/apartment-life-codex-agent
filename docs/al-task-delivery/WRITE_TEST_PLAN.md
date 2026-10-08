# Proposed live acceptance write

**APPROVED AND VERIFIED — 2026-10-07.** The user approved this exact test with:
“Thank you. Yeah this is fine. Please do the test until we can say this is complete
and ready.” This authority covers the isolated test below, not production tasks.

## Scope

Create exactly one isolated Asana acceptance task assigned to the authenticated
Apartment Life user (`me`) in My Tasks. No project, due date, additional followers,
CRM changes, completion, or deletion. This is test content for this build, not a
follow-up to any production task.

Name: `AL Task Delivery acceptance test — 2026-10-07 — ALTD-01a11834`

Initial notes (exact):

```text
Acceptance test for the AL Task Delivery build. No production task is being processed.
Marker: ALTD-01a11834
State: created; readback pending.
```

Keep `completed=false`.

## Test procedure

1. Verify current Asana identity/workspace. Search only this unique task name to
   reconcile any existing test artifact; do not inspect or process the queue.
2. After the human approves this exact plan, create once. Persist the returned GID
   immediately. If the create response is ambiguous, stop and reconcile; do not
   automatically resend. A search failure never proves the task was not created.
3. Retrieve the exact returned GID, verify name, notes, assignee and completed=false.
4. Prepare the receipt for a notes update using this real GID, exact current notes,
   and the exact intended notes below. Read before again, mark sent, update once.
5. Retrieve the task again and verify exact notes plus completed=false.
6. Re-run the same notes action through the receipt helper. It must return SKIP
   from the live readback and perform no second update. Record the result privately.

Final notes (exact):

```text
Acceptance test for the AL Task Delivery build. No production task is being processed.
Marker: ALTD-01a11834
State: verified write and readback.
```

This proves a scoped Asana write/readback and live repeat suppression. It does not
prove HubSpot writes, Asana task completion, production task delivery, or downstream
workflow/integration behavior. The test task remains incomplete for user review.

## Result

**PASS.** [Test task 1219287422604254](https://app.asana.com/1/4486534842270/task/1219287422604254)
was created once and read back with the exact initial notes, authenticated assignee,
workspace 4486534842270, empty projects, null due dates and completed=false. Asana
automatically lists only the authenticated user as a follower; no additional collaborator
was added. One notes update was sent and verified through independent exact readback.

The same notes action was prepared again from a fresh read and returned PASS/SKIP.
No second update was called. A subsequent independent read returned the same notes
and modified_at `2026-10-07T21:47:12.761Z`. The task remains incomplete as scoped.

Receipt key: `ef3e8a4bf72fbebb9703f09cda3a45351804d9013341239a79edb06b4e894e81`.
Approval payload digest: `6b2b1d5027cac917951c3f1ee7cc3a7feb7d90c250459209873e40f91a13ccab`.
Private evidence: `.al-task-delivery/evidence/live-asana-write.json` and the matching
receipt under `.al-task-delivery/receipts/`. No production task or CRM record changed.
