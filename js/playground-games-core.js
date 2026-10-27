/* Deterministic game rules, shared by the UI and Node tests. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SECHA_PLAY_RULES=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
 function result(board){for(const line of lines)if(board[line[0]]&&line.every(i=>board[i]===board[line[0]]))return board[line[0]];return board.every(Boolean)?'draw':null;}
 function bestMove(board){
  if(result(board))return -1;
  function score(cells,turn){const end=result(cells);if(end)return end==='O'?10:end==='X'?-10:0;const values=[];for(let i=0;i<9;i++)if(!cells[i]){cells[i]=turn;values.push(score(cells,turn==='O'?'X':'O'));cells[i]=null;}return turn==='O'?Math.max(...values):Math.min(...values);}
  let best=-Infinity,move=-1;for(const i of [4,0,2,6,8,1,3,5,7])if(!board[i]){const copy=[...board];copy[i]='O';const value=score(copy,'X');if(value>best){best=value;move=i;}}return move;
 }
 function distance(point,item,spec){const w=item.r%2?spec.d:spec.w,d=item.r%2?spec.w:spec.d;return Math.hypot(Math.max(0,Math.abs(point.x-item.x)-w/2),Math.max(0,Math.abs(point.z-item.z)-d/2));}
 const seats=['sofa','chair','bench','ottoman','stool','homeDiningChair','diningChair','taskChair','salonChair','banquette'];
 const tables=['table','desk','homeDining','accentTable','diningTable','meetingTable','sideTable'];
 function actions(kind){return [...(seats.includes(kind)?['sit']:[]),...(tables.includes(kind)?['game']:[]),...(kind==='lamp'?['light']:[]),...(kind==='plant'?['care']:[]),...(['counter','cafeCounter','barCounter','prepCounter'].includes(kind)?['coffee']:[])];}
 function path(start,goal,walkable,step=.25){
  const clear=(a,b)=>{const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.07));for(let i=0;i<=n;i++)if(!walkable(a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n))return false;return true;};
  if(!walkable(goal.x,goal.z))return null;
  if(clear(start,goal))return [goal];
  const around=point=>{const out=[];for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++){const candidate={x:(Math.round(point.x/step)+x)*step,z:(Math.round(point.z/step)+z)*step};if(clear(point,candidate))out.push(candidate);}return out.sort((a,b)=>Math.hypot(a.x-point.x,a.z-point.z)-Math.hypot(b.x-point.x,b.z-point.z));};
  const starts=around(start),ends=around(goal);if(!starts.length||!ends.length)return null;
  const key=p=>`${Math.round(p.x/step)},${Math.round(p.z/step)}`,goals=new Set(ends.map(key));
  const queue=[starts[0]],visited=new Map([[key(starts[0]),null]]);let found=null;
  for(let head=0;head<queue.length&&visited.size<4500;head++){
   const point=queue[head];if(goals.has(key(point))){found=point;break;}
   for(const [dx,dz]of [[step,0],[-step,0],[0,step],[0,-step]]){const next={x:point.x+dx,z:point.z+dz},id=key(next);if(!visited.has(id)&&clear(point,next)){visited.set(id,point);queue.push(next);}}
  }
  if(!found)return null;const route=[goal];for(let point=found;point;point=visited.get(key(point)))route.unshift(point);
  // Simplify the grid route without cutting corners through furniture.
  const short=[];let anchor=start,index=0;while(index<route.length){let far=index;for(let i=index+1;i<route.length;i++){if(clear(anchor,route[i]))far=i;else break;}short.push(route[far]);anchor=route[far];index=far+1;}return short;
 }
 return {result,bestMove,distance,actions,seats,tables,path};
});
