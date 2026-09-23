"""Build the white papers under public/docs/papers/ and their cards under public/images/papers/.

Each paper is one HTML body in scripts/papers/<slug>.html plus figures drawn here
with matplotlib. The PDF is printed by headless Chromium so the typography is the
same engine the site renders in. Every number in a figure is hardcoded from the
source it cites, so a figure cannot drift from the prose.

Run: CHROME_PATH=/path/to/chrome python3 scripts/make-papers.py [slug ...]
"""
import json, os, pathlib, subprocess, sys, re, shutil, tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'scripts' / 'papers'
PDF_OUT = ROOT / 'public' / 'docs' / 'papers'
IMG_OUT = ROOT / 'public' / 'images' / 'papers'
PDF_OUT.mkdir(parents=True, exist_ok=True)
IMG_OUT.mkdir(parents=True, exist_ok=True)

CHROME = os.environ.get('CHROME_PATH') or shutil.which('chromium') or shutil.which('google-chrome') \
    or '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

INK = '#111111'
MUTED = '#6b6b6b'
GRID = '#e6e6e6'
ACCENT = '#c9a800'   # the site's #fff500, darkened for paper
ACCENT2 = '#2b2b2b'
WARN = '#c0392b'

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

plt.rcParams.update({
    'font.family': 'DejaVu Sans',
    'font.size': 10,
    'axes.edgecolor': GRID,
    'axes.labelcolor': INK,
    'xtick.color': MUTED,
    'ytick.color': MUTED,
    'axes.spines.top': False,
    'axes.spines.right': False,
    'figure.dpi': 200,
})


def save(fig, name):
    p = IMG_OUT / name
    fig.savefig(p, bbox_inches='tight', facecolor='white')
    plt.close(fig)
    return p


# ── Paper 1: sites that differ by data, not code ─────────────────────────────
def fig_time_budget():
    # ADR-0010 time budget. Measured vs estimated. Critical path = max(harvest+write, images) + build + bundle + deploy.
    steps = [
        ('Validate intake', 0.1, 0.1, 'measured'),
        ('Harvest client site', 20, 40, 'estimate'),
        ('Write site.json', 60, 120, 'estimate'),
        ('Generate 9 images', 165, 165, 'measured'),
        ('Build + bundle', 6, 6, 'measured'),
        ('Provision + deploy', 30, 90, 'estimate'),
    ]
    fig, ax = plt.subplots(figsize=(7.2, 3.2))
    y = list(range(len(steps)))[::-1]
    for yi, (label, lo, hi, kind) in zip(y, steps):
        color = ACCENT2 if kind == 'measured' else ACCENT
        ax.barh(yi, lo, color=color, height=0.55)
        if hi > lo:
            ax.barh(yi, hi - lo, left=lo, color=color, alpha=0.35, height=0.55)
        ax.text(hi + 4, yi, f'{lo:g}–{hi:g} s' if hi > lo else f'{lo:g} s', va='center', fontsize=9, color=INK)
    ax.set_yticks(y)
    ax.set_yticklabels([s[0] for s in steps])
    ax.set_xlim(0, 210)
    ax.set_xlabel('seconds')
    ax.axvline(300, color=WARN, lw=1, ls='--')
    ax.text(200, 5.35, 'measured', color=ACCENT2, fontsize=9, ha='right')
    ax.text(200, 4.85, 'estimate (range)', color=ACCENT, fontsize=9, ha='right')
    ax.set_title('The five-minute contract, step by step (ADR-0010, 2026-09-21)', loc='left', fontsize=11, color=INK)
    return save(fig, 'fig-time-budget.png')


def fig_parity():
    fig, axes = plt.subplots(1, 2, figsize=(7.2, 3.0))
    ax = axes[0]
    labels = ['First launched site', 'Reference site', 'Rewritten fixtures']
    vals = [1613, 7722, 11000]
    colors = [WARN, MUTED, ACCENT2]
    ax.bar(labels, vals, color=colors, width=0.6)
    for i, v in enumerate(vals):
        ax.text(i, v + 250, f'{v:,}' if i < 2 else '10–12k', ha='center', fontsize=9, color=INK)
    ax.set_ylim(0, 13500)
    ax.set_ylabel('words on the site')
    ax.set_title('Content depth', loc='left', fontsize=11, color=INK)
    ax.tick_params(axis='x', labelsize=8)
    ax = axes[1]
    labels = ['Reference site', 'Rewritten fixtures']
    vals = [75.9, 92]
    ax.bar(labels, vals, color=[MUTED, ACCENT2], width=0.55)
    for i, v in enumerate(vals):
        ax.text(i, v + 1.5, f'{v:g}' if i == 0 else '92+', ha='center', fontsize=9, color=INK)
    ax.set_ylim(0, 105)
    ax.set_ylabel('seo-score, overall')
    ax.set_title('Search and AI readiness score', loc='left', fontsize=11, color=INK)
    ax.tick_params(axis='x', labelsize=8)
    fig.suptitle('Measured against West End Lighting, 2026-09-21', x=0.01, ha='left', fontsize=9, color=MUTED, y=0.02)
    return save(fig, 'fig-parity.png')


# ── Paper 2: one database, many connectors ───────────────────────────────────
def fig_query_string():
    # 24-char Apollo ids in an .in("id", [...]) filter: bytes grow with the board.
    import numpy as np
    n = np.arange(0, 3001, 50)
    kb = n * 25 / 1024  # 24 chars + separator
    fig, ax = plt.subplots(figsize=(7.2, 2.9))
    ax.plot(n, kb, color=ACCENT2, lw=2)
    ax.axvline(2493, color=WARN, lw=1, ls='--')
    ax.text(2493 - 40, 8, '2,493 accounts on the board\n≈ 62 KB → PostgREST answers 400', ha='right', fontsize=9, color=WARN)
    ax.set_xlabel('accounts on the pipeline board')
    ax.set_ylabel('query string, KB')
    ax.set_title('A filter that grows with the pipeline (TM-OS #65, 2026-09-18)', loc='left', fontsize=11, color=INK)
    return save(fig, 'fig-query-string.png')


def fig_identity():
    fig, ax = plt.subplots(figsize=(7.2, 2.6))
    labels = ['Jobs with a lead source\n(0 of 585)', 'Customers with a phone', 'Customers with an email']
    vals = [0, 72, 13]
    colors = [WARN, ACCENT2, MUTED]
    ax.barh(labels[::-1], vals[::-1], color=colors[::-1], height=0.55)
    for i, v in enumerate(vals[::-1]):
        ax.text(v + 1.5, i, f'{v}%', va='center', fontsize=9, color=INK)
    ax.set_xlim(0, 100)
    ax.set_xlabel('percent of records, Housecall Pro mirror, 12 months to 2026-09-14')
    ax.set_title('Why attribution matches on identity, not lead_source', loc='left', fontsize=11, color=INK)
    return save(fig, 'fig-identity.png')


# ── Paper 3: the demand instrument ────────────────────────────────────────────
def fig_bars():
    ideas = [
        ('Founders Bench', 'call', 400, 1.5),
        ('Tenflat', 'call', 400, 1.5),
        ('Provenance', 'call', 400, 1.5),
        ('Hearth & Hound', '$1 deposit', 600, 1.0),
        ('Estate', '$1 deposit', 600, 1.0),
        ('Verified', 'email + qualifier', 800, 6.0),
        ('Wholly American', 'email + qualifier', 800, 4.0),
        ('Look-Alikes', 'email + qualifier', 800, 4.0),
    ]
    fig, ax = plt.subplots(figsize=(7.2, 3.4))
    y = list(range(len(ideas)))[::-1]
    for yi, (name, proof, views, pct) in zip(y, ideas):
        need = views * pct / 100
        ax.barh(yi, need, color=ACCENT2, height=0.55)
        ax.text(need + 0.6, yi, f'{need:g} of {views} views ({pct:g}%) · {proof}', va='center', fontsize=8.5, color=INK)
    ax.set_yticks(y)
    ax.set_yticklabels([i[0] for i in ideas], fontsize=9)
    ax.set_xlim(0, 75)
    ax.set_xlabel('costly actions required to pass the bar')
    ax.set_title('Nine ideas, one template, eight pass/fail bars (Off-Peak is a supply test)', loc='left', fontsize=11, color=INK)
    return save(fig, 'fig-bars.png')


def fig_shared():
    fig, ax = plt.subplots(figsize=(7.2, 2.4))
    ax.axis('off')
    rows = [
        ('Hosting', 'one Vercel project per launch', 'own domain, own deploy cadence'),
        ('Analytics', 'one PostHog project', 'launch_slug super property'),
        ('Database', 'one Supabase project', 'launch_<slug> Postgres schema'),
        ('Payments', 'one Stripe account', 'metadata.launch_slug'),
        ('Scheduling', 'one Cal.com account', 'one event type per launch'),
    ]
    ax.text(0, 1.0, 'Layer', fontweight='bold', fontsize=9.5, color=INK, va='top')
    ax.text(0.22, 1.0, 'Shared?', fontweight='bold', fontsize=9.5, color=INK, va='top')
    ax.text(0.6, 1.0, 'Joined by', fontweight='bold', fontsize=9.5, color=INK, va='top')
    for i, (a, b, c) in enumerate(rows):
        yy = 0.82 - i * 0.19
        ax.text(0, yy, a, fontsize=9.5, color=INK, va='top')
        ax.text(0.22, yy, b, fontsize=9.5, color=ACCENT2 if i else WARN, va='top')
        ax.text(0.6, yy, c, fontsize=9.5, color=MUTED, va='top')
    ax.set_title('Running ten launches costs roughly what running one does', loc='left', fontsize=11, color=INK)
    return save(fig, 'fig-shared.png')


# ── Social cards (1200x630) ───────────────────────────────────────────────────
def card(slug, kicker, title, sub):
    fig = plt.figure(figsize=(12, 6.3), dpi=100)
    fig.patch.set_facecolor('#060606')
    ax = fig.add_axes([0, 0, 1, 1]); ax.axis('off')
    ax.add_patch(plt.Rectangle((0.06, 0.16), 0.012, 0.68, color='#fff500', transform=ax.transAxes))
    ax.text(0.095, 0.80, kicker.upper(), color='#fff500', fontsize=15, fontweight='bold', transform=ax.transAxes, va='top')
    import textwrap
    ax.text(0.095, 0.71, '\n'.join(textwrap.wrap(title, 30)), color='#f4f4f5', fontsize=40, fontweight='bold', transform=ax.transAxes, va='top', linespacing=1.05)
    ax.text(0.095, 0.30, '\n'.join(textwrap.wrap(sub, 60)), color='#9a9a9a', fontsize=17, transform=ax.transAxes, va='top', linespacing=1.3)
    ax.text(0.095, 0.10, 'michael-kaminski.io/papers  ·  PDF', color='#9a9a9a', fontsize=14, transform=ax.transAxes)
    p = IMG_OUT / f'og-{slug}.png'
    fig.savefig(p, facecolor='#060606')
    plt.close(fig)
    return p


CSS = """
@page { size: Letter; margin: 22mm 20mm 24mm 20mm; }
* { box-sizing: border-box; }
html { font-size: 10.6pt; }
body { font-family: 'Space Grotesk', 'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; color: #111; line-height: 1.52; margin: 0; }
h1 { font-size: 26pt; line-height: 1.12; margin: 0 0 6pt; letter-spacing: -0.01em; }
.sub { font-size: 12.5pt; color: #444; margin: 0 0 14pt; }
.meta { font-size: 9pt; color: #6b6b6b; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 6pt 0; margin: 0 0 18pt; display: flex; gap: 18pt; flex-wrap: wrap; }
h2 { font-size: 15pt; margin: 20pt 0 6pt; line-height: 1.2; page-break-after: avoid; }
h3 { font-size: 11.5pt; margin: 14pt 0 4pt; page-break-after: avoid; }
p { margin: 0 0 9pt; }
p.lead { font-size: 12pt; line-height: 1.5; }
.summary { background: #f6f4e8; border-left: 4px solid #c9a800; padding: 10pt 12pt; margin: 0 0 16pt; }
.summary h2 { margin-top: 0; font-size: 12.5pt; }
.summary p:last-child { margin-bottom: 0; }
table { border-collapse: collapse; width: 100%; margin: 6pt 0 12pt; font-size: 9.4pt; page-break-inside: avoid; }
th, td { text-align: left; vertical-align: top; padding: 5pt 7pt; border-bottom: 1px solid #e3e3e3; }
th { font-weight: 700; border-bottom: 1.5px solid #111; }
td.n, th.n { text-align: right; font-variant-numeric: tabular-nums; }
figure { margin: 8pt 0 14pt; page-break-inside: avoid; }
figure img { width: 100%; display: block; }
figcaption { font-size: 9pt; color: #555; margin-top: 4pt; }
code { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9pt; background: #f2f2f2; padding: 0 3pt; border-radius: 2px; }
pre { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 8.8pt; background: #f4f4f4; padding: 8pt 10pt; border-radius: 3px; white-space: pre-wrap; margin: 0 0 10pt; }
blockquote { margin: 0 0 10pt; padding: 0 0 0 12pt; border-left: 3px solid #ddd; color: #333; }
ul, ol { margin: 0 0 9pt 18pt; padding: 0; }
li { margin: 0 0 3pt; }
strong { font-weight: 700; }
.foot { margin-top: 26pt; padding-top: 8pt; border-top: 1px solid #ddd; font-size: 8.8pt; color: #666; }
.pb { page-break-before: always; }
"""


def build(slug, kicker, title, sub, date, pages_hint=None):
    body = (SRC / f'{slug}.html').read_text()
    html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title>
<style>{CSS}</style></head><body>
<h1>{title}</h1>
<p class="sub">{sub}</p>
<div class="meta"><span>Michael Kaminski</span><span>{date}</span><span>michael-kaminski.io/papers</span><span>{kicker}</span></div>
{body}
<div class="foot">© 2026 Michael Kaminski. Published at michael-kaminski.io/papers. Repositories, live URLs and measurements cited in the text are the sources of record; where a number is an estimate the text says so.</div>
</body></html>"""
    # figures are referenced as ../../images/papers/<name> relative to the PDF; for printing, use absolute file paths
    html = html.replace('src="/images/papers/', f'src="file://{IMG_OUT}/')
    tmp = tempfile.NamedTemporaryFile('w', suffix='.html', delete=False, dir=str(SRC))
    tmp.write(html); tmp.close()
    out = PDF_OUT / f'{slug}.pdf'
    subprocess.run([CHROME, '--headless=new', '--no-sandbox', '--disable-gpu', '--no-pdf-header-footer',
                    f'--print-to-pdf={out}', f'file://{tmp.name}'], check=True, capture_output=True, timeout=120)
    os.unlink(tmp.name)
    pages = count_pages(out)
    card(slug, kicker, title, sub)
    print(f'{slug}: {out.stat().st_size // 1024} KB, {pages} pages')
    return pages


def count_pages(pdf):
    data = pdf.read_bytes()
    m = re.findall(rb'/Type\s*/Page[^s]', data)
    return len(m)


PAPERS = {
    'sites-that-differ-by-data-not-code': dict(
        kicker='White paper 01',
        title='Sites That Differ by Data, Not Code',
        sub='A five-minute contract for trade-business websites, the gates that make it honest, and what the first live deploys got wrong.',
        date='2026-09-23',
        figs=[fig_time_budget, fig_parity],
    ),
    'one-database-many-connectors': dict(
        kicker='White paper 02',
        title='One Database, Many Connectors',
        sub='An operating system for a small services business: a hub that never becomes a mesh, an agent desk that hands work over instead of parking it, and attribution by identity.',
        date='2026-09-23',
        figs=[fig_query_string, fig_identity],
    ),
    'the-demand-instrument': dict(
        kicker='White paper 03',
        title='The Demand Instrument',
        sub='Nine ideas on one template, one Vercel project per launch, and the three ways a validation test gets misread.',
        date='2026-09-23',
        figs=[fig_bars, fig_shared],
    ),
}

if __name__ == '__main__':
    want = sys.argv[1:] or list(PAPERS)
    results = {}
    for slug in want:
        p = PAPERS[slug]
        for f in p['figs']:
            f()
        results[slug] = build(slug, p['kicker'], p['title'], p['sub'], p['date'])
    print(json.dumps(results))
