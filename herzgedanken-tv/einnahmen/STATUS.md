# Einnahmen-Agent – Status & Plan

Regeln: nur legal, ehrlich, im HerzGedanken-Ton. Der Agent gibt **nie** selbst Geld aus, eröffnet keine Konten,
veröffentlicht nichts ohne Freigabe von Ilona. Freigaben werden als Ja/Nein-Frage gestellt.

## Einnahmequellen

| # | Quelle | Status | Braucht von Ilona |
|---|---|---|---|
| 1 | Werbung für den **Demenz-Alltagsretter** im Live-Laufband (config/heute.json → `werbung`) | läuft (Text ohne Link) | Digistore24-Link zum Produkt |
| 2 | **HerzGedanken Streamer-Paket** (3D-Studios Morgen/Tag/Abend, Nachrichten-Banner, Auto-Einspieler, Stör-Overlay, Sound-Paket) für andere TikTok-Streamer, Verkauf über Digistore24 | Produkt wird gebaut | Produkt in Digistore24 anlegen (Texte liefert der Agent) |
| 3 | Bestehende Produkte (Kochbuch, Malbuch, Magazin) im Laufband rotieren | offen | Digistore24-Links |
| 4 | Digistore24-Affiliate: passende Fremdprodukte für pflegende Angehörige empfehlen | Recherche | Freigabe je Produkt |

## Nächste Schritte (der Agent arbeitet sie der Reihe nach ab)

1. Streamer-Paket zusammenstellen (`einnahmen/streamer-paket/`): Inhaltsliste, Anleitung für Käufer, Vorschaubilder.
2. Verkaufstexte für Digistore24: Titel, Kurzbeschreibung, Langbeschreibung, Preisvorschlag, Bilder.
3. Verkaufsseite (HTML) für das Streamer-Paket auf GitHub Pages.
4. Laufband-Werbung für jedes Produkt mit Link einbauen, sobald Links vorliegen.
5. Wöchentlich: was hat funktioniert, was nicht, nächste Idee.

## Generalfreigabe

2026-10-07: Ilona erteilt Generalfreigabe für legale neue Produkte in Digistore24; sie möchte nur am Monatsende den Erfolg sehen (Routine „Monatsbericht“).

## Technische Voraussetzungen (einmalig, von Ilona)

- [ ] Netzwerk: `www.digistore24.com` in der Cloud-Umgebung unter „Allowed domains“ freigeben
- [ ] Digistore24-API-Schlüssel (Schreibzugriff) als Umgebungsvariable `DIGISTORE24_API_KEY` hinterlegen (nie in den Chat)

## Offene Freigaben

- [ ] Digistore24-Link „Demenz-Alltagsretter“
- [ ] Streamer-Paket verkaufen? (Ja/Nein)

## Protokoll

- 2026-10-07: Plan angelegt. Generalfreigabe erteilt. Monatsbericht-Routine eingerichtet. Warte auf Netzwerk-Freigabe und API-Schlüssel.
