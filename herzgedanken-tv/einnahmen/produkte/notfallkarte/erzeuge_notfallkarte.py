"""Erzeugt die kostenlose „Notfallkarte fürs Portemonnaie“ (HerzGedanken MediaGroup).

Aufruf: python3 erzeuge_notfallkarte.py <ausgabe.pdf>
Eine A4-Seite mit 2 Karten (Vorder- und Rückseite nebeneinander) im Scheckkartenformat 85,6 × 54 mm, am PC ausfüllbar.
"""
import os
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'notfallmappe'))
from erzeuge_notfallmappe import GOLD, BEIGE, GRAU, LINIE, PETROL, NACHT, FELD, W, H  # noqa: E402
from reportlab.lib.colors import white  # noqa: E402
from reportlab.lib.pagesizes import A4  # noqa: E402
from reportlab.lib.units import mm  # noqa: E402
from reportlab.pdfgen import canvas  # noqa: E402

KW, KH = 85.6 * mm, 54 * mm
n = 0


def feld(c, x, y, w, h, tip):
    global n
    n += 1
    c.acroForm.textfield(name=f'k{n}', tooltip=tip, x=x, y=y, width=w, height=h, borderColor=LINIE, fillColor=FELD,
                         textColor=NACHT, borderWidth=.5, fontName='Helvetica', fontSize=7, forceBorder=True)


def schnitt(c, x, y):
    c.setStrokeColor(GRAU); c.setLineWidth(.4); c.setDash(3, 2); c.rect(x, y, KW, KH); c.setDash()


def vorne(c, x, y):
    c.setFillColor(PETROL); c.roundRect(x, y, KW, KH, 8, fill=1, stroke=0)
    c.setFillColor(GOLD); c.setFont('SansB', 11); c.drawString(x + 8, y + KH - 16, 'Ich habe Demenz')
    c.setFillColor(BEIGE); c.setFont('Sans', 7.2)
    for i, t in enumerate(['Bitte haben Sie Geduld mit mir.', 'Sprechen Sie langsam und deutlich.',
                           'Wenn ich verwirrt wirke, rufen Sie bitte', 'meine Kontaktperson an (Rückseite).']):
        c.drawString(x + 8, y + KH - 30 - i * 9.5, t)
    c.setFillColor(white); c.setFont('Sans', 7); c.drawString(x + 8, y + 15, 'Name:')
    feld(c, x + 32, y + 10, KW - 40, 12, 'Name')
    c.setFillColor(GOLD); c.setFont('Sans', 5.5); c.drawRightString(x + KW - 8, y + 3.5, 'HerzGedanken · Ehrlich. Menschlich. Ohne Filter.')


def hinten(c, x, y):
    c.setFillColor(white); c.setStrokeColor(GOLD); c.setLineWidth(1); c.roundRect(x, y, KW, KH, 8, fill=1, stroke=1)
    c.setFillColor(PETROL); c.setFont('SansB', 8.5); c.drawString(x + 8, y + KH - 13, 'Im Notfall bitte anrufen')
    zeilen = [('Kontakt 1', 'Name / Telefon Kontaktperson 1'), ('Kontakt 2', 'Name / Telefon Kontaktperson 2'),
              ('Diagnose', 'Diagnose'), ('Medizin', 'Wichtige Medikamente / Allergien'), ('Adresse', 'Adresse')]
    for i, (lab, tip) in enumerate(zeilen):
        yy = y + KH - 32 - i * 16
        c.setFillColor(NACHT); c.setFont('Sans', 6.5); c.drawString(x + 8, yy + 3, lab)
        feld(c, x + 48, yy, KW - 56, 12, tip)
    c.setFillColor(GRAU); c.setFont('Sans', 5.5); c.drawString(x + 8, y + 4, 'Notruf 112 · Mehr Infos in meiner Notfallmappe')


def baue(pfad):
    c = canvas.Canvas(pfad, pagesize=A4)
    c.setTitle('Notfallkarte Demenz – HerzGedanken (kostenlos)')
    c.setAuthor('HerzGedanken MediaGroup')
    c.setFillColor(PETROL); c.setFont('Serif', 20); c.drawString(20 * mm, H - 25 * mm, 'Notfallkarte fürs Portemonnaie')
    c.setFillColor(GRAU); c.setFont('Sans', 9.5)
    for i, t in enumerate(['Am PC ausfüllen oder ausdrucken und mit der Hand schreiben. An der gestrichelten Linie ausschneiden,',
                           'Vorder- und Rückseite zusammenkleben (oder laminieren) und ins Portemonnaie stecken.',
                           'Zwei Karten pro Blatt: eine fürs Portemonnaie, eine für die Jackentasche.']):
        c.drawString(20 * mm, H - 34 * mm - i * 12, t)
    gx = (W - 2 * KW - 10 * mm) / 2
    for r, y in enumerate([H - 110 * mm, H - 180 * mm]):
        for k, fn in enumerate([vorne, hinten]):
            x = gx + k * (KW + 10 * mm)
            schnitt(c, x, y); fn(c, x, y)
        c.setFillColor(GRAU); c.setFont('Sans', 7.5)
        c.drawString(gx, y + KH + 4, f'Karte {r + 1}: Vorderseite'); c.drawString(gx + KW + 10 * mm, y + KH + 4, 'Rückseite')
    c.setFillColor(GRAU); c.setFont('Sans', 8)
    c.drawString(20 * mm, 30 * mm, 'Kostenlos von Ilona (@ilona.demenz). Alles Wichtige für den Ernstfall ausführlich: die Notfallmappe Demenz.')
    c.drawString(20 * mm, 24 * mm, 'Diese Karte ersetzt keine ärztliche Beratung. Persönliche Daten nur so viel wie nötig eintragen.')
    c.save()


if __name__ == '__main__':
    baue(sys.argv[1] if len(sys.argv) > 1 else 'Notfallkarte.pdf')
