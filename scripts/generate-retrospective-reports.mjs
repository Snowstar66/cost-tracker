import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const traceDir = path.join(root, "docs", "traceability");
const generatedAt = new Date().toISOString();

const baseline = JSON.parse(fs.readFileSync(path.join(traceDir, "requirements-baseline.json"), "utf8"));
const implementationMap = JSON.parse(fs.readFileSync(path.join(traceDir, "implementation-map.json"), "utf8"));
const decisionLog = fs.readFileSync(path.join(traceDir, "decision-log.md"), "utf8");

const implementationById = new Map(implementationMap.entries.map((entry) => [entry.id, entry]));
const implementedStoryIds = new Set(
  implementationMap.entries
    .filter((entry) => entry.id.startsWith("US-") && String(entry.status).includes("implemented"))
    .map((entry) => entry.id),
);
const decisionBySourceId = buildDecisionIndex(decisionLog);
const allStories = baseline.epics.flatMap((epic) => epic.stories.map((story) => ({ ...story, epicId: epic.id })));

const baselineRows = [
  baselineRow({
    id: baseline.outcome.id,
    type: "outcome",
    title: baseline.outcome.title,
    sourceDetail: baseline.outcome.outcomeStatement,
  }),
  ...baseline.journeys.map((journey) =>
    baselineRow({
      id: journey.id,
      type: "journey",
      title: journey.title,
      sourceDetail: `${journey.actor}: ${journey.goal}`,
      childIds: journey.linkedStoryIdeaIds ?? [],
    }),
  ),
  ...baseline.epics.map((epic) =>
    baselineRow({
      id: epic.id,
      type: "epic",
      title: epic.title,
      sourceDetail: epic.scopeBoundary ?? "",
      childIds: epic.stories.map((story) => story.id),
    }),
  ),
  ...allStories.map((story) =>
    baselineRow({
      id: story.id,
      type: "story",
      title: story.title,
      sourceDetail: story.expectedBehavior || story.valueIntent || "",
      parentId: story.epicId,
    }),
  ),
];

const additions = [
  {
    id: "ADD-001",
    type: "post_handoff_user_rule",
    title: "MasterCard PDF/Excel import specialiserad mot bifogade format",
    handoffSource: "US-045, US-046, US-047, US-063",
    inHandoff: "partly",
    implementationStatus: "implemented",
    coverageClass: "baseline_plus_user_rule",
    implementedSummary:
      "CSV-importen från handoffen utökades efter användarens exempel med lokal parsning av MasterCard XLSX och PDF, inklusive förhandsgranskning.",
    implementationArtifacts: "src/mastercard-import.js; src/app.js; src/domain.js",
    tests: "tests/mastercard-import.test.js; tests/domain.test.js; npm test",
    evidence: "Provided Excel sample parses 51 rows; provided PDF sample parses 51 rows; 41 tests passing",
    decisionIds: "DEC-017",
    deviationsOrNotes: "Ligger inom US-045 men den konkreta MasterCard-layouten kom efter handoffen.",
    remainingGap: "PDF-parsern kan behöva fler layoutvarianter för andra kortutgivare.",
  },
  {
    id: "ADD-002",
    type: "post_handoff_user_rule",
    title: "Ignorera importerade köp som redan finns som återkommande kostnad",
    handoffSource: "US-047, US-063",
    inHandoff: "partly",
    implementationStatus: "implemented",
    coverageClass: "baseline_plus_user_rule",
    implementedSummary:
      "Importförhandsgranskningen markerar rader som ignorerade när handlare/leverantör och belopp matchar en befintlig återkommande kostnad.",
    implementationArtifacts: "src/domain.js; src/app.js",
    tests: "tests/domain.test.js; npm test",
    evidence: "Import preview test verifies ignored recurring match",
    decisionIds: "DEC-017",
    deviationsOrNotes: "Regeln var användarspecificerad efter första implementeringen.",
    remainingGap: "",
  },
  {
    id: "ADD-003",
    type: "post_handoff_visual_refinement",
    title: "Ikoner och symboler i hela appen",
    handoffSource: "UX-001, US-087, US-089, US-090, US-092",
    inHandoff: "partly",
    implementationStatus: "implemented",
    coverageClass: "ux_refinement_inside_baseline",
    implementedSummary:
      "Ett internt SVG-ikonset lades till för navigation, knappar, scorecards, panelrubriker, importytor och mobilnav.",
    implementationArtifacts: "src/app.js; src/styles.css",
    tests: "node --check src/app.js; npm test",
    evidence: "Syntax check passed; 41 tests passing",
    decisionIds: "",
    deviationsOrNotes: "Ingen extern ikonberoende infördes; följer local-first/no dependency-valet.",
    remainingGap: "",
  },
  {
    id: "ADD-004",
    type: "post_handoff_ux_correction",
    title: "Översikt separerar återkommande kostnader och enskilda inköp",
    handoffSource: "OUT-001, EP-003, EP-006, EP-008",
    inHandoff: "yes",
    implementationStatus: "implemented",
    coverageClass: "baseline_clarification",
    implementedSummary:
      "Översikt blev en separat kontrollvy med återkommande kostnader och enskilda inköp i egna paneler, medan Återkommande behåller tidslinjen.",
    implementationArtifacts: "src/app.js; src/styles.css",
    tests: "overview smoke test; npm test",
    evidence: "OVERVIEW_SMOKE_OK; 41 tests passing",
    decisionIds: "",
    deviationsOrNotes: "Byggdes efter användarfeedback om att Översikt och Återkommande var för lika.",
    remainingGap: "",
  },
  {
    id: "FIX-001",
    type: "bug_fix",
    title: "Refresh-krasch efter ikonpolish",
    handoffSource: "TECH-001, US-076",
    inHandoff: "no",
    implementationStatus: "implemented",
    coverageClass: "implementation_quality_fix",
    implementedSummary: "Flyttade initial render tills ikonregistret är initierat så refresh med sparad lokal data inte ger blank sida.",
    implementationArtifacts: "src/app.js",
    tests: "SMOKE_OK; npm test",
    evidence: "Smoke test with saved wallet data passed; 41 tests passing",
    decisionIds: "",
    deviationsOrNotes: "Kvalitetsfix orsakad av senare UI-polish.",
    remainingGap: "",
  },
];

const gaps = [
  {
    id: "GAP-001",
    type: "scope_out",
    title: "Direkt bankintegration",
    handoffSource: "Scope-out: direkt bankintegration",
    inHandoff: "explicitly_excluded",
    implementationStatus: "not_implemented",
    coverageClass: "intentional_scope_out",
    implementedSummary: "Ingen bankkoppling byggdes.",
    implementationArtifacts: "",
    tests: "",
    evidence: "Traceability report scope-out section",
    decisionIds: "",
    deviationsOrNotes: "Detta är inte en miss utan ett uttryckligt scope-out.",
    remainingGap: "Kräver nytt beslut om bank/provider, säkerhet och samtycke.",
  },
  {
    id: "GAP-002",
    type: "deferred_decision",
    title: "Riktig molnsync-transport",
    handoffSource: "US-085, US-086",
    inHandoff: "partly",
    implementationStatus: "partially_implemented",
    coverageClass: "requires_product_security_decision",
    implementedSummary: "Lokal sync-konfiguration och konfliktdetektion finns, men ingen data skickas över nätverk.",
    implementationArtifacts: "src/app.js; src/domain.js",
    tests: "tests/domain.test.js",
    evidence: "US-085/US-086 test verifies local config and conflict detection",
    decisionIds: "DEC-016",
    deviationsOrNotes: "Medvetet stoppat före riktig nätverkstransport för att undvika säkerhets-/providerbeslut utan godkännande.",
    remainingGap: "Välj endpoint/protokoll/autentisering innan riktig sync byggs.",
  },
  {
    id: "GAP-003",
    type: "implementation_limitation",
    title: "Native binär PDF-rapport",
    handoffSource: "US-081",
    inHandoff: "yes",
    implementationStatus: "partially_implemented",
    coverageClass: "browser_print_to_pdf",
    implementedSummary: "Rapporten öppnas som lokal HTML och använder browserns print-to-PDF.",
    implementationArtifacts: "src/storage.js; src/app.js",
    tests: "tests/storage.test.js",
    evidence: "Printable report HTML test",
    decisionIds: "DEC-016",
    deviationsOrNotes: "Valt för dependency-free local-first implementation.",
    remainingGap: "Native PDF kräver PDF-generator/dependency eller egen PDF-writer.",
  },
  {
    id: "GAP-004",
    type: "test_gap",
    title: "Automatiserade browser-/E2E-tester",
    handoffSource: "TECH-001, UX-001",
    inHandoff: "no",
    implementationStatus: "not_implemented",
    coverageClass: "verification_gap",
    implementedSummary: "Domän-, storage- och importtester finns; UI har smoke checks men inte full browserautomation.",
    implementationArtifacts: "tests/*.test.js",
    tests: "npm test",
    evidence: "41 Node tests passing",
    decisionIds: "",
    deviationsOrNotes: "Bra nästa kvalitetsskikt för navigation, modaler och importflöden.",
    remainingGap: "Lägg till Playwright eller motsvarande om UI-regressioner ska fångas automatiskt.",
  },
];

const csvRows = [...baselineRows, ...additions, ...gaps];
const csvPath = path.join(traceDir, "traceability-implementation-comparison.csv");
fs.writeFileSync(csvPath, toCsv(csvRows));

const summaryPath = path.join(traceDir, "implementation-process-summary.md");
fs.writeFileSync(summaryPath, buildSummary(csvRows));

console.log(`Wrote ${path.relative(root, csvPath)}`);
console.log(`Wrote ${path.relative(root, summaryPath)}`);

function baselineRow({ id, type, title, sourceDetail, parentId = "", childIds = [] }) {
  const direct = implementationById.get(id);
  const childEntries = childIds.map((childId) => implementationById.get(childId)).filter(Boolean);
  const childrenImplemented = childIds.length > 0 && childIds.every((childId) => implementedStoryIds.has(childId));
  const childArtifacts = unique(childEntries.flatMap((entry) => entry.implementationArtifacts ?? []));
  const childTests = unique(childEntries.flatMap((entry) => entry.tests ?? []));
  const directImplemented = direct && String(direct.status).includes("implemented");
  const implementationStatus = directImplemented
    ? direct.status
    : childrenImplemented
      ? "implemented_by_child_stories"
      : "not_mapped_or_not_implemented";

  return {
    id,
    type,
    title,
    handoffSource: parentId ? `${parentId}: ${sourceDetail}` : sourceDetail,
    inHandoff: "yes",
    implementationStatus,
    coverageClass: directImplemented ? "handoff_baseline_direct" : childrenImplemented ? "handoff_baseline_rollup" : "missing_or_unmapped",
    implementedSummary: summarizeImplemented(id, type, title, direct, childrenImplemented),
    implementationArtifacts: unique([...(direct?.implementationArtifacts ?? []), ...childArtifacts]).join("; "),
    tests: unique([...(direct?.tests ?? []), ...childTests]).join("; "),
    evidence: unique(direct?.evidence ?? []).join("; "),
    decisionIds: unique(decisionBySourceId.get(id) ?? []).join("; "),
    deviationsOrNotes: direct?.knownDeviations?.join("; ") ?? "",
    remainingGap: direct?.remainingGaps?.join("; ") ?? "",
  };
}

function summarizeImplemented(id, type, title, direct, childrenImplemented) {
  if (direct) return `${title} är implementerad i de listade artefakterna.`;
  if (childrenImplemented) return `${title} är täckt genom att samtliga länkade story-ID:n är implementerade.`;
  return `${title} saknar direkt implementation-map-rad och är inte fullt härledd från barn-ID:n.`;
}

function buildDecisionIndex(markdown) {
  const index = new Map();
  const sections = markdown.split(/\n(?=## )/);
  for (const section of sections) {
    const id = section.match(/^##\s+(DEC-\d+|TECH-\d+)/m)?.[1];
    const sourceLine = section.match(/^- Source baseline IDs:\s*(.+)$/m)?.[1];
    if (!id || !sourceLine) continue;
    for (const sourceId of sourceLine.split(",").map((item) => item.trim()).filter(Boolean)) {
      if (!index.has(sourceId)) index.set(sourceId, []);
      index.get(sourceId).push(id);
    }
  }
  return index;
}

function buildSummary(rows) {
  const storyRows = rows.filter((row) => row.type === "story");
  const implementedStories = storyRows.filter((row) => row.implementationStatus.includes("implemented")).length;
  const missingStories = storyRows.length - implementedStories;
  const additionsCount = rows.filter((row) => row.id.startsWith("ADD-")).length;
  const gapCount = rows.filter((row) => row.id.startsWith("GAP-")).length;

  return `# Implementation Process Summary

Generated: ${generatedAt}

## Kan rapporten skapas i efterhand?

Ja. Även om instruktionen om CSV-spårbarhet och processammanfattning kom efter implementationen finns tillräckligt med underlag i handoffen, baseline-frysningen, implementation-map, decision-log, testsviten och filhistoriken i arbetsytan för att skapa en retrospektiv rapport. Den blir inte lika stark som en rapport som uppdaterats efter varje enskild kodrad i realtid, men den är spårbar mot de artefakter som faktiskt finns och mot de beslut som dokumenterades under arbetet.

## Min första tolkning av materialet

Jag uppfattade handoffen som ett approved BMAD-underlag för OUT-001: en local-first privat kontrollapp för återkommande kostnader och enskilda köp. De viktigaste styrsignalerna var att lösningen skulle fungera utan konto, server eller bankkoppling, att data var känslig och därför skulle hållas lokalt, och att UX skulle kännas som en tät kontrollpanel snarare än en marknads-/SaaS-landningssida.

Jag läste user stories som en bred backlogg runt samma kärna: plånbok, betalare, återkommande kostnader, köp, import/export, statistik, signaler, uppsägningar, datarisk och vissa produktflaggor. Scope-out-listan var lika viktig som kraven: ingen direkt bankintegration, ingen automatisk uppsägning, ingen hosted backend som krav, ingen riktig betalvägg och ingen flerårig forecasting-modell.

## Hur jag gick till väga

Först frös jag baseline i \`docs/traceability\` och skapade decision-log samt implementation-map så att varje större implementeringssteg kunde kopplas tillbaka till handoffen. Därefter byggde jag ett dependency-free statiskt webbgränssnitt med modulär JavaScript: \`src/domain.js\` för affärsregler, \`src/storage.js\` för lokal persistence/export och \`src/app.js\` för UI-flöden.

Implementation gjordes i skivor. Första skivan skapade kontrollplansgrunden: onboarding, wallet, första betalare, återkommande kostnader och tidslinje. Därefter fyllde jag på med edit/delete, avslut av kostnader, signaler, register, manuella köp, statistik, import/export, scenario-simulering, påminnelser, produktflaggor och datahantering. Senare användarönskemål lades in som tracebara refinement-steg: MasterCard-import, ikoner/symboler, refresh-fix och tydligare uppdelning mellan Översikt och Återkommande.

## Designval

Jag valde en lokal webapp utan externa runtime-beroenden eftersom det bäst matchade local-first-kravet och minskade risken för konto-, server- eller bankkopplingsglidning. Layouten byggdes som en kontrollpanel med sidonav, scorecards, tabeller/listor, högerrail och tydliga Data-/Register-vyer. Det gör appen tät och handlingsorienterad snarare än dekorativ.

Översikten blev efter feedback en samlande vy med separata paneler för återkommande kostnader och enskilda inköp. Återkommande-vyn behåller tidslinjen eftersom den är bättre för löpande åtaganden, medan Inköp-vyn är bättre för transaktionslistor och importarbete. Data-vyn samlar backup, import, export, planflaggor och experimentell sync eftersom det är mer administrativt än daglig ekonomi.

## Varför resultatet är som det är

Resultatet är byggt för att maximera kontroll utan att bryta constraints. Därför finns JSON/CSV/ZIP/export, lokal storage, importförhandsgranskning och tydlig datarisk, men ingen bankkoppling eller riktig molnsync. Därför finns PDF-rapport via browser print-to-PDF i stället för en tung PDF-generator. Därför parsas MasterCard PDF/Excel lokalt mot bifogat format i stället för att skicka underlag till en server eller AI-tjänst.

Resultatet är också brett snarare än djupt på alla tänkbara kanter, eftersom användaren bad mig fortsätta genom hela backloggen. Där kraven krävde externa beslut eller ny riskprofil stannade jag vid en lokal, säker variant och markerade gapet.

## Kvantitativ status

- Baseline stories i handoffen: ${storyRows.length}
- Stories markerade som implementerade eller täckta: ${implementedStories}
- Stories saknade enligt implementation-map-jämförelsen: ${missingStories}
- Post-handoff additions/refinements i CSV:n: ${additionsCount}
- Kända gap/scope-out/limitations i CSV:n: ${gapCount}
- Senast verifierad testnivå: \`npm test\` med 41 passing tests

## Viktig tolkning

När CSV:n säger att något är implementerat betyder det att det finns en lokal implementation eller rollup från implementerade stories. När CSV:n säger gap betyder det inte alltid fel eller miss; vissa gap är avsiktliga scope-outs eller beslut som kräver mänskligt godkännande, till exempel riktig bankintegration eller molnsync-transport.
`;
}

function toCsv(rows) {
  const headers = [
    "id",
    "type",
    "title",
    "handoffSource",
    "inHandoff",
    "implementationStatus",
    "coverageClass",
    "implementedSummary",
    "implementationArtifacts",
    "tests",
    "evidence",
    "decisionIds",
    "deviationsOrNotes",
    "remainingGap",
  ];
  return `${headers.join(",")}\n${rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")).join("\n")}\n`;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n\r;]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}
