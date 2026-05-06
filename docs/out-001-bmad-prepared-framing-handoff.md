# BMAD Prepared AI Handoff

This package is prepared for BMAD-style downstream refinement while keeping the governed Framing package intact as the source of truth.

## Handling rules
- Start from Outcome, Epics and Story Ideas before creating or refining Delivery Stories.
- Preserve Outcome -> Epic -> Story Idea traceability and extend it forward into Delivery Stories and tests when later steps generate them.
- Do not replace the Framing source of truth with generated delivery artifacts. Bring later delivery evidence back through the feedback loop instead.
- Keep approval context, AI level, constraints, Journey Context and UX references attached through later BMAD steps.

## Structured Framing Payload
# Framing Brief

This package is intended as input to the next controlled AI-assisted step, for example BMAD-based design or structured refinement.

## Customer Handshake
Outcome key: OUT-001
Outcome title: Trygg kontroll över privata återkommande kostnader och enskilda köp
Timeframe: 2026 Q2
Value owner: Anne Hathaway

### Problem Statement
Private users and households need a local-first way to understand recurring costs, one-off purchases, cancellation opportunities, and spending impact without account or bank connection.

### Outcome Statement
En privatperson eller ett hushåll ska snabbt förstå vad som dras, vad som kan sägas upp, vad som köps enskilt och hur privatekonomin påverkas över tid, utan konto eller bankkoppling.

### Solution Context & Constraints
Solution context: Not captured yet
Constraints: ## General constraints
Imported constraints
- Data, Storage and Technical Constraints: ## 8. Data, Storage and Technical Constraints | Constraint ID | Constraint | Detail | Linked refs | | --- | --- | --- | --- | | CON-001 | Local-first | Appen ska fungera utan server, konto eller bankkoppling. Primär l...

## UX principles
UX direction
UX profile: Enterprise control plane (enterprise-control-plane)
Target surface: Responsive web app (responsive-web)
Color schema: Nordic blue (nordic-blue)
Style authority: AAS suggested style (aas-suggested-style)

Style priority:
The selected AAS UX direction is the primary source unless explicit customer UX rules are added in the additional instructions.
If customer UX rules are supplied, downstream AI must explicitly resolve conflicts using this style authority before applying AAS profile, color, or signature component guidance.

Core UX guidance:
Prioritize dashboard density, strong hierarchy, audit-ready status, table/list scanning, durable navigation, and clear ownership of decisions.

Downstream AI visual grammar:
The selected UX profile must materially change layout, components, density, navigation, and status treatment. Do not collapse this into a generic SaaS card UI.
- Use dense control-plane layouts with compact rectangular cards, tables, right rails, and persistent navigation.
- Prefer squared or small-radius controls, clear borders, muted surfaces, and high information density.
- Place owner, status, evidence, version, and governance action together so the decision context is never hidden.

Signature components to prefer when relevant:
Use these as primary building blocks before generic button/select/input examples. Generic controls should support the signature component, not define the experience.
- Approval matrix for comparing owners, evidence, risk, and approval state.
- Audit trail rail beside forms and review screens.
- Readiness scorecard for tollgate, release, or portfolio decisions.

Surface guidance:
Design from responsive web constraints with clear desktop density and a readable mobile layout for core review and input tasks.

Color guidance:
Use cool blues with clean neutrals, restrained accents, high contrast, and a calm professional tone.

Additional UX instructions:
Imported UX input
- UX Specification: ## 6. UX Specification ### 6.1 UX Direction | UX ID | Attribute | Spec | Linked refs | | --- | --- | --- | --- | | UX-001 | UX profile | Private finance control plane: tät, lugn, handlingsorienterad och jämförbar. | O...
Data sensitivity: Hög. Men hanteras med lokal fillagring
Delivery type: AD
Application Development: frame a new application, service or meaningful functional expansion. Keep focus on outcome, scope and why the capability should exist.

## Baseline
Readiness: Ready
Definition: Product regeneration package dated 2026-05-05 defines the current product intent, trace IDs, journeys, UX rules, calculation rules, constraints, acceptance checklist, and known gaps.
Source: product-regeneration-package.md
Measurement Method: Användaren kan skapa en plånbok, registrera återkommande utgifter, importera eller lägga in enskilda köp, se tidslinje/statistik, markera signaler, exportera data och agera på uppsägningar eller besparingsmöjligheter.

## AI and Risk
Execution pattern: orchestrated
AI level: LEVEL 3
Level 3 means orchestrated agentic delivery: AI executes multiple chained steps through workflows or agents with stronger governance.
Expected AI use across lifecycle: OK
Risk profile: low
Business impact: low: OK
Data sensitivity: low: OK
Blast radius: low: OK
Decision impact: low: OK
Level 3 justification: OK

## Framing Warnings
- No warnings were visible at export time.

## Epics and Story Ideas
### EP-001 - Plånbok, onboarding och dataseparering
Scope boundary: Scope in: Inkluderar skapa, välja, duplicera och konfigurera plånbok samt första användare. Exkluderar kontobaserad multi-user-synk.
- Story Idea US-001: Skapa första plånboken
  Value intent: Användaren ska snabbt komma från tom app till egen ekonomisk yta.
  Expected behavior: Onboarding låter användaren ange plånboksnamn, välja mall och skapa första kontexten.
  UX sketches: None attached
- Story Idea US-002: Kräva minst en första användare
  Value intent: Statistik per betalare och nya utgifter ska fungera direkt.
  Expected behavior: När första plånboken skapas promptas användaren att lägga till minst en person/betalare.
  UX sketches: None attached
- Story Idea US-003: Välja aktiv plånbok
  Value intent: Flera ekonomiska sammanhang ska kunna hållas isär.
  Expected behavior: Kontextväljaren byter aktiv plånbok och alla vyer filtreras till den.
  UX sketches: None attached
- Story Idea US-004: Konfigurera tidsfönster
  Value intent: Användaren ska kunna styra hur långt bakåt/framtåt planeringen visas.
  Expected behavior: Plånbokens månader bakåt och framåt kan ändras och påverkar tidslinje/statistik.
  UX sketches: None attached

### EP-002 - Återkommande utgifter
Scope boundary: Scope in: Inkluderar belopp, period, leverantör, kategori, betalare, datum, status, signaler och anteckningar. Exkluderar fakturaskanning som automatisk källa.
- No Story Ideas are linked to this Epic yet.

### EP-003 - Tidslinje och översikt
Scope boundary: Scope in: Inkluderar desktop-tidslinje, mobilöversikt, filter, sök, totals och snabblänkar. Exkluderar avancerad kalenderplanering.
- No Story Ideas are linked to this Epic yet.

### EP-004 - Uppsägning, låsning och påminnelser
Scope boundary: Scope in: Inkluderar uppsägningstid, låst period, tidigaste fria månad, avslut, påminnelse och kalenderexport. Exkluderar automatisk uppsägning hos leverantör.
- No Story Ideas are linked to this Epic yet.

### EP-005 - Register och återanvändbar metadata
Scope boundary: Scope in: Inkluderar personer, leverantörer, kategorier, färg/ikon, kontaktinfo och kategoriregler. Exkluderar full CRM eller dokumentarkiv.
- No Story Ideas are linked to this Epic yet.

### EP-006 - Enskilda köp och kontoutdragsimport
Scope boundary: Scope in: Inkluderar manuella köp, import från CSV/XLSX/PDF, importförhandsgranskning, deduplicering, kategorisering och köpdetalj. Exkluderar direkt bankintegration.
- Story Idea US-043: Skapa enskilt köp manuellt
  Value intent: Fånga konsumtion som inte är återkommande.
  Expected behavior: Formulär sparar datum, bokfört datum, handlare, belopp, kategori, betalare, typ, flaggor och anteckning.
  UX sketches: None attached
- Story Idea US-044: Redigera enskilt köp
  Value intent: Korrigera importerade eller manuella köp.
  Expected behavior: Köpmodalen kan ändra fält och spara utan att tappa import/koppling.
  UX sketches: None attached
- Story Idea US-045: Importera kontoutdrag
  Value intent: Snabbt få in många köp.
  Expected behavior: CSV, XLSX och PDF kan läsas och omvandlas till köptransaktioner.
  UX sketches: None attached

### EP-007 - Signaler, klassning och konvertering
Scope boundary: Scope in: Inkluderar Granska, Onödigt, Återkommande, Värt det, Business, namnbyte av business-signal, köp -> återkommande och återkommande -> köp.
- Story Idea US-054: Markera Onödigt
  Value intent: Synliggöra konsumtion att lära av.
  Expected behavior: Köp/utgift kan signaleras som onödigt och räknas i signalstatistik.
  UX sketches: None attached

### EP-008 - Statistik och beslutsstöd
Scope boundary: Scope in: Inkluderar återkommande analys, köpstatistik, köpradar, budgetutfall, kategori/person/leverantör, topphandlare och periodtrender.
- No Story Ideas are linked to this Epic yet.

### EP-009 - Dataexport, backup, datafil och sync
Scope boundary: Scope in: Inkluderar localStorage, JSON/ZIP/CSV/PDF/ICS, datafil, delningsfil, import som ny plånbok och experimentell molnsync via egen endpoint. Exkluderar hosted backend som krav.
- No Story Ideas are linked to this Epic yet.

### EP-010 - Responsiv UX, hjälp och tomlägen
Scope boundary: Scope in: Inkluderar navigering, modaler, drawer, tomlägen, hjälpvy, mobilanpassade kort och primära actions. Exkluderar marketing-landningssida.
- No Story Ideas are linked to this Epic yet.

### EP-011 - Simulering och scenarioanalys
Scope boundary: Scope in: Inkluderar simulera bort återkommande utgift, simulerad statistik och återställning. Exkluderar flerårig forecasting med osäkerhetsmodell.
- No Story Ideas are linked to this Epic yet.

### EP-012 - Produktadministration och planflaggor
Scope boundary: Scope in: Inkluderar Data-vy, lokal varning, premium/free-flagga, köp på/av och namn på business-signal. Exkluderar riktig betalvägg.
- No Story Ideas are linked to this Epic yet.

### EPC-001 - Fallback Epic
Scope boundary: Describe what this Epic includes, excludes, or leaves for later.
- Story Idea US-005: Duplicera plånbok som mall
  Value intent: Återanvända struktur utan att bygga om register.
  Expected behavior: Appen kan skapa en ny plånbok med kopierad struktur enligt befintlig mall.
  UX sketches: None attached
- Story Idea US-006: Radera plånbok säkert
  Value intent: Ta bort fel eller testdata utan att lämna relationer kvar.
  Expected behavior: Radering tar bort relaterade personer, leverantörer, kategorier, utgifter, köp, filer, regler och filterreferenser.
  UX sketches: None attached
- Story Idea US-007: Visa tomt startläge
  Value intent: En ny användare ska förstå nästa steg.
  Expected behavior: Tom app visar tydlig startyta för ny plånbok eller demo/skip utan döda ytor.
  UX sketches: None attached
- Story Idea US-008: Skapa återkommande månadsutgift
  Value intent: Registrera vanligaste kostnadstypen.
  Expected behavior: Formulär sparar namn, belopp, månad, dragningsdag, period, kategori, betalare och leverantör.
  UX sketches: None attached
- Story Idea US-009: Skapa kvartals- och årsutgift
  Value intent: Återkommande kostnader med annan periodicitet ska periodiseras rätt.
  Expected behavior: Val av kvartal/år påverkar periodiserad statistik och kassaflöde korrekt.
  UX sketches: None attached
- Story Idea US-010: Skapa engångsperiod
  Value intent: Planerade engångskostnader ska kunna synas i rätt månad.
  Expected behavior: Periodtypen engång ger belopp i aktuell period utan att återkomma.
  UX sketches: None attached
- Story Idea US-011: Spara ofullständig utgift som utkast
  Value intent: Användaren ska kunna fånga något snabbt utan komplett data.
  Expected behavior: Saknas centrala fält sparas status draft och raden kan kompletteras senare.
  UX sketches: None attached
- Story Idea US-012: Redigera återkommande utgift
  Value intent: Felaktiga eller ändrade kostnader ska kunna korrigeras.
  Expected behavior: Redigering uppdaterar utgift och period utan att skapa dubbletter.
  UX sketches: None attached

### EPC-002 - Fallback Epic
Scope boundary: Describe what this Epic includes, excludes, or leaves for later.
- Story Idea US-013: Avsluta återkommande utgift
  Value intent: Avslutade kostnader ska sluta påverka framtid men finnas i historik.
  Expected behavior: Avslut sätter slutdatum/status och tidslinjen slutar räkna framtida månader.
  UX sketches: None attached
- Story Idea US-014: Ta bort återkommande utgift
  Value intent: Test eller felregistrering ska kunna rensas.
  Expected behavior: Borttagning tar bort utgift och relaterade perioder samt kopplar loss eventuella köp.
  UX sketches: None attached
- Story Idea US-015: Välja betalande person
  Value intent: Fördelning per person ska vara möjlig.
  Expected behavior: Utgift kan kopplas till person och synas i personsummeringar/filter.
  UX sketches: None attached
- Story Idea US-016: Välja kategori
  Value intent: Kostnadsmix ska bli begriplig.
  Expected behavior: Utgift kan kopplas till kategori med färg/ikon och räknas i kategoriöversikter.
  UX sketches: None attached
- Story Idea US-017: Välja eller skapa leverantör i flödet
  Value intent: Registrering ska gå fort utan att lämna formuläret.
  Expected behavior: Användaren kan välja befintlig leverantör eller skapa ny leverantör från utgiftsformuläret.
  UX sketches: None attached
- Story Idea US-018: Ange anteckning
  Value intent: Praktisk kontext ska kunna sparas utan separat dokument.
  Expected behavior: Anteckning lagras på utgift och visas i detalj.
  UX sketches: None attached
- Story Idea US-019: Bifoga underlag på utgift
  Value intent: Kvitto, avtal eller faktura ska kunna hållas nära posten.
  Expected behavior: Tillåtna filtyper kan bifogas och visas i utgiftsdetaljen.
  UX sketches: None attached
- Story Idea US-020: Visa återkommande tidslinje
  Value intent: Användaren ska se vilka månader varje utgift påverkar.
  Expected behavior: Desktop visar utgifter som rader och månader som kolumner med belopp/aktivitet.
  UX sketches: None attached

### EPC-003 - Fallback Epic
Scope boundary: Describe what this Epic includes, excludes, or leaves for later.
- Story Idea US-021: Visa mobil översikt
  Value intent: Mobilanvändaren ska kunna läsa samma data utan tabellkaos.
  Expected behavior: Mobilvy visar kompakta kort, månadsrader och expanderbara detaljer.
  UX sketches: None attached
- Story Idea US-022: Visa månadstotaler
  Value intent: Användaren ska förstå total belastning per månad.
  Expected behavior: Månadsrubriker eller sammanfattningar visar totals för vald period.
  UX sketches: None attached
- Story Idea US-023: Filtrera på kategori
  Value intent: Fokusera på en del av ekonomin.
  Expected behavior: Kategorifilter påverkar tidslinje, översikt och relevanta summeringar.
  UX sketches: None attached
- Story Idea US-024: Filtrera på betalare
  Value intent: Se vem som bär vilka kostnader.
  Expected behavior: Betalarfilter visar endast matchande utgifter/köp där relevant.
  UX sketches: None attached
- Story Idea US-025: Filtrera på signal
  Value intent: Användaren ska kunna se exempelvis Onödigt eller Business.
  Expected behavior: Signalfilter påverkar köp/översikt och släcks visuellt när det avmarkeras.
  UX sketches: None attached
- Story Idea US-026: Söka i utgifter och köp
  Value intent: Hitta poster snabbt.
  Expected behavior: Sök matchar namn, leverantör, handlare, kategori och relaterad text.
  UX sketches: None attached
- Story Idea US-027: Dölja historiska månader
  Value intent: Minska visuell belastning när fokus är framåt.
  Expected behavior: Toggle tar bort tidigare månader från tidslinjens fokus.
  UX sketches: None attached
- Story Idea US-028: Öppna detaljdrawer från tidslinje
  Value intent: Snabbt gå från översikt till åtgärd.
  Expected behavior: Klick på rad/cell öppnar detalj med redigera, avsluta, ta bort och filhantering.
  UX sketches: None attached

### EPC-004 - Fallback Epic
Scope boundary: Describe what this Epic includes, excludes, or leaves for later.
- Story Idea US-029: Snabbregistrera från global action
  Value intent: Ny data ska vara nära till hands oavsett vy.
  Expected behavior: Quick action erbjuder återkommande utgift, enskilt köp och import.
  UX sketches: None attached
- Story Idea US-030: Ange uppsägningstid
  Value intent: Förstå när bindning/uppsägning påverkar ekonomin.
  Expected behavior: Utgift kan ha uppsägningstid i dagar eller månader.
  UX sketches: None attached
- Story Idea US-031: Beräkna tidigaste kostnadsfria månad
  Value intent: Visa realistisk effekt av uppsägning.
  Expected behavior: Appen beräknar första månad utan kostnad baserat på dagens datum och uppsägningstid.
  UX sketches: None attached
- Story Idea US-032: Visa låst period
  Value intent: Undvika falsk besparingssignal.
  Expected behavior: Månader som inte kan frigöras än markeras låsta.
  UX sketches: None attached
- Story Idea US-064: Visa återkommande analys
  Value intent: Förstå planerad kostnadsbas.
  Expected behavior: Statistik visar periodiserad period, månadssnitt, årstakt och signalmix.
  UX sketches: None attached
- Story Idea US-033: Skapa uppsägningspåminnelse
  Value intent: Minska risken att missa deadline.
  Expected behavior: Relevant påminnelse skapas kopplat till utgift och kan markeras klar.
  UX sketches: None attached
- Story Idea US-034: Exportera påminnelser till kalender
  Value intent: Ta med åtgärder utanför appen.
  Expected behavior: Appen kan exportera .ics för påminnelser.
  UX sketches: None attached
- Story Idea US-035: Visa saknad uppsägningsinformation
  Value intent: Synliggöra svag data.
  Expected behavior: Poster utan uppsägningsdata eller instruktion kan flaggas som förbättringskandidater.
  UX sketches: None attached

### EPC-005 - Fallback Epic
Scope boundary: Describe what this Epic includes, excludes, or leaves for later.
- Story Idea US-036: Skapa och redigera person
  Value intent: Stödja hushåll och betalare.
  Expected behavior: Register låter användaren skapa, ändra och inaktivera personer.
  UX sketches: None attached
- Story Idea US-037: Ange månadsbudget per person
  Value intent: Möjliggöra budgetutfall.
  Expected behavior: Person kan ha disponibel månadsinkomst/budget som används i statistik.
  UX sketches: None attached
- Story Idea US-038: Skapa och redigera leverantör
  Value intent: Återanvänd företagsdata.
  Expected behavior: Register hanterar namn, typ, ikon, färg, kontaktinfo och notes.
  UX sketches: None attached
- Story Idea US-039: Spara uppsägningsinstruktion för leverantör
  Value intent: Göra faktisk uppsägning enklare.
  Expected behavior: Leverantör kan bära instruktion som visas vid relevant utgift.
  UX sketches: None attached
- Story Idea US-040: Skapa och redigera kategori
  Value intent: Hålla analysen begriplig.
  Expected behavior: Kategori har namn, ikon och färg och används i utgifter/köp.
  UX sketches: None attached
- Story Idea US-041: Skapa standardregister i ny plånbok
  Value intent: Ge bra startdata.
  Expected behavior: Ny state berikas med vanliga leverantörer och standardkategorier utan att radera användardata.
  UX sketches: None attached
- Story Idea US-042: Skapa handlare/kategoriregel
  Value intent: Importerade köp ska kunna föreslås rätt framåt.
  Expected behavior: Appen sparar mönster för handlare och kan återanvända kategori/leverantör.
  UX sketches: None attached
- Story Idea US-046: Förhandsgranska import
  Value intent: Undvika att fel rader skrivs in.
  Expected behavior: Appen visar antal köp, totalsumma, ignorerade rader och radlista före importcommit.
  UX sketches: None attached

### EPC-006 - Fallback Epic
Scope boundary: Describe what this Epic includes, excludes, or leaves for later.
- Story Idea US-047: Deduplicera importerade köp
  Value intent: Förhindra dubbla transaktioner.
  Expected behavior: Fingerprint på datum, bokfört datum, belopp och handlare används för att hoppa över dubbletter.
  UX sketches: None attached
- Story Idea US-048: Högerjustera belopp i import på mobil
  Value intent: Belopp ska inte skrivas över av handlarnamn.
  Expected behavior: Mobil importlista lägger belopp på egen/högerjusterad yta utan överlapp.
  UX sketches: None attached
- Story Idea US-049: Koppla köp till betalare
  Value intent: Konsumtion ska kunna summeras per person.
  Expected behavior: Importerade/manuella köp får defaultbetalare och kan ändras.
  UX sketches: None attached
- Story Idea US-050: Koppla köp till leverantör
  Value intent: Enskilt köp kan höra ihop med sparad leverantör.
  Expected behavior: Köp kan välja leverantör eller föreslå ny leverantör från handlare.
  UX sketches: None attached
- Story Idea US-051: Uppdatera kategori för samma handlare
  Value intent: Masskorrigera importfriktion.
  Expected behavior: Vid köpredigering kan användaren applicera kategori på alla köp från samma handlare utan tung boxad UI.
  UX sketches: None attached
- Story Idea US-052: Lista och filtrera köp
  Value intent: Hantera inköpshistorik.
  Expected behavior: Inköpsvyn visar köpradar, sök, lista, signaler och redigering.
  UX sketches: None attached
- Story Idea US-053: Markera Granska
  Value intent: Skapa arbetskö för okända köp.
  Expected behavior: Köp kan flaggas för granskning och visas i köpradar/filter.
  UX sketches: None attached
- Story Idea US-055: Markera Återkommande signal
  Value intent: Identifiera köp som sannolikt bör bli återkommande utgift.
  Expected behavior: Köp kan flaggas återkommande och visas med samma signalmönster som andra signaler.
  UX sketches: None attached

### EPC-007 - Fallback Epic
Scope boundary: Describe what this Epic includes, excludes, or leaves for later.
- Story Idea US-056: Markera Värt det
  Value intent: Skilja bra värde från läckor.
  Expected behavior: Värt det-signal kan sättas/släckas och summeras separat.
  UX sketches: None attached
- Story Idea US-057: Markera Business
  Value intent: Separera jobb/utlägg från privat konsumtion.
  Expected behavior: Business-signal kan sättas/släckas och påverka filter/statistik.
  UX sketches: None attached
- Story Idea US-058: Byta namn på Business-signal
  Value intent: Anpassa termen till användarens vardag.
  Expected behavior: Data-vyn låter användaren namnge business-signalen exempelvis Utlägg.
  UX sketches: None attached
- Story Idea US-059: Släcka signal visuellt när samma signal klickas igen
  Value intent: Undvika mobilförvirring.
  Expected behavior: Samma signal/tile togglar av och ser inte längre aktiv ut.
  UX sketches: None attached
- Story Idea US-060: Konvertera köp till återkommande utgift
  Value intent: Göra upptäckt mönster till prognos.
  Expected behavior: Ett köp kan skapa ny återkommande utgift med köpets datum som första betalningsdatum och köpets data förifylld.
  UX sketches: None attached
- Story Idea US-061: Koppla originalköp som första betalning
  Value intent: Undvika dubbelräkning och behålla historik.
  Expected behavior: När köp konverteras länkas originalköpet till den nya återkommande utgiften.
  UX sketches: None attached
- Story Idea US-062: Konvertera återkommande utgift till enskilt köp
  Value intent: Backa fel modellering.
  Expected behavior: En återkommande utgift kan göras om till enskilt köp och eventuella länkade köp kopplas loss.
  UX sketches: None attached
- Story Idea US-063: Välja transaktionstyp
  Value intent: Skilja one-off, återkommande betalning, transfer och ignorerad rad.
  Expected behavior: Köp har typfält och statistik/import filtrerar bort ignorerade rader.
  UX sketches: None attached

### EPC-008 - Fallback Epic
Scope boundary: Describe what this Epic includes, excludes, or leaves for later.
- Story Idea US-065: Visa kategori- och leverantörstoppar för återkommande
  Value intent: Prioritera stora återkommande poster.
  Expected behavior: Kategorier och leverantörer rankas på total periodkostnad och visar månads-/årstakt.
  UX sketches: None attached
- Story Idea US-066: Visa återkommande vs köp
  Value intent: Jämföra åtaganden och faktisk konsumtion.
  Expected behavior: Statistik visar periodtotal för återkommande och enskilda köp sida vid sida.
  UX sketches: None attached
- Story Idea US-067: Rankar handlare efter mest pengar
  Value intent: Stora engångsköp ska inte döljas av frekventa småköp.
  Expected behavior: Mest pengar sorterar strikt på totalbelopp över vald period.
  UX sketches: None attached
- Story Idea US-068: Rankar handlare efter flest transaktioner
  Value intent: Identifiera vanor och frekvens.
  Expected behavior: Flest transaktioner sorterar på antal, med total som tie-breaker.
  UX sketches: None attached
- Story Idea US-069: Rankar kategorier efter mest pengar och antal
  Value intent: Förstå konsumtionsmix både i pengar och aktivitet.
  Expected behavior: Kategorilistor sorterar separat efter totalbelopp respektive antal.
  UX sketches: None attached
- Story Idea US-070: Visa köpintelligens
  Value intent: Ge snabb helhetsbild för köp.
  Expected behavior: KPI:er visar total köpvolym, transaktioner, medelköp och antal handlare.
  UX sketches: None attached
- Story Idea US-071: Visa handlare efter påverkan
  Value intent: Hitta handlare som driver total, trend och snitt.
  Expected behavior: Handlarlista visar total, antal, aktiva månader, snitt och trend/sparkline.
  UX sketches: None attached
- Story Idea US-072: Visa köp per månad och år
  Value intent: Förstå periodmönster.
  Expected behavior: Periodsammanfattningar visar total, snitt och topphandlare per månad/år.
  UX sketches: None attached

### EPC-009 - Fallback Epic
Scope boundary: Describe what this Epic includes, excludes, or leaves for later.
- Story Idea US-073: Visa köpradar
  Value intent: Ge signalbaserad arbetsyta i inköpsvyn.
  Expected behavior: Köpradar visar Granska, Onödigt, Återkommande, Värt det och Business/Utlägg med antal eller belopp.
  UX sketches: None attached
- Story Idea US-074: Visa budgetutfall
  Value intent: Visa om disponibel budget räcker.
  Expected behavior: Statistik jämför budgetbidrag mot återkommande + köp och visar utfall per månad.
  UX sketches: None attached
- Story Idea US-075: Visa beslutsinsikter
  Value intent: Peka ut nästa rimliga åtgärd.
  Expected behavior: Panel visar prioriterade insikter kring leverantör, dragningsdag, köp, toppmånad eller uppsägningskandidat.
  UX sketches: None attached
- Story Idea US-076: Spara lokalt utan konto
  Value intent: Sänka tröskel och skydda integritet.
  Expected behavior: Appen fungerar lokalt med localStorage och kräver ingen inloggning.
  UX sketches: None attached
- Story Idea US-077: Exportera JSON
  Value intent: Göra komplett plånbok portabel.
  Expected behavior: Export innehåller kontext, register, utgifter, perioder, filer, köp och regler.
  UX sketches: None attached
- Story Idea US-078: Exportera ZIP med filer
  Value intent: Säkerhetskopiera både data och bilagor.
  Expected behavior: ZIP innehåller context.json och bifogade filer.
  UX sketches: None attached
- Story Idea US-079: Importera som ny plånbok
  Value intent: Undvika ID-krock och datatapp.
  Expected behavior: Import remappar ID:n och skapar ny kontext bredvid befintlig data.
  UX sketches: None attached
- Story Idea US-080: Exportera CSV
  Value intent: Analysera utanför appen.
  Expected behavior: CSV innehåller återkommande utgifter och köp med relevanta kolumner.
  UX sketches: None attached

### EPC-010 - Fallback Epic
Scope boundary: Describe what this Epic includes, excludes, or leaves for later.
- Story Idea US-081: Exportera PDF-rapport
  Value intent: Dela läsbar sammanfattning.
  Expected behavior: PDF genereras med plånbok, totals och rapportmetadata.
  UX sketches: None attached
- Story Idea US-082: Skapa fristående datafil
  Value intent: Minska risk med bara browser-cache.
  Expected behavior: Användaren kan spara en JSON-datafil via File System Access API där det stöds.
  UX sketches: None attached
- Story Idea US-083: Återansluta datafil
  Value intent: Fortsätta från samma lokala fil.
  Expected behavior: Appen kan öppna tidigare datafil och autospara efter ändringar när rättighet finns.
  UX sketches: None attached
- Story Idea US-084: Dela datafil/handoff
  Value intent: Flytta data mellan enheter eller miljöer.
  Expected behavior: Appen kan skapa delningsbar fil/HTML-handoff som kan läsas tillbaka.
  UX sketches: None attached
- Story Idea US-085: Konfigurera experimentell molnsync
  Value intent: Frivillig egen synk mellan enheter.
  Expected behavior: Användaren kan ange endpoint/token, pulla, pusha, se status och koppla från.
  UX sketches: None attached
- Story Idea US-086: Hantera molnkonflikt
  Value intent: Undvika tyst överskrivning.
  Expected behavior: Sync visar konflikt/error och stoppar automatisk write när revision inte matchar.
  UX sketches: None attached
- Story Idea US-087: Responsiv huvudnavigation
  Value intent: Vyer ska nås på desktop och mobil.
  Expected behavior: Nav innehåller Översikt, Inköp, Statistik, Register, Data och Hjälp där relevant.
  UX sketches: None attached
- Story Idea US-088: Visa hjälpvy
  Value intent: Användaren ska förstå koncepten utan extern manual.
  Expected behavior: Hjälp förklarar plånbok, återkommande utgifter, inköp, signaler, import och data.
  UX sketches: None attached

### EPC-011 - Fallback Epic
Scope boundary: Describe what this Epic includes, excludes, or leaves for later.
- Story Idea US-089: Visa tydliga tomlägen
  Value intent: Tomma listor ska guida nästa action.
  Expected behavior: Tomma paneler visar kort hjälptext och relevant primär action.
  UX sketches: None attached
- Story Idea US-090: Använda modaler för skapande/redigering
  Value intent: Fokusera på uppgiften utan sidbyte.
  Expected behavior: Utgift och köp öppnas i modal med stäng, avbryt och spara.
  UX sketches: None attached
- Story Idea US-091: Använda drawer för detaljer
  Value intent: Behålla översikten medan detaljer visas.
  Expected behavior: Utgiftsdetalj öppnas som sidopanel med åtgärder.
  UX sketches: None attached
- Story Idea US-092: Undvika överlappande text i mobil
  Value intent: Appen ska kännas stabil och läsbar.
  Expected behavior: Belopp, chips, kort och knappar bryter rad eller justeras så innehåll inte kolliderar.
  UX sketches: None attached
- Story Idea US-093: Ha konsekvent signaldesign
  Value intent: Användaren ska känna igen aktiva/inaktiva signaler.
  Expected behavior: Samma signaler använder samma ikon, färgton och aktivt/inaktivt läge över appen.
  UX sketches: None attached
- Story Idea US-094: Simulera bort återkommande utgift
  Value intent: Prova besparingsscenario utan att ändra data.
  Expected behavior: Användaren kan markera utgift som simulerat borttagen från första möjliga månad.
  UX sketches: None attached
- Story Idea US-095: Visa simulerad vy tydligt
  Value intent: Undvika att simulering misstas för verklighet.
  Expected behavior: Statistik visar banner och återställ-knapp när simulering är aktiv.
  UX sketches: None attached
- Story Idea US-096: Återställa simulering
  Value intent: Komma tillbaka till originaldata.
  Expected behavior: Alla simulerade borttagningar kan rensas i ett steg.
  UX sketches: None attached

### EPC-012 - Fallback Epic
Scope boundary: Describe what this Epic includes, excludes, or leaves for later.
- Story Idea US-097: Slå på/av inköpsmodul
  Value intent: Produkten ska kunna fokusera på kärnan.
  Expected behavior: Data/inställning kan aktivera eller dölja inköpsvyn där state stödjer det.
  UX sketches: None attached
- Story Idea US-098: Växla planflagga
  Value intent: Testa premiumrelaterade ytor.
  Expected behavior: Plånbok har free/premium som lokal flagga utan verklig betalvägg.
  UX sketches: None attached
- Story Idea US-099: Visa lokal datarisk
  Value intent: Användaren ska förstå backupansvar.
  Expected behavior: Data-vyn förklarar lokal lagring, browser-risk och backup/export.
  UX sketches: None attached
- Story Idea US-100: Rensa lokal data
  Value intent: Kunna börja om eller ta bort privat data.
  Expected behavior: Reset rensar lokal state, datafilskoppling och cloud config efter explicit handling.
  UX sketches: None attached

## Journey Context
### Mina Utgifter - product regeneration journeys
ID: jc-product-regeneration
Outcome ID: ac8aef2d-735e-4090-8752-ad3cb959c30d
Initiative type: AD
Description: User journeys imported from product-regeneration-package.md.
Notes: Generated deterministically from JNY- sections in the product regeneration package.
#### Journey JNY-001: Skapa första kontrollbilden
Type: user
Primary actor: Ny privat användare
Supporting actors: None captured
Goal: Komma från tom app till en första begriplig vy över återkommande kostnader.
Trigger: Användaren öppnar appen första gången eller efter rensad data.
Journey narrative: Efter första minuten finns en sparad plånbok, minst en betalare, minst en kostnad och en synlig tidslinje som visar ekonomisk påverkan.
Value moment: Efter första minuten finns en sparad plånbok, minst en betalare, minst en kostnad och en synlig tidslinje som visar ekonomisk påverkan.
Success signals: Efter första minuten finns en sparad plånbok, minst en betalare, minst en kostnad och en synlig tidslinje som visar ekonomisk påverkan.
Current state: Not captured yet
Desired future state: Efter första minuten finns en sparad plånbok, minst en betalare, minst en kostnad och en synlig tidslinje som visar ekonomisk påverkan.
Pain points: None captured
Desired support: Efter första minuten finns en sparad plånbok, minst en betalare, minst en kostnad och en synlig tidslinje som visar ekonomisk påverkan.
Exceptions: None captured
Notes: Source refs: EP-001, EP-002, EP-003; US-001, US-002, US-008, US-015, US-016, US-020, US-022
Linked Epics: EP-001, EP-002, EP-003
Linked Story Ideas: US-001, US-002, US-008, US-015, US-016, US-020, US-022
Linked Figma refs: None
- Step JNY-001-STEP-01: Användaren skapar plånbok och lägger till minst en person.
  Actor: Not captured yet
  Description: Användaren skapar plånbok och lägger till minst en person.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-001-STEP-02: Användaren väljer mall eller standardstruktur.
  Actor: Not captured yet
  Description: Användaren väljer mall eller standardstruktur.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-001-STEP-03: Användaren lägger in första återkommande utgift med belopp och period.
  Actor: Not captured yet
  Description: Användaren lägger in första återkommande utgift med belopp och period.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-001-STEP-04: Appen visar tidslinje, månadstotal och utgiftsrad.
  Actor: Not captured yet
  Description: Appen visar tidslinje, månadstotal och utgiftsrad.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-001-STEP-05: Användaren öppnar detalj och ser att posten kan redigeras eller kompl...
  Actor: Not captured yet
  Description: Användaren öppnar detalj och ser att posten kan redigeras eller kompletteras.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
Coverage status: unanalysed
Coverage suggested Epics: None
Coverage suggested Story Ideas: None
Coverage suggested new Story Ideas: None
Coverage notes: Not captured yet

#### Journey JNY-002: Hitta uppsägningsmöjlighet
Type: user
Primary actor: Användare med flera abonnemang
Supporting actors: None captured
Goal: Förstå när en kostnad kan tas bort och få minnesstöd.
Trigger: Användaren vill minska månadskostnad.
Journey narrative: Appen visar realistisk frigörelsetid, inte bara dagens belopp, och gör åtgärden minnesbar.
Value moment: Appen visar realistisk frigörelsetid, inte bara dagens belopp, och gör åtgärden minnesbar.
Success signals: Appen visar realistisk frigörelsetid, inte bara dagens belopp, och gör åtgärden minnesbar.
Current state: Not captured yet
Desired future state: Appen visar realistisk frigörelsetid, inte bara dagens belopp, och gör åtgärden minnesbar.
Pain points: None captured
Desired support: Appen visar realistisk frigörelsetid, inte bara dagens belopp, och gör åtgärden minnesbar.
Exceptions: None captured
Notes: Source refs: EP-004, EP-008, EP-011; US-030, US-031, US-032, US-033, US-034, US-075, US-094
Linked Epics: EP-004, EP-008, EP-011
Linked Story Ideas: US-030, US-031, US-032, US-033, US-034, US-075, US-094
Linked Figma refs: None
- Step JNY-002-STEP-01: Användaren öppnar statistik eller tidslinje och identifierar en påver...
  Actor: Not captured yet
  Description: Användaren öppnar statistik eller tidslinje och identifierar en påverkbar kostnad.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-002-STEP-02: Användaren öppnar detaljen och anger eller kontrollerar uppsägningstid.
  Actor: Not captured yet
  Description: Användaren öppnar detaljen och anger eller kontrollerar uppsägningstid.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-002-STEP-03: Appen visar låst period och tidigaste fria månad.
  Actor: Not captured yet
  Description: Appen visar låst period och tidigaste fria månad.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-002-STEP-04: Användaren skapar/behåller påminnelse och exporterar kalenderfil vid ...
  Actor: Not captured yet
  Description: Användaren skapar/behåller påminnelse och exporterar kalenderfil vid behov.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-002-STEP-05: Användaren kan simulera bort kostnaden och se effekt utan att spara a...
  Actor: Not captured yet
  Description: Användaren kan simulera bort kostnaden och se effekt utan att spara avslut.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
Coverage status: unanalysed
Coverage suggested Epics: None
Coverage suggested Story Ideas: None
Coverage suggested new Story Ideas: None
Coverage notes: Not captured yet

#### Journey JNY-003: Importera och rensa köp
Type: user
Primary actor: Användare med kontoutdrag
Supporting actors: None captured
Goal: Få in faktisk konsumtion och sortera bort sådant som inte behöver granskas.
Trigger: Användaren har en CSV, XLSX eller PDF från kort/konto.
Journey narrative: Import känns kontrollerad; ingen rad skrivs in utan förhandsgranskning och mobilen visar belopp läsbart.
Value moment: Import känns kontrollerad; ingen rad skrivs in utan förhandsgranskning och mobilen visar belopp läsbart.
Success signals: Import känns kontrollerad; ingen rad skrivs in utan förhandsgranskning och mobilen visar belopp läsbart.
Current state: Not captured yet
Desired future state: Import känns kontrollerad; ingen rad skrivs in utan förhandsgranskning och mobilen visar belopp läsbart.
Pain points: None captured
Desired support: Import känns kontrollerad; ingen rad skrivs in utan förhandsgranskning och mobilen visar belopp läsbart.
Exceptions: None captured
Notes: Source refs: EP-006, EP-007, EP-008, EP-010; US-045, US-046, US-047, US-048, US-052, US-053, US-054, US-056, US-057, US-073
Linked Epics: EP-006, EP-007, EP-008, EP-010
Linked Story Ideas: US-045, US-046, US-047, US-048, US-052, US-053, US-054, US-056, US-057, US-073
Linked Figma refs: None
- Step JNY-003-STEP-01: Användaren väljer importera kontoutdrag.
  Actor: Not captured yet
  Description: Användaren väljer importera kontoutdrag.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-003-STEP-02: Appen tolkar filen och visar importförhandsgranskning.
  Actor: Not captured yet
  Description: Appen tolkar filen och visar importförhandsgranskning.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-003-STEP-03: Användaren kontrollerar antal, totalsumma och enskilda rader.
  Actor: Not captured yet
  Description: Användaren kontrollerar antal, totalsumma och enskilda rader.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-003-STEP-04: Användaren importerar och går till Inköp.
  Actor: Not captured yet
  Description: Användaren importerar och går till Inköp.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-003-STEP-05: Användaren använder köpradar och signaler för att granska, markera on...
  Actor: Not captured yet
  Description: Användaren använder köpradar och signaler för att granska, markera onödigt, värt det eller business.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
Coverage status: unanalysed
Coverage suggested Epics: None
Coverage suggested Story Ideas: None
Coverage suggested new Story Ideas: None
Coverage notes: Not captured yet

#### Journey JNY-004: Skapa återkommande från köp
Type: user
Primary actor: Användare som upptäcker abonnemang i kontoutdrag
Supporting actors: None captured
Goal: Flytta ett återkommande mönster från historiskt köp till framtidsprognos.
Trigger: Ett köp markeras som Återkommande eller känns som abonnemang.
Journey narrative: Användaren slipper dubbelinmatning och får både historik och prognos utan dubbelräkning.
Value moment: Användaren slipper dubbelinmatning och får både historik och prognos utan dubbelräkning.
Success signals: Användaren slipper dubbelinmatning och får både historik och prognos utan dubbelräkning.
Current state: Not captured yet
Desired future state: Användaren slipper dubbelinmatning och får både historik och prognos utan dubbelräkning.
Pain points: None captured
Desired support: Användaren slipper dubbelinmatning och får både historik och prognos utan dubbelräkning.
Exceptions: None captured
Notes: Source refs: EP-006, EP-007, EP-008; US-055, US-060, US-061, US-064, US-066
Linked Epics: EP-006, EP-007, EP-008
Linked Story Ideas: US-055, US-060, US-061, US-064, US-066
Linked Figma refs: None
- Step JNY-004-STEP-01: Användaren öppnar köpmodalen.
  Actor: Not captured yet
  Description: Användaren öppnar köpmodalen.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-004-STEP-02: Köpet är förifyllt med handlare, belopp, kategori, betalare och datum.
  Actor: Not captured yet
  Description: Köpet är förifyllt med handlare, belopp, kategori, betalare och datum.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-004-STEP-03: Användaren väljer skapa återkommande.
  Actor: Not captured yet
  Description: Användaren väljer skapa återkommande.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-004-STEP-04: Appen skapar återkommande utgift med köpdatum som första betalningsda...
  Actor: Not captured yet
  Description: Appen skapar återkommande utgift med köpdatum som första betalningsdatum.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-004-STEP-05: Originalköpet kopplas som första betalning och försvinner inte ur his...
  Actor: Not captured yet
  Description: Originalköpet kopplas som första betalning och försvinner inte ur historiken.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
Coverage status: unanalysed
Coverage suggested Epics: None
Coverage suggested Story Ideas: None
Coverage suggested new Story Ideas: None
Coverage notes: Not captured yet

#### Journey JNY-005: Göra återkommande till enskilt köp
Type: user
Primary actor: Användare som felklassat en kostnad
Supporting actors: None captured
Goal: Korrigera en post som inte längre ska påverka återkommande prognos.
Trigger: Användaren upptäcker att en återkommande utgift egentligen var ett enskilt köp.
Journey narrative: Fel klassning kan rättas utan manuell kopiering.
Value moment: Fel klassning kan rättas utan manuell kopiering.
Success signals: Fel klassning kan rättas utan manuell kopiering.
Current state: Not captured yet
Desired future state: Fel klassning kan rättas utan manuell kopiering.
Pain points: None captured
Desired support: Fel klassning kan rättas utan manuell kopiering.
Exceptions: None captured
Notes: Source refs: EP-002, EP-006, EP-007; US-012, US-043, US-062, US-063
Linked Epics: EP-002, EP-006, EP-007
Linked Story Ideas: US-012, US-043, US-062, US-063
Linked Figma refs: None
- Step JNY-005-STEP-01: Användaren öppnar utgiftsdetaljen.
  Actor: Not captured yet
  Description: Användaren öppnar utgiftsdetaljen.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-005-STEP-02: Användaren väljer konvertera till enskilt köp.
  Actor: Not captured yet
  Description: Användaren väljer konvertera till enskilt köp.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-005-STEP-03: Appen skapar köp med motsvarande data.
  Actor: Not captured yet
  Description: Appen skapar köp med motsvarande data.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-005-STEP-04: Återkommande utgift tas bort/avslutas enligt konverteringsregel och k...
  Actor: Not captured yet
  Description: Återkommande utgift tas bort/avslutas enligt konverteringsregel och kopplade köp lossas.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
Coverage status: unanalysed
Coverage suggested Epics: None
Coverage suggested Story Ideas: None
Coverage suggested new Story Ideas: None
Coverage notes: Not captured yet

#### Journey JNY-006: Analysera påverkan
Type: user
Primary actor: Användare som vill prioritera nästa beslut
Supporting actors: None captured
Goal: Se vilka kostnader, handlare, kategorier och perioder som påverkar mest.
Trigger: Användaren går till Statistik efter att ha lagt in/importerat data.
Journey narrative: Pengalistor rankar efter det mått de säger: totalbelopp, antal eller medel som visad sekundärinformation.
Value moment: Pengalistor rankar efter det mått de säger: totalbelopp, antal eller medel som visad sekundärinformation.
Success signals: Pengalistor rankar efter det mått de säger: totalbelopp, antal eller medel som visad sekundärinformation.
Current state: Not captured yet
Desired future state: Pengalistor rankar efter det mått de säger: totalbelopp, antal eller medel som visad sekundärinformation.
Pain points: None captured
Desired support: Pengalistor rankar efter det mått de säger: totalbelopp, antal eller medel som visad sekundärinformation.
Exceptions: None captured
Notes: Source refs: EP-008; US-064, US-065, US-066, US-067, US-068, US-069, US-070, US-071, US-072, US-074, US-075
Linked Epics: EP-008
Linked Story Ideas: US-064, US-065, US-066, US-067, US-068, US-069, US-070, US-071, US-072, US-074, US-075
Linked Figma refs: None
- Step JNY-006-STEP-01: Användaren öppnar Statistik.
  Actor: Not captured yet
  Description: Användaren öppnar Statistik.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-006-STEP-02: Appen visar återkommande analys, köpvolym, budgetutfall och beslutsin...
  Actor: Not captured yet
  Description: Appen visar återkommande analys, köpvolym, budgetutfall och beslutsinsikter.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-006-STEP-03: Användaren granskar "Mest pengar" och "Flest transaktioner" separat.
  Actor: Not captured yet
  Description: Användaren granskar "Mest pengar" och "Flest transaktioner" separat.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-006-STEP-04: Användaren identifierar en topphandlare, kategori eller dragningsdag.
  Actor: Not captured yet
  Description: Användaren identifierar en topphandlare, kategori eller dragningsdag.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-006-STEP-05: Användaren går tillbaka till relevant detalj eller filter.
  Actor: Not captured yet
  Description: Användaren går tillbaka till relevant detalj eller filter.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
Coverage status: unanalysed
Coverage suggested Epics: None
Coverage suggested Story Ideas: None
Coverage suggested new Story Ideas: None
Coverage notes: Not captured yet

#### Journey JNY-007: Skydda lokal data
Type: user
Primary actor: Användare som vill undvika datatapp
Supporting actors: None captured
Goal: Exportera, spara eller flytta data utan konto.
Trigger: Användaren går till Data-vyn eller ska byta enhet/browser.
Journey narrative: Appen är lokal-first men gör backup och flytt tydligt och möjligt.
Value moment: Appen är lokal-first men gör backup och flytt tydligt och möjligt.
Success signals: Appen är lokal-first men gör backup och flytt tydligt och möjligt.
Current state: Not captured yet
Desired future state: Appen är lokal-first men gör backup och flytt tydligt och möjligt.
Pain points: None captured
Desired support: Appen är lokal-first men gör backup och flytt tydligt och möjligt.
Exceptions: None captured
Notes: Source refs: EP-009, EP-012; US-076, US-077, US-078, US-079, US-080, US-081, US-082, US-083, US-084, US-099, US-100
Linked Epics: EP-009, EP-012
Linked Story Ideas: US-076, US-077, US-078, US-079, US-080, US-081, US-082, US-083, US-084, US-099, US-100
Linked Figma refs: None
- Step JNY-007-STEP-01: Användaren läser lokal datarisk i Data-vyn.
  Actor: Not captured yet
  Description: Användaren läser lokal datarisk i Data-vyn.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-007-STEP-02: Användaren exporterar JSON/ZIP eller skapar datafil.
  Actor: Not captured yet
  Description: Användaren exporterar JSON/ZIP eller skapar datafil.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-007-STEP-03: Vid ny miljö importerar användaren filen som ny plånbok eller ersätte...
  Actor: Not captured yet
  Description: Vid ny miljö importerar användaren filen som ny plånbok eller ersätter state via datafil.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-007-STEP-04: Vid behov skapas PDF/CSV för rapport eller vidare analys.
  Actor: Not captured yet
  Description: Vid behov skapas PDF/CSV för rapport eller vidare analys.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
Coverage status: unanalysed
Coverage suggested Epics: None
Coverage suggested Story Ideas: None
Coverage suggested new Story Ideas: None
Coverage notes: Not captured yet

#### Journey JNY-008: Anpassa signaler och moduler
Type: user
Primary actor: Power user eller hushållsansvarig
Supporting actors: None captured
Goal: Göra appens språk och funktioner mer relevanta för vardagen.
Trigger: Användaren vill kalla Business för Utlägg eller dölja köpmodul.
Journey narrative: Anpassning ändrar språk och synlighet konsekvent utan att ändra historisk data.
Value moment: Anpassning ändrar språk och synlighet konsekvent utan att ändra historisk data.
Success signals: Anpassning ändrar språk och synlighet konsekvent utan att ändra historisk data.
Current state: Not captured yet
Desired future state: Anpassning ändrar språk och synlighet konsekvent utan att ändra historisk data.
Pain points: None captured
Desired support: Anpassning ändrar språk och synlighet konsekvent utan att ändra historisk data.
Exceptions: None captured
Notes: Source refs: EP-007, EP-012; US-058, US-097, US-098
Linked Epics: EP-007, EP-012
Linked Story Ideas: US-058, US-097, US-098
Linked Figma refs: None
- Step JNY-008-STEP-01: Användaren öppnar Data/inställningar.
  Actor: Not captured yet
  Description: Användaren öppnar Data/inställningar.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-008-STEP-02: Användaren byter label på business-signalen.
  Actor: Not captured yet
  Description: Användaren byter label på business-signalen.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-008-STEP-03: Användaren slår på/av inköpsmodul eller testar planflagga.
  Actor: Not captured yet
  Description: Användaren slår på/av inköpsmodul eller testar planflagga.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
- Step JNY-008-STEP-04: Appen visar ny term i radar, filter, köpmodal och statistik.
  Actor: Not captured yet
  Description: Appen visar ny term i radar, filter, köpmodal och statistik.
  Current pain: Not captured yet
  Desired support: Not captured yet
  Decision point: No
Coverage status: unanalysed
Coverage suggested Epics: None
Coverage suggested Story Ideas: None
Coverage suggested new Story Ideas: None
Coverage notes: Not captured yet


## Downstream AI Instructions

### Always-on Controls
- Preserve Epic -> Story -> Test traceability: Keep downstream AI outputs linked from Epic through Story to later test intent.
- Preserve AI-level-specific review expectations: Keep review strictness aligned with the current AI level.
- Preserve human approval on critical decisions: Do not let downstream AI remove human approval where decision impact or governance requires it.
- Preserve security/privacy/compliance constraints: Carry security, privacy, compliance, and data sensitivity constraints forward into downstream AI behavior.
- Preserve testability and binary acceptance intent: Keep downstream refinement tied to later testability and acceptance clarity.
- Preserve reproducibility expectations at higher AI levels: At higher AI levels, keep logs, reproducibility, and reviewability expectations visible in downstream work.

### Epic Refinement
- E1 Keep each Epic centered on one coherent capability/value area: YES (recommended YES)
- E2 Separate user-facing Epics from enabling/platform/compliance Epics: YES (recommended YES)
- E3 Minimize cross-Epic dependencies: YES (recommended YES)
- E4 Preserve Journey Context during Epic refinement: YES (recommended YES)
- E5 Prefer standard patterns before variants: YES (recommended YES)
- E6 Model transition/coexistence work as explicit Epics: NO (recommended NO)
- E7 Model operability/stability work as explicit Epics: NO (recommended NO)

### Story Idea Refinement
- S1 Keep each Story Idea centered on one primary intent: YES (recommended YES)
- S2 Tie each Story Idea to an actor, journey step, or trigger: YES (recommended YES)
- S3 Split large Story Ideas before Design if verification would be hard: YES (recommended YES)
- S4 Require future testability when refining Story Ideas: YES (recommended YES)
- S5 Keep architecture direction lightweight at Story Idea level: YES (recommended YES)
- S6 Force Story Type classification during refinement: YES (recommended YES)
- S7 Force AI Usage Scope visibility when downstream AI is expected: YES (recommended YES)
- S8 Require rollback/fallback thinking for risky Story Ideas: NO (recommended NO)

### Journey Usage
- J1 Use Journey Context as a primary refinement source when present: YES (recommended YES)
- J2 Preserve journey-to-story traceability when Journey Context exists: YES (recommended YES)
- J3 Allow AI to suggest missing journey/story mappings: YES (recommended YES)
- J4 Prefer actor and flow continuity when Journey Context exists: YES (recommended YES)
- J5 Allow Story Ideas to stand without Journey Context when Journey Context is absent: YES (recommended YES)

### Design Guidance
- D1 Optimize for modularity and future changeability: YES (recommended YES)
- D2 Prefer reuse when fit-for-purpose: NO (recommended NO)
- D3 Prefer integration discipline over shortcuts: YES (recommended YES)
- D4 Make data ownership and classification explicit: YES (recommended YES)
- D5 Preserve security/privacy/compliance in design proposals: YES (recommended YES)
- D6 Make observability and operability part of Design: YES (recommended YES)
- D7 Separate experimentation zones from stable zones: YES (recommended YES)
- D8 Prefer continuity over architectural purity when needed: NO (recommended NO)
- D9 Prefer phased rollout over big bang: NO (recommended NO)

### Build Guidance
- B1 Require Story and Epic traceability for all implementation work: YES (recommended YES)
- B2 Require traceability for AI-generated implementation artifacts: YES (recommended YES)
- B3 Enforce AI-level-specific review and reproducibility rules: YES (recommended YES)
- B4 Require test strategy proportional to Story risk/type: YES (recommended YES)
- B5 Require architecture/security checks in review or CI/CD: YES (recommended YES)
- B6 Prefer automatically generated release evidence: YES (recommended YES)
- B7 Treat support/runbook/handover updates as part of done: NO (recommended NO)
- B8 Prefer low blast radius and reversibility in rollout: NO (recommended NO)
- B9 Allow emergency handling only with retroactive traceability: NO (recommended NO)

### Custom Instructions
- High General: Traceable AI Delivery Protocol
  # Traceable AI Delivery Protocol

You are receiving a product handoff for AI-assisted discovery, design, refinement and implementation.

You may work with high autonomy, but you must preserve full traceability from original handoff to design decisions, implementation artifacts, tests, extra scope and final customer reporting.

## Prime Directive

Story Ideas are directional input, not a final implementation contract.

Preserve the original baseline and record all learning, refinement, decomposition, design choices, scope additions, scope removals, deferrals and implementation changes as traceable decisions.

No implementation artifact may exist without one of: baseline requirement ID, approved decision ID, approved extension ID, technical enabler ID, bugfix ID, or documented risk/compliance reason.

If a change cannot be mapped to a trace ID, stop and classify it before implementation.

## 1. Baseline Freeze

At the start of work, create or identify a frozen baseline from the handoff. The baseline must include Outcome IDs, Epic IDs, Story Idea IDs, non-functional requirement IDs, UX constraint IDs, scope-in items, scope-out items, acceptance/test intent where available, and journey mappings where available.

The baseline is immutable. Later learning must be captured as decisions, extensions, drops, risks, technical enablers or bugfixes.

Required artifacts: docs/traceability/requirements-baseline.md and docs/traceability/requirements-baseline.json. If the project uses another documentation root, place equivalent files there and state the path.

## 2. Trace ID Taxonomy

Use these IDs consistently: OUT-* Outcome; EP-* Epic; SC-* Story or Story Idea; NFR-* Non-functional requirement; UX-* UX/design constraint; J-* Journey or journey step; DEC-* Decision or refinement inside existing scope; EXT-* Scope extension beyond baseline; DROP-* explicitly deferred/rejected/removed scope; TECH-* technical enabler; BUG-* bugfix or regression correction; RISK-* risk/security/privacy/compliance/release concern.

Every implementation artifact must map to at least one trace ID.

## 3. Change Classification

Before proposing or implementing a change, classify it as one of: implements_baseline, refines_baseline, extends_scope, touches_scope_out, drops_or_defers_scope, technical_enabler, or bugfix_or_regression.

refines_baseline requires a DEC-*. extends_scope requires an EXT-*. touches_scope_out requires explicit human approval and must be marked as experimental or customer-decision-needed unless formally approved. drops_or_defers_scope requires a DROP-*. technical_enabler requires TECH-* linked to source IDs. bugfix_or_regression requires BUG-* linked to affected source IDs.

## 4. Human Approval Gate

The human must explicitly approve material scope changes, anything touching scope-out, security/privacy/data/compliance decisions, business rule changes, user-facing terminology changes with customer impact, release readiness decisions, acceptance of partially implemented requirements, and decisions to defer/reject/drop scope.

Treat lightweight answers such as OK, ej OK, andra, defer, OK som experiment, OK som scope-tillagg, and OK men kraver kundbeslut as formal decision inputs and record them.

## 5. Required AI Behavior Before Build

Before implementation, state which baseline IDs are being implemented, whether DEC/EXT/DROP/TECH/BUG/RISK is required, whether human approval is required, which artifacts will likely be created or updated, which tests or verification evidence will be added, and whether any scope-out item is touched.

Do not proceed with material implementation if trace classification is missing.

## 6. Decision Log

Maintain docs/traceability/decision-log.md throughout discovery, design and build. Each entry must include ID, date, type, source baseline IDs, decision, motivation, human approval status, customer decision status if relevant, implementation status, and affected artifacts when known.

## 7. Implementation Map

Maintain docs/traceability/implementation-map.json. The map must connect requirement or decision ID, status, implementation artifacts, tests, documentation, known deviations, remaining gaps, and evidence.

## 8. Untraced Artifact Rule

Periodically check for artifacts that appear to implement user-facing behavior without trace mapping. Maintain docs/traceability/untraced-artifacts-report.md. Resolve each untraced artifact by mapping it to an existing trace ID, creating and approving DEC/EXT/TECH/BUG, marking it as risk/compliance, or removing/deferring it.

## 9. Scope-Out Handling

If implementation touches a scope-out item, stop and ask for explicit approval before building or formalizing it. Mark the decision as experiment, requires_customer_decision, approved_extension, rejected, or deferred. Do not silently convert scope-out into delivered scope.

## 10. Testing and Verification

Verification must be proportional to risk and story type. For each implemented item, record automated tests where practical, manual verification where automation is not practical, gaps where neither exists, and build or release evidence when relevant. Testing must remain tied to trace IDs.

## 11. Report Generation

At the end of each phase and before customer delivery, generate docs/traceability/traceability-report.md and optionally docs/traceability/traceability-pack.json. Separate agreed baseline scope, implemented according to baseline, implemented differently through decision, extra implemented through extension, deferred/rejected/dropped, scope-out touched, gaps, untraced artifacts, tests/release evidence, and customer decisions required.

Do not hide extra implementation inside original scope. Extra implementation is acceptable only when explicitly classified and traceable.

## 12. Definition of Done

A story, decision, extension, bugfix or technical enabler is not done until it has a trace ID, mapped implementation artifacts, proportional verification, recorded deviations, recorded required human/customer decisions, and appears correctly in the traceability report.

## 13. Accelerated Discovery Constraint

Accelerated discovery does not remove traceability obligations. Proceed autonomously for ordinary refinement, but pause or request explicit approval when a feature is outside baseline scope, a scope-out item is touched, user-facing behavior changes materially, data/security/privacy assumptions change, implementation cannot be mapped to a trace ID, or a requirement is weakened, deferred or reinterpreted.

For low-risk refinements inside baseline scope, create a proposed decision-log entry and continue unless the human rejects it.

## 14. Existing Guidance Still Applies

Preserve Outcome -> Epic -> Story -> Test. Keep each Epic centered on one coherent capability/value area. Separate user-facing Epics from enabling, platform and compliance Epics. Minimize cross-Epic dependencies. Preserve Journey Context during refinement when it exists. Prefer standard reusable patterns before local variants. Model transition, coexistence, operability and stability work explicitly.

Refine Story Ideas so they remain mappable to later implementation and test intent. Keep each Story Idea centered on one primary intent. Tie each Story Idea to an actor, journey step or trigger where possible. Split large Story Ideas before design if verification would be hard. Require future testability. Keep architecture direction lightweight at Story Idea level. Classify Story Type. Make AI Usage Scope visible when downstream AI is expected.

Preserve security, privacy, compliance, data ownership and data classification in every design proposal. Separate experimentation zones from stable zones. Prefer phased rollout, low blast radius and reversibility. Treat support, runbook and handover updates as part of done when relevant. Review strictness and reproducibility must remain aligned with AI Level 3.

## 15. Final Customer Reporting Standard

Final customer-facing reporting must answer: what was agreed from the original handoff; what was implemented exactly as agreed; what was implemented differently and why; what was added beyond original scope; which extra items require customer approval; what was deferred or rejected; what remains as a gap; what tests or evidence prove the implementation; and whether any untraced artifacts remain.

Target final claim: We can show full traceability from baseline to decisions, implementation, tests and final report. Extra functionality is explicitly marked as extension or experiment. No production-facing feature remains without a documented reason.

## Tool Implementation Requirement

When implemented in a tool, the tool should inject this protocol into each BMAD handoff, create baseline files, propose DEC/EXT/DROP/TECH/BUG/RISK IDs, interpret simple human answers as decisions, update the decision log, update the implementation map, flag scope-out, flag untraced artifacts, and generate the customer report.

### Deviations from Recommended Defaults
- No preferences currently deviate from the recommended defaults.

### Warnings / Validation Notes
- No hard validation issues or warnings are currently active.

### Generated Downstream Guidance
#### Epic Refinement Guide
- Interpret Epic refinement through the AD delivery posture at AI Level 3.
- Keep the main delivery structure Outcome -> Epic -> Story -> Test intact.
- Keep each Epic centered on one coherent capability/value area: AI should refine Epics into coherent value/capability containers.
- Separate user-facing Epics from enabling/platform/compliance Epics: AI should split enabling work into distinct Epics.
- Minimize cross-Epic dependencies: AI should reduce coupling between Epics.
- Preserve Journey Context during Epic refinement: AI should preserve journey influence in Epic refinement.
- Prefer standard patterns before variants: AI should challenge local variants and seek reusable Epic patterns.
- Model transition/coexistence work as explicit Epics: AI may mix transition work into target-state Epics.
- Model operability/stability work as explicit Epics: AI may keep focus on visible change only.
- Always-on controls remain active: Preserve Epic -> Story -> Test traceability; Preserve AI-level-specific review expectations; Preserve human approval on critical decisions; Preserve security/privacy/compliance constraints; Preserve testability and binary acceptance intent; Preserve reproducibility expectations at higher AI levels.
#### Story Idea Refinement Guide
- Refine Story Ideas so they remain mappable to later implementation and test intent.
- Keep each Story Idea centered on one primary intent: AI should split oversized Story Ideas into focused candidates.
- Tie each Story Idea to an actor, journey step, or trigger: AI should preserve role/flow/trigger context.
- Split large Story Ideas before Design if verification would be hard: AI should split Story Ideas that would be hard to verify.
- Require future testability when refining Story Ideas: AI must reformulate Story Ideas so they can become testable later.
- Keep architecture direction lightweight at Story Idea level: AI should avoid premature architecture lock-in.
- Force Story Type classification during refinement: AI should classify Story Ideas explicitly.
- Force AI Usage Scope visibility when downstream AI is expected: AI should mark expected AI usage scope explicitly.
- Require rollback/fallback thinking for risky Story Ideas: AI may postpone rollback/fallback thinking.
- Do not let downstream AI remove testability, traceability, or human review expectations.
#### Journey Usage Guide
- Journey Context exists and should be considered when refining Epics, Story Ideas, Design guidance, and Build guidance.
- Use Journey Context as a primary refinement source when present: AI should actively use Journey Context to refine Epics and Story Ideas.
- Preserve journey-to-story traceability when Journey Context exists: AI should preserve visible traceability between Journey elements and Story Ideas.
- Allow AI to suggest missing journey/story mappings: AI should propose likely Story/Epic mappings where missing.
- Prefer actor and flow continuity when Journey Context exists: AI should favor actor/flow continuity when refining.
- Allow Story Ideas to stand without Journey Context when Journey Context is absent: AI should proceed normally even if no Journey Context exists.
- If Journey Context is absent, do not block Story Idea refinement solely because journey data is missing.
#### Design AI Guidance
- In Design, inherit the Source of Truth from Outcome, Problem, Baseline, Solution Context, Constraints, UX Principles, Non-functional Requirements, Additional Requirements, Data Sensitivity, Journey Context when present, Epics, Story Ideas, and optional references.
- Optimize for modularity and future changeability: AI should prefer changeable modular structures.
- Prefer reuse when fit-for-purpose: AI may propose more net-new implementation.
- Prefer integration discipline over shortcuts: AI should avoid tactical shortcuts in integration design.
- Make data ownership and classification explicit: AI must keep data ownership/classification explicit.
- Preserve security/privacy/compliance in design proposals: AI must embed security/privacy/compliance constraints in design proposals.
- Make observability and operability part of Design: AI should include observability/operability in design thinking.
- Separate experimentation zones from stable zones: AI should preserve exploration vs. stable separation.
- Prefer continuity over architectural purity when needed: AI may favor cleaner target architecture over safer transition.
- Prefer phased rollout over big bang: AI may allow larger cutover plans.
- Security, privacy, compliance, and data classification constraints must stay active in every design proposal.
#### Build AI Guidance
- In Build, preserve Story and Epic lineage, review discipline, test expectations, release evidence, and rollout control.
- Require Story and Epic traceability for all implementation work: AI must preserve explicit Story/Epic traceability.
- Require traceability for AI-generated implementation artifacts: AI output must remain traceable.
- Enforce AI-level-specific review and reproducibility rules: AI must tailor Build guidance to AI level.
- Require test strategy proportional to Story risk/type: AI must require verification proportional to risk and type.
- Require architecture/security checks in review or CI/CD: AI should include structural/security checks in Build guidance.
- Prefer automatically generated release evidence: AI should assume evidence generation where practical.
- Treat support/runbook/handover updates as part of done: AI may focus mainly on code/test.
- Prefer low blast radius and reversibility in rollout: AI may allow broader-impact changes.
- Allow emergency handling only with retroactive traceability: AI may normalize emergency shortcuts.
- Review strictness and reproducibility must remain aligned with AI Level 3.

## Tollgate 1 Approval Context
Approval status: Approved
Approved version: 43
Approved at: 2026-05-05T13:35:42.531Z
- aqa (supplier)
  Person: Denzel Washington
  Role title: AI Quality Authority
  Approved at: 2026-05-05T13:35:40.497Z
  Motivation: ok
- value owner (customer)
  Person: Anne Hathaway
  Role title: Value Owner
  Approved at: 2026-05-05T13:35:21.088Z
  Motivation: ok

## Recommended Use In The Next Step
Use this Framing package as the governed source of truth when you move into design, story refinement or structured delivery planning with BMAD or another AI tool.
- Treat the customer handshake, baseline and AI/risk posture as the framing source of truth.
- Treat Epics and Story Ideas as directional input for design and later delivery refinement, not as fixed implementation steps.
- If later steps create Delivery Stories or extra work items, keep them traceable back to this Framing package or record them explicitly as feedback-loop additions.
- Use the approval section to understand whether this Framing version is already signed off for Tollgate 1.
- Use the UX sketch references where they exist to preserve visual intent in the next step.

## Export Metadata
Lifecycle state: active
Origin type: imported
Exported at: 2026-05-05T13:37:57.648Z