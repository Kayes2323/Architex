#!/usr/bin/env python3
"""Assemble the Dirghoshash film from stills, AI clips, documents and narration."""
import json, os, subprocess, sys

W = os.path.dirname(os.path.abspath(__file__))
os.chdir(W)
os.makedirs("seg", exist_ok=True)
FPS = 30
XF = 0.6  # crossfade inside a scene


def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode:
        print(cmd, "\n", r.stderr[-2000:])
        sys.exit(1)


def dur(path):
    out = subprocess.run(
        f"ffprobe -v error -show_entries format=duration -of csv=p=0 {path}",
        shell=True, capture_output=True, text=True).stdout
    return float(out.strip())


GRADES = {
    "warm": "eq=saturation=1.05:gamma=1.02,colorbalance=rs=0.04:bs=-0.04:rm=0.03:bm=-0.03",
    "neutral": "eq=saturation=0.98",
    "muted": "eq=saturation=0.72:contrast=0.97:brightness=-0.02,colorbalance=bs=0.03:bm=0.02",
    "bw": "hue=s=0,eq=contrast=1.05",
    "balanced": "eq=saturation=0.95",
    "clean": "eq=saturation=1.0:brightness=0.02:gamma=1.03",
}


def still(img, d, out, grade, zoom="in", target=None):
    """Ken Burns on a 1920x1080 still. target=(cx,cy,zmax) zooms toward a point."""
    n = int(round(d * FPS))
    if target:
        cx, cy, zmax = target
        rate = (zmax - 1) / n
        z = f"min(1+{rate:.6f}*on,{zmax})"
        x = f"({cx}*2)-(iw/zoom/2)"
        y = f"({cy}*2)-(ih/zoom/2)"
        x = f"max(0,min({x},iw-iw/zoom))"
        y = f"max(0,min({y},ih-ih/zoom))"
    elif zoom == "in":
        z = f"1+0.07*on/{n}"
        x, y = "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"
    else:
        z = f"1.07-0.07*on/{n}"
        x, y = "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"
    vf = (f"scale=3840:2160:flags=lanczos,zoompan=z='{z}':x='{x}':y='{y}':d={n}:s=1920x1080:fps={FPS},"
          f"{GRADES[grade]},format=yuv420p")
    run(f"ffmpeg -nostdin -v error -y -loop 1 -i {img} -vf \"{vf}\" -t {d:.3f} -an -c:v libx264 -crf 18 -preset veryfast {out}")


def clip(src, d, out, grade, speed=1.0, rain=False):
    base = f"scale=1920:1080,fps={FPS},setpts={speed}*PTS,tpad=stop_mode=clone:stop_duration=30,{GRADES[grade]}"
    if rain:
        fc = (f"[0]{base}[v];"
              f"color=c=black:s=960x540:r={FPS},noise=alls=90:allf=t+u,eq=contrast=7:brightness=-0.62,"
              f"avgblur=sizeX=1:sizeY=14,scale=1920:1080,format=yuv420p[r];"
              f"[v][r]blend=all_mode=screen:all_opacity=0.35,format=yuv420p[o]")
        run(f"ffmpeg -nostdin -v error -y -i {src} -filter_complex \"{fc}\" -map \"[o]\" -t {d:.3f} -an -c:v libx264 -crf 18 -preset veryfast {out}")
    else:
        run(f"ffmpeg -nostdin -v error -y -i {src} -vf \"{base},format=yuv420p\" -t {d:.3f} -an -c:v libx264 -crf 18 -preset veryfast {out}")


def scene(name, parts, length, grade, vo=(), amb="room", amb_vol=0.045, rain=False):
    """parts: list of (kind, src, weight, extra). Durations are spread over length."""
    n = len(parts)
    fixed = sum(p[3].get("d", 0) for p in parts)
    free = [p for p in parts if "d" not in p[3]]
    rest = length + XF * (n - 1) - fixed
    each = rest / len(free) if free else 0
    files = []
    for i, (kind, src, _, ex) in enumerate(parts):
        d = ex.get("d", each)
        o = f"seg/{name}_{i}.mp4"
        if kind == "still":
            still(src, d, o, ex.get("grade", grade), ex.get("zoom", "in" if i % 2 == 0 else "out"), ex.get("target"))
        else:
            clip(src, d, o, ex.get("grade", grade), ex.get("speed", 1.0), ex.get("rain", False))
        files.append((o, d))
    # crossfade chain
    inputs = " ".join(f"-i {f}" for f, _ in files)
    if len(files) == 1:
        fc = "[0]null[vx]"
    else:
        fc, prev, off = "", "[0]", 0.0
        for i in range(1, len(files)):
            off += files[i - 1][1] - XF
            fc += f"{prev}[{i}]xfade=transition=fade:duration={XF}:offset={off:.3f}[x{i}];"
            prev = f"[x{i}]"
        fc = fc + f"{prev}null[vx]"
    fc += f";[vx]fade=t=in:st=0:d=0.5,fade=t=out:st={length-0.6:.3f}:d=0.6,trim=0:{length:.3f}[v]"
    # audio
    k = len(files)
    ain, amix = "", []
    for j, (f, start) in enumerate(vo):
        ain += f" -i {f}"
        ms = int(start * 1000)
        fc += f";[{k+j}]loudnorm=I=-17:TP=-2,adelay={ms}|{ms},aformat=sample_rates=48000:channel_layouts=stereo[n{j}]"
        amix.append(f"[n{j}]")
    if amb == "room":
        src = f"anoisesrc=color=brown:amplitude=0.6:sample_rate=48000:duration={length}"
        fc += f";{src},lowpass=f=380,highpass=f=40,volume={amb_vol},aformat=channel_layouts=stereo[amb]"
        amix.append("[amb]")
    elif amb == "rain":
        src = f"anoisesrc=color=pink:amplitude=0.7:sample_rate=48000:duration={length}"
        src2 = f"anoisesrc=color=brown:amplitude=0.6:sample_rate=48000:duration={length}"
        fc += (f";{src},highpass=f=900,lowpass=f=9000,volume=0.09,aformat=channel_layouts=stereo[r1]"
               f";{src2},lowpass=f=200,volume=0.06,aformat=channel_layouts=stereo[r2]"
               f";[r1][r2]amix=inputs=2:normalize=0[amb]")
        amix.append("[amb]")
    if not amix:
        fc += f";anullsrc=r=48000:cl=stereo,atrim=0:{length}[au]"
    else:
        fc += (f";{''.join(amix)}amix=inputs={len(amix)}:normalize=0:duration=longest,"
               f"apad,atrim=0:{length:.3f},afade=t=in:d=0.4,afade=t=out:st={length-0.6:.3f}:d=0.6[au]")
    out = f"seg/S_{name}.mp4"
    run(f"ffmpeg -nostdin -v error -y {inputs}{ain} -filter_complex \"{fc}\" -map \"[v]\" -map \"[au]\" "
        f"-r {FPS} -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 {out}")
    print("built", out, f"{length:.1f}s")
    return out


def vo(name):
    return f"vo/{name}.mp3"


def chain(*items, gap=0.9, lead=0.8, tail=1.4):
    """Place narration files one after another; returns (list, total length)."""
    t, res = lead, []
    for it in items:
        res.append((vo(it), t))
        t += dur(vo(it)) + gap
    return res, t - gap + tail


st = lambda i: f"st/{i}.jpg"
S = []

# Title
S.append(scene("00_title", [("still", "titles/open.png", 1, {"zoom": "in"})], 6.0, "neutral", amb=None))
# 01 beginning — no narration
S.append(scene("01", [("still", st("f259ba07"), 1, {}), ("still", st("2d3aeec2"), 1, {})], 9.0, "warm", amb_vol=0.04))
# 02 hard work
v, L = chain("20", "21")
S.append(scene("02", [("still", st("abba80d2"), 1, {}), ("still", st("a4eb1699"), 1, {}), ("still", st("79e2cd94"), 1, {})], L, "warm", v))
# 03 dakhil result + talent pool
v, L = chain("31", "32", gap=1.0)
d1 = 0.8 + dur(vo("31")) + 1.3
S.append(scene("03", [
    ("still", "doc/dakhil_s16.jpg", 1, {"d": d1 + XF, "target": (385, 781, 1.8), "grade": "neutral"}),
    ("still", "doc/talent_s16.jpg", 1, {"grade": "neutral", "target": (940, 940, 1.45)}),
], L, "warm", v))
# 04 Dhaka
v, L = chain("41", lead=1.2)
S.append(scene("04", [("clip", "ai/04_gate.mp4", 1, {"d": 6.0}), ("still", st("66ee628b"), 1, {}), ("still", st("506e531a"), 1, {})], L, "neutral", v))
# 05 friends
v, L = chain("51", tail=2.5)
S.append(scene("05", [("still", st(i), 1, {}) for i in ["12a334cf", "ffea03e6", "3a6fba39", "e81c66c7"]], L, "neutral", v))
# 06 the crack — rain
v, L = chain("61", lead=4.5, tail=2.2)
S.append(scene("06", [
    ("still", "s06_bus_still.jpg", 1, {"d": 4.0, "grade": "bw"}),
    ("clip", "ai/06_bus.mp4", 1, {"d": 7.0, "speed": 1.18, "rain": True, "grade": "bw"}),
    ("clip", "ai/07_paper.mp4", 1, {"speed": 1.3, "rain": False, "grade": "bw"}),
], L, "bw", v, amb="rain"))
# 07 morning after
v, L = chain("71", lead=1.5)
S.append(scene("07", [("still", st("d404abc7"), 1, {}), ("still", st("dab93504"), 1, {})], L, "muted", v))
# 08 one after another
v, L = chain("81")
S.append(scene("08", [("still", st(i), 1, {}) for i in ["56d1b0d7", "e44c808c", "f0dcf3d3"]], L, "muted", v))
# 09 final battle
v, L = chain("91")
S.append(scene("09", [("still", st("0f3cde72"), 1, {}), ("still", st("5c52f577"), 1, {})], L, "muted", v))
# 10 HSC
v, L = chain("101", lead=1.2, tail=1.8)
S.append(scene("10", [("still", st("d06bcd32"), 1, {"d": 3.6}),
                      ("still", "doc/hsc_s16.jpg", 1, {"grade": "neutral", "target": (1250, 920, 1.4)})], L, "balanced", v))
# 11-12 demo already built
S.append("demo_11_12.mp4")
# 13 quiet period — no narration
S.append(scene("13", [("still", st("4aee81b1"), 1, {})], 7.0, "muted", amb_vol=0.035))
# 14 another path
v, L = chain("141")
S.append(scene("14", [("still", st("9fe62900"), 1, {}), ("still", st("0049e69b"), 1, {})], L, "balanced", v))
# 15 Sondhan
v, L = chain("151", "152", gap=1.1)
S.append(scene("15", [("still", st("2e784e89"), 1, {}), ("still", "st/sondhan.jpg", 1, {"grade": "neutral"}), ("still", st("3ca78a24"), 1, {})], L, "balanced", v))
# 16 MOVE
v, L = chain("161")
S.append(scene("16", [("still", st("4294944c"), 1, {}), ("still", st("408f25f1"), 1, {})], L, "balanced", v))
# 17 Mino + building nights
v, L = chain("171")
S.append(scene("17", [("still", st(i), 1, {}) for i in ["3f9cb791", "850b9792", "693944a3"]], L, "clean", v))
# 18 now
v, L = chain("181")
S.append(scene("18", [("still", st("c658a592"), 1, {}), ("still", st("df76ddcc"), 1, {})], L, "clean", v))
# 19 callback — child to present, no narration
S.append(scene("19", [("still", st("f259ba07"), 1, {"grade": "warm"}), ("still", st("d6e0ee5a"), 1, {})], 8.0, "clean", amb_vol=0.03))
# 20 future
v, L = chain("201", "202", gap=1.2, tail=3.2)
S.append(scene("20", [
    ("still", st("bfaec6bb"), 1, {}),
    ("still", "st/s20_rail.jpg", 1, {"d": 6.0}),
    ("clip", "ai/20_rail.mp4", 1, {"speed": 1.4}),
], L, "clean", v, amb_vol=0.035))
# End title
S.append(scene("99_end", [("still", "titles/end.png", 1, {"zoom": "in"})], 7.0, "neutral", amb=None))

with open("concat.txt", "w") as f:
    for p in S:
        f.write(f"file '{p if p.startswith('seg/') else p}'\n")
json.dump(S, open("scenes.json", "w"))
print("scenes:", len(S))
