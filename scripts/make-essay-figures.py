"""Generate the figures for the statistical-gating essay.

Pure stdlib: no numpy/scipy/matplotlib. Every number here was computed with
scipy in the drafting run and is hardcoded so the figure can never silently
drift from the prose. Palette matches the site (ink #060606, accent #fff500).
"""
import math, pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'images' / 'essays'
OUT.mkdir(parents=True, exist_ok=True)

INK = '#060606'
ACCENT = '#fff500'
FG = '#f4f4f5'
MUTED = 'rgba(244,244,245,0.55)'
GRID = 'rgba(255,255,255,0.10)'
WARN = '#ff6b6b'
FONT = "'Space Grotesk',Inter,system-ui,sans-serif"

def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

# ---------------------------------------------------------------- figure 1
# Minimum detectable effect vs days per window. alpha=0.10, power=0.80.
MDE = [(7, 1.419), (14, 0.968), (21, 0.782), (28, 0.674), (42, 0.548), (60, 0.457)]
FIVE_PCT_SD = 0.583   # a 5% lift on a 7.0 baseline at SD 0.6, in SD units

def fig1():
    W, H = 920, 520
    L, R, T, B = 78, 34, 64, 74
    pw, ph = W - L - R, H - T - B
    x0, x1 = 5, 62
    y0, y1 = 0.35, 1.55

    def X(d): return L + (d - x0) / (x1 - x0) * pw
    def Y(v): return T + (y1 - v) / (y1 - y0) * ph

    # smooth curve through the MDE function: (t_a+t_b)*sqrt(2/n), evaluated densely
    pts = []
    for i in range(0, 241):
        n = x0 + (x1 - x0) * i / 240
        if n < 4: continue
        # t-values vary slowly; interpolate the constant from the anchor points
        k = 1.419 * math.sqrt(7 / 2.0)   # calibrate constant at n=7
        k2 = 0.457 * math.sqrt(60 / 2.0) # and at n=60
        w = (n - 7) / (60 - 7)
        const = k + (k2 - k) * max(0.0, min(1.0, w))
        pts.append((X(n), Y(const * math.sqrt(2.0 / n))))
    curve = 'M ' + ' L '.join(f'{x:.1f},{y:.1f}' for x, y in pts)

    g = []
    for v in (0.4, 0.6, 0.8, 1.0, 1.2, 1.4):
        g.append(f'<line x1="{L}" y1="{Y(v):.1f}" x2="{W-R}" y2="{Y(v):.1f}" stroke="{GRID}" stroke-width="1"/>')
        g.append(f'<text x="{L-12}" y="{Y(v)+4:.1f}" fill="{MUTED}" font-size="13" text-anchor="end" font-family="{FONT}">{v:.1f}</text>')
    for d in (7, 14, 21, 28, 38, 42, 60):
        g.append(f'<text x="{X(d):.1f}" y="{H-B+26}" fill="{MUTED}" font-size="13" text-anchor="middle" font-family="{FONT}">{d}</text>')

    marks = []
    # the invisible band: between what 14 days can see and the lift you declared
    marks.append(
        f'<rect x="{X(x0):.1f}" y="{Y(0.968):.1f}" width="{X(x1)-X(x0):.1f}" '
        f'height="{Y(FIVE_PCT_SD)-Y(0.968):.1f}" fill="{WARN}" opacity="0.10"/>')
    marks.append(f'<line x1="{L}" y1="{Y(FIVE_PCT_SD):.1f}" x2="{W-R}" y2="{Y(FIVE_PCT_SD):.1f}" '
                 f'stroke="{WARN}" stroke-width="2" stroke-dasharray="7 5"/>')
    marks.append(f'<text x="{W-R-6}" y="{Y(FIVE_PCT_SD)-12:.1f}" fill="{WARN}" font-size="14" '
                 f'text-anchor="end" font-weight="600" font-family="{FONT}">the 5% lift you declared = 0.58 SD</text>')

    # 14-day point
    marks.append(f'<line x1="{X(14):.1f}" y1="{Y(0.968):.1f}" x2="{X(14):.1f}" y2="{H-B}" stroke="{ACCENT}" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>')
    marks.append(f'<circle cx="{X(14):.1f}" cy="{Y(0.968):.1f}" r="7" fill="{ACCENT}"/>')
    marks.append(f'<text x="{X(14)+16:.1f}" y="{Y(0.968)-14:.1f}" fill="{ACCENT}" font-size="16" font-weight="700" font-family="{FONT}">14 days sees 0.97 SD</text>')
    marks.append(f'<text x="{X(14)+16:.1f}" y="{Y(0.968)+6:.1f}" fill="{MUTED}" font-size="13" font-family="{FONT}">= 8.3% of baseline, not 5%</text>')

    # 38-day point
    marks.append(f'<circle cx="{X(38):.1f}" cy="{Y(FIVE_PCT_SD):.1f}" r="6" fill="none" stroke="{FG}" stroke-width="2"/>')
    marks.append(f'<text x="{X(38):.1f}" y="{Y(FIVE_PCT_SD)+30:.1f}" fill="{FG}" font-size="14" text-anchor="middle" font-weight="600" font-family="{FONT}">38 days</text>')

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="100%" role="img" aria-labelledby="f1t f1d">
<title id="f1t">Minimum detectable effect by window length</title>
<desc id="f1d">A 14-day window can only detect a shift of 0.97 standard deviations, which is 8.3 percent of a 7.0 baseline. The 5 percent lift threshold declared in the config equals 0.58 standard deviations and is not reachable until roughly 38 days per window.</desc>
<rect width="{W}" height="{H}" fill="{INK}"/>
<text x="{L}" y="30" fill="{FG}" font-size="19" font-weight="700" font-family="{FONT}">What a 14-day window can actually see</text>
<text x="{L}" y="50" fill="{MUTED}" font-size="13" font-family="{FONT}">Minimum detectable effect · Welch&#8217;s t-test · &#945; = 0.10 · 80% power</text>
{''.join(g)}
<path d="{curve}" fill="none" stroke="{ACCENT}" stroke-width="2.5" stroke-linejoin="round"/>
{''.join(marks)}
<line x1="{L}" y1="{H-B}" x2="{W-R}" y2="{H-B}" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
<text x="{L+pw/2}" y="{H-14}" fill="{MUTED}" font-size="13" text-anchor="middle" font-family="{FONT}">days per window</text>
<text transform="translate(22,{T+ph/2}) rotate(-90)" fill="{MUTED}" font-size="13" text-anchor="middle" font-family="{FONT}">minimum detectable effect (SD)</text>
</svg>'''
    (OUT / 'fig1-mde-by-window.svg').write_text(svg)
    return svg

# ---------------------------------------------------------------- figure 2
# Animated: sampling distribution of the observed lift under a TRUE 5% effect,
# with the significance threshold. Shaded area right of threshold = power.
FRAMES = [
    # n, SE of difference, critical value in points, power %
    (7,  0.3207, 0.5715, 27.3),
    (14, 0.2268, 0.3869, 44.4),
    (21, 0.1852, 0.3119, 58.5),
    (28, 0.1604, 0.2685, 69.5),
    (38, 0.1376, 0.2293, 80.9),
    (60, 0.1095, 0.1816, 93.7),
]
TRUE = 0.35

def fig2():
    W, H = 920, 520
    L, R, T, B = 70, 34, 78, 78
    pw, ph = W - L - R, H - T - B
    xlo, xhi = -0.45, 1.05
    N = 160  # points per curve — identical across frames so SMIL can morph

    def X(v): return L + (v - xlo) / (xhi - xlo) * pw

    peak = 1.0 / (FRAMES[-1][1] * math.sqrt(2 * math.pi))  # tallest frame sets the scale
    def Y(d): return T + ph - (d / peak) * ph * 0.90

    curves, fills, shades, thr, labels, powers = [], [], [], [], [], []
    for n, se, crit, pw_pct in FRAMES:
        pts = []
        for i in range(N):
            v = xlo + (xhi - xlo) * i / (N - 1)
            d = math.exp(-0.5 * ((v - TRUE) / se) ** 2) / (se * math.sqrt(2 * math.pi))
            pts.append((X(v), Y(d)))
        curves.append('M ' + ' L '.join(f'{x:.1f},{y:.1f}' for x, y in pts))
        fills.append('M ' + ' L '.join(f'{x:.1f},{y:.1f}' for x, y in pts) +
                     f' L {X(xhi):.1f},{T+ph:.1f} L {X(xlo):.1f},{T+ph:.1f} Z')
        # shaded power region: same point count every frame, clipped at the threshold
        sp = []
        for i in range(N):
            v = xlo + (xhi - xlo) * i / (N - 1)
            vv = max(v, crit)
            d = math.exp(-0.5 * ((vv - TRUE) / se) ** 2) / (se * math.sqrt(2 * math.pi))
            sp.append((X(vv), Y(d)))
        shades.append('M ' + ' L '.join(f'{x:.1f},{y:.1f}' for x, y in sp) +
                      f' L {X(xhi):.1f},{T+ph:.1f} L {X(crit):.1f},{T+ph:.1f} Z')
        thr.append(f'{X(crit):.1f}')
        labels.append(f'{n}-day window')
        powers.append(f'{pw_pct:.0f}% power')

    dur = len(FRAMES) * 1.6
    keys = ';'.join(f'{i/(len(FRAMES)-1):.3f}' for i in range(len(FRAMES)))

    def anim(attr, vals, extra=''):
        return (f'<animate attributeName="{attr}" dur="{dur}s" repeatCount="indefinite" '
                f'calcMode="discrete" keyTimes="{keys}" values="{";".join(vals)}"{extra}/>')

    # SMIL cannot animate text content, so every frame gets its own <text>
    # and we cross-fade opacity on a discrete schedule.
    readout = []
    for i, (n, se, crit, pw_pct) in enumerate(FRAMES):
        vis = ['0'] * len(FRAMES)
        vis[i] = '1'
        a = (f'<animate attributeName="opacity" dur="{dur}s" repeatCount="indefinite" '
             f'calcMode="discrete" keyTimes="{keys}" values="{";".join(vis)}"/>')
        readout.append(
            f'<g opacity="{1 if i == 0 else 0}">{a}'
            f'<text x="{W-R}" y="{T+30}" fill="{FG}" font-size="24" font-weight="700" '
            f'text-anchor="end" font-family="{FONT}">{n}-day window</text>'
            f'<text x="{W-R}" y="{T+70}" fill="{ACCENT}" font-size="38" font-weight="700" '
            f'text-anchor="end" font-family="{FONT}">{pw_pct:.0f}% power</text>'
            f'</g>')
    readout = ''.join(readout)

    ticks = []
    for v in (-0.4, -0.2, 0.0, 0.2, 0.35, 0.6, 0.8, 1.0):
        lab = '0.35' if abs(v - 0.35) < 1e-9 else f'{v:.1f}'
        ticks.append(f'<text x="{X(v):.1f}" y="{T+ph+24:.1f}" fill="{MUTED}" font-size="12" '
                     f'text-anchor="middle" font-family="{FONT}">{lab}</text>')

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="100%" role="img" aria-labelledby="f2t f2d">
<title id="f2t">Power to detect a real 5% lift, by window length</title>
<desc id="f2d">Animated. The bell curve is the distribution of lifts you would observe if the instruction change truly improved the score by 5 percent. The vertical line is the significance threshold. The shaded area to its right is the share of runs that would be called significant. At a 14-day window that area is 44 percent; it does not pass 80 percent until roughly 38 days.</desc>
<rect width="{W}" height="{H}" fill="{INK}"/>
<text x="{L}" y="30" fill="{FG}" font-size="19" font-weight="700" font-family="{FONT}">If the edit truly works, how often does the gate notice?</text>
<text x="{L}" y="50" fill="{MUTED}" font-size="13" font-family="{FONT}">Sampling distribution of the observed lift, given a real +0.35 point (5%) effect</text>

<line x1="{X(TRUE):.1f}" y1="{T-4}" x2="{X(TRUE):.1f}" y2="{T+ph}" stroke="{FG}" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.55"/>
<text x="{X(TRUE)+8:.1f}" y="{T+8}" fill="{FG}" font-size="12" opacity="0.75" font-family="{FONT}">true effect</text>

<path fill="{ACCENT}" opacity="0.10" d="{fills[0]}">{anim('d', fills)}</path>
<path fill="{ACCENT}" opacity="0.55" d="{shades[0]}">{anim('d', shades)}</path>
<path fill="none" stroke="{ACCENT}" stroke-width="2.5" d="{curves[0]}">{anim('d', curves)}</path>

<line y1="{T-4}" y2="{T+ph}" stroke="{WARN}" stroke-width="2.5" x1="{thr[0]}" x2="{thr[0]}">
  {anim('x1', thr)}{anim('x2', thr)}
</line>
<text y="{T-12}" fill="{WARN}" font-size="12" font-weight="600" text-anchor="middle" x="{thr[0]}" font-family="{FONT}">significance threshold
  {anim('x', thr)}
</text>

<line x1="{L}" y1="{T+ph}" x2="{W-R}" y2="{T+ph}" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
{''.join(ticks)}
<text x="{L+pw/2}" y="{H-14}" fill="{MUTED}" font-size="13" text-anchor="middle" font-family="{FONT}">observed lift (rubric points)</text>

{readout}
</svg>'''
    return svg

# ---------------------------------------------------------------- figure 3
SENS = [(0.4, 5.5), (0.5, 6.9), (0.6, 8.3), (0.8, 11.1), (1.0, 13.8)]

def fig3():
    W, H = 920, 452
    L, R, T, B = 108, 120, 106, 60
    pw, ph = W - L - R, H - T - B
    xmax = 15.0
    def X(v): return L + v / xmax * pw
    rows, n = [], len(SENS)
    bh = ph / n * 0.52
    for i, (sd, pct) in enumerate(SENS):
        y = T + ph * (i + 0.5) / n - bh / 2
        col = ACCENT if pct <= 7 else WARN
        rows.append(f'<rect x="{L}" y="{y:.1f}" width="{X(pct)-L:.1f}" height="{bh:.1f}" rx="3" fill="{col}" opacity="{0.85 if pct>7 else 0.95}"/>')
        rows.append(f'<text x="{X(pct)+12:.1f}" y="{y+bh*0.72:.1f}" fill="{FG}" font-size="16" font-weight="700" font-family="{FONT}">{pct}%</text>')
        rows.append(f'<text x="{L-16}" y="{y+bh*0.72:.1f}" fill="{MUTED}" font-size="14" text-anchor="end" font-family="{FONT}">SD {sd}</text>')
    marker = (f'<line x1="{X(5):.1f}" y1="{T-10}" x2="{X(5):.1f}" y2="{T+ph+6}" stroke="{FG}" '
              f'stroke-width="2" stroke-dasharray="6 5" opacity="0.8"/>'
              f'<text x="{X(5):.1f}" y="{T-18}" fill="{FG}" font-size="13" text-anchor="middle" font-weight="600" font-family="{FONT}">what the config says: 5%</text>')
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="100%" role="img" aria-labelledby="f3t f3d">
<title id="f3t">What a 5% threshold actually means at a 14-day window</title>
<desc id="f3d">With a 14-day window, the smallest lift the gate can reliably detect rises with day-to-day variance: 5.5 percent at SD 0.4, 8.3 percent at SD 0.6, and 13.8 percent at SD 1.0. The declared 5 percent threshold binds in none of these cases.</desc>
<rect width="{W}" height="{H}" fill="{INK}"/>
<text x="{L-92}" y="30" fill="{FG}" font-size="19" font-weight="700" font-family="{FONT}">Your &#8220;5% threshold&#8221; at a 14-day window, by day-to-day variance</text>
<text x="{L-92}" y="50" fill="{MUTED}" font-size="13" font-family="{FONT}">Smallest lift the gate can actually detect at 80% power</text>
{marker}
{''.join(rows)}
<text x="{L-92}" y="{H-18}" fill="{MUTED}" font-size="13" font-family="{FONT}">The gap between the dashed line and the bar is the part hidden from whoever reads the config file.</text>
</svg>'''
    (OUT / 'fig3-effective-threshold.svg').write_text(svg)
    return svg

f1 = fig1()
f2 = fig2()
(OUT / 'fig2-power-by-window.svg').write_text(f2)
f3 = fig3()
print('wrote:', *[p.name for p in sorted(OUT.glob('*.svg'))])




# ---------------------------------------------------------------- OG card
# Type-led, no chart. Social cards are read at thumbnail size; one number
# beats a plot that turns to mush at 300px wide.
def og():
    W, H = 1200, 630
    L = 76
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<rect width="{W}" height="{H}" fill="{INK}"/>
<rect x="0" y="0" width="{W}" height="8" fill="{ACCENT}"/>
<text x="{L}" y="96" fill="{ACCENT}" font-size="18" font-weight="700" letter-spacing="3" font-family="{FONT}">FIELD NOTES</text>
<text x="{L}" y="176" fill="{FG}" font-size="50" font-weight="700" font-family="{FONT}">Statistical gating for</text>
<text x="{L}" y="234" fill="{FG}" font-size="50" font-weight="700" font-family="{FONT}">agent instruction changes</text>
<line x1="{L}" y1="278" x2="{L+120}" y2="278" stroke="{ACCENT}" stroke-width="4"/>
<text x="{L}" y="334" fill="rgba(244,244,245,0.65)" font-size="24" font-family="{FONT}">I required a t-test before any edit could stay.</text>
<text x="{L}" y="370" fill="rgba(244,244,245,0.65)" font-size="24" font-family="{FONT}">Then I ran the power calculation on my own gate.</text>
<text x="{L}" y="486" fill="{ACCENT}" font-size="92" font-weight="700" font-family="{FONT}">44%</text>
<text x="{L+240}" y="464" fill="{FG}" font-size="24" font-weight="600" font-family="{FONT}">power at a 14-day window</text>
<text x="{L+240}" y="498" fill="rgba(244,244,245,0.55)" font-size="21" font-family="{FONT}">to see a lift the config calls significant</text>
<text x="{L}" y="{H-40}" fill="{FG}" font-size="21" font-weight="700" font-family="{FONT}">Michael Kaminski</text>
<text x="{L+205}" y="{H-40}" fill="rgba(244,244,245,0.45)" font-size="21" font-family="{FONT}">michael-kaminski.io</text>
</svg>'''
    (OUT / 'og-statistical-gating.svg').write_text(svg)

    # qlmanage (the only SVG rasteriser on this machine) thumbnails onto a square
    # canvas and top-anchors the artwork, while sips can only crop from the centre.
    # So emit a 1200x1200 twin with the card centred; cropping that to 1200x630
    # lands exactly on the card. This file exists only to make the PNG.
    inner = svg.split('>', 1)[1].rsplit('</svg>', 1)[0]
    sq = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">'
          f'<rect width="1200" height="1200" fill="{INK}"/>'
          f'<g transform="translate(0,285)">{inner}</g></svg>')
    (OUT / '_og-square.svg').write_text(sq)
    print('wrote og-statistical-gating.svg + _og-square.svg')

og()
