const test=require('node:test');const assert=require('node:assert/strict');const rules=require('../js/playground-games-core.js');
test('table game detects wins, draws, and finished boards',()=>{
 assert.equal(rules.result(['X','X','X',null,null,null,null,null,null]),'X');
 assert.equal(rules.result(['X','O','X','X','O','O','O','X','X']),'draw');
 assert.equal(rules.bestMove(['X','X','X','O','O',null,null,null,null]),-1);
});
test('resident game opponent cannot be beaten by any sequence of legal X moves',()=>{
 function visit(board){const end=rules.result(board);assert.notEqual(end,'X');if(end)return;for(let i=0;i<9;i++)if(!board[i]){const next=[...board];next[i]='X';const outcome=rules.result(next);assert.notEqual(outcome,'X');if(outcome)continue;const move=rules.bestMove(next);assert.ok(move>=0&&!next[move]);next[move]='O';visit(next);}}
 visit(Array(9).fill(null));
});
test('interaction range uses rotated furniture footprints',()=>{
 const item={x:0,z:0,r:0};assert.equal(rules.distance({x:1.1,z:0},item,{w:2,d:.5}),.10000000000000009);
 assert.equal(rules.distance({x:1.1,z:0},{...item,r:1},{w:2,d:.5}),.8500000000000001);
 assert.deepEqual(rules.actions('lamp'),['light']);assert.deepEqual(rules.actions('sofa'),['sit']);assert.deepEqual(rules.actions('homeDining'),['game']);assert.deepEqual(rules.actions('wardrobe'),[]);
});
test('click routes go around furniture and reject unreachable destinations',()=>{
 const clear=(x,z)=>Math.abs(x)<3&&Math.abs(z)<3&&!(Math.abs(x)<.7&&Math.abs(z)<.7);
 const path=rules.path({x:0,z:2},{x:0,z:-2},clear);assert.ok(path&&path.length>1);
 for(let i=0,previous={x:0,z:2};i<path.length;i++){const next=path[i];for(let k=0;k<=40;k++)assert.ok(clear(previous.x+(next.x-previous.x)*k/40,previous.z+(next.z-previous.z)*k/40));previous=next;}
 assert.equal(rules.path({x:0,z:2},{x:0,z:0},clear),null);
});
test('bundled MakeHuman asset has intact binary, normalized skin weights and valid bone hierarchy',()=>{
 const fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');const root=path.join(__dirname,'../assets/avatar');
 const meta=JSON.parse(fs.readFileSync(path.join(root,'resident.json'))),data=fs.readFileSync(path.join(root,'resident.bin'));
 assert.equal(meta.license,'CC0-1.0');assert.equal(meta.bones.length,163);assert.equal(crypto.createHash('sha256').update(data).digest('hex'),meta.binarySha256);
 assert.ok(meta.groups.every(group=>group.count>0));assert.equal(meta.groups.length,5);assert.ok(data.byteLength<650000);
 const weights=meta.buffers.skinWeight;for(let i=0;i<weights.length;i+=4){let total=0;for(let j=0;j<4;j++)total+=data.readFloatLE(weights.offset+(i+j)*4);assert.ok(Math.abs(total-1)<.00001);}
 for(const [index,bone]of meta.bones.entries()){const visited=new Set([index]);let parent=bone.parent;while(parent>=0){assert.ok(parent<meta.bones.length&&!visited.has(parent));visited.add(parent);parent=meta.bones[parent].parent;}}
 assert.match(fs.readFileSync(path.join(root,'LICENSE.ASSETS.md'),'utf8'),/CC0/i);
});
