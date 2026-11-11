/* Studio+ shared decision engine. Versioned concept catalogue; no model claims. */
(function(root,factory){const engine=factory();if(typeof module==="object"&&module.exports)module.exports=engine;else root.StudioEngine=engine;})(typeof globalThis!=="undefined"?globalThis:this,function(){
const DATA={
  "catalog": {
    "sofa": {
      "name": "Sunday sofa",
      "category": "living",
      "price": 4200000,
      "w": 2.1,
      "d": 0.9,
      "icon": "▰",
      "color": "#b8b29a",
      "seats": 3,
      "model": "sofa"
    },
    "chair": {
      "name": "Lounge chair",
      "category": "living",
      "price": 1800000,
      "w": 0.85,
      "d": 0.85,
      "icon": "▱",
      "color": "#a69c7f"
    },
    "table": {
      "name": "Pebble table",
      "category": "living",
      "price": 1200000,
      "w": 1.1,
      "d": 0.65,
      "icon": "⬭",
      "color": "#ae845f"
    },
    "bed": {
      "name": "Cloud bed",
      "category": "living",
      "price": 4800000,
      "w": 1.7,
      "d": 2.15,
      "icon": "▤",
      "color": "#ded9c3"
    },
    "desk": {
      "name": "Studio desk",
      "category": "work",
      "price": 2400000,
      "w": 1.5,
      "d": 0.7,
      "icon": "⊓",
      "color": "#ac8964",
      "model": "desk"
    },
    "counter": {
      "name": "Gather counter",
      "category": "work",
      "price": 3600000,
      "w": 2,
      "d": 0.75,
      "icon": "▥",
      "color": "#8e9b7a"
    },
    "plant": {
      "name": "Indoor olive",
      "category": "details",
      "price": 450000,
      "w": 0.6,
      "d": 0.6,
      "icon": "♧",
      "color": "#748963",
      "model": "plant"
    },
    "lamp": {
      "name": "Arc floor lamp",
      "category": "details",
      "price": 850000,
      "w": 0.5,
      "d": 0.5,
      "icon": "◴",
      "color": "#c6a66e"
    },
    "stool": {
      "name": "Counter stool",
      "category": "work",
      "price": 950000,
      "w": 0.5,
      "d": 0.5,
      "icon": "⊓",
      "color": "#95634b",
      "seats": 1,
      "model": "chair"
    },
    "treatment": {
      "name": "Treatment bed",
      "category": "work",
      "price": 5200000,
      "w": 0.85,
      "d": 2,
      "icon": "▤",
      "color": "#ded9c3",
      "model": "bed"
    },
    "salon": {
      "name": "Styling station",
      "category": "work",
      "price": 3800000,
      "w": 1.1,
      "d": 0.5,
      "icon": "▥",
      "color": "#ac8964",
      "model": "desk"
    },
    "diningTable": {
      "name": "Round café table",
      "category": "work",
      "price": 1800000,
      "w": 0.75,
      "d": 0.75,
      "seats": 0,
      "color": "#c2aa87",
      "model": "table",
      "icon": "⬭"
    },
    "diningChair": {
      "name": "Oak dining chair",
      "category": "work",
      "price": 1400000,
      "w": 0.48,
      "d": 0.52,
      "seats": 1,
      "color": "#bcb095",
      "model": "chair",
      "icon": "▱"
    },
    "cafeCounter": {
      "name": "Espresso service counter",
      "category": "work",
      "price": 6500000,
      "w": 2.4,
      "d": 0.8,
      "color": "#d0c1a6",
      "model": "counter",
      "icon": "▥"
    },
    "pastryCounter": {
      "name": "Display counter",
      "category": "work",
      "price": 5800000,
      "w": 2.4,
      "d": 0.8,
      "color": "#d0c1a6",
      "model": "counter",
      "icon": "▥"
    },
    "prepCounter": {
      "name": "Preparation & sink unit",
      "category": "work",
      "price": 4200000,
      "w": 2.4,
      "d": 0.6,
      "color": "#9d9178",
      "model": "counter",
      "icon": "▥"
    },
    "barCounter": {
      "name": "Basalt bar counter",
      "category": "work",
      "price": 7200000,
      "w": 2.4,
      "d": 0.85,
      "color": "#4a4943",
      "model": "counter",
      "icon": "▥"
    },
    "backbar": {
      "name": "Record & bottle backbar",
      "category": "work",
      "price": 5400000,
      "w": 2.4,
      "d": 0.45,
      "color": "#a8855c",
      "model": "counter",
      "icon": "▥"
    },
    "banquette": {
      "name": "Four-seat banquette",
      "category": "living",
      "price": 6800000,
      "w": 2.4,
      "d": 0.65,
      "seats": 4,
      "color": "#93634b",
      "model": "sofa",
      "icon": "▰"
    },
    "taskChair": {
      "name": "Ergonomic task chair",
      "category": "work",
      "price": 2200000,
      "w": 0.65,
      "d": 0.65,
      "seats": 1,
      "color": "#68735d",
      "model": "chair",
      "icon": "▱"
    },
    "meetingTable": {
      "name": "Six-person meeting table",
      "category": "work",
      "price": 5600000,
      "w": 2.4,
      "d": 1.05,
      "color": "#9d805d",
      "model": "desk",
      "icon": "⊓"
    },
    "reception": {
      "name": "Reception desk",
      "category": "work",
      "price": 5900000,
      "w": 1.8,
      "d": 0.7,
      "color": "#c8b99e",
      "model": "counter",
      "icon": "▥"
    },
    "salonChair": {
      "name": "Hydraulic salon chair",
      "category": "work",
      "price": 3900000,
      "w": 0.75,
      "d": 0.85,
      "seats": 1,
      "color": "#78413d",
      "model": "chair",
      "icon": "▱"
    },
    "washUnit": {
      "name": "Shampoo wash unit",
      "category": "work",
      "price": 6200000,
      "w": 0.8,
      "d": 1.35,
      "color": "#b5a795",
      "model": "chair",
      "icon": "▱"
    },
    "towelCabinet": {
      "name": "Towel & supply cabinet",
      "category": "work",
      "price": 2900000,
      "w": 1.2,
      "d": 0.45,
      "color": "#ad9575",
      "model": "counter",
      "icon": "▥"
    },
    "privacyScreen": {
      "name": "Timber privacy screen",
      "category": "work",
      "price": 2400000,
      "w": 0.12,
      "d": 2.4,
      "color": "#a49173",
      "model": "counter",
      "icon": "▥"
    },
    "sideTable": {
      "name": "Stone side table",
      "category": "living",
      "price": 1100000,
      "w": 0.45,
      "d": 0.45,
      "color": "#c7bea7",
      "model": "table",
      "icon": "⬭"
    },
    "homeDining": {
      "name": "Gather dining table",
      "category": "dining",
      "price": 3200000,
      "w": 1.8,
      "d": 0.9,
      "icon": "⊓",
      "model": "table"
    },
    "homeDiningChair": {
      "name": "Frame dining chair",
      "category": "dining",
      "price": 1200000,
      "w": 0.55,
      "d": 0.6,
      "icon": "▱",
      "model": "chair"
    },
    "sideboard": {
      "name": "Archive sideboard",
      "category": "storage",
      "price": 3600000,
      "w": 1.6,
      "d": 0.45,
      "icon": "▥",
      "model": "counter"
    },
    "bookcase": {
      "name": "Display bookcase",
      "category": "storage",
      "price": 2800000,
      "w": 1.1,
      "d": 0.35,
      "icon": "▥",
      "model": "counter"
    },
    "wardrobe": {
      "name": "Atelier wardrobe",
      "category": "storage",
      "price": 5800000,
      "w": 1.8,
      "d": 0.6,
      "icon": "▥",
      "model": "counter"
    },
    "console": {
      "name": "Entry console",
      "category": "storage",
      "price": 2100000,
      "w": 1.2,
      "d": 0.35,
      "icon": "⊓",
      "model": "desk"
    },
    "ottoman": {
      "name": "Cloud ottoman",
      "category": "living",
      "price": 950000,
      "w": 0.7,
      "d": 0.7,
      "icon": "⬭",
      "model": "chair"
    },
    "bench": {
      "name": "End-of-bed bench",
      "category": "living",
      "price": 1800000,
      "w": 1.3,
      "d": 0.45,
      "icon": "▰",
      "model": "sofa"
    },
    "bedside": {
      "name": "Bedside cabinet",
      "category": "storage",
      "price": 1100000,
      "w": 0.5,
      "d": 0.45,
      "icon": "▥",
      "model": "counter"
    },
    "accentTable": {
      "name": "Sculpted side table",
      "category": "living",
      "price": 850000,
      "w": 0.45,
      "d": 0.45,
      "icon": "⬭",
      "model": "table"
    }
  },
  "spaces": {
    "studio": {
      "name": "The Sunday studio",
      "label": "Studio apartment",
      "w": 8,
      "d": 6,
      "budget": 30000000,
      "pieces": [
        [
          "bed",
          -2.6,
          -1.5,
          0
        ],
        [
          "sofa",
          0.3,
          0.5,
          0
        ],
        [
          "table",
          0.4,
          1.8,
          0
        ],
        [
          "desk",
          1.9,
          -2.3,
          0
        ],
        [
          "plant",
          3.25,
          -2,
          0
        ],
        [
          "lamp",
          -1.2,
          0.4,
          0
        ]
      ]
    },
    "residence": {
      "name": "A slower kind of home",
      "label": "Residence",
      "w": 10,
      "d": 8,
      "budget": 50000000,
      "pieces": [
        [
          "bed",
          -3,
          -2.1,
          0
        ],
        [
          "desk",
          -3,
          2.7,
          0
        ],
        [
          "sofa",
          1.1,
          0.3,
          0
        ],
        [
          "chair",
          3.5,
          0.4,
          0
        ],
        [
          "table",
          1.4,
          1.8,
          0
        ],
        [
          "counter",
          2,
          -3.2,
          0
        ],
        [
          "plant",
          4.3,
          3.3,
          0
        ],
        [
          "lamp",
          -0.5,
          0.4,
          0
        ]
      ]
    },
    "commercial": {
      "name": "The neighbourhood gathering",
      "label": "Commercial café",
      "w": 10,
      "d": 7,
      "budget": 45000000,
      "pieces": [
        [
          "counter",
          -2.8,
          -2.5,
          0
        ],
        [
          "counter",
          -0.7,
          -2.5,
          0
        ],
        [
          "table",
          -2,
          0,
          0
        ],
        [
          "chair",
          -2,
          1,
          2
        ],
        [
          "table",
          1.5,
          0.5,
          0
        ],
        [
          "chair",
          1.5,
          1.6,
          2
        ],
        [
          "desk",
          3.5,
          -2.5,
          0
        ],
        [
          "plant",
          4.2,
          2.7,
          0
        ]
      ]
    }
  },
  "commercialTypes": {
    "cafe": {
      "name": "Café Sol",
      "label": "Café",
      "w": 10,
      "d": 8,
      "budget": 110000000,
      "board": "nomad",
      "finish": "n1",
      "entry": {
        "x": 0,
        "z": 3.5
      },
      "palette": {
        "wall": "#e6ddc7",
        "floor": "#c6bca6",
        "fabric": "#d1c4a8",
        "accent": "#bda16d"
      },
      "summary": "8 dining seats · espresso & display counters · 1.2 m service aisle",
      "pieces": [
        [
          "prepCounter",
          -1.25,
          -3.3,
          0
        ],
        [
          "prepCounter",
          1.25,
          -3.3,
          0
        ],
        [
          "cafeCounter",
          -1.25,
          -1.5,
          0
        ],
        [
          "pastryCounter",
          1.25,
          -1.5,
          0
        ],
        [
          "diningTable",
          -2.8,
          0.3,
          0
        ],
        [
          "diningChair",
          -3.5999999999999996,
          0.3,
          1
        ],
        [
          "diningChair",
          -1.9999999999999998,
          0.3,
          3
        ],
        [
          "diningTable",
          -2.8,
          2.4,
          0
        ],
        [
          "diningChair",
          -3.5999999999999996,
          2.4,
          1
        ],
        [
          "diningChair",
          -1.9999999999999998,
          2.4,
          3
        ],
        [
          "diningTable",
          2.8,
          0.3,
          0
        ],
        [
          "diningChair",
          1.9999999999999998,
          0.3,
          1
        ],
        [
          "diningChair",
          3.5999999999999996,
          0.3,
          3
        ],
        [
          "diningTable",
          2.8,
          2.4,
          0
        ],
        [
          "diningChair",
          1.9999999999999998,
          2.4,
          1
        ],
        [
          "diningChair",
          3.5999999999999996,
          2.4,
          3
        ],
        [
          "plant",
          -4.3,
          3.3,
          0
        ],
        [
          "plant",
          4.3,
          3.3,
          0
        ]
      ]
    },
    "bar": {
      "name": "Ember listening bar",
      "night": true,
      "label": "Bar",
      "w": 12,
      "d": 8,
      "budget": 140000000,
      "board": "purist",
      "finish": "p2",
      "entry": {
        "x": 0,
        "z": 3.5
      },
      "palette": {
        "wall": "#d2c4ae",
        "floor": "#777568",
        "fabric": "#95634b",
        "accent": "#a47554"
      },
      "summary": "14 seats · 4.8 m bar · record backbar · 1.2 m staff aisle",
      "pieces": [
        [
          "backbar",
          -1.25,
          -3.35,
          0
        ],
        [
          "barCounter",
          -1.25,
          -1.5,
          0
        ],
        [
          "backbar",
          1.25,
          -3.35,
          0
        ],
        [
          "barCounter",
          1.25,
          -1.5,
          0
        ],
        [
          "stool",
          -2,
          -0.35,
          2
        ],
        [
          "stool",
          -1.2,
          -0.35,
          2
        ],
        [
          "stool",
          -0.4,
          -0.35,
          2
        ],
        [
          "stool",
          0.4,
          -0.35,
          2
        ],
        [
          "stool",
          1.2,
          -0.35,
          2
        ],
        [
          "stool",
          2,
          -0.35,
          2
        ],
        [
          "banquette",
          -4.5,
          1.2,
          1
        ],
        [
          "banquette",
          4.5,
          1.2,
          3
        ],
        [
          "diningTable",
          -3.4,
          0.4,
          0
        ],
        [
          "diningTable",
          -3.4,
          2,
          0
        ],
        [
          "diningTable",
          3.4,
          0.4,
          0
        ],
        [
          "diningTable",
          3.4,
          2,
          0
        ],
        [
          "plant",
          -5.2,
          3.3,
          0
        ],
        [
          "plant",
          5.2,
          3.3,
          0
        ]
      ]
    },
    "wellness": {
      "name": "Still wellness studio",
      "label": "Wellness",
      "w": 12,
      "d": 8,
      "budget": 100000000,
      "board": "dreamer",
      "finish": "d2",
      "entry": {
        "x": 0,
        "z": 3.5
      },
      "palette": {
        "wall": "#e5e1d3",
        "floor": "#ccc7b3",
        "fabric": "#c4ceba",
        "accent": "#8eaa8f"
      },
      "summary": "3 treatment beds · screened zones · reception & waiting",
      "pieces": [
        [
          "treatment",
          -3.8,
          -1.4,
          0
        ],
        [
          "sideTable",
          -2.8499999999999996,
          -1.4,
          0
        ],
        [
          "treatment",
          0,
          -1.4,
          0
        ],
        [
          "sideTable",
          0.95,
          -1.4,
          0
        ],
        [
          "treatment",
          3.8,
          -1.4,
          0
        ],
        [
          "sideTable",
          4.75,
          -1.4,
          0
        ],
        [
          "privacyScreen",
          -1.9,
          -1.4,
          0
        ],
        [
          "privacyScreen",
          1.9,
          -1.4,
          0
        ],
        [
          "reception",
          -3.5,
          2.8,
          0
        ],
        [
          "sofa",
          3,
          2.8,
          2
        ],
        [
          "towelCabinet",
          4.5,
          -3.3,
          0
        ],
        [
          "plant",
          -5.2,
          3.3,
          0
        ],
        [
          "plant",
          5.2,
          3.3,
          0
        ]
      ]
    },
    "office": {
      "name": "Common Ground",
      "label": "Office",
      "w": 12,
      "d": 8,
      "budget": 140000000,
      "board": "architect",
      "finish": "a1",
      "entry": {
        "x": 0,
        "z": 3.5
      },
      "palette": {
        "wall": "#dedbce",
        "floor": "#a18c70",
        "fabric": "#a5b093",
        "accent": "#72846b"
      },
      "summary": "6 workstations · 4 meeting seats · lounge & reception",
      "pieces": [
        [
          "desk",
          -4.8,
          -2.6,
          0
        ],
        [
          "taskChair",
          -4.8,
          -1.6500000000000001,
          2
        ],
        [
          "desk",
          -4.8,
          0.4,
          0
        ],
        [
          "taskChair",
          -4.8,
          1.35,
          2
        ],
        [
          "desk",
          -2.95,
          -2.6,
          0
        ],
        [
          "taskChair",
          -2.95,
          -1.6500000000000001,
          2
        ],
        [
          "desk",
          -2.95,
          0.4,
          0
        ],
        [
          "taskChair",
          -2.95,
          1.35,
          2
        ],
        [
          "desk",
          -1.1,
          -2.6,
          0
        ],
        [
          "taskChair",
          -1.1,
          -1.6500000000000001,
          2
        ],
        [
          "desk",
          -1.1,
          0.4,
          0
        ],
        [
          "taskChair",
          -1.1,
          1.35,
          2
        ],
        [
          "meetingTable",
          3.6,
          -1.6,
          1
        ],
        [
          "diningChair",
          2.5,
          -2.25,
          1
        ],
        [
          "diningChair",
          4.7,
          -2.25,
          3
        ],
        [
          "diningChair",
          2.5,
          -0.95,
          1
        ],
        [
          "diningChair",
          4.7,
          -0.95,
          3
        ],
        [
          "privacyScreen",
          1.5,
          -1.6,
          0
        ],
        [
          "sofa",
          3,
          2.7,
          2
        ],
        [
          "reception",
          -3.5,
          2.9,
          0
        ],
        [
          "plant",
          -5.2,
          3.3,
          0
        ],
        [
          "plant",
          5.2,
          3.3,
          0
        ]
      ]
    },
    "salon": {
      "name": "Contour salon",
      "label": "Salon",
      "w": 10,
      "d": 8,
      "budget": 95000000,
      "board": "purist",
      "finish": "p2",
      "entry": {
        "x": 0,
        "z": 3.5
      },
      "palette": {
        "wall": "#e1d5c5",
        "floor": "#c1b9a5",
        "fabric": "#874a45",
        "accent": "#a28b75"
      },
      "summary": "3 styling stations · shampoo zone · reception & waiting",
      "pieces": [
        [
          "salon",
          -3.3,
          -3.2,
          0
        ],
        [
          "salonChair",
          -3.3,
          -1.9,
          2
        ],
        [
          "salon",
          -0.2,
          -3.2,
          0
        ],
        [
          "salonChair",
          -0.2,
          -1.9,
          2
        ],
        [
          "salon",
          2.9,
          -3.2,
          0
        ],
        [
          "salonChair",
          2.9,
          -1.9,
          2
        ],
        [
          "washUnit",
          3.5,
          1.4,
          0
        ],
        [
          "privacyScreen",
          1.9,
          1.4,
          0
        ],
        [
          "towelCabinet",
          4.2,
          -3.3,
          0
        ],
        [
          "reception",
          -3,
          2.8,
          0
        ],
        [
          "sofa",
          -3.5,
          0.8,
          1
        ],
        [
          "plant",
          4.3,
          3.3,
          0
        ]
      ]
    }
  },
  "tiers": {
    "standard": {
      "name": "Standard",
      "multiplier": 1,
      "description": "Everyday essentials · simple frames and upholstery"
    },
    "premium": {
      "name": "Premium",
      "multiplier": 1.65,
      "description": "Refined comfort · layered upholstery and crafted joinery"
    },
    "lux": {
      "name": "Lux",
      "multiplier": 2.8,
      "description": "Statement pieces · sculpted forms, stone and metal details"
    }
  }
};
  const VERSION='0.1.0', FORMAT='secha-studio-passport';
  const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  const text=(v,max=160)=>String(v==null?'':v).trim().slice(0,max);
  function num(v,min,max,label){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error('Invalid '+label);return v;}
  function choice(v,list,label){if(!list.includes(v))throw Error('Invalid '+label);return v;}
  function cleanFloor(f,type,commercialType){
    if(!f||typeof f!=='object')throw Error('Invalid floor');
    const startMode=choice(f.startMode,['blank','furnished'],'starting layout');
    const dimensions={w:num(f.dimensions?.w,4,16,'width'),d:num(f.dimensions?.d,4,14,'depth')};
    if(dimensions.w%.5||dimensions.d%.5)throw Error('Room dimensions must use 0.5 m increments');
    if(!Array.isArray(f.items)||f.items.length>80)throw Error('Each floor supports up to 80 pieces');
    const ids=new Set();
    const items=f.items.map(i=>{
      if(!i||!own(DATA.catalog,i.kind))throw Error('Unknown furniture type');
      num(i.id,1,Number.MAX_SAFE_INTEGER-1,'piece ID');if(!Number.isSafeInteger(i.id)||ids.has(i.id))throw Error('Duplicate or invalid piece ID');ids.add(i.id);
      const item={id:i.id,kind:i.kind,x:num(i.x,-100,100,'x position'),z:num(i.z,-100,100,'z position'),r:num(i.r,0,3,'rotation'),tier:choice(i.tier||'standard',Object.keys(DATA.tiers),'furniture tier')};
      if(!Number.isInteger(item.r))throw Error('Invalid rotation');
      if(i.lightOn!=null)item.lightOn=i.lightOn===true;
      return item;
    });
    const out={startMode,dimensions,items,night:f.night===true,furnitureTier:choice(f.furnitureTier||'standard',Object.keys(DATA.tiers),'floor tier')};
    for(const key of ['moodboard','finishing','finishTarget','ambiance','palette','residentialStyle'])out[key]=f[key]==null?null:text(f[key],50);
    // These IDs are interpreted by the playground, never executed.
    if(!['architect','nomad','visionary','purist','aesthete','dreamer'].includes(out.moodboard)||!['architect','nomad','visionary','purist','aesthete','dreamer'].includes(out.ambiance))throw Error('Unknown moodboard');
    if(!['joinery','floor','walls'].includes(out.finishTarget))throw Error('Unknown finish target');
    return out;
  }
  function normalize(input){
    if(!input||input.format!==FORMAT||input.version!==1)throw Error('Choose a Studio+ project passport (version 1)');
    const id=text(input.projectId,80);if(!/^[a-zA-Z0-9_-]{8,80}$/.test(id))throw Error('Invalid project reference');
    const raw=input.layout;if(!raw||!Array.isArray(raw.floors)||raw.floors.length<1||raw.floors.length>6)throw Error('A project needs 1–6 floors');
    const type=choice(raw.type,['studio','residence','commercial'],'space type');
    const commercialType=choice(raw.commercialType||'cafe',Object.keys(DATA.commercialTypes),'commercial type');
    const floors=raw.floors.map(f=>cleanFloor(f,type,commercialType));
    const activeFloor=num(raw.activeFloor||0,0,floors.length-1,'active floor');if(!Number.isInteger(activeFloor))throw Error('Invalid active floor');
    const layout={type,commercialType,floors,activeFloor,...floors[activeFloor],quests:{add:raw.quests?.add===true,palette:raw.quests?.palette===true,walk:raw.quests?.walk===true}};
    const assumptions=input.assumptions||{};
    const amount=k=>assumptions[k]==null?null:num(assumptions[k],0,1e12,k);
    const lockedIds=Array.isArray(input.constraints?.keepPieceIds)?input.constraints.keepPieceIds.map(v=>text(v,100)).slice(0,480):[];
    return {format:FORMAT,version:1,engineVersion:VERSION,projectId:id,name:text(input.name||'My playground project',100),source:'secha-studio-playground',brief:text(input.brief,1500),layout,
      assumptions:{budget:amount('budget'),installation:amount('installation'),delivery:amount('delivery'),tax:amount('tax'),contingencyPct:assumptions.contingencyPct==null?10:num(assumptions.contingencyPct,0,50,'contingency')},
      constraints:{noDemolition:input.constraints?.noDemolition!==false,measurementsConfirmed:input.constraints?.measurementsConfirmed===true,keepPieceIds:lockedIds}};
  }
  function dimensions(project,floor){const cfg=project.layout.type==='commercial'?DATA.commercialTypes[project.layout.commercialType]:DATA.spaces[project.layout.type];return floor.startMode==='blank'?floor.dimensions:{w:cfg.w,d:cfg.d};}
  function price(item){return Math.round(DATA.catalog[item.kind].price*DATA.tiers[item.tier||'standard'].multiplier/1000)*1000;}
  function footprint(item){const s=DATA.catalog[item.kind];return item.r%2?{w:s.d,d:s.w}:{w:s.w,d:s.d};}
  function analyze(input){
    const p=normalize(input),issues=[],selections=[],floors=[];
    let subtotal=0,standardSubtotal=0;
    const warn=(code,message,floor,pieces=[])=>issues.push({code,message,floor,pieces});
    p.layout.floors.forEach((f,fi)=>{
      const d=dimensions(p,f);let total=0;
      for(const item of f.items){
        const spec=DATA.catalog[item.kind],fp=footprint(item),cost=price(item);
        total+=cost;subtotal+=cost;standardSubtotal+=price({...item,tier:'standard'});
        selections.push({floor:fi,pieceId:item.id,kind:item.kind,name:spec.name,tier:item.tier,unitPrice:cost,width:spec.w,depth:spec.d,x:item.x,z:item.z,rotation:item.r,priceStatus:'illustrative',supplierVerified:false});
        if(Math.abs(item.x)+fp.w/2>d.w/2+.001||Math.abs(item.z)+fp.d/2>d.d/2+.001)warn('outside_room',spec.name+' extends beyond the room rectangle',fi,[item.id]);
      }
      for(let i=0;i<f.items.length;i++)for(let j=i+1;j<f.items.length;j++){
        const a=f.items[i],b=f.items[j],aa=footprint(a),bb=footprint(b);
        if(Math.abs(a.x-b.x)<(aa.w+bb.w)/2-.015&&Math.abs(a.z-b.z)<(aa.d+bb.d)/2-.015)warn('footprint_overlap','Check overlapping footprints: '+DATA.catalog[a.kind].name+' / '+DATA.catalog[b.kind].name,fi,[a.id,b.id]);
      }
      floors.push({index:fi,width:d.w,depth:d.d,pieces:f.items.length,subtotal:total,style:f.residentialStyle||f.moodboard});
    });
    const a=p.assumptions,extras=(a.installation||0)+(a.delivery||0)+(a.tax||0),contingency=Math.round((subtotal+extras)*a.contingencyPct/100),total=subtotal+extras+contingency;
    const missing=Object.keys(a).filter(k=>['installation','delivery','tax'].includes(k)&&a[k]===null);
    if(!p.constraints.measurementsConfirmed)warn('measurements_unconfirmed','Confirm site measurements before specifying or ordering.',null);
    if(missing.length)warn('costs_incomplete','Allowances still needed: '+missing.join(', ')+'.',null);
    warn('catalogue_indicative','Catalogue dimensions and prices are concept data; supplier, availability and installation compatibility are not verified.',null);
    warn('geometry_scope','Checks cover furniture rectangles and the outer room boundary. Internal walls, door swings, services, accessibility and circulation need designer review.',null);
    if(a.budget!==null&&total>a.budget)warn('over_budget','The estimate exceeds the stated budget by Rp'+Math.round(total-a.budget).toLocaleString('en-US')+'.',null);
    const alternatives=[];
    const adjustable=selections.filter(i=>i.tier!=='standard'&&!p.constraints.keepPieceIds.includes(i.floor+':'+i.pieceId));
    const savings=adjustable.reduce((n,i)=>n+i.unitPrice-price({kind:i.kind,tier:'standard'}),0);
    if(savings>0)alternatives.push({id:'standard-tier',label:'Compare standard furniture tiers',savingsBeforeContingency:savings,reason:'Keep positions and footprints; reduce upgrade allowances on unlocked pieces.',changes:adjustable.map(i=>({floor:i.floor,pieceId:i.pieceId,tier:'standard'}))});
    return {engineVersion:VERSION,mode:'rules',neural:{status:'not_connected'},projectId:p.projectId,status:'designer_review_required',summary:{floors:floors.length,pieces:selections.length,subtotal,extras,contingency,total,budget:a.budget,remaining:a.budget===null?null:a.budget-total,costsComplete:missing.length===0},floors,selections,issues,alternatives,assumptions:a};
  }
  function applyAlternative(input,id){
    const p=normalize(input),report=analyze(p),alt=report.alternatives.find(a=>a.id===id);if(!alt)throw Error('This alternative is no longer available');
    for(const c of alt.changes)p.layout.floors[c.floor].items.find(i=>i.id===c.pieceId).tier=c.tier;
    Object.assign(p.layout,p.layout.floors[p.layout.activeFloor]);return normalize(p);
  }
  return {VERSION,FORMAT,normalize,analyze,price,footprint,dimensions,applyAlternative,catalog:DATA.catalog};

});
