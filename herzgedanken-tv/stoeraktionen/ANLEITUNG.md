# Stör-Aktionen für TikTok LIVE (HerzGedanken)

## Der einfache Weg: Stör-Overlay (keine Einrichtung in TikFinity nötig)

Das Overlay liest Geschenke, Likes und Kommentare direkt aus der laufenden TikFinity-App (WebSocket `ws://localhost:21213`)
und spielt alle Aktionen selbst ab: Einblendung mit Namen, Sounds, „Wie bitte?!“, Konfetti, Herzen.

TikTok LIVE Studio → Quelle hinzufügen → **Link**, 1080 × 1920, **Sound einschalten** + **Immer aktiv halten**:
https://ilonaschererpetermann-lab.github.io/agent-starter-pack/herzgedanken-tv/stoeraktionen/overlay.html

- Probe: `overlay.html?test=1` spielt alle Aktionen nacheinander ab
- Verbindung prüfen: `overlay.html?debug=1` zeigt unten links „✅ Mit TikFinity verbunden“ oder „⏳ Warte auf TikFinity“
- Lautstärke: `?laut=0.4`, Likes pro Herzschlag: `?likes=500`
- Kommentare werden nur vorgelesen, wenn sie mit „!“ beginnen

Falls „Warte auf TikFinity“ stehen bleibt: TikFinity muss geöffnet und mit dem LIVE verbunden sein;
in TikFinity ggf. die WebSocket-/API-Schnittstelle einschalten.

## Der Weg über TikFinity-Aktionen (Alternative)

Fertig vorbereitet:
- **Aktions-Banner** „STÖR MICH!“ zeigt den Zuschauern, welches Geschenk was auslöst:
  https://ilonaschererpetermann-lab.github.io/agent-starter-pack/herzgedanken-tv/stoeraktionen/aktionen.html
- **Sound-Paket** im Ordner `sounds/`: `hupe.mp3`, `applaus.mp3`, `fanfare.mp3`, `konfetti.mp3`, `herzschlag.mp3`, `gong.mp3`

## Die Aktionen

| Geschenk / Auslöser | Aktion in TikFinity |
|---|---|
| 🌹 Rose | Text vorlesen: „Wie bitte?! Wo war ich nochmal?“ |
| 🫰 Fingerherz | Sound `hupe.mp3` |
| 🍩 Donut | Sound `applaus.mp3` |
| 💬 Kommentar mit „!“ | Text-to-Speech liest den Kommentar vor |
| 🌌 Galaxie | Sound `fanfare.mp3` (plus Konfetti-Bild im Overlay) |
| ❤️ je 1000 Likes | Sound `herzschlag.mp3` |

Die kostenlose TikFinity-Version erlaubt 5 Sound-Aktionen. Das reicht für diese Liste.

## Einrichten (einmalig, ca. 15 Minuten)

Die Menünamen können sich je nach TikFinity-Version etwas unterscheiden.

1. **tikfinity.zerody.one** öffnen und mit deinem TikTok-Konto anmelden.
2. **Sounds hochladen:** Menü „Actions & Events“ → **„Create new Action“** (Neue Aktion).
   - Name z. B. „Hupe“, Haken bei **„Play Sound“**, Datei `hupe.mp3` hochladen, Lautstärke etwa 50 %.
   - Für Applaus, Fanfare und Herzschlag genauso.
   - Für die Rose: Aktion „Wie bitte“ mit Haken bei **„Read text“ / Text-to-Speech**, Text: „Wie bitte?! Wo war ich nochmal?“
3. **Auslöser verknüpfen:** unten bei „Events“ → **„Create new Event“**.
   - Auslöser „Gift“ → Geschenk „Rose“ → Aktion „Wie bitte“
   - „Gift“ → „Finger Heart“ → „Hupe“, „Gift“ → „Doughnut“ → „Applaus“, „Gift“ → „Galaxy“ → „Fanfare“
   - Auslöser „Likes“ → 1000 → „Herzschlag“
4. **Kommentare vorlesen:** Menü **„Text-to-Speech“** einschalten. Wenn es die Einstellung für einen Befehl gibt, „!“ eintragen (dann werden nur Kommentare vorgelesen, die mit ! beginnen). Gibt es sie nicht, ändere die Zeile im Banner oder lass TTS aus.
5. **Overlay in TikTok LIVE Studio:** In TikFinity bei „Actions & Events“ die **Overlay-URL** (Screen 1) kopieren → TikTok LIVE Studio → Quelle hinzufügen → **Link** → einfügen, 1080 × 1920, **Sound einschalten** und **Immer aktiv halten** an.
6. **Aktions-Banner** genauso als Link-Quelle hinzufügen (Link oben).
7. Testen: In TikFinity gibt es bei jeder Aktion einen **„Test“-Knopf**.

## Reihenfolge der Ebenen in TikTok LIVE Studio (oben → unten)

1. Auto-Einspieler
2. TikFinity-Overlay
3. Aktions-Banner „STÖR MICH!“
4. Nachrichten-Banner
5. Kamera
6. Studio-Video

## Eigene Aktionen im Banner

Link mit `?aktionen=Emoji~Geschenk~Wirkung|…`, z. B.
`aktionen.html?aktionen=🌹~Rose~Wie bitte?!|🍩~Donut~Applaus`
Position: `?seite=rechts`, `?y=300`
