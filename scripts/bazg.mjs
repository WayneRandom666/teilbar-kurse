// Holt die Tageskurse des BAZG (Bundesamt für Zoll und Grenzsicherheit) und schreibt sie als
// kurse.json und kurse.mjs (ES-Modul, damit die Teilbar-App sie über jsDelivr laden kann).
// Kurse: Franken für 1 Einheit der Währung («100 JPY = 0.55» wird zu jpy: 0.0055).
// Ohne Abhängigkeiten, Node 20+.
import { writeFile, readFile } from "node:fs/promises";

const URL = "https://www.backend-rates.bazg.admin.ch/api/xmldaily?locale=de";

export function parse(xml) {
  const datum = xml.match(/<datum>\s*(\d{2})\.(\d{2})\.(\d{4})\s*<\/datum>/);
  if (!datum) throw new Error("Kein Datum im BAZG-XML");
  const date = `${datum[3]}-${datum[2]}-${datum[1]}`;
  const chf = { chf: 1 };
  for (const m of xml.matchAll(/<devise\s+code="([a-z]{3})"\s*>([\s\S]*?)<\/devise>/g)) {
    const code = m[1], body = m[2];
    const unit = body.match(/<waehrung>\s*(\d+)\s+([A-Z]{3})\s*<\/waehrung>/);
    const kurs = body.match(/<kurs>\s*([\d.]+)\s*<\/kurs>/);
    if (!unit || !kurs || unit[2].toLowerCase() !== code) continue;
    const v = Number(kurs[1]) / Number(unit[1]);
    if (Number.isFinite(v) && v > 0) chf[code] = Number(v.toPrecision(8));
  }
  const n = Object.keys(chf).length - 1;
  if (n < 20 || !chf.eur || !chf.usd) throw new Error(`Zu wenige Kurse im BAZG-XML (${n})`);
  return { source: "BAZG", url: "https://www.bazg.admin.ch", date, chf };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await fetch(URL, { headers: { "user-agent": "teilbar-kurse (GitHub Actions)" } });
  if (!r.ok) throw new Error(`BAZG antwortet mit HTTP ${r.status}`);
  const data = parse(await r.text());
  const old = await readFile("kurse.json", "utf8").catch(() => "");
  const json = JSON.stringify(data, null, 1) + "\n";
  if (old === json) { console.log("Keine Änderung", data.date); process.exit(0); }
  await writeFile("kurse.json", json);
  await writeFile("kurse.mjs", `// Automatisch erzeugt aus den BAZG-Tageskursen. Nicht von Hand ändern.\nexport default ${JSON.stringify(data)};\n`);
  console.log("Aktualisiert", data.date, Object.keys(data.chf).length - 1, "Währungen");
}
