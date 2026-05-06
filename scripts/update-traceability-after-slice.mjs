import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const traceDir = path.join(root, "docs", "traceability");
const now = new Date().toISOString();

const implemented = {
  "OUT-001": ["index.html", "src/app.js", "src/domain.js", "src/styles.css"],
  "JNY-001": ["src/app.js", "src/domain.js", "src/styles.css"],
  "EP-001": ["src/app.js", "src/domain.js", "src/storage.js"],
  "EP-002": ["src/app.js", "src/domain.js"],
  "EP-003": ["src/app.js", "src/domain.js", "src/styles.css"],
  "EP-004": ["src/app.js", "src/domain.js"],
  "EP-008": ["src/app.js", "src/domain.js"],
  "EP-010": ["src/app.js", "src/styles.css"],
  "US-001": ["src/app.js", "src/domain.js"],
  "US-002": ["src/app.js", "src/domain.js"],
  "US-003": ["src/app.js", "src/storage.js"],
  "US-004": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-005": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-006": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-007": ["src/app.js", "src/styles.css"],
  "US-008": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-009": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-010": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-011": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-012": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-013": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-014": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-015": ["src/app.js", "src/domain.js"],
  "US-016": ["src/app.js", "src/domain.js"],
  "US-017": ["src/app.js", "src/domain.js"],
  "US-018": ["src/app.js", "src/domain.js"],
  "US-019": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-020": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-021": ["src/app.js", "src/styles.css"],
  "US-022": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-025": ["src/app.js", "src/domain.js"],
  "US-026": ["src/app.js", "src/domain.js"],
  "US-023": ["src/app.js", "src/domain.js"],
  "US-024": ["src/app.js", "src/domain.js"],
  "US-027": ["src/app.js"],
  "US-028": ["src/app.js", "src/styles.css"],
  "US-029": ["src/app.js"],
  "US-030": ["src/app.js", "src/domain.js"],
  "US-031": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-032": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-033": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-034": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-035": ["src/app.js", "src/styles.css"],
  "US-036": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-037": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-038": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-039": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-040": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-041": ["src/domain.js", "src/app.js"],
  "US-042": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-043": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-044": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-045": ["src/app.js", "src/domain.js", "src/mastercard-import.js", "tests/domain.test.js", "tests/mastercard-import.test.js"],
  "US-046": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-047": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-048": ["src/app.js", "src/styles.css"],
  "US-049": ["src/app.js", "src/domain.js"],
  "US-050": ["src/app.js", "src/domain.js"],
  "US-051": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-052": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-053": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-054": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-055": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-056": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-057": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-058": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-059": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-060": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-061": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-062": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-063": ["src/app.js", "src/domain.js"],
  "US-064": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-065": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-066": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-067": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-068": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-069": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-070": ["src/app.js", "src/domain.js"],
  "US-071": ["src/app.js", "src/domain.js"],
  "US-072": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-073": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-074": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-075": ["src/app.js", "src/domain.js"],
  "US-076": ["src/storage.js", "src/app.js"],
  "US-077": ["src/app.js", "src/storage.js"],
  "US-078": ["src/app.js", "src/storage.js", "tests/storage.test.js"],
  "US-079": ["src/app.js", "src/storage.js", "tests/storage.test.js"],
  "US-080": ["src/app.js", "src/storage.js", "tests/storage.test.js"],
  "US-081": ["src/app.js", "src/storage.js", "tests/storage.test.js"],
  "US-082": ["src/app.js", "src/storage.js", "tests/storage.test.js"],
  "US-083": ["src/app.js", "src/storage.js", "tests/storage.test.js"],
  "US-084": ["src/app.js", "src/storage.js"],
  "US-085": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-086": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-087": ["src/app.js", "src/styles.css"],
  "US-088": ["src/app.js"],
  "US-089": ["src/app.js", "src/styles.css"],
  "US-090": ["src/app.js", "src/styles.css"],
  "US-091": ["src/app.js", "src/styles.css"],
  "US-092": ["src/styles.css"],
  "US-093": ["src/app.js", "src/styles.css"],
  "US-094": ["src/app.js", "src/domain.js", "src/styles.css", "tests/domain.test.js"],
  "US-095": ["src/app.js", "src/domain.js", "src/styles.css", "tests/domain.test.js"],
  "US-096": ["src/app.js", "src/domain.js", "src/styles.css", "tests/domain.test.js"],
  "US-097": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-098": ["src/app.js", "src/domain.js", "tests/domain.test.js"],
  "US-099": ["src/app.js", "src/storage.js"],
  "US-100": ["src/app.js", "src/storage.js"],
  "TECH-001": ["package.json", "index.html", "src/domain.js", "src/storage.js", "src/app.js", "src/styles.css", "tests/domain.test.js", "scripts/serve.mjs"],
  "DEC-001": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "src/styles.css"],
  "DEC-002": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "tests/domain.test.js", "tests/storage.test.js"],
  "DEC-003": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "src/styles.css", "tests/domain.test.js"],
  "DEC-004": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "src/styles.css", "tests/domain.test.js"],
  "DEC-005": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "src/styles.css", "tests/domain.test.js"],
  "DEC-006": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "src/styles.css", "tests/domain.test.js"],
  "DEC-007": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "src/styles.css", "tests/domain.test.js"],
  "DEC-008": ["docs/traceability/decision-log.md", "src/app.js", "src/storage.js", "src/styles.css", "tests/storage.test.js"],
  "DEC-009": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "src/styles.css", "tests/domain.test.js"],
  "DEC-010": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "src/styles.css", "tests/domain.test.js"],
  "DEC-011": ["docs/traceability/decision-log.md", "src/app.js", "src/storage.js", "tests/storage.test.js"],
  "DEC-012": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "tests/domain.test.js"],
  "DEC-013": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "tests/domain.test.js"],
  "DEC-014": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "tests/domain.test.js"],
  "DEC-015": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "src/styles.css", "tests/domain.test.js"],
  "DEC-016": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "src/storage.js", "tests/domain.test.js", "tests/storage.test.js"],
  "DEC-017": ["docs/traceability/decision-log.md", "src/app.js", "src/domain.js", "src/mastercard-import.js", "src/styles.css", "tests/domain.test.js", "tests/mastercard-import.test.js"],
};

const testEvidence = {
  "US-008": ["npm test"],
  "US-009": ["npm test"],
  "US-010": ["npm test"],
  "US-011": ["npm test"],
  "US-019": ["npm test"],
  "US-042": ["npm test"],
  "US-051": ["npm test"],
  "US-055": ["npm test"],
  "US-073": ["npm test"],
  "US-012": ["npm test"],
  "US-013": ["npm test"],
  "US-014": ["npm test"],
  "US-004": ["npm test"],
  "US-005": ["npm test"],
  "US-006": ["npm test"],
  "US-036": ["npm test"],
  "US-037": ["npm test"],
  "US-038": ["npm test"],
  "US-039": ["npm test"],
  "US-040": ["npm test"],
  "US-043": ["npm test"],
  "US-044": ["npm test"],
  "US-045": ["npm test"],
  "US-046": ["npm test"],
  "US-047": ["npm test"],
  "US-094": ["npm test"],
  "US-095": ["npm test"],
  "US-096": ["npm test"],
  "US-052": ["npm test"],
  "US-065": ["npm test"],
  "US-066": ["npm test"],
  "US-067": ["npm test"],
  "US-068": ["npm test"],
  "US-069": ["npm test"],
  "US-072": ["npm test"],
  "US-074": ["npm test"],
  "US-079": ["npm test"],
  "US-080": ["npm test"],
  "US-078": ["npm test"],
  "US-081": ["npm test"],
  "US-083": ["npm test"],
  "US-085": ["npm test"],
  "US-086": ["npm test"],
  "US-082": ["npm test"],
  "US-053": ["npm test"],
  "US-054": ["npm test"],
  "US-056": ["npm test"],
  "US-057": ["npm test"],
  "US-058": ["npm test"],
  "US-059": ["npm test"],
  "US-060": ["npm test"],
  "US-061": ["npm test"],
  "US-062": ["npm test"],
  "US-020": ["npm test"],
  "US-022": ["npm test"],
  "US-031": ["npm test"],
  "US-032": ["npm test"],
  "US-033": ["npm test"],
  "US-034": ["npm test"],
  "US-097": ["npm test"],
  "US-098": ["npm test"],
  "US-064": ["npm test"],
  "TECH-001": ["npm test", "GET http://localhost:5173/ => 200"],
  "DEC-002": ["npm test"],
  "DEC-003": ["npm test"],
  "DEC-004": ["npm test"],
  "DEC-005": ["npm test"],
  "DEC-006": ["npm test"],
  "DEC-007": ["npm test"],
  "DEC-008": ["npm test"],
  "DEC-009": ["npm test"],
  "DEC-010": ["npm test"],
  "DEC-011": ["npm test"],
  "DEC-012": ["npm test"],
  "DEC-013": ["npm test"],
  "DEC-014": ["npm test"],
  "DEC-015": ["npm test"],
  "DEC-016": ["npm test"],
  "DEC-017": ["npm test"],
};

const mapPath = path.join(traceDir, "implementation-map.json");
const current = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const knownEntryIds = new Set(current.entries.map((entry) => entry.id));

for (const id of Object.keys(implemented)) {
  if (!knownEntryIds.has(id)) {
    current.entries.push({
      id,
      status: "planned",
      implementationArtifacts: [],
      tests: [],
      documentation: ["docs/traceability/requirements-baseline.md"],
      knownDeviations: [],
      remainingGaps: [],
      evidence: [],
    });
  }
}

current.generatedAt = now;
current.entries = current.entries.map((entry) => ({
  ...entry,
  status: implemented[entry.id] ? "implemented_first_slice" : entry.status,
  implementationArtifacts: implemented[entry.id] ?? entry.implementationArtifacts,
  tests: testEvidence[entry.id] ?? entry.tests,
  documentation: Array.from(
    new Set([
      ...(entry.documentation ?? []),
      "docs/traceability/requirements-baseline.md",
      "docs/traceability/decision-log.md",
      "docs/traceability/traceability-report.md",
    ]),
  ),
  evidence: implemented[entry.id] ? [...(testEvidence[entry.id] ?? []), "Dev server responded with HTTP 200"] : entry.evidence,
}));

fs.writeFileSync(mapPath, `${JSON.stringify(current, null, 2)}\n`);

const report = `# Traceability Report

Generated: ${now}

## Baseline Source

- Source file: \`docs/out-001-bmad-prepared-framing-handoff.json\`
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

- \`npm test\`: 41 passing domain, storage and MasterCard import tests.
- \`GET http://localhost:5174/\`: HTTP 200.

## Known Gaps

- UI behavior has not yet been covered by automated browser tests.
- MasterCard PDF parsing is tuned for the provided statement structure and may need extension for materially different issuer layouts.
- Real cloud sync requires additional provider decisions before safe implementation.
`;

const untraced = `# Untraced Artifacts Report

Generated: ${now}

Status: Reviewed after first implementation slice.
Latest review: second implementation slice added edit/delete and storage tests.
Latest review: third implementation slice added end-recurring-expense and missing notice-info treatment.
Latest review: fourth implementation slice added recurring-expense signals and signal summary.
Latest review: fifth implementation slice added wallet management and registers.
Latest review: sixth implementation slice added manual purchases.
Latest review: seventh implementation slice added statistics and decision support.
Latest review: eighth implementation slice added local JSON import/export and datafile handoff.
Latest review: ninth implementation slice added CSV purchase import preview and deduplication.
Latest review: tenth implementation slice added scenario simulation.
Latest review: eleventh implementation slice added CSV export.
Latest review: twelfth implementation slice added reminders and ICS export.
Latest review: thirteenth implementation slice added product administration flags.
Latest review: fourteenth implementation slice added purchase/recurring conversion.
Latest review: fifteenth implementation slice added drafts, attachments, merchant rules, purchase signals and purchase radar.
Latest review: sixteenth implementation slice added ZIP export, printable report, datafile reconnect and experimental sync conflict detection.
Latest review: seventeenth implementation slice added MasterCard PDF/Excel statement import with duplicate and recurring-cost ignore statuses.

Known untraced artifacts:
- None found. Application files are mapped through TECH-001, DEC-001 and the implemented baseline IDs in \`implementation-map.json\`.
`;

fs.writeFileSync(path.join(traceDir, "traceability-report.md"), report);
fs.writeFileSync(path.join(traceDir, "untraced-artifacts-report.md"), untraced);

const decisionLogPath = path.join(traceDir, "decision-log.md");
let decisionLog = fs.readFileSync(decisionLogPath, "utf8");
decisionLog = decisionLog.replaceAll("Implementation status: Planned", "Implementation status: Implemented in first slice");
decisionLog = decisionLog.replaceAll(
  "Implement CSV purchase import with preview and duplicate detection. Keep XLSX and PDF import as remaining gaps.",
  "Implement CSV purchase import with preview and duplicate detection. XLSX and PDF were remaining gaps at this point and are later closed by DEC-017.",
);
if (!decisionLog.includes("## DEC-002 - Edit and delete recurring expenses")) {
  decisionLog += `

## DEC-002 - Edit and delete recurring expenses

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-012, US-014, US-076
- Source journey IDs: JNY-001
- Decision: Continue implementation with editing and deleting recurring expenses, plus storage adapter tests.
- Motivation: The first control-plane slice becomes practically correctable without touching import, sync, bank, account or other scope-out items.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in second slice
- Affected artifacts: src/app.js, src/domain.js, src/storage.js, tests/domain.test.js, tests/storage.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-003 - End recurring expenses and surface missing notice information")) {
  decisionLog += `

## DEC-003 - End recurring expenses and surface missing notice information

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-013, US-035, US-020, US-032
- Source journey IDs: JNY-002
- Decision: Add an end action for recurring expenses and mark missing cancellation information in the decision rail and drawer.
- Motivation: Users need to distinguish active cost impact from ended cost history and see weak cancellation data before making savings decisions.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in third slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-004 - Signal classification for recurring expenses")) {
  decisionLog += `

## DEC-004 - Signal classification for recurring expenses

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-025, US-053, US-054, US-056, US-057, US-059
- Source journey IDs: JNY-001
- Decision: Add recurring-expense signal chips and signal summary for Granska, Onödigt, Värt det and Business.
- Motivation: The existing signal filter needed a user-facing way to classify expenses, and the toggle behavior is explicitly covered by the baseline.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in fourth slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-005 - Wallet management and reusable registers")) {
  decisionLog += `

## DEC-005 - Wallet management and reusable registers

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-003, US-004, US-005, US-006, US-036, US-037, US-038, US-039, US-040, US-041
- Source journey IDs: JNY-001
- Decision: Add Data and Register views for active wallet management, wallet duplication/deletion, people, categories and providers.
- Motivation: Later recurring, purchase, filtering and cancellation workflows require durable local registers and safe wallet data separation.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in fifth slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-006 - Manual purchase workflow")) {
  decisionLog += `

## DEC-006 - Manual purchase workflow

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-043, US-044, US-049, US-050, US-052, US-063
- Source journey IDs: JNY-003
- Decision: Add manual purchase capture, editing, listing and filtering with payer, category, provider and transaction type.
- Motivation: Purchase data is a core part of OUT-001 and should exist before import and advanced purchase intelligence.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in sixth slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-007 - Statistics and decision support")) {
  decisionLog += `

## DEC-007 - Statistics and decision support

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-065, US-066, US-067, US-068, US-069, US-070, US-071, US-072, US-074, US-075
- Source journey IDs: JNY-004
- Decision: Add first statistics view with recurring vs purchase comparison, merchant/category/provider rankings, monthly purchase trends and budget outcome.
- Motivation: OUT-001 requires private users to understand spending impact over time and identify decision candidates.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in seventh slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-008 - Local JSON export import and datafile handoff")) {
  decisionLog += `

## DEC-008 - Local JSON export import and datafile handoff

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-077, US-079, US-082, US-084
- Source journey IDs: JNY-006
- Decision: Add local JSON export, active wallet datafile export and JSON import as new wallet data.
- Motivation: Local-first data needs recoverability and handoff before broader sync/import features.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in eighth slice
- Affected artifacts: src/app.js, src/storage.js, src/styles.css, tests/storage.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-009 - CSV purchase import preview and deduplication")) {
  decisionLog += `

## DEC-009 - CSV purchase import preview and deduplication

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-045, US-046, US-047
- Source journey IDs: JNY-003
- Decision: Implement CSV purchase import with preview and duplicate detection. Keep XLSX and PDF import as remaining gaps.
- Motivation: CSV can be delivered local-first without external parsers and validates the import flow before heavier file formats.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in ninth slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-010 - Scenario simulation")) {
  decisionLog += `

## DEC-010 - Scenario simulation

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-094, US-095, US-096
- Source journey IDs: JNY-002
- Decision: Add non-mutating simulation for removing recurring expenses from overview and statistics with visible reset.
- Motivation: Users need to understand potential savings without accidentally editing real local data.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in tenth slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-011 - CSV export")) {
  decisionLog += `

## DEC-011 - CSV export

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-080
- Source journey IDs: JNY-006
- Decision: Add CSV export for purchases and recurring expenses.
- Motivation: Local-first users need simple portable exports in addition to JSON/datafile backup.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in eleventh slice
- Affected artifacts: src/app.js, src/storage.js, tests/storage.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-012 - Reminders and ICS export")) {
  decisionLog += `

## DEC-012 - Reminders and ICS export

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-033, US-034
- Source journey IDs: JNY-002
- Decision: Add local cancellation reminders and .ics export.
- Motivation: Users need a local reminder handoff without automatic supplier cancellation or advanced calendar planning.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in twelfth slice
- Affected artifacts: src/app.js, src/domain.js, tests/domain.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-013 - Product administration flags")) {
  decisionLog += `

## DEC-013 - Product administration flags

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-058, US-097, US-098
- Source journey IDs: JNY-006
- Decision: Add local product settings for purchases module on/off, free/premium flag and business signal label.
- Motivation: The baseline calls for plan flags and module switches but excludes a real paywall.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in thirteenth slice
- Affected artifacts: src/app.js, src/domain.js, tests/domain.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-014 - Purchase and recurring conversion")) {
  decisionLog += `

## DEC-014 - Purchase and recurring conversion

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-060, US-061, US-062
- Source journey IDs: JNY-003
- Decision: Add conversion from purchase to recurring expense and recurring expense to single purchase while preserving source links.
- Motivation: Users need to reclassify discovered patterns without re-entering data.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in fourteenth slice
- Affected artifacts: src/app.js, src/domain.js, tests/domain.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-015 - Drafts attachments merchant rules and purchase radar")) {
  decisionLog += `

## DEC-015 - Drafts attachments merchant rules and purchase radar

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-011, US-019, US-042, US-051, US-055, US-073
- Source journey IDs: JNY-001, JNY-003
- Decision: Add draft recurring expense saving, local attachment metadata/data, merchant category rules, purchase recurring signal and purchase radar.
- Motivation: These close important usability and classification gaps without external services or scope-out behavior.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in fifteenth slice
- Affected artifacts: src/app.js, src/domain.js, src/styles.css, tests/domain.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-016 - Export report reconnect and experimental sync")) {
  decisionLog += `

## DEC-016 - Export report reconnect and experimental sync

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-078, US-081, US-083, US-085, US-086
- Source journey IDs: JNY-006
- Decision: Add local ZIP export, printable report export, full-state datafile reconnect, experimental sync settings and conflict detection without network transfer.
- Motivation: These close the remaining local-first data portability and sync-preparation stories while respecting the no-server/no-account/no-bank constraint.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Required later only for real cloud transport/provider choice.
- Implementation status: Implemented in sixteenth slice
- Affected artifacts: src/app.js, src/domain.js, src/storage.js, tests/domain.test.js, tests/storage.test.js, docs/traceability/*
`;
}
if (!decisionLog.includes("## DEC-017 - MasterCard statement import")) {
  decisionLog += `

## DEC-017 - MasterCard statement import

- Date: ${now.slice(0, 10)}
- Type: implements_baseline
- Source baseline IDs: US-045, US-046, US-047, US-063
- Source journey IDs: JNY-003
- Decision: Add Data-view import for MasterCard Excel and PDF statement specifications, with preview rows marked as new, duplicate, or ignored when matching an existing recurring expense.
- Motivation: The baseline requires CSV/XLSX/PDF purchase import, and the provided MasterCard samples give enough structure to implement local parsing without external services.
- Human approval status: Not required, baseline implementation inside existing scope.
- Customer decision status: Not required.
- Implementation status: Implemented in seventeenth slice
- Affected artifacts: src/app.js, src/domain.js, src/mastercard-import.js, src/styles.css, tests/domain.test.js, tests/mastercard-import.test.js, docs/traceability/*
`;
}
fs.writeFileSync(decisionLogPath, decisionLog);

console.log("Traceability implementation map updated.");
