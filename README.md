# Teilbar – Tageskurse

Dieses Repository holt jeden Werktag die offiziellen Tageskurse des
[BAZG](https://www.bazg.admin.ch) (Bundesamt für Zoll und Grenzsicherheit) und legt sie als
`kurse.json` und `kurse.mjs` ab. Die App Teilbar lädt `kurse.mjs` über jsDelivr.

- Kurse: Franken für 1 Einheit der Währung (z. B. `jpy: 0.0055` heisst 1 JPY = 0.0055 CHF)
- Aktualisierung: GitHub Actions, werktags am Morgen (`.github/workflows/kurse.yml`), von Hand über «Run workflow»
- Quelle: `https://www.backend-rates.bazg.admin.ch/api/xmldaily`
