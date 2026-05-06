// Trace: OUT-001, JNY-001, US-004, US-005, US-006, US-012, US-013, US-014, US-020, US-022, US-025, US-030, US-031, US-032, US-033, US-034, US-035, US-036, US-037, US-038, US-039, US-040, US-041, US-043, US-044, US-045, US-046, US-047, US-049, US-050, US-052, US-053, US-054, US-056, US-057, US-058, US-059, US-060, US-061, US-062, US-063, US-064, US-065, US-066, US-067, US-068, US-069, US-070, US-071, US-072, US-074, US-075, US-094, US-095, US-096, US-097, US-098, TECH-001.

export const DEFAULT_CATEGORIES = [
  { id: "cat-housing", name: "Boende", color: "#1f6feb" },
  { id: "cat-media", name: "Media", color: "#7c3aed" },
  { id: "cat-transport", name: "Transport", color: "#0f766e" },
  { id: "cat-health", name: "Hälsa", color: "#b45309" },
  { id: "cat-other", name: "Övrigt", color: "#64748b" },
];

export const SIGNALS = [
  { id: "review", label: "Granska" },
  { id: "unnecessary", label: "Onödigt" },
  { id: "worth-it", label: "Värt det" },
  { id: "business", label: "Business" },
];

export function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

export function createWallet({ name, payerName, template = "standard", monthsBack = 2, monthsForward = 6 }) {
  const payerId = createId("payer");
  const now = new Date().toISOString();

  return {
    id: createId("wallet"),
    name: name.trim(),
    template,
    active: true,
    monthsBack: Number(monthsBack),
    monthsForward: Number(monthsForward),
    createdAt: now,
    updatedAt: now,
    payers: [{ id: payerId, name: payerName.trim(), monthlyBudget: 0, active: true }],
    categories: DEFAULT_CATEGORIES,
    providers: [],
    recurringExpenses: [],
    purchases: [],
    reminders: [],
    merchantCategoryRules: [],
    settings: {
      purchasesEnabled: true,
      plan: "free",
      businessSignalLabel: "Business",
    },
    sync: {
      enabled: false,
      endpoint: "",
      localVersion: 1,
      remoteVersion: null,
      conflictStrategy: "manual",
    },
  };
}

export function duplicateWallet(wallet, name = `${wallet.name} kopia`) {
  const now = new Date().toISOString();
  const idMap = new Map();
  const cloneId = (oldId, prefix) => {
    const nextId = createId(prefix);
    idMap.set(oldId, nextId);
    return nextId;
  };

  const payers = wallet.payers.map((payer) => ({ ...payer, id: cloneId(payer.id, "payer") }));
  const categories = wallet.categories.map((category) => ({ ...category, id: cloneId(category.id, "cat") }));
  const providers = wallet.providers.map((provider) => ({ ...provider, id: cloneId(provider.id, "provider") }));
  const recurringExpenses = wallet.recurringExpenses.map((expense) => ({
    ...expense,
    id: createId("rec"),
    payerId: idMap.get(expense.payerId) ?? expense.payerId,
    categoryId: idMap.get(expense.categoryId) ?? expense.categoryId,
    providerId: idMap.get(expense.providerId) ?? expense.providerId,
    createdAt: now,
    updatedAt: now,
  }));
  const purchases = (wallet.purchases ?? []).map((purchase) => ({
    ...purchase,
    id: createId("purchase"),
    payerId: idMap.get(purchase.payerId) ?? purchase.payerId,
    categoryId: idMap.get(purchase.categoryId) ?? purchase.categoryId,
    providerId: idMap.get(purchase.providerId) ?? purchase.providerId,
    createdAt: now,
    updatedAt: now,
  }));

  return {
    ...wallet,
    id: createId("wallet"),
    name: name.trim(),
    active: true,
    createdAt: now,
    updatedAt: now,
    payers,
    categories,
    providers,
    recurringExpenses,
    purchases,
    reminders: (wallet.reminders ?? []).map((reminder) => ({ ...reminder, id: createId("reminder") })),
    merchantCategoryRules: (wallet.merchantCategoryRules ?? []).map((rule) => ({ ...rule, id: createId("rule") })),
    settings: { ...wallet.settings },
    sync: { ...wallet.sync },
  };
}

export function updateWalletSettings(wallet, input) {
  return {
    ...wallet,
    name: input.name?.trim() || wallet.name,
    monthsBack: clamp(Number(input.monthsBack ?? wallet.monthsBack), 0, 36),
    monthsForward: clamp(Number(input.monthsForward ?? wallet.monthsForward), 1, 60),
    updatedAt: new Date().toISOString(),
  };
}

export function updateProductSettings(wallet, input) {
  return {
    ...wallet,
    settings: {
      purchasesEnabled: input.purchasesEnabled ?? wallet.settings?.purchasesEnabled ?? true,
      plan: input.plan || wallet.settings?.plan || "free",
      businessSignalLabel: input.businessSignalLabel?.trim() || wallet.settings?.businessSignalLabel || "Business",
    },
    updatedAt: new Date().toISOString(),
  };
}

export function updateSyncConfig(wallet, input) {
  return {
    ...wallet,
    sync: {
      enabled: Boolean(input.enabled),
      endpoint: input.endpoint?.trim() || "",
      localVersion: Number(input.localVersion ?? wallet.sync?.localVersion ?? 1),
      remoteVersion: input.remoteVersion ? Number(input.remoteVersion) : null,
      conflictStrategy: input.conflictStrategy || wallet.sync?.conflictStrategy || "manual",
    },
    updatedAt: new Date().toISOString(),
  };
}

export function detectSyncConflict(wallet) {
  if (!wallet.sync?.enabled || !wallet.sync.remoteVersion) return false;
  return Number(wallet.sync.remoteVersion) !== Number(wallet.sync.localVersion);
}

export function removeWalletFromState(data, walletId) {
  const wallets = data.wallets.filter((wallet) => wallet.id !== walletId);
  return {
    ...data,
    wallets,
    activeWalletId: wallets[0]?.id ?? null,
  };
}

export function validateWalletInput({ name, payerName }) {
  const errors = {};
  if (!name?.trim()) errors.name = "Ange ett namn på plånboken.";
  if (!payerName?.trim()) errors.payerName = "Lägg till minst en betalare.";
  return errors;
}

export function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function parseMonth(key) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

export function addMonths(date, count) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

export function monthLabel(key, locale = "sv-SE") {
  return new Intl.DateTimeFormat(locale, { month: "short", year: "2-digit" }).format(parseMonth(key));
}

export function buildMonthWindow({ monthsBack, monthsForward }, now = new Date()) {
  const start = addMonths(new Date(now.getFullYear(), now.getMonth(), 1), -Number(monthsBack || 0));
  const count = Number(monthsBack || 0) + Number(monthsForward || 0) + 1;
  return Array.from({ length: count }, (_, index) => monthKey(addMonths(start, index)));
}

export function createRecurringExpense(input, wallet) {
  const category = wallet.categories.find((item) => item.id === input.categoryId) ?? wallet.categories.at(-1);
  const payer = wallet.payers.find((item) => item.id === input.payerId) ?? wallet.payers[0];
  const providerName = input.providerName?.trim() || "Okänd leverantör";
  const provider = findOrCreateProvider(wallet, providerName);

  return {
    id: createId("rec"),
    name: input.name?.trim() || "Utkast",
    amount: Number(input.amount || 0),
    startMonth: input.startMonth || monthKey(),
    drawDay: clamp(Number(input.drawDay || 1), 1, 31),
    period: input.period || "monthly",
    categoryId: category.id,
    payerId: payer.id,
    providerId: provider.id,
    providerName,
    status: input.forceDraft || !input.name?.trim() || Number(input.amount || 0) <= 0 ? "draft" : "active",
    noticeValue: Number(input.noticeValue || 0),
    noticeUnit: input.noticeUnit || "months",
    note: input.note?.trim() || "",
    signals: input.signals ?? [],
    attachments: input.attachments ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createPurchase(input, wallet) {
  const merchantName = input.merchantName?.trim() || "Okänd handlare";
  const ruleCategoryId = findCategoryRule(wallet, merchantName)?.categoryId;
  const category = wallet.categories.find((item) => item.id === (input.categoryId || ruleCategoryId)) ?? wallet.categories.at(-1);
  const payer = wallet.payers.find((item) => item.id === input.payerId) ?? wallet.payers[0];
  const provider = findOrCreateProvider(wallet, merchantName);
  const now = new Date().toISOString();

  return {
    id: createId("purchase"),
    date: input.date || now.slice(0, 10),
    bookedDate: input.bookedDate || input.date || now.slice(0, 10),
    merchantName,
    amount: Number(input.amount),
    categoryId: category.id,
    payerId: payer.id,
    providerId: provider.id,
    type: input.type || "purchase",
    signals: input.signals ?? [],
    note: input.note?.trim() || "",
    source: input.source || "manual",
    importKey: input.importKey || purchaseDedupKey({ ...input, merchantName }),
    statementSource: input.statementSource || "",
    createdAt: now,
    updatedAt: now,
  };
}

export function updatePurchase(existing, input, wallet) {
  const category = wallet.categories.find((item) => item.id === input.categoryId) ?? wallet.categories.at(-1);
  const payer = wallet.payers.find((item) => item.id === input.payerId) ?? wallet.payers[0];
  const merchantName = input.merchantName?.trim() || existing.merchantName;
  const provider = findOrCreateProvider(wallet, merchantName);

  return {
    ...existing,
    date: input.date || existing.date,
    bookedDate: input.bookedDate || input.date || existing.bookedDate,
    merchantName,
    amount: Number(input.amount),
    categoryId: category.id,
    payerId: payer.id,
    providerId: provider.id,
    type: input.type || existing.type || "purchase",
    note: input.note?.trim() || "",
    updatedAt: new Date().toISOString(),
  };
}

export function convertPurchaseToRecurring(purchase) {
  const now = new Date().toISOString();
  return {
    id: createId("rec"),
    name: purchase.merchantName,
    amount: Number(purchase.amount),
    startMonth: purchase.date?.slice(0, 7) ?? monthKey(),
    drawDay: Number(purchase.date?.slice(8, 10) || 1),
    period: "monthly",
    categoryId: purchase.categoryId,
    payerId: purchase.payerId,
    providerId: purchase.providerId,
    providerName: purchase.merchantName,
    status: "active",
    noticeValue: 0,
    noticeUnit: "months",
    note: purchase.note || "Skapad från köp",
    signals: ["recurring"],
    sourcePurchaseId: purchase.id,
    createdAt: now,
    updatedAt: now,
  };
}

export function convertRecurringToPurchase(expense) {
  const now = new Date().toISOString();
  return {
    id: createId("purchase"),
    date: `${expense.startMonth}-01`,
    bookedDate: `${expense.startMonth}-01`,
    merchantName: expense.providerName || expense.name,
    amount: Number(expense.amount),
    categoryId: expense.categoryId,
    payerId: expense.payerId,
    providerId: expense.providerId,
    type: "purchase",
    signals: ["converted"],
    note: `Skapad från återkommande kostnad: ${expense.name}`,
    source: "conversion",
    sourceRecurringId: expense.id,
    createdAt: now,
    updatedAt: now,
  };
}

export function validatePurchaseInput(input) {
  const errors = {};
  if (!input.merchantName?.trim()) errors.merchantName = "Ange handlare.";
  if (!Number(input.amount) || Number(input.amount) <= 0) errors.amount = "Ange ett belopp över 0.";
  if (!input.payerId) errors.payerId = "Välj betalare.";
  if (!input.categoryId) errors.categoryId = "Välj kategori.";
  return errors;
}

export function filterPurchases(wallet, filters) {
  const query = filters.query?.trim().toLowerCase();
  return (wallet.purchases ?? []).filter((purchase) => {
    const category = wallet.categories.find((item) => item.id === purchase.categoryId);
    const payer = wallet.payers.find((item) => item.id === purchase.payerId);
    const provider = wallet.providers.find((item) => item.id === purchase.providerId);
    const haystack = [purchase.merchantName, category?.name, payer?.name, provider?.name, purchase.note]
      .join(" ")
      .toLowerCase();

    if (query && !haystack.includes(query)) return false;
    if (filters.categoryId && filters.categoryId !== "all" && purchase.categoryId !== filters.categoryId) return false;
    if (filters.payerId && filters.payerId !== "all" && purchase.payerId !== filters.payerId) return false;
    if (filters.signal && filters.signal !== "all" && !purchase.signals.includes(filters.signal)) return false;
    return true;
  });
}

export function createMerchantCategoryRule(input) {
  return {
    id: createId("rule"),
    merchantName: input.merchantName.trim(),
    categoryId: input.categoryId,
    createdAt: new Date().toISOString(),
  };
}

export function findCategoryRule(wallet, merchantName) {
  return (wallet.merchantCategoryRules ?? []).find(
    (rule) => normalizeKey(rule.merchantName) === normalizeKey(merchantName),
  );
}

export function upsertMerchantCategoryRule(wallet, merchantName, categoryId) {
  const existing = findCategoryRule(wallet, merchantName);
  if (existing) {
    return {
      ...wallet,
      merchantCategoryRules: wallet.merchantCategoryRules.map((rule) =>
        rule.id === existing.id ? { ...rule, categoryId } : rule,
      ),
    };
  }

  return {
    ...wallet,
    merchantCategoryRules: [...(wallet.merchantCategoryRules ?? []), createMerchantCategoryRule({ merchantName, categoryId })],
  };
}

export function togglePurchaseSignal(purchase, signalId) {
  const signals = new Set(purchase.signals ?? []);
  if (signals.has(signalId)) {
    signals.delete(signalId);
  } else {
    signals.add(signalId);
  }
  return { ...purchase, signals: Array.from(signals), updatedAt: new Date().toISOString() };
}

export function parsePurchaseCsv(csvText) {
  const [headerLine, ...lines] = csvText.trim().split(/\r?\n/).filter(Boolean);
  if (!headerLine) return [];

  const headers = splitCsvLine(headerLine).map((header) => header.trim().toLowerCase());
  return lines.map((line) => {
    const values = splitCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? ""]));
    return {
      date: row.date || row.datum,
      bookedDate: row.bookeddate || row["bokfört datum"] || row.bokfort || row.date || row.datum,
      merchantName: row.merchant || row.handlare || row.text || row.beskrivning,
      amount: Number(String(row.amount || row.belopp || "0").replace(/\s/g, "").replace(",", ".")),
      type: row.type || "purchase",
      note: row.note || row.anteckning || "",
      source: "csv",
    };
  });
}

export function previewImportedPurchases(wallet, importedRows) {
  const existingKeys = new Set((wallet.purchases ?? []).map(purchaseDedupKey));
  return importedRows.map((row) => {
    const key = purchaseDedupKey(row);
    const recurringMatch = findMatchingRecurringExpense(wallet, row);
    return {
      ...row,
      duplicate: existingKeys.has(key),
      ignored: Boolean(recurringMatch),
      ignoredReason: recurringMatch ? `Matchar återkommande kostnad: ${recurringMatch.name}` : "",
      importKey: key,
    };
  });
}

export function purchaseDedupKey(purchase) {
  return [
    purchase.date,
    purchase.bookedDate ?? purchase.date,
    normalizeKey(purchase.merchantName),
    Number(purchase.amount || 0).toFixed(2),
  ].join("|");
}

export function findMatchingRecurringExpense(wallet, purchase) {
  const merchantKey = normalizeMerchantName(purchase.merchantName);
  const amount = Number(purchase.amount || 0);
  if (!merchantKey || !amount) return null;

  return wallet.recurringExpenses.find((expense) => {
    if (expense.status === "ended") return false;
    const expenseKeys = [expense.name, expense.providerName]
      .map(normalizeMerchantName)
      .filter(Boolean);
    const merchantMatches = expenseKeys.some((key) => merchantKey.includes(key) || key.includes(merchantKey));
    const amountMatches = Math.abs(Number(expense.amount || 0) - amount) < 0.01;
    return merchantMatches && amountMatches;
  }) ?? null;
}

function splitCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;

  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function normalizeKey(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeMerchantName(value) {
  return String(value ?? "")
    .toLowerCase()
    .replaceAll(/å/g, "a")
    .replaceAll(/ä/g, "a")
    .replaceAll(/ö/g, "o")
    .replaceAll(/[^a-z0-9]+/g, "")
    .replaceAll(/ab$|com$|se$/g, "");
}

export function updateRecurringExpense(existing, input, wallet) {
  const category = wallet.categories.find((item) => item.id === input.categoryId) ?? wallet.categories.at(-1);
  const payer = wallet.payers.find((item) => item.id === input.payerId) ?? wallet.payers[0];
  const providerName = input.providerName?.trim() || existing.providerName || "Okänd leverantör";
  const provider = findOrCreateProvider(wallet, providerName);

  return {
    ...existing,
    name: input.name?.trim() || existing.name || "Utkast",
    amount: Number(input.amount || 0),
    startMonth: input.startMonth || existing.startMonth || monthKey(),
    drawDay: clamp(Number(input.drawDay || existing.drawDay || 1), 1, 31),
    period: input.period || existing.period || "monthly",
    categoryId: category.id,
    payerId: payer.id,
    providerId: provider.id,
    providerName,
    status: input.forceDraft || !input.name?.trim() || Number(input.amount || 0) <= 0 ? "draft" : "active",
    noticeValue: Number(input.noticeValue || 0),
    noticeUnit: input.noticeUnit || "months",
    note: input.note?.trim() || "",
    updatedAt: new Date().toISOString(),
  };
}

export function endRecurringExpense(existing, endMonth = monthKey()) {
  return {
    ...existing,
    endMonth,
    status: "ended",
    updatedAt: new Date().toISOString(),
  };
}

export function addExpenseAttachment(expense, attachment) {
  return {
    ...expense,
    attachments: [...(expense.attachments ?? []), { id: createId("file"), ...attachment }],
    updatedAt: new Date().toISOString(),
  };
}

export function removeRecurringExpense(wallet, expenseId) {
  return {
    ...wallet,
    recurringExpenses: wallet.recurringExpenses.filter((expense) => expense.id !== expenseId),
    updatedAt: new Date().toISOString(),
  };
}

export function toggleExpenseSignal(expense, signalId) {
  const signals = new Set(expense.signals ?? []);
  if (signals.has(signalId)) {
    signals.delete(signalId);
  } else {
    signals.add(signalId);
  }

  return {
    ...expense,
    signals: Array.from(signals),
    updatedAt: new Date().toISOString(),
  };
}

export function summarizeSignals(expenses) {
  const counts = Object.fromEntries(SIGNALS.map((signal) => [signal.id, 0]));
  for (const expense of expenses) {
    for (const signal of expense.signals ?? []) {
      counts[signal] = (counts[signal] ?? 0) + 1;
    }
  }
  return counts;
}

export function summarizeFinance(wallet, months = buildMonthWindow(wallet)) {
  const recurring = summarizeTimeline(wallet, months);
  const purchaseTotal = (wallet.purchases ?? []).reduce((sum, purchase) => sum + Number(purchase.amount || 0), 0);
  const currentMonth = monthKey();
  const purchasesThisMonth = (wallet.purchases ?? []).filter((purchase) => purchase.date?.startsWith(currentMonth));
  const purchaseMonthTotal = purchasesThisMonth.reduce((sum, purchase) => sum + Number(purchase.amount || 0), 0);
  const budgetTotal = wallet.payers.reduce((sum, payer) => sum + Number(payer.monthlyBudget || 0), 0);

  return {
    recurringMonthly: recurring.activeTotal,
    recurringAnnual: recurring.annualRunRate,
    purchaseTotal,
    purchaseMonthTotal,
    budgetTotal,
    budgetRemaining: budgetTotal ? budgetTotal - recurring.activeTotal - purchaseMonthTotal : 0,
    merchantByAmount: rankBy(wallet.purchases ?? [], (purchase) => purchase.merchantName, "amount"),
    merchantByCount: rankBy(wallet.purchases ?? [], (purchase) => purchase.merchantName, "count"),
    categoryByAmount: rankBy([...(wallet.purchases ?? []), ...wallet.recurringExpenses], (item) => {
      const category = wallet.categories.find((candidate) => candidate.id === item.categoryId);
      return category?.name ?? "Övrigt";
    }, "amount"),
    providerByRecurring: rankBy(wallet.recurringExpenses, (expense) => {
      const provider = wallet.providers.find((candidate) => candidate.id === expense.providerId);
      return provider?.name ?? expense.providerName ?? "Okänd";
    }, "amount"),
    purchaseByMonth: rankBy(wallet.purchases ?? [], (purchase) => purchase.date?.slice(0, 7) ?? "Okänd", "amount"),
    purchaseRadar: buildPurchaseRadar(wallet.purchases ?? []),
  };
}

function buildPurchaseRadar(purchases) {
  const byMerchant = rankBy(purchases, (purchase) => purchase.merchantName, "amount");
  return byMerchant.map((row) => ({
    ...row,
    average: row.count ? row.amount / row.count : 0,
    signal: row.count >= 3 || row.amount >= 1000 ? "watch" : "normal",
  }));
}

export function simulateRecurringRemoval(wallet, expenseIds) {
  const simulatedIds = new Set(expenseIds);
  return {
    ...wallet,
    recurringExpenses: wallet.recurringExpenses.filter((expense) => !simulatedIds.has(expense.id)),
  };
}

export function createCancellationReminder(expense, date = earliestFreeMonth(expense) ?? monthKey()) {
  return {
    id: createId("reminder"),
    expenseId: expense.id,
    title: `Kontrollera uppsägning: ${expense.name}`,
    date: date.length === 7 ? `${date}-01` : date,
    done: false,
    createdAt: new Date().toISOString(),
  };
}

export function remindersToIcs(reminders) {
  const events = reminders
    .map((reminder) => {
      const date = reminder.date.replaceAll("-", "");
      return [
        "BEGIN:VEVENT",
        `UID:${reminder.id}@costtracker.local`,
        `DTSTART;VALUE=DATE:${date}`,
        `SUMMARY:${escapeIcs(reminder.title)}`,
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CostTracker//Local//SV", events, "END:VCALENDAR"].join("\r\n");
}

function escapeIcs(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll(",", "\\,").replaceAll(";", "\\;");
}

function rankBy(items, keyFn, mode) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    const current = map.get(key) ?? { label: key, amount: 0, count: 0 };
    current.amount += Number(item.amount || 0);
    current.count += 1;
    map.set(key, current);
  }

  return Array.from(map.values()).sort((a, b) => (mode === "count" ? b.count - a.count : b.amount - a.amount));
}

export function findOrCreateProvider(wallet, name) {
  const existing = wallet.providers.find((provider) => provider.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing;

  const provider = { id: createId("provider"), name, type: "recurring", notes: "" };
  wallet.providers.push(provider);
  return provider;
}

export function createPayer(input) {
  return {
    id: createId("payer"),
    name: input.name.trim(),
    monthlyBudget: Number(input.monthlyBudget || 0),
    active: true,
  };
}

export function updatePayer(payer, input) {
  return {
    ...payer,
    name: input.name?.trim() || payer.name,
    monthlyBudget: Number(input.monthlyBudget ?? payer.monthlyBudget ?? 0),
    active: input.active ?? payer.active,
  };
}

export function createCategory(input) {
  return {
    id: createId("cat"),
    name: input.name.trim(),
    color: input.color || "#64748b",
  };
}

export function updateCategory(category, input) {
  return {
    ...category,
    name: input.name?.trim() || category.name,
    color: input.color || category.color,
  };
}

export function createProvider(input) {
  return {
    id: createId("provider"),
    name: input.name.trim(),
    type: input.type || "recurring",
    contactInfo: input.contactInfo?.trim() || "",
    cancellationInstruction: input.cancellationInstruction?.trim() || "",
    notes: input.notes?.trim() || "",
  };
}

export function updateProvider(provider, input) {
  return {
    ...provider,
    name: input.name?.trim() || provider.name,
    type: input.type || provider.type,
    contactInfo: input.contactInfo?.trim() ?? provider.contactInfo ?? "",
    cancellationInstruction: input.cancellationInstruction?.trim() ?? provider.cancellationInstruction ?? "",
    notes: input.notes?.trim() ?? provider.notes ?? "",
  };
}

export function validateExpenseInput(input) {
  const errors = {};
  if (!input.name?.trim()) errors.name = "Ange namn på kostnaden.";
  if (!Number(input.amount) || Number(input.amount) <= 0) errors.amount = "Ange ett belopp över 0.";
  if (!input.payerId) errors.payerId = "Välj betalare.";
  if (!input.categoryId) errors.categoryId = "Välj kategori.";
  return errors;
}

export function expenseOccursInMonth(expense, targetMonth) {
  const start = parseMonth(expense.startMonth);
  const target = parseMonth(targetMonth);
  if (target < start) return false;
  if (expense.endMonth && target > parseMonth(expense.endMonth)) return false;
  if (expense.period === "once") return targetMonth === expense.startMonth;

  const diff = (target.getFullYear() - start.getFullYear()) * 12 + target.getMonth() - start.getMonth();
  if (expense.period === "quarterly") return diff % 3 === 0;
  if (expense.period === "yearly") return diff % 12 === 0;
  return true;
}

export function monthlyAmount(expense, targetMonth) {
  return expenseOccursInMonth(expense, targetMonth) ? Number(expense.amount) : 0;
}

export function summarizeTimeline(wallet, months) {
  const rows = wallet.recurringExpenses.map((expense) => ({
    expense,
    amounts: months.map((key) => monthlyAmount(expense, key)),
  }));
  const totals = months.map((_, monthIndex) => rows.reduce((sum, row) => sum + row.amounts[monthIndex], 0));
  const activeTotal = totals.at(Math.min(wallet.monthsBack ?? 0, totals.length - 1)) ?? 0;

  return {
    rows,
    totals,
    activeTotal,
    annualRunRate: activeTotal * 12,
  };
}

export function filterExpenses(wallet, filters) {
  const query = filters.query?.trim().toLowerCase();
  return wallet.recurringExpenses.filter((expense) => {
    const category = wallet.categories.find((item) => item.id === expense.categoryId);
    const payer = wallet.payers.find((item) => item.id === expense.payerId);
    const provider = wallet.providers.find((item) => item.id === expense.providerId);
    const haystack = [expense.name, category?.name, payer?.name, provider?.name, expense.note].join(" ").toLowerCase();

    if (query && !haystack.includes(query)) return false;
    if (filters.categoryId && filters.categoryId !== "all" && expense.categoryId !== filters.categoryId) return false;
    if (filters.payerId && filters.payerId !== "all" && expense.payerId !== filters.payerId) return false;
    if (filters.signal && filters.signal !== "all" && !expense.signals.includes(filters.signal)) return false;
    return true;
  });
}

export function earliestFreeMonth(expense, today = new Date()) {
  if (!expense.noticeValue) return null;
  const base = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthsToAdd = expense.noticeUnit === "days" ? Math.ceil(Number(expense.noticeValue) / 30) : Number(expense.noticeValue);
  return monthKey(addMonths(base, monthsToAdd + 1));
}

export function lockedMonths(expense, months, today = new Date()) {
  const freeMonth = earliestFreeMonth(expense, today);
  if (!freeMonth) return [];
  return months.filter((key) => key < freeMonth && expenseOccursInMonth(expense, key));
}

export function formatMoney(value, locale = "sv-SE") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
