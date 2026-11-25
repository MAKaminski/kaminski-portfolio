"""Figures for the 2026-11-15 (goodwill-mcp) and 2026-11-22 (undo window) essays.

Pure stdlib, same palette as make-essay-figures.py. Every number is hardcoded
from the essay it illustrates so the figure cannot drift from the prose.
"""
import pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'images' / 'essays'
OUT.mkdir(parents=True, exist_ok=True)

INK = '#060606'
ACCENT = '#fff500'
FG = '#f4f4f5'
MUTED = 'rgba(244,244,245,0.55)'
GRID = 'rgba(255,255,255,0.10)'
WARN = '#ff6b6b'
BAR = 'rgba(244,244,245,0.28)'
FONT = "'Space Grotesk',Inter,system-ui,sans-serif"
W, H = 920, 520


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def text(x, y, s, size=13, fill=MUTED, anchor='start', weight='400'):
    return (f'<text x="{x:.1f}" y="{y:.1f}" fill="{fill}" font-size="{size}" text-anchor="{anchor}" '
            f'font-weight="{weight}" font-family="{FONT}">{esc(s)}</text>')


def wrap(title, sub, body, desc):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="{esc(desc)}">'
            f'<rect width="{W}" height="{H}" fill="{INK}"/>'
            + text(40, 40, title, 20, FG, weight='700') + text(40, 62, sub, 13)
            + ''.join(body) + '</svg>')


def vbars(name, title, sub, desc, bars, ymax, ticks, lines, unit_fmt):
    """bars: [(label, sublabel, [(value, fill)], top_label)]; lines: [(value, label, color)]"""
    L, R, T, B = 78, 40, 96, 84
    pw, ph = W - L - R, H - T - B
    Y = lambda v: T + (ymax - v) / ymax * ph
    g = []
    for v in ticks:
        g.append(f'<line x1="{L}" y1="{Y(v):.1f}" x2="{W-R}" y2="{Y(v):.1f}" stroke="{GRID}"/>')
        g.append(text(L - 12, Y(v) + 4, unit_fmt(v), anchor='end'))
    slot = pw / len(bars)
    bw = slot * 0.46
    for i, (label, sublabel, parts, top) in enumerate(bars):
        cx = L + slot * (i + 0.5)
        base = 0
        for value, fill in parts:
            g.append(f'<rect x="{cx-bw/2:.1f}" y="{Y(base+value):.1f}" width="{bw:.1f}" '
                     f'height="{Y(base)-Y(base+value):.1f}" fill="{fill}" rx="3"/>')
            base += value
        g.append(text(cx, Y(base) - 10, top, 17, FG, 'middle', '700'))
        g.append(text(cx, H - B + 26, label, 14, FG, 'middle', '600'))
        g.append(text(cx, H - B + 46, sublabel, 12, MUTED, 'middle'))
    for value, label, color in lines:
        g.append(f'<line x1="{L}" y1="{Y(value):.1f}" x2="{W-R}" y2="{Y(value):.1f}" stroke="{color}" '
                 f'stroke-width="2" stroke-dasharray="7 5"/>')
        # label on an ink plate so a bar behind it never cuts through the words
        lw = len(label) * 7.4 + 14
        g.append(f'<rect x="{W-R-lw:.1f}" y="{Y(value)-25:.1f}" width="{lw:.1f}" height="20" fill="{INK}" fill-opacity="0.88" rx="3"/>')
        g.append(text(W - R - 7, Y(value) - 10, label, 13, color, 'end', '600'))
    (OUT / name).write_text(wrap(title, sub, g, desc))


def hbars(name, title, sub, desc, rows, foot):
    """rows: [(label, measured, budget, measured_label, budget_label)] drawn as share of budget."""
    L, R, T = 250, 60, 110
    pw = W - L - R
    g = []
    rh = 92
    for i, (label, measured, budget, ml, bl) in enumerate(rows):
        y = T + i * rh
        g.append(text(L - 16, y + 22, label, 14, FG, 'end', '600'))
        g.append(f'<rect x="{L}" y="{y}" width="{pw}" height="34" fill="{BAR}" rx="3"/>')
        g.append(f'<rect x="{L}" y="{y}" width="{max(3.0, pw*measured/budget):.1f}" height="34" fill="{ACCENT}" rx="3"/>')
        g.append(text(L + max(3.0, pw * measured / budget) + 10, y + 22, ml, 14, FG, weight='700'))
        g.append(text(L + pw, y + 54, bl, 12, MUTED, 'end'))
        g.append(text(L, y + 54, f'{measured/budget*100:.0f}% of budget', 12, MUTED))
    g.append(text(40, H - 28, foot, 12))
    (OUT / name).write_text(wrap(title, sub, g, desc))


def timeline(name, title, sub, desc):
    L, R = 60, 60
    pw = W - L - R
    tmax = 330.0
    X = lambda t: L + t / tmax * pw
    g = []
    y = 210
    g.append(f'<rect x="{X(0):.1f}" y="{y}" width="{X(310)-X(0):.1f}" height="46" fill="{BAR}" rx="3"/>')
    g.append(f'<rect x="{X(0):.1f}" y="{y}" width="{X(10)-X(0):.1f}" height="46" fill="{ACCENT}" rx="3"/>')
    g.append(f'<rect x="{X(310):.1f}" y="{y}" width="{X(tmax)-X(310):.1f}" height="46" fill="none" stroke="{GRID}" stroke-dasharray="5 4" rx="3"/>')
    for t, lab in ((10, '10 s'), (60, '1 min'), (120, '2 min'), (180, '3 min'), (240, '4 min'), (310, '5 min 10 s')):
        g.append(f'<line x1="{X(t):.1f}" y1="{y+46}" x2="{X(t):.1f}" y2="{y+56}" stroke="{MUTED}"/>')
        g.append(text(X(t), y + 74, lab, 12, MUTED, 'middle'))
    g.append(text(X(0), y - 44, 'Approve (a query: compute is awake)', 13, FG, weight='600'))
    g.append(f'<line x1="{X(0):.1f}" y1="{y-36}" x2="{X(0):.1f}" y2="{y}" stroke="{FG}"/>')
    g.append(text(X(10) + 6, y - 14, 'Timer fires, commit runs', 13, ACCENT, weight='600'))
    g.append(f'<line x1="{X(10):.1f}" y1="{y-8}" x2="{X(10):.1f}" y2="{y}" stroke="{ACCENT}"/>')
    g.append(text(X(160), y + 29, 'Awake anyway: 5 minutes after the last query', 13, FG, 'middle'))
    g.append(text(X(320), y + 29, 'asleep', 12, MUTED, 'middle'))
    g.append(text(40, 360, 'Undo window: 10 s of a 300 s idle timeout the compute pays regardless.', 14, FG))
    g.append(text(40, 384, 'A 1 s poll never lets the right-hand box happen: 730 h awake x 0.25 CU = 182.5 CU-hours a month.', 14, MUTED))
    g.append(f'<rect x="40" y="420" width="14" height="14" fill="{ACCENT}" rx="2"/>' + text(62, 432, 'undo window'))
    g.append(f'<rect x="170" y="420" width="14" height="14" fill="{BAR}" rx="2"/>' + text(192, 432, "Neon's idle timeout (Free plan, fixed)"))
    (OUT / name).write_text(wrap(title, sub, g, desc))


def main():
    vbars('goodwill-fig1-basis.svg',
          'Same 450 blouses, one flag',
          'Logged value by basis (low / mid / high of the published guide range). goodwill-mcp v0.1.0, run 2026-11-15.',
          'Bar chart. 450 blouses log at 900 dollars on low, 3,150 on mid and 5,400 on high. The 5,000 dollar appraisal line sits between mid and high.',
          [('basis: low', '$2 each', [(900, BAR)], '$900'),
           ('basis: mid', '$7 each (prompt default)', [(3150, ACCENT)], '$3,150'),
           ('basis: high', '$12 each', [(5400, WARN)], '$5,400')],
          6000, (0, 1000, 2000, 3000, 4000, 5000, 6000),
          [(5000, 'Qualified appraisal required above $5,000', WARN),
           (500, 'Form 8283 required above $500', MUTED)],
          lambda v: f'${v:,.0f}')
    hbars('goodwill-fig2-budgets.svg',
          'The deterministic half, measured against its budget',
          'Measured 2026-11-15 from a fresh clone. Budgets were set in the proposal before the code existed.',
          'Bar chart of measured latency as a share of budget. donation_create first call 17 ms of 50, warm call 2 ms of 50, CLI help 149 ms of 300.',
          [('donation_create, first call', 17, 50, '17 ms', 'budget 50 ms p95'),
           ('donation_create, warm', 2, 50, '2 ms', 'budget 50 ms p95'),
           ('CLI --help (median of 7)', 149, 300, '149 ms', 'budget 300 ms')],
          'For scale: the proposal estimates 18 s end to end for the model half. That bar would be 360x the widest budget shown.')
    vbars('undo-fig1-cu-hours.svg',
          'What it costs to wait: Neon Free, CU-hours per month',
          'Same 10-second undo window, two ways to wait. 0.25 CU compute, 730 hours in a month.',
          'Bar chart. A one-second poll uses 182.5 CU-hours a month. Timers use about 25: 15 for the hourly pull and 10 for real usage. The Free plan allowance is 100.',
          [('1 s poll', 'never sleeps', [(182.5, WARN)], '182.5'),
           ('Timers', '15 hourly pull + ~10 usage (est.)', [(15, BAR), (10, ACCENT)], '~25'),
           ('Timers, pull off', 'usage only (est.)', [(10, ACCENT)], '~10')],
          200, (0, 50, 100, 150, 200),
          [(100, 'Free plan allowance: 100 CU-hours / project / month', FG)],
          lambda v: f'{v:.0f}')
    timeline('undo-fig2-awake-window.svg',
             'Why the undo window is free',
             'One approval on a scale-to-zero database. Time since the reviewer clicked approve.',
             'Timeline. The approve at zero seconds wakes the compute. The commit fires at ten seconds. The compute stays awake until five minutes after the last query either way, then sleeps.')
    for f in ('goodwill-fig1-basis.svg', 'goodwill-fig2-budgets.svg', 'undo-fig1-cu-hours.svg', 'undo-fig2-awake-window.svg'):
        print(f, (OUT / f).stat().st_size)


if __name__ == '__main__':
    main()
