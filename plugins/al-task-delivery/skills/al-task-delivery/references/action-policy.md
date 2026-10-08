# Action Policy

## Low-risk candidates after the user has granted standing authority
Examples, subject to connector/runtime controls:
- add concise evidence/status comments to the explicitly delegated Asana task
- update task description with verified research or test evidence
- complete a task whose delegated definition of done is an audit/research/documentation deliverable and whose acceptance criteria pass
- create/update internal working documentation in the explicitly designated location
- make narrowly scoped, reversible CRM corrections when the exact source-of-truth rule and write authority are established

## Approval-gated by default
- HubSpot production workflow changes
- custom-code deployment/release
- bulk CRM changes/imports
- merges/deletions
- owner changes
- consent/subscription/marketing-status changes
- association removals
- external email/messages
- changes that affect payroll, finance, donor money, legal terms, HR/hiring decisions, or access/security
- closing the source task when downstream implementation is not verified

## Write discipline
Before consequential writes:
1. identify exact target
2. read current state
3. identify source/evidence for intended state
4. show/obtain approval when the connector or user's standing authority requires it
5. write once
6. re-read
7. reconcile before retrying after timeout/error

Never repeat a non-idempotent write solely because the previous response was unclear.
