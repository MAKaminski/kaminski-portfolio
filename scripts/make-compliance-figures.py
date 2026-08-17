"""Generate the figures for the compliance-review essay (essay #2).

Pure stdlib + Pillow. Every number here is taken from the essay prose and is
hardcoded so the figure can never silently drift from the text:

  - 30 + 60 + 30 = 120  (12 CFR 1002.9 notification chain)
  - 7 calls / 7 consecutive days (12 CFR 1006.14)
  - the 14-calls-in-4-days calendar-counter bug

Palette matches the site and essay #1 (ink #060606, accent #fff500).
Rendered at 2x and downsampled, because there is no SVG rasteriser on this
machine worth trusting for text.
"""
import pathlib
from PIL import Image, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'images' / 'essays'
OUT.mkdir(parents=True, exist_ok=True)

INK = (6, 6, 6)
ACCENT = (255, 245, 0)
FG = (244, 244, 245)
MUTED = (150, 150, 154)
DIM = (95, 95, 99)
WARN = (255, 107, 107)
GRIDC = (30, 30, 32)

S = 2  # supersample factor

FONTS = '/System/Library/Fonts/Supplemental/'
def font(size, bold=True):
    path = FONTS + ('Arial Bold.ttf' if bold else 'Arial.ttf')
    return ImageFont.truetype(path, size * S)

def canvas(w, h):
    im = Image.new('RGB', (w * S, h * S), INK)
    return im, ImageDraw.Draw(im)

def finish(im, w, h, name):
    im = im.resize((w, h), Image.LANCZOS)
    im.save(OUT / name, optimize=True)
    print(f'wrote {name}  {w}x{h}')
    return im

def text(d, xy, s, f, fill=FG, anchor='la'):
    d.text((xy[0] * S, xy[1] * S), s, font=f, fill=fill, anchor=anchor)

def rect(d, box, fill=None, outline=None, width=1, radius=None):
    b = [v * S for v in box]
    if radius:
        d.rounded_rectangle(b, radius=radius * S, fill=fill, outline=outline, width=width * S)
    else:
        d.rectangle(b, fill=fill, outline=outline, width=width * S)

def line(d, p0, p1, fill, width=1):
    d.line([p0[0] * S, p0[1] * S, p1[0] * S, p1[1] * S], fill=fill, width=width * S)


# ---------------------------------------------------------------- OG card
# Type-led, one number. Read at thumbnail size on DEV and LinkedIn.
def og():
    W, H = 1200, 630
    L = 76
    im, d = canvas(W, H)
    rect(d, (0, 0, W, 8), fill=ACCENT)
    text(d, (L, 78), 'FIELD NOTES', font(17), fill=ACCENT)
    text(d, (L, 128), 'Shipping an AI agent through', font(48))
    text(d, (L, 186), 'compliance review', font(48))
    line(d, (L, 262), (L + 120, 262), ACCENT, 4)
    text(d, (L, 292), 'The CFPB withdrew 67 guidance documents in a day.', font(22, False), fill=(170, 170, 174))
    text(d, (L, 326), 'The underlying duty did not move an inch.', font(22, False), fill=(170, 170, 174))

    # the number
    text(d, (L, 408), '120', font(104), fill=ACCENT)
    text(d, (L + 232, 424), 'days of trace retention', font(24))
    text(d, (L + 232, 458), 'before an examiner can still ask', font(21, False), fill=MUTED)

    # the default it beats
    bx = 780
    rect(d, (bx, 396, bx + 300, 516), outline=WARN, width=2, radius=8)
    text(d, (bx + 20, 412), 'logging default', font(15, False), fill=WARN)
    text(d, (bx + 20, 434), '30 days', font(38), fill=WARN)
    text(d, (bx + 20, 484), 'covers 25% of the window', font(15, False), fill=MUTED)

    text(d, (L, H - 52), 'Michael Kaminski', font(20))
    text(d, (L + 205, H - 52), 'michael-kaminski.io', font(20, False), fill=(120, 120, 124))
    finish(im, W, H, 'og-compliance-review.png')


# ------------------------------------------------- fig1: the retention floor
# 12 CFR 1002.9 chains three clocks. A 30-day log covers the first one.
def fig1():
    W, H = 920, 430
    L, R, T = 78, 44, 132
    pw = W - L - R
    im, d = canvas(W, H)
    X = lambda day: L + day / 120.0 * pw

    text(d, (L, 34), 'Your trace retention floor is 120 days, not 30', font(21))
    text(d, (L, 62), '12 CFR 1002.9 chains three clocks between the decision and the demand to explain it.',
         font(13, False), fill=MUTED)

    segs = [(0, 30, 'notify the applicant', '30 days', ACCENT),
            (30, 90, 'applicant may request the reasons', '60 days', (110, 106, 30)),
            (90, 120, 'creditor must deliver them', '30 days', ACCENT)]
    bh = 58
    for a, b, label, dur, col in segs:
        rect(d, (X(a) + 2, T, X(b) - 2, T + bh), fill=col, radius=4)
        cx = (X(a) + X(b)) / 2
        ink_on = INK if col == ACCENT else FG
        text(d, (cx, T + 14), dur, font(19), fill=ink_on, anchor='ma')
        text(d, (cx, T + 38), label, font(11, False), fill=ink_on, anchor='ma')

    for day in (0, 30, 90, 120):
        line(d, (X(day), T + bh + 4), (X(day), T + bh + 14), DIM, 1)
        text(d, (X(day), T + bh + 20), f'day {day}', font(12, False), fill=MUTED, anchor='ma')

    text(d, (X(60), T - 26), '30  +  60  +  30  =  120 days', font(17), fill=FG, anchor='ma')

    # the default, underneath
    T2 = T + 150
    text(d, (L, T2 - 30), 'What a 30-day logging default actually covers', font(15), fill=WARN)
    rect(d, (X(0) + 2, T2, X(30) - 2, T2 + bh), fill=WARN, radius=4)
    text(d, (X(15), T2 + 20), 'reproducible', font(14), fill=INK, anchor='ma')

    # the gap
    for gx in range(int(X(30)) + 6, int(X(120)) - 2, 12):
        line(d, (gx, T2 + 6), (gx - 10, T2 + bh - 6), (70, 34, 34), 2)
    rect(d, (X(30) + 2, T2, X(120) - 2, T2 + bh), outline=WARN, width=1, radius=4)
    text(d, (X(75), T2 + 16), '90 days where the decision must still be explained', font(13), fill=WARN, anchor='ma')
    text(d, (X(75), T2 + 36), 'and the trace is already gone', font(13), fill=WARN, anchor='ma')

    text(d, (L, H - 46), 'Inherit the default and the decision stays reproducible for a quarter of the window',
         font(13, False), fill=MUTED)
    text(d, (L, H - 26), 'in which it can be demanded.', font(13, False), fill=MUTED)
    finish(im, W, H, 'fig1-retention-floor.png')


# --------------------------------------- fig2 (animated): the counter bug
# 12 CFR 1006.14 presumes a violation above 7 calls per debt per 7 CONSECUTIVE
# days. A counter keyed to the calendar week permits 7 calls Sat-Sun and 7 more
# Mon-Tue: 14 calls in four days, and it never reads above 7 in either week.
DAYS = ['SAT', 'SUN', 'MON', 'TUE']
CALLS = [(0, i) for i in range(4)] + [(1, i) for i in range(3)] \
      + [(2, i) for i in range(4)] + [(3, i) for i in range(3)]   # 14 calls

def frame(n_placed, flash_reset=False, verdict=False):
    """Render the state after n_placed calls have been made."""
    W, H = 920, 520
    im, d = canvas(W, H)
    L, R = 78, 44
    pw = W - L - R

    text(d, (L, 32), 'Same 14 calls. One counter never sees a violation.', font(21))
    text(d, (L, 60), '12 CFR 1006.14 · more than 7 calls per debt in 7 consecutive days',
         font(13, False), fill=MUTED)

    # ---- day strip
    T = 108
    dw = pw / 4.0
    placed = CALLS[:n_placed]
    for di, day in enumerate(DAYS):
        x = L + di * dw
        wk_col = (22, 22, 24) if di < 2 else (16, 16, 18)
        rect(d, (x + 3, T, x + dw - 3, T + 92), fill=wk_col, radius=5)
        text(d, (x + dw / 2, T + 10), day, font(14), fill=MUTED, anchor='ma')
        n_day = sum(1 for dd, _ in placed if dd == di)
        for k in range(4):
            cx, cy = x + dw / 2 - 33 + k * 22, T + 56
            on = k < n_day
            col = ACCENT if on else (38, 38, 40)
            d.ellipse([(cx - 8) * S, (cy - 8) * S, (cx + 8) * S, (cy + 8) * S], fill=col)
        text(d, (x + dw / 2, T + 72), f'{n_day} call{"" if n_day == 1 else "s"}',
             font(12, False), fill=DIM if n_day == 0 else FG, anchor='ma')

    # week boundary
    bx = L + 2 * dw
    line(d, (bx, T - 12), (bx, T + 104), WARN if flash_reset else (60, 60, 64), 2)
    text(d, (bx, T + 108), 'Monday 00:00 — calendar counter resets',
         font(12), fill=WARN if flash_reset else DIM, anchor='ma')

    # ---- counters
    cal = sum(1 for dd, _ in placed if dd >= 2) if n_placed > 7 else n_placed
    roll = n_placed
    CT = 268
    bar_w = pw - 210
    scale = 14.0

    def meter(y, label, sub, value, danger):
        col = WARN if danger else ACCENT
        text(d, (L, y - 26), label, font(15))
        text(d, (L, y - 8), sub, font(12, False), fill=MUTED)
        rect(d, (L, y + 14, L + bar_w, y + 52), fill=(24, 24, 26), radius=6)
        if value:
            rect(d, (L, y + 14, L + max(6, bar_w * value / scale), y + 52), fill=col, radius=6)
        # threshold at 7
        tx = L + bar_w * 7 / scale
        line(d, (tx, y + 6), (tx, y + 60), WARN, 2)
        text(d, (tx, y + 66), 'limit: 7', font(11), fill=WARN, anchor='ma')
        text(d, (L + bar_w + 26, y + 8), str(value), font(40), fill=col)
        verdict_txt = 'PRESUMPTION FIRES' if danger else 'reads compliant'
        text(d, (L + bar_w + 26, y + 56), verdict_txt, font(12), fill=col)

    meter(CT, 'Calendar-week counter', 'resets Monday 00:00', cal, False)
    meter(CT + 118, 'Rolling 7-day counter', 'what the regulation actually says', roll, roll > 7)

    if verdict:
        rect(d, (L, H - 62, W - R, H - 18), fill=(26, 12, 12), radius=6)
        text(d, (L + 18, H - 52), '14 calls in four days. The calendar counter never read above 7 '
             'in either week.', font(14), fill=WARN)
        text(d, (L + 18, H - 33), 'The presumption fires anyway. Rolling window, rolling counter.',
             font(14), fill=WARN)
    return im.resize((W, H), Image.LANCZOS)


def fig2_gif():
    frames, durations = [], []
    frames.append(frame(0)); durations.append(900)
    for n in range(1, 15):
        flash = (n == 8)
        frames.append(frame(n, flash_reset=flash))
        durations.append(700 if flash else 330)
    frames.append(frame(14, verdict=True)); durations.append(2600)

    # One palette for the whole animation. Quantising each frame independently
    # lets median-cut pick a different palette per frame, which collapsed the
    # yellow and the red into the same orange. Build a master palette from a
    # composite of every frame, then map all frames onto it.
    W, H = frames[0].size
    comp = Image.new('RGB', (W, H * len(frames)))
    for i, f in enumerate(frames):
        comp.paste(f, (0, i * H))
    master = comp.quantize(colors=64, method=Image.MEDIANCUT, dither=Image.NONE)
    pal = [f.quantize(palette=master, dither=Image.NONE) for f in frames]
    pal[0].save(OUT / 'rolling-vs-calendar.gif', save_all=True, append_images=pal[1:],
                duration=durations, loop=0, optimize=True, disposal=2)
    # a still for anywhere that will not animate
    frames[-1].save(OUT / 'fig2-counter-bug.png', optimize=True)
    kb = (OUT / 'rolling-vs-calendar.gif').stat().st_size / 1024
    print(f'wrote rolling-vs-calendar.gif  {len(frames)} frames  {kb:.0f} KB')
    print('wrote fig2-counter-bug.png  920x520')


og()
fig1()
fig2_gif()
