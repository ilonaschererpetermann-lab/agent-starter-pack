"""Erzeugt die ausfüllbare PDF „Mein Lebensbuch“ (Biografiebogen, HerzGedanken MediaGroup).

Aufruf: python3 erzeuge_lebensbuch.py <ausgabe.pdf>
Nutzt das Layout der Notfallmappe (gleicher Stil, passt ins Paket).
"""
import os
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'notfallmappe'))
import erzeuge_notfallmappe as nm  # noqa: E402
from erzeuge_notfallmappe import GOLD, BEIGE, GRAU, LINIE, PETROL, NACHT, H, M, W, white  # noqa: E402


class Lebensbuch(nm.Mappe):
    def __init__(self, pfad):
        super().__init__(pfad)
        self.c.setTitle('Mein Lebensbuch – HerzGedanken')

    def fuss(self):
        c = self.c
        c.setStrokeColor(LINIE); c.setLineWidth(.6); c.line(M, 40, W - M, 40)
        c.setFillColor(GRAU); c.setFont('Sans', 8)
        c.drawString(M, 28, 'Mein Lebensbuch · HerzGedanken MediaGroup · Ehrlich. Menschlich. Ohne Filter.')
        c.drawRightString(W - M, 28, f'Seite {self.seite}')

    def textbox(self, label, hoehe=56):
        # mehr Schreibplatz als in der Notfallmappe – hier wird erzählt
        super().textbox(label, round(hoehe * 1.45))

    def fotobox(self, x, y, w, h):
        c = self.c
        c.setStrokeColor(GOLD); c.setLineWidth(1.2); c.setDash(4, 3); c.rect(x, y, w, h); c.setDash()
        c.setFillColor(GRAU); c.setFont('Sans', 9)
        c.drawCentredString(x + w / 2, y + h / 2 - 3, 'Foto hier einkleben')

    def fotos(self, unterschriften):
        # zwei Fotos nebeneinander mit Bildunterschrift
        breite = (W - 2 * M - 24) / 2; hoehe = 150
        for i, u in enumerate(unterschriften):
            x = M + i * (breite + 24)
            self.fotobox(x, self.y - hoehe, breite, hoehe)
            self.feld(x, self.y - hoehe - 28, breite, 20, u)
        self.y -= hoehe + 48


def baue(pfad):
    m = Lebensbuch(pfad); c = m.c

    # 1 Deckblatt
    m.seite += 1
    c.setFillColor(PETROL); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GOLD); c.rect(0, H * .58, W, 3, fill=1, stroke=0)
    m.herz(W / 2, H * .78, 34, GOLD)
    c.setFillColor(GOLD); c.setFont('Serif', 40); c.drawCentredString(W / 2, H * .67, 'Mein Lebensbuch')
    c.setFillColor(BEIGE); c.setFont('Serif', 20); c.drawCentredString(W / 2, H * .625, 'Erinnerungen, die bleiben')
    c.setFillColor(white); c.setFont('Sans', 12)
    c.drawCentredString(W / 2, H * .54, 'Meine Geschichte – damit Familie, Freunde und Pflege')
    c.drawCentredString(W / 2, H * .515, 'wissen, wer ich bin und was mir wichtig ist')
    c.setFillColor(BEIGE); c.setFont('Sans', 11); c.drawString(M + 40, H * .42, 'Das ist das Leben von:')
    m.feld(M + 180, H * .42 - 6, W - 2 * M - 220, 22, 'Name')
    c.drawString(M + 40, H * .38, 'Aufgeschrieben mit:')
    m.feld(M + 180, H * .38 - 6, W - 2 * M - 220, 22, 'Aufgeschrieben mit')
    c.setFillColor(white); c.setFont('Sans', 9.5)
    for i, t in enumerate(['Tipp: Nehmt euch Zeit – eine Seite pro Nachmittag reicht. Fotos, Lieder und alte Briefe helfen beim Erinnern.',
                           'Es gibt kein Richtig oder Falsch. Lücken sind erlaubt. Am PC ausfüllbar oder ausdrucken und von Hand schreiben.']):
        c.drawCentredString(W / 2, H * .28 - i * 14, t)
    c.setFillColor(GOLD); c.setFont('SansB', 11); c.drawCentredString(W / 2, 80, 'HerzGedanken MediaGroup')
    c.setFillColor(BEIGE); c.setFont('Sans', 9); c.drawCentredString(W / 2, 64, 'Ehrlich. Menschlich. Ohne Filter.')

    # 2 Kindheit
    m.neue_seite('Meine Kindheit', 'Wo alles angefangen hat')
    m.zeilen2('Geboren am', 'in'); m.zeile('Meine Eltern hießen')
    m.zeile('Geschwister')
    m.textbox('So sah mein Zuhause aus (Haus, Zimmer, Garten, Nachbarschaft)', 52)
    m.textbox('Spiele, Freundinnen und Freunde, Streiche', 52)
    m.textbox('Schule: Lieblingsfach, Lehrerinnen und Lehrer, Schulweg', 52)
    m.textbox('Ein Geruch, ein Essen oder ein Lied, das mich an damals erinnert', 44)

    # 3 Familie & Liebe
    m.neue_seite('Familie und Liebe', 'Die Menschen, die mein Leben geprägt haben')
    m.textbox('Wie ich meine große Liebe kennengelernt habe', 60)
    m.zeilen2('Hochzeit am', 'in')
    m.abschnitt('Meine Kinder, Enkel und wichtigsten Menschen')
    m.tabelle(['Name', 'Beziehung', 'Geburtstag', 'Das verbindet uns'], [2.5, 2, 1.6, 3.9], 8, 24)
    m.textbox('Familienfeste und Traditionen (Weihnachten, Geburtstage, Urlaube)', 48)

    # 4 Arbeit
    m.neue_seite('Mein Arbeitsleben', 'Was ich gelernt und geschafft habe')
    m.zeile('Ausbildung / Studium'); m.zeile('Berufe und Arbeitsstellen')
    m.textbox('Ein typischer Arbeitstag (Uhrzeit, Weg, Kolleginnen und Kollegen)', 60)
    m.textbox('Darauf bin ich stolz', 52)
    m.textbox('Lustige oder besondere Geschichten von der Arbeit', 60)
    m.textbox('Ehrenamt, Verein, Engagement', 40)

    # 5 Lieblingssachen
    m.neue_seite('Das mag ich', 'Lieblingsdinge – Gold wert für gute Tage')
    for a, b in [('Lieblingsmusik', 'Lieblingslied'), ('Lieblingsessen', 'mag ich gar nicht'), ('Lieblingsgetränk', 'Lieblingsfarbe'),
                 ('Lieblingsfilm / Serie', 'Lieblingsbuch'), ('Lieblingstier', 'Lieblingsblume'), ('Lieblingsjahreszeit', 'Lieblingsort')]:
        m.zeilen2(a, b)
    m.textbox('Hobbys – früher und heute (Garten, Handarbeit, Sport, Basteln, Tanzen …)', 52)
    m.textbox('Darüber rede ich gern', 44)
    m.textbox('Darüber rede ich lieber nicht', 36)

    # 6 Orte & Reisen
    m.neue_seite('Orte und Reisen', 'Wo ich gelebt habe und wo ich gern war')
    m.tabelle(['Von – bis', 'Ort / Adresse', 'Mit wem', 'Erinnerung'], [1.4, 3, 2, 3.6], 7, 24)
    m.textbox('Meine schönste Reise', 60)
    m.textbox('Ein Ort, an dem ich mich immer wohlgefühlt habe', 48)

    # 7 + 8 Fotoseiten
    m.neue_seite('Meine Bilder', 'Fotos einkleben und kurz beschriften: Wer? Wann? Wo?')
    m.fotos(['Foto 1 – Beschriftung', 'Foto 2 – Beschriftung'])
    m.fotos(['Foto 3 – Beschriftung', 'Foto 4 – Beschriftung'])
    m.fotos(['Foto 5 – Beschriftung', 'Foto 6 – Beschriftung'])
    m.neue_seite('Noch mehr Bilder', 'Familie, Freunde, Haustiere, Urlaube')
    m.fotos(['Foto 7 – Beschriftung', 'Foto 8 – Beschriftung'])
    m.fotos(['Foto 9 – Beschriftung', 'Foto 10 – Beschriftung'])
    m.fotos(['Foto 11 – Beschriftung', 'Foto 12 – Beschriftung'])

    # 9 Was mir wichtig ist
    m.neue_seite('Was mir wichtig ist', 'Werte, Glaube, Wünsche')
    m.textbox('Was mir im Leben Halt gegeben hat (Glaube, Menschen, Überzeugungen)', 52)
    m.textbox('Meine Rituale (Morgenkaffee, Gebet, Spaziergang, Zeitung …)', 48)
    m.textbox('Was ich meiner Familie mitgeben möchte', 60)
    m.textbox('Wünsche für die Zukunft – auch kleine', 52)
    m.textbox('Das soll man über mich wissen', 52)

    # 10 Auf einen Blick
    m.neue_seite('Auf einen Blick', 'Kurzfassung für Pflegekräfte, Tagespflege, Klinik – Kopie mitgeben')
    m.zeile('So spricht man mich an (Name, Du/Sie)', 230)
    m.zeile('Mein Beruf war'); m.zeile('Wichtige Menschen')
    m.zeile('Meine Lieblingsmusik'); m.zeile('Darüber freue ich mich')
    m.zeile('Das beruhigt mich'); m.zeile('Das mag ich nicht')
    m.textbox('Mein Leben in fünf Sätzen', 80)
    m.hinweis('Dieses Lebensbuch ist eine Erinnerungshilfe und ersetzt keine ärztliche oder pflegerische Beratung.\n'
              'Persönliche Daten bitte nur an Menschen weitergeben, denen ihr vertraut.', 8.5)
    m.speichern()


if __name__ == '__main__':
    baue(sys.argv[1] if len(sys.argv) > 1 else 'Lebensbuch.pdf')
