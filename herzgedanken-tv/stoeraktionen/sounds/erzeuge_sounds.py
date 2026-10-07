"""Erzeugt das HerzGedanken-Sound-Paket für TikFinity-Störaktionen (WAV, danach per ffmpeg zu MP3).

Aufruf: python3 erzeuge_sounds.py <zielordner>
Alle Sounds sind selbst synthetisiert (keine fremden Aufnahmen) und bewusst nicht zu laut.
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def env(n, attack=0.005, release=0.1):
    t = np.arange(n) / SR
    a = np.clip(t / attack, 0, 1)
    r = np.clip((n / SR - t) / release, 0, 1)
    return a * r


def tone(freq, dur, kind="sine", vol=0.5):
    t = np.arange(int(SR * dur)) / SR
    if kind == "saw":
        w = 2 * (t * freq % 1) - 1
    elif kind == "square":
        w = np.sign(np.sin(2 * np.pi * freq * t))
    else:
        w = np.sin(2 * np.pi * freq * t)
    return w * vol


def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")


def save(path, x, peak=0.7):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    data = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def place(buf, x, at):
    i = int(at * SR)
    buf[i:i + len(x)] += x[: max(0, len(buf) - i)]


def applaus():
    dur = 3.2
    buf = np.zeros(int(SR * dur))
    for _ in range(420):  # viele einzelne Klatscher
        n = int(SR * 0.02)
        c = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * 0.004))
        c = c - lowpass(c, 6)  # hell
        at = rng.uniform(0, dur - 0.05)
        fade = min(1, at / 0.3) * min(1, (dur - at) / 0.8)
        place(buf, c * rng.uniform(.3, 1) * fade, at)
    return buf


def fanfare():
    notes = [(523, .16), (523, .16), (523, .16), (659, .5), (523, .2), (659, .2), (784, .9)]
    buf = np.zeros(int(SR * 2.6))
    t = 0
    for f, d in notes:
        x = sum(tone(f * h, d + .05, "saw", .5 / h) for h in (1, 2, 3))
        x = lowpass(x, 4) * env(len(x), .01, .08)
        place(buf, x, t)
        t += d
    chord = sum(tone(f, 1.0, "saw", .25) for f in (523, 659, 784, 1046))
    place(buf, lowpass(chord, 4) * env(len(chord), .02, .6), t - .9)
    return buf


def herzschlag():
    buf = np.zeros(int(SR * 3.4))
    for beat in range(4):
        for off, vol in ((0, 1.0), (0.22, 0.7)):  # „lub-dub“
            n = int(SR * .18)
            t = np.arange(n) / SR
            x = np.sin(2 * np.pi * (55 - 25 * t / .18) * t) * np.exp(-t / .05) * vol
            place(buf, x, .1 + beat * .8 + off)
    return buf


def konfetti():
    buf = np.zeros(int(SR * 1.6))
    n = int(SR * .08)
    pop = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * .012))
    place(buf, pop, .02)
    for i in range(30):  # glitzernde Pling-Töne
        f = rng.uniform(1800, 4200)
        x = tone(f, .25, "sine", .12) * np.exp(-np.arange(int(SR * .25)) / (SR * .06))
        place(buf, x, .08 + i * .04 + rng.uniform(0, .03))
    return buf


def hupe():
    buf = np.zeros(int(SR * 1.3))
    for at in (0.0, 0.5):
        x = tone(330, .38, "square", .4) + tone(415, .38, "square", .3)
        x = lowpass(x, 10) * env(len(x), .01, .05)
        place(buf, x, at)
    return buf


def gong():
    buf = np.zeros(int(SR * 3.0))
    for i, f in enumerate((1568, 1175, 880)):  # absteigend wie ein Nachrichten-Gong
        x = tone(f, 2.0, "sine", .5) + tone(f * 2.01, 2.0, "sine", .1)
        place(buf, x * np.exp(-np.arange(len(x)) / (SR * .5)), i * .35)
    return buf


if __name__ == "__main__":
    out = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    out.mkdir(parents=True, exist_ok=True)
    for name, fn in [("applaus", applaus), ("fanfare", fanfare), ("herzschlag", herzschlag),
                     ("konfetti", konfetti), ("hupe", hupe), ("gong", gong)]:
        save(out / f"{name}.wav", fn())
        print(name)
