// Trace: US-045, US-046, US-047.

import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { parseMastercardPdf, parseMastercardTableRows, parseMastercardXlsx } from "../src/mastercard-import.js";

test("US-045 parses MasterCard statement table rows into purchases", () => {
  const rows = parseMastercardTableRows([
    ["Datum", "Bokfört", "Specifikation", "Ort", "Valuta", "Utl. belopp", "Belopp"],
    ["2026-04-07", "2026-04-07", "APPLE.COM/BILL", "CORK", "SEK", "0", "129"],
    ["Totalt belopp", "", "", "", "", "", "129"],
  ], "mastercard-xlsx");

  assert.equal(rows.length, 1);
  assert.equal(rows[0].date, "2026-04-07");
  assert.equal(rows[0].bookedDate, "2026-04-07");
  assert.equal(rows[0].merchantName, "APPLE.COM/BILL");
  assert.equal(rows[0].amount, 129);
});

const xlsxPath = "C:/Users/hellgrenpo/Downloads/april 2026.xlsx";
test("US-045 parses the provided MasterCard Excel sample", { skip: !fs.existsSync(xlsxPath) }, async () => {
  const rows = await parseMastercardXlsx(fs.readFileSync(xlsxPath));

  assert.equal(rows.length, 51);
  assert.equal(rows[0].merchantName, "ZIGNED.SE");
  assert.equal(rows.at(-1).merchantName, "JULA SVERIGE AB 426");
});

const pdfPath = "C:/Users/hellgrenpo/Downloads/mc_pdf_april.pdf";
test("US-045 parses the provided MasterCard PDF sample", { skip: !fs.existsSync(pdfPath) }, async () => {
  const rows = await parseMastercardPdf(fs.readFileSync(pdfPath));

  assert.equal(rows.length, 51);
  assert.equal(rows.some((row) => row.merchantName === "NETFLIX.COM" && row.amount === 199), true);
  assert.equal(rows.some((row) => row.merchantName === "ICA KVANTUM LILLANGE" && row.amount === 95.85), true);
});
