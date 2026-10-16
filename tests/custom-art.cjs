const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
(async () => {
 const server=spawn('python3',['-m','http.server','8049','--bind','127.0.0.1'],{stdio:'ignore'});let browser;
 try {
  for(let i=0;i<40;i++){try{if((await fetch('http://127.0.0.1:8049')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
  for(const [width,height] of [[1440,900],[768,900],[390,844],[320,740]]) {
   const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8049',{waitUntil:'domcontentloaded'});
   await page.locator('#commercial-styling').scrollIntoViewIfNeeded();
   assert.ok((await page.locator('#commercial-styling').boundingBox()).height<=height-50,'Commercial edition fits a screen');
   await page.locator('[data-commercial-step="1"]').click();assert.equal(await page.locator('#commercial-position').textContent(),'02 / 05');
   await page.locator('[data-commercial-step="-1"]').click();assert.equal(await page.locator('#commercial-position').textContent(),'01 / 05');
   await page.locator('[data-commercial-filter="commercial-cafe"]').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#commercial-position').textContent(),'02 / 05');
   const edition=await page.locator('.commercial-style-card:visible').boundingBox(),cta=await page.locator('.commercial-style-card:visible .commercial-plan-link').boundingBox();
   assert.ok(cta.y>=edition.y && cta.y+cta.height<=edition.y+edition.height+1,'Playground CTA is pinned inside the edition');
   await page.locator('#commercial-styling').screenshot({path:`qa-artifacts/commercial-fit-${width}.png`});
   for(const direction of ['painted-walls','original-art','home-accessories']) {
    await page.locator(`[data-art="${direction}"]`).click();
    assert.match(await page.locator('#art-image').getAttribute('src'),new RegExp(direction+'\\.webp$'));
    await page.locator('#art-image').evaluate(image=>image.decode());
    assert.equal(await page.locator('[data-art][aria-pressed="true"]').count(),1);
   }
   await page.locator('[data-art-palette="Earth"]').click();await page.locator('#art-commission').click();
   assert.equal(await page.locator('#art-brief-type').inputValue(),'home-accessories');assert.equal(await page.locator('#art-brief-palette').inputValue(),'Earth');
   await page.locator('#art-brief-size').fill('Two handmade vessels');
   await page.locator('#art-brief-notes').fill('<img src=x onerror=alert(1)> Sculptural, warm clay.');
   await page.locator('#art-brief-form button').click();assert.equal(await page.locator('#art-brief-form').isVisible(),false);assert.equal(await page.locator('#art-brief-result').isVisible(),true);
   assert.equal(await page.locator('#art-brief-summary img').count(),0);
   const target=new URL(await page.locator('#art-whatsapp').getAttribute('href'));assert.equal(target.host,'wa.me');assert.equal(target.pathname,'/6287786010290');assert.match(target.searchParams.get('text'),/Two handmade vessels/);assert.match(target.searchParams.get('text'),/Earth/);
   await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   const audit=async selector=>assert.deepEqual(await page.evaluate(async selector=>(await axe.run(document.querySelector(selector),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),selector),[]);
   await audit('#art-brief-dialog');await page.locator('#art-brief-edit').click();assert.equal(await page.locator('#art-brief-size').inputValue(),'Two handmade vessels');
   await page.keyboard.press('Escape');assert.equal(await page.locator('#art-brief-dialog').isVisible(),false);assert.equal(await page.locator('#art-commission').evaluate(button=>document.activeElement===button),true);
   await audit('#custom-art');await audit('#commercial-styling');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.locator('#custom-art').screenshot({path:`qa-artifacts/custom-art-${width}.png`});
   assert.deepEqual(errors,[]);console.log(`PASS ${width}×${height}: commercial fit/navigation, three art directions, palette, brief/edit/handoff, escaping, focus, WCAG and no overflow`);
   await page.close();
  }
 } finally {await browser?.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
