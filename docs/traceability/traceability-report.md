# Traceability Report

Generated: 2026-05-06T06:25:26.521Z

## Baseline Source

- Source file: `docs/out-001-bmad-prepared-framing-handoff.json`
- Approval: approved, version 43
- Outcome: OUT-001

## Implemented According To Baseline

- OUT-001 local-first private cost control foundation.
- JNY-001 first control view from empty state to wallet, payer, recurring expense and timeline.
- EP-001 wallet onboarding, active wallet and first payer.
- EP-002 recurring expense capture for amount, period, category, payer, provider, note and notice fields.
- US-012 recurring expense edit preserves the existing expense identity and updates timeline-impacting fields.
- US-014 recurring expense delete removes the selected expense from the wallet.
- EP-003 timeline/overview, search/filter and month totals.
- EP-004 thin cancellation window calculation: notice period, earliest free month and locked months.
- EP-007 signal classification foundation for review, unnecessary, worth-it and business signals.
- EP-005 register foundation for people, categories and providers.
- US-004, US-005 and US-006 wallet settings, duplication and deletion.
- US-036, US-037, US-038, US-039, US-040 and US-041 register foundation.
- EP-006 manual purchase foundation.
- US-043, US-044, US-049, US-050, US-052 and US-063 manual purchase workflows.
- EP-008 statistics and decision support foundation.
- US-065, US-066, US-067, US-068, US-069, US-070, US-071, US-072, US-074 and US-075 first statistics view.
- EP-009 local data export/import foundation.
- US-077, US-079, US-082, US-083 and US-084 local JSON/datafile flows.
- US-078 ZIP export creates a local backup archive containing JSON and CSV files.
- US-080 CSV export for purchases and recurring expenses.
- US-081 printable report flow opens a local report suitable for browser print-to-PDF.
- US-045 imports CSV plus MasterCard XLSX/PDF statement specifications into purchase rows.
- US-046 and US-047 import preview and deduplication for CSV.
- US-046 and US-047 preview MasterCard imports with new, duplicate and ignored-recurring row statuses.
- US-085 and US-086 experimental local sync configuration and conflict detection are implemented without network transfer.
- EP-011 scenario simulation foundation.
- US-094, US-095 and US-096 simulate removal and reset without mutating saved data.
- US-033 and US-034 cancellation reminders and local ICS export.
- US-058, US-097 and US-098 product settings for business label, purchases module and plan flag without real paywall.
- US-060, US-061 and US-062 purchase/recurring conversion workflows.
- US-011 draft recurring expense save.
- US-019 local expense attachments.
- US-042 and US-051 merchant/category rules and same-merchant category reuse.
- US-055 recurring signal on purchases.
- US-073 purchase radar.
- US-009, US-010, US-018, US-021, US-023, US-024, US-027, US-028, US-048, US-088, US-093 and US-100 mapped to existing period, notes, responsive, filter, drawer, import/mobile, help, signal-design and local-clear behavior.
- US-013 recurring expense ending stores an end month and stops later timeline impact.
- US-035 missing cancellation information is surfaced as an improvement candidate in the rail and drawer.
- US-025 signal filter now has user-settable recurring-expense signals.
- US-053, US-054, US-056, US-057 and US-059 are implemented for recurring expenses.
- EP-008 recurring analysis: current monthly total and annual run rate.
- EP-010 responsive shell, modal, drawer and empty states.
- US-076 localStorage persistence without account, server or bank connection.
- US-099 local data risk surfaced in the UI.

## Implemented Through Decision

- DEC-001 limits the first slice to the control-plane foundation.
- DEC-002 continues with edit/delete and storage hardening inside baseline scope.
- DEC-003 continues with ending recurring expenses and missing cancellation-info treatment inside baseline scope.
- DEC-004 continues with recurring-expense signal classification inside baseline scope.
- DEC-005 continues with wallet management and reusable registers inside baseline scope.
- DEC-006 continues with manual purchase capture, editing and listing inside baseline scope.
- DEC-007 continues with statistics and decision insight inside baseline scope.
- DEC-008 continues with local JSON export/import and datafile handoff inside baseline scope.
- DEC-009 continues with CSV purchase import preview and deduplication inside baseline scope.
- DEC-010 continues with scenario simulation inside baseline scope.
- DEC-011 continues with CSV export inside baseline scope.
- DEC-012 continues with reminders and ICS export inside baseline scope.
- DEC-013 continues with product administration flags inside baseline scope.
- DEC-014 continues with purchase and recurring conversion inside baseline scope.
- DEC-015 closes ground gaps for drafts, attachments, merchant rules, purchase signals and purchase radar inside baseline scope.
- DEC-016 closes export, report, datafile reconnect and experimental sync-conflict gaps inside local-first scope.
- DEC-017 closes MasterCard XLSX/PDF statement import with duplicate and recurring-cost ignore handling.
- TECH-001 uses a static dependency-free local-first browser app with modular JavaScript domain logic.

## Extra Implemented Through Extension

None.

## Deferred Or Not Implemented In This Slice

- Bank integration.
- Real cloud sync transport. The implemented sync area is local configuration plus conflict detection only.
- Native binary PDF generation. The implemented report uses browser print-to-PDF.

## Scope-Out Touched

None. No account, server, hosted backend, bank connection, automatic invoice scanning, automatic supplier cancellation, full CRM, advanced calendar planning, marketing landing page, real paywall or multi-year forecasting was implemented.

## Verification Evidence

- `npm test`: 41 passing domain, storage and MasterCard import tests.
- `GET http://localhost:5174/`: HTTP 200.

## Known Gaps

- UI behavior has not yet been covered by automated browser tests.
- MasterCard PDF parsing is tuned for the provided statement structure and may need extension for materially different issuer layouts.
- Real cloud sync requires additional provider decisions before safe implementation.
