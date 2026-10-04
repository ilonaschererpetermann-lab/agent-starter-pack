# Baut ein Stream-Deck-Profil (Format 3.0, Stream Deck MK.2 / 15 Tasten) mit allen Herzloewen-Tasten.
# Die Sounds werden aus C:\Herzloewen\StreamDeck abgespielt (dort legt INSTALLIEREN.bat sie ab).
import json, os, random, shutil, string, uuid, zipfile
HERE = os.path.dirname(os.path.abspath(__file__))
SD = os.path.dirname(HERE)
BASE = r"C:\Herzloewen\StreamDeck"
DEVICE_UUID = "777633e6-9455-4be6-aaf6-78f62bb0c480"  # aus Ilonas exportiertem Profil
BOARD = "https://claude.ai/artifact/Wkidu4YsxYbtJo9oW4tLtd"

def img_name(): return ''.join(random.choices(string.ascii_uppercase + string.digits, k=26)) + 'Z.png'
def action(uuid_, name, settings, image_src, images_dir):
    n = img_name(); shutil.copy(image_src, os.path.join(images_dir, n))
    return {"ActionID": str(uuid.uuid4()), "LinkedTitle": True, "Name": name, "Resources": None,
            "Settings": settings, "State": 0, "States": [{"Image": f"Images/{n}"}], "UUID": uuid_}
def sound(mp3, png, d): return action("com.elgato.streamdeck.soundboard.playaudio", "Play Audio", {"path": mp3}, png, d)
def nav(kind, png, d):
    a = action(f"com.elgato.streamdeck.page.{kind}", "Next Page" if kind == "next" else "Previous Page", {}, png, d)
    a["Plugin"] = {"Name": "Pages", "UUID": "com.elgato.streamdeck.page", "Version": "1.0"}; return a

# Navigations- und Extra-Tastenbilder rendern
os.system(f'node "{HERE}/nav_icons.js"')

pos = [f"{c},{r}" for r in range(3) for c in range(5)]
p1 = [("01","LIVE-Intro"),("02","MATCH-Start"),("03","x2"),("04","x3"),("05","x5"),("06","Letzte-60-Sek"),("07","Gewonnen"),
      ("08","Danke"),("09","Fanclub"),("10","Waechter"),("11","Gipfelzeit"),("12","Top-100"),("13","3-fach")]
p2 = ["17-applaus","18-trommelwirbel","19-ba-dum-tss","20-tusch-fanfare","21-airhorn","22-ding-richtig","23-buzzer-falsch",
      "24-traurig-wahwah","25-boing","26-ka-ching","27-herzschlag","28-spannung","29-grillen-stille"]
p3 = ["31-attacke","32-kriegstrommeln","33-alarm","34-countdown","35-boom","36-power-up","37-schwert","38-kino-schlag","39-level-up","40-ko"]

out = "/tmp/sdbuild"; shutil.rmtree(out, ignore_errors=True)
prof_id = str(uuid.uuid4()).upper()
root = f"{out}/Profiles/{prof_id}.sdProfile"
pages = [str(uuid.uuid4()) for _ in range(3)]; default_page = str(uuid.uuid4())
def page_dir(pid):
    d = f"{root}/Profiles/{pid.upper()}"; os.makedirs(f"{d}/Images", exist_ok=True); return d
def write(d, actions): json.dump({"Controllers": [{"Actions": actions or None, "Type": "Keypad"}], "Icon": "", "Name": ""}, open(f"{d}/manifest.json", "w"), indent=1)

pk = "/tmp/Herzloewen-StreamDeck"
# Seite 1
d = page_dir(pages[0]); I = f"{d}/Images"; acts = {}
for i, (nr, name) in enumerate(p1):
    acts[pos[i]] = sound(rf"{BASE}\Taste-{nr}-{name}.mp3", f"{pk}/Taste-{nr}-{name}.png", I)
acts["3,2"] = action("com.elgato.streamdeck.system.website", "Website", {"openInBrowser": True, "path": BOARD}, f"{HERE}/nav-board.png", I)
acts["4,2"] = nav("next", f"{HERE}/nav-next.png", I); write(d, acts)
# Seite 2
d = page_dir(pages[1]); I = f"{d}/Images"; acts = {}
for i, n in enumerate(p2):
    acts[pos[i]] = sound(rf"{BASE}\Seite-2-Sounds\Taste-{n}.mp3", f"{pk}/Seite-2-Sounds/Taste-{n}.png", I)
acts["3,2"] = nav("previous", f"{HERE}/nav-prev.png", I); acts["4,2"] = nav("next", f"{HERE}/nav-next.png", I); write(d, acts)
# Seite 3
d = page_dir(pages[2]); I = f"{d}/Images"; acts = {}
for i, n in enumerate(p3):
    acts[pos[i]] = sound(rf"{BASE}\Seite-3-Battle\Taste-{n}.mp3", f"{pk}/Seite-3-Battle/Taste-{n}.png", I)
acts["3,2"] = nav("previous", f"{HERE}/nav-prev.png", I)
acts["4,2"] = action("com.elgato.streamdeck.system.website", "Website", {"openInBrowser": True, "path": BOARD}, f"{HERE}/nav-board.png", I)
write(d, acts)
# leere Standardseite wie im Original
d = page_dir(default_page); write(d, None)

json.dump({"Device": {"Model": "20GBA9901", "UUID": DEVICE_UUID}, "Name": "Herzloewen Show",
           "Pages": {"Current": pages[0], "Default": default_page, "Pages": pages}, "Version": "3.0"}, open(f"{root}/manifest.json", "w"), indent=1)
json.dump({"AppVersion": "7.6.0.23012", "DeviceModel": "20GBA9901", "DeviceSettings": None, "FormatVersion": 1, "OSType": "Windows",
           "OSVersion": "10.0.26300", "RequiredPlugins": ["com.elgato.streamdeck.page", "com.elgato.streamdeck.soundboard", "com.elgato.streamdeck.system.website"]},
          open(f"{out}/package.json", "w"))
dest = os.path.join(SD, "Herzloewen-Show.streamDeckProfile")
with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED) as z:
    for dp, _, fs in os.walk(out):
        for f in fs: p = os.path.join(dp, f); z.write(p, os.path.relpath(p, out))
print(dest)
