// Trace: US-003, US-076, US-077, US-078, US-079, US-080, US-081, US-082, US-083, US-084, US-099, TECH-001.

const STORAGE_KEY = "costtracker2.localState.v1";

export function loadState(storage = resolveStorage()) {
  try {
    if (!storage) return createEmptyState();
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { activeWalletId: null, wallets: [] };
    const parsed = JSON.parse(raw);
    return {
      activeWalletId: parsed.activeWalletId ?? parsed.wallets?.[0]?.id ?? null,
      wallets: Array.isArray(parsed.wallets) ? parsed.wallets : [],
    };
  } catch {
    return createEmptyState();
  }
}

export function saveState(state, storage = resolveStorage()) {
  if (!storage) return;
  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...state, savedAt: new Date().toISOString() }),
  );
}

export function clearState(storage = resolveStorage()) {
  storage?.removeItem(STORAGE_KEY);
}

export function exportState(state) {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
}

export function parseImportedState(raw) {
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed.wallets)) {
    return {
      activeWalletId: parsed.activeWalletId ?? parsed.wallets[0]?.id ?? null,
      wallets: parsed.wallets,
    };
  }

  if (parsed.id && parsed.name) {
    return {
      activeWalletId: parsed.id,
      wallets: [parsed],
    };
  }

  throw new Error("Importfilen innehåller ingen giltig plånbok.");
}

export function toCsv(rows, columns) {
  const header = columns.map((column) => column.label).join(",");
  const body = rows.map((row) => columns.map((column) => csvCell(column.value(row))).join(",")).join("\n");
  return [header, body].filter(Boolean).join("\n");
}

export function createReportHtml(wallet, stats) {
  return `<!doctype html>
<html lang="sv">
<head><meta charset="utf-8"><title>${escapeHtml(wallet.name)} rapport</title>
<style>body{font-family:Arial,sans-serif;margin:32px;color:#142033}table{width:100%;border-collapse:collapse;margin:16px 0}td,th{border:1px solid #cbd6e4;padding:8px;text-align:left}th{background:#eef3f8}.num{text-align:right}</style></head>
<body>
<h1>${escapeHtml(wallet.name)} - rapport</h1>
<p>Skapad lokalt ${new Date().toLocaleString("sv-SE")}</p>
<h2>Sammanfattning</h2>
<table><tr><th>Nyckeltal</th><th class="num">Belopp</th></tr>
<tr><td>Återkommande per månad</td><td class="num">${stats.recurringMonthly}</td></tr>
<tr><td>Köp denna månad</td><td class="num">${stats.purchaseMonthTotal}</td></tr>
<tr><td>Årstakt återkommande</td><td class="num">${stats.recurringAnnual}</td></tr></table>
<h2>Återkommande kostnader</h2>
<table><tr><th>Namn</th><th>Period</th><th class="num">Belopp</th></tr>${wallet.recurringExpenses.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.period)}</td><td class="num">${row.amount}</td></tr>`).join("")}</table>
<h2>Köp</h2>
<table><tr><th>Datum</th><th>Handlare</th><th class="num">Belopp</th></tr>${(wallet.purchases ?? []).map((row) => `<tr><td>${escapeHtml(row.date)}</td><td>${escapeHtml(row.merchantName)}</td><td class="num">${row.amount}</td></tr>`).join("")}</table>
</body></html>`;
}

export function createStoredZip(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = typeof file.content === "string" ? encoder.encode(file.content) : file.content;
    const crc = crc32(data);
    const local = concatBytes([
      u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length),
      u16(name.length), u16(0), name, data,
    ]);
    const central = concatBytes([
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length),
      u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name,
    ]);
    localParts.push(local);
    centralParts.push(central);
    offset += local.length;
  }

  const central = concatBytes(centralParts);
  const end = concatBytes([u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(central.length), u32(offset), u16(0)]);
  return concatBytes([...localParts, central, end]);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function u16(value) {
  return new Uint8Array([value & 255, (value >> 8) & 255]);
}

function u32(value) {
  return new Uint8Array([value & 255, (value >> 8) & 255, (value >> 16) & 255, (value >> 24) & 255]);
}

function concatBytes(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function crc32(data) {
  let crc = -1;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ -1) >>> 0;
}

export function createEmptyState() {
  return { activeWalletId: null, wallets: [] };
}

export function getStorageKey() {
  return STORAGE_KEY;
}

function resolveStorage() {
  return globalThis.localStorage;
}
