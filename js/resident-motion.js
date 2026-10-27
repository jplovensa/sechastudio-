/* Plain Three.js: Mixamo -> VRM humanoid tracks -> AnimationMixer -> MakeHuman skin. */
(() => {
 const boneMap={hips:'root',spine:'spine03',chest:'spine02',upperChest:'spine01',neck:'neck01',head:'head'};
 for(const [prefix,side]of [['left','L'],['right','R']]){
  for(const [human,raw]of Object.entries({Shoulder:'shoulder01',UpperArm:'upperarm01',LowerArm:'lowerarm01',Hand:'wrist',UpperLeg:'upperleg01',LowerLeg:'lowerleg01',Foot:'foot',Toes:'toe3-1'}))boneMap[prefix+human]=`${raw}.${side}`;
  for(const [finger,number]of [['Thumb',1],['Index',2],['Middle',3],['Ring',4],['Little',5]])for(const [part,index]of (finger==='Thumb'?[['Metacarpal',1],['Proximal',2],['Distal',3]]:[['Proximal',1],['Intermediate',2],['Distal',3]]))boneMap[prefix+finger+part]=`finger${number}-${index}.${side}`;
 }
 async function create({object,mesh,bones,meta,cup}){
  const T=window.THREE, plugin=window.THREE_VRM_ANIMATION;
  if(!plugin?.createVRMAnimationClip)throw Error('VRM animation adapter unavailable');
  const response=await fetch('assets/avatar/motion/mixamo-motion.json');if(!response.ok)throw Error('Motion clips unavailable');const data=await response.json();
  if(data.format!=='secha-vrm-motion-v1'||!data.clips.idle||!data.clips.walk)throw Error('Invalid motion data');
  const inverseMap=Object.fromEntries(Object.entries(boneMap).filter(([,name])=>bones[name]).map(([human,raw])=>[raw,human]));
  const restPositions=Object.fromEntries(meta.bones.map(info=>[info.name,new T.Vector3().fromArray(info.head)]));
  const corrections={}, normalized={}, mapped={};
  const axisFor=name=>name.startsWith('left')?new T.Vector3(1,0,0):new T.Vector3(-1,0,0);
  function direction(human,end){const raw=boneMap[human],tip=boneMap[end];if(!raw||!tip||!restPositions[tip])return null;return restPositions[tip].clone().sub(restPositions[raw]).normalize();}
  for(const [human,raw]of Object.entries(boneMap))if(bones[raw]){
   const correction=new T.Quaternion();let vector=null,axis=null;
   const prefix=human.startsWith('left')?'left':human.startsWith('right')?'right':null;
   if(prefix){
    const part=human.slice(prefix.length);let end;
    if(part==='UpperArm')end=prefix+'LowerArm';else if(part==='LowerArm')end=prefix+'Hand';else if(part==='Hand')end=prefix+'MiddleProximal';
    else if(/(Proximal|Metacarpal|Intermediate|Distal)$/.test(part)){
     const sequence=part.startsWith('Thumb')?['Metacarpal','Proximal','Distal']:['Proximal','Intermediate','Distal'];const suffix=sequence.find(s=>part.endsWith(s));const digit=part.slice(0,-suffix.length),i=sequence.indexOf(suffix);
     if(i<2)end=prefix+digit+sequence[i+1];else vector=direction(prefix+digit+sequence[i-1],human);
    }
    if(end)vector=direction(human,end);if(vector)axis=axisFor(human);
    if(part==='UpperLeg'){vector=direction(human,prefix+'LowerLeg');axis=new T.Vector3(0,-1,0);}
    if(part==='LowerLeg'){vector=direction(human,prefix+'Foot');axis=new T.Vector3(0,-1,0);}
    if(part==='Foot'){vector=direction(human,prefix+'Toes');axis=new T.Vector3(0,0,1);}
   }
   if(vector&&axis)correction.setFromUnitVectors(vector,axis);
   corrections[human]=correction;mapped[human]=bones[raw];
  }
  // Record an anatomical T-pose basis without changing the MakeHuman bind matrices.
  const ordered=[];mesh.traverse(node=>{if(node.isBone)ordered.push(node);});
  const q=new T.Quaternion(),parentQ=new T.Quaternion();
  for(const bone of ordered){const human=inverseMap[bone.name];if(human){bone.parent.getWorldQuaternion(parentQ);bone.quaternion.copy(parentQ.invert()).multiply(corrections[human]);}bone.updateMatrixWorld(true);}
  const normalizedRoot=new T.Group();normalizedRoot.name='ResidentVRMHumanoid';object.add(normalizedRoot);
  const tPositions={};for(const [human,raw]of Object.entries(mapped)){tPositions[human]=object.worldToLocal(raw.getWorldPosition(new T.Vector3()));const bone=new T.Bone();bone.name=`vrm_${human}`;normalized[human]=bone;}
  for(const [human,raw]of Object.entries(mapped)){
   let parent=raw.parent;while(parent&& !inverseMap[parent.name])parent=parent.parent;const parentHuman=parent&&inverseMap[parent.name];
   normalized[human].position.copy(tPositions[human]);if(parentHuman){normalized[human].position.sub(tPositions[parentHuman]);normalized[parentHuman].add(normalized[human]);}else normalizedRoot.add(normalized[human]);
  }
  ordered.forEach(bone=>bone.quaternion.identity());mesh.updateMatrixWorld(true);
  const hipsRest=normalized.hips.position.clone();
  const humanoid={getNormalizedBoneNode:name=>normalized[name]||null,normalizedRestPose:{hips:{position:hipsRest.toArray()}}};
  const vrm={humanoid,meta:{metaVersion:'1'},scene:object};
  const mixer=new T.AnimationMixer(normalizedRoot),clips={},actions={};
  function add(name,animation){const clip=plugin.createVRMAnimationClip(animation,vrm);clip.name=name;clips[name]=clip;const action=mixer.clipAction(clip);action.setEffectiveWeight(0).play();actions[name]=action;return action;}
  function makeAnimation(duration){const animation=new plugin.VRMAnimation();animation.duration=duration;animation.restHipsPosition.set(0,data.restHipsHeight,0);return animation;}
  for(const [name,source]of Object.entries(data.clips)){
   const animation=makeAnimation(source.duration);
   for(const track of source.tracks){if(!normalized[track.bone])continue;
    if(track.path==='rotation')animation.humanoidTracks.rotation.set(track.bone,new T.QuaternionKeyframeTrack('',track.times,track.values));
    else if(track.bone==='hips'){
     const scale=hipsRest.y/data.restHipsHeight,values=track.values.map((v,i)=>v+(i%3===0?hipsRest.x/scale:i%3===2?hipsRest.z/scale:0));animation.humanoidTracks.translation.set('hips',new T.VectorKeyframeTrack('',track.times,values));
    }
   }add(name,animation);
  }
  // Authored interaction clips use the same normalized rig and mixer as the mocap.
  // Their endpoints are calibrated against the actual idle pose, not a rigid T-pose.
  actions.idle.setEffectiveWeight(1);mixer.update(.001);const idlePose={};for(const [human,bone]of Object.entries(normalized))idlePose[human]=bone.quaternion.clone();actions.idle.setEffectiveWeight(0);
  function interaction(name,edits,duration=.7){const animation=makeAnimation(duration);for(const [human,bone]of Object.entries(normalized)){
    let target=idlePose[human].clone();if(edits[human])target.setFromEuler(new T.Euler(...edits[human]));
    animation.humanoidTracks.rotation.set(human,new T.QuaternionKeyframeTrack('',[0,duration],[...idlePose[human].toArray(),...target.toArray()]));
   }
   if(name==='wave'){
    const values=[];for(const [index,z]of [-.12,-.45,-.7,-.3,-.7,-.45].entries()){const value=index===0?idlePose.rightLowerArm.clone():new T.Quaternion().setFromEuler(new T.Euler(0,0,z));values.push(...value.toArray());}
    animation.humanoidTracks.rotation.set('rightLowerArm',new T.QuaternionKeyframeTrack('',[0,.4,.65,.9,1.15,1.5],values));
   }
   animation.humanoidTracks.translation.set('hips',new T.VectorKeyframeTrack('',[0,duration],Array(2).fill(hipsRest.clone().multiplyScalar(data.restHipsHeight/hipsRest.y).toArray()).flat()));const action=add(name,animation);action.setLoop(T.LoopOnce,1);action.clampWhenFinished=true;return action;}
  const sitting={leftUpperLeg:[-Math.PI/2,0,0],rightUpperLeg:[-Math.PI/2,0,0],leftLowerLeg:[Math.PI/2,0,0],rightLowerLeg:[Math.PI/2,0,0],leftUpperArm:[-.4,0,-1.1],rightUpperArm:[-.4,0,1.1],leftLowerArm:[-.5,0,0],rightLowerArm:[-.5,0,0]};
  interaction('sit',sitting,.65);interaction('wave',{rightUpperArm:[0,0,-1.95],rightLowerArm:[0,0,-.45]},1.5);interaction('drink',{rightUpperArm:[-.9,0,1.05],rightLowerArm:[-1.3,0,0]},.6);
  // Standing is the reverse of the seated clip, baked as its own action for crossfades.
  const stand=clips.sit.clone();stand.name='stand';for(const track of stand.tracks){const size=track.getValueSize(),values=Array.from(track.values);for(let i=0;i<track.times.length;i++)for(let j=0;j<size;j++)track.values[i*size+j]=values[(track.times.length-1-i)*size+j];}
  clips.stand=stand;actions.stand=mixer.clipAction(stand);actions.stand.setLoop(T.LoopOnce,1);actions.stand.clampWhenFinished=true;
  let special=null,lastTime=null,smoothedSpeed=0,movementWeight=0,seatOffset=0,wasSeated=false,previousRunWeight=0;
  const weights={sit:0,stand:0,wave:0,drink:0};
  function pose({time=0,dt,speed=0,seated=false,seatHeight=.54,wave=false,drink=false,reduced=false}={}){
   dt=Math.max(0,Math.min(.25,dt??(lastTime==null?1/60:time-lastTime)));lastTime=time;
   const factor=1-Math.exp(-dt/0.13);smoothedSpeed+=(Math.max(0,speed)-smoothedSpeed)*factor;
   movementWeight+=((speed>.05?1:0)-movementWeight)*(reduced?1:1-Math.exp(-dt/.14));
   let wanted=seated?'sit':drink?'drink':wave?'wave':wasSeated?'stand':null;
   if(special==='stand'&&!seated&&actions.stand.time<clips.stand.duration-.01)wanted='stand';
   if(wanted!==special){special=wanted;if(special)actions[special].reset().setEffectiveWeight(weights[special]).play();}
   wasSeated=seated;
   for(const name of Object.keys(weights)){weights[name]+=((name===special?1:0)-weights[name])*(reduced?1:1-Math.exp(-dt/.16));if(weights[name]<.0001)weights[name]=0;actions[name].setEffectiveWeight(weights[name]);if(reduced&&name===special)actions[name].time=clips[name].duration;}
   const specialWeight=Math.min(1,Object.values(weights).reduce((a,b)=>a+b,0));
   const runWeight=T.MathUtils.clamp((smoothedSpeed-1.6)/1.2,0,1),moving=T.MathUtils.clamp(movementWeight,0,1),base=1-specialWeight;
   if(runWeight>.05&&previousRunWeight<=.05)actions.run.time=actions.walk.time/clips.walk.duration*clips.run.duration;
   previousRunWeight=runWeight;
   actions.idle.setEffectiveWeight((1-moving)*base);actions.walk.setEffectiveWeight(moving*(1-runWeight)*base);actions.run.setEffectiveWeight(moving*runWeight*base);
   actions.walk.timeScale=T.MathUtils.clamp(smoothedSpeed/data.strideSpeed.walk,.25,1.8);actions.run.timeScale=T.MathUtils.clamp(smoothedSpeed/data.strideSpeed.run,.4,1.5);
   if(reduced){for(const name of ['idle','walk','run'])actions[name].paused=true;}else for(const name of ['idle','walk','run'])actions[name].paused=false;
   mixer.update(dt);normalizedRoot.updateMatrixWorld(true);
   for(const bone of ordered){bone.quaternion.identity();const human=inverseMap[bone.name];if(human){normalized[human].getWorldQuaternion(q);q.multiply(corrections[human]);bone.parent.getWorldQuaternion(parentQ);bone.quaternion.copy(parentQ.invert()).multiply(q);}bone.updateMatrixWorld(true);}
   bones.root.position.copy(normalized.hips.position);
   const targetOffset=seated?seatHeight-hipsRest.y:0;seatOffset+=(targetOffset-seatOffset)*(reduced?1:1-Math.exp(-dt/.15));object.position.y=seatOffset;
   cup.visible=drink;
   object.userData.pose=seated?'sitting':special==='stand'?'standing-up':drink?'drinking':wave?'waving':smoothedSpeed>2?'running':smoothedSpeed>.08?'walking':'idle';
   object.userData.animationWeights={idle:actions.idle.getEffectiveWeight(),walk:actions.walk.getEffectiveWeight(),run:actions.run.getEffectiveWeight(),interaction:specialWeight};
   object.userData.animationSource='Mixamo / three-vrm-animation';object.userData.motionSpeed=smoothedSpeed;
  }
  pose({time:0,dt:0});
  return {pose,mixer,clips,humanoid,normalized,corrections};
 }
 window.SECHA_RESIDENT_MOTION={create,boneMap};
})();
