"""Generate the vintage Atlanta map that sits behind the hero.

Real data, projected honestly: City of Atlanta neighborhood polygons, OSM motorways
and the Chattahoochee, and a star at each company Michael has worked for. Everything
is simplified hard — it renders at low opacity behind the hero, so fidelity past a
couple hundred metres is wasted bytes.
"""
import json
import math

W, H = 1600, 1200          # viewBox; landscape to sit behind a wide hero
PAD = 46                   # inner margin in viewBox units
SIMPLIFY_M = 90            # Douglas-Peucker tolerance, metres

COMPANIES = [
    # (label, lat, lon, years, dy, anchor) — geocoded from each company's street address.
    # dy/anchor pull apart the pairs that sit within a kilometre of each other:
    # KPMG/Momnt are both on Peachtree downtown, Home Depot/HD Supply both in Vinings.
    ('Superior Contracting', 34.05103, -84.59514, '2018-23',  30, 'middle'),
    ('GreenSky',             33.90269, -84.35761, '2016-18',  30, 'middle'),
    ('HD Supply',            33.87701, -84.46518, '2015-16', -26, 'end'),
    ('Home Depot',           33.86562, -84.47135, '2013-15',  32, 'end'),
    ('KPMG',                 33.76255, -84.38585, '2014-15', -26, 'start'),
    ('Momnt',                33.75661, -84.38867, '2023-25',  32, 'start'),
]

# A few well-separated anchors so the mesh reads as Atlanta rather than abstract noise.
PLACES = [
    ('BUCKHEAD',     33.8480, -84.3780,   0),
    ('MIDTOWN',      33.7815, -84.3830, -14),
    ('DOWNTOWN',     33.7530, -84.4050,  10),
    ('WEST END',     33.7350, -84.4230,  24),
    ('EAST ATLANTA', 33.7380, -84.3380,  18),
]

LAT0 = 33.85               # projection reference latitude
M_PER_DEG_LAT = 110900.0
M_PER_DEG_LON = 111320.0 * math.cos(math.radians(LAT0))


def to_m(lon, lat):
    """Equirectangular metres. Uniform scale on both axes, so nothing is stretched."""
    return lon * M_PER_DEG_LON, lat * M_PER_DEG_LAT


def simplify(pts, tol):
    """Douglas-Peucker on projected metres."""
    if len(pts) < 3:
        return pts
    ax, ay = pts[0]
    bx, by = pts[-1]
    dx, dy = bx - ax, by - ay
    d2 = dx * dx + dy * dy
    worst, idx = -1.0, 0
    for i in range(1, len(pts) - 1):
        px, py = pts[i]
        if d2 == 0:
            dist = math.hypot(px - ax, py - ay)
        else:
            t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / d2))
            dist = math.hypot(px - (ax + t * dx), py - (ay + t * dy))
        if dist > worst:
            worst, idx = dist, i
    if worst <= tol:
        return [pts[0], pts[-1]]
    return simplify(pts[:idx + 1], tol)[:-1] + simplify(pts[idx:], tol)


# ---------------------------------------------------------------- load sources
hoods = []
for f in json.load(open('atl.geojson'))['features']:
    g = f['geometry']
    rings = g['coordinates'] if g['type'] == 'Polygon' else [r for p in g['coordinates'] for r in p]
    for ring in rings:
        pts = [to_m(c[0], c[1]) for c in ring]
        if len(pts) > 3:
            hoods.append(simplify(pts, SIMPLIFY_M))

roads, river = [], []
for e in json.load(open('osm.json'))['elements']:
    geom = e.get('geometry')
    if not geom or len(geom) < 2:
        continue
    pts = simplify([to_m(p['lon'], p['lat']) for p in geom], SIMPLIFY_M * 1.6)
    tags = e.get('tags', {})
    if tags.get('waterway') == 'river':
        river.append(pts)
    else:
        ref = (tags.get('ref') or '').replace(' ', '')
        roads.append((ref, pts))

# ------------------------------------------------------------------ projection
# Frame on what must not be cropped — every neighborhood and every star. Roads are
# allowed to run off the edge; they are what fills the width instead of dead margin.
keep = [p for r in hoods for p in r] + [to_m(lon, lat) for _, lat, lon, _, _, _ in COMPANIES]
kx = [p[0] for p in keep]
ky = [p[1] for p in keep]
cx, cy = (min(kx) + max(kx)) / 2, (min(ky) + max(ky)) / 2
scale = min((W - 2 * PAD) / (max(kx) - min(kx)), (H - 2 * PAD) / (max(ky) - min(ky)))


def prj(p):
    return (W / 2 + (p[0] - cx) * scale, H / 2 - (p[1] - cy) * scale)


def path(pts, close=False):
    d = []
    for i, p in enumerate(pts):
        x, y = prj(p)
        d.append(f'{"M" if i == 0 else "L"}{x:.1f} {y:.1f}')
    return ''.join(d) + ('Z' if close else '')


def visible(pts, slack=260):
    return any(-slack <= prj(p)[0] <= W + slack and -slack <= prj(p)[1] <= H + slack for p in pts)


# ------------------------------------------------------------------- emit SVG
o = []
o.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
         f'fill="none" role="img" aria-label="Vintage map of Atlanta marking the companies Michael Kaminski has worked for">')
o.append('<defs>'
         '<filter id="starglow" x="-160%" y="-160%" width="420%" height="420%">'
         '<feGaussianBlur stdDeviation="7" result="b"/>'
         '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>'
         '</filter>'
         '</defs>')

o.append('<g>')

# river
o.append('<g stroke="#6f9c96" stroke-width="3.2" stroke-opacity="0.42" stroke-linecap="round" fill="none">')
for pts in river:
    if visible(pts):
        o.append(f'<path d="{path(pts)}"/>')
o.append('</g>')

# neighborhoods — fill then hairline stroke
o.append('<g fill="#c9a06a" fill-opacity="0.07" stroke="#b98b4e" stroke-opacity="0.62" stroke-width="1.2">')
for r in hoods:
    o.append(f'<path d="{path(r, close=True)}"/>')
o.append('</g>')

# interstates
o.append('<g stroke="#d9a441" fill="none" stroke-linecap="round" stroke-linejoin="round">')
for ref, pts in roads:
    if not visible(pts):
        continue
    major = ref.startswith(('I285', 'I75', 'I85', 'I20'))
    o.append(f'<path d="{path(pts)}" stroke-width="{2.6 if major else 1.5}" '
             f'stroke-opacity="{0.5 if major else 0.3}"/>')
o.append('</g>')

# place labels
o.append('<g fill="#d8c3a0" fill-opacity="0.5" font-family="Georgia,\'Times New Roman\',serif" '
         'font-size="13" letter-spacing="2.2" text-anchor="middle">')
for name, lat, lon, dy in PLACES:
    x, y = prj(to_m(lon, lat))
    o.append(f'<text x="{x:.1f}" y="{y + dy:.1f}">{name}</text>')
o.append('</g>')

o.append('</g>')

# company stars
star = []
for i in range(10):
    a = math.pi / 2 + i * math.pi / 5
    r = 12 if i % 2 == 0 else 5
    star.append(f'{r * math.cos(a):.2f},{-r * math.sin(a):.2f}')
star_pts = ' '.join(star)

o.append('<g>')
for name, lat, lon, years, dy, anchor in COMPANIES:
    x, y = prj(to_m(lon, lat))
    dx = {'start': 18, 'end': -18, 'middle': 0}[anchor]
    o.append(f'<g transform="translate({x:.1f} {y:.1f})">')
    o.append(f'<polygon points="{star_pts}" fill="#fff500" fill-opacity="0.85" filter="url(#starglow)"/>')
    o.append(f'<text x="{dx}" y="{dy}" text-anchor="{anchor}" font-family="Georgia,\'Times New Roman\',serif" '
             f'font-size="17" fill="#f6e6b8" fill-opacity="0.8">{name}</text>')
    o.append(f'<text x="{dx}" y="{dy + 17}" text-anchor="{anchor}" font-family="Georgia,\'Times New Roman\',serif" '
             f'font-size="13" fill="#d9a441" fill-opacity="0.65" letter-spacing="1.4">{years}</text>')
    o.append('</g>')
o.append('</g>')
o.append('</svg>')

svg = ''.join(o)
open('atlanta-map.svg', 'w').write(svg)
print(f'neighborhood rings : {len(hoods)}')
print(f'road ways drawn    : {sum(1 for _, p in roads if visible(p))} / {len(roads)}')
print(f'river ways         : {len(river)}')
print(f'stars              : {len(COMPANIES)}')
print(f'size               : {len(svg)/1024:.1f} KB')
