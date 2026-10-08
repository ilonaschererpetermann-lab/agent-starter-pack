"""Erzeugt die ausfüllbare PDF „Notfallmappe Demenz“ (HerzGedanken MediaGroup).

Aufruf: python3 erzeuge_notfallmappe.py <ausgabe.pdf>
A4, druckfreundlich (helle Seiten), alle Felder am PC ausfüllbar und auch zum Ausdrucken geeignet.
"""
import sys

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

pdfmetrics.registerFont(TTFont('Sans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('SansB', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Serif', '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'))

PETROL, NACHT, GOLD = HexColor('#0F233D'), HexColor('#071322'), HexColor('#D4AF37')
BEIGE, GRAU, FELD, LINIE = HexColor('#F3E5AB'), HexColor('#4A5568'), HexColor('#F7F4EA'), HexColor('#C9B98A')
W, H = A4
M = 42  # Rand

feld_nr = 0


def fname():
    global feld_nr
    feld_nr += 1
    return f'f{feld_nr}'


class Mappe:
    def __init__(self, pfad):
        self.c = canvas.Canvas(pfad, pagesize=A4)
        self.c.setTitle('Notfallmappe Demenz – HerzGedanken')
        self.c.setAuthor('HerzGedanken MediaGroup')
        self.seite = 0

    # ---------- Grundgerüst ----------
    def neue_seite(self, titel, untertitel=''):
        if self.seite:
            self.c.showPage()
        self.seite += 1
        c = self.c
        c.setFillColor(PETROL); c.rect(0, H - 92, W, 92, fill=1, stroke=0)
        c.setFillColor(GOLD); c.rect(0, H - 96, W, 4, fill=1, stroke=0)
        c.setFillColor(GOLD); c.setFont('Serif', 22); c.drawString(M, H - 50, titel)
        if untertitel:
            c.setFillColor(BEIGE); c.setFont('Sans', 10.5); c.drawString(M, H - 72, untertitel)
        self.herz(W - M - 14, H - 46, 11, GOLD)
        self.fuss()
        self.y = H - 128

    def fuss(self):
        c = self.c
        c.setStrokeColor(LINIE); c.setLineWidth(.6); c.line(M, 40, W - M, 40)
        c.setFillColor(GRAU); c.setFont('Sans', 8)
        c.drawString(M, 28, 'Notfallmappe Demenz · HerzGedanken MediaGroup · Ehrlich. Menschlich. Ohne Filter.')
        c.drawRightString(W - M, 28, f'Seite {self.seite}')

    def herz(self, x, y, s, farbe):
        c = self.c; p = c.beginPath()
        p.moveTo(x, y - s * .9)
        p.curveTo(x - s * 1.4, y, x - s * 1.1, y + s * 1.1, x, y + s * .45)
        p.curveTo(x + s * 1.1, y + s * 1.1, x + s * 1.4, y, x, y - s * .9)
        c.setFillColor(farbe); c.drawPath(p, fill=1, stroke=0)

    def abschnitt(self, text):
        c = self.c
        self.y -= 6
        c.setFillColor(GOLD); c.rect(M, self.y - 3, 4, 16, fill=1, stroke=0)
        c.setFillColor(PETROL); c.setFont('SansB', 12.5); c.drawString(M + 12, self.y, text)
        self.y -= 22

    def hinweis(self, text, groesse=9):
        c = self.c; c.setFillColor(GRAU); c.setFont('Sans', groesse)
        for zeile in text.split('\n'):
            c.drawString(M, self.y, zeile); self.y -= groesse + 4
        self.y -= 2

    def feld(self, x, y, w, h, tooltip, mehrzeilig=False):
        self.c.acroForm.textfield(name=fname(), tooltip=tooltip, x=x, y=y, width=w, height=h,
                                  borderColor=LINIE, fillColor=FELD, textColor=NACHT, borderWidth=.8,
                                  fontName='Helvetica', fontSize=0 if mehrzeilig else 10,
                                  fieldFlags='multiline' if mehrzeilig else '', forceBorder=True)

    def zeile(self, label, breite_label=150, hoehe=20, mehrzeilig=False):
        c = self.c
        c.setFillColor(NACHT); c.setFont('Sans', 10)
        c.drawString(M, self.y + hoehe - 14, label)
        self.feld(M + breite_label, self.y, W - 2 * M - breite_label, hoehe, label, mehrzeilig)
        self.y -= hoehe + 8

    def zeilen2(self, l1, l2, hoehe=20):
        c = self.c; halb = (W - 2 * M - 12) / 2
        for i, lab in enumerate((l1, l2)):
            x = M + i * (halb + 12)
            c.setFillColor(NACHT); c.setFont('Sans', 10); c.drawString(x, self.y + hoehe - 14, lab)
            lw = c.stringWidth(lab, 'Sans', 10) + 8
            self.feld(x + lw, self.y, halb - lw, hoehe, lab)
        self.y -= hoehe + 8

    def textbox(self, label, hoehe=56):
        c = self.c
        # Beschriftung direkt über dem Feld; danach Platz wie nach einer normalen Zeile
        c.setFillColor(NACHT); c.setFont('Sans', 10); c.drawString(M, self.y + 8, label)
        self.y -= hoehe
        self.feld(M, self.y, W - 2 * M, hoehe, label, mehrzeilig=True)
        self.y -= 34

    def tabelle(self, spalten, breiten, reihen, hoehe=21):
        c = self.c; x0 = M; gesamt = W - 2 * M
        bs = [b * gesamt / sum(breiten) for b in breiten]
        c.setFillColor(PETROL); c.rect(x0, self.y - 4, gesamt, 20, fill=1, stroke=0)
        c.setFillColor(white); c.setFont('SansB', 9)
        x = x0
        for s, b in zip(spalten, bs):
            c.drawString(x + 5, self.y + 2, s); x += b
        self.y -= 4 + hoehe
        for _ in range(reihen):
            x = x0
            for s, b in zip(spalten, bs):
                self.feld(x + 1, self.y, b - 2, hoehe - 2, s); x += b
            self.y -= hoehe
        self.y -= 10

    def haken(self, label, mit_ort=True):
        c = self.c
        c.acroForm.checkbox(name=fname(), tooltip=label, x=M, y=self.y - 2, size=14, borderColor=LINIE,
                            fillColor=FELD, buttonStyle='check', forceBorder=True)
        c.setFillColor(NACHT); c.setFont('Sans', 10); c.drawString(M + 22, self.y + 1, label)
        if mit_ort:
            c.setFillColor(GRAU); c.setFont('Sans', 8.5); c.drawString(M + 250, self.y + 1, 'liegt bei / wo:')
            self.feld(M + 318, self.y - 3, W - 2 * M - 318, 18, label + ' – liegt bei / wo')
        self.y -= 26

    def fotobox(self, x, y, w, h):
        c = self.c
        c.setStrokeColor(GOLD); c.setLineWidth(1.2); c.setDash(4, 3); c.rect(x, y, w, h); c.setDash()
        c.setFillColor(GRAU); c.setFont('Sans', 9)
        c.drawCentredString(x + w / 2, y + h / 2 + 4, 'Aktuelles Foto')
        c.drawCentredString(x + w / 2, y + h / 2 - 9, 'hier einkleben')

    def speichern(self):
        self.c.save()


def baue(pfad):
    m = Mappe(pfad); c = m.c

    # 1 Deckblatt
    m.seite += 1
    c.setFillColor(PETROL); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GOLD); c.rect(0, H * .58, W, 3, fill=1, stroke=0)
    m.herz(W / 2, H * .78, 34, GOLD)
    c.setFillColor(GOLD); c.setFont('Serif', 38); c.drawCentredString(W / 2, H * .67, 'Notfallmappe')
    c.setFillColor(BEIGE); c.setFont('Serif', 26); c.drawCentredString(W / 2, H * .625, 'Demenz')
    c.setFillColor(white); c.setFont('Sans', 12)
    c.drawCentredString(W / 2, H * .54, 'Alles Wichtige auf einen Blick –')
    c.drawCentredString(W / 2, H * .515, 'für Notfall, Arzt, Krankenhaus und Vertretung')
    c.setFillColor(BEIGE); c.setFont('Sans', 11); c.drawString(M + 40, H * .42, 'Diese Mappe gehört:')
    m.feld(M + 160, H * .42 - 6, W - 2 * M - 200, 22, 'Name')
    c.drawString(M + 40, H * .38, 'Stand vom:')
    m.feld(M + 160, H * .38 - 6, 140, 22, 'Stand vom')
    c.setFillColor(white); c.setFont('Sans', 9.5)
    for i, t in enumerate(['Tipp: Ausgefüllt gut sichtbar aufbewahren, z. B. in einer Klarsichthülle am Kühlschrank,',
                           'und eine Kopie den wichtigsten Angehörigen geben. Alle Felder lassen sich am PC ausfüllen',
                           'oder nach dem Ausdrucken mit der Hand. Bitte alle 3 Monate aktualisieren.']):
        c.drawCentredString(W / 2, H * .28 - i * 14, t)
    c.setFillColor(GOLD); c.setFont('SansB', 11); c.drawCentredString(W / 2, 80, 'HerzGedanken MediaGroup')
    c.setFillColor(BEIGE); c.setFont('Sans', 9); c.drawCentredString(W / 2, 64, 'Ehrlich. Menschlich. Ohne Filter.')

    # 2 Person & Notfallkontakte
    m.neue_seite('Wer ich bin', 'Persönliche Daten und Menschen, die im Notfall angerufen werden')
    m.abschnitt('Persönliche Daten')
    m.zeile('Vor- und Nachname'); m.zeilen2('Geburtsdatum', 'Rufname')
    m.zeile('Adresse'); m.zeilen2('Telefon', 'Sprache(n)')
    m.zeilen2('Krankenkasse', 'Versichertennr.'); m.zeilen2('Pflegegrad', 'Blutgruppe')
    m.abschnitt('Im Notfall bitte anrufen')
    m.tabelle(['Name', 'Beziehung', 'Telefon', 'erreichbar wann'], [3, 2, 2.5, 2], 5, 24)
    m.hinweis('Notruf: 112 (Rettungsdienst/Feuerwehr) · 110 (Polizei) · 116 117 (ärztlicher Bereitschaftsdienst)', 9.5)

    # 3 Gesundheit
    m.neue_seite('Meine Gesundheit', 'Diagnosen, Allergien und behandelnde Ärztinnen und Ärzte')
    m.abschnitt('Diagnosen und Besonderheiten')
    m.textbox('Diagnosen (z. B. Art der Demenz, weitere Erkrankungen)', 52)
    m.textbox('Allergien und Unverträglichkeiten (Medikamente, Lebensmittel)', 40)
    m.zeilen2('Hörgerät (ja/nein)', 'Brille (wofür)'); m.zeilen2('Zahnprothese', 'Gehhilfe')
    m.abschnitt('Ärztinnen, Ärzte und Pflege')
    m.tabelle(['Fachrichtung', 'Name', 'Telefon', 'Adresse'], [2, 2.5, 2, 3.5], 5, 24)
    m.zeilen2('Pflegedienst', 'Telefon'); m.zeilen2('Apotheke', 'Telefon')

    # 4 Medikamente
    m.neue_seite('Meine Medikamente', 'Aktueller Plan – bei jeder Änderung neu eintragen')
    m.tabelle(['Medikament', 'Stärke', 'mo', 'mi', 'ab', 'na', 'wofür / Hinweis'], [3, 1.4, .7, .7, .7, .7, 3], 14, 26)
    m.hinweis('Auch Tropfen, Salben, Pflaster, Spritzen und Mittel ohne Rezept eintragen.\n'
              'Diese Liste ersetzt nicht den Medikationsplan der Ärztin oder des Arztes – bitte beides zusammen aufbewahren.')

    # 5 Ich-Bogen
    m.neue_seite('So geht es mir gut', 'Für alle, die mich begleiten: Was mir Sicherheit gibt')
    m.textbox('So spricht man mich am besten an (Name, Du/Sie, langsam, von vorne …)', 36)
    m.textbox('Mein Tagesablauf und meine Gewohnheiten (Aufstehen, Mahlzeiten, Ruhezeiten, Schlafen)', 60)
    m.textbox('Das esse und trinke ich gern / das mag ich gar nicht', 36)
    m.textbox('Das beruhigt mich (Musik, Gegenstände, Menschen, Orte, Berührung)', 36)
    m.textbox('Das macht mir Angst oder Stress', 36)
    m.textbox('Meine Geschichte in drei Sätzen (Beruf, Familie, Hobbys – gut für Gespräche)', 70)

    # 6 Vermisstenbogen
    m.neue_seite('Wenn ich nicht nach Hause finde', 'Angaben für die Suche – im Ernstfall sofort 110 anrufen')
    m.fotobox(W - M - 130, m.y - 150, 130, 160)
    breit = W - 2 * M - 150
    for lab in ['Größe', 'Statur', 'Haarfarbe', 'Augenfarbe', 'Besondere Merkmale']:
        c.setFillColor(NACHT); c.setFont('Sans', 10); c.drawString(M, m.y + 6, lab)
        m.feld(M + 120, m.y, breit - 120, 20, lab); m.y -= 28
    m.y -= 20
    m.textbox('Meine typische Kleidung, Schuhe, Tasche', 36)
    m.textbox('Orte, zu denen ich gehen könnte (frühere Wohnung, Arbeitsstelle, Kirche, Friedhof, Lieblingsplatz)', 52)
    m.zeilen2('Ortungsgerät / Notruf-Uhr', 'Handy-Nr.')
    m.zeile('Lieblingswege beim Spazieren', 170)
    m.hinweis('Wichtig: Nicht lange selbst suchen – nach kurzer Zeit die Polizei (110) verständigen und diese Seite mitgeben.\n'
              'Ein aktuelles Foto hilft der Suche sehr. Kopie dieser Seite auch Nachbarn oder dem Pflegedienst geben.')

    # 7 Dokumente
    m.neue_seite('Wichtige Dokumente', 'Was es gibt und wo es liegt')
    for d in ['Vorsorgevollmacht', 'Betreuungsverfügung', 'Patientenverfügung', 'Personalausweis',
              'Versichertenkarte', 'Schwerbehindertenausweis', 'Bescheid Pflegegrad', 'Medikationsplan',
              'Bankvollmacht', 'Testament / Erbvertrag', 'Organspendeausweis', 'Hausschlüssel (Ersatz)']:
        m.haken(d)
    m.abschnitt('Wer ist bevollmächtigt?')
    m.zeilen2('Name', 'Telefon')

    # 8 Termine & Notizen
    m.neue_seite('Termine und Notizen', 'Arzttermine, Veränderungen, Beobachtungen')
    m.tabelle(['Datum', 'Termin / Beobachtung', 'Ergebnis / nächster Schritt'], [1.3, 4, 4], 18, 26)
    m.hinweis('Diese Mappe ersetzt keine ärztliche, pflegerische oder rechtliche Beratung. Bei Vollmachten und Verfügungen\n'
              'unterstützen z. B. Pflegestützpunkte, Betreuungsvereine oder Notariate.', 8.5)
    m.speichern()


if __name__ == '__main__':
    baue(sys.argv[1] if len(sys.argv) > 1 else 'Notfallmappe-Demenz.pdf')
