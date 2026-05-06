// Trace: US-045, US-046, US-047.

const textDecoder = new TextDecoder("utf-8");
const binaryDecoder = new TextDecoder("latin1");

export async function parseMastercardStatementFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx")) return parseMastercardXlsx(await file.arrayBuffer());
  if (name.endsWith(".pdf")) return parseMastercardPdf(await file.arrayBuffer());
  throw new Error("Välj en MasterCard-specifikation som PDF eller Excel.");
}

export async function parseMastercardXlsx(input) {
  const entries = await readZipEntries(new Uint8Array(input));
  const sharedStrings = parseSharedStrings(decodeUtf8(entries["xl/sharedStrings.xml"] ?? new Uint8Array()));
  const sheetXml = decodeUtf8(entries["xl/worksheets/sheet1.xml"] ?? new Uint8Array());
  if (!sheetXml) throw new Error("Excel-filen saknar första kalkylbladet.");

  const rows = parseSheetRows(sheetXml, sharedStrings);
  return parseMastercardTableRows(rows, "mastercard-xlsx");
}

export async function parseMastercardPdf(input) {
  const streams = await inflatePdfStreams(new Uint8Array(input));
  const rows = streams.flatMap((stream) => groupPdfElementsByRow(extractPdfTextElements(stream)).map(parsePdfRow).filter(Boolean));
  return rows.map((row) => ({ ...row, source: "mastercard-pdf", statementSource: "MasterCard PDF" }));
}

export function parseMastercardTableRows(rows, source = "mastercard") {
  const transactions = [];
  let inStatementTable = false;

  for (const row of rows) {
    const cells = row.map((cell) => String(cell ?? "").trim());
    const normalized = cells.map(normalizeHeader);
    if (normalized.includes("datum") && normalized.includes("specifikation") && normalized.includes("belopp")) {
      inStatementTable = true;
      continue;
    }

    if (!inStatementTable) continue;
    const date = normalizeDate(cells[0]);
    const bookedDate = normalizeDate(cells[1]) || date;
    const amount = parseAmount(cells[6] ?? cells.at(-1));
    const merchantName = cells[2];
    if (!date || !merchantName || !Number.isFinite(amount) || amount <= 0) continue;

    transactions.push({
      date,
      bookedDate,
      merchantName,
      city: cells[3] ?? "",
      currency: cells[4] ?? "SEK",
      foreignAmount: parseAmount(cells[5]),
      amount,
      type: "purchase",
      note: [cells[3], cells[4]].filter(Boolean).join(" · "),
      source,
      statementSource: source === "mastercard-xlsx" ? "MasterCard Excel" : "MasterCard",
    });
  }

  return transactions;
}

async function readZipEntries(bytes) {
  const entries = {};
  let offset = 0;

  while (offset < bytes.length - 4) {
    if (readUint32(bytes, offset) !== 0x04034b50) {
      offset += 1;
      continue;
    }

    const flags = readUint16(bytes, offset + 6);
    const method = readUint16(bytes, offset + 8);
    const compressedSize = readUint32(bytes, offset + 18);
    const nameLength = readUint16(bytes, offset + 26);
    const extraLength = readUint16(bytes, offset + 28);
    const nameStart = offset + 30;
    const dataStart = nameStart + nameLength + extraLength;
    const name = decodeUtf8(bytes.slice(nameStart, nameStart + nameLength));

    if ((flags & 8) !== 0) throw new Error("Excel-filen använder en ZIP-variant som inte stöds lokalt ännu.");
    const compressed = bytes.slice(dataStart, dataStart + compressedSize);
    entries[name] = method === 8 ? await inflate(compressed, "deflate-raw") : compressed;
    offset = dataStart + compressedSize;
  }

  return entries;
}

async function inflate(bytes, format) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(format));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function inflatePdfStreams(bytes) {
  const pdf = binaryDecoder.decode(bytes);
  const streams = [];
  const streamRegex = /<<(?:[\s\S]*?)\/Filter\s*\/FlateDecode(?:[\s\S]*?)>>\s*stream\r?\n/g;

  for (const match of pdf.matchAll(streamRegex)) {
    const start = match.index + match[0].length;
    const end = pdf.indexOf("endstream", start);
    if (end < 0) continue;

    let chunk = bytes.slice(start, end);
    while (chunk.length && (chunk.at(-1) === 10 || chunk.at(-1) === 13)) chunk = chunk.slice(0, -1);
    try {
      streams.push(binaryDecoder.decode(await inflate(chunk, "deflate")));
    } catch {
      try {
        streams.push(binaryDecoder.decode(await inflate(chunk, "deflate-raw")));
      } catch {
        // Non-text streams are ignored. The preview will show no rows if nothing useful can be read.
      }
    }
  }

  return streams;
}

function parseSharedStrings(xml) {
  return [...xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((match) =>
    [...match[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((part) => decodeXml(part[1])).join(""),
  );
}

function parseSheetRows(xml, sharedStrings) {
  return [...xml.matchAll(/<row\b[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)].map((rowMatch) => {
    const cells = [];
    for (const cellMatch of rowMatch[2].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
      const attrs = cellMatch[1];
      const column = columnIndex(attrs.match(/\br="([A-Z]+)/)?.[1] ?? "A");
      const value = cellMatch[2].match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? "";
      const isShared = /\bt="s"/.test(attrs);
      cells[column] = isShared ? sharedStrings[Number(value)] ?? "" : normalizeCellValue(value);
    }
    return cells;
  });
}

function extractPdfTextElements(content) {
  const elements = [];
  let x = 0;
  let y = 0;
  const commandRegex =
    /(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+Tm|(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+Td|\(((?:\\.|[^\\)])*)\)\s*Tj/g;

  for (const match of content.matchAll(commandRegex)) {
    if (match[1] !== undefined) {
      x = Number(match[5]);
      y = Number(match[6]);
    } else if (match[7] !== undefined) {
      x += Number(match[7]);
      y += Number(match[8]);
    } else {
      const text = decodePdfString(match[9]).trim();
      if (text) elements.push({ x, y, text });
    }
  }

  return elements;
}

function groupPdfElementsByRow(elements) {
  const rows = [];
  for (const element of elements.filter((item) => item.y > 40).sort((a, b) => b.y - a.y || a.x - b.x)) {
    const row = rows.find((candidate) => Math.abs(candidate.y - element.y) < 1.5);
    if (row) {
      row.items.push(element);
    } else {
      rows.push({ y: element.y, items: [element] });
    }
  }

  return rows.map((row) => row.items.sort((a, b) => a.x - b.x));
}

function parsePdfRow(items) {
  const firstDate = items.find((item) => item.x < 80 && /^\d{6}$/.test(item.text));
  if (!firstDate) return null;

  const date = normalizeDate(firstDate.text);
  const bookedDate = normalizeDate(items.find((item) => item.x > 410 && item.x < 500 && /^\d{6}$/.test(item.text))?.text) || date;
  const amount = parseAmount(items.filter((item) => item.x > 500).map((item) => item.text).join(""));
  const merchantName = items.filter((item) => item.x >= 85 && item.x < 245).map((item) => item.text).join(" ").trim();
  const city = items.filter((item) => item.x >= 245 && item.x < 315).map((item) => item.text).join(" ").trim();
  const currency = items.find((item) => item.x >= 315 && item.x < 360)?.text ?? "SEK";

  if (!date || !merchantName || !Number.isFinite(amount) || amount <= 0) return null;
  return {
    date,
    bookedDate,
    merchantName,
    city,
    currency,
    amount,
    type: "purchase",
    note: [city, currency].filter(Boolean).join(" · "),
  };
}

function normalizeDate(value) {
  const text = String(value ?? "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  if (/^\d{6}$/.test(text)) {
    const year = Number(text.slice(0, 2));
    return `${year > 80 ? "19" : "20"}${text.slice(0, 2)}-${text.slice(2, 4)}-${text.slice(4, 6)}`;
  }
  if (/^\d+(\.\d+)?$/.test(text) && Number(text) > 30000) {
    return new Date(Date.UTC(1899, 11, 30 + Number(text))).toISOString().slice(0, 10);
  }
  return "";
}

function parseAmount(value) {
  const text = String(value ?? "").replace(/\s/g, "").replace(",", ".");
  const amount = Number(text);
  return Number.isFinite(amount) ? amount : NaN;
}

function normalizeCellValue(value) {
  return decodeXml(value);
}

function normalizeHeader(value) {
  return String(value ?? "").trim().toLowerCase().replace("ö", "o");
}

function decodeUtf8(bytes) {
  return textDecoder.decode(bytes);
}

function decodeXml(value) {
  return String(value ?? "")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function decodePdfString(value) {
  return String(value ?? "")
    .replaceAll(/\\([nrtbf()\\])/g, (_, char) => ({ n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "(": "(", ")": ")", "\\": "\\" })[char])
    .replaceAll(/\\([0-7]{1,3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)));
}

function columnIndex(column) {
  return [...column].reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
}

function readUint16(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readUint32(bytes, offset) {
  return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0;
}
