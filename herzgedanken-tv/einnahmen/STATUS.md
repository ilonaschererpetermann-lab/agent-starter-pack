# Einnahmen-Agent – Status & Plan

Regeln: nur legal, ehrlich, im HerzGedanken-Ton. Der Agent gibt **nie** selbst Geld aus, eröffnet keine Konten,
veröffentlicht nichts ohne Freigabe von Ilona. Freigaben werden als Ja/Nein-Frage gestellt.

## Einnahmequellen

| # | Quelle | Status | Braucht von Ilona |
|---|---|---|---|
| 1 | Werbung für den **Demenz-Alltagsretter** im Live-Laufband (config/heute.json → `werbung`) | läuft (Text ohne Link) | Digistore24-Link zum Produkt |
| 2 | **HerzGedanken Streamer-Paket** (3D-Studios Morgen/Tag/Abend, Nachrichten-Banner, Auto-Einspieler, Stör-Overlay, Sound-Paket) für andere TikTok-Streamer, Verkauf über Digistore24 | Produkt wird gebaut | Produkt in Digistore24 anlegen (Texte liefert der Agent) |
| 3 | Bestehende Produkte (Kochbuch, Malbuch, Magazin) im Laufband rotieren | offen | Digistore24-Links |
| 5 | **Notfallmappe Demenz** (PDF, 8 Seiten, ausfüllbar), `einnahmen/produkte/notfallmappe/` | fertig, Texte liegen bereit | in Digistore24 anlegen (9,90 €) |
| 6 | **Bundle** Alltagsretter + Notfallmappe (Idee 2026-10-08, Aufwand gering, Nutzen hoch: höherer Warenkorb ohne neues Produkt) | Idee | Freigabe |
| 7 | **Arzt- & Begutachtungs-Begleiter Demenz** (PDF, 8 Seiten, 238 Felder), `einnahmen/produkte/arztbegleiter/` | fertig, Texte liegen bereit | in Digistore24 anlegen (9,90 €, Bundle mit Notfallmappe 14,90 €) |
| 8 | **Mein Lebensbuch** (Biografiebogen, PDF, 10 Seiten, 122 Felder + 12 Fotofelder), `einnahmen/produkte/lebensbuch/` | fertig, Texte liegen bereit | in Digistore24 anlegen (12,90 €; Paket „HerzGedanken Komplett“ mit Notfallmappe + Arzt-Begleiter 24,90 €) |
| 9 | **Advents-Kalender für pflegende Angehörige** (Idee 2026-10-10: 24 Mini-Impulse zur Selbstfürsorge als PDF, Verkauf Nov.–Dez.; Aufwand gering, Nutzen mittel–hoch durch Saison, auch als Geschenk und Laufband-Aktion im Live) | Idee, muss bis Mitte November fertig sein | Freigabe |
| 4 | Digistore24-Affiliate: passende Fremdprodukte für pflegende Angehörige empfehlen | Recherche | Freigabe je Produkt |

## Nächste Schritte (der Agent arbeitet sie der Reihe nach ab)

Priorität laut Absprache mit Ilona (2026-10-07):
A. Werbung für den Demenz-Alltagsretter im Laufband (sobald Link/Produkt-ID per API gelesen werden kann)
B. Neue Produkte für Angehörige/Betroffene (Vorlagen, Checklisten als PDF)
C. Streamer-Paket nur als White-Label-Version (eigener Name/Logo per Parameter)


1. Streamer-Paket zusammenstellen (`einnahmen/streamer-paket/`): Inhaltsliste, Anleitung für Käufer, Vorschaubilder.
2. Verkaufstexte für Digistore24: Titel, Kurzbeschreibung, Langbeschreibung, Preisvorschlag, Bilder.
3. Verkaufsseite (HTML) für das Streamer-Paket auf GitHub Pages.
4. Laufband-Werbung für jedes Produkt mit Link einbauen, sobald Links vorliegen.
5. Wöchentlich: was hat funktioniert, was nicht, nächste Idee.

## Generalfreigabe

2026-10-07: Ilona erteilt Generalfreigabe für legale neue Produkte in Digistore24; sie möchte nur am Monatsende den Erfolg sehen (Routine „Monatsbericht“).

## Technische Voraussetzungen (einmalig, von Ilona)

- [x] Netzwerk: `www.digistore24.com` freigegeben (Test 2026-10-07: Server antwortet)
- [ ] Neuer Digistore24-API-Schlüssel (alter war auf Screenshot sichtbar → löschen) als Netzwerk-Secret: Host www.digistore24.com, Header `X-DS-API-KEY`, kein Präfix. Test 2026-10-07: „No API key given“

## Offene Freigaben

- [ ] Digistore24-Link „Demenz-Alltagsretter“
- [ ] Streamer-Paket verkaufen? (Ja/Nein)
- [ ] Notfallmappe Demenz für 9,90 € in Digistore24 anlegen? (Ja/Nein) – Texte: einnahmen/produkte/notfallmappe/DIGISTORE24-TEXTE.md
- [ ] Arzt-Begleiter Demenz 9,90 € + Bundle mit Notfallmappe 14,90 € anlegen? (Ja/Nein) – Texte: einnahmen/produkte/arztbegleiter/DIGISTORE24-TEXTE.md
- [ ] Lebensbuch 12,90 € + Paket „HerzGedanken Komplett“ 24,90 € anlegen? (Ja/Nein) – Texte: einnahmen/produkte/lebensbuch/DIGISTORE24-TEXTE.md

## Protokoll

- 2026-10-07: Plan angelegt. Generalfreigabe erteilt. Monatsbericht-Routine eingerichtet. Warte auf Netzwerk-Freigabe und API-Schlüssel.
- 2026-10-07 abends: Netzwerk ok, API-Schlüssel kommt noch nicht an. Ilona erledigt das morgen.
- 2026-10-08: API-Schlüssel weiterhin nicht hinterlegt („No API key given“). Produkt „Notfallmappe Demenz“ gebaut (8 Seiten, 256 Felder, geprüft), Digistore24-Texte + Preisvorschlag 9,90 € + Vorschaubilder erstellt. Neue Idee: Bundle Alltagsretter + Notfallmappe.
- 2026-10-09: API-Schlüssel weiterhin nicht hinterlegt („No API key given“). Priorität B: Produkt „Arzt- & Begutachtungs-Begleiter Demenz“ gebaut (8 Seiten, 238 Felder, Layout geprüft), Texte + Preis 9,90 € + Bundle-Preis 14,90 € + Vorschaubilder. Neue Idee: Lebensbuch/Biografiebogen (Weihnachtsgeschenk). Hinweis: Ohne API-Schlüssel muss Ilona die Produkte selbst in Digistore24 anlegen (Texte zum Kopieren liegen bereit) – oder den Schlüssel hinterlegen, dann übernimmt der Agent.
- 2026-10-10: API-Schlüssel weiterhin nicht hinterlegt. Priorität B: Produkt „Mein Lebensbuch“ (Idee vom 09.10.) gebaut: 10 Seiten, 122 Felder, 12 Fotofelder, Layout geprüft; Texte, Preis 12,90 €, Paket „HerzGedanken Komplett“ 24,90 €, Vorschaubilder. Neue Idee: Advents-Kalender für pflegende Angehörige (Saison). Damit liegen 3 fertige Produkte zum Anlegen bereit. Keine neue Push-Frage (Frage zum API-Schlüssel vom 09.10. ist noch offen).
