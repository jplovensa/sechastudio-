/* Collection-shaped residence furniture. Dimensions in metres; prices are illustrative IDR. */
(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else root.SECHA_RESIDENTIAL_FURNITURE = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const tiers = {
    standard: { name: "Standard", multiplier: 1, description: "Everyday essentials · simple frames and upholstery" },
    premium: { name: "Premium", multiplier: 1.65, description: "Refined comfort · layered upholstery and crafted joinery" },
    lux: { name: "Lux", multiplier: 2.8, description: "Statement pieces · sculpted forms, stone and metal details" },
  };
  const catalog = {
    homeDining: { name: "Gather dining table", category: "dining", price: 3200000, w: 1.8, d: .9, icon: "⊓", model: "table" },
    homeDiningChair: { name: "Frame dining chair", category: "dining", price: 1200000, w: .55, d: .6, icon: "▱", model: "chair" },
    sideboard: { name: "Archive sideboard", category: "storage", price: 3600000, w: 1.6, d: .45, icon: "▥", model: "counter" },
    bookcase: { name: "Display bookcase", category: "storage", price: 2800000, w: 1.1, d: .35, icon: "▥", model: "counter" },
    wardrobe: { name: "Atelier wardrobe", category: "storage", price: 5800000, w: 1.8, d: .6, icon: "▥", model: "counter" },
    console: { name: "Entry console", category: "storage", price: 2100000, w: 1.2, d: .35, icon: "⊓", model: "desk" },
    ottoman: { name: "Cloud ottoman", category: "living", price: 950000, w: .7, d: .7, icon: "⬭", model: "chair" },
    bench: { name: "End-of-bed bench", category: "living", price: 1800000, w: 1.3, d: .45, icon: "▰", model: "sofa" },
    bedside: { name: "Bedside cabinet", category: "storage", price: 1100000, w: .5, d: .45, icon: "▥", model: "counter" },
    accentTable: { name: "Sculpted side table", category: "living", price: 850000, w: .45, d: .45, icon: "⬭", model: "table" },
  };
  const supported = ["sofa", "chair", "table", "bed", "desk", "counter", "lamp", "plant", "stool", ...Object.keys(catalog)];
  function price(spec, tier = "standard") { return Math.round(spec.price * tiers[tier].multiplier / 1000) * 1000; }
  const modelNames = {
    sofa: ["Straight-frame sofa", "Chaise sofa", "Sculptural modular sofa"],
    chair: ["Frame lounge chair", "High-back wing chair", "Swivel shell chair"],
    table: ["Slab coffee table", "Oval pedestal table", "Nested sculptural tables"],
    bed: ["Platform bed", "Split-headboard bed", "Winged statement bed"],
    desk: ["Frame writing desk", "Pedestal writing desk", "Stone trestle desk"],
    counter: ["Panelled cabinet", "Reeded credenza", "Stone arch cabinet"],
    lamp: ["Shade floor lamp", "Mushroom floor lamp", "Three-globe lamp"],
    plant: ["Potted olive", "Raised bowl planter", "Stone tree planter"],
    stool: ["Four-leg stool", "Armed counter chair", "Pedestal shell stool"],
    homeDining: ["Rectangular dining table", "Oval pedestal dining table", "Stone slab dining table"],
    homeDiningChair: ["Frame dining chair", "Armed dining chair", "Swivel dining chair"],
    sideboard: ["Panel sideboard", "Reeded sideboard", "Arched stone sideboard"],
    bookcase: ["Open-grid bookcase", "Staggered display shelves", "Sculptural arch bookcase"],
    wardrobe: ["Panel wardrobe", "Reeded wardrobe", "Arched wardrobe"],
    console: ["Frame console", "Drawer console", "Stone pier console"],
    ottoman: ["Square ottoman", "Upholstered plinth", "Twin pebble ottoman"],
    bench: ["Frame bench", "Upholstered sled bench", "Three-module bench"],
    bedside: ["Panel bedside cabinet", "Reeded bedside cabinet", "Arched bedside cabinet"],
    accentTable: ["Slab side table", "Pedestal side table", "Nested side tables"],
  };
  function model(kind, tier="standard") { return modelNames[kind][{standard:0,premium:1,lux:2}[tier]]; }
  function build(kind, group, context) {
    if (!supported.includes(kind)) return false;
    const { THREE: T, spec, palette: p, style = "warm-modern", tier = "standard", material, texture, finish } = context;
    const rounded = style === "soft-contemporary", earthy = style === "earthy-retreat", urban = style === "urban-studio";
    const rich = tier !== "standard", lux = tier === "lux", w = spec.w, d = spec.d;
    group.userData.collection = style;
    group.userData.tier = tier;
    const mat = (color, type, roughness = .8, metalness = 0) => {
      const override = finish && finish.type === ({ wood: "Wood", fabric: "Fabric", stone: "Stone", metal: "Metal" }[type]);
      const m = override ? material(`#${finish.color.toString(16).padStart(6, "0")}`, finish.roughness) : material(color, roughness);
      m.metalness = override ? finish.metalness : metalness;
      if (type !== "metal") m.map = texture(type);
      return m;
    };
    const wood = mat(p.wood || (earthy ? "#8c734b" : "#bd9f76"), "wood"), fabric = mat(p.fabric, "fabric", 1), stone = mat(p.floor, "stone", .52), accent = mat(p.accent, "fabric"), linen = mat(rounded ? "#f1eee7" : "#e7dfd0", "fabric"), metal = mat(urban ? "#222222" : "#a68a59", "metal", .3, .72);
    const frame = urban ? metal : wood;
    function mesh(geometry, m, x, y, z) {
      const obj = new T.Mesh(geometry, m); obj.position.set(x,y,z); obj.castShadow = obj.receiveShadow = true; group.add(obj); return obj;
    }
    // Rounded rectangular extrusion, with dimensions including the bevel.
    function box(bw, bh, bd, x, y, z, m, radius = 0) {
      const r = Math.min(radius, bw/5, bh/3, bd/5);
      if (r < .005) return mesh(new T.BoxGeometry(bw,bh,bd),m,x,y,z);
      const a = bw/2-r, b = bd/2-r, q = Math.min(a,b,r*2);
      const shape = new T.Shape();
      shape.moveTo(-a+q,-b); shape.lineTo(a-q,-b); shape.quadraticCurveTo(a,-b,a,-b+q);
      shape.lineTo(a,b-q); shape.quadraticCurveTo(a,b,a-q,b); shape.lineTo(-a+q,b); shape.quadraticCurveTo(-a,b,-a,b-q);
      shape.lineTo(-a,-b+q); shape.quadraticCurveTo(-a,-b,-a+q,-b);
      const geo = new T.ExtrudeGeometry(shape,{depth:bh-2*r,bevelEnabled:true,bevelThickness:r,bevelSize:r,bevelSegments:3,curveSegments:8,steps:1});
      geo.translate(0,0,-(bh-2*r)/2); geo.rotateX(-Math.PI/2);
      return mesh(geo,m,x,y,z);
    }
    const cyl = (radius,height,x,y,z,m) => mesh(new T.CylinderGeometry(radius,radius,height,32),m,x,y,z);
    const legs = (bw,bd,h,m=frame) => { for (const x of [-bw/2+.07,bw/2-.07]) for (const z of [-bd/2+.07,bd/2-.07]) cyl(urban?.018:.028,h,x,h/2,z,m); };
    const r = rounded ? .075 : earthy ? .025 : .012;
    function oval(bw,bh,bd,x,y,z,m) { const obj=cyl(.5,bh,x,y,z,m);obj.scale.set(bw,1,bd);return obj; }
    const level = {standard:0,premium:1,lux:2}[tier];
    const modelTypes = model(kind, tier);
    group.userData.model = modelTypes;
    if (kind === "sofa" && rich) {
      const seat=.38;
      if(lux) {
        // Three offset modules; each model remains inside the published footprint.
        for(let i=0;i<3;i++) {
          const x=-w/3+i*w/3, z=i===1?-.05:.05;
          const width=w/3-.025, depth=d*.75;
          if(urban) box(width,.28,depth,x,.28,z,fabric,.012);
          else oval(width,.3,depth,x,.28,z,fabric);
          box(width*.8,.12,depth*.68,x,.47,z,linen,.035);
          if(urban) box(width,.36,.12,x,.61,-d*.35,frame,.01);
          else oval(width*.95,.38,.18,x,.61,-d*.33,fabric);
          cyl(.075,.13,x,.065,z,metal);
        }
      } else {
        legs(w-.1,d-.08,.2);
        box(w-.08,.12,d-.08,0,.24,0,frame,r);
        // Full-depth left chaise, with a shallower two-seat section to the right.
        box(w*.34,.19,d-.05,-w*.31,seat,0,fabric,r);
        box(w*.61,.19,d*.66,w*.175,seat,-d*.16,fabric,r);
        box(w-.04,.42,.12,0,.64,-d/2+.07,fabric,r);
        for(const x of [-w/2+.055,w/2-.055])box(.09,.2,d*.67,x,.53,-d*.13,rounded?fabric:frame,r);
        for(const x of [-w*.1,w*.25])box(w*.22,.25,.12,x,.65,-d*.29,accent,.04);
      }
    } else if(kind === "chair" && rich) {
      if(lux) {
        cyl(.25,.045,0,.035,0,metal);cyl(.055,.32,0,.2,0,metal);
        oval(w-.04,.22,d-.05,0,.43,0,fabric);
        const shell=oval(w-.09,.58,.2,0,.7,-d*.3,fabric);shell.rotation.x=-.1;
        for(const x of [-w*.36,w*.36])oval(w*.2,.22,d*.75,x,.56,0,urban?frame:fabric);
      } else {
        legs(w-.08,d-.08,.3);box(w-.06,.19,d-.07,0,.43,0,fabric,r);
        box(w*.75,.66,.12,0,.79,-d*.37,fabric,r);
        for(const x of [-w*.4,w*.4])box(w*.14,.4,d*.75,x,.58,-d*.04,rounded?fabric:frame,r);
        box(w*.7,.09,d*.65,0,.57,.04,linen,.03);
      }
    } else if(["table","accentTable","homeDining"].includes(kind) && rich) {
      const h=kind==="homeDining"?.75:kind==="accentTable"?.55:.4;
      if(lux && kind!=="homeDining") {
        oval(w*.65,.07,d*.88,-w*.17,h,-d*.02,stone);
        cyl(Math.min(w*.17,d*.22),h-.05,-w*.17,(h-.05)/2,-d*.02,wood);
        oval(w*.4,.055,d*.58,w*.29,h*.7,d*.16,metal);
        cyl(Math.min(w*.08,d*.12),h*.7-.03,w*.29,(h*.7-.03)/2,d*.16,metal);
      } else {
        if(lux && urban)box(w-.02,.07,d-.02,0,h,0,stone,.01);
        else oval(w-.025,.07,d-.025,0,h,0,lux?stone:wood);
        if(lux)for(const x of [-w*.23,w*.23])box(w*.15,h-.04,d*.65,x,(h-.04)/2,0,stone,r);
        else cyl(Math.min(w*.2,d*.28),h-.04,0,(h-.04)/2,0,frame);
      }
    } else if(kind === "bed" && rich) {
      box(w-.03,.22,d-.03,0,.17,0,frame,r);
      box(w-.09,.25,d-.2,0,.4,.06,linen,.04);
      if(lux) {
        // Tall, stepped upholstered headboard with separate wings.
        box(w*.65,1.12,.12,0,.66,-d/2+.065,fabric,rounded?.04:.012);
        for(const x of [-w*.41,w*.41])box(w*.16,.92,.18,x,.56,-d/2+.1,urban?wood:fabric,.03);
        box(w-.12,.03,d-.15,0,.06,0,metal);
      } else {
        for(const x of [-w*.25,w*.25])box(w*.48,.86,.13,x,.57,-d/2+.07,earthy?wood:fabric,.04);
      }
      for(const x of [-w*.24,w*.24]) {box(w*.37,.13,.35,x,.58,-d*.29,linen,.045);if(lux)box(w*.3,.12,.25,x,.65,-d*.22,accent,.04);}
      box(w-.11,.04,d*.53,0,.55,d*.2,accent,.02);
    } else if (["bench","ottoman"].includes(kind) && rich) {
      if(lux) {
        const count=kind==="bench"?3:2;
        for(let i=0;i<count;i++) {const x=-w/2+(i+.5)*w/count;oval(w/count-.015,.28,d-.04,x,.32,0,fabric);cyl(.055,.18,x,.09,0,metal);}
      } else {
        box(w-.04,.3,d-.04,0,.32,0,fabric,r);
        for(const x of [-w*.3,w*.3])box(w*.12,.18,d*.65,x,.09,0,frame,r);
        box(w-.07,.035,d-.07,0,.49,0,linen,.012);
      }
    } else if(["desk","console"].includes(kind) && rich) {
      box(w-.025,.065,d-.025,0,.77,0,lux?stone:wood,rounded?.08:.012);
      if(lux) {
        for(const x of [-w*.36,w*.36])box(w*.18,.73,d*.75,x,.365,0,stone,r);
        box(w*.48,.08,d*.65,0,.67,0,wood,.02);
      } else {
        box(w*.3,.68,d-.07,-w*.3,.34,0,wood,r);
        for(let y=.22;y<.7;y+=.2)box(w*.24,.008,.008,-w*.3,y,d/2-.03,metal);
        for(const z of [-d*.33,d*.33])box(.035,.73,.035,w*.4,.365,z,frame);
      }
    } else if (["homeDiningChair","stool"].includes(kind) && rich) {
      const h=kind==="stool"?.78:.45;
      if(lux) {cyl(.045,h-.04,0,(h-.04)/2,0,metal);oval(w*.8,.035,d*.8,0,.025,0,metal);}
      else legs(w-.05,d-.05,h-.05);
      oval(w-.04,.1,d-.06,0,h,0,fabric);
      if(lux)oval(w-.06,.36,.12,0,h+.22,-d*.35,fabric);
      else box(w-.05,.32,.06,0,h+.2,-d*.38,wood,r);
      for(const x of [-w*.4,w*.4])box(.03,.035,d*.58,x,h+.17,0,frame,.006);
    } else if (kind === "lamp" && rich) {
      cyl(.2,.06,0,.03,0,lux?stone:frame);
      cyl(.015,1.5,-.08,.78,0,metal);
      if(lux) {
        for(const y of [1.0,1.35,1.65]) {const globe=mesh(new T.SphereGeometry(.12,24,16),linen,y===1.35?.08:-.08,y,0);box(.16,.015,.015,0,y,0,metal);}
      } else {
        cyl(.16,.06,.04,1.5,0,wood);oval(.4,.2,.4,.04,1.61,0,linen);
      }
    } else if (kind === "plant" && rich) {
      const foliage=mat("#718565","fabric");
      if(lux) {box(.38,.42,.38,0,.21,0,stone,.025);cyl(.014,1.35,0,1.05,0,wood);}
      else {mesh(new T.CylinderGeometry(.22,.14,.3,32),wood,0,.32,0);legs(.3,.3,.18);cyl(.014,1,0,.9,0,wood);}
      for(let i=0;i<(lux?16:11);i++){const a=i*2.4;const leaf=mesh(new T.SphereGeometry(.12,12,8),foliage,Math.sin(a)*.15,.68+i*.045,Math.cos(a)*.15);leaf.scale.set(1,.6,.8);}
    } else
    if (["sofa","chair","bench","ottoman"].includes(kind)) {
      const low = earthy, seat = low ? .34 : .43, back = kind === "sofa" || kind === "chair";
      const seatFabric = rounded && kind === "chair" ? accent : fabric;
      if (low || rounded) box(w-.05,.18,d-.05,0,.12,0,low?wood:fabric,r);
      else legs(w-.04,d-.04,.25);
      box(w-.12,.1,d-.12,0,seat-.13,0,rounded?seatFabric:frame,r);
      box(w-.02,.19,d-.04,0,seat,0,seatFabric,r);
      if (rich) box(w-.05,.045,d-.07,0,seat+.11,0,linen,r);
      if (back) {
        if (rounded) {
          const shape = new T.Shape(), rx=w/2-.012, rz=d*.47;
          const start=-.2, end=Math.PI+.2, steps=40;
          for(let i=0;i<=steps;i++){ const a=start+(end-start)*i/steps; const x=Math.cos(a)*rx,z=Math.sin(a)*rz; if(i===0)shape.moveTo(x,z);else shape.lineTo(x,z); }
          for(let i=steps;i>=0;i--){ const a=start+(end-start)*i/steps;shape.lineTo(Math.cos(a)*(rx-.12),Math.sin(a)*(rz-.12)); }
          shape.closePath();
          const geo=new T.ExtrudeGeometry(shape,{depth:.38,bevelEnabled:true,bevelSize:.01,bevelThickness:.01,bevelSegments:3,steps:1});
          geo.rotateX(-Math.PI/2);mesh(geo,seatFabric,0,seat+.1,.015);
        } else {
          box(w-.02,.42,.14,0,seat+.23,-d/2+.08,fabric,r);
          for (const x of [-w/2+.075,w/2-.075]) {
            if (urban) { box(.035,.035,d-.03,x,seat+.24,0,metal); box(.035,.24,.035,x,seat+.1,d*.35,metal); }
            else box(.13,.27,d-.03,x,seat+.13,0,frame,r);
          }
        }
        if (rich) {
          const count = kind === "sofa" ? 3 : 1;
          for(let i=0;i<count;i++) box((w-.34)/count-.015,.08,d-.25,-(w-.34)/2+(i+.5)*(w-.34)/count,seat+.13,.045,linen,r);
          if(kind === "sofa") for(const x of [-w*.28,w*.28]) box(.27,.26,.12,x,seat+.36,-d*.21,accent,.035);
        }
      }
      if (lux) { box(w-.09,.025,d-.09,0,.06,0,metal,.01); for (let x=-w/2+.15;x<w/2-.1;x+=.12) box(.009,.01,d*.55,x,seat+.101,.02,linen); }
    } else if (kind === "bed") {
      box(w-.02,earthy?.2:.25,d-.02,0,.18,0,frame,r);
      box(w-.06,.25,d-.17,0,.4,.04,linen,.045);
      box(w-.02,rounded?1.0:.87,.12,0,.56,-d/2+.065,earthy?wood:fabric,r);
      box(w-.08,.035,d*.52,0,.545,d*.19,accent,.02);
      for(const x of [-w*.24,w*.24]) box(w*.37,.12,.37,x,.575,-d*.3,linen,.045);
      if(rich) for(let i=0;i<7;i++) box(.008,.65,.012,-w*.4+i*w*.8/6,.61,-d/2+.132,earthy?metal:linen);
      if(lux) box(w-.12,.022,d-.12,0,.06,0,metal,.01);
    } else if (["table","homeDining","accentTable","desk","console"].includes(kind)) {
      const dining = kind === "homeDining", small = kind === "accentTable", writing = kind === "desk" || kind === "console";
      const h = dining || writing ? .75 : small ? .55 : .4;
      const topMat = lux || rounded || kind === "accentTable" ? stone : wood;
      box(w-.015,.065,d-.015,0,h,0,topMat,rounded?.12:earthy?.045:.012);
      if(rounded || earthy) {
        if(small) cyl(w*.24,h-.05,0,(h-.05)/2,0,frame);
        else for(const x of [-w*.27,w*.27]) box(w*.12,h-.05,d*.65,x,(h-.05)/2,0,frame,.025);
      } else legs(w-.09,d-.09,h-.04);
      if(rich && !writing) box(w*.8,.06,d*.65,0,h-.07,0,frame,.015);
      if(rich && writing) { box(w*.35,.1,d*.7,-w*.25,h-.1,0,wood,.015); box(.15,.012,.015,-w*.25,h-.1,d*.35,metal); }
      if(lux) { cyl(.045,.14,-w*.25,h+.1,0,metal); cyl(.07,.012,w*.17,h+.04,0,accent); }
    } else if (kind === "homeDiningChair" || kind === "stool") {
      const h = kind === "stool" ? .78 : .45;
      legs(w-.02,d-.02,h-.05);
      box(w-.025,.09,d-.04,0,h,0,rounded||rich?fabric:wood,r);
      box(w-.03,.32,.065,0,h+.2,-d/2+.04,rich||rounded?fabric:frame,r);
      if(rich) box(w*.7,.025,.025,0,h*.45,d*.28,frame);
      if(lux) for(const x of [-w/2+.04,w/2-.04]) box(.035,.04,d*.6,x,h+.15,0,metal,.008);
    } else if (["sideboard","bookcase","wardrobe","bedside","counter"].includes(kind)) {
      const h = {sideboard:.78,bookcase:1.8,wardrobe:2.2,bedside:.52,counter:.95}[kind];
      const base = earthy ? .07 : .15;
      if(lux) {
        box(w-.02,h-base,d-.02,0,(h+base)/2,0,stone,Math.min(.12,w*.15));
      } else box(w-.02,h-base,d-.02,0,(h+base)/2,0,frame,r);
      if(!earthy) legs(w-.08,d-.06,base);
      const open = kind === "bookcase";
      if(rich) for(let x=-w/2+.05;x<w/2-.03;x+=lux?.1:.055) box(lux?.025:.012,h-base-.1,.012,x,(h+base)/2,d/2-.012,lux?metal:wood);
      if(open) {
        // Dark recessed panels and timber shelves give depth without leaving the footprint.
        for(let y=.38;y<h-.1;y+=.37) {
          box(w-.12-(rich?(Math.round(y*10)%2)*w*.2:0),.28,.025,rich?w*.05:0,y+.13,d/2-.03,urban?metal:accent);
          box(w-.08,.035,d-.03,0,y,0,wood,.008);
          for(let i=0;i<(rich?5:3);i++) box(.045,.14+i*.015,.1,-w*.32+i*.1,y+.09,d/2-.09,i%2?linen:accent);
        }
      } else {
        const count = kind === "bedside" ? 1 : 3;
        for(let i=0;i<count;i++) {
          const x = -w/2+(i+.5)*w/count;
          if(lux) {
            const aw=w/count-.035, ah=h-base-.06, ar=aw/2;
            const face=new T.Shape();face.moveTo(-aw/2,0);face.lineTo(aw/2,0);face.lineTo(aw/2,ah-ar);face.absarc(0,ah-ar,ar,0,Math.PI,false);face.lineTo(-aw/2,0);
            mesh(new T.ExtrudeGeometry(face,{depth:.016,bevelEnabled:false,curveSegments:20}),wood,x,base+.03,d/2-.025);
            const arch=mesh(new T.TorusGeometry(w/count*.26,.015,8,24,Math.PI),metal,x,h*.7,d/2-.017);arch.rotation.z=0;
          } else box(w/count-.025,h-base-.05,.018,x,(h+base)/2,d/2-.015,wood,.008);
          if(rich) box(.012,.12,.015,x+w/count*.3,h*.61,d/2-.004,metal);
        }
      }
      if(rich) box(w-.025,.045,d-.025,0,h+.025,0,lux?stone:wood,.012);
      if(lux && !open) for(let x=-w/2+.05;x<w/2-.03;x+=.07) box(.012,h-base-.1,.012,x,(h+base)/2,d/2-.005,wood);
    } else if(kind === "lamp") {
      cyl(.19,.035,0,.02,0,lux?stone:frame);cyl(.012,1.4,0,.72,0,metal);
      if(rounded) { const shade = mesh(new T.SphereGeometry(.22,24,16),linen,0,1.48,0); shade.scale.y=.7; }
      else mesh(new T.CylinderGeometry(earthy?.16:.12,.22,.28,32),rich?linen:wood,0,1.48,0);
      if(rich) cyl(.075,.15,0,1.35,0,metal);
      if(lux) cyl(.03,.15,0,1.7,0,metal);
    } else if(kind === "plant") {
      mesh(new T.CylinderGeometry(.17,.13,.34,24),lux?stone:wood,0,.17,0);
      const foliage=mat("#718565", "fabric");
      cyl(.018,1.1,0,.85,0,wood);
      for(let i=0;i<(rich?12:8);i++) { const a=i*2.4; const leaf=mesh(new T.SphereGeometry(.13,12,8),foliage,Math.sin(a)*.13,.7+i*.05,Math.cos(a)*.13);leaf.scale.set(1,.55,.8); }
    }
    if (earthy && rich) group.children.forEach(child => { child.position.y *= .9; child.scale.y *= .9; });
    if (rounded && lux && kind === "sofa") group.children.forEach(child => { child.scale.x *= .96; child.scale.z *= .94; });
    return true;
  }
  let previewRenderer;
  const previewCache = new Map();
  function preview(kind, context) {
    const key=JSON.stringify([kind,context.style,context.tier,context.palette,context.finish]);
    if(previewCache.has(key))return previewCache.get(key);
    try {
      const T=window.THREE;
      if(!previewRenderer) {
        previewRenderer=new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});
        previewRenderer.setSize(192,140);previewRenderer.setPixelRatio(1);previewRenderer.outputEncoding=T.sRGBEncoding;
      }
      const scene=new T.Scene(), group=new T.Group();
      build(kind,group,{...context,THREE:T,material:(color,roughness=.8)=>new T.MeshStandardMaterial({color:new T.Color(color).convertSRGBToLinear(),roughness}),texture:window.SECHA_COMMERCIAL_FURNITURE.texture});
      scene.add(group);scene.add(new T.HemisphereLight(0xffffff,0xb6aa92,1.15));
      const light=new T.DirectionalLight(0xffffff,.9);light.position.set(-3,6,4);scene.add(light);
      const bounds=new T.Box3().setFromObject(group), size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
      const extent=Math.max(size.x,size.y,size.z)*.82;
      const camera=new T.OrthographicCamera(-extent*192/140,extent*192/140,extent,-extent,.1,100);
      camera.position.copy(center).add(new T.Vector3(4,3.2,5));camera.lookAt(center);camera.updateMatrixWorld();
      previewRenderer.render(scene,camera);
      const url=previewRenderer.domElement.toDataURL("image/png");
      group.traverse(obj=>{obj.geometry?.dispose();obj.material?.dispose();});
      if(previewCache.size>240)previewCache.clear();previewCache.set(key,url);return url;
    } catch { return null; }
  }
  function thumbnail(kind, style) {
    const rounded = style === "soft-contemporary", urban = style === "urban-studio", earthy = style === "earthy-retreat";
    const wood = urban ? "#746958" : earthy ? "#8c734b" : "#bd9f76", cloth = rounded ? "#e4e0d9" : earthy ? "#d9c2a3" : "#e7dfd0", frame = urban ? "#222222" : wood;
    const rect = (x,y,w,h,fill,r=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
    let shape;
    if(["sofa","chair","bench","ottoman"].includes(kind)) { const back=kind==='sofa'||kind==='chair';shape=rect(23,back?25:42,74,back?30:16,cloth,rounded?14:3)+rect(26,55,5,10,frame)+rect(89,55,5,10,frame)+(back?rect(19,38,10,20,frame,rounded?5:0)+rect(91,38,10,20,frame,rounded?5:0):''); }
    else if(kind==='bed')shape=rect(25,15,70,43,frame,rounded?12:2)+rect(27,30,66,31,cloth,rounded?8:2)+rect(27,47,66,13,wood)+rect(32,32,24,10,'#f1eee7',3)+rect(64,32,24,10,'#f1eee7',3);
    else if(['sideboard','wardrobe','bookcase','counter','bedside'].includes(kind)) {shape=rect(25,kind==='wardrobe'||kind==='bookcase'?10:30,70,48,wood,rounded?8:1);for(let i=0;i<3;i++)shape+=rect(29+i*22,34,18,2,frame);shape+=rect(30,65,4,6,frame)+rect(86,65,4,6,frame);}
    else if(kind==='lamp')shape=rect(58,25,4,40,frame)+rect(44,63,32,4,frame)+rect(40,10,40,25,cloth,rounded?12:3);
    else if(kind==='plant')shape=rect(47,45,26,22,wood,4)+'<ellipse cx="60" cy="30" rx="22" ry="24" fill="#718565"/>';
    else if(kind==='homeDiningChair'||kind==='stool')shape=rect(39,13,42,30,frame,rounded?12:2)+rect(37,40,46,9,cloth,4)+rect(40,48,4,20,frame)+rect(76,48,4,20,frame);
    else shape=rect(19,30,82,9,rounded?'#cdccc7':wood,rounded?5:1)+rect(33,39,6,27,frame)+rect(81,39,6,27,frame);
    return `<svg viewBox="0 0 120 78" aria-hidden="true">${shape}</svg>`;
  }
  return { tiers, catalog, supported, price, model, build, preview, thumbnail };
});
