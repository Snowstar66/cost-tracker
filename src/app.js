// Trace: OUT-001, JNY-001, EP-001, EP-002, EP-003, EP-004, EP-005, EP-006, EP-007, EP-008, EP-009, EP-010, EP-011, EP-012, US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-012, US-013, US-014, US-015, US-016, US-017, US-020, US-022, US-025, US-026, US-029, US-030, US-031, US-032, US-033, US-034, US-035, US-036, US-037, US-038, US-039, US-040, US-041, US-043, US-044, US-045, US-046, US-047, US-049, US-050, US-052, US-053, US-054, US-056, US-057, US-058, US-059, US-060, US-061, US-062, US-063, US-064, US-065, US-066, US-067, US-068, US-069, US-070, US-071, US-072, US-074, US-075, US-076, US-077, US-079, US-080, US-082, US-084, US-087, US-089, US-090, US-091, US-092, US-094, US-095, US-096, US-097, US-098, US-099, DEC-001, TECH-001.

import {
  buildMonthWindow,
  addExpenseAttachment,
  createRecurringExpense,
  createWallet,
  createCategory,
  createPayer,
  createProvider,
  createPurchase,
  createCancellationReminder,
  convertPurchaseToRecurring,
  convertRecurringToPurchase,
  endRecurringExpense,
  earliestFreeMonth,
  filterExpenses,
  filterPurchases,
  formatMoney,
  lockedMonths,
  monthLabel,
  monthKey,
  duplicateWallet,
  parsePurchaseCsv,
  previewImportedPurchases,
  remindersToIcs,
  removeWalletFromState,
  removeRecurringExpense,
  SIGNALS,
  simulateRecurringRemoval,
  summarizeFinance,
  summarizeTimeline,
  summarizeSignals,
  toggleExpenseSignal,
  togglePurchaseSignal,
  updateCategory,
  updateRecurringExpense,
  updatePayer,
  updateProvider,
  updatePurchase,
  updateProductSettings,
  updateSyncConfig,
  updateWalletSettings,
  upsertMerchantCategoryRule,
  detectSyncConflict,
  validateExpenseInput,
  validatePurchaseInput,
  validateWalletInput,
} from "./domain.js";
import { parseMastercardStatementFile } from "./mastercard-import.js";
import { clearState, createReportHtml, createStoredZip, exportState, loadState, parseImportedState, saveState, toCsv } from "./storage.js";

const app = document.querySelector("#app");

const state = {
  data: loadState(),
  filters: {
    query: "",
    categoryId: "all",
    payerId: "all",
    signal: "all",
    hideHistory: false,
  },
  modal: null,
  drawerExpenseId: null,
  editingExpenseId: null,
  editingPurchaseId: null,
  importPreview: null,
  importPreviewSource: "",
  simulatedExpenseIds: [],
  view: "overview",
};

const NAV_ITEMS = [
  ["overview", "Översikt", "layout"],
  ["recurring", "Återkommande", "repeat"],
  ["purchases", "Inköp", "cart"],
  ["stats", "Statistik", "chart"],
  ["registers", "Register", "layers"],
  ["data", "Data", "database"],
  ["help", "Hjälp", "help"],
];

function getActiveWallet() {
  return state.data.wallets.find((wallet) => wallet.id === state.data.activeWalletId) ?? state.data.wallets[0] ?? null;
}

function setData(nextData) {
  state.data = nextData;
  saveState(state.data);
  render();
}

function render() {
  const wallet = getActiveWallet();
  app.innerHTML = wallet ? renderWorkspace(wallet) : renderEmptyState();
  bindEvents(wallet);
}

function renderEmptyState() {
  return `
    <main class="empty-shell">
      <section class="onboarding-panel" aria-labelledby="onboarding-title">
        <div>
          <p class="eyebrow">OUT-001 · Lokal kontroll</p>
          <h1 id="onboarding-title">Skapa första kontrollbilden</h1>
          <p class="lede">Kom från tom app till första plånbok, betalare, återkommande kostnad och tidslinje utan konto eller bankkoppling.</p>
        </div>
        <form id="wallet-form" class="stacked-form">
          <label>
            Plånboksnamn
            <input name="name" autocomplete="off" placeholder="Hushållets kostnader" />
          </label>
          <label>
            Första betalare
            <input name="payerName" autocomplete="off" placeholder="Anne" />
          </label>
          <label>
            Mall
            <select name="template">
              <option value="standard">Standardregister</option>
              <option value="minimal">Minimal start</option>
            </select>
          </label>
          <div class="split-fields">
            <label>
              Månader bakåt
              <input name="monthsBack" type="number" min="0" max="12" value="2" />
            </label>
            <label>
              Månader framåt
              <input name="monthsForward" type="number" min="1" max="24" value="6" />
            </label>
          </div>
          <div id="wallet-errors" class="form-errors" aria-live="polite"></div>
          <button class="primary-button" type="submit">Skapa plånbok</button>
        </form>
      </section>
    </main>
  `;
}

function renderWorkspace(wallet) {
  const months = buildMonthWindow(wallet).filter((key) => !state.filters.hideHistory || key >= monthKey());
  const simulationWallet = simulateRecurringRemoval(wallet, state.simulatedExpenseIds);
  const visibleExpenses = filterExpenses(simulationWallet, state.filters);
  const projectedWallet = { ...simulationWallet, recurringExpenses: visibleExpenses };
  const summary = summarizeTimeline(projectedWallet, months);
  const signalSummary = summarizeSignals(visibleExpenses);
  const selectedExpense = wallet.recurringExpenses.find((expense) => expense.id === state.drawerExpenseId);
  const editingExpense = wallet.recurringExpenses.find((expense) => expense.id === state.editingExpenseId);

  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand-block">
          <span class="brand-mark">${icon("wallet")}</span>
          <div>
            <strong>CostTracker</strong>
            <span>Private control plane</span>
          </div>
        </div>
        <label class="wallet-select">
          Aktiv plånbok
          <select id="wallet-select">
            ${state.data.wallets.map((item) => `<option value="${item.id}" ${item.id === wallet.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
          </select>
        </label>
        <nav class="main-nav" aria-label="Huvudnavigation">
          ${NAV_ITEMS.map(([view, label, iconName]) => `<button class="${state.view === view ? "active" : ""}" data-view="${view}" type="button">${icon(iconName)}<span>${label}</span></button>`).join("")}
        </nav>
        <div class="local-status">
          <strong>Lokal data</strong>
          <span>Sparas endast i den här webbläsaren.</span>
        </div>
      </aside>

      <main class="workspace">
        <header class="topbar">
          <div>
            <p class="eyebrow">JNY-001 · Kontrollbild</p>
            <h1>${escapeHtml(wallet.name)}</h1>
          </div>
          <div class="topbar-actions">
            <button class="secondary-button with-icon" id="export-json" type="button">${icon("download")}<span>Exportera JSON</span></button>
            <button class="primary-button with-icon" id="open-expense-modal" type="button">${icon("plus")}<span>Kostnad</span></button>
          </div>
        </header>

        <section class="score-strip" aria-label="Sammanfattning">
          <article>
            <i class="score-icon">${icon("calendar")}</i>
            <span>Månad nu</span>
            <strong>${formatMoney(summary.activeTotal)}</strong>
          </article>
          <article>
            <i class="score-icon">${icon("trend")}</i>
            <span>Årstakt</span>
            <strong>${formatMoney(summary.annualRunRate)}</strong>
          </article>
          <article>
            <i class="score-icon">${icon("list")}</i>
            <span>Poster</span>
            <strong>${visibleExpenses.length}</strong>
          </article>
          <article>
            <i class="score-icon">${icon("shield")}</i>
            <span>Datastatus</span>
            <strong>Lokal</strong>
          </article>
        </section>
        ${state.simulatedExpenseIds.length ? `<section class="simulation-banner"><strong>Simulering aktiv</strong><span>${state.simulatedExpenseIds.length} kostnad(er) exkluderas från översikt och statistik.</span><button id="reset-simulation" class="secondary-button" type="button">Återställ</button></section>` : ""}

        ${renderActiveView(wallet, months, summary, signalSummary)}
      </main>

      <nav class="mobile-nav" aria-label="Mobil navigation">
        <button type="button">${icon("layout")}<span>Översikt</span></button>
        <button type="button">${icon("repeat")}<span>Kostnader</span></button>
        <button type="button">${icon("database")}<span>Data</span></button>
      </nav>
    </div>
    ${state.modal === "expense" ? renderExpenseModal(wallet, editingExpense) : ""}
    ${selectedExpense ? renderDrawer(wallet, selectedExpense, months) : ""}
    ${state.importPreview ? renderImportPreviewModal() : ""}
  `;
}

function renderActiveView(wallet, months, summary, signalSummary) {
  if (state.view === "registers") return renderRegistersView(wallet);
  if (state.view === "data") return renderDataView(wallet);
  if (state.view === "help") return renderHelpView();
  if (state.view === "purchases") return wallet.settings?.purchasesEnabled === false ? renderDisabledPurchasesView() : renderPurchasesView(wallet);
  if (state.view === "stats") return renderStatsView(simulateRecurringRemoval(wallet, state.simulatedExpenseIds), months);
  if (state.view === "overview") return renderOverviewView(wallet, months, summary, signalSummary);

  return `
    <section class="control-surface">
      <div class="main-panel">
        ${renderFilters(wallet)}
        ${wallet.recurringExpenses.length ? renderTimeline(wallet, months, summary) : renderRecurringEmptyState()}
      </div>
      ${renderRail(wallet, months, summary, signalSummary)}
    </section>
  `;
}

function renderOverviewView(wallet, months, summary, signalSummary) {
  const stats = summarizeFinance(wallet, months);
  const activeRecurring = wallet.recurringExpenses
    .filter((expense) => expense.status !== "ended")
    .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
  const purchases = (wallet.purchases ?? []).slice().sort((a, b) => b.date.localeCompare(a.date));
  const currentMonthPurchases = purchases.filter((purchase) => purchase.date?.startsWith(monthKey()));

  return `
    <section class="overview-layout">
      <div class="overview-main">
        <article class="management-panel overview-hero">
          <div>
            <h2>${icon("layout")}Översikt</h2>
            <p>Samlad bild av återkommande kostnader och enskilda inköp. Delarna hålls separerade så att löpande åtaganden inte blandas ihop med kortköp.</p>
          </div>
          <div class="overview-summary-grid">
            <div><span>Återkommande/mån</span><strong>${formatMoney(stats.recurringMonthly)}</strong></div>
            <div><span>Enskilda köp denna månad</span><strong>${formatMoney(stats.purchaseMonthTotal)}</strong></div>
            <div><span>Köp i register</span><strong>${purchases.length}</strong></div>
          </div>
        </article>

        <article class="management-panel overview-section recurring-overview">
          <div class="overview-section-header">
            <div>
              <h2>${icon("repeat")}Återkommande kostnader</h2>
              <p>${activeRecurring.length} aktiva eller utkast · årstakt ${formatMoney(summary.annualRunRate)}</p>
            </div>
            <button class="secondary-button with-icon" data-view="recurring" type="button">${icon("repeat")}<span>Öppna tidslinje</span></button>
          </div>
          <div class="overview-list">
            ${activeRecurring.length ? activeRecurring.slice(0, 7).map((expense) => renderOverviewExpenseRow(wallet, expense)).join("") : `<p class="empty-note">Inga återkommande kostnader ännu.</p>`}
          </div>
        </article>

        <article class="management-panel overview-section purchases-overview">
          <div class="overview-section-header">
            <div>
              <h2>${icon("cart")}Enskilda inköp</h2>
              <p>${currentMonthPurchases.length} köp denna månad · totalt ${formatMoney(stats.purchaseTotal)}</p>
            </div>
            <button class="secondary-button with-icon" data-view="purchases" type="button">${icon("cart")}<span>Öppna inköp</span></button>
          </div>
          <div class="purchase-list">
            ${purchases.length ? purchases.slice(0, 7).map((purchase) => renderPurchaseRow(wallet, purchase)).join("") : `<p class="empty-note">Inga enskilda köp registrerade ännu.</p>`}
          </div>
        </article>
      </div>
      ${renderRail(wallet, months, summary, signalSummary)}
    </section>
  `;
}

function renderOverviewExpenseRow(wallet, expense) {
  const category = wallet.categories.find((item) => item.id === expense.categoryId);
  const payer = wallet.payers.find((item) => item.id === expense.payerId);
  const status = expense.status === "draft" ? "Utkast" : periodLabel(expense.period);
  return `
    <button class="overview-row" data-expense-id="${expense.id}" type="button">
      <span class="category-dot" style="--dot:${category?.color ?? "#64748b"}"></span>
      <span>
        <strong>${escapeHtml(expense.name)}</strong>
        <small>${escapeHtml(category?.name ?? "Övrigt")} · ${escapeHtml(payer?.name ?? "Okänd")} · ${status}</small>
      </span>
      <strong>${formatMoney(expense.amount)}</strong>
    </button>
  `;
}

function renderStatsView(wallet, months) {
  const stats = summarizeFinance(wallet, months);
  return `
    <section class="stats-grid">
      <article class="management-panel">
        <h2>${icon("chart")}Återkommande vs köp</h2>
        <div class="metric-list">
          <div><span>Återkommande/mån</span><strong>${formatMoney(stats.recurringMonthly)}</strong></div>
          <div><span>Köp denna månad</span><strong>${formatMoney(stats.purchaseMonthTotal)}</strong></div>
          <div><span>Årstakt återkommande</span><strong>${formatMoney(stats.recurringAnnual)}</strong></div>
          <div><span>Budget kvar</span><strong>${stats.budgetTotal ? formatMoney(stats.budgetRemaining) : "Ingen budget"}</strong></div>
        </div>
      </article>
      ${renderRankPanel("Handlare: mest pengar", stats.merchantByAmount, "amount")}
      ${renderRankPanel("Handlare: flest transaktioner", stats.merchantByCount, "count")}
      ${renderRankPanel("Kategorier: påverkan", stats.categoryByAmount, "amount")}
      ${renderRankPanel("Leverantörer: återkommande", stats.providerByRecurring, "amount")}
      ${renderRankPanel("Köp per månad", stats.purchaseByMonth, "amount")}
      ${renderRadarPanel(stats.purchaseRadar)}
    </section>
  `;
}

function renderRadarPanel(rows) {
  return `
    <article class="management-panel">
      <h2>${icon("radar")}Köpradar</h2>
      <div class="rank-list">
        ${rows.length ? rows.slice(0, 6).map((row) => `
          <div>
            <span>${escapeHtml(row.label)} · ${row.signal === "watch" ? "bevaka" : "normal"}</span>
            <strong>${formatMoney(row.average)} snitt</strong>
          </div>
        `).join("") : `<p class="empty-note">Ingen data ännu.</p>`}
      </div>
    </article>
  `;
}

function renderRankPanel(title, rows, mode) {
  return `
    <article class="management-panel">
      <h2>${icon("list")}${title}</h2>
      <div class="rank-list">
        ${rows.length ? rows.slice(0, 6).map((row) => `
          <div>
            <span>${escapeHtml(row.label)}</span>
            <strong>${mode === "count" ? row.count : formatMoney(row.amount)}</strong>
          </div>
        `).join("") : `<p class="empty-note">Ingen data ännu.</p>`}
      </div>
    </article>
  `;
}

function renderPurchasesView(wallet) {
  const purchases = filterPurchases(wallet, state.filters).sort((a, b) => b.date.localeCompare(a.date));
  const editingPurchase = (wallet.purchases ?? []).find((purchase) => purchase.id === state.editingPurchaseId);

  return `
    <section class="purchases-layout">
      <article class="management-panel">
        <div class="section-heading compact-heading">
          <div>
            <h2>Enskilda köp</h2>
            <p>Manuella köp sparas lokalt och kan filtreras på kategori, betalare och signal.</p>
          </div>
          <div class="topbar-actions">
            <label class="import-button compact-import">
              ${icon("upload")}
              Importera CSV
              <input id="import-purchases-csv" type="file" accept=".csv,text/csv" />
            </label>
            <button class="primary-button with-icon" id="new-purchase" type="button">${icon("plus")}<span>Köp</span></button>
          </div>
        </div>
        ${renderFilters(wallet)}
        <div class="purchase-list">
          ${purchases.length ? purchases.map((purchase) => renderPurchaseRow(wallet, purchase)).join("") : `<p class="empty-note">Inga köp matchar filtret.</p>`}
        </div>
      </article>
    </section>
    ${state.modal === "purchase" ? renderPurchaseModal(wallet, editingPurchase) : ""}
  `;
}

function renderDisabledPurchasesView() {
  return `
    <section class="management-panel">
      <h2>${icon("cart")}Inköpsmodul avstängd</h2>
      <p>Slå på inköpsmodulen i Data för att registrera och importera enskilda köp.</p>
    </section>
  `;
}

function renderPurchaseRow(wallet, purchase) {
  const category = wallet.categories.find((item) => item.id === purchase.categoryId);
  const payer = wallet.payers.find((item) => item.id === purchase.payerId);
  return `
    <button class="purchase-row" data-edit-purchase="${purchase.id}" type="button">
      <span>
        <strong>${escapeHtml(purchase.merchantName)}</strong>
        <small>${escapeHtml(category?.name ?? "Övrigt")} · ${escapeHtml(payer?.name ?? "Okänd")} · ${escapeHtml(purchase.type)}</small>
      </span>
      <span>${escapeHtml(purchase.date)}</span>
      <strong>${formatMoney(purchase.amount)}</strong>
    </button>
  `;
}

function renderPurchaseModal(wallet, purchase = null) {
  return `
    <div class="modal-backdrop" role="presentation">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="purchase-title">
        <div class="modal-header">
          <h2 id="purchase-title">${purchase ? "Redigera köp" : "Nytt köp"}</h2>
          <button class="icon-button" id="close-modal" type="button" aria-label="Stäng">×</button>
        </div>
        <form id="purchase-form" class="stacked-form">
          <div class="split-fields">
            <label>
              Datum
              <input name="date" type="date" value="${escapeHtml(purchase?.date ?? new Date().toISOString().slice(0, 10))}" />
            </label>
            <label>
              Bokfört datum
              <input name="bookedDate" type="date" value="${escapeHtml(purchase?.bookedDate ?? purchase?.date ?? new Date().toISOString().slice(0, 10))}" />
            </label>
          </div>
          <label>
            Handlare
            <input name="merchantName" value="${escapeHtml(purchase?.merchantName ?? "")}" placeholder="Butik eller handlare" />
          </label>
          <div class="split-fields">
            <label>
              Belopp
              <input name="amount" type="number" min="1" step="1" value="${escapeHtml(purchase?.amount ?? "")}" />
            </label>
            <label>
              Typ
              <select name="type">
                <option value="purchase" ${purchase?.type === "purchase" ? "selected" : ""}>Köp</option>
                <option value="refund" ${purchase?.type === "refund" ? "selected" : ""}>Återbetalning</option>
                <option value="business" ${purchase?.type === "business" ? "selected" : ""}>Business</option>
              </select>
            </label>
          </div>
          <div class="split-fields">
            <label>
              Kategori
              <select name="categoryId">
                ${wallet.categories.map((item) => `<option value="${item.id}" ${purchase?.categoryId === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
              </select>
            </label>
            <label>
              Betalare
              <select name="payerId">
                ${wallet.payers.map((item) => `<option value="${item.id}" ${purchase?.payerId === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
              </select>
            </label>
          </div>
          <label>
            Anteckning
            <textarea name="note" rows="3">${escapeHtml(purchase?.note ?? "")}</textarea>
          </label>
          ${purchase ? `<section class="drawer-signals compact-signals"><h3>Signaler</h3><div class="signal-chips">${walletSignals(wallet).map((signal) => `<button class="signal-chip ${(purchase.signals ?? []).includes(signal.id) ? "active" : ""}" data-purchase-signal-id="${signal.id}" type="button">${signal.label}</button>`).join("")}</div></section>` : ""}
          <div id="purchase-errors" class="form-errors" aria-live="polite"></div>
          <div class="modal-actions">
            <button class="secondary-button" id="cancel-expense" type="button">Avbryt</button>
            ${purchase ? `<button class="secondary-button" id="convert-purchase" type="button">Gör återkommande</button>` : ""}
            <button class="primary-button" type="submit">${purchase ? "Spara ändringar" : "Spara köp"}</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

function renderImportPreviewModal() {
  const rows = state.importPreview.rows;
  const importable = rows.filter((row) => !row.duplicate && !row.ignored);
  const duplicates = rows.filter((row) => row.duplicate).length;
  const ignored = rows.filter((row) => row.ignored).length;
  return `
    <div class="modal-backdrop" role="presentation">
      <section class="modal wide-modal" role="dialog" aria-modal="true" aria-labelledby="import-title">
        <div class="modal-header">
          <h2 id="import-title">Importförhandsgranskning</h2>
          <button class="icon-button" id="close-import-preview" type="button" aria-label="Stäng">×</button>
        </div>
        <p class="empty-note">${escapeHtml(state.importPreviewSource || "Import")} · ${rows.length} rader · ${importable.length} nya · ${duplicates} dubbletter · ${ignored} ignorerade</p>
        <div class="import-table-wrap">
          <table class="import-table">
            <thead><tr><th>Datum</th><th>Bokfört</th><th>Handlare</th><th>Belopp</th><th>Status</th></tr></thead>
            <tbody>
              ${rows.map((row) => `<tr><td>${escapeHtml(row.date)}</td><td>${escapeHtml(row.bookedDate ?? row.date)}</td><td>${escapeHtml(row.merchantName)}</td><td>${formatMoney(row.amount)}</td><td>${importStatusLabel(row)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div class="modal-actions">
          <button class="secondary-button" id="cancel-import" type="button">Avbryt</button>
          <button class="primary-button" id="commit-import" type="button">Importera ${importable.length}</button>
        </div>
      </section>
    </div>
  `;
}

function importStatusLabel(row) {
  if (row.ignored) return `<span class="status-pill ignored">Ignorerad</span><small>${escapeHtml(row.ignoredReason)}</small>`;
  if (row.duplicate) return `<span class="status-pill duplicate">Dubblett</span>`;
  return `<span class="status-pill new">Ny</span>`;
}

function renderFilters(wallet) {
  return `
    <form id="filters" class="filter-bar">
      <label>
        Sök
        <input name="query" value="${escapeHtml(state.filters.query)}" placeholder="Namn, leverantör, kategori" />
      </label>
      <label>
        Kategori
        <select name="categoryId">
          <option value="all">Alla</option>
          ${wallet.categories.map((item) => `<option value="${item.id}" ${state.filters.categoryId === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
        </select>
      </label>
      <label>
        Betalare
        <select name="payerId">
          <option value="all">Alla</option>
          ${wallet.payers.map((item) => `<option value="${item.id}" ${state.filters.payerId === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
        </select>
      </label>
      <label>
        Signal
        <select name="signal">
          <option value="all">Alla</option>
          <option value="review">Granska</option>
          <option value="unnecessary">Onödigt</option>
          <option value="worth-it">Värt det</option>
          <option value="business">Business</option>
        </select>
      </label>
      <label class="check-row">
        <input name="hideHistory" type="checkbox" ${state.filters.hideHistory ? "checked" : ""} />
        Dölj historik
      </label>
    </form>
  `;
}

function renderTimeline(wallet, months, summary) {
  return `
    <section class="timeline-card" aria-labelledby="timeline-title">
      <div class="section-heading">
        <div>
          <h2 id="timeline-title">${icon("repeat")}Återkommande tidslinje</h2>
          <p>Rader är kostnader, kolumner är månader. Klicka en rad för detalj.</p>
        </div>
      </div>
      <div class="timeline-table-wrap">
        <table class="timeline-table">
          <thead>
            <tr>
              <th scope="col">Kostnad</th>
              ${months.map((key, index) => `<th scope="col" class="${key === monthKey() ? "current-month" : ""}"><span>${monthLabel(key)}</span><strong>${formatMoney(summary.totals[index])}</strong></th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${summary.rows.map((row) => renderTimelineRow(wallet, row, months)).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderTimelineRow(wallet, row, months) {
  const { expense } = row;
  const category = wallet.categories.find((item) => item.id === expense.categoryId);
  const payer = wallet.payers.find((item) => item.id === expense.payerId);
  const locks = lockedMonths(expense, months);
  return `
    <tr class="timeline-row" data-expense-id="${expense.id}" tabindex="0">
      <th scope="row">
        <span class="category-dot" style="--dot:${category?.color ?? "#64748b"}"></span>
        <span>
          <strong>${escapeHtml(expense.name)}</strong>
          <small>${escapeHtml(category?.name ?? "Övrigt")} · ${escapeHtml(payer?.name ?? "Okänd")}</small>
        </span>
      </th>
      ${row.amounts.map((amount, index) => `<td class="${locks.includes(months[index]) ? "locked-cell" : ""}">${amount ? formatMoney(amount) : ""}</td>`).join("")}
    </tr>
  `;
}

function renderRecurringEmptyState() {
  return `
    <section class="work-empty">
      <h2>${icon("repeat")}Inga återkommande kostnader ännu</h2>
      <p>Lägg in den första månadskostnaden för att få tidslinje, månadstotal och årstakt.</p>
      <button class="primary-button with-icon" id="empty-add-expense" type="button">${icon("plus")}<span>Lägg till kostnad</span></button>
    </section>
  `;
}

function renderRail(wallet, months, summary, signalSummary) {
  const candidates = wallet.recurringExpenses.slice(0, 5);
  const missingNoticeCount = wallet.recurringExpenses.filter((expense) => !expense.noticeValue).length;

  return `
    <aside class="right-rail" aria-label="Beslutsstöd">
      <section>
        <h2>${icon("check")}Readiness</h2>
        <div class="readiness-row"><span>Plånbok</span><strong>Klar</strong></div>
        <div class="readiness-row"><span>Betalare</span><strong>${wallet.payers.length}</strong></div>
        <div class="readiness-row"><span>Lokalt sparad</span><strong>Ja</strong></div>
      </section>
      <section>
        <h2>${icon("spark")}Signaler</h2>
        <div class="signal-summary">
          ${walletSignals(wallet).map((signal) => `<span>${signal.label}<strong>${signalSummary[signal.id] ?? 0}</strong></span>`).join("")}
        </div>
      </section>
      <section>
        <h2>${icon("calendar")}Uppsägning</h2>
        <p class="${missingNoticeCount ? "attention-text" : ""}">${missingNoticeCount ? `${missingNoticeCount} poster saknar uppsägningsinformation.` : "Alla synliga poster har uppsägningsstatus."}</p>
        ${candidates.map((expense) => `<button class="rail-item" data-expense-id="${expense.id}" type="button"><span>${escapeHtml(expense.name)}</span><strong class="${expense.noticeValue ? "" : "missing-info"}">${earliestFreeMonth(expense) ?? "Info saknas"}</strong></button>`).join("")}
      </section>
      <section>
        <h2>${icon("shield")}Lokal risk</h2>
        <p>Data finns bara i den här webbläsaren. Exportera JSON innan du byter dator eller rensar webbläsardata.</p>
        <button class="danger-button" id="clear-local-data" type="button">Rensa lokal data</button>
      </section>
    </aside>
  `;
}

function renderDataView(wallet) {
  return `
    <section class="management-grid">
      <article class="management-panel">
        <h2>${icon("wallet")}Plånbok</h2>
        <form id="wallet-settings-form" class="stacked-form">
          <label>
            Namn
            <input name="name" value="${escapeHtml(wallet.name)}" />
          </label>
          <div class="split-fields">
            <label>
              Månader bakåt
              <input name="monthsBack" type="number" min="0" max="36" value="${escapeHtml(wallet.monthsBack)}" />
            </label>
            <label>
              Månader framåt
              <input name="monthsForward" type="number" min="1" max="60" value="${escapeHtml(wallet.monthsForward)}" />
            </label>
          </div>
          <button class="primary-button" type="submit">Spara inställningar</button>
        </form>
      </article>

      <article class="management-panel">
        <h2>${icon("plus")}Ny plånbok</h2>
        <form id="new-wallet-form" class="stacked-form">
          <label>
            Plånboksnamn
            <input name="name" placeholder="Semester, Gemensamt, Eget" />
          </label>
          <label>
            Första betalare
            <input name="payerName" placeholder="Namn" />
          </label>
          <button class="primary-button" type="submit">Skapa ny</button>
        </form>
      </article>

      <article class="management-panel">
        <h2>${icon("database")}Datakontroll</h2>
        <div class="action-list">
          <button class="secondary-button with-icon" id="duplicate-wallet" type="button">${icon("copy")}<span>Duplicera som mall</span></button>
          <button class="secondary-button with-icon" id="export-json-data" type="button">${icon("download")}<span>Exportera JSON</span></button>
          <button class="secondary-button with-icon" id="export-wallet-data" type="button">${icon("file")}<span>Exportera aktiv datafil</span></button>
          <button class="secondary-button with-icon" id="export-purchases-csv" type="button">${icon("cart")}<span>Exportera köp CSV</span></button>
          <button class="secondary-button with-icon" id="export-recurring-csv" type="button">${icon("repeat")}<span>Exportera återkommande CSV</span></button>
          <button class="secondary-button with-icon" id="export-reminders-ics" type="button">${icon("calendar")}<span>Exportera påminnelser ICS</span></button>
          <button class="secondary-button with-icon" id="export-zip" type="button">${icon("archive")}<span>Exportera ZIP</span></button>
          <button class="secondary-button with-icon" id="export-pdf-report" type="button">${icon("file")}<span>PDF-rapport</span></button>
          <label class="import-button">
            ${icon("upload")}
            Importera JSON som ny plånbok
            <input id="import-json" type="file" accept="application/json,.json" />
          </label>
          <label class="import-button">
            ${icon("link")}
            Återanslut datafil
            <input id="reconnect-json" type="file" accept="application/json,.json" />
          </label>
          <label class="import-button">
            ${icon("card")}
            Importera MasterCard PDF/Excel
            <input id="import-mastercard-statement" type="file" accept=".xlsx,.pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf" />
          </label>
          <button class="danger-button" id="delete-wallet" type="button">Radera aktiv plånbok</button>
        </div>
      </article>

      <article class="management-panel">
        <h2>${icon("layers")}Plan och moduler</h2>
        <form id="product-settings-form" class="stacked-form">
          <label class="check-row">
            <input name="purchasesEnabled" type="checkbox" ${wallet.settings?.purchasesEnabled === false ? "" : "checked"} />
            Inköpsmodul på
          </label>
          <label>
            Planflagga
            <select name="plan">
              <option value="free" ${(wallet.settings?.plan ?? "free") === "free" ? "selected" : ""}>Free</option>
              <option value="premium" ${wallet.settings?.plan === "premium" ? "selected" : ""}>Premium</option>
            </select>
          </label>
          <label>
            Business-signal
            <input name="businessSignalLabel" value="${escapeHtml(wallet.settings?.businessSignalLabel ?? "Business")}" />
          </label>
          <button class="primary-button" type="submit">Spara produktval</button>
        </form>
      </article>

      <article class="management-panel">
        <h2>${icon("sync")}Experimentell sync</h2>
        <form id="sync-form" class="stacked-form">
          <label class="check-row">
            <input name="enabled" type="checkbox" ${wallet.sync?.enabled ? "checked" : ""} />
            Konfiguration aktiv
          </label>
          <label>
            Egen endpoint
            <input name="endpoint" value="${escapeHtml(wallet.sync?.endpoint ?? "")}" placeholder="https://egen-endpoint.example/sync" />
          </label>
          <div class="split-fields">
            <label>
              Lokal version
              <input name="localVersion" type="number" min="1" value="${escapeHtml(wallet.sync?.localVersion ?? 1)}" />
            </label>
            <label>
              Remote-version
              <input name="remoteVersion" type="number" min="1" value="${escapeHtml(wallet.sync?.remoteVersion ?? "")}" />
            </label>
          </div>
          <label>
            Konflikthantering
            <select name="conflictStrategy">
              <option value="manual" ${wallet.sync?.conflictStrategy === "manual" ? "selected" : ""}>Manuell</option>
              <option value="keep-local" ${wallet.sync?.conflictStrategy === "keep-local" ? "selected" : ""}>Behåll lokal</option>
              <option value="accept-remote" ${wallet.sync?.conflictStrategy === "accept-remote" ? "selected" : ""}>Acceptera remote</option>
            </select>
          </label>
          ${detectSyncConflict(wallet) ? `<p class="attention-text">Konflikt: lokal och remote version skiljer sig. Ingen data skickas automatiskt.</p>` : `<p class="empty-note">Ingen konflikt markerad. Ingen nätverkssync körs här.</p>`}
          <button class="primary-button" type="submit">Spara sync-konfig</button>
        </form>
      </article>
    </section>
  `;
}

function renderRegistersView(wallet) {
  return `
    <section class="register-grid">
      <article class="management-panel">
        <h2>${icon("user")}Personer</h2>
        <form id="payer-form" class="inline-form">
          <input name="name" placeholder="Namn" />
          <input name="monthlyBudget" type="number" min="0" placeholder="Månadsbudget" />
          <button class="primary-button" type="submit">Lägg till</button>
        </form>
        ${renderRegisterList(wallet.payers, (payer) => `
          <strong>${escapeHtml(payer.name)}</strong>
          <span>${payer.monthlyBudget ? formatMoney(payer.monthlyBudget) : "Ingen budget"}</span>
          <button data-edit-payer="${payer.id}" class="secondary-button" type="button">Redigera</button>
        `)}
      </article>

      <article class="management-panel">
        <h2>${icon("tag")}Kategorier</h2>
        <form id="category-form" class="inline-form">
          <input name="name" placeholder="Kategori" />
          <input name="color" type="color" value="#64748b" aria-label="Färg" />
          <button class="primary-button" type="submit">Lägg till</button>
        </form>
        ${renderRegisterList(wallet.categories, (category) => `
          <strong><span class="category-dot" style="--dot:${category.color}"></span>${escapeHtml(category.name)}</strong>
          <span>${escapeHtml(category.color)}</span>
          <button data-edit-category="${category.id}" class="secondary-button" type="button">Redigera</button>
        `)}
      </article>

      <article class="management-panel wide-panel">
        <h2>${icon("store")}Leverantörer</h2>
        <form id="provider-form" class="stacked-form">
          <div class="split-fields">
            <label>
              Namn
              <input name="name" placeholder="Leverantör" />
            </label>
            <label>
              Typ
              <select name="type">
                <option value="recurring">Återkommande</option>
                <option value="merchant">Handlare</option>
              </select>
            </label>
          </div>
          <label>
            Kontaktinfo
            <input name="contactInfo" placeholder="Webb, telefon eller e-post" />
          </label>
          <label>
            Uppsägning
            <input name="cancellationInstruction" placeholder="Var och hur kostnaden sägs upp" />
          </label>
          <button class="primary-button" type="submit">Lägg till leverantör</button>
        </form>
        ${renderRegisterList(wallet.providers, (provider) => `
          <strong>${escapeHtml(provider.name)}</strong>
          <span>${escapeHtml(provider.cancellationInstruction || provider.contactInfo || "Ingen instruktion")}</span>
          <button data-edit-provider="${provider.id}" class="secondary-button" type="button">Redigera</button>
        `)}
      </article>

      <article class="management-panel wide-panel">
        <h2>${icon("rules")}Handlarregler</h2>
        <form id="merchant-rule-form" class="inline-form">
          <input name="merchantName" placeholder="Handlare" />
          <select name="categoryId">
            ${wallet.categories.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join("")}
          </select>
          <button class="primary-button" type="submit">Spara regel</button>
        </form>
        ${renderRegisterList(wallet.merchantCategoryRules ?? [], (rule) => `
          <strong>${escapeHtml(rule.merchantName)}</strong>
          <span>${escapeHtml(wallet.categories.find((category) => category.id === rule.categoryId)?.name ?? "Okänd kategori")}</span>
          <button data-delete-rule="${rule.id}" class="secondary-button" type="button">Ta bort</button>
        `)}
      </article>
    </section>
  `;
}

function renderRegisterList(items, renderItem) {
  if (!items.length) return `<p class="empty-note">Inga poster ännu.</p>`;
  return `<div class="register-list">${items.map((item) => `<div class="register-row">${renderItem(item)}</div>`).join("")}</div>`;
}

function renderHelpView() {
  return `
    <section class="management-panel">
      <h2>${icon("help")}Hjälp</h2>
      <p>Appen arbetar lokalt i webbläsaren. Börja med plånbok, betalare och återkommande kostnader. Exportera JSON regelbundet om datan är viktig.</p>
    </section>
  `;
}

function renderExpenseModal(wallet, expense = null) {
  const provider = expense ? wallet.providers.find((item) => item.id === expense.providerId) : null;
  const title = expense ? "Redigera återkommande kostnad" : "Ny återkommande kostnad";

  return `
    <div class="modal-backdrop" role="presentation">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="expense-title">
        <div class="modal-header">
          <h2 id="expense-title">${title}</h2>
          <button class="icon-button" id="close-modal" type="button" aria-label="Stäng">×</button>
        </div>
        <form id="expense-form" class="stacked-form">
          <label>
            Namn
            <input name="name" placeholder="Netflix, Hyra, Mobil" value="${escapeHtml(expense?.name ?? "")}" />
          </label>
          <div class="split-fields">
            <label>
              Belopp
              <input name="amount" type="number" min="1" step="1" placeholder="149" value="${escapeHtml(expense?.amount ?? "")}" />
            </label>
            <label>
              Dragningsdag
              <input name="drawDay" type="number" min="1" max="31" value="${escapeHtml(expense?.drawDay ?? 1)}" />
            </label>
          </div>
          <div class="split-fields">
            <label>
              Startmånad
              <input name="startMonth" type="month" value="${escapeHtml(expense?.startMonth ?? monthKey())}" />
            </label>
            <label>
              Period
              <select name="period">
                <option value="monthly" ${expense?.period === "monthly" ? "selected" : ""}>Månadsvis</option>
                <option value="quarterly" ${expense?.period === "quarterly" ? "selected" : ""}>Kvartalsvis</option>
                <option value="yearly" ${expense?.period === "yearly" ? "selected" : ""}>Årsvis</option>
                <option value="once" ${expense?.period === "once" ? "selected" : ""}>Engång</option>
              </select>
            </label>
          </div>
          <div class="split-fields">
            <label>
              Kategori
              <select name="categoryId">
                ${wallet.categories.map((item) => `<option value="${item.id}" ${expense?.categoryId === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
              </select>
            </label>
            <label>
              Betalare
              <select name="payerId">
                ${wallet.payers.map((item) => `<option value="${item.id}" ${expense?.payerId === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
              </select>
            </label>
          </div>
          <label>
            Leverantör
            <input name="providerName" placeholder="Leverantör eller handlare" value="${escapeHtml(provider?.name ?? expense?.providerName ?? "")}" />
          </label>
          <div class="split-fields">
            <label>
              Uppsägning
              <input name="noticeValue" type="number" min="0" value="${escapeHtml(expense?.noticeValue ?? 0)}" />
            </label>
            <label>
              Enhet
              <select name="noticeUnit">
                <option value="months" ${expense?.noticeUnit === "months" ? "selected" : ""}>Månader</option>
                <option value="days" ${expense?.noticeUnit === "days" ? "selected" : ""}>Dagar</option>
              </select>
            </label>
          </div>
          <label>
            Anteckning
            <textarea name="note" rows="3" placeholder="Avtal, kontaktväg eller praktisk kontext">${escapeHtml(expense?.note ?? "")}</textarea>
          </label>
          <div id="expense-errors" class="form-errors" aria-live="polite"></div>
          <div class="modal-actions">
            <button class="secondary-button" id="cancel-expense" type="button">Avbryt</button>
            <button class="secondary-button" id="save-expense-draft" type="button">Spara utkast</button>
            <button class="primary-button" type="submit">${expense ? "Spara ändringar" : "Spara kostnad"}</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

function renderDrawer(wallet, expense, months) {
  const category = wallet.categories.find((item) => item.id === expense.categoryId);
  const payer = wallet.payers.find((item) => item.id === expense.payerId);
  const provider = wallet.providers.find((item) => item.id === expense.providerId);
  const freeMonth = earliestFreeMonth(expense);
  const locks = lockedMonths(expense, months);
  const attachments = expense.attachments ?? [];

  return `
    <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div class="drawer-header">
        <div>
          <p class="eyebrow">Detalj</p>
          <h2 id="drawer-title">${escapeHtml(expense.name)}</h2>
        </div>
        <button class="icon-button" id="close-drawer" type="button" aria-label="Stäng">×</button>
      </div>
      <dl class="detail-list">
        <div><dt>Belopp</dt><dd>${formatMoney(expense.amount)}</dd></div>
        <div><dt>Period</dt><dd>${periodLabel(expense.period)}</dd></div>
        <div><dt>Kategori</dt><dd>${escapeHtml(category?.name ?? "Övrigt")}</dd></div>
        <div><dt>Betalare</dt><dd>${escapeHtml(payer?.name ?? "Okänd")}</dd></div>
        <div><dt>Leverantör</dt><dd>${escapeHtml(provider?.name ?? expense.providerName)}</dd></div>
        <div><dt>Tidigaste fria månad</dt><dd>${freeMonth ? monthLabel(freeMonth) : "Uppsägningsinfo saknas"}</dd></div>
        <div><dt>Låsta månader i vy</dt><dd>${locks.length ? locks.map((key) => monthLabel(key)).join(", ") : "Inga"}</dd></div>
        <div><dt>Status</dt><dd>${expense.status === "ended" ? `Avslutad ${monthLabel(expense.endMonth)}` : "Aktiv"}</dd></div>
      </dl>
      ${expense.noticeValue ? "" : `<section class="drawer-warning"><h3>Saknad uppsägningsinfo</h3><p>Lägg till uppsägningstid för att appen ska kunna visa realistisk effekt och låst period.</p></section>`}
      <section class="drawer-signals">
        <h3>Signaler</h3>
        <div class="signal-chips">
          ${walletSignals(wallet).map((signal) => `<button class="signal-chip ${(expense.signals ?? []).includes(signal.id) ? "active" : ""}" data-signal-id="${signal.id}" type="button">${signal.label}</button>`).join("")}
        </div>
      </section>
      <section class="drawer-note">
        <h3>Anteckning</h3>
        <p>${escapeHtml(expense.note || "Ingen anteckning ännu.")}</p>
      </section>
      <section class="drawer-note">
        <h3>Bilagor</h3>
        ${attachments.length ? `<div class="attachment-list">${attachments.map((file) => `<a href="${file.dataUrl}" download="${escapeHtml(file.name)}">${escapeHtml(file.name)} <span>${Math.round(file.size / 1024)} kB</span></a>`).join("")}</div>` : `<p>Inga bilagor ännu.</p>`}
        <label class="import-button compact-import">
          ${icon("upload")}
          Lägg till fil
          <input id="expense-attachment" type="file" />
        </label>
      </section>
      <div class="drawer-actions">
        <button class="secondary-button" id="edit-expense" type="button">Redigera</button>
        <button class="secondary-button" id="simulate-expense" type="button">Simulera bort</button>
        <button class="secondary-button" id="create-reminder" type="button">Påminnelse</button>
        <button class="secondary-button" id="convert-expense" type="button">Gör till köp</button>
        <button class="secondary-button" id="end-expense" type="button">Avsluta</button>
        <button class="danger-button" id="delete-expense" type="button">Ta bort</button>
      </div>
    </aside>
  `;
}

function bindEvents(wallet) {
  document.querySelector("#wallet-form")?.addEventListener("submit", handleWalletSubmit);
  document.querySelectorAll("[data-view]").forEach((element) => {
    element.addEventListener("click", () => {
      state.view = element.dataset.view;
      render();
    });
  });
  document.querySelector("#wallet-select")?.addEventListener("change", (event) => {
    setData({ ...state.data, activeWalletId: event.target.value });
  });
  document.querySelector("#open-expense-modal")?.addEventListener("click", () => {
    state.editingExpenseId = null;
    state.modal = "expense";
    render();
  });
  document.querySelector("#empty-add-expense")?.addEventListener("click", () => {
    state.editingExpenseId = null;
    state.modal = "expense";
    render();
  });
  document.querySelector("#close-modal")?.addEventListener("click", closeModal);
  document.querySelector("#cancel-expense")?.addEventListener("click", closeModal);
  document.querySelector("#expense-form")?.addEventListener("submit", handleExpenseSubmit);
  document.querySelector("#save-expense-draft")?.addEventListener("click", handleExpenseDraftSubmit);
  document.querySelector("#purchase-form")?.addEventListener("submit", handlePurchaseSubmit);
  document.querySelector("#import-purchases-csv")?.addEventListener("change", handlePurchaseCsvImport);
  document.querySelector("#close-import-preview")?.addEventListener("click", closeImportPreview);
  document.querySelector("#cancel-import")?.addEventListener("click", closeImportPreview);
  document.querySelector("#commit-import")?.addEventListener("click", commitPurchaseImport);
  document.querySelector("#new-purchase")?.addEventListener("click", () => {
    state.editingPurchaseId = null;
    state.modal = "purchase";
    render();
  });
  document.querySelector("#convert-purchase")?.addEventListener("click", () => convertSelectedPurchaseToRecurring());
  document.querySelectorAll("[data-edit-purchase]").forEach((element) => {
    element.addEventListener("click", () => {
      state.editingPurchaseId = element.dataset.editPurchase;
      state.modal = "purchase";
      render();
    });
  });
  document.querySelector("#filters")?.addEventListener("input", handleFilterChange);
  document.querySelector("#filters")?.addEventListener("change", handleFilterChange);
  document.querySelector("#close-drawer")?.addEventListener("click", () => {
    state.drawerExpenseId = null;
    render();
  });
  document.querySelector("#edit-expense")?.addEventListener("click", () => {
    state.editingExpenseId = state.drawerExpenseId;
    state.modal = "expense";
    render();
  });
  document.querySelector("#delete-expense")?.addEventListener("click", () => {
    if (confirm("Ta bort den här återkommande kostnaden?")) {
      deleteSelectedExpense();
    }
  });
  document.querySelector("#end-expense")?.addEventListener("click", () => {
    endSelectedExpense();
  });
  document.querySelector("#simulate-expense")?.addEventListener("click", () => {
    if (state.drawerExpenseId && !state.simulatedExpenseIds.includes(state.drawerExpenseId)) {
      state.simulatedExpenseIds = [...state.simulatedExpenseIds, state.drawerExpenseId];
      state.drawerExpenseId = null;
      render();
    }
  });
  document.querySelector("#create-reminder")?.addEventListener("click", () => createReminderForSelectedExpense());
  document.querySelector("#expense-attachment")?.addEventListener("change", handleExpenseAttachment);
  document.querySelector("#convert-expense")?.addEventListener("click", () => convertSelectedExpenseToPurchase());
  document.querySelectorAll("[data-purchase-signal-id]").forEach((element) => {
    element.addEventListener("click", () => toggleSelectedPurchaseSignal(element.dataset.purchaseSignalId));
  });
  document.querySelector("#reset-simulation")?.addEventListener("click", () => {
    state.simulatedExpenseIds = [];
    render();
  });
  document.querySelectorAll("[data-signal-id]").forEach((element) => {
    element.addEventListener("click", () => toggleSelectedExpenseSignal(element.dataset.signalId));
  });
  document.querySelector("#export-json")?.addEventListener("click", () => {
    downloadText("costtracker-export.json", exportState(state.data));
  });
  document.querySelector("#export-json-data")?.addEventListener("click", () => {
    downloadText("costtracker-export.json", exportState(state.data));
  });
  document.querySelector("#export-wallet-data")?.addEventListener("click", () => {
    downloadText(`${slugify(wallet.name)}.wallet.json`, exportState({ activeWalletId: wallet.id, wallets: [wallet] }));
  });
  document.querySelector("#export-purchases-csv")?.addEventListener("click", () => exportPurchasesCsv(wallet));
  document.querySelector("#export-recurring-csv")?.addEventListener("click", () => exportRecurringCsv(wallet));
  document.querySelector("#export-reminders-ics")?.addEventListener("click", () => {
    downloadText(`${slugify(wallet.name)}-reminders.ics`, remindersToIcs(wallet.reminders ?? []));
  });
  document.querySelector("#export-zip")?.addEventListener("click", () => exportZip(wallet));
  document.querySelector("#export-pdf-report")?.addEventListener("click", () => exportPdfReport(wallet));
  document.querySelector("#import-json")?.addEventListener("change", handleImportJson);
  document.querySelector("#reconnect-json")?.addEventListener("change", handleReconnectJson);
  document.querySelector("#import-mastercard-statement")?.addEventListener("change", handleMastercardStatementImport);
  document.querySelector("#wallet-settings-form")?.addEventListener("submit", handleWalletSettingsSubmit);
  document.querySelector("#product-settings-form")?.addEventListener("submit", handleProductSettingsSubmit);
  document.querySelector("#sync-form")?.addEventListener("submit", handleSyncSubmit);
  document.querySelector("#new-wallet-form")?.addEventListener("submit", handleNewWalletSubmit);
  document.querySelector("#duplicate-wallet")?.addEventListener("click", duplicateActiveWallet);
  document.querySelector("#delete-wallet")?.addEventListener("click", deleteActiveWallet);
  document.querySelector("#payer-form")?.addEventListener("submit", handlePayerSubmit);
  document.querySelector("#category-form")?.addEventListener("submit", handleCategorySubmit);
  document.querySelector("#provider-form")?.addEventListener("submit", handleProviderSubmit);
  document.querySelector("#merchant-rule-form")?.addEventListener("submit", handleMerchantRuleSubmit);
  document.querySelectorAll("[data-edit-payer]").forEach((element) => {
    element.addEventListener("click", () => editPayer(element.dataset.editPayer));
  });
  document.querySelectorAll("[data-edit-category]").forEach((element) => {
    element.addEventListener("click", () => editCategory(element.dataset.editCategory));
  });
  document.querySelectorAll("[data-edit-provider]").forEach((element) => {
    element.addEventListener("click", () => editProvider(element.dataset.editProvider));
  });
  document.querySelectorAll("[data-delete-rule]").forEach((element) => {
    element.addEventListener("click", () => deleteMerchantRule(element.dataset.deleteRule));
  });
  document.querySelector("#clear-local-data")?.addEventListener("click", () => {
    if (confirm("Rensa all lokal CostTracker-data i den här webbläsaren?")) {
      clearState();
      state.data = { activeWalletId: null, wallets: [] };
      state.drawerExpenseId = null;
      render();
    }
  });

  document.querySelectorAll("[data-expense-id]").forEach((element) => {
    element.addEventListener("click", () => {
      state.drawerExpenseId = element.dataset.expenseId;
      render();
    });
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        state.drawerExpenseId = element.dataset.expenseId;
        render();
      }
    });
  });
}

function handleWalletSubmit(event) {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.currentTarget));
  const errors = validateWalletInput(formData);
  const errorBox = document.querySelector("#wallet-errors");

  if (Object.keys(errors).length) {
    errorBox.innerHTML = Object.values(errors).map((error) => `<p>${error}</p>`).join("");
    return;
  }

  const wallet = createWallet(formData);
  setData({ activeWalletId: wallet.id, wallets: [wallet] });
}

function handleNewWalletSubmit(event) {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.currentTarget));
  const errors = validateWalletInput(formData);
  if (Object.keys(errors).length) {
    alert(Object.values(errors).join("\n"));
    return;
  }

  const wallet = createWallet(formData);
  setData({ activeWalletId: wallet.id, wallets: [...state.data.wallets, wallet] });
}

function handleWalletSettingsSubmit(event) {
  event.preventDefault();
  const wallet = getActiveWallet();
  const formData = Object.fromEntries(new FormData(event.currentTarget));
  const nextWallet = updateWalletSettings(wallet, formData);
  replaceWallet(nextWallet);
}

function handleProductSettingsSubmit(event) {
  event.preventDefault();
  const wallet = getActiveWallet();
  const formData = Object.fromEntries(new FormData(event.currentTarget));
  const nextWallet = updateProductSettings(wallet, {
    purchasesEnabled: Boolean(formData.purchasesEnabled),
    plan: formData.plan,
    businessSignalLabel: formData.businessSignalLabel,
  });
  replaceWallet(nextWallet);
}

function handleSyncSubmit(event) {
  event.preventDefault();
  const wallet = getActiveWallet();
  const formData = Object.fromEntries(new FormData(event.currentTarget));
  replaceWallet(updateSyncConfig(wallet, { ...formData, enabled: Boolean(formData.enabled) }));
}

function duplicateActiveWallet() {
  const wallet = getActiveWallet();
  const name = prompt("Namn på den nya plånboken", `${wallet.name} kopia`);
  if (!name) return;

  const duplicate = duplicateWallet(wallet, name);
  setData({ activeWalletId: duplicate.id, wallets: [...state.data.wallets, duplicate] });
}

function deleteActiveWallet() {
  const wallet = getActiveWallet();
  if (!wallet) return;
  const message = `Radera plånboken "${wallet.name}" och all lokal data i den?`;
  if (!confirm(message)) return;

  setData(removeWalletFromState(state.data, wallet.id));
  state.drawerExpenseId = null;
  state.editingExpenseId = null;
  state.simulatedExpenseIds = state.simulatedExpenseIds.filter((id) => id !== wallet.id);
}

function handlePayerSubmit(event) {
  event.preventDefault();
  const wallet = structuredClone(getActiveWallet());
  const formData = Object.fromEntries(new FormData(event.currentTarget));
  if (!formData.name?.trim()) return;

  wallet.payers.push(createPayer(formData));
  wallet.updatedAt = new Date().toISOString();
  replaceWallet(wallet);
}

function handleCategorySubmit(event) {
  event.preventDefault();
  const wallet = structuredClone(getActiveWallet());
  const formData = Object.fromEntries(new FormData(event.currentTarget));
  if (!formData.name?.trim()) return;

  wallet.categories.push(createCategory(formData));
  wallet.updatedAt = new Date().toISOString();
  replaceWallet(wallet);
}

function handleProviderSubmit(event) {
  event.preventDefault();
  const wallet = structuredClone(getActiveWallet());
  const formData = Object.fromEntries(new FormData(event.currentTarget));
  if (!formData.name?.trim()) return;

  wallet.providers.push(createProvider(formData));
  wallet.updatedAt = new Date().toISOString();
  replaceWallet(wallet);
}

function handleMerchantRuleSubmit(event) {
  event.preventDefault();
  const wallet = getActiveWallet();
  const formData = Object.fromEntries(new FormData(event.currentTarget));
  if (!formData.merchantName?.trim() || !formData.categoryId) return;

  replaceWallet({ ...upsertMerchantCategoryRule(structuredClone(wallet), formData.merchantName, formData.categoryId), updatedAt: new Date().toISOString() });
}

function deleteMerchantRule(ruleId) {
  const wallet = structuredClone(getActiveWallet());
  wallet.merchantCategoryRules = (wallet.merchantCategoryRules ?? []).filter((rule) => rule.id !== ruleId);
  wallet.updatedAt = new Date().toISOString();
  replaceWallet(wallet);
}

function editPayer(payerId) {
  const wallet = structuredClone(getActiveWallet());
  const payer = wallet.payers.find((item) => item.id === payerId);
  if (!payer) return;

  const name = prompt("Namn", payer.name);
  if (!name) return;
  const monthlyBudget = prompt("Månadsbudget", payer.monthlyBudget ?? 0);
  wallet.payers = wallet.payers.map((item) => (item.id === payerId ? updatePayer(item, { name, monthlyBudget }) : item));
  wallet.updatedAt = new Date().toISOString();
  replaceWallet(wallet);
}

function editCategory(categoryId) {
  const wallet = structuredClone(getActiveWallet());
  const category = wallet.categories.find((item) => item.id === categoryId);
  if (!category) return;

  const name = prompt("Kategori", category.name);
  if (!name) return;
  const color = prompt("Färg", category.color);
  wallet.categories = wallet.categories.map((item) => (item.id === categoryId ? updateCategory(item, { name, color }) : item));
  wallet.updatedAt = new Date().toISOString();
  replaceWallet(wallet);
}

function editProvider(providerId) {
  const wallet = structuredClone(getActiveWallet());
  const provider = wallet.providers.find((item) => item.id === providerId);
  if (!provider) return;

  const name = prompt("Leverantör", provider.name);
  if (!name) return;
  const cancellationInstruction = prompt("Uppsägningsinstruktion", provider.cancellationInstruction ?? "");
  wallet.providers = wallet.providers.map((item) =>
    item.id === providerId ? updateProvider(item, { ...item, name, cancellationInstruction }) : item,
  );
  wallet.updatedAt = new Date().toISOString();
  replaceWallet(wallet);
}

function replaceWallet(nextWallet) {
  setData({
    ...state.data,
    activeWalletId: nextWallet.id,
    wallets: state.data.wallets.map((wallet) => (wallet.id === nextWallet.id ? nextWallet : wallet)),
  });
}

function handleExpenseSubmit(event) {
  event.preventDefault();
  saveExpenseFromForm(event.currentTarget, false);
}

function handleExpenseDraftSubmit(event) {
  saveExpenseFromForm(event.currentTarget.closest("form"), true);
}

function saveExpenseFromForm(form, forceDraft) {
  const wallet = getActiveWallet();
  const formData = { ...Object.fromEntries(new FormData(form)), forceDraft };
  const errors = validateExpenseInput(formData);
  const errorBox = document.querySelector("#expense-errors");

  if (!forceDraft && Object.keys(errors).length) {
    errorBox.innerHTML = Object.values(errors).map((error) => `<p>${error}</p>`).join("");
    return;
  }

  let nextWallet = structuredClone(wallet);
  const existing = nextWallet.recurringExpenses.find((expense) => expense.id === state.editingExpenseId);
  const expense = existing
    ? updateRecurringExpense(existing, formData, nextWallet)
    : createRecurringExpense(formData, nextWallet);

  nextWallet.recurringExpenses = existing
    ? nextWallet.recurringExpenses.map((item) => (item.id === existing.id ? expense : item))
    : [...nextWallet.recurringExpenses, expense];
  nextWallet.updatedAt = new Date().toISOString();

  setData({
    ...state.data,
    wallets: state.data.wallets.map((item) => (item.id === wallet.id ? nextWallet : item)),
  });
  state.modal = null;
  state.editingExpenseId = null;
  state.drawerExpenseId = expense.id;
  render();
}

function handlePurchaseSubmit(event) {
  event.preventDefault();
  const wallet = getActiveWallet();
  const formData = Object.fromEntries(new FormData(event.currentTarget));
  const errors = validatePurchaseInput(formData);
  const errorBox = document.querySelector("#purchase-errors");

  if (Object.keys(errors).length) {
    errorBox.innerHTML = Object.values(errors).map((error) => `<p>${error}</p>`).join("");
    return;
  }

  const nextWallet = structuredClone(wallet);
  nextWallet.purchases ??= [];
  const existing = nextWallet.purchases.find((purchase) => purchase.id === state.editingPurchaseId);
  const purchase = existing ? updatePurchase(existing, formData, nextWallet) : createPurchase(formData, nextWallet);
  nextWallet.purchases = existing
    ? nextWallet.purchases.map((item) => (item.id === existing.id ? purchase : item))
    : [...nextWallet.purchases, purchase];
  nextWallet.updatedAt = new Date().toISOString();

  replaceWallet(nextWallet);
  state.modal = null;
  state.editingPurchaseId = null;
}

async function handlePurchaseCsvImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const wallet = getActiveWallet();
  const rows = previewImportedPurchases(wallet, parsePurchaseCsv(await file.text())).filter(
    (row) => row.date && row.merchantName && Number(row.amount) > 0,
  );
  state.importPreview = { rows };
  state.importPreviewSource = file.name;
  event.target.value = "";
  render();
}

async function handleMastercardStatementImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const wallet = getActiveWallet();
    const rows = previewImportedPurchases(wallet, await parseMastercardStatementFile(file)).filter(
      (row) => row.date && row.merchantName && Number(row.amount) > 0,
    );
    state.importPreview = { rows };
    state.importPreviewSource = file.name;
    render();
  } catch (error) {
    alert(error.message);
  } finally {
    event.target.value = "";
  }
}

function commitPurchaseImport() {
  const wallet = getActiveWallet();
  if (!wallet || !state.importPreview) return;

  const nextWallet = structuredClone(wallet);
  nextWallet.purchases ??= [];
  const rows = state.importPreview.rows.filter((row) => !row.duplicate && !row.ignored);
  for (const row of rows) {
    nextWallet.purchases.push(
      createPurchase(
        {
          ...row,
          categoryId: nextWallet.categories.at(-1).id,
          payerId: nextWallet.payers[0].id,
          source: row.source ?? "import",
        },
        nextWallet,
      ),
    );
  }
  nextWallet.updatedAt = new Date().toISOString();
  state.importPreview = null;
  state.importPreviewSource = "";
  replaceWallet(nextWallet);
}

function closeImportPreview() {
  state.importPreview = null;
  state.importPreviewSource = "";
  render();
}

function createReminderForSelectedExpense() {
  const wallet = getActiveWallet();
  const expense = wallet?.recurringExpenses.find((item) => item.id === state.drawerExpenseId);
  if (!wallet || !expense) return;

  const nextWallet = structuredClone(wallet);
  nextWallet.reminders ??= [];
  nextWallet.reminders.push(createCancellationReminder(expense));
  nextWallet.updatedAt = new Date().toISOString();
  replaceWallet(nextWallet);
}

async function handleExpenseAttachment(event) {
  const file = event.target.files?.[0];
  const wallet = getActiveWallet();
  if (!file || !wallet || !state.drawerExpenseId) return;

  const dataUrl = await fileToDataUrl(file);
  const nextWallet = structuredClone(wallet);
  nextWallet.recurringExpenses = nextWallet.recurringExpenses.map((expense) =>
    expense.id === state.drawerExpenseId
      ? addExpenseAttachment(expense, { name: file.name, type: file.type, size: file.size, dataUrl })
      : expense,
  );
  replaceWallet(nextWallet);
}

function toggleSelectedPurchaseSignal(signalId) {
  const wallet = getActiveWallet();
  if (!wallet || !state.editingPurchaseId || !signalId) return;

  const nextWallet = structuredClone(wallet);
  nextWallet.purchases = (nextWallet.purchases ?? []).map((purchase) =>
    purchase.id === state.editingPurchaseId ? togglePurchaseSignal(purchase, signalId) : purchase,
  );
  replaceWallet(nextWallet);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function convertSelectedPurchaseToRecurring() {
  const wallet = getActiveWallet();
  const purchase = wallet?.purchases?.find((item) => item.id === state.editingPurchaseId);
  if (!wallet || !purchase) return;

  const nextWallet = structuredClone(wallet);
  nextWallet.recurringExpenses.push(convertPurchaseToRecurring(purchase));
  nextWallet.updatedAt = new Date().toISOString();
  state.modal = null;
  state.editingPurchaseId = null;
  state.view = "overview";
  replaceWallet(nextWallet);
}

function convertSelectedExpenseToPurchase() {
  const wallet = getActiveWallet();
  const expense = wallet?.recurringExpenses.find((item) => item.id === state.drawerExpenseId);
  if (!wallet || !expense) return;

  const nextWallet = structuredClone(wallet);
  nextWallet.purchases ??= [];
  nextWallet.purchases.push(convertRecurringToPurchase(expense));
  nextWallet.updatedAt = new Date().toISOString();
  state.drawerExpenseId = null;
  state.view = "purchases";
  replaceWallet(nextWallet);
}

function deleteSelectedExpense() {
  const wallet = getActiveWallet();
  if (!wallet || !state.drawerExpenseId) return;

  const nextWallet = removeRecurringExpense(structuredClone(wallet), state.drawerExpenseId);
  setData({
    ...state.data,
    wallets: state.data.wallets.map((item) => (item.id === wallet.id ? nextWallet : item)),
  });
  state.drawerExpenseId = null;
  state.editingExpenseId = null;
  render();
}

function endSelectedExpense() {
  const wallet = getActiveWallet();
  if (!wallet || !state.drawerExpenseId) return;

  const endMonth = prompt("Vilken månad ska kostnaden avslutas?", monthKey());
  if (!endMonth) return;

  const nextWallet = structuredClone(wallet);
  nextWallet.recurringExpenses = nextWallet.recurringExpenses.map((expense) =>
    expense.id === state.drawerExpenseId ? endRecurringExpense(expense, endMonth) : expense,
  );
  nextWallet.updatedAt = new Date().toISOString();

  setData({
    ...state.data,
    wallets: state.data.wallets.map((item) => (item.id === wallet.id ? nextWallet : item)),
  });
}

function toggleSelectedExpenseSignal(signalId) {
  const wallet = getActiveWallet();
  if (!wallet || !state.drawerExpenseId || !signalId) return;

  const nextWallet = structuredClone(wallet);
  nextWallet.recurringExpenses = nextWallet.recurringExpenses.map((expense) =>
    expense.id === state.drawerExpenseId ? toggleExpenseSignal(expense, signalId) : expense,
  );
  nextWallet.updatedAt = new Date().toISOString();

  setData({
    ...state.data,
    wallets: state.data.wallets.map((item) => (item.id === wallet.id ? nextWallet : item)),
  });
}

function handleFilterChange(event) {
  const form = event.currentTarget;
  const formData = Object.fromEntries(new FormData(form));
  state.filters = {
    query: formData.query ?? "",
    categoryId: formData.categoryId ?? "all",
    payerId: formData.payerId ?? "all",
    signal: formData.signal ?? "all",
    hideHistory: Boolean(formData.hideHistory),
  };
  render();
}

function closeModal() {
  state.modal = null;
  state.editingExpenseId = null;
  state.editingPurchaseId = null;
  render();
}

function downloadText(filename, text) {
  downloadBlob(filename, new Blob([text], { type: "application/octet-stream" }));
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportPurchasesCsv(wallet) {
  const csv = toCsv(wallet.purchases ?? [], [
    { label: "date", value: (row) => row.date },
    { label: "merchant", value: (row) => row.merchantName },
    { label: "amount", value: (row) => row.amount },
    { label: "type", value: (row) => row.type },
    { label: "note", value: (row) => row.note },
  ]);
  downloadText(`${slugify(wallet.name)}-purchases.csv`, csv);
}

function exportRecurringCsv(wallet) {
  const csv = toCsv(wallet.recurringExpenses, [
    { label: "name", value: (row) => row.name },
    { label: "amount", value: (row) => row.amount },
    { label: "period", value: (row) => row.period },
    { label: "startMonth", value: (row) => row.startMonth },
    { label: "status", value: (row) => row.status },
  ]);
  downloadText(`${slugify(wallet.name)}-recurring.csv`, csv);
}

function exportZip(wallet) {
  const zip = createStoredZip([
    { name: "costtracker-export.json", content: exportState({ activeWalletId: wallet.id, wallets: [wallet] }) },
    {
      name: "purchases.csv",
      content: toCsv(wallet.purchases ?? [], [
        { label: "date", value: (row) => row.date },
        { label: "merchant", value: (row) => row.merchantName },
        { label: "amount", value: (row) => row.amount },
      ]),
    },
    {
      name: "recurring.csv",
      content: toCsv(wallet.recurringExpenses, [
        { label: "name", value: (row) => row.name },
        { label: "amount", value: (row) => row.amount },
        { label: "period", value: (row) => row.period },
      ]),
    },
  ]);
  downloadBlob(`${slugify(wallet.name)}-backup.zip`, new Blob([zip], { type: "application/zip" }));
}

function exportPdfReport(wallet) {
  const html = createReportHtml(wallet, summarizeFinance(wallet, buildMonthWindow(wallet)));
  const report = window.open("", "_blank");
  if (!report) {
    downloadText(`${slugify(wallet.name)}-rapport.html`, html);
    return;
  }
  report.document.write(html);
  report.document.close();
  report.focus();
  report.print();
}

async function handleImportJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const imported = parseImportedState(await file.text());
    const wallets = [...state.data.wallets, ...imported.wallets];
    const activeWalletId = imported.wallets.at(-1)?.id ?? state.data.activeWalletId;
    setData({ activeWalletId, wallets });
  } catch (error) {
    alert(error.message);
  } finally {
    event.target.value = "";
  }
}

async function handleReconnectJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    setData(parseImportedState(await file.text()));
  } catch (error) {
    alert(error.message);
  } finally {
    event.target.value = "";
  }
}

function periodLabel(period) {
  return {
    monthly: "Månadsvis",
    quarterly: "Kvartalsvis",
    yearly: "Årsvis",
    once: "Engång",
  }[period] ?? period;
}

function walletSignals(wallet) {
  return SIGNALS.map((signal) =>
    signal.id === "business" ? { ...signal, label: wallet.settings?.businessSignalLabel ?? signal.label } : signal,
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "") || "wallet";
}

const ICON_PATHS = {
  archive: '<path d="M4 7h16"/><path d="M6 7v11h12V7"/><path d="M8 4h8l2 3H6z"/><path d="M10 11h4"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M4 10h16"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/>',
  cart: '<circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/><path d="M4 5h2l2.1 9.2a2 2 0 0 0 2 1.6h6.9a2 2 0 0 0 1.9-1.4L20 8H7"/>',
  chart: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15v-4"/><path d="M12 15V8"/><path d="M16 15v-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  copy: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/>',
  database: '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
  download: '<path d="M12 3v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.7 2.7 0 1 1 4.6 1.9c-.9.8-2.1 1.3-2.1 2.6"/><path d="M12 17h.01"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/><path d="m3 18 9 5 9-5"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><path d="M3 10h18"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1"/>',
  list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  radar: '<circle cx="12" cy="12" r="8"/><path d="M12 12 17 7"/><path d="M12 4v8h8"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  rules: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h10"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
  shield: '<path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-5"/>',
  spark: '<path d="M12 2v6"/><path d="M12 16v6"/><path d="M4.9 4.9 9 9"/><path d="m15 15 4.1 4.1"/><path d="M2 12h6"/><path d="M16 12h6"/><path d="m4.9 19.1 4.1-4.1"/><path d="m15 9 4.1-4.1"/>',
  store: '<path d="M4 10h16l-1-5H5z"/><path d="M6 10v10h12V10"/><path d="M9 20v-6h6v6"/><path d="M4 10c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2"/>',
  sync: '<path d="M21 12a9 9 0 0 1-15.5 6.2"/><path d="M3 12A9 9 0 0 1 18.5 5.8"/><path d="M18 2v4h4"/><path d="M6 22v-4H2"/>',
  tag: '<path d="M20 13 13 20 4 11V4h7z"/><circle cx="8.5" cy="8.5" r="1.5"/>',
  trend: '<path d="M3 17 9 11l4 4 7-8"/><path d="M14 7h6v6"/>',
  upload: '<path d="M12 21V10"/><path d="m7 14 5-5 5 5"/><path d="M5 4h14"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  wallet: '<path d="M4 7a3 3 0 0 1 3-3h11v16H6a2 2 0 0 1-2-2z"/><path d="M4 8h15a2 2 0 0 1 2 2v3h-5a2 2 0 0 0 0 4h5v1a2 2 0 0 1-2 2"/><path d="M16 15h.01"/>',
};

function icon(name) {
  return `<svg class="ui-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name] ?? ICON_PATHS.spark}</svg>`;
}

render();
