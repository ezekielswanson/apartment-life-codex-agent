# Codex Implementation Handoff — AL Task Delivery Agent

## Objective

Build a Codex-based **AL Task Delivery Agent** for Apartment Life.

The agent's purpose is to take an explicitly delegated Asana task and complete the defined unit of work as far as its authorized tools allow.

This is not a research-only or summarization agent.

The operating loop is:

**Understand task → gather complete relevant context → determine expected outcome → perform authorized work → independently verify the result → update the existing Asana task → complete only when the delegated outcome is actually verified.**

## Primary implementation requirement

HubSpot access is mandatory.

The previous ChatGPT Workspace Agent prototype cannot access HubSpot inside its agent runtime because HubSpot is not exposed in that tool picker and the current ChatGPT workspace member does not have Developer Mode privileges.

Therefore, the Codex implementation must provide HubSpot access directly through a supported Codex connection such as:

1. the existing HubSpot MCP, if compatible with Codex; or
2. a secure HubSpot API/custom-app integration if MCP is unavailable.

Do not mark the agent ready until HubSpot read access has passed the acceptance tests below.

## Required source files

Use these supplied files as the authoritative starting point:

- `al-task-delivery-skill.zip`
- `al-task-delivery-agent-builder.md`
- `al-task-delivery-pilot-prompts.md`

The skill contains the reusable operating rules. Preserve its logic rather than rewriting the workflow from scratch.

## Target runtime

Build this for **Codex**, using the current supported Codex mechanisms.

Prefer:

- a project-level `AGENTS.md` for durable operating instructions;
- Codex MCP configuration for connected systems;
- a packaged Codex plugin/skill structure when it improves reuse and portability;
- explicit tests for every connected system;
- local execution only where credentials and permissions already support it.

Do not depend on ChatGPT Workspace Agent Developer Mode.

## Agent name

**AL Task Delivery**

## Core Apartment Life systems

The agent should use, when available:

- **Asana** — durable task/work record, requirements, comments, subtasks, status, task communication.
- **HubSpot** — required CRM operational system: contacts, companies, deals, tickets, tasks, activities, associations, properties, pipelines, and approved writes.
- **Notion** — process context, working documentation, prior analysis, meeting notes.
- **SharePoint / LiferHub** — process and organizational documentation when relevant.
- **Outlook / Teams / meeting sources** — supporting evidence when requirements or decisions live there.
- **Web search** — only when external/current information materially affects the task.
- **Local files/code** — when implementation, testing, exports, imports, scripts, or data validation require them.

## Apartment Life task framework

For every delegated task, use this structure.

### Links

Capture relevant links/IDs:

- Asana task
- HubSpot ticket/CRM record
- workflow
- Notion or SharePoint documentation
- code/repository/file
- other evidence

### Start here

Determine:

- Who is trying to do what?
- Why are they trying to do it?
- What business result is expected?

### What are we solving for?

State the actual requested outcome in plain language.

### Data / Systems

Identify relevant:

- systems
- objects
- fields
- internal property names
- workflows
- associations
- records
- integrations

### What should have happened?

Determine the documented or best-supported expected behavior.

Use TRAC where useful:

- **Trigger**
- **Results / outcomes**
- **Activities / major milestones**
- **Change / variations**

### What actually happened?

Use live evidence whenever possible.

Do not invent missing facts.

### Compare expected vs. actual

Identify the first supported breakpoint, discrepancy, unmet condition, or open question.

Separate:

- confirmed evidence
- likely causes
- unknowns

### Solution

Perform authorized work when technically supported.

Do not stop at diagnosis when the requested implementation can be completed safely.

### Testing

Test against the actual business outcome.

A successful command, API response, script run, or tool call is not sufficient proof.

### Resolution

Only mark the work resolved when the delegated outcome is actually complete.

### Task communication

Update the existing Asana task concisely with:

- what was found
- what changed
- verification
- remaining blocker or next action

### Documentation / Learnings

Capture reusable process knowledge when appropriate.

## Source hierarchy

When sources conflict, use this default order:

1. Current live system state for factual record values.
2. Latest explicit Asana/task requirement from the responsible stakeholder.
3. Current documented Apartment Life process.
4. Meeting notes or historical context.
5. Inference, clearly labeled, and never used alone for risky writes.

Do not silently choose between conflicting authoritative sources.

## Verification states

Every important outcome must resolve to one of:

- **PASS** — directly verified against acceptance criteria.
- **FAIL** — verified result contradicts the criteria.
- **UNKNOWN** — evidence is incomplete.
- **BLOCKED** — required dependency, permission, or tool is unavailable.

Never treat:

- failed search as “does not exist”
- partial retrieval as complete coverage
- API success as business success
- code written as code deployed
- workflow updated as regression-tested
- ticket closed as root cause fixed
- missing permissions as missing data

Handle pagination before claiming full coverage.

After writes, perform a read-back whenever supported.

After an ambiguous timeout/write result, reread the target before retrying to avoid duplicate changes.

## Autonomy and write policy

Default posture:

- read broadly enough to finish the explicitly delegated task;
- write narrowly;
- prefer reversible/scoped changes;
- preserve production approval gates until a class of actions has been tested;
- never broaden scope because another issue was discovered.

Initially require approval for:

- HubSpot production record corrections unless specifically delegated
- workflow edits/releases
- custom code releases
- imports
- bulk updates
- merges
- deletions
- owner changes
- marketing/consent/subscription changes
- association removals
- external email
- production incident/ticket closure
- other destructive or difficult-to-reverse changes

The agent may perform safe read-only investigation without additional approval.

## Asana rules

Asana is the durable work record.

The agent must be able to:

- open a task by URL/GID
- read description
- read relevant comments
- read parent/subtask relationships
- identify latest requirement changes
- add a concise comment when authorized
- update the existing task rather than create duplicate follow-up work
- update completion state only when the delegated unit of work is genuinely complete
- reread after writes

Do not automatically ingest the entire assigned queue in V1.

V1 works only on explicitly delegated tasks.

## HubSpot rules

HubSpot is a **required dependency**.

Before a HubSpot write:

1. Identify exact object and record.
2. Read current value/state.
3. Identify evidence supporting the proposed change.
4. Preview the exact change.
5. Obtain approval when required.

After a write:

1. Reread the changed record.
2. Verify the exact property/association.
3. Verify meaningful downstream state when relevant.
4. Record before/after evidence in the Asana task.

Never infer a CRM value simply to make a record complete.

## HubSpot MCP implementation

Inspect the available HubSpot MCP/API configuration and choose the smallest secure implementation that gives Codex the required capability.

If using MCP:

- configure it through Codex-supported MCP configuration;
- keep credentials out of version control;
- use OAuth or environment-backed credentials where appropriate;
- document exact setup steps;
- verify the connection independently before building task logic around it.

If using the API directly:

- use least-privilege scopes;
- keep tokens/secrets outside the repository;
- create a narrow tool/interface layer rather than scattering raw API calls across the agent;
- implement retries only where safe;
- distinguish read failures from empty results.

Do not require ChatGPT Workspace Developer Mode.

## Notion / SharePoint

The agent should use current connected access where available.

Notion and SharePoint are context/evidence systems, not the work-of-record for technical tasks unless explicitly directed otherwise.

When a document source is partial or inaccessible, mark that evidence as incomplete rather than filling gaps by inference.

## Technical/code tasks

When a task requires code or workflow implementation, Codex may implement it directly if:

- the relevant project/repository/files are available;
- the requested scope is clear;
- the action is within authorization.

For code/workflow bugs, follow:

1. Business outcome
2. Trigger
3. Expected outcome
4. Actual outcome
5. Relevant workflow/action/code
6. Confirmed breakpoint
7. Change specification
8. Edge cases
9. Test matrix
10. Release boundary
11. Post-release verification

Preserve unaffected logic.

Do not claim implementation complete until the target environment has actually changed and the result has been verified.

## Idempotency / duplicate prevention

For every action capable of creating/updating external state:

- use stable task/record IDs;
- reread before retrying ambiguous writes;
- avoid duplicate comments/tasks/records;
- keep a simple execution receipt/log when useful;
- ensure running the same delegated task twice does not repeat already-completed actions.

## Required project artifacts

Create or update the project with:

### `AGENTS.md`

Durable instructions for AL Task Delivery, containing:

- purpose
- source hierarchy
- task framework
- verification rules
- write boundaries
- task completion rules
- tool usage expectations
- concise communication style

### Agent skill/plugin files

Package the existing AL Task Delivery skill for Codex using the current supported skill/plugin format where appropriate.

Do not materially alter the skill's operating rules without documenting why.

### MCP configuration

Configure:

- HubSpot — REQUIRED
- Asana — REQUIRED for end-to-end use
- Notion — preferred
- any other source only when materially useful

Keep secrets outside version control.

### Tests / acceptance checklist

Create a small repeatable acceptance suite.

## Acceptance tests

### 1. Asana read

Given a known Asana task:

- retrieve it
- read description
- read latest comments
- identify parent/subtasks
- report coverage honestly

Expected: PASS.

### 2. HubSpot identity/access

Connect to the intended Apartment Life HubSpot account.

Verify account/portal identity before writes.

Expected: PASS.

### 3. HubSpot known-record read

Using one known safe record:

- retrieve by ID
- read specified properties
- read useful associations
- return evidence

Expected: PASS.

### 4. Cross-system task

Given one Asana task that references HubSpot:

- understand the requested outcome
- retrieve the linked HubSpot evidence
- compare expected vs. actual
- produce the exact proposed action

Expected: PASS without writing.

### 5. Approved low-risk write

After explicit approval:

- perform one scoped HubSpot or Asana test write
- read the target back
- verify the change
- record the result

Expected: PASS.

### 6. Duplicate-prevention test

Run the same task/action twice.

Expected:

- second run recognizes completed state
- no duplicate comment/task/record/change

### 7. Failure-mode test

Simulate or encounter:

- permission failure
- unavailable record
- partial search
- timeout/tool error

Expected:

- returns UNKNOWN/BLOCKED appropriately
- does not claim absence or completion

## First live pilot

Do not process the entire Asana queue.

Run one low-risk, explicitly selected real task.

Preferred first pilot classes:

1. research/audit with HubSpot evidence;
2. process/documentation task spanning Asana + HubSpot + Notion;
3. simple low-risk CRM correction with explicit approval.

For the pilot:

1. Read full available task context.
2. Identify business outcome.
3. Determine expected behavior.
4. Determine actual behavior.
5. Define completion criteria.
6. Gather HubSpot/Notion/SharePoint evidence.
7. Perform authorized work.
8. Verify independently.
9. Update the existing Asana task.
10. Assign PASS / FAIL / UNKNOWN / BLOCKED.
11. Complete only if the delegated outcome is actually complete.

## Definition of done for the Codex implementation

The Codex implementation is ready for pilot use only when:

- the AL Task Delivery instructions are loaded durably;
- the skill/plugin is installed or available to Codex;
- Asana connectivity is working for the required task operations;
- **HubSpot connectivity is working**;
- HubSpot account identity has been verified;
- one known HubSpot record can be retrieved;
- relevant HubSpot associations/properties can be read;
- one cross-system Asana + HubSpot dry run passes;
- one approved low-risk write can be performed and read back, if writes are intended for V1;
- duplicate prevention has been tested;
- missing evidence/tool failures produce UNKNOWN/BLOCKED rather than fabricated conclusions;
- setup/documentation is sufficient to reproduce the environment.

## Non-goals for V1

Do not build:

- a large multi-agent hierarchy
- broad unattended processing of all assigned Asana work
- autonomous merges/deletions/bulk CRM updates
- unrestricted production workflow releases
- a replacement CRM
- a new orchestration framework unless a concrete runtime limitation proves one is needed

V1 is one reliable **AL Task Delivery Agent** with the tools required to complete a manually delegated task end-to-end.

## Final implementation report

When finished, return:

### Build
- files created/modified
- runtime used
- model/reasoning setting
- skill/plugin status

### Connections
For each:
- Asana
- HubSpot
- Notion
- SharePoint/other

Report:
- connection method
- read tested
- write tested
- limitations

### Acceptance tests
For every test:
- PASS / FAIL / UNKNOWN / BLOCKED
- evidence

### Pilot readiness
State one:

- **READY FOR PILOT**
- **PARTIALLY READY**
- **BLOCKED**

### Remaining blockers
Only include real blockers discovered during implementation.

Do not claim readiness if HubSpot has not passed its required connection and known-record read tests.
