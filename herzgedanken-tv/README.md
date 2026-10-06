# HerzGedanken – 2D-TV-Hintergrund (1920×1080)

| Datei | Wofür |
|---|---|
| `hintergrund-clean.png` | Standbild ohne Einblendungen, z. B. als Hintergrund in OBS, Canva oder CapCut |
| `hintergrund-tv-overlay.png` | Standbild im Senderlook mit LIVE, Uhr, Senderlogo, Bauchbinde und Laufband |
| `hintergrund-loop.mp4` | 16 s animiert (Herzschlag, Sterne, Wasser, Lichter), läuft in Endlosschleife |
| `index.html` | Live-Version zum Einbinden in OBS als Browserquelle, mit Uhr und Laufband in Echtzeit |

## In OBS nutzen
Browserquelle mit 1920×1080 anlegen und als lokale Datei `index.html?capture=1` laden.

URL-Parameter:
- `clean=1` – nur der Hintergrund, ohne Einblendungen
- `name=...` und `role=...` – Text der Bauchbinde, z. B. `?capture=1&name=Gast:%20Maria&role=Pflegende%20Angehörige`
- `time=20:15` – feste Uhrzeit statt der aktuellen
