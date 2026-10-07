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

## 3D-Nachrichtenstudio (Ordner `3d/`)

Ein virtuelles Studio im Stil der Abendnachrichten: gebogene LED-Videowand mit dem HerzGedanken-Motiv, spiegelnder Boden, Moderationstisch mit Logo, Lichtsäulen, Monitore und Scheinwerfer.

| Datei | Wofür |
|---|---|
| `3d/studio-3d-clean.png` | Standbild des Studios ohne Einblendungen |
| `3d/studio-3d-tv-overlay.png` | Standbild mit LIVE, Uhr, Senderlogo, Bauchbinde und Laufband |
| `3d/studio-3d-loop.mp4` | 16 s mit langsamer Kamerafahrt; die Videowand läuft mit, Endlosschleife |
| `3d/studio.html` | Live-Version für OBS (Browserquelle, 1920×1080) |

Parameter wie oben (`clean`, `capture`, `name`, `role`, `time`), dazu `still=1` für eine feste Kamera.
Als lokale Datei zeigt die Videowand ein Standbild, weil Browser bei `file://` keine Videotexturen erlauben.
Für das laufende Wandvideo den Ordner `3d/` über einen kleinen Webserver öffnen (z. B. `npx http-server 3d`).

Quellcode: `3d/src/studio.js` (Three.js). Neu bauen mit
`npx esbuild 3d/src/studio.js --bundle --minify --format=iife --outfile=3d/studio.bundle.js` (benötigt `three@0.160.0`).

## Einspieler „Achtung – neue News“ (Ordner `einspieler/`)

- `einspieler/einspieler-achtung-neue-news.mp4`: 8 Sekunden mit Ton (Whoosh, Bass-Schlag, Nachrichten-Gong), im 3D-Studio
- `einspieler/einspieler.html`: dieselbe Animation als Browserquelle für OBS mit durchsichtigem Hintergrund.
  Die Schlagzeile lässt sich ändern: `einspieler.html?headline=Deine%20Schlagzeile&sub=Unterzeile`

## Fertige Sendung

`HerzGedanken-Sendung.mp4` (40 s, mit Ton): Einspieler „Achtung – neue News“ → Einspieler „Heute gehört“ →
16 s Studio mit Einblendungen (hier kommt die Moderation hin) → Abspann (`einspieler/abspann.mp4`, Vorlage `einspieler/abspann.html`).

## Hochformat für TikTok LIVE Studio (1080×1920)

- `3d/studio-3d-hochformat-abend.png`: Standbild. Das Logo sitzt oben unter der TikTok-Kopfzeile, der Tisch auf Brusthöhe, unten ist Platz für den Chat
- `3d/studio-3d-hochformat-abend-loop.mp4`: 16 s mit leichter Kamerabewegung, Endlosschleife
- `3d/studio-hochformat.html`: Live-Version (Browserquelle)

In TikTok LIVE Studio: **Quelle hinzufügen → Bild** (PNG) oder **Video** (MP4, Wiedergabe in Schleife). Die Quelle auf ganze Größe ziehen
und unter die Kamera legen. Die Kamera mit Hintergrund-Entfernung so skalieren, dass der Kopf unter dem Logo und der Oberkörper hinter dem Tisch sitzt.

## Morgen- und Abend-Version (Hochformat)

- Morgen: `3d/studio-3d-hochformat-morgen.png` / `3d/studio-3d-hochformat-morgen-loop.mp4`. Sonnenaufgang, helleres Licht, Säule „Guten Morgen“
- Abend: `3d/studio-3d-hochformat-abend.png` / `3d/studio-3d-hochformat-abend-loop.mp4`
- Tag: `3d/studio-3d-hochformat-tag.png` / `3d/studio-3d-hochformat-tag-loop.mp4`. Blauer Himmel mit Sonne und Wolken, Säule „Schönen Tag“
- Live: `3d/studio-hochformat.html?zeit=morgen` oder `?zeit=tag`, ohne Parameter für den Abend

## Nachrichten-Laufband (`laufband/laufband.html`)

Banner im Stil großer Nachrichtensender mit durchsichtigem Hintergrund, als Browser- bzw. Link-Quelle **über** Studio und Kamera legen (1080×1920).
- Oben: HerzGedanken, wechselnde Infos (Begrüßung je nach Uhrzeit, Wetter, DAX), Uhrzeit und Datum
- Unten: Laufschrift mit aktuellen Schlagzeilen (tagesschau.de), sonst eigene Texte

Parameter:
- `ort=Mannheim|Stuttgart`: Städte fürs Wetter, wechseln sich ab (Open-Meteo, frei)
- `eigene=Text1|Text2`: eigene Meldungen vorne in der Laufschrift, `news=…`: nur eigene Meldungen
- `dax=19234,5&daxplus=0,4`: DAX von Hand, falls der Live-Abruf blockiert ist
- `y=1010`: Höhe des Banners in Pixeln, `quer=1`: Querformat 1920×1080

Vorschau: `laufband/vorschau-morgen-mit-laufband.png`, `laufband/vorschau-tag-mit-laufband.png`, `laufband/vorschau-abend-mit-laufband.png`. Farben: Rot/Weiß

## Automatischer Einspieler (`einspieler/auto.html`)

Durchsichtige Link-/Browser-Quelle (1080×1920). Unsichtbar, bis sie von selbst startet: zur vollen Stunde
(oder `?alle=30` für alle 30 Minuten) spielt „ACHTUNG – NEUE NEWS“ mit Uhrzeit, aktueller Schlagzeile und Ton (8 s).
Parameter: `eigene=A|B` (eigene Schlagzeilen zuerst), `news=A|B` (nur eigene), `ton=0`, `test=1` (jede Minute, zum Ausprobieren), `quer=1`.
Link: https://ilonaschererpetermann-lab.github.io/agent-starter-pack/herzgedanken-tv/einspieler/auto.html
