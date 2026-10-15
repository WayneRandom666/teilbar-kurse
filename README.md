# Teilbar – Tageskurse

Dieses Repository holt jeden Werktag die offiziellen Tageskurse des
[BAZG](https://www.bazg.admin.ch) (Bundesamt für Zoll und Grenzsicherheit) und legt sie als
`kurse.json` und `kurse.mjs` ab. Zusätzlich erscheinen sie als npm-Paket [`teilbar-kurse`](https://www.npmjs.com/package/teilbar-kurse); die App Teilbar lädt
`https://cdn.jsdelivr.net/npm/teilbar-kurse@latest/kurse.mjs`.

- Kurse: Franken für 1 Einheit der Währung (z. B. `jpy: 0.0055` heisst 1 JPY = 0.0055 CHF)
- Aktualisierung: GitHub Actions, werktags am Morgen (`.github/workflows/kurse.yml`), von Hand über «Run workflow»
- Quelle: `https://www.backend-rates.bazg.admin.ch/api/xmldaily`
- Veröffentlichung auf npm: über Trusted Publishing (GitHub OIDC); für die allererste Version das Secret `NPM_TOKEN`
- Lizenz: MIT für die Skripte; die Kurse stammen vom BAZG
