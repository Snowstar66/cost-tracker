# Requirements Baseline

Generated: 2026-05-05T13:50:19.341Z
Source: `docs/out-001-bmad-prepared-framing-handoff.json`
Approval: approved, version 43, 2026-05-05T13:35:42.531Z

This file freezes the governed handoff as the implementation baseline. Later learning must be recorded in `decision-log.md` as DEC/EXT/DROP/TECH/BUG/RISK entries.

## Outcome

- ID: OUT-001
- Title: Trygg kontroll över privata återkommande kostnader och enskilda köp
- Timeframe: 2026 Q2
- Value owner: Anne Hathaway
- AI level: level_3
- Risk profile: low
- Data sensitivity: Hög. Men hanteras med lokal fillagring

## Problem

Private users and households need a local-first way to understand recurring costs, one-off purchases, cancellation opportunities, and spending impact without account or bank connection.

## Outcome Statement

En privatperson eller ett hushåll ska snabbt förstå vad som dras, vad som kan sägas upp, vad som köps enskilt och hur privatekonomin påverkas över tid, utan konto eller bankkoppling.

## Epics

| ID | Title | Stories | Scope boundary |
| --- | --- | ---: | --- |
| EP-001 | Plånbok, onboarding och dataseparering | 4 | Scope in: Inkluderar skapa, välja, duplicera och konfigurera plånbok samt första användare. Exkluderar kontobaserad multi-user-synk. |
| EP-002 | Återkommande utgifter | 0 | Scope in: Inkluderar belopp, period, leverantör, kategori, betalare, datum, status, signaler och anteckningar. Exkluderar fakturaskanning som automatisk källa. |
| EP-003 | Tidslinje och översikt | 0 | Scope in: Inkluderar desktop-tidslinje, mobilöversikt, filter, sök, totals och snabblänkar. Exkluderar avancerad kalenderplanering. |
| EP-004 | Uppsägning, låsning och påminnelser | 0 | Scope in: Inkluderar uppsägningstid, låst period, tidigaste fria månad, avslut, påminnelse och kalenderexport. Exkluderar automatisk uppsägning hos leverantör. |
| EP-005 | Register och återanvändbar metadata | 0 | Scope in: Inkluderar personer, leverantörer, kategorier, färg/ikon, kontaktinfo och kategoriregler. Exkluderar full CRM eller dokumentarkiv. |
| EP-006 | Enskilda köp och kontoutdragsimport | 3 | Scope in: Inkluderar manuella köp, import från CSV/XLSX/PDF, importförhandsgranskning, deduplicering, kategorisering och köpdetalj. Exkluderar direkt bankintegration. |
| EP-007 | Signaler, klassning och konvertering | 1 | Scope in: Inkluderar Granska, Onödigt, Återkommande, Värt det, Business, namnbyte av business-signal, köp -> återkommande och återkommande -> köp. |
| EP-008 | Statistik och beslutsstöd | 0 | Scope in: Inkluderar återkommande analys, köpstatistik, köpradar, budgetutfall, kategori/person/leverantör, topphandlare och periodtrender. |
| EP-009 | Dataexport, backup, datafil och sync | 0 | Scope in: Inkluderar localStorage, JSON/ZIP/CSV/PDF/ICS, datafil, delningsfil, import som ny plånbok och experimentell molnsync via egen endpoint. Exkluderar hosted backend som krav. |
| EP-010 | Responsiv UX, hjälp och tomlägen | 0 | Scope in: Inkluderar navigering, modaler, drawer, tomlägen, hjälpvy, mobilanpassade kort och primära actions. Exkluderar marketing-landningssida. |
| EP-011 | Simulering och scenarioanalys | 0 | Scope in: Inkluderar simulera bort återkommande utgift, simulerad statistik och återställning. Exkluderar flerårig forecasting med osäkerhetsmodell. |
| EP-012 | Produktadministration och planflaggor | 0 | Scope in: Inkluderar Data-vy, lokal varning, premium/free-flagga, köp på/av och namn på business-signal. Exkluderar riktig betalvägg. |
| EPC-001 | Fallback Epic | 8 | Describe what this Epic includes, excludes, or leaves for later. |
| EPC-002 | Fallback Epic | 8 | Describe what this Epic includes, excludes, or leaves for later. |
| EPC-003 | Fallback Epic | 8 | Describe what this Epic includes, excludes, or leaves for later. |
| EPC-004 | Fallback Epic | 8 | Describe what this Epic includes, excludes, or leaves for later. |
| EPC-005 | Fallback Epic | 8 | Describe what this Epic includes, excludes, or leaves for later. |
| EPC-006 | Fallback Epic | 8 | Describe what this Epic includes, excludes, or leaves for later. |
| EPC-007 | Fallback Epic | 8 | Describe what this Epic includes, excludes, or leaves for later. |
| EPC-008 | Fallback Epic | 8 | Describe what this Epic includes, excludes, or leaves for later. |
| EPC-009 | Fallback Epic | 8 | Describe what this Epic includes, excludes, or leaves for later. |
| EPC-010 | Fallback Epic | 8 | Describe what this Epic includes, excludes, or leaves for later. |
| EPC-011 | Fallback Epic | 8 | Describe what this Epic includes, excludes, or leaves for later. |
| EPC-012 | Fallback Epic | 4 | Describe what this Epic includes, excludes, or leaves for later. |

## Journeys

| ID | Title | Primary actor | Linked story ideas |
| --- | --- | --- | --- |
| JNY-001 | Skapa första kontrollbilden | Ny privat användare | US-001, US-002, US-008, US-015, US-016, US-020, US-022 |
| JNY-002 | Hitta uppsägningsmöjlighet | Användare med flera abonnemang | US-030, US-031, US-032, US-033, US-034, US-075, US-094 |
| JNY-003 | Importera och rensa köp | Användare med kontoutdrag | US-045, US-046, US-047, US-048, US-052, US-053, US-054, US-056, US-057, US-073 |
| JNY-004 | Skapa återkommande från köp | Användare som upptäcker abonnemang i kontoutdrag | US-055, US-060, US-061, US-064, US-066 |
| JNY-005 | Göra återkommande till enskilt köp | Användare som felklassat en kostnad | US-012, US-043, US-062, US-063 |
| JNY-006 | Analysera påverkan | Användare som vill prioritera nästa beslut | US-064, US-065, US-066, US-067, US-068, US-069, US-070, US-071, US-072, US-074, US-075 |
| JNY-007 | Skydda lokal data | Användare som vill undvika datatapp | US-076, US-077, US-078, US-079, US-080, US-081, US-082, US-083, US-084, US-099, US-100 |
| JNY-008 | Anpassa signaler och moduler | Power user eller hushållsansvarig | US-058, US-097, US-098 |

## Story Ideas

| ID | Title | Epic | Expected behavior |
| --- | --- | --- | --- |
| US-001 | Skapa första plånboken | EP-001 | Onboarding låter användaren ange plånboksnamn, välja mall och skapa första kontexten. |
| US-002 | Kräva minst en första användare | EP-001 | När första plånboken skapas promptas användaren att lägga till minst en person/betalare. |
| US-003 | Välja aktiv plånbok | EP-001 | Kontextväljaren byter aktiv plånbok och alla vyer filtreras till den. |
| US-004 | Konfigurera tidsfönster | EP-001 | Plånbokens månader bakåt och framåt kan ändras och påverkar tidslinje/statistik. |
| US-043 | Skapa enskilt köp manuellt | EP-006 | Formulär sparar datum, bokfört datum, handlare, belopp, kategori, betalare, typ, flaggor och anteckning. |
| US-044 | Redigera enskilt köp | EP-006 | Köpmodalen kan ändra fält och spara utan att tappa import/koppling. |
| US-045 | Importera kontoutdrag | EP-006 | CSV, XLSX och PDF kan läsas och omvandlas till köptransaktioner. |
| US-054 | Markera Onödigt | EP-007 | Köp/utgift kan signaleras som onödigt och räknas i signalstatistik. |
| US-005 | Duplicera plånbok som mall | EPC-001 | Appen kan skapa en ny plånbok med kopierad struktur enligt befintlig mall. |
| US-006 | Radera plånbok säkert | EPC-001 | Radering tar bort relaterade personer, leverantörer, kategorier, utgifter, köp, filer, regler och filterreferenser. |
| US-007 | Visa tomt startläge | EPC-001 | Tom app visar tydlig startyta för ny plånbok eller demo/skip utan döda ytor. |
| US-008 | Skapa återkommande månadsutgift | EPC-001 | Formulär sparar namn, belopp, månad, dragningsdag, period, kategori, betalare och leverantör. |
| US-009 | Skapa kvartals- och årsutgift | EPC-001 | Val av kvartal/år påverkar periodiserad statistik och kassaflöde korrekt. |
| US-010 | Skapa engångsperiod | EPC-001 | Periodtypen engång ger belopp i aktuell period utan att återkomma. |
| US-011 | Spara ofullständig utgift som utkast | EPC-001 | Saknas centrala fält sparas status draft och raden kan kompletteras senare. |
| US-012 | Redigera återkommande utgift | EPC-001 | Redigering uppdaterar utgift och period utan att skapa dubbletter. |
| US-013 | Avsluta återkommande utgift | EPC-002 | Avslut sätter slutdatum/status och tidslinjen slutar räkna framtida månader. |
| US-014 | Ta bort återkommande utgift | EPC-002 | Borttagning tar bort utgift och relaterade perioder samt kopplar loss eventuella köp. |
| US-015 | Välja betalande person | EPC-002 | Utgift kan kopplas till person och synas i personsummeringar/filter. |
| US-016 | Välja kategori | EPC-002 | Utgift kan kopplas till kategori med färg/ikon och räknas i kategoriöversikter. |
| US-017 | Välja eller skapa leverantör i flödet | EPC-002 | Användaren kan välja befintlig leverantör eller skapa ny leverantör från utgiftsformuläret. |
| US-018 | Ange anteckning | EPC-002 | Anteckning lagras på utgift och visas i detalj. |
| US-019 | Bifoga underlag på utgift | EPC-002 | Tillåtna filtyper kan bifogas och visas i utgiftsdetaljen. |
| US-020 | Visa återkommande tidslinje | EPC-002 | Desktop visar utgifter som rader och månader som kolumner med belopp/aktivitet. |
| US-021 | Visa mobil översikt | EPC-003 | Mobilvy visar kompakta kort, månadsrader och expanderbara detaljer. |
| US-022 | Visa månadstotaler | EPC-003 | Månadsrubriker eller sammanfattningar visar totals för vald period. |
| US-023 | Filtrera på kategori | EPC-003 | Kategorifilter påverkar tidslinje, översikt och relevanta summeringar. |
| US-024 | Filtrera på betalare | EPC-003 | Betalarfilter visar endast matchande utgifter/köp där relevant. |
| US-025 | Filtrera på signal | EPC-003 | Signalfilter påverkar köp/översikt och släcks visuellt när det avmarkeras. |
| US-026 | Söka i utgifter och köp | EPC-003 | Sök matchar namn, leverantör, handlare, kategori och relaterad text. |
| US-027 | Dölja historiska månader | EPC-003 | Toggle tar bort tidigare månader från tidslinjens fokus. |
| US-028 | Öppna detaljdrawer från tidslinje | EPC-003 | Klick på rad/cell öppnar detalj med redigera, avsluta, ta bort och filhantering. |
| US-029 | Snabbregistrera från global action | EPC-004 | Quick action erbjuder återkommande utgift, enskilt köp och import. |
| US-030 | Ange uppsägningstid | EPC-004 | Utgift kan ha uppsägningstid i dagar eller månader. |
| US-031 | Beräkna tidigaste kostnadsfria månad | EPC-004 | Appen beräknar första månad utan kostnad baserat på dagens datum och uppsägningstid. |
| US-032 | Visa låst period | EPC-004 | Månader som inte kan frigöras än markeras låsta. |
| US-064 | Visa återkommande analys | EPC-004 | Statistik visar periodiserad period, månadssnitt, årstakt och signalmix. |
| US-033 | Skapa uppsägningspåminnelse | EPC-004 | Relevant påminnelse skapas kopplat till utgift och kan markeras klar. |
| US-034 | Exportera påminnelser till kalender | EPC-004 | Appen kan exportera .ics för påminnelser. |
| US-035 | Visa saknad uppsägningsinformation | EPC-004 | Poster utan uppsägningsdata eller instruktion kan flaggas som förbättringskandidater. |
| US-036 | Skapa och redigera person | EPC-005 | Register låter användaren skapa, ändra och inaktivera personer. |
| US-037 | Ange månadsbudget per person | EPC-005 | Person kan ha disponibel månadsinkomst/budget som används i statistik. |
| US-038 | Skapa och redigera leverantör | EPC-005 | Register hanterar namn, typ, ikon, färg, kontaktinfo och notes. |
| US-039 | Spara uppsägningsinstruktion för leverantör | EPC-005 | Leverantör kan bära instruktion som visas vid relevant utgift. |
| US-040 | Skapa och redigera kategori | EPC-005 | Kategori har namn, ikon och färg och används i utgifter/köp. |
| US-041 | Skapa standardregister i ny plånbok | EPC-005 | Ny state berikas med vanliga leverantörer och standardkategorier utan att radera användardata. |
| US-042 | Skapa handlare/kategoriregel | EPC-005 | Appen sparar mönster för handlare och kan återanvända kategori/leverantör. |
| US-046 | Förhandsgranska import | EPC-005 | Appen visar antal köp, totalsumma, ignorerade rader och radlista före importcommit. |
| US-047 | Deduplicera importerade köp | EPC-006 | Fingerprint på datum, bokfört datum, belopp och handlare används för att hoppa över dubbletter. |
| US-048 | Högerjustera belopp i import på mobil | EPC-006 | Mobil importlista lägger belopp på egen/högerjusterad yta utan överlapp. |
| US-049 | Koppla köp till betalare | EPC-006 | Importerade/manuella köp får defaultbetalare och kan ändras. |
| US-050 | Koppla köp till leverantör | EPC-006 | Köp kan välja leverantör eller föreslå ny leverantör från handlare. |
| US-051 | Uppdatera kategori för samma handlare | EPC-006 | Vid köpredigering kan användaren applicera kategori på alla köp från samma handlare utan tung boxad UI. |
| US-052 | Lista och filtrera köp | EPC-006 | Inköpsvyn visar köpradar, sök, lista, signaler och redigering. |
| US-053 | Markera Granska | EPC-006 | Köp kan flaggas för granskning och visas i köpradar/filter. |
| US-055 | Markera Återkommande signal | EPC-006 | Köp kan flaggas återkommande och visas med samma signalmönster som andra signaler. |
| US-056 | Markera Värt det | EPC-007 | Värt det-signal kan sättas/släckas och summeras separat. |
| US-057 | Markera Business | EPC-007 | Business-signal kan sättas/släckas och påverka filter/statistik. |
| US-058 | Byta namn på Business-signal | EPC-007 | Data-vyn låter användaren namnge business-signalen exempelvis Utlägg. |
| US-059 | Släcka signal visuellt när samma signal klickas igen | EPC-007 | Samma signal/tile togglar av och ser inte längre aktiv ut. |
| US-060 | Konvertera köp till återkommande utgift | EPC-007 | Ett köp kan skapa ny återkommande utgift med köpets datum som första betalningsdatum och köpets data förifylld. |
| US-061 | Koppla originalköp som första betalning | EPC-007 | När köp konverteras länkas originalköpet till den nya återkommande utgiften. |
| US-062 | Konvertera återkommande utgift till enskilt köp | EPC-007 | En återkommande utgift kan göras om till enskilt köp och eventuella länkade köp kopplas loss. |
| US-063 | Välja transaktionstyp | EPC-007 | Köp har typfält och statistik/import filtrerar bort ignorerade rader. |
| US-065 | Visa kategori- och leverantörstoppar för återkommande | EPC-008 | Kategorier och leverantörer rankas på total periodkostnad och visar månads-/årstakt. |
| US-066 | Visa återkommande vs köp | EPC-008 | Statistik visar periodtotal för återkommande och enskilda köp sida vid sida. |
| US-067 | Rankar handlare efter mest pengar | EPC-008 | Mest pengar sorterar strikt på totalbelopp över vald period. |
| US-068 | Rankar handlare efter flest transaktioner | EPC-008 | Flest transaktioner sorterar på antal, med total som tie-breaker. |
| US-069 | Rankar kategorier efter mest pengar och antal | EPC-008 | Kategorilistor sorterar separat efter totalbelopp respektive antal. |
| US-070 | Visa köpintelligens | EPC-008 | KPI:er visar total köpvolym, transaktioner, medelköp och antal handlare. |
| US-071 | Visa handlare efter påverkan | EPC-008 | Handlarlista visar total, antal, aktiva månader, snitt och trend/sparkline. |
| US-072 | Visa köp per månad och år | EPC-008 | Periodsammanfattningar visar total, snitt och topphandlare per månad/år. |
| US-073 | Visa köpradar | EPC-009 | Köpradar visar Granska, Onödigt, Återkommande, Värt det och Business/Utlägg med antal eller belopp. |
| US-074 | Visa budgetutfall | EPC-009 | Statistik jämför budgetbidrag mot återkommande + köp och visar utfall per månad. |
| US-075 | Visa beslutsinsikter | EPC-009 | Panel visar prioriterade insikter kring leverantör, dragningsdag, köp, toppmånad eller uppsägningskandidat. |
| US-076 | Spara lokalt utan konto | EPC-009 | Appen fungerar lokalt med localStorage och kräver ingen inloggning. |
| US-077 | Exportera JSON | EPC-009 | Export innehåller kontext, register, utgifter, perioder, filer, köp och regler. |
| US-078 | Exportera ZIP med filer | EPC-009 | ZIP innehåller context.json och bifogade filer. |
| US-079 | Importera som ny plånbok | EPC-009 | Import remappar ID:n och skapar ny kontext bredvid befintlig data. |
| US-080 | Exportera CSV | EPC-009 | CSV innehåller återkommande utgifter och köp med relevanta kolumner. |
| US-081 | Exportera PDF-rapport | EPC-010 | PDF genereras med plånbok, totals och rapportmetadata. |
| US-082 | Skapa fristående datafil | EPC-010 | Användaren kan spara en JSON-datafil via File System Access API där det stöds. |
| US-083 | Återansluta datafil | EPC-010 | Appen kan öppna tidigare datafil och autospara efter ändringar när rättighet finns. |
| US-084 | Dela datafil/handoff | EPC-010 | Appen kan skapa delningsbar fil/HTML-handoff som kan läsas tillbaka. |
| US-085 | Konfigurera experimentell molnsync | EPC-010 | Användaren kan ange endpoint/token, pulla, pusha, se status och koppla från. |
| US-086 | Hantera molnkonflikt | EPC-010 | Sync visar konflikt/error och stoppar automatisk write när revision inte matchar. |
| US-087 | Responsiv huvudnavigation | EPC-010 | Nav innehåller Översikt, Inköp, Statistik, Register, Data och Hjälp där relevant. |
| US-088 | Visa hjälpvy | EPC-010 | Hjälp förklarar plånbok, återkommande utgifter, inköp, signaler, import och data. |
| US-089 | Visa tydliga tomlägen | EPC-011 | Tomma paneler visar kort hjälptext och relevant primär action. |
| US-090 | Använda modaler för skapande/redigering | EPC-011 | Utgift och köp öppnas i modal med stäng, avbryt och spara. |
| US-091 | Använda drawer för detaljer | EPC-011 | Utgiftsdetalj öppnas som sidopanel med åtgärder. |
| US-092 | Undvika överlappande text i mobil | EPC-011 | Belopp, chips, kort och knappar bryter rad eller justeras så innehåll inte kolliderar. |
| US-093 | Ha konsekvent signaldesign | EPC-011 | Samma signaler använder samma ikon, färgton och aktivt/inaktivt läge över appen. |
| US-094 | Simulera bort återkommande utgift | EPC-011 | Användaren kan markera utgift som simulerat borttagen från första möjliga månad. |
| US-095 | Visa simulerad vy tydligt | EPC-011 | Statistik visar banner och återställ-knapp när simulering är aktiv. |
| US-096 | Återställa simulering | EPC-011 | Alla simulerade borttagningar kan rensas i ett steg. |
| US-097 | Slå på/av inköpsmodul | EPC-012 | Data/inställning kan aktivera eller dölja inköpsvyn där state stödjer det. |
| US-098 | Växla planflagga | EPC-012 | Plånbok har free/premium som lokal flagga utan verklig betalvägg. |
| US-099 | Visa lokal datarisk | EPC-012 | Data-vyn förklarar lokal lagring, browser-risk och backup/export. |
| US-100 | Rensa lokal data | EPC-012 | Reset rensar lokal state, datafilskoppling och cloud config efter explicit handling. |

## Scope-Out Extract

- Exkluderar kontobaserad multi-user-synk.
- Exkluderar fakturaskanning som automatisk källa.
- Exkluderar avancerad kalenderplanering.
- Exkluderar automatisk uppsägning hos leverantör.
- Exkluderar full CRM eller dokumentarkiv.
- Exkluderar direkt bankintegration.
- Exkluderar hosted backend som krav.
- Exkluderar marketing-landningssida.
- Exkluderar flerårig forecasting med osäkerhetsmodell.
- Exkluderar riktig betalvägg.

## Initial Implementation Slice

The first build slice is inside baseline scope and maps to:

- OUT-001
- JNY-001
- EP-001
- US-001
- US-002
- US-003
- US-004
- US-007
- US-008
- US-015
- US-016
- US-017
- US-020
- US-022
- US-026
- US-029
- US-030
- US-031
- US-032
- US-064
- US-076
- US-087
- US-089
- US-090
- US-091
- US-092
- US-099
- TECH-001
- DEC-001
