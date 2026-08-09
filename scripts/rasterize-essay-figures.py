"""Emit square twins of fig1/fig3 so qlmanage+sips can crop exact-size PNGs.

Same trick as the OG card: qlmanage top-anchors onto a square canvas and sips
can only crop from the centre, so pad the artwork to centre it first.
"""
import pathlib, re, sys

SRC = pathlib.Path('/Users/kaminski/Documents/Claude/Projects/Personal/_site_work/public/images/essays')
OUT = pathlib.Path('/tmp/raster'); OUT.mkdir(exist_ok=True)
INK = '#060606'

for name, w, h in [('fig1-mde-by-window', 920, 520), ('fig3-effective-threshold', 920, 452)]:
    svg = (SRC / f'{name}.svg').read_text()
    inner = svg.split('>', 1)[1].rsplit('</svg>', 1)[0]
    pad = (w - h) // 2
    sq = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {w}" width="{w}" height="{w}">'
          f'<rect width="{w}" height="{w}" fill="{INK}"/>'
          f'<g transform="translate(0,{pad})">{inner}</g></svg>')
    (OUT / f'{name}_sq.svg').write_text(sq)
    print(f'{name}: square twin, crop to {w}x{h}')
