const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/avatar/motion/mixamo-motion.json'),'utf8'));
test('Mixamo tracks preserve complete timed, normalized humanoid motion',()=>{
 assert.equal(data.format,'secha-vrm-motion-v1');assert.match(data.sourceURL,/d4aa9e00ea29808534a3e082f602c544e5f2419c/);assert.match(data.sourceSHA256,/^[a-f0-9]{64}$/);
 for(const name of ['idle','walk','run']){
  const clip=data.clips[name];assert.ok(clip.duration>.5);assert.ok(clip.tracks.some(track=>track.bone==='hips'&&track.path==='translation'));
  for(const joint of ['leftUpperArm','rightUpperArm','leftUpperLeg','rightUpperLeg','leftLowerLeg','rightLowerLeg'])assert.ok(clip.tracks.some(track=>track.bone===joint&&track.path==='rotation'));
  for(const track of clip.tracks){const size=track.path==='rotation'?4:3;assert.equal(track.values.length,track.times.length*size);assert.ok(track.values.every(Number.isFinite));for(let i=1;i<track.times.length;i++)assert.ok(track.times[i]>=track.times[i-1]);if(size===4)for(let i=0;i<track.values.length;i+=4)assert.ok(Math.abs(Math.hypot(...track.values.slice(i,i+4))-1)<.001);}
 }
});
test('locomotion is baked in place so the collision controller owns planar movement',()=>{
 for(const name of ['walk','run']){const hips=data.clips[name].tracks.find(track=>track.bone==='hips'&&track.path==='translation');for(let i=0;i<hips.values.length;i+=3){assert.ok(Math.abs(hips.values[i])<.15);assert.ok(Math.abs(hips.values[i+2])<.15);}assert.ok(data.strideSpeed[name]>0);}
});
