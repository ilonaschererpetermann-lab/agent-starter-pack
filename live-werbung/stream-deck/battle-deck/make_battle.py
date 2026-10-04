# Battle-Sounds für Seite 3 (lizenzfrei synthetisiert).
import numpy as np, sys
sys.path.insert(0, '../sound-deck')
import importlib.util
spec = importlib.util.spec_from_file_location('s', '../sound-deck/make_sounds.py')
# nur Hilfsfunktionen übernehmen, ohne die Sounds dort neu zu erzeugen
src = open('../sound-deck/make_sounds.py').read().split('# Trommelwirbel')[0]
g = {}; exec(src, g)
SR, t_, tone, noise, hp, lp, place, save, rng = (g[k] for k in ['SR','t_','tone','noise','hp','lp','place','save','rng'])
def taiko(d=0.6, f=70): t = t_(d); return np.sin(2*np.pi*f*t*(1-0.3*t))*np.exp(-7*t) + lp(noise(d), 40)*np.exp(-20*t)*0.4
# ATTACKE: Kriegshorn + Trommeln
b = np.zeros(int(SR*3.5)); H = (1,.9,.75,.6,.45,.3,.2)
for at in [0, .3, .6, .9, 1.05, 1.2]: place(b, taiko()*1.2, at)
place(b, tone(147, 1.8, H, vib=.4)*.7 + tone(220, 1.8, H, vib=.4)*.5, 1.4); save('Taste-31-attacke', b)
# Kriegstrommeln (Loop)
b = np.zeros(int(SR*4.0))
for i, at in enumerate(np.arange(0, 3.8, .25)): place(b, taiko(f=60 if i % 4 == 0 else 85)*(1.3 if i % 4 == 0 else .8), at)
save('Taste-32-kriegstrommeln', b)
# Alarm-Sirene
t = t_(3.0); f = 650 + 350*np.sin(2*np.pi*1.2*t); save('Taste-33-alarm', np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*.6)
# Countdown 3-2-1 + Horn
b = np.zeros(int(SR*4.2))
for at in [0, 1, 2]: place(b, tone(880, .18, (1,.3)), at)
place(b, tone(1760, .9, (1,.4,.2)), 3.0); place(b, taiko(.8, 55)*1.3, 3.0); save('Taste-34-countdown', b)
# BOOM / Explosion
t = t_(2.5); boom = np.sin(2*np.pi*45*t*(1-0.2*t))*np.exp(-2.5*t) + lp(noise(2.5), 25)*np.exp(-2*t)*1.5
save('Taste-35-boom', boom)
# Power-Up
b = np.zeros(int(SR*1.6))
for i, f in enumerate([262, 330, 392, 523, 659, 784, 1047, 1319]): place(b, np.sign(tone(f, .12))*.4, i*.11)
place(b, tone(1568, .7, (1,.5), decay=3), .9); save('Taste-36-power-up', b)
# Schwert-Klirren
t = t_(1.4); ring = sum(a*np.sin(2*np.pi*f*t)*np.exp(-k*t) for f, a, k in [(2400,1,4),(3700,.6,5),(5200,.4,7),(6900,.3,9)])
b = np.zeros(int(SR*1.6)); place(b, hp(noise(.06))*np.exp(-60*t_(.06))*2, 0); place(b, ring, .01); save('Taste-37-schwert', b)
# Epischer Kino-Schlag
t = t_(3.0); hit = np.sin(2*np.pi*38*t)*np.exp(-1.5*t)*1.5 + lp(noise(3.0), 60)*np.exp(-1.2*t)*.8 + hp(noise(3.0))*np.exp(-6*t)*.3
save('Taste-38-kino-schlag', hit)
# Level-Up (8-Bit)
b = np.zeros(int(SR*1.2))
for i, f in enumerate([523, 659, 784, 1047, 784, 1047]): place(b, np.sign(tone(f, .09))*.35, i*.09)
place(b, np.sign(tone(1568, .4))*.3, .55); save('Taste-39-level-up', b)
# K.O.: Schlag + Ringglocke
b = np.zeros(int(SR*2.6)); place(b, taiko(.3, 90)*1.4 + lp(noise(.3), 10)*np.exp(-30*t_(.3)), 0)
for at in [.4, .8, 1.2]: place(b, sum(a*tone(f, 1.2, decay=k) for f, a, k in [(1200,1,3),(2900,.5,4)]), at)
save('Taste-40-ko', b)
print('ok')
