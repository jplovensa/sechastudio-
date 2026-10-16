const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const fs=require('node:fs/promises');
(async()=>{
 const server=spawn('python3',['-m','http.server','8042','--bind','127.0.0.1'],{stdio:'ignore'});
 let browser;
 try {
  for(let i=0;i<40;i++){try{if((await fetch('http://127.0.0.1:8042/playground.html')).ok)break;}catch{} await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const save=async()=>{await page.locator('#save-project').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('secha-playground-v1')));};
  await page.goto('http://127.0.0.1:8042/playground.html?space=residence&style=earthy-retreat');
  assert.equal(await page.locator('#residential-style').inputValue(),'earthy-retreat');
  const original=await save();assert.equal(original.items.length,8);
  for(const style of ['warm-modern','soft-contemporary','earthy-retreat','urban-studio']){
   await page.locator('#residential-style').selectOption(style);
   assert.equal((await save()).residentialStyle,style);
   assert.equal(await page.locator('#residential-swatches span').count(),4);
  }
  const ground=await save();
  await page.locator('#add-floor').click();
  assert.equal(await page.locator('.placed-piece').count(),0);
  await page.locator('#residential-style').selectOption('soft-contemporary');
  await page.locator('#room-width').fill('12');await page.locator('#room-depth').fill('10');await page.locator('#room-size button').click();
  await page.locator('[data-kind="plant"]').click();await page.locator('#scene').focus();await page.keyboard.press('Enter');
  let project=await save();assert.equal(project.items.length,1);assert.equal(project.floors[0].items.length,8);assert.deepEqual(project.dimensions,{w:12,d:10});
  await page.locator('#floor-select').selectOption('0');project=await save();assert.deepEqual(project.items,ground.items);assert.equal(project.residentialStyle,'urban-studio');
  await page.locator('#floor-select').selectOption('1');await save();await page.goto('http://127.0.0.1:8042/playground.html');
  project=await save();assert.equal(project.activeFloor,1);assert.equal(project.items.length,1);assert.equal(project.residentialStyle,'soft-contemporary');
  await page.locator('#remove-floor').click();assert.equal((await save()).floors.length,1);
  await page.locator('#undo-action').click();project=await save();assert.equal(project.floors.length,2);assert.equal(project.items.length,1);
  await page.locator('#moodboard-select').selectOption('purist');
  assert.equal((await save()).residentialStyle,null);
  await page.locator('#undo-action').click();assert.equal((await save()).residentialStyle,'soft-contemporary');
  await page.locator('#reset-project').click();assert.equal((await save()).floors[0].items.length,8);
  await page.locator('#undo-action').click();
  const download=page.waitForEvent('download');await page.locator('#export-project').click();const file=await download;const exported=JSON.parse(await fs.readFile(await file.path(),'utf8'));assert.equal(exported.project.floors.length,2);assert.equal(exported.estimatedTotal,project.floors.flatMap(f=>f.items).reduce((n,i)=>n+(i.kind==='plant'?450000:({bed:4800000,desk:2400000,sofa:4200000,chair:1800000,table:1200000,counter:3600000,lamp:850000}[i.kind])),0));
  for(let i=0;i<4;i++)await page.locator('#add-floor').click();assert.equal(await page.locator('#floor-select option').count(),6);assert.equal(await page.locator('#add-floor').isDisabled(),true);
  await page.screenshot({path:'qa-artifacts/playground-floors-desktop.png'});
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)),[]);
  await page.screenshot({path:'qa-artifacts/playground-floors-mobile.png',fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('PASS: collection palettes, independent floors, dimensions, placement, save/reload, removal/undo, export, six-floor limit, mobile and accessibility');
 }finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
