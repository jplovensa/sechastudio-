/* Local play controller: proximity interactions, sitting, room quests and two games. */
(() => {
 const rules=window.SECHA_PLAY_RULES, $=id=>document.getElementById(id);
 window.SECHA_PLAYGROUND_PLAY={create(bridge){
  let layoutSignature='',mode='build', seated=null, targetId=null, signature='', waveUntil=0,drinkUntil=0, quest=null, round=0, timeout;
  let profile={xp:0,wins:0,awards:[]};
  try{const value=JSON.parse(localStorage.getItem('secha-play-v1'));if(value&&Number.isSafeInteger(value.xp)&&value.xp>=0&&value.xp<=100000&&Number.isSafeInteger(value.wins)&&value.wins>=0&&value.wins<100000&&Array.isArray(value.awards))profile={xp:value.xp,wins:value.wins,awards:value.awards.filter(key=>typeof key==='string'&&key.length<150).slice(-512)};}catch{}
  const label={sit:'Take a seat',game:'Play at the table',light:'Try the lighting',care:'Care for a plant',coffee:'Make a coffee'};
  function save(){try{localStorage.setItem('secha-play-v1',JSON.stringify(profile));}catch{}renderProgress();}
  function renderProgress(){const previous=$('play-destination').value;$('play-destination').innerHTML=bridge.state().items.filter(item=>rules.actions(item.kind).length).map(item=>`<option value="${item.id}">${bridge.catalog[item.kind].name}</option>`).join('');if([...$('play-destination').options].some(option=>option.value===previous))$('play-destination').value=previous; $('walk-xp').textContent=`${profile.xp} XP`;$('walk-quest-hint').textContent=quest?.length?`${quest.filter(goal=>goal.done).length} / ${quest.length} discoveries`:'Make yourself at home.'; $('play-xp').textContent=`${profile.xp} XP`; $('play-level').textContent=profile.xp>=150?'Studio resident':profile.xp>=60?'Space stylist':'Room explorer';$('play-wins').textContent=`${profile.wins} games completed`;
   $('room-quest-list').innerHTML=quest?quest.map(goal=>`<li class="${goal.done?'complete':''}">${goal.done?'✓':'○'} ${label[goal.action]}</li>`).join(''):'<li>Start a room quest to discover this floor.</li>';
  }
  function award(action,item,points=10){const state=bridge.state();const key=[state.type,state.commercialType,state.activeFloor,item?.id||0,action].join(':');if(!profile.awards.includes(key)){profile.awards.push(key);profile.awards=profile.awards.slice(-512);profile.xp=Math.min(100000,profile.xp+points);}
   if(quest)for(const goal of quest)if(goal.action===action&&goal.id===item?.id)goal.done=true;
   if(quest?.length&&quest.every(goal=>goal.done)&&!quest.rewarded){quest.rewarded=true;profile.xp=Math.min(100000,profile.xp+30);bridge.notify('Room quest complete. +30 XP. This space feels like home.');}
   save();
  }
  function nearby(){return bridge.state().items.filter(item=>rules.actions(item.kind).length&&rules.distance(bridge.position,item,bridge.catalog[item.kind])<=1.25).sort((a,b)=>rules.distance(bridge.position,a,bridge.catalog[a.kind])-rules.distance(bridge.position,b,bridge.catalog[b.kind]));}
  function stand(silent=false){if(!seated)return true;const seat=seated;const candidates=[seat.exit,seat.before];const exit=candidates.find(p=>p&&bridge.walkable(p.x,p.z));if(!exit){if(!silent)bridge.notify('The exit is blocked. Switch to Build mode to clear the seat.');return false;}seated=null;bridge.setPosition(exit.x,exit.z,seat.rotation);signature='';if(!silent)bridge.notify('Back on your feet.');return true;}
  function reset(){stand(true);seated=null;quest=null;targetId=null;signature='';waveUntil=drinkUntil=0;closeGame();renderProgress();}
  function accessibleFront(item){const s=bridge.catalog[item.kind],a=item.r*Math.PI/2,forward={x:Math.sin(a),z:Math.cos(a)},exit={x:item.x+forward.x*(s.d/2+.26),z:item.z+forward.z*(s.d/2+.26)};
   if(!bridge.walkable(exit.x,exit.z)||Math.hypot(exit.x-bridge.position.x,exit.z-bridge.position.z)>1.8)return null;
   const distance=Math.hypot(exit.x-bridge.position.x,exit.z-bridge.position.z),steps=Math.max(1,Math.ceil(distance/.08));for(let i=1;i<=steps;i++)if(!bridge.walkable(bridge.position.x+(exit.x-bridge.position.x)*i/steps,bridge.position.z+(exit.z-bridge.position.z)*i/steps))return null;return exit;
  }
  function interact(action){if(mode!=='walk'||$('play-game-dialog').open)return;
   if(action==='stand'){stand();return;}
   const item=seated&&action==='game'?nearby().find(i=>rules.tables.includes(i.kind)):nearby().find(i=>i.id===targetId);if(!item||!rules.actions(item.kind).includes(action)){bridge.notify('Walk closer to a piece to interact.');return;}
   bridge.stop();
   if(action==='sit'){
    const exit=accessibleFront(item);if(!exit){bridge.notify('Walk around to the open front of this seat.');return;}
    const takeSeat=()=>{if(mode!=='walk'||!bridge.state().items.some(piece=>piece.id===item.id))return;bridge.stop();seated={id:item.id,exit,before:{...bridge.position},rotation:item.r*Math.PI/2};bridge.setPosition(item.x,item.z,item.r*Math.PI/2);award('sit',item);signature='';bridge.notify('Take a moment. Press E or Stand up to get moving.');};
    if(Math.hypot(exit.x-bridge.position.x,exit.z-bridge.position.z)>.12){bridge.approachSeat(exit,takeSeat);bridge.notify('Walking to the front of your seat.');}else takeSeat();
   }else if(action==='game'){openGame(item);}
   else if(action==='light'){bridge.toggleLamp(item);award('light',item);bridge.notify(item.lightOn?'A warmer corner. Lamp switched on.':'Lamp switched off.');}
   else {waveUntil=performance.now()+2000;if(action==='coffee')drinkUntil=performance.now()+4000;award(action,item);bridge.notify(action==='care'?'Plant cared for. A little daily ritual.':'Coffee break. Enjoy your space.');}
   signature='';bridge.invalidate();
  }
  function updateHUD(){const list=nearby();if(!list.some(item=>item.id===targetId))targetId=list[0]?.id??null;
   const item=list.find(item=>item.id===targetId);const key=JSON.stringify([seated?.id,targetId,list.map(i=>[i.id,i.lightOn])]);if(key===signature)return;signature=key;
   $('nearby-object').innerHTML=list.length?list.map(i=>`<option value="${i.id}">${bridge.catalog[i.kind].name}</option>`).join(''):'<option value="">Walk toward furniture</option>';
   $('nearby-object').value=targetId??'';$('nearby-object').disabled=!!seated||!list.length;
   $('interaction-state').textContent=seated?'Sitting comfortably':item?'Within reach · E to interact':'Explore your room';
   const actions=seated?['stand',...(list.some(i=>rules.tables.includes(i.kind))?['game']:[])]:item?rules.actions(item.kind):[];
   $('interaction-actions').innerHTML=actions.map(action=>`<button type="button" data-play-action="${action}">${action==='stand'?'Stand up':action==='sit'?'Sit down':action==='game'?'Play games':action==='light'?(item.lightOn?'Switch off':'Switch on'):action==='care'?'Water plant':'Make coffee'}</button>`).join('');
   $('scene').dataset.residentPose=seated?'sitting':'standing';$('scene').dataset.interactionTarget=targetId??'';
  }
  $('nearby-object').addEventListener('change',event=>{targetId=Number(event.target.value);signature='';updateHUD();});
  $('interaction-actions').addEventListener('click',event=>{const button=event.target.closest('[data-play-action]');if(button)interact(button.dataset.playAction);});
  $('go-play-destination').addEventListener('click',()=>{if(mode!=='walk'||!stand())return;bridge.stop();bridge.navigate(Number($('play-destination').value));});
  $('resident-wave').addEventListener('click',()=>{bridge.stop();waveUntil=performance.now()+2500;bridge.invalidate();bridge.notify('Hello from your new space.');});
  $('resident-run').addEventListener('click',event=>{const button=event.currentTarget;button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed')!=='true'));$('scene').focus({preventScroll:true});bridge.notify(button.getAttribute('aria-pressed')==='true'?'Run mode. Choose a destination or use the direction controls.':'Back to a comfortable walking pace.');});
  $('resident-outfit').addEventListener('change',event=>{bridge.outfit(event.target.value);bridge.invalidate();});
  $('resident-quest').addEventListener('click',()=>{$('start-room-quest').click();$('scene').focus({preventScroll:true});});
  $('start-room-quest').addEventListener('click',()=>{
   const options=[],seen=new Set();for(const item of bridge.state().items)for(const action of rules.actions(item.kind))if(!seen.has(action)){seen.add(action);options.push({id:item.id,action,done:false});}
   quest=options.slice(0,3);renderProgress();bridge.notify(quest.length?'Room quest started. Walk to each piece and complete its activity.':'This floor is empty. Add seating, a table, lighting or a plant in Build mode.');
  });
  function closeGame(){clearTimeout(timeout);round++;if($('play-game-dialog').open)$('play-game-dialog').close();}
  let gameItem=null, game='table', board=[], matches=[],flipped=[],locked=false,turns=0;
  const dialog=$('play-game-dialog');
  function openGame(item){gameItem=item;bridge.stop();dialog.showModal();document.body.classList.add('play-game-open');startGame('table');}
  function startGame(kind){clearTimeout(timeout);round++;game=kind;board=Array(9).fill(null);flipped=[];locked=false;turns=0;
   matches=['Oak','Linen','Stone','Clay','Oak','Linen','Stone','Clay'].map((name,id)=>({name,id,done:false}));for(let i=matches.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[matches[i],matches[j]]=[matches[j],matches[i]];}
   dialog.querySelectorAll('[data-game-kind]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.gameKind===game));$('game-message').textContent=game==='table'?'You are X. Choose a square.':'Find the four matching material pairs.';renderBoard();
  }
  function renderBoard(){ $('table-board').hidden=game!=='table';$('memory-board').hidden=game!=='memory';
   if(game==='table')$('table-board').innerHTML=board.map((cell,index)=>`<button type="button" data-square="${index}" aria-label="Square ${index+1}${cell?`, ${cell}`:', empty'}" ${cell||rules.result(board)?'disabled':''}>${cell||'<span aria-hidden="true">·</span>'}</button>`).join('');
   else $('memory-board').innerHTML=matches.map((card,index)=>`<button type="button" data-card="${index}" data-material="${flipped.includes(index)||card.done?card.name:'hidden'}" ${card.done?'disabled':''} aria-pressed="${flipped.includes(index)||card.done}" aria-label="Card ${index+1}${card.done?', matched '+card.name:flipped.includes(index)?', '+card.name:''}"><span>${flipped.includes(index)||card.done?card.name:'?'}</span></button>`).join('');
  }
  function completed(message){profile.wins++;profile.xp=Math.min(100000,profile.xp+20);award('game',gameItem,0);$('game-message').textContent=message+' +20 XP.';save();}
  $('table-board').addEventListener('click',event=>{const button=event.target.closest('[data-square]');if(!button||game!=='table')return;const i=Number(button.dataset.square);if(board[i]||rules.result(board))return;board[i]='X';if(!rules.result(board)){const move=rules.bestMove(board);if(move>=0)board[move]='O';}const end=rules.result(board);renderBoard();if(end)completed(end==='draw'?'A well-played draw.':end==='X'?'You win!':'The resident wins. Try again.');else $('game-message').textContent='Your turn. Choose an empty square.';});
  $('memory-board').addEventListener('click',event=>{const button=event.target.closest('[data-card]');if(!button||game!=='memory'||locked)return;const i=Number(button.dataset.card);if(matches[i].done||flipped.includes(i))return;flipped.push(i);renderBoard();if(flipped.length===2){turns++;const [a,b]=flipped;if(matches[a].name===matches[b].name){matches[a].done=matches[b].done=true;flipped=[];renderBoard();if(matches.every(card=>card.done))completed(`All four pairs found in ${turns} turns.`);else $('game-message').textContent='A match. Find the next pair.';}else{locked=true;const current=round;timeout=setTimeout(()=>{if(current!==round)return;flipped=[];locked=false;renderBoard();$('game-message').textContent='Try another pair.';},850);}}});
  dialog.querySelectorAll('[data-game-kind]').forEach(button=>button.addEventListener('click',()=>startGame(button.dataset.gameKind)));
  $('restart-play-game').addEventListener('click',()=>startGame(game));$('close-play-game').addEventListener('click',closeGame);
  dialog.addEventListener('close',()=>{clearTimeout(timeout);round++;document.body.classList.remove('play-game-open');bridge.stop();$('scene').focus({preventScroll:true});});
  renderProgress();
  return {
   mode(value){reset();mode=value;$('walk-interactions').hidden=value!=='walk';$('play-session').hidden=value!=='walk';signature='';if(value==='walk')updateHUD();},
   layoutChanged(){const state=bridge.state();const next=JSON.stringify([state.type,state.commercialType,state.activeFloor,state.dimensions,state.items.map(item=>[item.id,item.kind,item.x,item.z,item.r,item.tier])]);if(next!==layoutSignature){reset();layoutSignature=next;}}, blocked(){return !!seated||dialog.open;}, key(){if(dialog.open)return;interact(seated?'stand':rules.actions(nearby().find(item=>item.id===targetId)?.kind||'')[0]);},
   pick(id){if(nearby().some(item=>item.id===id)){targetId=id;signature='';updateHUD();bridge.notify('Piece selected. Choose an activity or press E.');return true;}return false;},
   tick(time,speed,dt){if(mode!=='walk')return;$('scene').dataset.avatarX=bridge.position.x.toFixed(3);$('scene').dataset.avatarZ=bridge.position.z.toFixed(3);updateHUD();const now=performance.now();bridge.pose({time,dt,speed,seated:!!seated,seatHeight:seated?(['stool'].includes(bridge.state().items.find(item=>item.id===seated.id)?.kind)?.91:.54):.54,wave:now<waveUntil,drink:now<drinkUntil,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches});},
   reset, seated(){return !!seated;}, active(){return mode==='walk';}
  };
 }};
})();
