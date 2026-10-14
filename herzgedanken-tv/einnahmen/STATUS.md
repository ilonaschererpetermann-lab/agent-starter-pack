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
| 9 | **Advents-Kalender für pflegende Angehörige** (PDF, 9 Seiten, 24 Impulse, ausfüllbar), `einnahmen/produkte/adventskalender/` | fertig, Texte liegen bereit | in Digistore24 anlegen (7,90 €, Verkauf ab ca. 1. November) |
| 10 | **Digistore24-Partnerprogramm für eigene Produkte** (Idee 2026-10-11: andere Pflege-/Demenz-Accounts, Pflegeberaterinnen und Blogs empfehlen Ilonas PDFs gegen Provision, z. B. 30 %; Digistore24 hat das eingebaut, kostet nichts, Provision nur bei Verkauf; Aufwand gering: Provision im Produkt einstellen + kurze Partner-Infoseite; Nutzen hoch: Reichweite außerhalb von TikTok) | Idee | Freigabe |
| 11 | **Hörfassung Advents-Kalender** (Idee 2026-10-12: Ilona liest die 24 Impulse ein, MP3-Paket 4,90 € oder im Bundle; Aufwand mittel – ca. 1 Std. Aufnahme, Schnitt macht der Agent; Nutzen mittel, persönliche Stimme) | Idee | Freigabe + Aufnahme |
| 12 | **Gratis-Notfallkarte fürs Portemonnaie** (Idee 2026-10-13: 1-seitige Karte zum Ausschneiden mit Name, Diagnose, Notfallkontakt; kostenlos im Live verschenken, verweist auf Notfallmappe + Shop; Aufwand gering, Nutzen: Vertrauen + Einstieg in den Verkauf; ob 0-€-Produkte in Digistore24 gehen, wird beim Anlegen geprüft) | Idee | Freigabe |
| 13 | **Vorträge / Online-Workshops** „Demenz von innen“ für Pflegeschulen, Pflegedienste, Selbsthilfegruppen (Idee 2026-10-14: Honorar pro Termin, Ilonas Erfahrung als Betroffene ist selten und gefragt; Aufwand mittel – Foliensatz + Anfrage-Text erstellt der Agent, Termine nur mit Ilonas Zusage; Nutzen hoch, unabhängig von TikTok und Digistore24) | Idee | Freigabe + Ilonas Kraft/Zeit |
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
5. Wöchentlich: was hat funktioniert, was nicht, nächste Idee (`WOCHE-JJJJ-KW.md`).

**Stand KW 42:** Bauen pausiert, Verkaufen hat Vorrang. Plan B ohne API: `SELBST-ANLEGEN.md`. Advents-Kalender zuerst (Frist Ende Oktober).
Spickzettel fürs ehrliche Verkaufen im Live: `LIVE-VERKAUF.md`.
Verkaufsseite-Entwurf: `verkaufsseite/index.html` (alle 4 Produkte + Paket, Knöpfe „Bald erhältlich“ bis Links da sind). **Vor Veröffentlichung nötig:** Kauf-Links, Impressum- und Datenschutz-Link (Pflicht in Deutschland), Ilonas Freigabe.

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
- [ ] Advents-Kalender 7,90 € anlegen, Verkauf ab 1. November? (Ja/Nein) – Texte: einnahmen/produkte/adventskalender/DIGISTORE24-TEXTE.md

## Protokoll

- 2026-10-07: Plan angelegt. Generalfreigabe erteilt. Monatsbericht-Routine eingerichtet. Warte auf Netzwerk-Freigabe und API-Schlüssel.
- 2026-10-07 abends: Netzwerk ok, API-Schlüssel kommt noch nicht an. Ilona erledigt das morgen.
- 2026-10-08: API-Schlüssel weiterhin nicht hinterlegt („No API key given“). Produkt „Notfallmappe Demenz“ gebaut (8 Seiten, 256 Felder, geprüft), Digistore24-Texte + Preisvorschlag 9,90 € + Vorschaubilder erstellt. Neue Idee: Bundle Alltagsretter + Notfallmappe.
- 2026-10-09: API-Schlüssel weiterhin nicht hinterlegt („No API key given“). Priorität B: Produkt „Arzt- & Begutachtungs-Begleiter Demenz“ gebaut (8 Seiten, 238 Felder, Layout geprüft), Texte + Preis 9,90 € + Bundle-Preis 14,90 € + Vorschaubilder. Neue Idee: Lebensbuch/Biografiebogen (Weihnachtsgeschenk). Hinweis: Ohne API-Schlüssel muss Ilona die Produkte selbst in Digistore24 anlegen (Texte zum Kopieren liegen bereit) – oder den Schlüssel hinterlegen, dann übernimmt der Agent.
- 2026-10-10: API-Schlüssel weiterhin nicht hinterlegt. Priorität B: Produkt „Mein Lebensbuch“ (Idee vom 09.10.) gebaut: 10 Seiten, 122 Felder, 12 Fotofelder, Layout geprüft; Texte, Preis 12,90 €, Paket „HerzGedanken Komplett“ 24,90 €, Vorschaubilder. Neue Idee: Advents-Kalender für pflegende Angehörige (Saison). Damit liegen 3 fertige Produkte zum Anlegen bereit. Keine neue Push-Frage (Frage zum API-Schlüssel vom 09.10. ist noch offen).
- 2026-10-11: API-Schlüssel weiterhin nicht hinterlegt. Produkt „Advents-Kalender für pflegende Angehörige“ (Idee vom 10.10., saisonal) gebaut: 9 Seiten, 24 Impulse, 52 Felder, Layout geprüft; Texte, Preis 7,90 €, Vorschaubilder. Neue Idee: Digistore24-Partnerprogramm für die eigenen PDFs. Jetzt 4 fertige Produkte bereit. Keine neue Push-Frage (Frage zum API-Schlüssel vom 09.10. weiter offen).
- 2026-10-12: API-Schlüssel weiterhin nicht hinterlegt. Wochenrückblick KW 41 geschrieben (Umsatz 0 €, 4 Produkte fertig, Engpass = Anlegen in Digistore24). Entscheidung: keine neuen Produkte bis zum ersten Verkauf. Plan B `SELBST-ANLEGEN.md` erstellt. Neue Idee: Hörfassung des Advents-Kalenders. Push-Frage: Plan B ja/nein.
- 2026-10-13: API-Schlüssel weiterhin nicht hinterlegt. Verkaufsseite als Entwurf gebaut (Desktop + Handy geprüft, nicht veröffentlicht). Neue Idee: Gratis-Notfallkarte als Einstieg. Keine Push-Frage (Frage vom 12.10. zu Plan B noch offen).
- 2026-10-14: API-Schlüssel weiterhin nicht hinterlegt. Spickzettel `LIVE-VERKAUF.md` erstellt (welches Produkt zu welchem Live-Thema, ehrliche Sätze, Werbekennzeichnung, No-Gos). Neue Idee: Vorträge/Workshops „Demenz von innen“. Keine Push-Frage (Frage vom 12.10. noch offen).
