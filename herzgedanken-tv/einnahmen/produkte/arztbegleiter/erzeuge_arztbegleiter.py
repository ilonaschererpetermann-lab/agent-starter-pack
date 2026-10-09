"""Erzeugt die ausfüllbare PDF „Arzt- & Begutachtungs-Begleiter Demenz“ (HerzGedanken MediaGroup).

Aufruf: python3 erzeuge_arztbegleiter.py <ausgabe.pdf>
Nutzt das Layout der Notfallmappe (gleicher Stil, passt als Bundle zusammen).
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'notfallmappe'))
import erzeuge_notfallmappe as nm  # noqa: E402
from erzeuge_notfallmappe import GOLD, BEIGE, GRAU, LINIE, PETROL, H, M, W, white  # noqa: E402


class Begleiter(nm.Mappe):
    def __init__(self, pfad):
        super().__init__(pfad)
        self.c.setTitle('Arzt- & Begutachtungs-Begleiter Demenz – HerzGedanken')

    def fuss(self):
        c = self.c
        c.setStrokeColor(LINIE); c.setLineWidth(.6); c.line(M, 40, W - M, 40)
        c.setFillColor(GRAU); c.setFont('Sans', 8)
        c.drawString(M, 28, 'Arzt- & Begutachtungs-Begleiter Demenz · HerzGedanken MediaGroup · Ehrlich. Menschlich. Ohne Filter.')
        c.drawRightString(W - M, 28, f'Seite {self.seite}')


def baue(pfad):
    m = Begleiter(pfad); c = m.c

    # 1 Deckblatt
    m.seite += 1
    c.setFillColor(PETROL); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GOLD); c.rect(0, H * .58, W, 3, fill=1, stroke=0)
    m.herz(W / 2, H * .78, 34, GOLD)
    c.setFillColor(GOLD); c.setFont('Serif', 34); c.drawCentredString(W / 2, H * .67, 'Arzt- & Begutachtungs-')
    c.setFillColor(BEIGE); c.setFont('Serif', 26); c.drawCentredString(W / 2, H * .625, 'Begleiter Demenz')
    c.setFillColor(white); c.setFont('Sans', 12)
    c.drawCentredString(W / 2, H * .54, 'Gut vorbereitet zum Arzt und zur Pflegegrad-Begutachtung –')
    c.drawCentredString(W / 2, H * .515, 'damit nichts Wichtiges vergessen wird')
    c.setFillColor(BEIGE); c.setFont('Sans', 11); c.drawString(M + 40, H * .42, 'Begleiter für:')
    m.feld(M + 160, H * .42 - 6, W - 2 * M - 200, 22, 'Name')
    c.drawString(M + 40, H * .38, 'Begonnen am:')
    m.feld(M + 160, H * .38 - 6, 140, 22, 'Begonnen am')
    c.setFillColor(white); c.setFont('Sans', 9.5)
    for i, t in enumerate(['Im Termin ist man aufgeregt, und vieles fällt einem erst danach wieder ein. Dieser Begleiter hilft:',
                           'vorher beobachten und aufschreiben, im Termin die Fragen abhaken, danach die Ergebnisse festhalten.',
                           'Alle Felder lassen sich am PC ausfüllen oder nach dem Ausdrucken mit der Hand.']):
        c.drawCentredString(W / 2, H * .28 - i * 14, t)
    c.setFillColor(GOLD); c.setFont('SansB', 11); c.drawCentredString(W / 2, 80, 'HerzGedanken MediaGroup')
    c.setFillColor(BEIGE); c.setFont('Sans', 9); c.drawCentredString(W / 2, 64, 'Ehrlich. Menschlich. Ohne Filter.')

    # 2 Vor dem Termin
    m.neue_seite('Vor dem Termin', 'Checkliste zum Abhaken – am Vortag in Ruhe durchgehen')
    m.zeilen2('Termin am', 'Uhrzeit'); m.zeilen2('Praxis / Ärztin, Arzt', 'Telefon')
    m.abschnitt('Mitnehmen')
    for d in ['Versichertenkarte', 'Aktueller Medikationsplan', 'Alle Medikamente (Tüte)', 'Überweisung',
              'Befunde / Arztbriefe', 'Beobachtungstagebuch (Seite 3)', 'Brille / Hörgerät', 'Getränk und Snack']:
        m.haken(d, mit_ort=False)
    m.y -= 6
    m.abschnitt('Begleitung')
    m.zeilen2('Wer begleitet?', 'Telefon')
    m.textbox('Was mir die Situation leichter macht (z. B. früher Termin, ruhiges Wartezimmer, Pausen)', 40)

    # 3 Beobachtungstagebuch
    m.neue_seite('Beobachtungstagebuch', '14 Tage vor dem Termin kurz notieren – Stichworte reichen')
    m.tabelle(['Datum', 'Schlaf', 'Essen/Trinken', 'Stimmung', 'Orientierung', 'Besonderes'],
              [1.2, 1.5, 1.7, 1.6, 1.7, 3], 14, 30)
    m.hinweis('Tipp: Gute Tage genauso notieren wie schwierige. Ärztinnen und Ärzte sehen nur einen kurzen Moment –\n'
              'das Tagebuch zeigt ihnen den Alltag.')

    # 4 Was hat sich verändert
    m.neue_seite('Was hat sich verändert?', 'Seit dem letzten Termin – für das Gespräch')
    m.textbox('Gedächtnis und Orientierung (Termine, Namen, Wege, Uhrzeit)', 48)
    m.textbox('Stimmung und Verhalten (Unruhe, Rückzug, Ängste, Reizbarkeit, Antrieb)', 48)
    m.textbox('Schlaf, Essen, Trinken, Gewicht', 40)
    m.textbox('Körper: Stürze, Schmerzen, Gehen, Toilette, Sehen, Hören', 48)
    m.textbox('Nebenwirkungen, die mir bei Medikamenten aufgefallen sind', 40)
    m.textbox('Was gut läuft und mir Kraft gibt', 36)

    # 5 Meine Fragen
    m.neue_seite('Meine Fragen', 'Die wichtigste Frage zuerst – im Termin abhaken')
    for i in range(1, 9):
        c.acroForm.checkbox(name=nm.fname(), tooltip=f'Frage {i} beantwortet', x=M, y=m.y + 4, size=14,
                            borderColor=LINIE, fillColor=nm.FELD, buttonStyle='check', forceBorder=True)
        m.feld(M + 22, m.y - 8, W - 2 * M - 22, 32, f'Frage {i}', mehrzeilig=True)
        m.y -= 42
    m.abschnitt('Ideen für Fragen')
    m.hinweis('· Wie geht es voraussichtlich weiter, und worauf sollen wir achten?\n'
              '· Gibt es Therapien ohne Medikamente (z. B. Ergotherapie, Logopädie, Bewegung)?\n'
              '· Welche Nebenwirkungen sind wichtig, und wann sollen wir anrufen?\n'
              '· Welche Hilfen stehen uns zu (Pflegegrad, Hilfsmittel, Beratung, Entlastung)?\n'
              '· Können Sie das Wichtigste bitte für uns aufschreiben?', 9.5)

    # 6 Nach dem Termin
    m.neue_seite('Nach dem Termin', 'Ergebnisse festhalten, solange alles frisch ist')
    m.textbox('Das Wichtigste in eigenen Worten', 60)
    m.abschnitt('Änderungen bei den Medikamenten')
    m.tabelle(['Medikament', 'neu / geändert / abgesetzt', 'Dosis', 'ab wann'], [3, 2.5, 1.5, 1.5], 5, 24)
    m.abschnitt('Nächste Schritte')
    m.tabelle(['Was', 'Wer kümmert sich', 'bis wann'], [5, 2.5, 1.5], 4, 24)
    m.zeilen2('Nächster Termin', 'Rezept/Überweisung geholt')

    # 7 Pflegegrad-Begutachtung
    m.neue_seite('Pflegegrad-Begutachtung', 'Vorbereitung auf den Besuch der Gutachterin / des Gutachters')
    m.hinweis('Die Begutachtung schaut auf sechs Lebensbereiche. Notieren Sie konkrete Beispiele, wo Hilfe nötig ist –\n'
              'an schwierigen Tagen, nicht nur an guten. Diese Seite beim Termin bereitlegen.', 9.5)
    m.y -= 16
    for lab, h in [('1 Mobilität (Aufstehen, Treppen, Gehen in der Wohnung)', 38),
                   ('2 Verstehen und Sprechen (Erkennen von Personen, Orientierung, Entscheidungen)', 42),
                   ('3 Verhalten und Psyche (Unruhe, nächtliche Aktivität, Ängste, Abwehr bei Pflege)', 42),
                   ('4 Selbstversorgung (Waschen, Anziehen, Essen, Trinken, Toilette)', 42),
                   ('5 Umgang mit Krankheit und Therapie (Medikamente, Arztbesuche, Verbände)', 38),
                   ('6 Alltag und soziale Kontakte (Tagesablauf, Beschäftigung, Kontakt halten)', 38)]:
        m.textbox(lab, h)
    m.zeilen2('Begutachtung am', 'Wer ist dabei?')

    # 8 Notizen
    m.neue_seite('Termine im Überblick', 'Alle Arzt- und Therapietermine an einem Ort')
    m.tabelle(['Datum', 'Praxis / Therapie', 'Anlass', 'Ergebnis in Stichworten'], [1.3, 2.6, 2.2, 3.6], 18, 26)
    m.hinweis('Dieser Begleiter ersetzt keine ärztliche, pflegerische oder rechtliche Beratung. Kostenlose Hilfe bei der\n'
              'Pflegegrad-Begutachtung bieten z. B. Pflegestützpunkte und die Pflegeberatung der Pflegekasse.', 8.5)
    m.speichern()


if __name__ == '__main__':
    baue(sys.argv[1] if len(sys.argv) > 1 else 'Arztbegleiter-Demenz.pdf')
