/* Metric commercial models with restrained procedural material detail. */
(() => {
  const textures = new Map();
  function texture(type) {
    if (textures.has(type)) return textures.get(type);
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d");
    let seed = 79; const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    ctx.fillStyle = "#d8d8d8"; ctx.fillRect(0,0,128,128);
    if (type === "wood") {
      for (let i=0;i<95;i++) {const y=random()*128;ctx.strokeStyle=`rgba(50,50,50,${.03+random()*.12})`;ctx.lineWidth=.3+random();ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(40,y-2,80,y+3,128,y);ctx.stroke();}
    } else if (type === "fabric") {
      for(let i=0;i<128;i+=3){ctx.strokeStyle=i%2?"#c2c2c2":"#e3e3e3";ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,128);ctx.moveTo(0,i);ctx.lineTo(128,i);ctx.stroke();}
    } else {
      for(let i=0;i<1400;i++){const value=Math.floor(160+random()*80);ctx.fillStyle=`rgb(${value},${value},${value})`;ctx.fillRect(random()*128,random()*128,random()*1.6+ .3,random()*1.6+.3);}
    }
    const map = new THREE.CanvasTexture(canvas);map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(type==="stone"?18:type==="wood"?2:3,type==="stone"?18:3);map.encoding=THREE.sRGBEncoding;
    textures.set(type,map);return map;
  }
  window.SECHA_COMMERCIAL_FURNITURE = {
    texture,
    build(kind,g,c) {
      const definitions=window.SECHA_COMMERCIAL_LAYOUTS.catalog;
      const supported=["diningTable","diningChair","cafeCounter","pastryCounter","prepCounter","barCounter","backbar","banquette","taskChair","meetingTable","reception","salonChair","washUnit","towelCabinet","privacyScreen","sideTable"];
      if (!supported.includes(kind) && !(c.commercial && ["stool","desk"].includes(kind))) return false;
      const spec=definitions[kind];
      const mat=(color,type,roughness=.7,metalness=0)=>{if(c.finish && c.finish.type === ({wood:"Wood",stone:"Stone",fabric:"Fabric"}[type])) color=`#${c.finish.color.toString(16).padStart(6,"0")}`;const m=c.material(color,roughness);m.map=texture(type);m.metalness=metalness;return m;};
      const timber=mat("#a3825a","wood"), upholstery=mat(c.palette.fabric,"fabric"), stone=mat(c.palette.floor,"stone",.65), dark=c.material("#353a34",.48), pale=c.material("#ebe5d5",.55), metal=c.material("#9e795a",.3);metal.metalness=.65;
      const box=(w,h,d,x,y,z,m)=>{
        if ((m!==upholstery && m!==stone) || Math.min(w,h,d)<.065) return c.box(g,w,h,d,x,y,z,m);
        const r=Math.min(.025,w/8,h/8,d/8),a=w/2-r,b=h/2-r,q=Math.min(r,a/2,b/2);
        const shape=new THREE.Shape();
        shape.moveTo(-a+q,-b);shape.lineTo(a-q,-b);shape.quadraticCurveTo(a,-b,a,-b+q);
        shape.lineTo(a,b-q);shape.quadraticCurveTo(a,b,a-q,b);shape.lineTo(-a+q,b);
        shape.quadraticCurveTo(-a,b,-a,b-q);shape.lineTo(-a,-b+q);shape.quadraticCurveTo(-a,-b,-a+q,-b);
        const geometry=new THREE.ExtrudeGeometry(shape,{depth:d-2*r,bevelEnabled:true,bevelThickness:r,bevelSize:r,bevelSegments:2,steps:1,curveSegments:4});
        geometry.translate(0,0,-(d-2*r)/2);
        const mesh=new THREE.Mesh(geometry,m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;
      };
      const cyl=(r,h,x,y,z,m,segments=24)=>c.cylinder(g,r,r,h,x,y,z,m,segments);
      const legs=(w,d,h,m)=>{for(const x of [-w/2+.06,w/2-.06])for(const z of [-d/2+.06,d/2-.06])box(.045,h,.045,x,h/2,z,m);};
      const cup=(x,y,z)=>{cyl(.045,.075,x,y,z,pale,12);cyl(.038,.003,x,y+.039,z,dark,12);};
      if(kind==="diningTable"||kind==="sideTable") {
        const r=spec.w/2,h=kind==="sideTable"?.56:.74;
        cyl(r,.045,0,h,0,kind==="sideTable"?stone:timber,40);cyl(.065,h-.08,0,(h-.08)/2,0,dark);cyl(r*.58,.035,0,.025,0,dark);
        if(kind==="diningTable"){cup(.12,h+.06,.1);cyl(.055,.1,-.1,h+.07,-.08,pale);}
      } else if(kind==="diningChair"||kind==="taskChair"||kind==="salonChair"||kind==="stool") {
        const high=kind==="stool", h=high?.78:.46, w=spec.w-.06, d=spec.d-.08;
        box(w,.1,d,0,h,0,upholstery);
        box(w,.35,.075,0,h+.2,-d/2+.035,upholstery);
        if(kind==="diningChair") legs(w,d,h-.03,timber);
        else {cyl(.055,h-.08,0,(h-.08)/2,0,metal);cyl(w*.48,.045,0,.04,0,dark);}
        if(kind==="salonChair") {for(const x of [-w/2,w/2])box(.05,.08,d*.8,x,h+.2,0,metal);box(.45,.025,.12,0,.2,d/2-.04,metal);}
        if(kind==="taskChair") {for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const x=Math.sin(a)*.23,z=Math.cos(a)*.23;box(.035,.04,.035,x,.04,z,dark);cyl(.03,.055,x,.055,z,dark,8);}}
        if(high){box(w*.85,.025,.025,0,.3,d/2,metal);}
      } else if(kind==="banquette") {
        box(2.4,.36,.6,0,.22,0,timber);box(2.4,.47,.12,0,.65,-.26,upholstery);
        for(let i=0;i<4;i++)box(.58,.14,.5,-.9+i*.6,.47,.025,upholstery);
      } else if(kind==="desk") {
        box(1.5,.07,.7,0,.76,0,timber);for(const x of [-.64,.64])box(.045,.72,.57,x,.36,0,dark);
        box(.55,.33,.035,0,1.04,-.17,dark);box(.08,.19,.05,0,.86,-.17,metal);
        box(.49,.27,.008,0,1.05,-.147,c.material("#92a89e",.5));box(.4,.015,.14,0,.805,.13,dark);
        box(.07,.02,.09,.3,.807,.13,dark);box(.1,.012,.4,.61,.81,0,dark);cup(-.55,.84,.13);
      } else if(kind==="meetingTable") {
        box(2.4,.065,1.05,0,.75,0,timber);for(const x of [-.82,.82])box(.12,.72,.8,x,.36,0,dark);box(.32,.008,.12,0,.787,0,dark);
        for(const x of [-.65,.65]){box(.22,.015,.14,x,.79,0,pale);cup(x,.83,.27);}
      } else if(["cafeCounter","pastryCounter","barCounter","prepCounter","reception"].includes(kind)) {
        const w=spec.w,d=spec.d,h=kind==="prepCounter"?.9:1.02;
        const face=kind==="barCounter"?mat("#9a7550","wood"):timber;
        box(w-.05,h-.09,d-.05,0,(h-.09)/2,0,face);box(w,.07,d,0,h,0,kind==="barCounter"?mat("#484b43","stone",.48):stone);
        for(let x=-w/2+.09;x<w/2;x+=.11)box(.025,h-.19,.02,x,(h-.19)/2+.04,d/2-.005,face);
        if(kind==="cafeCounter") {
          box(.8,.35,.4,-.3,h+.22,0,metal);box(.7,.07,.27,-.3,h+.08,.2,dark);
          for(const x of [-.52,-.17]){cyl(.035,.12,x,h+.1,.12,metal);cup(x,h+.08,.26);}
          cyl(.12,.27,.55,h+.19,-.02,dark);c.sphere(g,.12,.55,h+.4,-.02,pale,1,1.3,1);cup(.9,h+.08,.2);
        } else if(kind==="pastryCounter") {
          const glass=c.material("#c7dfd7",.1);glass.transparent=true;glass.opacity=.24;
          box(1.4,.4,.62,0,h+.24,0,glass);box(1.44,.025,.65,0,h+.045,0,metal);
          for(let i=0;i<5;i++)c.sphere(g,.09,-.5+i*.25,h+.1,.04,mat("#b8925d","stone"),1,.45,.8);
        } else if(kind==="prepCounter") {
          box(.55,.015,.38,-.5,h+.043,0,dark);box(.45,.012,.29,-.5,h+.052,0,metal);box(.025,.3,.025,-.5,h+.17,-.19,metal);box(.17,.025,.025,-.43,h+.31,-.19,metal);
        } else if(kind==="barCounter") {for(const x of [-.65,0,.65])cup(x,h+.09,0);}
        else {box(.36,.24,.045,.4,h+.16,-.08,dark);box(.08,.1,.1,.4,h+.05,-.08,metal);cyl(.09,.23,-.55,h+.15,0,pale);}
      } else if(kind==="backbar"||kind==="towelCabinet") {
        const w=spec.w,d=spec.d,h=kind==="backbar"?2.1:1.7;
        box(w,.07,d,0,.05,0,timber);box(w,h,.035,0,h/2,-d/2+.02,timber);
        for(const x of [-w/2+.035,w/2-.035])box(.07,h,d,x,h/2,0,timber);
        for(const y of [.52,1.02,1.52]) {
          if(y>h-.1)continue;box(w,.045,d,0,y,0,timber);
          if(kind==="backbar")for(let i=0;i<7;i++){const x=-w/2+.2+i*(w-.4)/6;cyl(.04,.16,x,y+.1,0,metal,10);cyl(.018,.065,x,y+.21,0,dark,8);}
          else for(let i=0;i<3;i++)for(let k=0;k<2;k++)box(.28,.07,.28,-.38+i*.38,y+.06+k*.08,0,pale);
        }
        if(kind==="backbar"){box(.6,.07,.32,0,.6,.015,dark);cyl(.11,.018,0,.65,.015,dark);for(const x of [-.8,.8]){box(.25,.32,.28,x,.71,0,dark);cyl(.07,.025,x,.73,.155,metal);}}
      } else if(kind==="privacyScreen") {
        for(let z=-1.15;z<=1.16;z+=.12)box(.075,1.75,.045,0,.9,z,timber);
        box(.12,.07,2.4,0,.08,0,timber);box(.12,.07,2.4,0,1.8,0,timber);
      } else if(kind==="washUnit") {
        box(.68,.42,.62,0,.32,.25,upholstery);const back=box(.68,.12,.63,0,.68,-.03,upholstery);back.rotation.x=-.6;
        cyl(.13,.58,0,.29,0,dark);box(.74,.45,.48,0,.5,-.42,timber);
        const bowl=cyl(.32,.11,0,.83,-.4,pale,32);bowl.scale.z=.8;cyl(.25,.012,0,.89,-.4,dark,32);
        box(.035,.2,.035,0,.96,-.6,metal);box(.14,.025,.025,.05,1.05,-.6,metal);
      }
      return true;
    }
  };
})();
