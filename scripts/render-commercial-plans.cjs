/* Render the same metric layout used by the playground as an SVG plan sheet. */
const fs = require("node:fs");
const path = require("node:path");
const { catalog, layouts } = require("../js/commercial-layouts.js");
const escape = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]));
for (const [kind, plan] of Object.entries(layouts)) {
 const scale=52,cx=450,cy=330;
 const counts={};plan.pieces.forEach(([item])=>counts[item]=(counts[item]||0)+1);
 const keys=Object.keys(counts);
 const x=cx-plan.w*scale/2,y=cy-plan.d*scale/2;
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="800" viewBox="0 0 900 800" role="img" aria-labelledby="title desc"><title id="title">${escape(plan.name)} furniture plan</title><desc id="desc">${plan.w} by ${plan.d} metres. ${escape(plan.summary)}. Furniture positions are shared with the playground.</desc><rect width="900" height="800" fill="#eee9dd"/><g font-family="Arial,sans-serif" fill="#354436"><text x="45" y="45" font-size="12" letter-spacing="2">SECHA / COMMERCIAL COMPOSITION</text><text x="45" y="78" font-size="25">${escape(plan.name)}</text><text x="855" y="77" text-anchor="end" font-size="12">${plan.w} × ${plan.d} m / ${plan.w*plan.d} m²</text></g><rect x="${x}" y="${y}" width="${plan.w*scale}" height="${plan.d*scale}" fill="#f9f6ee" stroke="#526349" stroke-width="3"/>`;
 for(const [item,px,pz,r] of plan.pieces){
   const p=catalog[item],w=p.w*scale,d=p.d*scale,n=keys.indexOf(item)+1;
   svg+=`<g transform="translate(${cx+px*scale} ${cy+pz*scale}) rotate(${-r*90})"><rect x="${-w/2}" y="${-d/2}" width="${w}" height="${d}" rx="${/Chair|stool/.test(item)?4:1}" fill="${p.color}" stroke="#526349" stroke-width="1"/><path d="M${-w/2+3} ${-d/2+3}H${w/2-3}" stroke="#354436" stroke-width="2"/></g><text x="${cx+px*scale}" y="${cy+pz*scale+3}" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#172c21">${n}</text>`;
 }
 svg+=`<g stroke="#77836c" fill="none"><path d="M${x} ${y-18}H${x+plan.w*scale}M${x} ${y-24}V${y-12}M${x+plan.w*scale} ${y-24}V${y-12}"/><path d="M${x-18} ${y}V${y+plan.d*scale}M${x-24} ${y}H${x-12}M${x-24} ${y+plan.d*scale}H${x-12}"/><path d="M450 ${y+plan.d*scale+35}V${y+plan.d*scale-12}m-8 8 8-8 8 8" stroke-width="2"/></g><text x="475" y="${y+plan.d*scale+28}" font-family="Arial,sans-serif" font-size="9" fill="#53634b">ENTRY / OPEN CIRCULATION</text>`;
 svg+=`<path d="M45 592H855" stroke="#b1b8a4"/><g font-family="Arial,sans-serif" fill="#3d4a37">`;
 keys.forEach((item,i)=>{const px=45+(i%3)*280,py=620+Math.floor(i/3)*35,p=catalog[item];svg+=`<text x="${px}" y="${py}" font-size="10">${i+1}. ${counts[item]} × ${escape(p.name)}</text><text x="${px}" y="${py+13}" font-size="8" fill="#68755e">${p.w} × ${p.d} m footprint</text>`;});
 svg+=`<text x="45" y="781" font-size="8" letter-spacing="1">METRIC CONCEPT LAYOUT / EDITABLE IN THE PLAYGROUND / SITE DIMENSIONS TO BE CONFIRMED</text></g></svg>`;
 fs.writeFileSync(path.join(__dirname,`../assets/styling/commercial/${kind}-plan.svg`),svg);
}
