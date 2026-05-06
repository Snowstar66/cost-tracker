import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "docs", "out-001-bmad-prepared-framing-handoff.json");
const outDir = path.join(root, "docs", "traceability");

const payload = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const source = payload.source_of_truth;
const today = new Date().toISOString().slice(0, 10);

const implementationSlice = [
  "OUT-001",
  "JNY-001",
  "EP-001",
  "US-001",
  "US-002",
  "US-003",
  "US-004",
  "US-007",
  "US-008",
  "US-015",
  "US-016",
  "US-017",
  "US-020",
  "US-022",
  "US-026",
  "US-029",
  "US-030",
  "US-031",
  "US-032",
  "US-064",
  "US-076",
  "US-087",
  "US-089",
  "US-090",
  "US-091",
  "US-092",
  "US-099",
  "TECH-001",
  "DEC-001",
];

const epics = source.framing_structure.epics.map((epic) => ({
  id: epic.key,
  title: epic.title,
  scopeBoundary: epic.scope_boundary,
  stories: epic.story_ideas.map((story) => ({
    id: story.key,
    title: story.title,
    valueIntent: story.value_intent,
    expectedBehavior: story.expected_behavior,
    uxSketches: story.ux_sketches,
  })),
}));

const journeys =
  source.journey_contexts?.flatMap((context) =>
    context.journeys.map((journey) => ({
      id: journey.id,
      title: journey.title,
      actor: journey.primary_actor,
      goal: journey.goal,
      trigger: journey.trigger,
      linkedEpicIds: journey.linked_epic_ids,
      linkedStoryIdeaIds: journey.linked_story_idea_ids,
      steps: journey.steps.map((step) => ({
        id: step.id,
        title: step.title,
        description: step.description,
      })),
    })),
  ) ?? [];

const storyRows = epics
  .flatMap((epic) =>
    epic.stories.map(
      (story) =>
        `| ${story.id} | ${story.title} | ${epic.id} | ${story.expectedBehavior.replaceAll("\n", " ")} |`,
    ),
  )
  .join("\n");

const journeyRows = journeys
  .map(
    (journey) =>
      `| ${journey.id} | ${journey.title} | ${journey.actor} | ${journey.linkedStoryIdeaIds.join(", ")} |`,
  )
  .join("\n");

const epicRows = epics
  .map(
    (epic) =>
      `| ${epic.id} | ${epic.title} | ${epic.stories.length} | ${epic.scopeBoundary.replaceAll("\n", " ")} |`,
  )
  .join("\n");

const scopeOut = epics
  .map((epic) => epic.scopeBoundary)
  .join("\n")
  .match(/Exkluderar [^.]+[.]/g) ?? [];

const baseline = {
  generatedAt: new Date().toISOString(),
  source: {
    file: "docs/out-001-bmad-prepared-framing-handoff.json",
    profile: payload.profile,
    version: source.version,
    exportedAt: source.metadata.exported_at,
    approval: source.approvals,
  },
  outcome: {
    id: source.handshake.outcome_key,
    title: source.handshake.outcome_title,
    problemStatement: source.handshake.problem_statement,
    outcomeStatement: source.handshake.outcome_statement,
    timeframe: source.handshake.timeframe,
    valueOwner: source.handshake.value_owner,
    aiLevel: source.handshake.ai_level,
    riskProfile: source.handshake.risk_profile,
    dataSensitivity: source.handshake.data_sensitivity,
  },
  constraints: {
    raw: source.handshake.constraints,
    scopeOut,
  },
  baseline: source.baseline,
  journeys,
  epics,
  initialImplementationSlice: implementationSlice,
};

const md = `# Requirements Baseline

Generated: ${baseline.generatedAt}
Source: \`${baseline.source.file}\`
Approval: ${source.approvals.status}, version ${source.approvals.approved_version}, ${source.approvals.approved_at}

This file freezes the governed handoff as the implementation baseline. Later learning must be recorded in \`decision-log.md\` as DEC/EXT/DROP/TECH/BUG/RISK entries.

## Outcome

- ID: ${baseline.outcome.id}
- Title: ${baseline.outcome.title}
- Timeframe: ${baseline.outcome.timeframe}
- Value owner: ${baseline.outcome.valueOwner}
- AI level: ${baseline.outcome.aiLevel}
- Risk profile: ${baseline.outcome.riskProfile}
- Data sensitivity: ${baseline.outcome.dataSensitivity}

## Problem

${baseline.outcome.problemStatement}

## Outcome Statement

${baseline.outcome.outcomeStatement}

## Epics

| ID | Title | Stories | Scope boundary |
| --- | --- | ---: | --- |
${epicRows}

## Journeys

| ID | Title | Primary actor | Linked story ideas |
| --- | --- | --- | --- |
${journeyRows}

## Story Ideas

| ID | Title | Epic | Expected behavior |
| --- | --- | --- | --- |
${storyRows}

## Scope-Out Extract

${scopeOut.map((item) => `- ${item}`).join("\n") || "- No explicit scope-out statements extracted."}

## Initial Implementation Slice

The first build slice is inside baseline scope and maps to:

${implementationSlice.map((id) => `- ${id}`).join("\n")}
`;

const decisionLog = `# Decision Log

## DEC-001 - First implementation slice

- Date: ${today}
- Type: refines_baseline
- Source baseline IDs: OUT-001, EP-001, US-001, US-002, US-003, US-004, US-007, US-008, US-015, US-016, US-017, US-020, US-022, US-026, US-029, US-030, US-031, US-032, US-064, US-076, US-087, US-089, US-090, US-091, US-092, US-099
- Source journey IDs: JNY-001
- Decision: Start implementation with a local-first vertical slice for wallet onboarding, first payer, recurring expenses, timeline/overview, search/filter, local data warning and responsive shell.
- Motivation: This creates the smallest useful control-plane foundation while preserving traceability and avoiding account, bank, hosted backend or advanced import scope.
- Human approval status: Implicitly requested by user instruction to start implementation from approved handoff.
- Customer decision status: Not required for this low-risk refinement inside baseline.
- Implementation status: Planned
- Affected artifacts: package.json, src/*, tests/*, docs/traceability/*

## TECH-001 - Static local-first web app foundation

- Date: ${today}
- Type: technical_enabler
- Source baseline IDs: OUT-001, US-076, US-087, US-092, US-099
- Decision: Use a no-backend browser application with localStorage persistence, modular JavaScript domain logic, static HTML/CSS, and Node-based tests for calculations.
- Motivation: Matches local-first constraint and avoids server/account/bank integration while allowing fast implementation in an empty repository.
- Human approval status: Not required, technical enabler inside baseline constraints.
- Customer decision status: Not required.
- Implementation status: Planned
- Affected artifacts: package.json, index.html, src/app.js, src/domain.js, src/storage.js, src/styles.css, tests/domain.test.js
`;

const implementationMap = {
  generatedAt: new Date().toISOString(),
  entries: implementationSlice.map((id) => ({
    id,
    status: id.startsWith("TECH") || id.startsWith("DEC") ? "planned" : "baseline_planned",
    implementationArtifacts: [],
    tests: [],
    documentation: ["docs/traceability/requirements-baseline.md"],
    knownDeviations: [],
    remainingGaps: [],
    evidence: [],
  })),
};

const untracedReport = `# Untraced Artifacts Report

Generated: ${new Date().toISOString()}

Status: No application implementation artifacts have been created yet.

Known untraced artifacts:
- None.
`;

const traceabilityReport = `# Traceability Report

Generated: ${new Date().toISOString()}

## Baseline Source

- Source file: \`${baseline.source.file}\`
- Approval: ${source.approvals.status}, version ${source.approvals.approved_version}
- Outcome: OUT-001

## Initial Build Slice

Status: planned.

Mapped IDs:
${implementationSlice.map((id) => `- ${id}`).join("\n")}

## Scope-Out Touched

None planned.

## Gaps

- Full application scope includes 100 story ideas. The initial implementation slice intentionally starts with the wallet and recurring-cost control-plane foundation.
- CSV/XLSX/PDF import, cloud sync, PDF reports and hosted/backend behavior are not part of this first implementation slice.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "requirements-baseline.json"), `${JSON.stringify(baseline, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, "requirements-baseline.md"), md);
fs.writeFileSync(path.join(outDir, "decision-log.md"), decisionLog);
fs.writeFileSync(path.join(outDir, "implementation-map.json"), `${JSON.stringify(implementationMap, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, "untraced-artifacts-report.md"), untracedReport);
fs.writeFileSync(path.join(outDir, "traceability-report.md"), traceabilityReport);

console.log(`Traceability baseline generated in ${path.relative(root, outDir)}`);
