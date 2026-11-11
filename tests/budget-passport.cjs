const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const fs=require('node:fs/promises');
const path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..'),base=process.env.QA_BASE_URL||'http://127.0.0.1:8007';
 let server,browser;
 try{
  if(!process.env.QA_BASE_URL)server=spawn('python3',['-m','http.server','8007','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
  for(let i=0;i<50;i++){try{const response=await fetch(base);await response.text();if(response.ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/playground.html');
  await page.locator('#engine-name').fill('<Budget & passport>');
  await page.locator('#studio-engine-card summary').click();
  for(const [id,value]of Object.entries({'engine-budget':'20000000','engine-installation':'1000000','engine-delivery':'300000','engine-tax':'0','engine-contingency':'10'}))await page.locator('#'+id).fill(value);
  const get=()=>page.evaluate(()=>{const raw=SECHA_PLAYGROUND_BRIDGE.capture();return StudioEngine.analyze({format:StudioEngine.FORMAT,version:1,projectId:raw.projectId,layout:raw.layout,assumptions:{budget:20000000,installation:1000000,delivery:300000,tax:0,contingencyPct:10}}).summary;});
  let s=await get();
  assert.equal(await page.locator('#budget-total').textContent(),s.total.toLocaleString('id-ID'));
  await page.locator('#save-project').click();await page.reload();
  assert.equal(await page.locator('#engine-installation').inputValue(),'1000000');
  await page.locator('#add-floor').click();s=await get();
  assert.equal(await page.locator('#budget-total').textContent(),s.total.toLocaleString('id-ID'));
  await page.locator('#engine-name').fill('<Budget & passport>');
  await page.locator('#engine-review').click();await page.locator('#engine-download').waitFor({state:'visible'});
  const [popup]=await Promise.all([page.waitForEvent('popup'),page.locator('#engine-download').click()]);
  await popup.waitForLoadState();assert.equal(await popup.locator('h1').textContent(),'<Budget & passport>');
  assert.equal(await popup.locator('svg').count(),s.floors);
  assert.match(await popup.locator('body').textContent(),/Installation/);
  await fs.mkdir(path.join(root,'qa-artifacts'),{recursive:true});
  const pdf=await popup.pdf({path:path.join(root,'qa-artifacts/project-passport.pdf'),format:'A4',printBackground:true});assert.equal(pdf.subarray(0,5).toString(),'%PDF-');
  await popup.close();
  // Intercept the OS navigation and inspect exactly what is handed off, without contacting OS.
  await page.evaluate(()=>{window.transferURL=null;const click=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){if(this.href.includes('#studio-passport='))window.transferURL=this.href;else click.call(this);};});
  await page.locator('#engine-continue').click();
  const transferred=await page.evaluate(()=>StudioEngine.analyze(StudioEngineUI.decode(window.transferURL.split('#studio-passport=')[1])).summary);
  assert.deepEqual(transferred,s);
  await page.locator('#studio-engine-card summary').click();
  await page.locator('#engine-budget').fill('0');assert.match(await page.locator('#budget-caption').textContent(),/over budget/);assert.equal(await page.locator('#engine-continue').isVisible(),false);
  await page.locator('#engine-tax').fill('');assert.match(await page.locator('#budget-caption').textContent(),/incomplete/);
  await page.locator('[data-mode="walk"]').click();assert.match(await page.locator('#play-budget').textContent(),/estimated/);assert.doesNotMatch(await page.locator('body').innerText(),/\bXP\b/);
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const violations=await page.evaluate(async()=> (await axe.run({include:['.budget-card','#studio-engine-card']},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id));assert.deepEqual(violations,[]);
  assert.deepEqual(errors,[]);console.log('PASS: live costs, persisted allowances, all floors, PDF output, escaped project text, OS transfer parity, zero budget, incomplete costs, XP removal, mobile and accessibility');
 }finally{await browser?.close();server?.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
