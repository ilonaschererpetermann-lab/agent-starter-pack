"""Erzeugt die PDF „Advents-Kalender für pflegende Angehörige“ (HerzGedanken MediaGroup).

Aufruf: python3 erzeuge_adventskalender.py <ausgabe.pdf>
24 kleine Impulse zur Selbstfürsorge, je Tag ein Feld „Mein Moment heute“ (am PC ausfüllbar).
"""
import os
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'notfallmappe'))
import erzeuge_notfallmappe as nm  # noqa: E402
from erzeuge_notfallmappe import GOLD, BEIGE, GRAU, LINIE, PETROL, NACHT, FELD, H, M, W, white  # noqa: E402

# (Titel, Impuls) – bewusst klein, machbar, ohne Heilsversprechen
IMPULSE = [
    ('Eine Tasse nur für dich', 'Trink heute ein Heißgetränk im Sitzen. Ohne Handy, ohne Aufräumen nebenbei. Fünf Minuten gehören dir.'),
    ('Ein Lied von früher', 'Such dein Lieblingslied aus deiner Jugend heraus und hör es laut. Mitsingen ausdrücklich erlaubt.'),
    ('Einmal tief durchatmen', 'Vier Sekunden ein, vier halten, sechs aus. Dreimal hintereinander. Das geht auch im Wartezimmer.'),
    ('Ein Satz, der guttut', 'Schreib einen Satz auf, den du gern öfter hören würdest – und häng ihn an den Kühlschrank.'),
    ('Nein sagen üben', 'Sag heute zu einer Sache freundlich Nein, die du eigentlich nicht schaffst. Das ist kein Egoismus.'),
    ('Nikolaus für dich', 'Stell dir selbst etwas Kleines in den Schuh: Schokolade, eine Karte, ein Duft. Du hast es verdient.'),
    ('Raus an die Luft', 'Zehn Minuten Tageslicht – um den Block, auf den Balkon, ans Fenster. Allein oder gemeinsam.'),
    ('Hilfe annehmen', 'Denk an eine Person, die schon mal Hilfe angeboten hat. Überleg dir eine konkrete Kleinigkeit, um die du sie bitten kannst.'),
    ('Lachen erlaubt', 'Erinnere dich an die lustigste Panne der letzten Wochen. Humor heißt nicht, dass es nicht ernst ist.'),
    ('Ein Brief an dich', 'Schreib dir drei Zeilen, so wie du einer guten Freundin schreiben würdest, die gerade viel stemmt.'),
    ('Pause im Kalender', 'Trag dir für nächste Woche 30 Minuten nur für dich ein – mit Kuli, wie einen Arzttermin.'),
    ('Gemeinsam basteln', 'Ein Stern aus Papier, ein Tannenzweig, ein Plätzchen: Etwas mit den Händen tun verbindet – auch ohne viele Worte.'),
    ('Wasser trinken', 'Klingt banal: Stell dir heute eine volle Karaffe hin und trink sie leer. Wer pflegt, vergisst sich oft zuerst.'),
    ('Drei gute Dinge', 'Schreib abends drei Dinge auf, die heute gut waren. Auch winzige zählen: eine warme Hand, ein Lächeln.'),
    ('Austausch suchen', 'Schau nach einer Angehörigengruppe in deiner Nähe oder online. Dort versteht man dich ohne Erklärung.'),
    ('Lieblingsduft', 'Zimt, Orange, Tanne: Zünde eine Kerze an oder schäle eine Mandarine und atme bewusst ein.'),
    ('Fotos anschauen', 'Nehmt ein altes Fotoalbum zur Hand. Erzählen statt abfragen: „Weißt du noch?“ darf auch unbeantwortet bleiben.'),
    ('Früher ins Bett', 'Geh heute 30 Minuten früher schlafen. Der Abwasch wartet geduldig.'),
    ('Ein Kompliment', 'Mach dir selbst ein Kompliment für etwas, das du diese Woche geschafft hast. Laut aussprechen!'),
    ('Beratung nutzen', 'Notier dir die Nummer eines Pflegestützpunkts oder der Pflegeberatung deiner Kasse. Beratung kostet dich nichts.'),
    ('Musik zum Mitsummen', 'Weihnachtslieder kennt man oft noch, wenn anderes verschwimmt. Singt gemeinsam eine Strophe.'),
    ('Unperfekt feiern', 'Schreib auf, was dieses Jahr an Weihnachten einfach mal unperfekt sein darf. Erleichterung inklusive.'),
    ('Danke sagen', 'Schick einer Person, die dich unterstützt, eine kurze Nachricht: Danke, dass es dich gibt.'),
    ('Heiligabend', 'Du hast ein ganzes Jahr getragen, gehalten, ausgehalten. Heute darfst du stolz auf dich sein. Frohe Weihnachten!'),
]
assert len(IMPULSE) == 24


class Kalender(nm.Mappe):
    def __init__(self, pfad):
        super().__init__(pfad)
        self.c.setTitle('Advents-Kalender für pflegende Angehörige – HerzGedanken')

    def fuss(self):
        c = self.c
        c.setStrokeColor(LINIE); c.setLineWidth(.6); c.line(M, 40, W - M, 40)
        c.setFillColor(GRAU); c.setFont('Sans', 8)
        c.drawString(M, 28, 'Advents-Kalender für pflegende Angehörige · HerzGedanken MediaGroup · Ehrlich. Menschlich. Ohne Filter.')
        c.drawRightString(W - M, 28, f'Seite {self.seite}')

    def umbruch(self, text, font, size, breite):
        zeilen, akt = [], ''
        for wort in text.split():
            probe = (akt + ' ' + wort).strip()
            if self.c.stringWidth(probe, font, size) <= breite:
                akt = probe
            else:
                zeilen.append(akt); akt = wort
        return zeilen + [akt]

    def karte(self, x, y, w, h, nr, titel, text):
        c = self.c
        c.setFillColor(HexStern); c.setStrokeColor(GOLD); c.setLineWidth(1)
        c.roundRect(x, y, w, h, 10, fill=1, stroke=1)
        # Türchen-Nummer
        c.setFillColor(PETROL); c.circle(x + 30, y + h - 30, 20, fill=1, stroke=0)
        c.setFillColor(GOLD); c.setFont('Serif', 18); c.drawCentredString(x + 30, y + h - 36.5, str(nr))
        c.setFillColor(PETROL); c.setFont('SansB', 12.5); c.drawString(x + 60, y + h - 35, titel)
        c.setFillColor(NACHT); c.setFont('Sans', 12.5)
        ty = y + h - 72
        for z in self.umbruch(text, 'Sans', 12.5, w - 32):
            c.drawString(x + 16, ty, z); ty -= 18
        c.setFillColor(GRAU); c.setFont('Sans', 9.5); c.drawString(x + 16, y + 112, 'Mein Moment heute:')
        self.feld(x + 16, y + 16, w - 32, 88, f'Tag {nr} – Mein Moment heute', mehrzeilig=True)


from reportlab.lib.colors import HexColor  # noqa: E402
HexStern = HexColor('#FBF8EF')


def baue(pfad):
    k = Kalender(pfad); c = k.c

    # 1 Deckblatt
    k.seite += 1
    c.setFillColor(PETROL); c.rect(0, 0, W, H, fill=1, stroke=0)
    import random
    rnd = random.Random(24)
    c.setFillColor(BEIGE)
    for _ in range(70):  # Schneeflocken / Sterne
        c.circle(rnd.uniform(0, W), rnd.uniform(H * .3, H), rnd.uniform(.6, 2.2), fill=1, stroke=0)
    c.setFillColor(GOLD); c.rect(0, H * .58, W, 3, fill=1, stroke=0)
    k.herz(W / 2, H * .78, 34, GOLD)
    c.setFillColor(GOLD); c.setFont('Serif', 36); c.drawCentredString(W / 2, H * .67, 'Advents-Kalender')
    c.setFillColor(BEIGE); c.setFont('Serif', 20); c.drawCentredString(W / 2, H * .625, 'für pflegende Angehörige')
    c.setFillColor(white); c.setFont('Sans', 12)
    c.drawCentredString(W / 2, H * .54, '24 kleine Momente nur für dich –')
    c.drawCentredString(W / 2, H * .515, 'weil du jeden Tag so viel für andere gibst')
    c.setFillColor(BEIGE); c.setFont('Sans', 11); c.drawString(M + 40, H * .42, 'Dieser Kalender gehört:')
    k.feld(M + 190, H * .42 - 6, W - 2 * M - 230, 22, 'Name')
    c.setFillColor(white); c.setFont('Sans', 9.5)
    for i, t in enumerate(['So geht’s: Jeden Tag ein Türchen lesen, den Impuls ausprobieren – oder auch nicht.',
                           'Nichts muss, alles darf. Unter jedem Türchen ist Platz für deinen Moment des Tages.']):
        c.drawCentredString(W / 2, H * .30 - i * 14, t)
    c.setFillColor(GOLD); c.setFont('SansB', 11); c.drawCentredString(W / 2, 80, 'HerzGedanken MediaGroup')
    c.setFillColor(BEIGE); c.setFont('Sans', 9); c.drawCentredString(W / 2, 64, 'Ehrlich. Menschlich. Ohne Filter.')

    # 2 Übersicht: 24 Türchen zum Abhaken
    k.neue_seite('Deine 24 Türchen', 'Abhaken, was du geschafft hast – oder einfach nur gelesen')
    sp, zei = 4, 6; gap = 10
    bw = (W - 2 * M - (sp - 1) * gap) / sp; bh = 92
    for i, (titel, _) in enumerate(IMPULSE):
        x = M + (i % sp) * (bw + gap); y = k.y - 70 - (i // sp) * (bh + gap)
        c.setFillColor(HexStern); c.setStrokeColor(GOLD); c.setLineWidth(1); c.roundRect(x, y, bw, bh, 8, fill=1, stroke=1)
        c.setFillColor(PETROL); c.setFont('Serif', 26); c.drawString(x + 10, y + bh - 34, str(i + 1))
        c.setFillColor(NACHT); c.setFont('Sans', 8.5)
        ty = y + 30
        for z in k.umbruch(titel, 'Sans', 8.5, bw - 16)[:2]:
            c.drawString(x + 8, ty, z); ty -= 11
        c.acroForm.checkbox(name=nm.fname(), tooltip=f'Tag {i + 1} erledigt', x=x + bw - 24, y=y + bh - 26, size=14,
                            borderColor=LINIE, fillColor=FELD, buttonStyle='check', forceBorder=True)

    # 3–8 je 4 Türchen
    kw = (W - 2 * M - 16) / 2; kh = 300
    for s in range(6):
        k.neue_seite(f'Türchen {s * 4 + 1} bis {s * 4 + 4}', 'Ein Impuls pro Tag – klein, machbar, nur für dich')
        for j in range(4):
            nr = s * 4 + j + 1; titel, text = IMPULSE[nr - 1]
            x = M + (j % 2) * (kw + 16); y = H - 128 - kh - (j // 2) * (kh + 16)
            k.karte(x, y, kw, kh, nr, titel, text)

    # 9 Abschluss
    k.neue_seite('Mein Blick zurück', 'Für die Tage zwischen den Jahren')
    k.textbox('Welches Türchen hat mir am meisten gutgetan?', 80)
    k.textbox('Was nehme ich mir fürs neue Jahr mit – nur für mich?', 110)
    k.textbox('Wer oder was hat mich dieses Jahr getragen?', 110)
    k.hinweis('Wenn dir alles zu viel wird: Du musst das nicht allein schaffen. Pflegestützpunkte, die Pflegeberatung\n'
              'deiner Pflegekasse und Angehörigengruppen helfen. In seelischen Krisen ist die TelefonSeelsorge\n'
              'kostenlos und rund um die Uhr erreichbar: 0800 111 0 111 oder 0800 111 0 222.', 9.5)
    k.hinweis('Dieser Kalender ersetzt keine ärztliche, psychologische oder pflegerische Beratung.', 8.5)
    k.speichern()


if __name__ == '__main__':
    baue(sys.argv[1] if len(sys.argv) > 1 else 'Adventskalender.pdf')
