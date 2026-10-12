# Plan B: Produkte selbst in Digistore24 anlegen (ohne API-Schlüssel)

Für Ilona – ein Produkt pro Tag reicht. Reihenfolge nach Wichtigkeit.
Alle Texte liegen fertig zum Kopieren bereit; die Menünamen in Digistore24 können leicht anders heißen.

## So geht es (für jedes Produkt gleich)

1. In Digistore24 einloggen → **Produkte** → **Neues Produkt anlegen** → Produkttyp **Digitales Produkt / E-Book**.
2. **Produktname**, **Kurzbeschreibung** und **Langbeschreibung** aus der Text-Datei (Tabelle unten) kopieren.
3. **Preis** eintragen (Tabelle unten), Zahlungsart: Einmalzahlung.
4. **Produktbild**: Datei `vorschau-deckblatt.png` hochladen.
5. **Datei für Käufer**: die PDF aus dem gleichen Ordner hochladen (Digistore24 liefert sie nach dem Kauf aus).
6. Speichern. Digistore24 prüft neue Produkte; das kann ein paar Tage dauern.
7. Danach den **Bestell-Link** kopieren und mir in den Chat schreiben – ich baue ihn ins Laufband ein.

**Niemals** den API-Schlüssel in den Chat oder in einen Screenshot. Bestell-Links sind dagegen öffentlich und unbedenklich.

## Die Produkte

| Reihenfolge | Produkt | Preis | Ordner (Texte + PDF + Bild) | Warum jetzt |
|---|---|---|---|---|
| 1 | Advents-Kalender für pflegende Angehörige | 7,90 € | `produkte/adventskalender/` | Saison: muss bis Ende Oktober angelegt sein |
| 2 | Notfallmappe Demenz | 9,90 € | `produkte/notfallmappe/` | Einstiegsprodukt, passt zu jedem Live-Thema |
| 3 | Mein Lebensbuch | 12,90 € | `produkte/lebensbuch/` | Weihnachtsgeschenk |
| 4 | Arzt- & Begutachtungs-Begleiter Demenz | 9,90 € | `produkte/arztbegleiter/` | ergänzt die Notfallmappe |
| 5 | Paket „HerzGedanken Komplett“ (Nr. 2 + 3 + 4) | 24,90 € | Texte in `produkte/lebensbuch/DIGISTORE24-TEXTE.md` | höherer Warenkorb, erst wenn 2–4 freigeschaltet sind |

## Einfacher geht es mit dem API-Schlüssel

Wenn der neue Schlüssel als Netzwerk-Secret hinterlegt ist (Host `www.digistore24.com`, Header `X-DS-API-KEY`),
lege ich alle Produkte selbst an und baue die Links automatisch ins Laufband ein. Dann ist Plan B überflüssig.
