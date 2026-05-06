// Trace: US-003, US-076, US-099, TECH-001.

import assert from "node:assert/strict";
import { test } from "node:test";
import { clearState, createReportHtml, createStoredZip, exportState, getStorageKey, loadState, parseImportedState, saveState, toCsv } from "../src/storage.js";

test("US-076 saves and loads local state through a storage adapter", () => {
  const storage = createMemoryStorage();
  const state = {
    activeWalletId: "wallet-1",
    wallets: [{ id: "wallet-1", name: "Hem", payers: [], recurringExpenses: [] }],
  };

  saveState(state, storage);
  assert.equal(loadState(storage).activeWalletId, "wallet-1");
  assert.equal(loadState(storage).wallets[0].name, "Hem");
});

test("US-076 recovers to empty state when local data is corrupt", () => {
  const storage = createMemoryStorage();
  storage.setItem(getStorageKey(), "{bad json");

  assert.deepEqual(loadState(storage), { activeWalletId: null, wallets: [] });
});

test("US-099 clears local state and exports a readable JSON backup", () => {
  const storage = createMemoryStorage();
  const state = { activeWalletId: "wallet-1", wallets: [{ id: "wallet-1", name: "Hem" }] };

  saveState(state, storage);
  clearState(storage);
  assert.deepEqual(loadState(storage), { activeWalletId: null, wallets: [] });

  const exported = JSON.parse(exportState(state));
  assert.equal(exported.activeWalletId, "wallet-1");
  assert.equal(exported.wallets[0].name, "Hem");
  assert.ok(exported.exportedAt);
});

test("US-079 imports an exported state as wallet data", () => {
  const imported = parseImportedState(
    JSON.stringify({
      activeWalletId: "wallet-1",
      wallets: [{ id: "wallet-1", name: "Importerad", payers: [] }],
    }),
  );

  assert.equal(imported.activeWalletId, "wallet-1");
  assert.equal(imported.wallets[0].name, "Importerad");
});

test("US-082 imports a standalone wallet data file", () => {
  const imported = parseImportedState(JSON.stringify({ id: "wallet-2", name: "Datafil", payers: [] }));

  assert.equal(imported.activeWalletId, "wallet-2");
  assert.equal(imported.wallets[0].name, "Datafil");
});

test("US-080 exports rows as CSV with escaped cells", () => {
  const csv = toCsv(
    [{ merchant: 'A "quoted" shop', amount: 10 }],
    [
      { label: "merchant", value: (row) => row.merchant },
      { label: "amount", value: (row) => row.amount },
    ],
  );

  assert.equal(csv, 'merchant,amount\n"A ""quoted"" shop",10');
});

test("US-078 creates a stored ZIP archive", () => {
  const zip = createStoredZip([{ name: "hello.txt", content: "hello" }]);
  assert.equal(zip[0], 0x50);
  assert.equal(zip[1], 0x4b);
});

test("US-081 creates a printable report html", () => {
  const html = createReportHtml(
    { name: "Hem", recurringExpenses: [], purchases: [] },
    { recurringMonthly: 0, purchaseMonthTotal: 0, recurringAnnual: 0 },
  );

  assert.match(html, /Hem - rapport/);
  assert.match(html, /Återkommande kostnader/);
});

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}
