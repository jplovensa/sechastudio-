const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:process.env.QA_MOTION==='normal'?'no-preference':'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
  const base=process.env.QA_BASE_URL||'http://127.0.0.1:8055';
  await page.goto(base+'/playground.html');await page.locator('#save-project').click();
  await page.evaluate(()=>{const state=JSON.parse(localStorage.getItem('secha-playground-v1'));delete state.floors;delete state.activeFloor;Object.assign(state,{startMode:'blank',dimensions:{w:8,d:6},residentialStyle:'warm-modern',items:[{id:100,kind:'chair',x:-1,z:1.3,r:0},{id:101,kind:'table',x:1,z:1.3,r:0},{id:102,kind:'lamp',x:-2,z:-1,r:0},{id:103,kind:'plant',x:2,z:-1,r:0},{id:104,kind:'counter',x:0,z:-2,r:0}]});localStorage.setItem('secha-playground-v1',JSON.stringify(state));localStorage.removeItem('secha-play-v1');});
  await page.reload();await page.waitForFunction(()=>document.getElementById('scene').dataset.avatarSource==='makehuman');
  assert.equal(await page.locator('#webgl-fallback').isVisible(),false);
  const rig=await page.evaluate(async()=>{const model=await SECHA_RESIDENT_AVATAR.load();for(let i=0;i<120;i++)model.pose({time:i/60,dt:1/60,seated:true,seatHeight:.54});return {source:model.object.userData.source,bones:Object.keys(model.bones).length,knee:model.motion.normalized.leftLowerLeg.rotation.x,hip:model.motion.normalized.leftUpperLeg.rotation.x,pose:model.object.userData.pose};});
  assert.equal(rig.source,'MakeHuman');assert.equal(rig.bones,163);assert.equal(rig.pose,'sitting');assert.ok(rig.knee>1.5&&rig.hip< -1.5);
  await page.locator('[data-mode="walk"]').click();await page.locator('#resident-quest').click();
  await page.locator('#nearby-object').selectOption('101');await page.locator('[data-play-action="game"]').click();
  assert.equal(await page.locator('#play-game-dialog').isVisible(),true);assert.equal(await page.locator('#memory-board').isVisible(),false);
  while(await page.locator('#table-board button:not([disabled])').count()){await page.locator('#table-board button:not([disabled])').first().click();}
  assert.match(await page.locator('#game-message').textContent(),/XP/);assert.match(await page.locator('#play-wins').textContent(),/^1 /);
  await page.locator('[data-game-kind="memory"]').click();assert.equal(await page.locator('#table-board').isVisible(),false);
  const known={};for(let i=0;i<8;i+=2){for(const j of [i,i+1]){const card=page.locator(`[data-card="${j}"]`);if(await card.isDisabled())continue;await card.click();known[j]=await card.locator('span').textContent();}await page.waitForTimeout(900);}
  const pairs={};for(const [id,name]of Object.entries(known))(pairs[name]??=[]).push(id);
  for(const ids of Object.values(pairs)){for(const id of ids){const card=page.locator(`[data-card="${id}"]`);if(!await card.isDisabled())await card.click();}}
  assert.equal(await page.locator('#memory-board button:disabled').count(),8);assert.match(await page.locator('#play-wins').textContent(),/^2 /);
  await page.screenshot({path:'qa-artifacts/resident-material-match.png'});await page.keyboard.press('Escape');assert.equal(await page.locator('#play-game-dialog').isVisible(),false);
  await page.locator('#nearby-object').selectOption('100');await page.locator('[data-play-action="sit"]').click();
  await page.waitForFunction(()=>document.getElementById('scene').dataset.residentPose==='sitting');await page.locator('#scene').focus();await page.keyboard.down('w');await page.waitForTimeout(300);await page.keyboard.up('w');assert.equal(await page.locator('#scene').getAttribute('data-resident-pose'),'sitting');
  await page.locator('#workspace').screenshot({path:'qa-artifacts/makehuman-sitting.png'});await page.keyboard.press('e');await page.waitForFunction(()=>document.getElementById('scene').dataset.residentPose==='standing');
  await page.locator('#play-destination').selectOption('102');await page.locator('#go-play-destination').click();
  await page.waitForFunction(()=>document.querySelector('#nearby-object option[value="102"]'),null,{timeout:15000}).catch(async error=>{console.log(await page.evaluate(()=>({status:document.getElementById('status').textContent,scene:document.getElementById('scene').dataset,rect:document.getElementById('scene').getBoundingClientRect().toJSON(),near:document.getElementById('nearby-object').innerHTML})));await page.screenshot({path:'qa-artifacts/play-route-failure.png'});throw error;});await page.locator('#nearby-object').selectOption('102');await page.locator('[data-play-action="light"]').click();
  await page.locator('#save-project').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('secha-playground-v1')).items.find(item=>item.id===102).lightOn),true);
  assert.equal(await page.locator('#room-quest-list .complete').count(),3);
  await page.locator('#resident-wave').click();await page.locator('#resident-outfit').selectOption('#884f3b');
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const audit=async()=>assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))),[]);
  await audit();await page.setViewportSize({width:390,height:844});await page.locator('#workspace').scrollIntoViewIfNeeded();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await audit();await page.screenshot({path:'qa-artifacts/resident-mobile.png'});
  const xp=await page.locator('#play-xp').textContent();await page.reload();await page.locator('[data-mode="walk"]').click();assert.equal(await page.locator('#play-xp').textContent(),xp);
  await page.locator('#nearby-object').selectOption('100');await page.locator('[data-play-action="sit"]').click();
  await page.locator('#add-floor').click();await page.waitForFunction(()=>document.getElementById('scene').dataset.residentPose==='standing');
  assert.equal(await page.locator('#interaction-actions button').count(),0);assert.equal(await page.locator('#nearby-object').isDisabled(),true);
  await page.locator('#undo-action').click();assert.equal(await page.locator('#floor-select option').count(),1);
  await page.locator('[data-mode="build"]').click();assert.equal(await page.locator('#walk-interactions').isVisible(),false);
  const fallback=await browser.newPage();await fallback.route('**/assets/avatar/resident.bin',route=>route.abort());await fallback.goto(base+'/playground.html');await fallback.waitForFunction(()=>document.getElementById('scene').dataset.avatarSource==='fallback');assert.equal(await fallback.locator('#webgl-fallback').isVisible(),false);await fallback.close();
  assert.deepEqual(errors,[]);console.log('PASS: CC0 MakeHuman rig, sitting/standing, collision-safe navigation, tabletop AI, material match, room quest, working lamps, outfits, local XP, asset fallback, mobile and WCAG');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
