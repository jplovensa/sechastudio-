const test=require('node:test');
const assert=require('node:assert/strict');
const {catalog,layouts}=require('../js/commercial-layouts.js');
for(const [type,layout] of Object.entries(layouts)) {
 test(`${type}: metric starter fits its room without furniture overlaps`,()=>{
  const items=layout.pieces.map(([kind,x,z,r])=>{const c=catalog[kind];assert.ok(c,kind);return {kind,x,z,w:r%2?c.d:c.w,d:r%2?c.w:c.d};});
  assert.ok(items.length>=12);
  for(let i=0;i<items.length;i++) {
   const a=items[i];assert.ok(Math.abs(a.x)+a.w/2<=layout.w/2-.12,`${a.kind}: x boundary`);assert.ok(Math.abs(a.z)+a.d/2<=layout.d/2-.12,`${a.kind}: z boundary`);
   for(let j=0;j<i;j++){const b=items[j];assert.ok(!(Math.abs(a.x-b.x)<(a.w+b.w)/2+.035&&Math.abs(a.z-b.z)<(a.d+b.d)/2+.035),`${a.kind} overlaps ${b.kind}`);}
  }
  // A 0.38 m avatar can enter and travel up the central circulation route.
  for(let z=layout.entry.z;z>=.8;z-=.1)assert.ok(!items.some(i=>Math.abs(i.x)<(i.w+.38)/2+.025&&Math.abs(z-i.z)<(i.d+.38)/2+.025),`Blocked entry route at ${z.toFixed(1)} m`);
 });
}
test('Ember has the stated six bar stools, two four-seat banquettes and 4.8 m counter',()=>{
 const count=kind=>layouts.bar.pieces.filter(p=>p[0]===kind).length;
 assert.equal(count('stool'),6);assert.equal(count('banquette'),2);assert.equal(count('barCounter')*catalog.barCounter.w,4.8);
 assert.equal(count('stool')+count('banquette')*catalog.banquette.seats,14);
});
