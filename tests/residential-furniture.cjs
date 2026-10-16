const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const fs=require('node:fs/promises');
(async()=>{
 const server=spawn('python3',['-m','http.server','8046','--bind','127.0.0.1'],{stdio:'ignore'});
 let browser;
 try {
  for(let i=0;i<40;i++){try{if((await fetch('http://127.0.0.1:8046/playground.html')).ok)break;}catch{} await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:1050},acceptDownloads:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const save=async()=>{await page.locator('#save-project').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('secha-playground-v1')));};
  await page.goto('http://127.0.0.1:8046/playground.html?space=residence&style=soft-contemporary');
  assert.equal(await page.locator('#scene canvas').count(),1);
  assert.equal(await page.locator('#webgl-fallback').isVisible(),false);
  // Verify every model stays in its declared footprint, for all 4 collections and 3 tiers.
  const geometry=await page.evaluate(()=>{
   const api=SECHA_RESIDENTIAL_FURNITURE;
   const basics={sofa:{w:2.1,d:.9},chair:{w:.85,d:.85},table:{w:1.1,d:.65},bed:{w:1.7,d:2.15},desk:{w:1.5,d:.7},counter:{w:2,d:.75},lamp:{w:.5,d:.5},plant:{w:.6,d:.6},stool:{w:.5,d:.5}};
   const failures=[], signatures={};let count=0;
   for(const [style,palette] of Object.entries(SECHA_DESIGN_OPTIONS.RESIDENTIAL_STYLES))for(const tier of Object.keys(api.tiers))for(const [kind,spec] of Object.entries({...basics,...api.catalog})){
    const group=new THREE.Group();
    const built=api.build(kind,group,{THREE,spec,palette,style,tier,material:(c,r=.8)=>new THREE.MeshStandardMaterial({color:c,roughness:r}),texture:SECHA_COMMERCIAL_FURNITURE.texture});
    if(!built||!group.children.length)failures.push(`${style}/${tier}/${kind}: empty`);
    group.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(group);
    if(b.min.x < -spec.w/2-.005 || b.max.x > spec.w/2+.005 || b.min.z < -spec.d/2-.005 || b.max.z > spec.d/2+.005)failures.push(`${style}/${tier}/${kind}: footprint ${JSON.stringify({min:b.min,max:b.max,spec})}`);
    if(kind==='sofa')signatures[`${style}/${tier}`]=group.children.map(m=>[m.geometry.type,m.geometry.attributes.position.count,m.position.toArray(),m.geometry.parameters]).map(v=>JSON.stringify(v)).join('|');
    group.traverse(m=>{m.geometry?.dispose();m.material?.dispose();});count++;
   }
   return {count,failures,signatures};
  });
  assert.deepEqual(geometry.failures,[]);
  assert.equal(geometry.count,228);
  assert.equal(new Set(Object.values(geometry.signatures)).size,12,'All collection/tier sofa geometries differ');
  // Choosing a tier affects future pieces; upgrading one piece reprices the project and supports undo.
  let project=await save();const original=project.items;const total=await page.locator('#budget-total').textContent();
  await page.locator('#furniture-tier').selectOption('lux');
  assert.deepEqual((await save()).items,original);
  await page.locator('[data-category="storage"]').click();assert.equal(await page.locator('.catalog-card').count(),5);
  assert.match(await page.locator('[data-kind="bedside"]').textContent(),/Lux.*3\.080\.000/);
  await page.locator('[data-kind="bedside"]').click();await page.locator('#scene').focus();await page.keyboard.press('Enter');
  project=await save();const piece=project.items.at(-1);assert.equal(piece.kind,'bedside');assert.equal(piece.tier,'lux');
  await page.locator(`[data-select="${piece.id}"]`).click();await page.locator('#piece-tier').selectOption('premium');
  assert.equal((await save()).items.at(-1).tier,'premium');assert.equal(await page.locator('#selected-price').textContent(),'Rp 1.815.000');
  await page.locator('#undo-action').click();assert.equal((await save()).items.at(-1).tier,'lux');
  const currency=n=>new Intl.NumberFormat('id-ID').format(n);
  assert.equal(await page.locator('#budget-total').textContent(),currency(Number(total.replaceAll('.',''))+3080000));
  for(const style of ['warm-modern','soft-contemporary','earthy-retreat','urban-studio']){
   await page.locator('#residential-style').selectOption(style);assert.equal((await save()).items.at(-1).tier,'lux');
   await page.locator('#workspace').screenshot({path:`qa-artifacts/residence-${style}.png`});
  }
  await page.locator('#add-floor').click();assert.equal(await page.locator('#furniture-tier').inputValue(),'lux');
  await page.locator('#floor-select').selectOption('0');await save();await page.goto('http://127.0.0.1:8046/playground.html');
  assert.equal((await save()).items.at(-1).tier,'lux');
  const download=page.waitForEvent('download');await page.locator('#export-project').click();const file=await download;const exported=JSON.parse(await fs.readFile(await file.path(),'utf8'));assert.equal(exported.project.floors[0].items.at(-1).tier,'lux');
  assert.equal(exported.estimatedTotal,Number((await page.locator('#budget-total').textContent()).replaceAll('.','')));
  await page.setViewportSize({width:390,height:844});
  await page.locator(`[data-select="${piece.id}"]`).click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  const panelBox=await page.locator('#selection-panel').boundingBox(), toastBox=await page.locator('#status').boundingBox();
  assert.ok(toastBox.y+toastBox.height<=panelBox.y,'Status message stays above piece controls');
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))),[]);
  await page.screenshot({path:'qa-artifacts/residential-furniture-mobile.png',fullPage:true});
  // Existing multi-floor saves gain a Standard placement tier on every floor.
  const legacy=await save();delete legacy.furnitureTier;legacy.floors.forEach(floor=>delete floor.furnitureTier);
  await page.evaluate(project=>localStorage.setItem('secha-playground-v1',JSON.stringify(project)),legacy);await page.reload();
  assert.ok((await save()).floors.every(floor=>floor.furnitureTier==='standard'));
  // A forged tier is rejected on restore rather than influencing prices.
  const forged=await save();forged.floors[0].items[0].tier='free';
  await page.evaluate(project=>localStorage.setItem('secha-playground-v1',JSON.stringify(project)),forged);await page.reload();assert.equal(await page.locator('[data-space="studio"]').getAttribute('aria-pressed'),'true');
  assert.deepEqual(errors,[]);
  console.log('PASS: 228 model footprints, 12 distinct sofa geometries, 10 new furniture pieces, tier prices, placement, upgrades/undo, palettes, floors, save/export, invalid tiers, mobile and WCAG');
 }finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
