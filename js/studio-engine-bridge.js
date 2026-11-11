(()=>{
const E=window.StudioEngine,U=window.StudioEngineUI,$=id=>document.getElementById(id);
const OS='https://script.google.com/a/macros/sechahome.com/s/AKfycbzyrWH1KDNYp64tfWDudhqM8ZGifI-a7OAXrFoSMlZobeOJMopTKoaICyhBp9b_DH99qw/exec';
const API='/api/studio-engine';
let current=null,report=null,serial=0,inheritedConstraints={measurementsConfirmed:false,keepPieceIds:[]};
const amount=id=>$(id).value.trim()===''?null:Number($(id).value);
function passport(){
 const raw=window.SECHA_PLAYGROUND_BRIDGE.capture();
 return E.normalize({format:E.FORMAT,version:1,projectId:raw.projectId,name:$('engine-name').value||raw.name,brief:$('engine-brief').value,layout:raw.layout,
 assumptions:{budget:amount('engine-budget'),installation:amount('engine-installation'),delivery:amount('engine-delivery'),tax:amount('engine-tax'),contingencyPct:amount('engine-contingency')??10},
 constraints:{...inheritedConstraints,noDemolition:$('engine-no-demolition').checked}});
}

const budgetFields=['engine-budget','engine-installation','engine-delivery','engine-tax','engine-contingency'];
function persistBudget(){try{localStorage.setItem('secha-budget-v1',JSON.stringify(Object.fromEntries(budgetFields.map(id=>[id,$(id).value]))));}catch{}}
function refreshBudget(){
 try{const r=E.analyze(passport()),s=r.summary,a=r.assumptions;
 $('budget-total').textContent=Math.round(s.total).toLocaleString('id-ID');
 $('budget-caption').textContent=(s.remaining===null?'Set a project budget':s.remaining<0?U.money(-s.remaining)+' over budget':U.money(s.remaining)+' remaining')+(s.costsComplete?'':' · Allowances incomplete');
 $('budget-breakdown').innerHTML=U.costBreakdown(r);
 const usage=s.budget===null?0:s.budget===0?(s.total>0?100:0):Math.min(100,s.total/s.budget*100);
 $('budget-progress').style.width=usage+'%';$('budget-progress').style.background=s.remaining!==null&&s.remaining<0?'#b56a4f':'#788d55';
 for(const id of ['walk-budget','play-budget'])$(id).textContent=U.money(s.total)+' estimated';
 }catch(e){$('budget-total').textContent='—';$('budget-breakdown').textContent='Correct budget inputs to calculate the estimate.';$('budget-progress').style.width='0%';$('budget-caption').textContent=e.message;for(const id of ['walk-budget','play-budget'])$(id).textContent='Check budget inputs';}
}
window.SECHA_UPDATE_BUDGET=refreshBudget;

function invalidate(){refreshBudget();persistBudget();serial++;current=report=null;$('engine-result').innerHTML='';$('engine-continue').hidden=true;$('engine-download').hidden=true;$('engine-status').textContent='Review again after changing your design or allowances.';}
async function review(){
 const turn=++serial;$('engine-review').disabled=true;
 try{const p=passport();let r;let connection='Shared engine connected';
  try{const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p),signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error();r=await response.json();if(r.projectId!==p.projectId||r.engineVersion!==E.VERSION)throw Error();}
  catch{r=E.analyze(p);connection='Checks ran on this device; shared service unavailable';}
  if(turn!==serial)return; r={...r,summary:E.analyze(p).summary};current=p;report=r;$('engine-result').innerHTML=U.report(r);$('engine-status').textContent=connection+' · v'+r.engineVersion+' · neural recommendations not connected';
  $('engine-continue').hidden=false;$('engine-download').hidden=false;
 }catch(e){$('engine-status').textContent=e.message;}finally{$('engine-review').disabled=false;}
}
$('engine-review').onclick=review;
$('engine-download').onclick=()=>{try{if(current)U.printPassport(current);}catch(e){$('engine-status').textContent=e.message;}};
$('engine-continue').onclick=()=>{
 try{const p=passport();if(!current||JSON.stringify(p)!==JSON.stringify(current))return invalidate();
 const encoded=U.encode(p);if(encoded.length>16000){$('engine-status').textContent='This project is too large for the current OS link transfer. Print the PDF passport for review; a larger structured transfer requires OS support.';return;}
 else{const a=document.createElement('a');a.href=OS+'#studio-passport='+encoded;a.target='_blank';a.rel='noopener noreferrer';a.click();$('engine-status').textContent='Continue in the new tab. Review the project there, then choose Save to OS. Your playground stays here.';}
 }catch(e){$('engine-status').textContent=e.message;}
};
$('engine-result').onclick=e=>{
 const button=e.target.closest('[data-engine-alternative]');if(!button||!current)return;
 try{const next=E.applyAlternative(current,button.dataset.engineAlternative);window.SECHA_PLAYGROUND_BRIDGE.restore(next);invalidate();$('engine-status').textContent='Alternative applied to the playground. Review again to compare the revised total.';}catch(err){$('engine-status').textContent=err.message;}
};
document.addEventListener('studio:changed',invalidate);
$('studio-engine-card').addEventListener('input',invalidate);
$('studio-engine-card').addEventListener('change',invalidate);
try{
 const incoming=location.hash.match(/^#studio-passport=(.+)$/);
 if(incoming){const p=U.decode(incoming[1]);inheritedConstraints=p.constraints;window.SECHA_PLAYGROUND_BRIDGE.restore(p);$('engine-name').value=p.name;$('engine-brief').value=p.brief;
 for(const [id,key]of [['engine-budget','budget'],['engine-installation','installation'],['engine-delivery','delivery'],['engine-tax','tax'],['engine-contingency','contingencyPct']])$(id).value=p.assumptions[key]??'';
 $('engine-no-demolition').checked=p.constraints.noDemolition;history.replaceState(null,'',location.pathname+location.search);$('engine-status').textContent='OS project restored. All floors and piece positions retained. Review to refresh checks.';}
 else{$('engine-budget').value=window.SECHA_PLAYGROUND_BRIDGE.capture().budget;$('engine-name').value=window.SECHA_PLAYGROUND_BRIDGE.capture().name;try{const saved=JSON.parse(localStorage.getItem('secha-budget-v1'));for(const id of budgetFields)if(typeof saved?.[id]==='string')$(id).value=saved[id];}catch{}}
}catch(e){$('engine-status').textContent='Transfer could not be restored: '+e.message;}
refreshBudget();persistBudget();
$('engine-file').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>160000)throw Error('Maximum passport size is 160 KB');const p=E.normalize(JSON.parse(await file.text()));inheritedConstraints=p.constraints;$('engine-no-demolition').checked=p.constraints.noDemolition;window.SECHA_PLAYGROUND_BRIDGE.restore(p);$('engine-name').value=p.name;$('engine-brief').value=p.brief;for(const [id,k]of [['engine-budget','budget'],['engine-installation','installation'],['engine-delivery','delivery'],['engine-tax','tax'],['engine-contingency','contingencyPct']])$(id).value=p.assumptions[k]??'';invalidate();$('engine-status').textContent='Project restored from passport. Review to refresh checks.';}catch(err){$('engine-status').textContent=err.message;}};
})();
