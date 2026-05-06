// Trace: US-020, US-022, US-031, US-032, US-064, TECH-001.

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildMonthWindow,
  addExpenseAttachment,
  createCategory,
  createPayer,
  createProvider,
  createPurchase,
  createCancellationReminder,
  convertPurchaseToRecurring,
  convertRecurringToPurchase,
  createRecurringExpense,
  createWallet,
  detectSyncConflict,
  duplicateWallet,
  endRecurringExpense,
  earliestFreeMonth,
  expenseOccursInMonth,
  filterPurchases,
  findCategoryRule,
  lockedMonths,
  parsePurchaseCsv,
  previewImportedPurchases,
  remindersToIcs,
  removeRecurringExpense,
  removeWalletFromState,
  simulateRecurringRemoval,
  summarizeSignals,
  summarizeFinance,
  summarizeTimeline,
  toggleExpenseSignal,
  togglePurchaseSignal,
  updatePurchase,
  updateProductSettings,
  updateSyncConfig,
  updateWalletSettings,
  upsertMerchantCategoryRule,
  updateRecurringExpense,
} from "../src/domain.js";

test("buildMonthWindow creates a bounded planning period around the current month", () => {
  const months = buildMonthWindow({ monthsBack: 1, monthsForward: 2 }, new Date("2026-05-05"));
  assert.deepEqual(months, ["2026-04", "2026-05", "2026-06", "2026-07"]);
});

test("quarterly expenses occur every third month from start", () => {
  const expense = { startMonth: "2026-01", period: "quarterly", amount: 300 };
  assert.equal(expenseOccursInMonth(expense, "2026-01"), true);
  assert.equal(expenseOccursInMonth(expense, "2026-02"), false);
  assert.equal(expenseOccursInMonth(expense, "2026-04"), true);
});

test("timeline summary totals each month and derives annual run rate", () => {
  const wallet = {
    monthsBack: 0,
    recurringExpenses: [
      { startMonth: "2026-05", period: "monthly", amount: 100 },
      { startMonth: "2026-06", period: "once", amount: 250 },
    ],
  };
  const summary = summarizeTimeline(wallet, ["2026-05", "2026-06"]);
  assert.deepEqual(summary.totals, [100, 350]);
  assert.equal(summary.activeTotal, 100);
  assert.equal(summary.annualRunRate, 1200);
});

test("earliestFreeMonth accounts for notice period and locked months", () => {
  const expense = {
    startMonth: "2026-01",
    period: "monthly",
    amount: 100,
    noticeValue: 2,
    noticeUnit: "months",
  };
  assert.equal(earliestFreeMonth(expense, new Date("2026-05-05")), "2026-08");
  assert.deepEqual(
    lockedMonths(expense, ["2026-05", "2026-06", "2026-07", "2026-08"], new Date("2026-05-05")),
    ["2026-05", "2026-06", "2026-07"],
  );
});

test("US-012 updates a recurring expense without creating duplicates", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  const original = createRecurringExpense(
    {
      name: "Streaming",
      amount: 129,
      startMonth: "2026-05",
      period: "monthly",
      categoryId: wallet.categories[1].id,
      payerId: wallet.payers[0].id,
      providerName: "StreamCo",
    },
    wallet,
  );
  wallet.recurringExpenses.push(original);

  const updated = updateRecurringExpense(
    original,
    {
      name: "Streaming Plus",
      amount: 159,
      startMonth: "2026-06",
      period: "yearly",
      categoryId: wallet.categories[2].id,
      payerId: wallet.payers[0].id,
      providerName: "StreamCo",
      noticeValue: 1,
      noticeUnit: "months",
      note: "Updated terms",
    },
    wallet,
  );

  const expenses = wallet.recurringExpenses.map((expense) => (expense.id === original.id ? updated : expense));
  assert.equal(expenses.length, 1);
  assert.equal(expenses[0].id, original.id);
  assert.equal(expenses[0].name, "Streaming Plus");
  assert.equal(expenses[0].amount, 159);
  assert.equal(expenses[0].period, "yearly");
});

test("US-014 removes a recurring expense from the wallet", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  const first = createRecurringExpense(
    {
      name: "Hyra",
      amount: 9000,
      categoryId: wallet.categories[0].id,
      payerId: wallet.payers[0].id,
      providerName: "Hyresvärd",
    },
    wallet,
  );
  const second = createRecurringExpense(
    {
      name: "Mobil",
      amount: 249,
      categoryId: wallet.categories[4].id,
      payerId: wallet.payers[0].id,
      providerName: "Telco",
    },
    wallet,
  );
  wallet.recurringExpenses.push(first, second);

  const nextWallet = removeRecurringExpense(wallet, first.id);
  assert.deepEqual(
    nextWallet.recurringExpenses.map((expense) => expense.id),
    [second.id],
  );
});

test("US-013 ends a recurring expense and stops future timeline impact", () => {
  const expense = {
    id: "rec-1",
    name: "Mobil",
    startMonth: "2026-01",
    period: "monthly",
    amount: 249,
  };

  const ended = endRecurringExpense(expense, "2026-06");
  assert.equal(ended.status, "ended");
  assert.equal(ended.endMonth, "2026-06");
  assert.equal(expenseOccursInMonth(ended, "2026-06"), true);
  assert.equal(expenseOccursInMonth(ended, "2026-07"), false);
});

test("US-059 toggles a signal on and off when the same signal is clicked", () => {
  const expense = { id: "rec-1", signals: ["review"] };

  const withUnnecessary = toggleExpenseSignal(expense, "unnecessary");
  assert.deepEqual(withUnnecessary.signals.sort(), ["review", "unnecessary"].sort());

  const withoutUnnecessary = toggleExpenseSignal(withUnnecessary, "unnecessary");
  assert.deepEqual(withoutUnnecessary.signals, ["review"]);
});

test("US-053 US-054 US-056 US-057 summarizes signal counts", () => {
  const summary = summarizeSignals([
    { signals: ["review", "unnecessary"] },
    { signals: ["unnecessary", "worth-it"] },
    { signals: ["business"] },
  ]);

  assert.equal(summary.review, 1);
  assert.equal(summary.unnecessary, 2);
  assert.equal(summary["worth-it"], 1);
  assert.equal(summary.business, 1);
});

test("US-005 duplicates a wallet as a reusable template with remapped relations", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  const expense = createRecurringExpense(
    {
      name: "Hyra",
      amount: 9000,
      categoryId: wallet.categories[0].id,
      payerId: wallet.payers[0].id,
      providerName: "Hyresvärd",
    },
    wallet,
  );
  wallet.recurringExpenses.push(expense);

  const copy = duplicateWallet(wallet, "Hem kopia");
  assert.notEqual(copy.id, wallet.id);
  assert.equal(copy.name, "Hem kopia");
  assert.notEqual(copy.payers[0].id, wallet.payers[0].id);
  assert.equal(copy.recurringExpenses.length, 1);
  assert.equal(copy.recurringExpenses[0].payerId, copy.payers[0].id);
});

test("US-006 removes a wallet and selects the next available wallet", () => {
  const first = createWallet({ name: "Första", payerName: "Anne" });
  const second = createWallet({ name: "Andra", payerName: "Denzel" });
  const nextState = removeWalletFromState({ activeWalletId: first.id, wallets: [first, second] }, first.id);

  assert.deepEqual(
    nextState.wallets.map((wallet) => wallet.id),
    [second.id],
  );
  assert.equal(nextState.activeWalletId, second.id);
});

test("US-004 updates wallet planning window within bounds", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  const updated = updateWalletSettings(wallet, { name: "Nytt namn", monthsBack: 99, monthsForward: 0 });

  assert.equal(updated.name, "Nytt namn");
  assert.equal(updated.monthsBack, 36);
  assert.equal(updated.monthsForward, 1);
});

test("US-036 US-037 US-038 US-039 US-040 creates register records", () => {
  const payer = createPayer({ name: "Anne", monthlyBudget: 30000 });
  const category = createCategory({ name: "Media", color: "#123456" });
  const provider = createProvider({
    name: "StreamCo",
    contactInfo: "stream.example",
    cancellationInstruction: "Mina sidor",
  });

  assert.equal(payer.monthlyBudget, 30000);
  assert.equal(category.color, "#123456");
  assert.equal(provider.cancellationInstruction, "Mina sidor");
});

test("US-043 creates a manual purchase linked to payer category and provider", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  const purchase = createPurchase(
    {
      date: "2026-05-05",
      merchantName: "Matbutiken",
      amount: 421,
      categoryId: wallet.categories[4].id,
      payerId: wallet.payers[0].id,
      type: "purchase",
    },
    wallet,
  );

  assert.equal(purchase.amount, 421);
  assert.equal(purchase.payerId, wallet.payers[0].id);
  assert.equal(purchase.categoryId, wallet.categories[4].id);
  assert.equal(wallet.providers.length, 1);
});

test("US-044 edits a manual purchase without losing identity", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  const purchase = createPurchase(
    {
      merchantName: "Butik",
      amount: 100,
      categoryId: wallet.categories[4].id,
      payerId: wallet.payers[0].id,
    },
    wallet,
  );

  const updated = updatePurchase(
    purchase,
    {
      merchantName: "Butik nytt",
      amount: 150,
      categoryId: wallet.categories[0].id,
      payerId: wallet.payers[0].id,
      type: "business",
    },
    wallet,
  );

  assert.equal(updated.id, purchase.id);
  assert.equal(updated.merchantName, "Butik nytt");
  assert.equal(updated.amount, 150);
  assert.equal(updated.type, "business");
});

test("US-052 filters purchases by query category and payer", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  const groceries = createPurchase(
    {
      merchantName: "Matbutiken",
      amount: 421,
      categoryId: wallet.categories[4].id,
      payerId: wallet.payers[0].id,
    },
    wallet,
  );
  const media = createPurchase(
    {
      merchantName: "StreamCo",
      amount: 99,
      categoryId: wallet.categories[1].id,
      payerId: wallet.payers[0].id,
    },
    wallet,
  );
  wallet.purchases = [groceries, media];

  assert.deepEqual(
    filterPurchases(wallet, { query: "stream", categoryId: "all", payerId: "all", signal: "all" }).map(
      (purchase) => purchase.id,
    ),
    [media.id],
  );
  assert.deepEqual(
    filterPurchases(wallet, { query: "", categoryId: wallet.categories[4].id, payerId: "all", signal: "all" }).map(
      (purchase) => purchase.id,
    ),
    [groceries.id],
  );
});

test("US-065 US-066 US-067 US-068 US-069 US-072 US-074 summarizes finance insight", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  wallet.payers[0].monthlyBudget = 10000;
  const recurring = createRecurringExpense(
    {
      name: "Hyra",
      amount: 7000,
      categoryId: wallet.categories[0].id,
      payerId: wallet.payers[0].id,
      providerName: "Hyresvärd",
    },
    wallet,
  );
  const purchase = createPurchase(
    {
      date: new Date().toISOString().slice(0, 10),
      merchantName: "Matbutiken",
      amount: 500,
      categoryId: wallet.categories[4].id,
      payerId: wallet.payers[0].id,
    },
    wallet,
  );
  wallet.recurringExpenses = [recurring];
  wallet.purchases = [purchase];

  const stats = summarizeFinance(wallet, buildMonthWindow(wallet));
  assert.equal(stats.recurringMonthly, 7000);
  assert.equal(stats.purchaseMonthTotal, 500);
  assert.equal(stats.budgetRemaining, 2500);
  assert.equal(stats.merchantByAmount[0].label, "Matbutiken");
  assert.equal(stats.categoryByAmount[0].label, "Boende");
});

test("US-045 US-046 parses CSV purchases and previews duplicates", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  const existing = createPurchase(
    {
      date: "2026-05-05",
      merchantName: "Matbutiken",
      amount: 421,
      categoryId: wallet.categories[4].id,
      payerId: wallet.payers[0].id,
    },
    wallet,
  );
  wallet.purchases = [existing];

  const rows = parsePurchaseCsv(`date,merchant,amount\n2026-05-05,Matbutiken,421\n2026-05-06,StreamCo,99`);
  const preview = previewImportedPurchases(wallet, rows);

  assert.equal(preview[0].duplicate, true);
  assert.equal(preview[1].duplicate, false);
  assert.equal(preview[1].merchantName, "StreamCo");
});

test("US-045 US-047 marks imported MasterCard rows as ignored when they match recurring expenses", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  const recurring = createRecurringExpense(
    {
      name: "Netflix",
      providerName: "NETFLIX.COM",
      amount: 199,
      categoryId: wallet.categories[1].id,
      payerId: wallet.payers[0].id,
    },
    wallet,
  );
  wallet.recurringExpenses = [recurring];

  const preview = previewImportedPurchases(wallet, [
    { date: "2026-03-22", bookedDate: "2026-03-22", merchantName: "NETFLIX.COM", amount: 199 },
    { date: "2026-03-22", bookedDate: "2026-03-23", merchantName: "VINTED", amount: 682.89 },
  ]);

  assert.equal(preview[0].ignored, true);
  assert.match(preview[0].ignoredReason, /Netflix/);
  assert.equal(preview[1].ignored, false);
});

test("US-094 US-095 US-096 simulates removal without mutating wallet data", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  const first = createRecurringExpense(
    {
      name: "Streaming",
      amount: 100,
      categoryId: wallet.categories[1].id,
      payerId: wallet.payers[0].id,
      providerName: "StreamCo",
    },
    wallet,
  );
  const second = createRecurringExpense(
    {
      name: "Mobil",
      amount: 200,
      categoryId: wallet.categories[4].id,
      payerId: wallet.payers[0].id,
      providerName: "Telco",
    },
    wallet,
  );
  wallet.recurringExpenses = [first, second];

  const simulated = simulateRecurringRemoval(wallet, [first.id]);
  assert.deepEqual(
    simulated.recurringExpenses.map((expense) => expense.id),
    [second.id],
  );
  assert.equal(wallet.recurringExpenses.length, 2);
});

test("US-033 US-034 creates cancellation reminder and exports ICS", () => {
  const expense = {
    id: "rec-1",
    name: "Streaming",
    startMonth: "2026-01",
    period: "monthly",
    amount: 100,
    noticeValue: 1,
    noticeUnit: "months",
  };
  const reminder = createCancellationReminder(expense, "2026-07");
  const ics = remindersToIcs([reminder]);

  assert.equal(reminder.date, "2026-07-01");
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /SUMMARY:Kontrollera uppsägning: Streaming/);
});

test("US-058 US-097 US-098 updates product settings without paywall behavior", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  const updated = updateProductSettings(wallet, {
    purchasesEnabled: false,
    plan: "premium",
    businessSignalLabel: "Avdrag",
  });

  assert.equal(updated.settings.purchasesEnabled, false);
  assert.equal(updated.settings.plan, "premium");
  assert.equal(updated.settings.businessSignalLabel, "Avdrag");
});

test("US-085 US-086 stores experimental sync config and detects conflicts without network", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  const synced = updateSyncConfig(wallet, {
    enabled: true,
    endpoint: "https://example.test/sync",
    localVersion: 2,
    remoteVersion: 3,
    conflictStrategy: "manual",
  });

  assert.equal(synced.sync.enabled, true);
  assert.equal(synced.sync.endpoint, "https://example.test/sync");
  assert.equal(detectSyncConflict(synced), true);
});

test("US-060 US-061 converts purchase to recurring expense with source link", () => {
  const purchase = {
    id: "purchase-1",
    date: "2026-05-12",
    merchantName: "StreamCo",
    amount: 129,
    categoryId: "cat-media",
    payerId: "payer-1",
    providerId: "provider-1",
  };

  const expense = convertPurchaseToRecurring(purchase);
  assert.equal(expense.sourcePurchaseId, "purchase-1");
  assert.equal(expense.name, "StreamCo");
  assert.equal(expense.startMonth, "2026-05");
  assert.equal(expense.drawDay, 12);
});

test("US-011 saves incomplete recurring expense as draft", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  const draft = createRecurringExpense(
    {
      name: "",
      amount: "",
      categoryId: wallet.categories[0].id,
      payerId: wallet.payers[0].id,
      forceDraft: true,
    },
    wallet,
  );

  assert.equal(draft.status, "draft");
  assert.equal(draft.name, "Utkast");
});

test("US-019 adds attachment metadata to recurring expense", () => {
  const expense = { id: "rec-1", attachments: [] };
  const attached = addExpenseAttachment(expense, {
    name: "avtal.pdf",
    type: "application/pdf",
    size: 1234,
    dataUrl: "data:application/pdf;base64,AA==",
  });

  assert.equal(attached.attachments.length, 1);
  assert.equal(attached.attachments[0].name, "avtal.pdf");
});

test("US-042 US-051 saves merchant category rule and applies it to purchases", () => {
  let wallet = createWallet({ name: "Hem", payerName: "Anne" });
  wallet = upsertMerchantCategoryRule(wallet, "Matbutiken", wallet.categories[0].id);
  const purchase = createPurchase(
    {
      merchantName: "Matbutiken",
      amount: 99,
      payerId: wallet.payers[0].id,
    },
    wallet,
  );

  assert.equal(findCategoryRule(wallet, "matbutiken").categoryId, wallet.categories[0].id);
  assert.equal(purchase.categoryId, wallet.categories[0].id);
});

test("US-055 toggles recurring signal on a purchase", () => {
  const purchase = { id: "purchase-1", signals: [] };
  const updated = togglePurchaseSignal(purchase, "recurring");
  assert.deepEqual(updated.signals, ["recurring"]);
});

test("US-073 builds purchase radar with watch signal", () => {
  const wallet = createWallet({ name: "Hem", payerName: "Anne" });
  wallet.purchases = [
    { merchantName: "Butik", amount: 400 },
    { merchantName: "Butik", amount: 400 },
    { merchantName: "Butik", amount: 400 },
  ];

  const stats = summarizeFinance(wallet, buildMonthWindow(wallet));
  assert.equal(stats.purchaseRadar[0].label, "Butik");
  assert.equal(stats.purchaseRadar[0].signal, "watch");
});

test("US-062 converts recurring expense to a single purchase", () => {
  const expense = {
    id: "rec-1",
    name: "Streaming",
    providerName: "StreamCo",
    amount: 129,
    startMonth: "2026-05",
    categoryId: "cat-media",
    payerId: "payer-1",
    providerId: "provider-1",
  };

  const purchase = convertRecurringToPurchase(expense);
  assert.equal(purchase.sourceRecurringId, "rec-1");
  assert.equal(purchase.merchantName, "StreamCo");
  assert.equal(purchase.date, "2026-05-01");
});
