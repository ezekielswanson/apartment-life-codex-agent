# HubSpot Agent CLI Setup - Apartment Life

This client workspace is prepared for HubSpot Agent CLI work with Codex.

## Client Workspace

Path:

```text
/Users/zeke/Desktop/projects/client_projects/Apartment Life
```

## Portal Verification

HubSpot CLI authentication is machine/user-level, not folder-level. Before any Apartment Life work, confirm the active portal:

```sh
/Users/zeke/.hubspot/bin/hubspot whoami
```

Expected portal/account ID:

```text
TBD - confirm per Apartment Life task before work begins
```

If the active portal is wrong, switch portals:

```sh
/Users/zeke/.hubspot/bin/hubspot auth logout
/Users/zeke/.hubspot/bin/hubspot auth login url
/Users/zeke/.hubspot/bin/hubspot auth login exchange --code <code>
/Users/zeke/.hubspot/bin/hubspot whoami
```

## Safety Rules

- Start with read-only inspection, reporting, summaries, audits, and validation.
- Do not create, update, merge, delete, or associate CRM records without explicit approval.
- Use `--dry-run` where available before applying changes.
- Before any write, show this table:

| Object Type | ID | Property / Action | Current Value | Proposed Value |
|---|---:|---|---|---|

- Keep batch changes small and reviewable.
- Prefer native HubSpot configuration before custom code.
- Confirm the central business object before recommending properties, associations, workflows, reports, or custom objects.
- For integrations, confirm source of truth, sync direction, unique identifiers, failure handling, and retry behavior.

## Read-Only Starter Checks

```sh
/Users/zeke/.hubspot/bin/hubspot whoami
/Users/zeke/.hubspot/bin/hubspot objects types
```

Use the first command to confirm the portal and the second only after portal identity is correct.
