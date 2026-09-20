export interface RiverFeature {
  id: string;
  name: string;
  hanzi: string;
  type: 'major' | 'tributary' | 'canal';
  width: number;
  color?: string;
  coordinates: [number, number][]; // [longitude, latitude]
}

export interface MountainFeature {
  id: string;
  name: string;
  hanzi: string;
  elevation: string;
  type: 'sacred_peak' | 'range_node' | 'pass';
  coordinates: [number, number]; // [longitude, latitude]
  province: string;
  description: string;
}

export const CHINA_RIVERS: RiverFeature[] = [
  // 1. Yangtze River (长江) - Main Stem
  {
    id: 'yangtze-main',
    name: 'Yangtze River',
    hanzi: '长江',
    type: 'major',
    width: 3.5,
    coordinates: [
      [91.17, 33.40],
      [92.50, 33.80],
      [94.20, 33.60],
      [96.80, 33.00],
      [97.30, 31.80],
      [98.50, 30.50],
      [99.20, 28.80],
      [100.20, 27.20], // First Bend of Yangtze (Shigu)
      [100.80, 26.50],
      [101.50, 26.60], // Panzhihua
      [102.80, 26.90],
      [104.20, 28.50],
      [104.62, 28.77], // Yibin (Min River confluence)
      [105.44, 28.89], // Luzhou
      [106.55, 29.56], // Chongqing (Jialing River confluence)
      [107.40, 29.70], // Fuling
      [108.05, 30.25], // Zhongxian
      [109.48, 31.05], // Fengjie (Qutang Gorge)
      [110.00, 31.08], // Wushan (Wu Gorge)
      [110.80, 30.85], // Zigui (Xiling Gorge)
      [111.29, 30.70], // Yichang (Gorges exit)
      [112.24, 30.33], // Jingzhou
      [113.15, 29.80],
      [114.27, 30.58], // Wuhan (Han River confluence)
      [115.00, 30.30], // Huangshi
      [115.98, 29.72], // Jiujiang (Poyang Lake mouth)
      [117.04, 30.53], // Anqing
      [117.80, 30.90], // Tongling
      [118.38, 31.33], // Wuhu
      [118.78, 32.07], // Nanjing
      [119.45, 32.20], // Zhenjiang (Grand Canal crossing)
      [120.25, 31.90], // Jiangyin
      [120.90, 31.80], // Nantong
      [121.50, 31.40], // Shanghai Baoshan
      [122.10, 31.25]  // East China Sea Estuary
    ]
  },
  // Yangtze Tributary: Han River (汉水 / 汉江)
  {
    id: 'han-river',
    name: 'Han River',
    hanzi: '汉水 / 汉江',
    type: 'tributary',
    width: 2.2,
    coordinates: [
      [106.85, 33.10], // Ningqiang / Hanzhong Basin
      [107.03, 33.07], // Hanzhong
      [108.50, 32.90],
      [109.03, 32.68], // Ankang
      [110.79, 32.65], // Shiyan / Danjiangkou
      [112.14, 32.04], // Xiangyang Fortress!
      [112.50, 31.50],
      [113.30, 30.80], // Tianmen / Xiantao
      [114.27, 30.58]  // Wuhan confluence into Yangtze
    ]
  },
  // Yangtze Tributary: Min River (岷江)
  {
    id: 'min-river',
    name: 'Min River',
    hanzi: '岷江',
    type: 'tributary',
    width: 2.0,
    coordinates: [
      [103.60, 33.20], // Min Mountains origin
      [103.70, 32.00], // Maoxian
      [103.62, 31.00], // Dujiangyan Ancient Irrigation
      [103.85, 30.40], // Chengdu Plain west
      [103.76, 29.56], // Leshan Giant Buddha
      [104.62, 28.77]  // Yibin (joins Yangtze)
    ]
  },
  // Yangtze Tributary: Jialing River (嘉陵江)
  {
    id: 'jialing-river',
    name: 'Jialing River',
    hanzi: '嘉陵江',
    type: 'tributary',
    width: 2.0,
    coordinates: [
      [105.80, 33.90], // Qinling headwaters
      [105.83, 32.44], // Guangyuan (Jianmen gateway)
      [106.08, 31.58], // Langzhong Ancient City
      [106.08, 30.79], // Nanchong
      [106.27, 29.98], // Hechuan (Diaoyu Fortress)
      [106.55, 29.56]  // Chongqing (joins Yangtze)
    ]
  },
  // Yangtze Tributary: Xiang River (湘江)
  {
    id: 'xiang-river',
    name: 'Xiang River',
    hanzi: '湘江',
    type: 'tributary',
    width: 2.0,
    coordinates: [
      [110.80, 25.50], // Lingqu Canal / Guilin origin
      [111.60, 26.20], // Yongzhou
      [112.60, 26.90], // Hengyang (near Mount Heng)
      [112.90, 27.80], // Zhuzhou / Xiangtan
      [112.98, 28.20], // Changsha (Orange Isle)
      [113.12, 29.35]  // Yueyang / Dongting Lake mouth
    ]
  },
  // Yangtze Tributary: Gan River (赣江)
  {
    id: 'gan-river',
    name: 'Gan River',
    hanzi: '赣江',
    type: 'tributary',
    width: 2.0,
    coordinates: [
      [114.95, 25.85], // Ganzhou
      [115.00, 27.12], // Ji'an
      [115.89, 28.68], // Nanchang (Tengwang Pavilion)
      [116.15, 29.20], // Poyang Lake entrance
      [115.98, 29.72]  // Confluence with Yangtze at Jiujiang
    ]
  },

  // 2. Yellow River (黄河) - Main Stem & Iconic Ordos Loop
  {
    id: 'yellow-river-main',
    name: 'Yellow River',
    hanzi: '黄河',
    type: 'major',
    width: 3.5,
    coordinates: [
      [96.20, 34.50],  // Bayan Har Mountains origin
      [97.50, 35.00],  // Gyaring Lake
      [98.20, 35.05],  // Ngoring Lake
      [100.20, 35.40],
      [101.50, 35.80], // Guinan / Longyangxia
      [102.50, 36.10], // Guide
      [103.40, 36.05], // Liujiaxia Gorge
      [103.82, 36.06], // Lanzhou (Gansu Capital)
      [104.30, 36.55], // Baiyin
      [105.00, 37.50], // Zhongwei (Shapotou Desert)
      [105.80, 38.00], // Qingtongxia Gorge
      [106.27, 38.47], // Yinchuan (Western Xia Capital)
      [106.80, 39.20], // Shizuishan
      [106.75, 40.00], // Wuhai
      [107.40, 40.75], // Bayannur (Northernmost reach of loop)
      [108.50, 40.85],
      [110.00, 40.65], // Baotou
      [111.30, 40.25], // Ordos Bend turning South
      [111.45, 39.50], // Qingshuihe
      [110.90, 38.80], // Fugu / Hequ (Shaanxi-Shanxi Border)
      [110.45, 37.60], // Jiaxian / Wubu
      [110.45, 36.10], // Hukou Waterfall! (Iconic torrent)
      [110.35, 35.60], // Hancheng / Hejin (Dragon Gate / Longmen)
      [110.29, 34.58], // Tongguan Pass (Wei River confluence, turns East)
      [111.19, 34.78], // Sanmenxia Gorge
      [112.44, 34.68], // Luoyang (Mangshan foothills)
      [113.62, 34.75], // Zhengzhou (Central Plains cradle)
      [114.34, 34.80], // Kaifeng (Ancient Song Dynasty Capital)
      [115.50, 35.20], // Puyang
      [116.50, 36.10], // Liaocheng / Dong\'e
      [117.00, 36.68], // Jinan (Spring City)
      [117.80, 37.15], // Binzhou
      [118.75, 37.80], // Dongying (Yellow River Delta)
      [119.25, 37.85]  // Bohai Bay Estuary
    ]
  },
  // Yellow River Tributary: Wei River (渭河 - Guanzhong Lifeline)
  {
    id: 'wei-river',
    name: 'Wei River',
    hanzi: '渭河',
    type: 'tributary',
    width: 2.3,
    coordinates: [
      [104.20, 35.00], // Weiyuan origin (Gansu)
      [105.70, 34.58], // Tianshui (Fuxi cradle)
      [107.15, 34.37], // Baoji (Western entrance to Guanzhong)
      [108.70, 34.33], // Xianyang (Qin Capital)
      [108.94, 34.35], // Chang\'an / Xi\'an North
      [109.50, 34.50], // Weinan / Mount Hua foothills
      [110.29, 34.58]  // Tongguan (merges into Yellow River)
    ]
  },
  // Yellow River Tributary: Fen River (汾河 - Shanxi Spine)
  {
    id: 'fen-river',
    name: 'Fen River',
    hanzi: '汾河',
    type: 'tributary',
    width: 2.0,
    coordinates: [
      [112.10, 38.90], // Guancen Mountain origin
      [112.55, 37.87], // Taiyuan
      [111.90, 37.15], // Pingyao ancient basin
      [111.52, 36.08], // Linfen
      [110.60, 35.55]  // Joins Yellow River near Hejin
    ]
  },

  // 3. Huai River (淮河 - Northern & Southern Murim Borderline)
  {
    id: 'huai-river',
    name: 'Huai River',
    hanzi: '淮河',
    type: 'major',
    width: 2.8,
    coordinates: [
      [113.30, 32.40], // Tongbai Mountains origin (Henan)
      [114.07, 32.13], // Xinyang
      [115.50, 32.40], // Gushi / Fuyang border
      [116.99, 32.63], // Huainan
      [117.36, 32.94], // Bengbu
      [118.50, 33.20], // Hongze Lake entrance
      [119.02, 33.59], // Huai\'an (Grand Canal crossing)
      [119.80, 34.00], // Funing / Sheyang into Yellow Sea
      [120.30, 34.20]
    ]
  },

  // 4. Pearl River System (珠江)
  {
    id: 'pearl-river-xi',
    name: 'Xi River (Pearl River West)',
    hanzi: '西江 (珠江干流)',
    type: 'major',
    width: 3.0,
    coordinates: [
      [104.90, 25.00], // Nanpan River (Yunnan/Guizhou)
      [106.60, 23.90], // Baise (Guangxi)
      [108.32, 22.82], // Nanning
      [109.60, 23.10], // Guiping (confluence with Yu River)
      [111.30, 23.48], // Wuzhou (Guangxi/Guangdong border)
      [112.47, 23.05], // Zhaoqing
      [112.90, 22.80], // Sanshui (joins Bei River)
      [113.26, 23.13], // Guangzhou
      [113.55, 22.75], // Humen Pearl River Estuary
      [113.90, 22.30]  // Lingdingyang (Hong Kong / Macau waters)
    ]
  },
  {
    id: 'pearl-river-bei',
    name: 'Bei River (North River)',
    hanzi: '北江',
    type: 'tributary',
    width: 2.0,
    coordinates: [
      [113.60, 24.80], // Shaoguan (Nanling Mountains)
      [113.05, 23.68], // Qingyuan
      [112.90, 22.80]  // Sanshui confluence
    ]
  },

  // 5. Grand Canal (京杭大运河)
  {
    id: 'grand-canal',
    name: 'Grand Canal',
    hanzi: '京杭大运河',
    type: 'canal',
    width: 2.2,
    color: '#3b82f6',
    coordinates: [
      [116.65, 39.90], // Beijing Tongzhou
      [117.20, 39.13], // Tianjin
      [116.85, 38.30], // Cangzhou
      [116.30, 37.45], // Dezhou
      [115.98, 36.45], // Liaocheng
      [116.58, 35.41], // Jining
      [117.18, 34.26], // Xuzhou
      [119.02, 33.59], // Huai\'an
      [119.42, 32.39], // Yangzhou (Slender West Lake)
      [119.45, 32.20], // Yangtze Crossing (Zhenjiang)
      [119.95, 31.78], // Changzhou
      [120.30, 31.57], // Wuxi
      [120.62, 31.30], // Suzhou
      [120.50, 30.75], // Jiaxing
      [120.15, 30.28]  // Hangzhou (Southern terminus)
    ]
  },

  // 6. Songhua & Amur River (松花江 & 黑龙江)
  {
    id: 'songhua-river',
    name: 'Songhua River',
    hanzi: '松花江',
    type: 'major',
    width: 2.8,
    coordinates: [
      [128.00, 42.00], // Mount Changbai Heaven Lake
      [126.55, 43.84], // Jilin City
      [125.00, 44.80],
      [126.63, 45.75], // Harbin
      [128.80, 46.50],
      [130.36, 46.80], // Jiamusi
      [132.50, 47.70], // Tongjiang into Amur
      [135.00, 48.40]  // Fuyuan / Heilongjiang confluence
    ]
  },

  // 7. Lancang River (Upper Mekong / 澜沧江)
  {
    id: 'lancang-river',
    name: 'Lancang River',
    hanzi: '澜沧江',
    type: 'major',
    width: 2.2,
    coordinates: [
      [94.10, 33.15],  // Qinghai origin
      [97.20, 31.10],  // Chamdo (Tibet)
      [98.90, 28.50],  // Deqin (Meili Snow Mountain)
      [99.30, 26.20],  // Dali West
      [100.20, 24.50], // Lincang
      [100.80, 22.00]  // Xishuangbanna
    ]
  },

  // 8. Liao River (辽河 - Northeast Frontier)
  {
    id: 'liao-river',
    name: 'Liao River',
    hanzi: '辽河',
    type: 'major',
    width: 2.2,
    coordinates: [
      [120.50, 43.50], // Inner Mongolia / Jilin border
      [123.84, 42.29], // Tieling
      [123.40, 41.80], // Shenyang West
      [122.06, 41.12], // Panjin (Red Beach)
      [121.80, 40.70]  // Bohai Liaodong Bay
    ]
  }
];

export const SACRED_PEAKS_AND_PASSES: MountainFeature[] = [
  // The Five Sacred Great Mountains of China (五岳)
  {
    id: 'peak-songshan',
    name: 'Mount Song (Songshan)',
    hanzi: '嵩山 (中岳)',
    elevation: '1,512 m',
    type: 'sacred_peak',
    coordinates: [113.02, 34.50],
    province: 'Henan',
    description: 'The Central Sacred Mountain of China. Towering over Dengfeng in Henan; supreme focal point of martial cultivation and Zen arts.'
  },
  {
    id: 'peak-huashan',
    name: 'Mount Hua (Huashan)',
    hanzi: '华山 (西岳)',
    elevation: '2,155 m',
    type: 'sacred_peak',
    coordinates: [110.08, 34.48],
    province: 'Shaanxi',
    description: 'The Western Sacred Mountain. Famous for sheer vertical granite precipices, Plank Walk in the Sky, and the legendary Huashan Sword Contests.'
  },
  {
    id: 'peak-taishan',
    name: 'Mount Tai (Taishan)',
    hanzi: '泰山 (东岳)',
    elevation: '1,545 m',
    type: 'sacred_peak',
    coordinates: [117.10, 36.25],
    province: 'Shandong',
    description: 'The Eastern Sacred Mountain and most revered peak under heaven. Where dozens of emperors conducted the solemn Feng Shan sacrifices to Heaven.'
  },
  {
    id: 'peak-wudang',
    name: 'Mount Wudang',
    hanzi: '武当山',
    elevation: '1,612 m',
    type: 'sacred_peak',
    coordinates: [111.00, 32.40],
    province: 'Hubei',
    description: 'Supreme Daoist sanctuary of internal martial arts, Taiji, and swordplay nestled amid 72 mist-shrouded peaks and cloud terraces.'
  },
  {
    id: 'peak-emei',
    name: 'Mount Emei',
    hanzi: '峨眉山',
    elevation: '3,099 m',
    type: 'sacred_peak',
    coordinates: [103.33, 29.52],
    province: 'Sichuan',
    description: 'Towering Buddhist sanctuary overlooking the Sichuan basin with its Golden Summit, sea of clouds, and sacred golden Buddha statues.'
  },
  {
    id: 'peak-qingcheng',
    name: 'Mount Qingcheng',
    hanzi: '青城山',
    elevation: '1,260 m',
    type: 'sacred_peak',
    coordinates: [103.57, 30.90],
    province: 'Sichuan',
    description: 'Birthplace of religious Daoism in Sichuan, famed as the "most secluded mountain under heaven" with emerald jade pavilions.'
  },
  {
    id: 'peak-hengnorth',
    name: 'Mount Heng (North)',
    hanzi: '恒山 (北岳)',
    elevation: '2,016 m',
    type: 'sacred_peak',
    coordinates: [113.73, 39.67],
    province: 'Shanxi',
    description: 'Northern Sacred Mountain guarding the frontier passes. Features the miraculous Hanging Monastery clinging to a sheer cliff.'
  },
  {
    id: 'peak-hengsouth',
    name: 'Mount Heng (South)',
    hanzi: '衡山 (南岳)',
    elevation: '1,300 m',
    type: 'sacred_peak',
    coordinates: [112.73, 27.25],
    province: 'Hunan',
    description: 'Southern Sacred Mountain of emerald forests, 72 peaks, and flying smoke waterfalls above the Xiang River valley.'
  },
  {
    id: 'peak-huangshan',
    name: 'Mount Huang (Huangshan)',
    hanzi: '黄山',
    elevation: '1,864 m',
    type: 'sacred_peak',
    coordinates: [118.17, 30.13],
    province: 'Anhui',
    description: 'The ethereal Yellow Mountain with gnarled Welcoming Pines, seas of cloud, bizarre granite monoliths, and thermal hot springs.'
  },
  {
    id: 'peak-wuyi',
    name: 'Mount Wuyi',
    hanzi: '武夷山',
    elevation: '2,158 m',
    type: 'sacred_peak',
    coordinates: [117.65, 27.75],
    province: 'Fujian',
    description: 'Red sandstone gorges and tea plantations flanking the meandering Nine-Bend River; home to hermits, scholars, and Daoist recluses.'
  },
  {
    id: 'peak-longhu',
    name: 'Mount Longhu',
    hanzi: '龙虎山',
    elevation: '550 m',
    type: 'sacred_peak',
    coordinates: [116.96, 28.18],
    province: 'Jiangxi',
    description: 'Dragon and Tiger Mountain; historic ancestral seat of Celestial Master Daoism, ancient cliff coffins, and talisman magic.'
  },
  {
    id: 'peak-changbai',
    name: 'Mount Changbai (Heaven Lake)',
    hanzi: '长白山 (天池)',
    elevation: '2,744 m',
    type: 'sacred_peak',
    coordinates: [128.05, 41.98],
    province: 'Jilin',
    description: 'Massive active volcano crater filled by deep sapphire waters, sacred mountain of northeastern warrior tribes and frost qi masters.'
  },
  {
    id: 'peak-kunlun',
    name: 'Kunlun Peak (Ancestral Mountain)',
    hanzi: '昆仑主峰',
    elevation: '7,167 m',
    type: 'sacred_peak',
    coordinates: [85.50, 35.80],
    province: 'Xinjiang',
    description: 'The mythological ancestral root of all mountain chains under heaven, immortal realm of the Queen Mother of the West (Xi Wangmu).'
  },
  {
    id: 'peak-tianshan',
    name: 'Heavenly Mountain (Tianshan Bogda)',
    hanzi: '天山 (博格达峰)',
    elevation: '5,445 m',
    type: 'sacred_peak',
    coordinates: [88.33, 43.80],
    province: 'Xinjiang',
    description: 'Snow-crested Bogda peak looming above Heavenly Lake (Tianchi), famed home of supreme sword techniques and lotus herbs.'
  },
  {
    id: 'peak-kongtong',
    name: 'Mount Kongtong',
    hanzi: '崆峒山',
    elevation: '2,123 m',
    type: 'sacred_peak',
    coordinates: [106.53, 35.55],
    province: 'Gansu',
    description: 'Sacred mountain on the Silk Road where the Yellow Emperor historically asked the Dao from hermit Guangchengzi.'
  },

  // Strategic Murim Passes (关隘)
  {
    id: 'pass-hangu',
    name: 'Hangu Pass',
    hanzi: '函谷关',
    elevation: 'Pass',
    type: 'pass',
    coordinates: [110.92, 34.63],
    province: 'Henan',
    description: 'Ancient choke point bottleneck between Luoyang and Chang\'an. Where Laozi wrote the Dao De Jing before riding into the west.'
  },
  {
    id: 'pass-shanhai',
    name: 'Shanhaiguan',
    hanzi: '山海关',
    elevation: 'Pass',
    type: 'pass',
    coordinates: [119.78, 40.00],
    province: 'Hebei',
    description: 'First Pass Under Heaven (天下第一关). Where the Great Wall meets the Bohai Sea. Strategic gateway between the Central Plains and Guandong.'
  },
  {
    id: 'pass-jiayu',
    name: 'Jiayuguan',
    hanzi: '嘉峪关',
    elevation: 'Pass',
    type: 'pass',
    coordinates: [98.28, 39.80],
    province: 'Gansu',
    description: 'First Strategic Pass of the West (天下第一雄关). Western terminus of the Great Wall along the Silk Road.'
  },
  {
    id: 'pass-jianmen',
    name: 'Jianmen Pass',
    hanzi: '剑门关',
    elevation: 'Pass',
    type: 'pass',
    coordinates: [105.58, 32.22],
    province: 'Sichuan',
    description: 'Sword Gate. Sheer sandstone cleft in northern Sichuan: "One man can hold the pass against ten thousand attackers."'
  },
  {
    id: 'pass-yanmen',
    name: 'Yanmen Pass',
    hanzi: '雁门关',
    elevation: 'Pass',
    type: 'pass',
    coordinates: [112.93, 39.18],
    province: 'Shanxi',
    description: 'Wild Goose Gate. Perilous gorge in the Yanmen Mountains, historic frontline between the steppe and Central Plains.'
  }
];

export const HISTORIC_REGIONS = [
  { name: 'Central Plains (中原)', color: '#d97706', description: 'Henan, Shandong, Hubei - Heart of civilization and orthodox martial traditions.' },
  { name: 'Guanzhong & Northwest (关中·西北)', color: '#b45309', description: 'Shaanxi, Shanxi, Gansu, Ningxia - Imperial valleys, passes, and Silk Road.' },
  { name: 'Bashu & Southwest (巴蜀·西南)', color: '#059669', description: 'Sichuan, Chongqing, Yunnan, Guizhou, Guangxi - Mist mountains and martial hermitages.' },
  { name: 'Jiangnan & South (江南·岭南)', color: '#2563eb', description: 'Jiangsu, Zhejiang, Anhui, Jiangxi, Fujian, Guangdong - Rich waterways and merchant guilds.' },
  { name: 'Northern Steppe & Frontier (塞北·西域)', color: '#7c3aed', description: 'Inner Mongolia, Xinjiang, Tibet, Qinghai - Boundless expanses and demonic legends.' },
  { name: 'Guandong / Northeast (关东·东北)', color: '#475569', description: 'Liaoning, Jilin, Heilongjiang - Frozen forests, wild rivers, and iron cavalry.' }
];
