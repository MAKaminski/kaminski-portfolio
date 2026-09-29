"""Render the LinkedIn video for "When Caching Meets Routing".

Silent 1080x1350 (4:5) H.264 MP4, ~46 s at 30 fps. LinkedIn autoplays muted, so
every point is carried by on-screen text. Every number is read from
research/when-caching-meets-routing/results.json, the same file the paper's
numbers.tex is generated from, so the video cannot drift from the paper. The one
illustrative scene (the cache lanes) is labelled as illustrative on screen.

Run: python3 scripts/make-paper-video.py [out.mp4]
Needs matplotlib, numpy and an ffmpeg binary (FFMPEG, imageio-ffmpeg, or PATH).
Fonts: Anton and Space Grotesk (the site's pair) if FONT_DIR has them, else DejaVu.
"""
import json, os, pathlib, shutil, subprocess, sys

import numpy as np
import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import FancyBboxPatch, Rectangle

ROOT = pathlib.Path(__file__).resolve().parent.parent
RES = json.loads((ROOT / 'research' / 'when-caching-meets-routing' / 'results.json').read_text())
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else \
    ROOT / 'releases' / '2026-09-29-when-caching-meets-routing' / 'when-caching-meets-routing.mp4'

W, H, FPS = 1080, 1350, 30
BG, INK, MUTED, DIM, ACCENT, WARN, GRID = '#060606', '#f4f4f5', '#9a9a9a', '#3a3a3a', '#fff500', '#ff5a4f', '#1c1c1c'

# ── fonts ──────────────────────────────────────────────────────────────────────
FONT_DIR = pathlib.Path(os.environ.get('FONT_DIR', ROOT / 'scripts' / 'fonts'))
for f in FONT_DIR.glob('*.ttf') if FONT_DIR.exists() else []:
    font_manager.fontManager.addfont(str(f))
_names = {f.name for f in font_manager.fontManager.ttflist}
HEAD = 'Anton' if 'Anton' in _names else 'DejaVu Sans'
BODY = 'Space Grotesk' if 'Space Grotesk' in _names else 'DejaVu Sans'

# ── numbers, all from results.json ────────────────────────────────────────────
HK, SN = RES['Opus 5.5|Haiku 4.5'], RES['Opus 5.5|Sonnet 5.5']
MC = RES['mc_summary']
pct = lambda x: f"{'−' if x < 0 else ''}{abs(100 * x):.1f}%"
N = dict(
    h_naive=HK['naive'], h_cache=HK['save_cache'], s_naive=SN['naive'], s_cache=SN['save_cache'],
    cache_disc=HK['cache_discount'], allF_nc=HK['allF_nocache'], allF_c=HK['allF_cache'],
    mc_naive=MC['naive_p50'], mc_sim=MC['p50'], mc_neg=MC['frac_negative'], mc_gap=MC['gap_p50'], mc_n=RES['mc_n'],
)
# Whole conversation on Haiku vs on Opus, same simulator (macros.py computes it the same way).
sys.path.insert(0, str(ROOT / 'research' / 'when-caching-meets-routing'))
from model import expected, BASE  # noqa: E402
_a = expected('Opus 5.5', 'Haiku 4.5', BASE, route=False)[0]
_h = expected('Haiku 4.5', 'Haiku 4.5', BASE, route=False)[0]
N['all_haiku'] = 1 - _h / _a

# ── helpers ────────────────────────────────────────────────────────────────────
clamp = lambda x: max(0.0, min(1.0, x))
ease = lambda x: (lambda c: c * c * (3 - 2 * c))(clamp(x))


def prog(t, a, b):
    """Eased 0..1 progress of t across [a, b]."""
    return ease((t - a) / (b - a)) if b > a else float(t >= a)


fig = plt.figure(figsize=(W / 100, H / 100), dpi=100)
ax = fig.add_axes([0, 0, 1, 1])


def reset():
    ax.clear()
    ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis('off')
    ax.add_patch(Rectangle((0, 0), W, H, color=BG, zorder=-10))


_fit_cache = {}


def fit(s, size, font, weight, maxw):
    """Largest size <= `size` at which `s` renders no wider than `maxw` px. Measured, never guessed."""
    key = (s, size, font, weight, maxw)
    if key not in _fit_cache:
        r = fig.canvas.get_renderer()
        sz = size
        while sz > 8:
            t = ax.text(0, 0, s, fontsize=sz, family=font, fontweight=weight)
            wpx = t.get_window_extent(renderer=r).width
            t.remove()
            if wpx <= maxw:
                break
            sz -= 1
        _fit_cache[key] = sz
    return _fit_cache[key]


def text(x, y, s, size, color=INK, alpha=1.0, font=None, ha='left', va='baseline', weight='normal', maxw=None, **kw):
    """Draw text. `maxw` defaults to the space left inside the 72 px side margins for this anchor."""
    if alpha <= 0.01:
        return
    font = font or BODY
    s = s.replace('$', r'\$')
    if maxw is None:
        maxw = {'left': W - 72 - x, 'right': x - 72, 'center': 2 * min(x - 72, W - 72 - x)}[ha]
    size = fit(s, size, font, weight, maxw)
    ax.text(x, y, s, fontsize=size, color=color, alpha=alpha, family=font, ha=ha, va=va,
            fontweight=weight, **kw)


def card(x, y, w, h, alpha=1.0, edge=DIM, face='#0e0e0e'):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0,rounding_size=22', lw=2,
                                edgecolor=edge, facecolor=face, alpha=alpha))


def footer(a):
    text(72, 56, 'WHEN CACHING MEETS ROUTING', 18, MUTED, a, HEAD)
    text(W - 72, 56, 'michael-kaminski.io/papers', 18, MUTED, a, ha='right')
    ax.add_patch(Rectangle((72, 92), W - 144, 2, color=GRID, alpha=a))


def kicker(y, s, a):
    ax.add_patch(Rectangle((72, y - 6), 10, 40, color=ACCENT, alpha=a))
    text(100, y, s, 20, ACCENT, a, HEAD)


# ── scenes: (start, end, draw(t_local, alpha)) ────────────────────────────────
def s_title(t, a):
    p = prog(t, 0.2, 1.4)
    ax.add_patch(Rectangle((72, 520), 12, 680 * p, color=ACCENT, alpha=a))
    text(112, 1150, 'NEW WHITE PAPER', 30, ACCENT, a * prog(t, 0.3, 1.0), HEAD)
    for i, line in enumerate(['WHEN', 'CACHING', 'MEETS', 'ROUTING']):
        q = prog(t, 0.5 + 0.18 * i, 1.2 + 0.18 * i)
        text(112 - 30 * (1 - q), 990 - 150 * i, line, 104, ACCENT if line == 'ROUTING' else INK, a * q, HEAD)
    text(112, 420, 'A cache-aware cost model for routing', 30, MUTED, a * prog(t, 1.8, 2.6))
    text(112, 375, 'multi-turn voice agents between frontier', 30, MUTED, a * prog(t, 1.8, 2.6))
    text(112, 330, 'and smaller models.', 30, MUTED, a * prog(t, 1.8, 2.6))
    text(112, 230, 'Michael Kaminski  ·  2026-09-28', 26, INK, a * prog(t, 2.2, 3.0), weight='bold')


def s_claim(t, a):
    kicker(1160, 'THE CLAIM', a)
    text(72, 1060, 'Route easy turns to a cheaper model.', 38, INK, a * prog(t, 0.2, 0.9))
    text(72, 1005, 'Published results report cost cuts of', 38, INK, a * prog(t, 0.4, 1.1))
    lo, hi = 35 * prog(t, 0.9, 2.2), 98 * prog(t, 0.9, 2.6)
    text(W / 2, 700, f'{lo:.0f}–{hi:.0f}%', 190, ACCENT, a * prog(t, 0.8, 1.2), HEAD, ha='center')
    q = prog(t, 3.0, 3.8)
    text(72, 470, 'Measured on single-turn benchmarks,', 34, MUTED, a * q)
    text(72, 420, 'priced at list rates.', 34, MUTED, a * q)
    q2 = prog(t, 4.0, 4.8)
    text(72, 300, 'A voice agent is neither.', 46, INK, a * q2, weight='bold')


def s_mech(t, a):
    kicker(1160, 'WHY: CACHES ARE PER MODEL', a)
    text(72, 1085, 'Every turn re-sends the prompt and transcript.', 32, INK, a * prog(t, 0.2, 0.9))
    text(72, 1040, 'Caching bills that at 5–10% of input price,', 32, INK, a * prog(t, 0.3, 1.0))
    text(72, 995, 'but only on the model that wrote it.', 32, ACCENT, a * prog(t, 0.3, 1.0), weight='bold')

    # Illustrative 12-turn conversation (baseline sizes: 6,000-token prefix, ~290 tokens/turn).
    route = 'OHHOHHHOOHHH'
    S, d, T = 6000, 290, 12
    x0, x1 = 170, 1008
    L = lambda k: S + k * d
    sx = lambda v: x0 + (x1 - x0) * v / L(T)
    cur = (t - 1.2) / 0.45  # turns advanced
    # turn strip
    y_turn = 870
    text(72, y_turn + 8, 'Turn', 20, MUTED, a)
    bw = (x1 - x0) / T
    for k, m in enumerate(route):
        on = cur >= k
        col = ACCENT if m == 'O' else '#8a8a8a'
        ax.add_patch(FancyBboxPatch((x0 + k * bw + 4, y_turn - 10), bw - 8, 44, boxstyle='round,pad=0,rounding_size=8',
                                    facecolor=col if on else '#141414', edgecolor=DIM, lw=1.5, alpha=a))
        text(x0 + k * bw + bw / 2, y_turn + 4, 'O' if m == 'O' else 'H', 18, BG if on else DIM, a, HEAD, ha='center')
    # cache lanes
    lanes = {'O': (720, 'Opus 5.5 cache'), 'H': (600, 'Haiku 4.5 cache')}
    for m, (y, lab) in lanes.items():
        text(72, y + 60, lab, 22, INK, a)
        ax.add_patch(Rectangle((x0, y), x1 - x0, 36, color='#121212', alpha=a))
    last = {'O': None, 'H': None}
    rewrites = 0
    for k, m in enumerate(route):
        if cur < k:
            break
        y = lanes[m][0]
        start = 0 if last[m] is None else L(last[m])
        seg_end = L(k)
        grow = clamp(cur - k) if cur < k + 1 else 1.0
        e = start + (seg_end - start) * grow
        if last[m] is None:
            col = '#6b6b6b' if m == 'O' else WARN   # Opus writes the prefix once either way; Haiku's is extra
        elif k - last[m] == 1:
            col = ACCENT if m == 'O' else '#bdbdbd'
        else:
            col = WARN
        if col == WARN:
            rewrites += (e - start)
        ax.add_patch(Rectangle((sx(start), y), sx(e) - sx(start), 36, color=col, alpha=a, lw=0))
        last[m] = k
    # legend + callout
    ly = 510
    ax.add_patch(Rectangle((72, ly), 26, 26, color=WARN, alpha=a))
    text(112, ly + 4, 'Written again at 1.25× input price', 24, INK, a)
    ax.add_patch(Rectangle((72, ly - 48), 26, 26, color=ACCENT, alpha=a))
    text(112, ly - 44, 'New tokens only: the cheap path', 24, INK, a)
    q = prog(t, 7.0, 7.8)
    text(72, 340, 'Switch models turn by turn and you', 40, INK, a * q, weight='bold')
    text(72, 290, 'keep paying to re-write the transcript.', 40, INK, a * q, weight='bold')
    text(72, 205, 'Illustrative turn sequence at the paper\'s baseline sizes.', 22, MUTED, a * q)
    text(72, 172, 'The paper calls it cache fragmentation.', 22, MUTED, a * q)


def s_bars(t, a):
    kicker(1160, 'THE RESULT, AT BASELINE', a)
    text(72, 1085, '12 turns · 6,000-token cached prompt · 20% hard turns', 24, MUTED, a * prog(t, 0.1, 0.7))
    zero, sc = 420, 7.0    # x of 0%, px per point
    rows = [
        (900, 'Opus 5.5 → Haiku 4.5, per turn', N['h_naive'], N['h_cache'], 0.4),
        (560, 'Opus 5.5 → Sonnet 5.5, per turn', N['s_naive'], N['s_cache'], 3.2),
    ]
    for y, lab, nv, cv, t0 in rows:
        text(72, y + 70, lab, 30, INK, a * prog(t, t0, t0 + 0.5), weight='bold')
        pn, pc = prog(t, t0 + 0.4, t0 + 1.3), prog(t, t0 + 1.3, t0 + 2.4)
        # naive
        text(72, y + 8, 'List prices', 24, MUTED, a * prog(t, t0 + 0.3, t0 + 0.8), maxw=zero - 72 - 120)
        ax.add_patch(Rectangle((zero, y - 4), 100 * nv * sc * pn, 44, color='#5a5a5a', alpha=a))
        text(zero + 100 * nv * sc * pn + 14, y + 8, pct(nv * pn) + ' saved', 26, INK, a * pn)
        # cache-aware
        yc = y - 80
        text(72, yc + 8, 'With caching', 24, INK, a * prog(t, t0 + 1.2, t0 + 1.6), maxw=zero - 72 - 120)
        wv = 100 * cv * sc * pc
        col = WARN if cv < 0 else ACCENT
        ax.add_patch(Rectangle((zero if wv >= 0 else zero + wv, yc - 4), abs(wv), 44, color=col, alpha=a))
        lbl = pct(cv * pc) + (' saved' if cv >= 0 else ': costs more')
        text((zero + wv + 14) if wv >= 0 else zero + 14, yc + 8, lbl, 26, col, a * pc, weight='bold')
        ax.plot([zero, zero], [yc - 20, y + 56], color=DIM, lw=2, alpha=a * prog(t, t0, t0 + 0.5))
    q = prog(t, 6.2, 7.0)
    text(72, 300, f'Sonnet 5.5 reads its cache at the same $0.20/MTok', 28, INK, a * q)
    text(72, 258, f'as Opus 5.5, so the re-writes cost more than the', 28, INK, a * q)
    text(72, 216, f'cheaper output saves.', 28, INK, a * q)


def s_curve(t, a):
    kicker(1160, 'ACROSS THE PARAMETER SPACE', a)
    c = RES['curves']['Opus 5.5|Haiku 4.5']
    pi = np.array(c['pi']) * 100
    nv, cv = np.array(c['naive']) * 100, np.array(c['cache']) * 100
    X0, X1, Y0, Y1 = 170, 1000, 520, 1020
    ymin, ymax = -10, 65
    fx = lambda v: X0 + (X1 - X0) * (v - pi[0]) / (pi[-1] - pi[0])
    fy = lambda v: Y0 + (Y1 - Y0) * (v - ymin) / (ymax - ymin)
    for g in [0, 20, 40, 60]:
        ax.plot([X0, X1], [fy(g), fy(g)], color=GRID if g else DIM, lw=1.5, alpha=a)
        text(X0 - 16, fy(g) - 7, f'{g}%', 18, MUTED, a, ha='right')
    for g in [10, 30, 50]:
        text(fx(g), Y0 - 40, f'{g}%', 18, MUTED, a, ha='center')
    text((X0 + X1) / 2, Y0 - 78, 'share of turns that need the frontier model', 20, MUTED, a, ha='center')
    text(72, 1085, 'Savings, Opus 5.5 → Haiku 4.5', 30, INK, a, weight='bold')
    p = prog(t, 0.4, 3.0)
    n = max(2, int(round(p * (len(pi) - 1))) + 1)
    frac = p * (len(pi) - 1) - (n - 2)
    def partial(ys):
        xs_, ys_ = [fx(v) for v in pi[:n]], list(map(fy, ys[:n]))
        if n < len(pi) and n >= 2:
            xs_[-1] = fx(pi[n - 2] + (pi[n - 1] - pi[n - 2]) * frac); ys_[-1] = fy(ys[n - 2] + (ys[n - 1] - ys[n - 2]) * frac)
        return xs_, ys_
    xs, ys = partial(nv); ax.plot(xs, ys, color='#8a8a8a', lw=4, ls=(0, (6, 5)), alpha=a)
    xs, ys = partial(cv); ax.plot(xs, ys, color=ACCENT, lw=6, alpha=a, solid_capstyle='round')
    lp = prog(t, 2.6, 3.2)
    text(fx(pi[4]), fy(nv[4]) + 34, 'List-price estimate', 26, '#bdbdbd', a * lp)
    text(fx(pi[0]) + 10, fy(cv[0]) + 34, 'Cache-aware simulation', 26, ACCENT, a * lp, weight='bold')
    q = prog(t, 3.4, 4.2)
    text(72, 330, f"{N['mc_n']} random scenarios. Median savings:", 30, INK, a * q)
    text(72, 280, f"{pct(N['mc_naive'])} predicted, {pct(N['mc_sim'])} simulated.", 30, INK, a * q, weight='bold')
    text(72, 218, f"Routing loses money in {pct(N['mc_neg'])} of them.", 30, WARN, a * prog(t, 4.2, 5.0))


def s_rules(t, a):
    kicker(1160, 'WHAT TO DO INSTEAD', a)
    rules = [
        ('1', 'Cache first, route second.',
         f"Caching alone cut an all-Opus conversation {pct(N['cache_disc'])}:", f"${N['allF_nc']:.4f} → ${N['allF_c']:.4f}."),
        ('2', 'Compare effective prices.',
         'Blend cache-read, cache-write and output prices', 'by your token mix. List ratios mislead.'),
        ('3', 'Route at the granularity of the cache.',
         f"A whole conversation on Haiku 4.5 costs {pct(N['all_haiku'])} less.", 'Per-turn switching gives most of it back.'),
    ]
    for i, (num, head, l1, l2) in enumerate(rules):
        q = prog(t, 0.3 + 1.1 * i, 1.0 + 1.1 * i)
        y = 870 - 250 * i
        card(72, y - 70 + 20 * (1 - q), W - 144, 210, a * q)
        text(112, y + 70, num, 64, ACCENT, a * q, HEAD, va='center')
        text(190, y + 88, head, 32, INK, a * q, weight='bold', va='center', maxw=W - 144 - 150)
        text(190, y + 30, l1, 25, MUTED, a * q, va='center', maxw=W - 144 - 150)
        text(190, y - 8, l2, 25, MUTED, a * q, va='center', maxw=W - 144 - 150)


def s_cta(t, a):
    p = prog(t, 0.1, 0.9)
    ax.add_patch(Rectangle((72, 600), 12, 450 * p, color=ACCENT, alpha=a))
    text(112, 990, 'READ THE PAPER', 30, ACCENT, a * p, HEAD)
    text(112, 870, 'When Caching', 88, INK, a * prog(t, 0.3, 1.0), HEAD)
    text(112, 745, 'Meets Routing', 88, INK, a * prog(t, 0.4, 1.1), HEAD)
    text(112, 660, '6 pages, with the model and LaTeX source.', 26, MUTED, a * prog(t, 0.8, 1.5))
    text(112, 622, 'Rerun it on your own traces.', 26, MUTED, a * prog(t, 0.8, 1.5))
    q = prog(t, 1.2, 1.9)
    ax.add_patch(FancyBboxPatch((112, 470), W - 224, 110, boxstyle='round,pad=0,rounding_size=55',
                                facecolor=ACCENT, edgecolor='none', alpha=a * q))
    text(W / 2, 512, 'michael-kaminski.io/papers', 40, BG, a * q, weight='bold', ha='center')
    text(112, 340, 'A simulation with stated assumptions, not a measurement.', 22, MUTED, a * prog(t, 1.8, 2.5))
    text(112, 305, 'Public prices retrieved 2026-09-28. No employer data.', 22, MUTED, a * prog(t, 1.8, 2.5))
    text(112, 190, 'Michael Kaminski', 26, INK, a * prog(t, 2.0, 2.7), weight='bold')


SCENES = [(0.0, 4.5, s_title), (4.5, 10.5, s_claim), (10.5, 20.5, s_mech), (20.5, 29.5, s_bars),
          (29.5, 36.0, s_curve), (36.0, 42.0, s_rules), (42.0, 47.0, s_cta)]
FADE_IN, FADE_OUT = 0.45, 0.35
DURATION = SCENES[-1][1]


def draw(t):
    reset()
    for i, (a0, a1, fn) in enumerate(SCENES):
        if a0 <= t < a1 or (i == len(SCENES) - 1 and t >= a1 - 1e-9):
            lt = t - a0
            alpha = min(clamp(lt / FADE_IN) if i else 1.0,
                        clamp((a1 - t) / FADE_OUT) if i < len(SCENES) - 1 else 1.0)
            fn(lt, alpha)
            if 0 < i < len(SCENES) - 1:
                footer(alpha)
            break


def ffmpeg_exe():
    if os.environ.get('FFMPEG'):
        return os.environ['FFMPEG']
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return shutil.which('ffmpeg') or sys.exit('ffmpeg not found: set FFMPEG or pip install imageio-ffmpeg')


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    frames = int(round(DURATION * FPS))
    cmd = [ffmpeg_exe(), '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{W}x{H}',
           '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p',
           '-profile:v', 'high', '-movflags', '+faststart', str(OUT)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for f in range(frames):
        draw(f / FPS)
        fig.canvas.draw()
        proc.stdin.write(fig.canvas.buffer_rgba().tobytes())
    proc.stdin.close()
    if proc.wait():
        sys.exit('ffmpeg failed')
    # A poster frame per scene, for review and as the LinkedIn thumbnail candidate.
    for i, (a0, a1, _) in enumerate(SCENES):
        draw(a1 - FADE_OUT - 0.05 if i < len(SCENES) - 1 else a1 - 0.01)
        fig.savefig(OUT.with_name(f'frame-{i + 1}.png'), dpi=100, facecolor=BG)
    print(f'{OUT}: {frames} frames, {DURATION:.0f} s, {OUT.stat().st_size / 1e6:.1f} MB; fonts {HEAD} / {BODY}')


if __name__ == '__main__':
    main()
