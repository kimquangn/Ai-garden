// Small scroll-driven SVG diagrams. --p (0..1) is set per step by build.js.
const T=(dx,dy)=>`style="transform:translate(calc((1 - var(--p))*${dx}px),calc((1 - var(--p))*${dy}px))"`;
const O=(a=0)=>`style="opacity:calc(var(--p)*1.6 - ${a})"`;
const wood='#B07646',woodD='#8A5A33';
export const DG={
plan:`<svg class=dg viewBox="0 0 360 200"><rect x=20 y=14 width=320 height=6 fill="#6b3b2e"/><text x=24 y=12 class=m>fence</text>
<path d="M40 26 H340 V122 H160 V194 H40 Z" fill="none" stroke="#1B1C1E" stroke-width=2 stroke-dasharray=900 style="stroke-dashoffset:calc((1 - var(--p))*900)"/>
<g ${O(.4)}><text x=180 y=40 class=m>3.0 m long arm</text><text x=280 y=80 class=m>0.9 m</text><text x=46 y=160 class=m>1.6 × 0.9 m</text><text x=300 y=32 class=m>20 mm gap</text><text x=180 y=150 class=m>path</text></g></svg>`,
roundover:`<svg class=dg viewBox="0 0 360 160"><rect x=40 y=60 width=220 height=50 fill="${wood}"/>
<path d="M260 60 h0 v0" /><circle cx=260 cy=60 r=14 fill="#EEE" ${O(.2)}/><rect x=246 y=46 width=14 height=14 fill="#EEE" ${O(.2)}/>
<g style="transform:translate(calc(var(--p)*200px - 160px),0)"><circle cx=100 cy=45 r=12 fill="#9E9D99"/><text x=80 y=26 class=m>router bit</text></g>
<g ${O(.6)}><text x=40 y=135>Edges rounded, end grain sealed, part labelled</text><text x=60 y=90 fill=#fff class=m>W5-3</text></g></svg>`,
packer:`<svg class=dg viewBox="0 0 360 180"><rect x=0 y=150 width=360 height=30 fill="#8f969b"/>
<rect x=140 y=140 width=80 height=10 fill="#2a2a2a" ${T(0,-30)}/><rect x=220 y=128 width=130 height=22 fill="${wood}" ${O(.5)}/><rect x=262 y=140 width=20 height=10 fill="#8f969b" ${O(.5)}/><text x=250 y=124 class=m ${O(.7)}>weep slot</text><g ${T(0,-90)}><rect x=150 y=30 width=60 height=110 fill="${wood}"/><text x=158 y=90 fill=#fff class=m>90×90</text></g>
<g ${O(.6)}><text x=150 y=176 class=m>20 mm packer</text><text x=20 y=130>water drains under ↓</text></g></svg>`,
wall:`<svg class=dg viewBox="0 0 360 200"><text x=10 y=16 class=m>seen from INSIDE the bed</text>
<g data-show=C ${T(0,0)}>${[0,1,2,3,4].map(i=>`<rect x=60 y=${150-i*30} width=240 height=28 fill="${i%2?wood:woodD}" style="transform:translate(calc((1 - var(--p))*${i%2?-180:180}px),0)"/>`).join('')}
<rect x=40 y=26 width=24 height=152 fill="#6d4a2c"/><rect x=296 y=26 width=24 height=152 fill="#6d4a2c"/></g>
<g data-show=AB>${[0,1].map(i=>`<rect x=40 y=${60+i*70} width=280 height=16 fill="#6d4a2c"/>`).join('')}
${Array.from({length:12},(_,i)=>`<rect x=${44+i*23} y=30 width=18 height=150 rx=6 fill="${wood}" style="opacity:.85;transform:translate(0,calc((1 - var(--p))*${60+i*10}px))"/>`).join('')}<text x=150 y=196 class=m>rails behind slats</text></g>
<g ${O(.7)}>${[0,1,2,3].map(i=>`<circle cx=${52+i*85} cy=${68} r=4 fill="#C0C0C0" stroke="#333"/>`).join('')}<text x=10 y=196 class=m>● stainless screws from inside</text></g></svg>`,
mitre:`<svg class=dg viewBox="0 0 360 200"><rect x=150 y=20 width=60 height=170 fill="${woodD}"/><rect x=170 y=40 width=20 height=30 fill="#3a2a1c"/>
<g style="transform:translate(calc((1 - var(--p))*-120px),0)"><rect x=20 y=40 width=190 height=30 fill="${wood}"/></g>
<path d="M180 20 l6 0 l-2 60 l-2 0 Z" fill="#E9D7B5" stroke="#6f5a3b" style="transform:translate(0,calc((1 - var(--p))*-60px));opacity:calc(var(--p)*2 - .6)"/>
<rect x=30 y=110 width=120 height=30 fill="${wood}" opacity=".8"/><text x=40 y=160 class=m>middle courses: housed + 316 screws</text>
<g ${O(.8)}><text x=220 y=50>through-tenon</text><text x=220 y=68 class=m>locked by a wedge (込み栓)</text><text x=220 y=86 class=m>tap out to dismantle</text></g></svg>`,
liner:`<svg class=dg viewBox="0 0 360 200"><rect x=40 y=20 width=40 height=170 fill="${wood}"/><text x=42 y=14 class=m>timber</text>
<g ${T(80,0)}><path d="M88 20 ${Array.from({length:17},(_,i)=>`L${i%2?96:88} ${20+i*10}`).join(' ')} V190" fill="none" stroke="#1B1C1E" stroke-width="3"/><text x=96 y=14 class=m>dimpled HDPE</text></g>
<rect x=100 y=20 width=240 height=170 fill="#5c4634" ${O(.5)}/><text x=200 y=110 fill=#fff ${O(.5)}>soil</text>
${[0,1,2].map(i=>`<circle cx=84 r=2.5 fill="#4aa3df" style="transform:translate(0,calc(var(--p)*150px + ${30+i*20}px));opacity:calc(var(--p)*2 - .5)"/>`).join('')}
<rect x=80 y=8 width=14 height=16 fill="${woodD}" ${O(.7)}/><text x=200 y=40 class=m fill=#fff ${O(.8)}>clamp batten under cap ↖</text><text x=110 y=196 class=m ${O(.8)}>air gap: wood stays dry</text></svg>`,
cap:`<svg class=dg viewBox="0 0 360 200"><rect x=150 y=60 width=40 height=140 fill="${wood}"/><g ${T(0,-40)}><path d="M126 60 H200 V44 H126 Z" fill="${woodD}"/><rect x=133 y=58 width=5 height=4 fill="#EFEFED"/></g>
<text x=60 y=40 class=m ${O(.6)}>25 mm overhang</text><text x=40 y=80 class=m ${O(.6)}>drip groove</text>
<circle cx=135 r=3.5 fill="#4aa3df" style="transform:translate(0,calc(var(--p)*130px + 64px));opacity:calc(var(--p)*2 - .6)"/>
<text x=200 y=150 ${O(.8)}>water falls clear of the wall</text></svg>`,
layers:`<svg class=dg viewBox="0 0 360 200"><rect x=40 y=10 width=14 height=180 fill="${wood}"/><rect x=306 y=10 width=14 height=180 fill="${wood}"/>
${[['#d8d4c8',182,6,'geotextile',0],['#b8ab8c',156,26,'logs + branches, bottom third',.25],['#5c4634',58,96,'veg mix 15–20 cm at a time',.5],['#d9c9a3',44,14,'50 mm sugar-cane mulch',.75]].map(([c,y,h,l,s])=>`<g style="opacity:calc((var(--p) - ${s})*5)"><rect x=54 y=${y} width=252 height=${h} fill="${c}"/><text x=64 y=${y+h/2+4} class=m fill="${c=='#5c4634'?'#fff':'#333'}">${l}</text></g>`).join('')}</svg>`,
drip:`<svg class=dg viewBox="0 0 360 200"><path d="M40 26 H340 V122 H160 V194 H40 Z" fill="#5c4634"/>
<path d="M30 20 V50 H330 V80 H60 V110 H330 M140 120 V180 H60 V140" fill="none" stroke="#1B1C1E" stroke-width=2.5 stroke-dasharray=1500 style="stroke-dashoffset:calc((1 - var(--p))*1500)"/>
<rect x=6 y=6 width=8 height=8 fill="#333"/><rect x=16 y=6 width=8 height=8 fill="#333"/><text x=28 y=14 class=m>tap · valve 1 (bed + control bag) · valve 2 (deficit bags)</text><path d="M44 30 V190" stroke="#9E9D99" stroke-width=5 ${O(.3)}/><text x=50 y=186 class=m fill=#fff ${O(.5)}>20 mm conduit</text>${[[44,30],[340,30],[340,118],[160,190]].map(([x,y])=>`<circle cx=${x} cy=${y} r=6 fill=none stroke="#fff" stroke-width=2 ${O(.7)}/>`).join('')}${[[100,160,'bed probe'],[150,40,'bag probe'],[240,40,'bag probe']].map(([x,y,l])=>`<g ${O(.6)}><circle cx=${x} cy=${y} r=6 fill="#9BD3A0"/><text x=${x+9} y=${y+4} fill=#fff class=m>${l}</text></g>`).join('')}</svg>`,
ties:`<svg class=dg viewBox="0 0 360 160"><rect x=30 y=20 width=30 height=130 fill="${wood}"/><rect x=300 y=20 width=30 height=130 fill="${wood}"/><rect x=60 y=20 width=240 height=130 fill="#5c4634" opacity=".5"/>
<line x1=20 y1=110 x2=340 y2=110 stroke="#9aa" stroke-width=4 style="stroke-dasharray:330;stroke-dashoffset:calc((1 - var(--p))*330)"/>
<rect x=22 y=100 width=6 height=20 fill="#ccc" ${O(.6)}/><rect x=332 y=100 width=6 height=20 fill="#ccc" ${O(.6)}/>
<g ${O(.8)}><text x=110 y=104 class=m>M10 316 rod, 250 mm up</text><text x=80 y=60 fill=#fff>soil push ← →</text></g></svg>`,
roof:`<svg class=dg viewBox="0 0 360 200"><rect x=320 y=0 width=14 height=200 fill="#6b3b2e"/><text x=280 y=196 class=m>fence</text>
<path d="M320 40 L40 70 V150" stroke="${woodD}" stroke-width=5 fill="none"/><circle cx=314 cy=42 r=9 fill="#9E9D99"/>
<path d="M314 44 L40 72" stroke="#bfe3ff" stroke-width=6 style="stroke-dasharray:280;stroke-dashoffset:calc((1 - var(--p))*280)"/>
<rect x=40 y=150 width=280 height=50 fill="${wood}"/><path d="M90 150 v-50 M150 150 v-60 M220 150 v-55 M280 150 v-60" stroke="#4E9F5D" stroke-width="4"/>
${[0,1,2,3,4,5].map(i=>`<circle r=2.5 fill="#4aa3df" cx="${70+i*42}" cy="20" style="opacity:calc(var(--p)*2 - .6)"/>`).join('')}
${[0,1,2].map(i=>`<circle r=3 fill="#4aa3df" cx="36" cy="80" style="transform:translate(0,calc(var(--p)*${40+i*18}px));opacity:calc(var(--p)*2 - .9)"/>`).join('')}
<text x=60 y=110 class=m ${O(.7)}>fixed clear roof: rain off, light in · motorised later</text></svg>`,
mesh:`<svg class=dg viewBox="0 0 360 200"><defs><pattern id=mp width=6 height=6 patternUnits=userSpaceOnUse><path d="M6 0H0V6" fill=none stroke="#fff" stroke-width=".8"/></pattern></defs>
<rect x=300 y=10 width=14 height=190 fill="#6b3b2e"/><rect x=40 y=150 width=260 height=50 fill="${wood}"/>
<path d="M300 20 L60 80 V150" stroke="${woodD}" stroke-width=6 fill=none stroke-dasharray=500 style="stroke-dashoffset:calc((1 - var(--p))*500)"/>
<path d="M300 20 L60 80 V150 H300 Z" fill="url(#mp)" style="opacity:calc(var(--p)*2 - .8)"/>
<g ${O(.9)}><text x=110 y=60>white mesh ≤ 5×5 mm, taut</text><text x=70 y=144 class=m fill=#fff>closed at the base</text></g></svg>`};
