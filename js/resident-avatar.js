/* Local CC0 MakeHuman skin with Mixamo / VRM animation and a static fallback. */
(() => {
  async function load() {
    const [metaResponse, binaryResponse] = await Promise.all([fetch('assets/avatar/resident.json'),fetch('assets/avatar/resident.bin')]);
    if (!metaResponse.ok || !binaryResponse.ok) throw Error('Resident asset unavailable');
    const meta=await metaResponse.json(), data=await binaryResponse.arrayBuffer();
    if(meta.format!=='secha-makehuman-v1'||meta.bones.length>200)throw Error('Invalid resident asset');
    const T=window.THREE, geometry=new T.BufferGeometry();
    for(const [name,Type,size] of [['position',Float32Array,3],['skinIndex',Uint16Array,4],['skinWeight',Float32Array,4]]) {
      const buffer=meta.buffers[name];geometry.setAttribute(name,new T.BufferAttribute(new Type(data,buffer.offset,buffer.length),size));
    }
    const index=meta.buffers.index;geometry.setIndex(new T.BufferAttribute(new Uint16Array(data,index.offset,index.length),1));
    meta.groups.forEach(group=>geometry.addGroup(group.start,group.count,group.material));geometry.computeVertexNormals();
    const colors=['#b88669','#70846d','#343e3b','#ece6d5','#352e29'];
    const materials=colors.map(color=>new T.MeshStandardMaterial({color:new T.Color(color).convertSRGBToLinear(),roughness:.87,skinning:true,side:T.DoubleSide}));
    const object=new T.Group(), mesh=new T.SkinnedMesh(geometry,materials), bones=meta.bones.map(info=>{const bone=new T.Bone();bone.name=info.name;return bone;});
    meta.bones.forEach((info,index)=>{
      const parent=meta.bones[info.parent];bones[index].position.fromArray(info.head);
      if(parent){bones[index].position.sub(new T.Vector3().fromArray(parent.head));bones[info.parent].add(bones[index]);}
      else mesh.add(bones[index]);
    });
    object.add(mesh);mesh.updateMatrixWorld(true);mesh.bind(new T.Skeleton(bones));mesh.castShadow=mesh.receiveShadow=true;mesh.frustumCulled=false;
    const byName=Object.fromEntries(bones.map(bone=>[bone.name,bone]));
    // Eyes are authored additions attached to the actual MakeHuman eye joints.
    for(const side of ['L','R']) {
      const eye=new T.Mesh(new T.SphereGeometry(.009,12,10),new T.MeshStandardMaterial({color:'#e6ded0',roughness:.55}));
      eye.position.z=.012;byName[`eye.${side}`].add(eye);
      const iris=new T.Mesh(new T.SphereGeometry(.005,10,8),new T.MeshStandardMaterial({color:'#293a32'}));iris.position.z=.009;eye.add(iris);
    }
    const cup=new T.Group();
    const cupBody=new T.Mesh(new T.CylinderGeometry(.035,.03,.075,16),new T.MeshStandardMaterial({color:'#efe4ce',roughness:.6}));cup.add(cupBody);
    const handle=new T.Mesh(new T.TorusGeometry(.025,.007,8,16),cupBody.material);handle.position.x=.033;cup.add(handle);
    cup.position.set(0,-.04,.025);byName['wrist.R'].add(cup);cup.visible=false;
    function fallbackPose({seated=false,seatHeight=.53,wave=false,drink=false}={}) {
      bones.forEach(bone=>bone.rotation.set(0,0,0));
      for(const [side,sign] of [['L',1],['R',-1]]) {
        byName[`upperarm01.${side}`].rotation.z=-sign*.55;
        byName[`upperarm01.${side}`].rotation.x=seated?-.45:0;
        byName[`lowerarm01.${side}`].rotation.x=seated?-.6:-.12;
        byName[`upperleg01.${side}`].rotation.x=seated?-Math.PI/2:0;
        byName[`lowerleg01.${side}`].rotation.x=seated?Math.PI/2:0;
      }
      cup.visible=drink;
      if(drink){byName['upperarm01.R'].rotation.x=-.9;byName['lowerarm01.R'].rotation.x=-1.3;}
      if(wave&&!drink){byName['upperarm01.R'].rotation.z=-1.95;byName['lowerarm01.R'].rotation.z=-.3;}
      object.position.y=seated?seatHeight-meta.bones.find(bone=>bone.name==='upperleg01.L').head[1]:0;
      object.userData.pose=seated?'sitting':wave?'waving':'idle';
    }
    let motion;
    try { motion=await window.SECHA_RESIDENT_MOTION.create({object,mesh,bones:byName,meta,cup}); }
    catch(error) { fallbackPose();object.userData.animationSource='static-fallback';object.userData.animationError=error.message; }
    object.userData.source='MakeHuman';object.userData.license='CC0-1.0';
    return {object,pose:motion?.pose||fallbackPose,motion,setOutfit(color){materials[1].color.set(color).convertSRGBToLinear();},bones:byName};
  }
  window.SECHA_RESIDENT_AVATAR={load};
})();
