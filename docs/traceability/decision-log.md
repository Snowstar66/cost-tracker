# Decision Log

## DEC-001 - First implementation slice

- Date: 2026-05-05
- Type: refines_baseline
- Source baseline IDs: OUT-001, EP-001, US-001, US-002, US-003, US-004, US-007, US-008, US-015, US-016, US-017, US-020, US-022, US-026, US-029, US-030, US-031, US-032, US-064, US-076, US-087, US-089, US-090, US-091, US-092, US-099
- Source journey IDs: JNY-001
- Decision: Start implementation with a local-first vertical slice for wallet onboarding, first payer, recurring expenses, timeline/overview, search/filter, local data warning and responsive shell.
- Motivation: This creates the smallest useful control-plane foundation while preserving traceability and avoiding account, bank, hosted backend or advanced import scope.
- Human approval status: Implicitly requested by user instruction to start implementation from approved handoff.
- Customer decision status: Not required for this low-risk refinement inside baseline.
- Implementation status: Implemented in first slice
- Affected artifacts: package.json, src/*, tests/*, docs/traceability/*

## TECH-001 - Static local-first web app foundation

- Date: 2026-05-05
- Type: technical_enabler
- Source baseline IDs: OUT-001, US-076, US-087, US-092, US-099
- Decision: Use a no-backend browser application with localStorage persistence, modular JavaScript domain logic, static HTML/CSS, and Node-based tests for calculations.
- Motivation: Matches local-first constraint and avoids server/account/bank integration while allowing fast implementation in an empty repository.
- Human approval status: Not required, technical enabler inside baseline constraints.
- Customer decision status: Not required.
- Implementation status: Implemented in first slice
- Affected artifacts: package.json, index.html, src/app.js, src/domain.js, src/storage.js, src/styles.css, tests/domain.test.js


## DEC-002 - Edit and delete recurring expenses

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-012, US-014, US-076
- Source journey IDs: JNY-001
- Decision: Continue implementation with editing and deleting recurring expenses, plus storage adapter tests.
- Motivation: The first control-plane slice becomes practically correctable without touching import, sync, bank, account or other scope-out items.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in second slice
- Affected artifacts: src/app.js, src/domain.js, src/storage.js, tests/domain.test.js, tests/storage.test.js, docs/traceability/*


## DEC-003 - End recurring expenses and surface missing notice information

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-013, US-035, US-020, US-032
- Source journey IDs: JNY-002
- Decision: Add an end action for recurring expenses and mark missing cancellation information in the decision rail and drawer.
- Motivation: Users need to distinguish active cost impact from ended cost history and see weak cancellation data before making savings decisions.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in third slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*


## DEC-004 - Signal classification for recurring expenses

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-025, US-053, US-054, US-056, US-057, US-059
- Source journey IDs: JNY-001
- Decision: Add recurring-expense signal chips and signal summary for Granska, Onödigt, Värt det and Business.
- Motivation: The existing signal filter needed a user-facing way to classify expenses, and the toggle behavior is explicitly covered by the baseline.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in fourth slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*


## DEC-005 - Wallet management and reusable registers

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-003, US-004, US-005, US-006, US-036, US-037, US-038, US-039, US-040, US-041
- Source journey IDs: JNY-001
- Decision: Add Data and Register views for active wallet management, wallet duplication/deletion, people, categories and providers.
- Motivation: Later recurring, purchase, filtering and cancellation workflows require durable local registers and safe wallet data separation.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in fifth slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*


## DEC-006 - Manual purchase workflow

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-043, US-044, US-049, US-050, US-052, US-063
- Source journey IDs: JNY-003
- Decision: Add manual purchase capture, editing, listing and filtering with payer, category, provider and transaction type.
- Motivation: Purchase data is a core part of OUT-001 and should exist before import and advanced purchase intelligence.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in sixth slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*


## DEC-007 - Statistics and decision support

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-065, US-066, US-067, US-068, US-069, US-070, US-071, US-072, US-074, US-075
- Source journey IDs: JNY-004
- Decision: Add first statistics view with recurring vs purchase comparison, merchant/category/provider rankings, monthly purchase trends and budget outcome.
- Motivation: OUT-001 requires private users to understand spending impact over time and identify decision candidates.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in seventh slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*


## DEC-008 - Local JSON export import and datafile handoff

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-077, US-079, US-082, US-084
- Source journey IDs: JNY-006
- Decision: Add local JSON export, active wallet datafile export and JSON import as new wallet data.
- Motivation: Local-first data needs recoverability and handoff before broader sync/import features.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in eighth slice
- Affected artifacts: src/app.js, src/storage.js, src/styles.css, tests/storage.test.js, docs/traceability/*


## DEC-009 - CSV purchase import preview and deduplication

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-045, US-046, US-047
- Source journey IDs: JNY-003
- Decision: Implement CSV purchase import with preview and duplicate detection. XLSX and PDF were remaining gaps at this point and are later closed by DEC-017.
- Motivation: CSV can be delivered local-first without external parsers and validates the import flow before heavier file formats.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in ninth slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*


## DEC-010 - Scenario simulation

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-094, US-095, US-096
- Source journey IDs: JNY-002
- Decision: Add non-mutating simulation for removing recurring expenses from overview and statistics with visible reset.
- Motivation: Users need to understand potential savings without accidentally editing real local data.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in tenth slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*


## DEC-011 - CSV export

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-080
- Source journey IDs: JNY-006
- Decision: Add CSV export for purchases and recurring expenses.
- Motivation: Local-first users need simple portable exports in addition to JSON/datafile backup.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in eleventh slice
- Affected artifacts: src/app.js, src/storage.js, tests/storage.test.js, docs/traceability/*


## DEC-012 - Reminders and ICS export

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-033, US-034
- Source journey IDs: JNY-002
- Decision: Add local cancellation reminders and .ics export.
- Motivation: Users need a local reminder handoff without automatic supplier cancellation or advanced calendar planning.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in twelfth slice
- Affected artifacts: src/app.js, src/domain.js, tests/domain.test.js, docs/traceability/*


## DEC-013 - Product administration flags

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-058, US-097, US-098
- Source journey IDs: JNY-006
- Decision: Add local product settings for purchases module on/off, free/premium flag and business signal label.
- Motivation: The baseline calls for plan flags and module switches but excludes a real paywall.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in thirteenth slice
- Affected artifacts: src/app.js, src/domain.js, tests/domain.test.js, docs/traceability/*


## DEC-014 - Purchase and recurring conversion

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-060, US-061, US-062
- Source journey IDs: JNY-003
- Decision: Add conversion from purchase to recurring expense and recurring expense to single purchase while preserving source links.
- Motivation: Users need to reclassify discovered patterns without re-entering data.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in fourteenth slice
- Affected artifacts: src/app.js, src/domain.js, tests/domain.test.js, docs/traceability/*


## DEC-015 - Drafts attachments merchant rules and purchase radar

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-011, US-019, US-042, US-051, US-055, US-073
- Source journey IDs: JNY-001, JNY-003
- Decision: Add draft recurring expense saving, local attachment metadata/data, merchant category rules, purchase recurring signal and purchase radar.
- Motivation: These close important usability and classification gaps without external services or scope-out behavior.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in fifteenth slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*


## DEC-016 - Export report reconnect and experimental sync

- Date: 2026-05-05
- Type: implements_baseline
- Source baseline IDs: US-078, US-081, US-083, US-085, US-086
- Source journey IDs: JNY-006
- Decision: Add local ZIP export, printable report export, full-state datafile reconnect, experimental sync settings and conflict detection without network transfer.
- Motivation: These close the remaining local-first data portability and sync-preparation stories while respecting the no-server/no-account/no-bank constraint.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Required later only for real cloud transport/provider choice.
- Implementation status: Implemented in sixteenth slice
- Affected artifacts: src/app.js, src/domain.js, src/storage.js, tests/domain.test.js, tests/storage.test.js, docs/traceability/*


## DEC-017 - MasterCard statement import

- Date: 2026-05-06
- Type: implements_baseline
- Source baseline IDs: US-045, US-046, US-047, US-063
- Source journey IDs: JNY-003
- Decision: Add Data-view import for MasterCard Excel and PDF statement specifications, with preview rows marked as new, duplicate, or ignored when matching an existing recurring expense.
- Motivation: The baseline requires CSV/XLSX/PDF purchase import, and the provided MasterCard samples give enough structure to implement local parsing without external services.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in seventeenth slice
- Affected artifacts: src/app.js, src/domain.js, src/mastercard-import.js, src/styles.css, tests/domain.test.js, tests/mastercard-import.test.js, docs/traceability/*
