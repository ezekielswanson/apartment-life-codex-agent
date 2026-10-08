# Apartment Life Working Context

## Business/process frame
Apartment Life matches apartment communities with coordinators and supports the lifecycle from Growth through hiring, launch, excellent-program operation, and transition.

High-level lifecycle:
Growth -> Hiring / Talent Acquisition -> Remarkable Initial Experience -> Excellent Programs -> Program Transition.

Growth commonly progresses through prospecting/identify -> qualifying -> presenting -> confirming/expectations -> matching.

A Program is the combination of the community/client side and coordinator side, with product, program type, service elements, timing, pricing, expectations, hiring/matching, and operational reporting all affecting downstream systems.

## Systems

### HubSpot
Primary CRM and a major integration/orchestration surface. Common objects include contacts, companies, deals, tickets, tasks, jobs, communities, and other custom objects. Workflows/custom code often connect HubSpot to Greenhouse, Matrix, Asana, Qwilr, Mapsly, SiteStacker, and other systems.

### Asana
Primary technical work queue and task communication record. Do not confuse a closed HubSpot helpdesk ticket with completion of an associated engineering/process Asana task.

### Notion / SharePoint / LiferHub
Notion contains working analysis, meeting context, process discovery, task notes, and reusable frameworks. Formal/current business-process documentation may reside in SharePoint/LiferHub. Treat unavailable documentation as a gap, not permission to invent rules.

### Matrix
Program-management and reporting platform; can be more authoritative than HubSpot for some program data. Legacy SLX/SQL dependencies can create synchronization issues.

### Greenhouse
Hiring/candidate/job system. SyncMatters connects HubSpot and Greenhouse. Known bug classes have included job office mapping, state/city normalization, job creation, and offered/hired synchronization.

### Mapsly
Geographic/recruiting context and related HubSpot data use.

### Qwilr
Proposal/agreement presentation layer linked to HubSpot processes.

### SiteStacker
Donation/supporter-related operational work; imports and identifier reconciliation require careful verification.

## Reusable principles
- Documents are evidence; understanding the business process is the deliverable.
- Ask: What is trying to happen? Why? Who acts? What determines next steps? What information is needed? Which systems support it? What observable result proves success?
- Process understanding: business result -> process boundary -> as-is -> handoffs -> decisions -> supporting systems.
- One new issue found during a task does not automatically expand the task scope.
- Preserve historical context and direct links/IDs when possible.
