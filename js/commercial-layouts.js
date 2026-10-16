/* One metric source for commercial plans, furniture schedules and WebGL starters. */
(function(root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else root.SECHA_COMMERCIAL_LAYOUTS = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function() {
  const catalog = {
    diningTable:{name:"Round café table",category:"work",price:1800000,w:.75,d:.75,seats:0,color:"#c2aa87",model:"table"},
    diningChair:{name:"Oak dining chair",category:"work",price:1400000,w:.48,d:.52,seats:1,color:"#bcb095",model:"chair"},
    cafeCounter:{name:"Espresso service counter",category:"work",price:6500000,w:2.4,d:.8,color:"#d0c1a6",model:"counter"},
    pastryCounter:{name:"Display counter",category:"work",price:5800000,w:2.4,d:.8,color:"#d0c1a6",model:"counter"},
    prepCounter:{name:"Preparation & sink unit",category:"work",price:4200000,w:2.4,d:.6,color:"#9d9178",model:"counter"},
    barCounter:{name:"Basalt bar counter",category:"work",price:7200000,w:2.4,d:.85,color:"#4a4943",model:"counter"},
    backbar:{name:"Record & bottle backbar",category:"work",price:5400000,w:2.4,d:.45,color:"#a8855c",model:"counter"},
    banquette:{name:"Four-seat banquette",category:"living",price:6800000,w:2.4,d:.65,seats:4,color:"#93634b",model:"sofa"},
    taskChair:{name:"Ergonomic task chair",category:"work",price:2200000,w:.65,d:.65,seats:1,color:"#68735d",model:"chair"},
    meetingTable:{name:"Six-person meeting table",category:"work",price:5600000,w:2.4,d:1.05,color:"#9d805d",model:"desk"},
    reception:{name:"Reception desk",category:"work",price:5900000,w:1.8,d:.7,color:"#c8b99e",model:"counter"},
    salonChair:{name:"Hydraulic salon chair",category:"work",price:3900000,w:.75,d:.85,seats:1,color:"#78413d",model:"chair"},
    washUnit:{name:"Shampoo wash unit",category:"work",price:6200000,w:.8,d:1.35,color:"#b5a795",model:"chair"},
    towelCabinet:{name:"Towel & supply cabinet",category:"work",price:2900000,w:1.2,d:.45,color:"#ad9575",model:"counter"},
    privacyScreen:{name:"Timber privacy screen",category:"work",price:2400000,w:.12,d:2.4,color:"#a49173",model:"counter"},
    sideTable:{name:"Stone side table",category:"living",price:1100000,w:.45,d:.45,color:"#c7bea7",model:"table"},
  };
  Object.assign(catalog, {
    desk:{name:"Studio desk",category:"work",price:2400000,w:1.5,d:.7,color:"#ac8964",model:"desk"},
    sofa:{name:"Sunday sofa",category:"living",price:4200000,w:2.1,d:.9,seats:3,color:"#b8b29a",model:"sofa"},
    treatment:{name:"Treatment bed",category:"work",price:5200000,w:.85,d:2,color:"#ded9c3",model:"bed"},
    salon:{name:"Styling station",category:"work",price:3800000,w:1.1,d:.5,color:"#ac8964",model:"desk"},
    stool:{name:"Counter stool",category:"work",price:950000,w:.5,d:.5,seats:1,color:"#95634b",model:"chair"},
    plant:{name:"Indoor olive",category:"details",price:450000,w:.6,d:.6,color:"#748963",model:"plant"},
  });
  const layouts = {
    cafe:{name:"Café Sol",label:"Café",w:10,d:8,budget:110000000,board:"nomad",finish:"n1",entry:{x:0,z:3.5},palette:{wall:"#e6ddc7",floor:"#c6bca6",fabric:"#d1c4a8",accent:"#bda16d"},summary:"8 dining seats · espresso & display counters · 1.2 m service aisle",pieces:[]},
    bar:{name:"Ember listening bar",night:true,label:"Bar",w:12,d:8,budget:140000000,board:"purist",finish:"p2",entry:{x:0,z:3.5},palette:{wall:"#d2c4ae",floor:"#777568",fabric:"#95634b",accent:"#a47554"},summary:"14 seats · 4.8 m bar · record backbar · 1.2 m staff aisle",pieces:[]},
    wellness:{name:"Still wellness studio",label:"Wellness",w:12,d:8,budget:100000000,board:"dreamer",finish:"d2",entry:{x:0,z:3.5},palette:{wall:"#e5e1d3",floor:"#ccc7b3",fabric:"#c4ceba",accent:"#8eaa8f"},summary:"3 treatment beds · screened zones · reception & waiting",pieces:[]},
    office:{name:"Common Ground",label:"Office",w:12,d:8,budget:140000000,board:"architect",finish:"a1",entry:{x:0,z:3.5},palette:{wall:"#dedbce",floor:"#a18c70",fabric:"#a5b093",accent:"#72846b"},summary:"6 workstations · 4 meeting seats · lounge & reception",pieces:[]},
    salon:{name:"Contour salon",label:"Salon",w:10,d:8,budget:95000000,board:"purist",finish:"p2",entry:{x:0,z:3.5},palette:{wall:"#e1d5c5",floor:"#c1b9a5",fabric:"#874a45",accent:"#a28b75"},summary:"3 styling stations · shampoo zone · reception & waiting",pieces:[]},
  };
  const add=(type,kind,x,z,r=0)=>layouts[type].pieces.push([kind,x,z,r]);
  for(const x of [-1.25,1.25]) add("cafe","prepCounter",x,-3.3);
  add("cafe","cafeCounter",-1.25,-1.5);add("cafe","pastryCounter",1.25,-1.5);
  for(const x of [-2.8,2.8]) for(const z of [.3,2.4]) {
    add("cafe","diningTable",x,z);add("cafe","diningChair",x-.8,z,1);add("cafe","diningChair",x+.8,z,3);
  }
  add("cafe","plant",-4.3,3.3);add("cafe","plant",4.3,3.3);
  for(const x of [-1.25,1.25]) {add("bar","backbar",x,-3.35);add("bar","barCounter",x,-1.5);}
  for(const x of [-2,-1.2,-.4,.4,1.2,2]) add("bar","stool",x,-.35,2);
  add("bar","banquette",-4.5,1.2,1);add("bar","banquette",4.5,1.2,3);
  for(const x of [-3.4,3.4]) for(const z of [.4,2]) add("bar","diningTable",x,z);
  add("bar","plant",-5.2,3.3);add("bar","plant",5.2,3.3);
  for(const x of [-3.8,0,3.8]) {add("wellness","treatment",x,-1.4);add("wellness","sideTable",x+.95,-1.4);}
  for(const x of [-1.9,1.9]) add("wellness","privacyScreen",x,-1.4);
  add("wellness","reception",-3.5,2.8);add("wellness","sofa",3,2.8,2);add("wellness","towelCabinet",4.5,-3.3);
  add("wellness","plant",-5.2,3.3);add("wellness","plant",5.2,3.3);
  for(const x of [-4.8,-2.95,-1.1]) for(const z of [-2.6,.4]) {add("office","desk",x,z);add("office","taskChair",x,z+.95,2);}
  add("office","meetingTable",3.6,-1.6,1);
  for(const z of [-2.25,-.95]) {add("office","diningChair",2.5,z,1);add("office","diningChair",4.7,z,3);}
  add("office","privacyScreen",1.5,-1.6);add("office","sofa",3,2.7,2);add("office","reception",-3.5,2.9);
  add("office","plant",-5.2,3.3);add("office","plant",5.2,3.3);
  for(const x of [-3.3,-.2,2.9]) {add("salon","salon",x,-3.2);add("salon","salonChair",x,-1.9,2);}
  add("salon","washUnit",3.5,1.4);add("salon","privacyScreen",1.9,1.4);add("salon","towelCabinet",4.2,-3.3);
  add("salon","reception",-3,2.8);add("salon","sofa",-3.5,.8,1);add("salon","plant",4.3,3.3);
  return {catalog,layouts};
});
