# Synthetisiert lizenzfreie Show-Sounds für das Stream Deck (Seite 2).
import numpy as np, wave, subprocess, os
SR = 44100
rng = np.random.default_rng(7)
t_ = lambda d: np.arange(int(SR * d)) / SR
def env(n, a=0.005, r=0.1):
    e = np.ones(n); ai = min(int(a * SR), n // 4); ri = min(int(r * SR), n // 3)
    if ai: e[:ai] = np.linspace(0, 1, ai)
    if ri: e[-ri:] *= np.linspace(1, 0, ri)
    return e
def tone(f, d, harm=(1,), decay=0.0, vib=0.0):
    t = t_(d); s = 0
    ph = 2 * np.pi * f * t + (vib * np.sin(2 * np.pi * 5.5 * t) if vib else 0)
    for i, h in enumerate(harm): s = s + h * np.sin((i + 1) * ph)
    if decay: s = s * np.exp(-decay * t)
    return s * env(len(t))
def noise(d): return rng.standard_normal(int(SR * d))
def hp(x, k=0.95):  # einfacher Hochpass
    y = np.empty_like(x); prev = 0; px = 0
    for i, v in enumerate(x): prev = k * (prev + v - px); px = v; y[i] = prev
    return y
def lp(x, n=8): return np.convolve(x, np.ones(n) / n, mode='same')
def place(buf, snd, at):
    i = int(at * SR); buf[i:i + len(snd)] += snd[:len(buf) - i]
def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    w = f'/tmp/{name}.wav'
    with wave.open(w, 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((x * 32767).astype(np.int16).tobytes())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', w, '-b:a', '192k', f'{name}.mp3'], check=True); os.remove(w)

# Trommelwirbel + Becken
d = 3.2; b = np.zeros(int(SR * d)); t = t_(2.6)
roll = lp(noise(2.6), 6) * (0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 26 * t))) * np.linspace(0.3, 1, len(t))
roll += 0.6 * np.sin(2 * np.pi * 180 * t) * (np.sin(2 * np.pi * 26 * t) > 0.6)
place(b, roll, 0); place(b, hp(noise(1.2)) * np.exp(-3 * t_(1.2)) * 1.4, 2.6); save('trommelwirbel', b)
# Ba-dum-tss
b = np.zeros(int(SR * 1.6))
place(b, tone(130, 0.3, decay=12), 0.05); place(b, tone(95, 0.35, decay=10), 0.32)
place(b, hp(noise(0.9)) * np.exp(-5 * t_(0.9)), 0.62); save('ba-dum-tss', b)
# Applaus
d = 4.0; b = np.zeros(int(SR * d))
for _ in range(900):
    at = rng.uniform(0, d - 0.05); place(b, hp(noise(0.03), 0.9) * np.exp(-120 * t_(0.03)) * rng.uniform(0.3, 1), at)
b *= np.concatenate([np.linspace(0.2, 1, int(SR * 0.5)), np.ones(int(SR * 2.7)), np.linspace(1, 0, len(b) - int(SR * 3.2))]); save('applaus', b)
# Fanfare / Tusch
b = np.zeros(int(SR * 2.4)); H = (1, .7, .5, .35, .25, .15)
for f, at, dd in [(523, 0, .18), (523, .2, .18), (523, .4, .18), (659, .6, .25), (784, .9, 1.4)]:
    place(b, tone(f, dd, H, vib=0.02) * 0.8, at); place(b, tone(f / 2, dd, H) * 0.3, at)
save('tusch-fanfare', b)
# Trauriges Posaunen-Wah-wah
b = np.zeros(int(SR * 2.8)); H = (1, .8, .6, .4, .3)
for f, at, dd, v in [(311, 0, .45, .3), (294, .5, .45, .3), (277, 1.0, .45, .3), (262, 1.5, 1.2, 2.5)]:
    place(b, tone(f, dd, H, vib=v), at)
save('traurig-wahwah', b)
# Boing
t = t_(0.9); f = 220 + 180 * np.exp(-6 * t) * np.sin(2 * np.pi * 9 * t)
save('boing', np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-3.5 * t))
# Ding richtig
b = sum(a * tone(f, 1.6, decay=k) for f, a, k in [(1318, 1, 3), (2637, .4, 5), (3950, .2, 7)]); save('ding-richtig', b)
# Buzzer falsch
t = t_(0.9); save('buzzer-falsch', np.sign(np.sin(2 * np.pi * 110 * t)) * 0.6 + np.sign(np.sin(2 * np.pi * 116 * t)) * 0.4)
# Airhorn
b = np.zeros(int(SR * 2.0)); H = (1, .9, .8, .6, .5, .4, .3)
for at, dd in [(0, .25), (.32, .25), (.64, 1.1)]:
    place(b, tone(466, dd, H) + tone(587, dd, H) * .7 + tone(698, dd, H) * .6, at)
save('airhorn', b)
# Herzschlag
b = np.zeros(int(SR * 3.0))
for at in [0, .9, 1.8]:
    place(b, tone(55, .25, decay=14), at); place(b, tone(48, .25, decay=14) * .8, at + .22)
save('herzschlag', b)
# Grillen (peinliche Stille)
b = np.zeros(int(SR * 3.0))
for at in np.arange(0.1, 2.8, 0.55):
    for k in range(3): place(b, tone(4400, .03) * .5, at + k * .05)
save('grillen-stille', b)
# Ka-ching (Geschenk)
b = np.zeros(int(SR * 1.5)); place(b, hp(noise(.08)) * np.exp(-40 * t_(.08)), 0)
place(b, sum(a * tone(f, 1.3, decay=k) for f, a, k in [(1568, 1, 3), (2093, .7, 3.5), (3136, .3, 5)]), .08); save('ka-ching', b)
# Spannung
t = t_(4.0); f = 60 + 40 * t / 4
s = sum(np.sin(2 * np.pi * np.cumsum(f * m) / SR) * a for m, a in [(1, 1), (1.5, .5), (2, .4)])
save('spannung', s * np.linspace(0.1, 1, len(t)) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * t)))
# Woosh (Übergang)
t = t_(1.0); save('woosh', lp(noise(1.0), 30) * np.sin(np.pi * t) ** 2)
print('ok')
