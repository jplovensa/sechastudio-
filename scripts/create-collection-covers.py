"""Author the six self-contained SECHA SVG covers with outlined Inter typography.

Run from the repository root. Requires fonttools only for regeneration;
the committed SVGs have no runtime dependency on Python or external fonts.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from html import escape
font=TTFont('assets/fonts/Inter-Variable.ttf')
cmap=font.getBestCmap(); units=font['head'].unitsPerEm
parts=[]; ink='';accent=''
def add(s):parts.append(s)
def text(s,x,y,size=13,color=None,weight=400,tracking=0):
 gs=font.getGlyphSet(location={'wght':weight,'opsz':24}); scale=size/units
 paths=[]
 for ch in s:
  name=cmap.get(ord(ch),'space'); glyph=gs[name]; pen=SVGPathPen(gs)
  glyph.draw(TransformPen(pen,(scale,0,0,-scale,x,y)))
  paths.append(pen.getCommands());x+=glyph.width*scale+tracking
 add(f'<path fill="{color or ink}" d="{" ".join(paths)}"/>')
def line(x,y,x2,y2,c=None,w=1,dash=None):add(f'<path d="M{x} {y}L{x2} {y2}" fill="none" stroke="{c or ink}" stroke-width="{w}"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')
def rect(x,y,w,h,fill='none',stroke=None,sw=1):add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke or ink}" stroke-width="{sw}"/>')
def proj(x,y,z):return (290+x*.93-y*.57,398+x*.31+y*.34-z)
def polygon(coords,fill):add(f'<polygon points="{" ".join(f"{a:.1f},{b:.1f}" for a,b in coords)}" fill="{fill}" stroke="{ink}" stroke-width="1.3" stroke-linejoin="round"/>')
def box(x,y,z,w,d,h,front='#c1a78a',top='#ece3d5',side='#a08a73'):
 p=lambda a,b,c:proj(a,b,c)
 polygon([p(x,y,z+h),p(x+w,y,z+h),p(x+w,y+d,z+h),p(x,y+d,z+h)],top)
 polygon([p(x+w,y,z),p(x+w,y+d,z),p(x+w,y+d,z+h),p(x+w,y,z+h)],side)
 polygon([p(x,y+d,z),p(x+w,y+d,z),p(x+w,y+d,z+h),p(x,y+d,z+h)],front)
def pline(points,c=None,w=1,dash=None):
 add(f'<polyline points="{" ".join(f"{a:.1f},{b:.1f}" for a,b in points)}" fill="none" stroke="{c or ink}" stroke-width="{w}"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')
def plan(x,y,w=300,h=185,dark=False):
 paper='#dedfd1' if dark else '#f8f5ee'; rect(x,y,w,h,paper,ink,1.3)
 pad=20;rect(x+pad,y+pad,w-2*pad,h-2*pad,'none',ink,2.5)
 line(x+w*.58,y+pad,x+w*.58,y+h*.57,ink,2.5)
 line(x+w*.58,y+h*.57,x+w-pad,y+h*.57,ink,2.5)
 # living seating, table and storage: an actual coherent plan graphic
 rect(x+35,y+39,w*.29,30,'#c3c6b7',ink,.8);rect(x+35,y+69,25,43,'#c3c6b7',ink,.8)
 rect(x+82,y+88,42,25,'none',ink,.8)
 rect(x+35,y+h-40,w*.32,13,'#d3c2ac',ink,.8)
 rect(x+w*.68,y+38,48,52,'#d3c2ac',ink,.8)
 line(x+w*.68,y+47,x+w*.68+48,y+47,ink,.8)
 # dimension witnesses, no invented numeric measurements
 line(x+20,y-11,x+w-20,y-11,accent,.8)
 for a in [x+20,x+w-20]:line(a,y-16,a,y-5,accent,.8)
 line(x-11,y+20,x-11,y+h-20,accent,.8)
 for b in [y+20,y+h-20]:line(x-16,b,x-5,b,accent,.8)

def base(id,title,category,index,bg,colour,ac,subtitle):
 global parts,ink,accent
 parts=[];ink=colour;accent=ac
 add(f'<svg xmlns="http://www.w3.org/2000/svg" width="900" height="650" viewBox="0 0 900 650" role="img" aria-labelledby="title desc"><title id="title">SECHA {escape(title)} studio cover</title><desc id="desc">Authored vector concept sheet: {escape(subtitle)}. Schematic artwork, not a measured construction drawing.</desc>')
 rect(0,0,900,650,bg,bg)
 text('SECHA',40,50,22,weight=650,tracking=-.8);text('+',116,47,17,ac,500)
 text('STUDIO / COLLECTION',665,47,11,tracking=1.2)
 line(40,70,860,70,colour,.65)
 text(category.upper(),40,110,11,ac,500,1.5)
 text(title,36,195,82,weight=400,tracking=-4)
 text(index,801,190,38,ac,400,-1)
 line(40,588,860,588,colour,.65)
 text(subtitle.upper(),40,615,10,weight=500,tracking=1)
 text('SECHA / CONCEPT STUDY',650,615,9,tracking=1)

def finish(id):
 add('</svg>');Path(f'assets/collection/{id}.svg').write_text(''.join(parts))

base('modular-living','Living.','Modular system','01','#eae5da','#3d4438','#8a523c','Media / display / storage')
# A low media console, an open display tower, and a closed storage unit.
box(0,0,0,210,65,62)
for x in [70,140]:pline([proj(x,65,0),proj(x,65,62)],ink,.8)
box(245,0,0,90,65,153,front='#d8d0be')
for z in [10,56,102]:
 polygon([proj(253,65,z),proj(327,65,z),proj(327,65,z+36),proj(253,65,z+36)],'#e8e1d4')
box(365,0,0,90,65,92)
pline([proj(410,65,0),proj(410,65,92)],ink,.8)
pline([proj(-20,110,0),proj(470,110,0)],accent,.8)
for x in [0,210,245,335,365,455]:pline([proj(x,102,0),proj(x,118,0)],accent,.8)
text('A SYSTEM OF THREE',40,283,10,accent,500,1.2)
line(40,298,153,298,accent,.7)
text('01',218,458,10,accent);text('02',462,458,10,accent);text('03',620,498,10,accent)
finish('modular-living')

base('modular-work','Work.','Modular system','02','#e0e4dc','#35483e','#7c5b41','Desk / storage / focus')
box(20,0,0,110,90,112,front='#b6b9a4',top='#e6dfcf',side='#8f9c86')
for z in [38,76]:pline([proj(20,90,z),proj(130,90,z)],ink,.8)
box(340,0,0,65,90,112,front='#b6b9a4',top='#e6dfcf',side='#8f9c86')
box(0,-8,112,430,110,13,front='#c8ae8d',top='#e0ccb1',side='#ad967c')
box(320,0,160,110,32,10,front='#b6b9a4',top='#e6dfcf',side='#8f9c86')
pline([proj(-20,130,0),proj(450,130,0)],accent,.8)
for x in [0,430]:pline([proj(x,122,0),proj(x,139,0)],accent,.8)
text('SPACE TO THINK',40,283,10,accent,500,1.2);line(40,298,146,298,accent,.7)
text('01 / DESK',232,525,10,accent);text('02 / STORAGE',600,543,10,accent)
finish('modular-work')

base('modular-bedroom','Rest.','Modular system','03','#e6dbcd','#53443b','#875346','Headboard / bedside / wardrobe')
# Headboard, two bedside cabinets and a wardrobe wall.
box(0,-15,0,260,18,133,front='#b8a28b',top='#ddc7af',side='#99826d')
box(4,18,0,58,56,48,front='#d1b99f');box(198,18,0,58,56,48,front='#d1b99f')
# Bed shown as context only, with a pale unfilled platform.
box(77,22,0,107,140,28,front='#eee7dc',top='#f3ede4',side='#d9cfc0')
box(310,0,0,125,63,195,front='#c6ad90',top='#eadcca',side='#a88d76')
for x in [352,393]:pline([proj(x,63,0),proj(x,63,195)],ink,.8)
text('ROOM TO UNWIND',40,283,10,accent,500,1.2);line(40,298,150,298,accent,.7)
pline([proj(-20,185,0),proj(435,185,0)],accent,.8)
for x in [0,260,310,435]:pline([proj(x,177,0),proj(x,193,0)],accent,.8)
finish('modular-bedroom')

base('design-lite','Lite.','Design dossier','04','#eee2d1','#4b4037','#9a503a','Concept / moodboard / palette')
rect(337,257,376,239,'#c0a286', '#c0a286')
rect(321,239,376,239,'#f8f4eb',ink,.8)
text('01 / THE DIRECTION',342,263,10,accent,500,1)
plan(354,290,310,157)
# A paper material palette. Deliberately flat and graphic.
rect(167,320,188,166,'#f2eadf',ink,.8)
text('MATERIAL NOTES',183,344,9,accent,500,.7)
for i,c in enumerate(['#c0a78a','#ded3bf','#69705b']):rect(183+i*49,360,43,61,c,c)
for i in range(6):line(184,438+i*4,328-i*10,438+i*4,ink,.4)
text('A CLEAR STARTING POINT',40,283,10,accent,500,1.1)
text('01',736,482,12,accent)
finish('design-lite')

base('design-pro','Pro.','Design dossier','05','#dce1d9','#35463e','#7d5942','Concept / layout / spatial study')
plan(288,263,352,221)
text('02 / ROOM LAYOUT',312,509,9,accent,500,1)
# Axonometric companion sheet, precise and human-authored.
rect(576,362,230,178,'#f6f1e7',ink,.9)
text('SPATIAL STUDY',592,385,8,accent,500,.7)
pline([(607,482),(683,516),(772,473),(699,439),(607,482)],ink,1)
pline([(607,482),(607,415),(699,375+40),(699,439)],ink,1)
pline([(699,415),(772,447),(772,473)],ink,1)
pline([(633,472),(633,447),(676,464),(676,492)],accent,1.3)
line(181,326,240,326,accent,.8);line(181,334,226,334,accent,.8)
text('A ROOM, RESOLVED',40,283,10,accent,500,1.1)
finish('design-pro')

base('design-premium','Premium.','Design dossier','06','#2e3a33','#eee7d9','#d5b69a','Concept / detail / build planning')
# An elevation and layout as a coordinated drawing set.
rect(295,263,422,248,'#eee8dc','#eee8dc')
text('03 / THE DRAWING SET',315,288,9,'#3d493d',500,1)
old=ink;ink='#4b5549'
plan(320,326,234,151,True)
rect(572,329,122,145,'#e3d9c6',ink,.8)
for x in [602,633,664]:line(x,329,x,474,ink,.8)
for y in [371,418]:line(572,y,694,y,ink,.8)
line(572,487,694,487,ink,.8)
ink=old
text('ELEVATION / 01',579,502,7,'#4b5549',500,.5)
text('DETAILS THAT CONNECT',40,245,10,accent,500,1.1)
line(193,340,257,340,accent,.8);line(193,348,235,348,accent,.8)
finish('design-premium')
print('Created six studio covers with outlined Inter typography.')
