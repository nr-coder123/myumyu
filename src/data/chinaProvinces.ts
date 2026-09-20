import chinaGeoJsonRaw from 'china-map-geojson/lib/china.js';
import { ProvinceData } from 'china-map-geojson';

export interface ProvinceMeta {
  id: string;
  name: string; // Pinyin / Common English name
  hanzi: string; // Chinese Hanzi
  historicalName: string; // Historical / Murim region name
  region: 'Central Plains' | 'North' | 'Northwest' | 'West & Bashu' | 'South & Jiangnan' | 'Northeast' | 'Southwest' | 'Frontier';
  capital: string;
  landmarks: string[];
  description: string;
  parentProvince?: string;
  parentHanzi?: string;
}

export const PROVINCE_METADATA: Record<string, ProvinceMeta> = {
  '陕西': {
    id: '61',
    name: 'Shaanxi',
    hanzi: '陕西',
    historicalName: 'Guanzhong (Chang\'an)',
    region: 'Northwest',
    capital: 'Chang\'an (Xi\'an)',
    landmarks: ['Mount Hua (Huashan)', 'Weiyang Palace', 'Hangu Pass', 'Qinling Mountains', 'Terracotta Necropolis'],
    description: 'The ancient cradle of emperors and martial legends. Home to the legendary Mount Hua and the Guanzhong plains surrounded by impregnable mountain passes.'
  },
  '山西': {
    id: '14',
    name: 'Shanxi',
    hanzi: '山西',
    historicalName: 'Jin Realm (Taihang)',
    region: 'North',
    capital: 'Taiyuan',
    landmarks: ['Mount Heng (North)', 'Mount Wutai', 'Taihang Mountains', 'Pingyao Ancient City', 'Yanmen Pass'],
    description: 'Land west of the Taihang Mountains. Guarded by the strategic Yanmen Pass and Mount Wutai, a sacred Buddhist sanctuary.'
  },
  '河南': {
    id: '41',
    name: 'Henan',
    hanzi: '河南',
    historicalName: 'Zhongyuan (Central Plains)',
    region: 'Central Plains',
    capital: 'Luoyang / Kaifeng',
    landmarks: ['Mount Song (Songshan)', 'Luoyang Imperial City', 'Longmen Grottoes', 'Yellow River Crossing', 'White Horse Temple'],
    description: 'The beating heart of Zhongyuan (Central Plains) and historical pivot of the martial world. Site of ancient dynasties and Mount Song.'
  },
  '河北': {
    id: '13',
    name: 'Hebei',
    hanzi: '河北',
    historicalName: 'Ji Realm / Yan-Zhao',
    region: 'North',
    capital: 'Zhengding / Baoding',
    landmarks: ['Shanhaiguan First Pass Under Heaven', 'Yan Mountains', 'Cangzhou Iron Lion (Martial Homeland)', 'Bohai Gulf'],
    description: 'Land of heroic swordsmen and staunch northern defenders. Gateway to the northern frontier and guardian of the Imperial Capital.'
  },
  '湖北': {
    id: '42',
    name: 'Hubei',
    hanzi: '湖北',
    historicalName: 'Jingchu (Xiangyang)',
    region: 'Central Plains',
    capital: 'Wuchang / Jiangling',
    landmarks: ['Mount Wudang', 'Xiangyang Fortress', 'Yellow Crane Tower', 'Three Gorges (Western End)', 'Shennongjia Primeval Forest'],
    description: 'Sacred mountain realm and fortress crossroads. Famous for Mount Wudang and the legendary fortified gates of Xiangyang on the Han River.'
  },
  '湖南': {
    id: '43',
    name: 'Hunan',
    hanzi: '湖南',
    historicalName: 'Xiang Realm (Dongting)',
    region: 'South & Jiangnan',
    capital: 'Changsha',
    landmarks: ['Mount Heng (South / Nanyue)', 'Dongting Lake', 'Zhangjiajie Mystic Pillars', 'Yuelu Academy', 'Miluo River'],
    description: 'Vast realm of misty lakes and jagged quartz sandstone peaks. Dongting Lake was historically controlled by formidable water bandits and beggar sects.'
  },
  '四川': {
    id: '51',
    name: 'Sichuan',
    hanzi: '四川',
    historicalName: 'Bashu (Shu Realm)',
    region: 'West & Bashu',
    capital: 'Chengdu',
    landmarks: ['Mount Emei', 'Mount Qingcheng', 'Shu Dao (Treacherous Plank Roads)', 'Min River', 'Jianmen Pass'],
    description: 'The fortress basin of abundance, enclosed by sheer cliffs. Celebrated for mystical Daoist heights and secretive poison master clans.'
  },
  '山东': {
    id: '37',
    name: 'Shandong',
    hanzi: '山东',
    historicalName: 'Qi-Lu (Eastern Peak)',
    region: 'Central Plains',
    capital: 'Jinan',
    landmarks: ['Mount Tai (Taishan Eastern Sacred Peak)', 'Liangshan Marsh', 'Penglai Immortal Pavilion', 'Confucius Mansion'],
    description: 'Home of Mount Tai, the foremost sacred mountain where emperors offered sacrifices to Heaven. Rich martial arts lineage and coastal ports.'
  },
  '江苏': {
    id: '32',
    name: 'Jiangsu',
    hanzi: '江苏',
    historicalName: 'Wu Realm (Jinling)',
    region: 'South & Jiangnan',
    capital: 'Jinling (Nanjing) / Suzhou',
    landmarks: ['Qinhuai River', 'Taihu Lake (Lake Tai)', 'Grand Canal Terminus', 'Zhongshan Mountain', 'Gardens of Suzhou'],
    description: 'The wealthy cultural crown of Jiangnan. Waterway hubs, flourishing mercantile guilds, and southern imperial prestige.'
  },
  '浙江': {
    id: '33',
    name: 'Zhejiang',
    hanzi: '浙江',
    historicalName: 'Yue Realm (Lin\'an)',
    region: 'South & Jiangnan',
    capital: 'Hangzhou (Lin\'an)',
    landmarks: ['West Lake (Xihu)', 'Mount Putuo (Goddess of Mercy Island)', 'Mount Tiantai', 'Qiantang River Tidal Bore', 'Mount Mogan (Sword Forging Peak)'],
    description: 'Southern capital realm of serene West Lake, coastal pilgrimage islands, and legendary sword-smithing furnaces at Mount Mogan.'
  },
  '安徽': {
    id: '34',
    name: 'Anhui',
    hanzi: '安徽',
    historicalName: 'Wan Realm (Huangshan)',
    region: 'South & Jiangnan',
    capital: 'Anqing / Hefei',
    landmarks: ['Mount Huang (Huangshan Yellow Mountain)', 'Mount Jiuhua', 'Xin\'an River', 'Huizhou Merchant Enclaves'],
    description: 'Domain of granite cliffs and ancient pine seas at Mount Huang. Renowned for wealthy merchant associations and Buddhist sanctuaries.'
  },
  '江西': {
    id: '36',
    name: 'Jiangxi',
    hanzi: '江西',
    historicalName: 'Gan Realm (Poyang)',
    region: 'South & Jiangnan',
    capital: 'Nanchang',
    landmarks: ['Mount Lu (Lushan)', 'Mount Longhu (Dragon-Tiger Mountain Daoist Ancestral Hall)', 'Poyang Lake', 'Tengwang Pavilion', 'Jingdezhen'],
    description: 'Flanked by Poyang Lake and Mount Lu. Longhu Mountain served as the supreme seat of Celestial Master Daoism and talismanic arts.'
  },
  '福建': {
    id: '35',
    name: 'Fujian',
    hanzi: '福建',
    historicalName: 'Min Realm (Wuyi)',
    region: 'South & Jiangnan',
    capital: 'Fuzhou / Quanzhou',
    landmarks: ['Mount Wuyi (Nine-Bend River)', 'Quanzhou Maritime Silk Road Port', 'Hakka Earth Castles (Tulou)', 'Southern Shaolin Grounds'],
    description: 'Maritime springboard with rugged coastal red sandstones. The secluded gorges of Mount Wuyi conceal hermit pavilions and hidden scrolls.'
  },
  '广东': {
    id: '44',
    name: 'Guangdong',
    hanzi: '广东',
    historicalName: 'Lingnan (Canton)',
    region: 'South & Jiangnan',
    capital: 'Guangzhou',
    landmarks: ['Baiyun Mountain', 'Pearl River Delta', 'Mount Danxia', 'Foshan Martial Arena', 'South China Sea Ports'],
    description: 'Southernmost martial world trading hub. Known for southern fist traditions, maritime merchant fleets, and prosperous guild halls.'
  },
  '广西': {
    id: '45',
    name: 'Guangxi',
    hanzi: '广西',
    historicalName: 'Hundred Yue (Guilin)',
    region: 'Southwest',
    capital: 'Guilin',
    landmarks: ['Guilin Karst River Spire Landscape', 'Shiwan Dashan (Hundred Thousand Great Mountains)', 'Detian Falls', 'Zuo River Cliff Murals'],
    description: 'Dramatic karst tooth mountains rising from jade waters. The deep jungle mountains have long been a refuge for unorthodox and tribal clans.'
  },
  '贵州': {
    id: '52',
    name: 'Guizhou',
    hanzi: '贵州',
    historicalName: 'Qian Realm (Miao Frontier)',
    region: 'Southwest',
    capital: 'Guiyang',
    landmarks: ['Mount Fanjing (Fanjingshan Golden Summit)', 'Huangguoshu Waterfall', 'Miao & Dong Mountain Forts', 'Wujiang River Gorge'],
    description: 'Rugged highland plateau famous for Mount Fanjing, perilous gorges, and mystifying medicinal herbalists.'
  },
  '云南': {
    id: '53',
    name: 'Yunnan',
    hanzi: '云南',
    historicalName: 'Dian Realm (Dali)',
    region: 'Southwest',
    capital: 'Kunming / Dali',
    landmarks: ['Dali Cangshan Mountains & Erhai Lake', 'Three Pagodas of Chongsheng', 'Jade Dragon Snow Mountain', 'Lincang Ancient Tea Forest', 'Lijiang Old Town'],
    description: 'The romantic, secluded kingdom of Dian and Dali. Towering snow peaks, six finger sword qi legends, and southern border caravans.'
  },
  '甘肃': {
    id: '62',
    name: 'Gansu',
    hanzi: '甘肃',
    historicalName: 'Longxi (Hexi Corridor)',
    region: 'Northwest',
    capital: 'Lanzhou',
    landmarks: ['Mount Kongtong', 'Dunhuang Mogao Caves', 'Jiayuguan Pass', 'Yumen Pass (Jade Gate)', 'Maijishan Grottoes'],
    description: 'The slender martial artery connecting the Central Plains to the Silk Road. Guarded by the swordmasters of Mount Kongtong and Jiayu Pass.'
  },
  '青海': {
    id: '63',
    name: 'Qinghai',
    hanzi: '青海',
    historicalName: 'Kokonor (River Headwaters)',
    region: 'Northwest',
    capital: 'Xining',
    landmarks: ['Qinghai Lake (Kokonor)', 'Bayan Har Mountains (Yellow River Origin)', 'Tongtian River', 'Ta\'er Monastery', 'Kunlun Pass'],
    description: 'Vast, wind-swept high plateau sheltering the mother waters of both the Yangtze and Yellow Rivers. Gateway to the mystical Kunlun.'
  },
  '新疆': {
    id: '65',
    name: 'Xinjiang',
    hanzi: '新疆',
    historicalName: 'Western Regions (Xiyu)',
    region: 'Frontier',
    capital: 'Urumqi / Kashgar',
    landmarks: ['Heavenly Lake of Tianshan (Tianchi)', 'Mount Kunlun Peaks', 'Taklamakan Desert', 'Flaming Mountains (Huo Yan Shan)', 'Loulan Ruins'],
    description: 'The boundless Western Regions. The cradle of the Heavenly Demon Cult legends, Kunlun sword sanctums, and forgotten oasis kingdoms.'
  },
  '西藏': {
    id: '54',
    name: 'Tibet',
    hanzi: '西藏',
    historicalName: 'Snow Plateau (Tubo / Tubat)',
    region: 'Frontier',
    capital: 'Lhasa',
    landmarks: ['Potala Palace', 'Mount Kailash (Sacred Gang Rinpoche)', 'Yarlung Tsangpo Grand Canyon', 'Jokhang Temple', 'Tanggula Mountains'],
    description: 'The roof of the world. Towering permafrost peaks, esoteric lama martial disciplines, vajra fist traditions, and sacred holy lakes.'
  },
  '内蒙古': {
    id: '15',
    name: 'Inner Mongolia',
    hanzi: '内蒙古',
    historicalName: 'Northern Steppe (Mobei / Monan)',
    region: 'North',
    capital: 'Hohhot',
    landmarks: ['Ordos Steppe', 'Hulunbuir Grasslands', 'Yin Mountains (Yinshan)', 'Badain Jaran Dunes', 'Xanadu (Shangdu Ruins)'],
    description: 'The roaring ocean of grass ruled by nomadic mounted archers and eagle tamers. Across history, the great northern rival of Central Plains warriors.'
  },
  '宁夏': {
    id: '64',
    name: 'Ningxia',
    hanzi: '宁夏',
    historicalName: 'Xixia (Western Xia)',
    region: 'Northwest',
    capital: 'Yinchuan',
    landmarks: ['Helan Mountains (Rock Carvings)', 'Western Xia Imperial Tombs', 'Yellow River Qingtongxia', 'Shapotou Desert Oasis'],
    description: 'Ancient realm of the Western Xia dynasty. Rugged Helan Mountain crests shielded martial academies from fierce desert sandstorms.'
  },
  '辽宁': {
    id: '21',
    name: 'Liaoning',
    hanzi: '辽宁',
    historicalName: 'Liaodong (Beyond the Pass)',
    region: 'Northeast',
    capital: 'Mukden (Shenyang)',
    landmarks: ['Liaodong Peninsula', 'Fenghuangshan (Phoenix Mountain)', 'Mukden Palace', 'Yalu River Estuary', 'Dalian Bay'],
    description: 'The fortified threshold "Beyond the Pass" (Guandong). Northern iron cavalry, dense forests, and fierce mountain warrior tribes.'
  },
  '吉林': {
    id: '22',
    name: 'Jilin',
    hanzi: '吉林',
    historicalName: 'Changbai Realm (Goguryeo Ruins)',
    region: 'Northeast',
    capital: 'Changchun / Jilin',
    landmarks: ['Mount Changbai (Heaven Lake / Paektu)', 'Songhua River', 'Goguryeo Ancient Capital', 'Changbai Ginseng Valleys'],
    description: 'Crowned by the eternal snow-capped volcanic crater of Mount Changbai. Known for century-old wild ginseng and northern frost martial arts.'
  },
  '黑龙江': {
    id: '23',
    name: 'Heilongjiang',
    hanzi: '黑龙江',
    historicalName: 'Black Dragon River (Amur)',
    region: 'Northeast',
    capital: 'Harbin',
    landmarks: ['Amur River (Black Dragon)', 'Great Khingan Forest', 'Jingpo Lake (Mirror Lake)', 'Wudalianchi Volcanic Springs'],
    description: 'The northern wilderness. Endless primeval pine forests and frozen rivers where hardy survivalist clans forged unyielding frost blades.'
  },
  '北京': {
    id: '11',
    name: 'Beijing',
    hanzi: '北京',
    historicalName: 'Imperial Capital (Yanjing)',
    region: 'North',
    capital: 'Beijing',
    landmarks: ['Forbidden City', 'Temple of Heaven', 'Juyongguan Pass', 'Fragrant Hills', 'Imperial Martial Examination Ground'],
    description: 'Seat of the Dragon Throne and the Emperor\'s Guard (Embroidered Uniform Guard / Jinyiwei). Where imperial politics clashes with the martial underworld.'
  },
  '天津': {
    id: '12',
    name: 'Tianjin',
    hanzi: '天津',
    historicalName: 'Tianjin (Haihe Ferry)',
    region: 'North',
    capital: 'Tianjin',
    landmarks: ['Haihe River', 'Dagu Forts', 'Mount Panshan', 'Grand Canal Junction'],
    description: 'The imperial ferry outpost guarding the sea entrance to the capital. Renowned in martial arts lore for street challenges and martial halls.'
  },
  '上海': {
    id: '31',
    name: 'Shanghai',
    hanzi: '上海',
    historicalName: 'Songjiang (Huangpu Mouth)',
    region: 'South & Jiangnan',
    capital: 'Shanghai',
    landmarks: ['Huangpu River', 'Longhua Temple', 'Yu Garden', 'Chongming Island'],
    description: 'Estuary where the colossal Yangtze meets the East China Sea. Key transit point for coastal smuggling, salt guilds, and foreign merchant junks.'
  },
  '重庆': {
    id: '50',
    name: 'Chongqing',
    hanzi: '重庆',
    historicalName: 'Ba Realm (Mountain Fortress)',
    region: 'West & Bashu',
    capital: 'Chongqing',
    landmarks: ['Diaoyu Fortress (Fishing City)', 'Three Gorges (Qutang Gorge & Wu Gorge)', 'Jialing River Confluence', 'Dazu Rock Carvings'],
    description: 'The cliffside metropolis where the Jialing joins the Yangtze. Diaoyu Fortress was renowned as an impregnable bastion against invading Mongol hordes.'
  },
  '海南': {
    id: '46',
    name: 'Hainan',
    hanzi: '海南',
    historicalName: 'Qiongzhou (South Sea Isle)',
    region: 'South & Jiangnan',
    capital: 'Haikou',
    landmarks: ['Wuzhishan (Five Finger Mountain)', 'Tianya Haijiao (Edge of Heaven)', 'Qiongzhou Strait', 'Nanwan Bay'],
    description: 'The tropical southern frontier. Ancient place of exile for deposed scholars and martial recluses, surrounded by turquoise coral seas.'
  },
  '台湾': {
    id: '71',
    name: 'Taiwan',
    hanzi: '台湾',
    historicalName: 'Dongfan (Formosa / Penghu)',
    region: 'South & Jiangnan',
    capital: 'Taipei / Tainan',
    landmarks: ['Yushan (Jade Mountain)', 'Sun Moon Lake', 'Penghu Archipelago', 'Fort Zeelandia Ruins'],
    description: 'The maritime fortress isle across the Taiwan Strait. Controlled historically by pirate confederacies, merchant princes, and island tribes.'
  },
  '香港': {
    id: '81',
    name: 'Hong Kong',
    hanzi: '香港',
    historicalName: 'Xiangjiang (Fragrant Bay)',
    region: 'South & Jiangnan',
    capital: 'Hong Kong',
    landmarks: ['Victoria Peak', 'Lantau Island', 'Lei Yue Mun Pirate Channel', 'Tolo Harbour'],
    description: 'Sheltered deepwater islands formerly infested with pirate flotillas and maritime martial trade brotherhoods.'
  },
  '澳门': {
    id: '82',
    name: 'Macau',
    hanzi: '澳门',
    historicalName: 'Haojing (Lotus Isle)',
    region: 'South & Jiangnan',
    capital: 'Macau',
    landmarks: ['Ruins of St. Paul', 'Guia Fortress', 'A-Ma Temple', 'Outer Harbour'],
    description: 'The Lotus Isle where western firearms and esoteric clockwork artifacts entered the Central Plains through maritime traders.'
  }
};

export const RAW_CHINA_GEOJSON = chinaGeoJsonRaw;
export const CHINA_PROVINCE_DATA = ProvinceData;

export const PROVINCE_TO_GEOJSON_KEY: Record<string, string> = {
  '河南': 'Henan',
  '陕西': 'Shanxi_3',
  '四川': 'Sichuan',
  '湖北': 'Hubei',
  '山东': 'Shandong',
  '山西': 'Shanxi_1',
  '河北': 'Hebei',
  '江苏': 'Jiangsu',
  '浙江': 'Zhejiang',
  '湖南': 'Hunan',
  '广东': 'Guangdong',
  '安徽': 'Anhui',
  '江西': 'Jiangxi',
  '福建': 'Fujian',
  '贵州': 'Guizhou',
  '云南': 'Yunnan',
  '甘肃': 'Gansu',
  '青海': 'Qinghai',
  '新疆': 'Xinjiang',
  '西藏': 'Xizang',
  '内蒙古': 'Neimenggu',
  '宁夏': 'Ningxia',
  '辽宁': 'Liaoning',
  '吉林': 'Jilin',
  '黑龙江': 'Heilongjiang',
  '北京': 'Beijing',
  '天津': 'Tianjin',
  '上海': 'Shanghai',
  '重庆': 'Chongqing',
  '海南': 'Hainan',
  '广西': 'Guangxi'
};

export const SUBPROVINCE_METADATA: Record<string, Partial<ProvinceMeta>> = {
  // Henan (Central Plains / Zhongyuan)
  '洛阳': {
    name: 'Luoyang',
    hanzi: '洛阳',
    historicalName: 'Luoyang (Imperial Cradle)',
    region: 'Central Plains',
    capital: 'Luoyang',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['White Horse Temple', 'Longmen Grottoes', 'Mangshan Necropolis', 'Luoyang Sword Manor'],
    description: 'Ancient imperial capital of nine dynasties. Foremost cultural city where illustrious sword manors, noble martial clans, and imperial archives gather.'
  },
  '郑州': {
    name: 'Zhengzhou (Songshan)',
    hanzi: '郑州',
    historicalName: 'Songshan (Shaolin Sanctuary)',
    region: 'Central Plains',
    capital: 'Zhengzhou',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Mount Song (Shaolin Temple)', 'Damo Hermitage', 'Pagoda Forest', 'Songyang Academy'],
    description: 'The sacred heart of the martial arts world. Mount Song towers above, home of the venerable Shaolin Monastery, cradle of Chan Buddhism and staff arts.'
  },
  '开封': {
    name: 'Kaifeng',
    hanzi: '开封',
    historicalName: 'Bianjing (Northern Capital)',
    region: 'Central Plains',
    capital: 'Kaifeng',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Dragon Pavilion', 'Iron Pagoda', 'Grand Canal Wharf', 'Beggar Sect Headquarters'],
    description: 'Prosperous imperial hub and teeming river port. The Beggar Sect and martial academies operate within its bustling market squares.'
  },
  '南阳': {
    name: 'Nanyang',
    hanzi: '南阳',
    historicalName: 'Wancheng (Southern Gateway)',
    region: 'Central Plains',
    capital: 'Nanyang',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Wuhou Ancestral Temple', 'Bowangpo Pass', 'Baihe River Crossing'],
    description: 'Strategic southern commandery bridging the Central Plains with Mount Wudang and Xiangyang Fortress.'
  },
  '三门峡': {
    name: 'Sanmenxia',
    hanzi: '三门峡',
    historicalName: 'Guoguo / Shanzhou Gorge',
    region: 'Central Plains',
    capital: 'Sanmenxia',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Hangu Pass (East Gate)', 'Yellow River Sanmen Rapids', 'Mount Yao'],
    description: 'Perilous river canyon pass guarding the direct highway between the Chang\'an basin and Luoyang plains.'
  },
  '安阳': {
    name: 'Anyang',
    hanzi: '安阳',
    historicalName: 'Yinxu (Zhang River)',
    region: 'Central Plains',
    capital: 'Anyang',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Yin Ruins', 'Wenfeng Pagoda', 'Zhang River Iron Bridge'],
    description: 'Ancient northern garrison famed for antique bronze relics, subterranean vaults, and staunch defense battalions.'
  },
  '焦作': {
    name: 'Jiaozuo',
    hanzi: '焦作',
    historicalName: 'Chenjiagou (Tai Chi Cradle)',
    region: 'Central Plains',
    capital: 'Jiaozuo',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Chenjiagou Village', 'Mount Yuntai Red Stone Gorge', 'Zhuyu Peak'],
    description: 'Birthplace of soft, yielding internal fist styles. Shadowed by the sheer cliff cascades of Mount Yuntai.'
  },
  '新乡': {
    name: 'Xinxiang',
    hanzi: '新乡',
    historicalName: 'Muye Battlefield',
    region: 'Central Plains',
    capital: 'Xinxiang',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Muye Historic Battlefield', 'Mount Baligou', 'Taihang Foothill Pass'],
    description: 'Legendary battleground where ancient dynasties collapsed. Gateway northward into the rugged Taihang range.'
  },
  '许昌': {
    name: 'Xuchang',
    hanzi: '许昌',
    historicalName: 'Xudu (Heroic Citadel)',
    region: 'Central Plains',
    capital: 'Xuchang',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Spring and Autumn Pavilion', 'Baling Bridge', 'Weiwu Stronghold'],
    description: 'Central agricultural garrison and military fortress commanding the transit roads across the realm.'
  },
  '商丘': {
    name: 'Shangqiu',
    hanzi: '商丘',
    historicalName: 'Song Realm / Guide',
    region: 'Central Plains',
    capital: 'Shangqiu',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Yingtian Academy', 'Guide Ancient City Wall', 'Sui Dynasty Mounds'],
    description: 'Eastern trade crossroads linking Central Plains sects with Shandong martial masters.'
  },
  '平顶山': {
    name: 'Pingdingshan',
    hanzi: '平顶山',
    historicalName: 'Yingchuan Realm',
    region: 'Central Plains',
    capital: 'Pingdingshan',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Mount Yaoshan', 'Chu Great Wall Ruins', 'Fengxue Temple'],
    description: 'Mineral-rich foothills famed for iron weaponsmithing and ancient Daoist recluses.'
  },
  '驻马店': {
    name: 'Zhumadian',
    hanzi: '驻马店',
    historicalName: 'Runan Commandery',
    region: 'Central Plains',
    capital: 'Zhumadian',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Mount Chaya', 'Nanhai Zen Temple', 'Runan Old Post'],
    description: 'Southern courier relay station famous for roving knights-errant and hidden valleys.'
  },
  '信阳': {
    name: 'Xinyang',
    hanzi: '信阳',
    historicalName: 'Yiyang / Shenzhou',
    region: 'Central Plains',
    capital: 'Xinyang',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Mount Jigong', 'Dabie Mountains Pass', 'Nanwan Misty Lake'],
    description: 'Southern mountain bastion bordering the Dabie range, cloaked in mist and tea groves.'
  },
  '周口': {
    name: 'Zhoukou',
    hanzi: '周口',
    historicalName: 'Chenzhou (Taihao)',
    region: 'Central Plains',
    capital: 'Zhoukou',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Taihao Fuxi Mausoleum', 'Shahu Lake', 'Guanling Wharf'],
    description: 'Waterways confluence where inland boat convoys and river escorts congregate.'
  },
  '濮阳': {
    name: 'Puyang',
    hanzi: '濮阳',
    historicalName: 'Chanyuan',
    region: 'Central Plains',
    capital: 'Puyang',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Chanyuan Alliance Altar', 'Yellow River Ferry', 'Qilong Mound'],
    description: 'Historic site of grand peace treaties and northern chivalric summits.'
  },
  '漯河': {
    name: 'Luohe',
    hanzi: '漯河',
    historicalName: 'Yancheng Commandery',
    region: 'Central Plains',
    capital: 'Luohe',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Xiaohe River Bridge', 'Xu Shen Sanctuary', 'Wanquan Fort'],
    description: 'Central plains transit hub sheltered by serene waterways and trading caravans.'
  },
  '鹤壁': {
    name: 'Hebi',
    hanzi: '鹤壁',
    historicalName: 'Chaoge / Yunmeng',
    region: 'Central Plains',
    capital: 'Hebi',
    parentProvince: 'Henan',
    parentHanzi: '河南',
    landmarks: ['Mount Yunmeng (Guiguzi Hermitage)', 'Chaoge Ruins', 'Qi River Springs'],
    description: 'Secluded mountain ravine where strategist Guiguzi trained legendary disciples in diplomacy and swordsmanship.'
  },

  // Shaanxi (Guanzhong)
  '西安': {
    name: 'Xi\'an (Chang\'an)',
    hanzi: '西安',
    historicalName: 'Chang\'an (Imperial Seat)',
    region: 'Northwest',
    capital: 'Chang\'an',
    parentProvince: 'Shaanxi',
    parentHanzi: '陕西',
    landmarks: ['Giant Wild Goose Pagoda', 'Weiyang Palace', 'Imperial City Walls', 'Zhongnan Mountains'],
    description: 'Grand imperial capital and Western terminus of the Silk Road. Overlooked by the Daoist hermit caves of Zhongnan Mountain.'
  },
  '渭南': {
    name: 'Weinan (Mount Hua)',
    hanzi: '渭南',
    historicalName: 'Huashan (Sword Peak)',
    region: 'Northwest',
    capital: 'Weinan',
    parentProvince: 'Shaanxi',
    parentHanzi: '陕西',
    landmarks: ['Mount Hua (Huashan Planks)', 'South Peak Sky Ladder', 'Xiyue Temple', 'Weishui River'],
    description: 'Sheer granite cliffs soaring into cloud seas. Domain of the prestigious Mount Hua Sect and its legendary Plum Blossom Sword Qi.'
  },
  '宝鸡': {
    name: 'Baoji',
    hanzi: '宝鸡',
    historicalName: 'Chencang Pass',
    region: 'Northwest',
    capital: 'Baoji',
    parentProvince: 'Shaanxi',
    parentHanzi: '陕西',
    landmarks: ['Chencang Pass', 'Famen Buddhist Relic Temple', 'Taibai Mountain Summit'],
    description: 'Strategic mountain gateway leading across the Qinling towards Bashu. Ancient secret passage of generals.'
  },
  '汉中': {
    name: 'Hanzhong',
    hanzi: '汉中',
    historicalName: 'Hanzhong (Shu Basin Gate)',
    region: 'Northwest',
    capital: 'Hanzhong',
    parentProvince: 'Shaanxi',
    parentHanzi: '陕西',
    landmarks: ['Ancient Plank Roads (Shu Dao)', 'Dingjun Mountain', 'Han River Basin'],
    description: 'Sheltered valley between the Qinling and Daba mountains. Key military threshold commanding access to Sichuan.'
  },
  '咸阳': {
    name: 'Xianyang',
    hanzi: '咸阳',
    historicalName: 'Qin Cradle (Xianyang)',
    region: 'Northwest',
    capital: 'Xianyang',
    parentProvince: 'Shaanxi',
    parentHanzi: '陕西',
    landmarks: ['Qin Imperial Palace Site', 'Qianling Mausoleum', 'Wei River Crossings'],
    description: 'Ancestral heart of the first empire, dotted with colossal royal tumuli and warrior barracks.'
  },
  '延安': {
    name: 'Yan\'an',
    hanzi: '延安',
    historicalName: 'Fuzhou (Loess Plateau)',
    region: 'Northwest',
    capital: 'Yan\'an',
    parentProvince: 'Shaanxi',
    parentHanzi: '陕西',
    landmarks: ['Baota Pagoda', 'Loess Plateau Canyons', 'Wanquan Stronghold'],
    description: 'Rugged yellow earth ridges and defensible cliff dwellings sheltering northern frontier archers.'
  },
  '榆林': {
    name: 'Yulin',
    hanzi: '榆林',
    historicalName: 'Northern Frontier Fortress',
    region: 'Northwest',
    capital: 'Yulin',
    parentProvince: 'Shaanxi',
    parentHanzi: '陕西',
    landmarks: ['Zhenbeitai Great Wall Bastion', 'Red Stone Gorge', 'Ordos Border Watchtowers'],
    description: 'Vanguard fortress facing the Great Desert, defending the realm against nomadic horse raiders.'
  },
  '安康': {
    name: 'Ankang',
    hanzi: '安康',
    historicalName: 'Jinshan (Han River)',
    region: 'Northwest',
    capital: 'Ankang',
    parentProvince: 'Shaanxi',
    parentHanzi: '陕西',
    landmarks: ['Han River Gorges', 'Nangong Mountain', 'Xiangxi Cave Sanctuary'],
    description: 'Southern river valley cloaked in lush mountain bamboo, home to solitary swordsmen and boat pilots.'
  },
  '商洛': {
    name: 'Shangluo',
    hanzi: '商洛',
    historicalName: 'Danjiang Pass',
    region: 'Northwest',
    capital: 'Shangluo',
    parentProvince: 'Shaanxi',
    parentHanzi: '陕西',
    landmarks: ['Wuguan Pass', 'Dan River Canyon', 'Tianzhu Mountain Hermitage'],
    description: 'Strategic canyon defile fortified by the ancient Wuguan Pass, sealing off entry from the south.'
  },
  '铜川': {
    name: 'Tongchuan',
    hanzi: '铜川',
    historicalName: 'Yaowang Mountain',
    region: 'Northwest',
    capital: 'Tongchuan',
    parentProvince: 'Shaanxi',
    parentHanzi: '陕西',
    landmarks: ['Yaowang Mountain (Medicine King Sun Simiao)', 'Yuhua Palace Ruins'],
    description: 'Sacred mountain dedicated to the Medicine King, known throughout Murim for wondrous elixirs and needle acupuncture.'
  },

  // Sichuan (Bashu)
  '成都': {
    name: 'Chengdu',
    hanzi: '成都',
    historicalName: 'Bashu (Tang Clan Realm)',
    region: 'West & Bashu',
    capital: 'Chengdu',
    parentProvince: 'Sichuan',
    parentHanzi: '四川',
    landmarks: ['Wuhou Shrine', 'Dujiangyan Irrigation Weir', 'Sichuan Tang Clan Fort', 'Jin River'],
    description: 'Prosperous capital of the basin of abundance. Shadowed by the feared Tang Clan, renowned masters of hidden projectiles and lethal poisons.'
  },
  '乐山': {
    name: 'Leshan (Mount Emei)',
    hanzi: '乐山',
    historicalName: 'Emei (Sacred Buddhist Peak)',
    region: 'West & Bashu',
    capital: 'Leshan',
    parentProvince: 'Sichuan',
    parentHanzi: '四川',
    landmarks: ['Mount Emei Golden Summit', 'Leshan Giant Buddha', 'Wanfu Temple', 'Baoguo Monastery'],
    description: 'Sacred heights veiled in Buddhist halos. Seat of the Mount Emei Sect, known for righteous sword arts and graceful acupressure strikes.'
  },
  '阿坝': {
    name: 'Aba (Mount Qingcheng)',
    hanzi: '阿坝',
    historicalName: 'Qingcheng (Daoist Cradle)',
    region: 'West & Bashu',
    capital: 'Barkam',
    parentProvince: 'Sichuan',
    parentHanzi: '四川',
    landmarks: ['Mount Qingcheng Front & Back Peaks', 'Tianshi Celestial Cave', 'Jiuzhaigou Pristine Lakes'],
    description: 'Emerald green peak famous for Daoist tranquility. Homeland of the Mount Qingcheng Sect and ancient alchemy.'
  },
  '广元': {
    name: 'Guangyuan',
    hanzi: '广元',
    historicalName: 'Jianmen Pass (Sword Gate)',
    region: 'West & Bashu',
    capital: 'Guangyuan',
    parentProvince: 'Sichuan',
    parentHanzi: '四川',
    landmarks: ['Jianmen Pass (Impregnable Sword Gate)', 'Cuiyun Corridor Cypress Trail', 'Thousand Buddha Cliff'],
    description: '"One man guarding the pass blocks ten thousand warriors." The supreme cliffside defile entering Bashu.'
  },
  '绵阳': {
    name: 'Mianyang',
    hanzi: '绵阳',
    historicalName: 'Fucheng / Jiangyou',
    region: 'West & Bashu',
    capital: 'Mianyang',
    parentProvince: 'Sichuan',
    parentHanzi: '四川',
    landmarks: ['Mount Douchuan Iron Chain Bridge', 'Li Bai Poetry Hermitage', 'Fule Mountain Citadel'],
    description: 'Perilous iron-chain bridges spanning sheer chasms, frequented by bold roving martial artists.'
  },

  // Hubei (Jingchu)
  '十堰': {
    name: 'Shiyan (Mount Wudang)',
    hanzi: '十堰',
    historicalName: 'Wudang (Daoist Supreme)',
    region: 'Central Plains',
    capital: 'Shiyan',
    parentProvince: 'Hubei',
    parentHanzi: '湖北',
    landmarks: ['Mount Wudang Golden Palace', 'Purple Cloud Palace', 'Nanyan Hanging Temple', 'Danjiangkou'],
    description: 'Supreme mountain of Taiji and Daoist internal cultivation. Homeland of the renowned Wudang Sect and its sword disciples.'
  },
  '襄樊': {
    name: 'Xiangyang',
    hanzi: '襄樊',
    historicalName: 'Xiangyang Fortress',
    region: 'Central Plains',
    capital: 'Xiangyang',
    parentProvince: 'Hubei',
    parentHanzi: '湖北',
    landmarks: ['Xiangyang Ancient Moat & Walls', 'Han River Battlements', 'Migong Temple', 'Zhongxiang Royal Tombs'],
    description: 'Legendary fortified stronghold guarding the river approach to the south. Chivalric heroes gathered here to defend the realm.'
  },
  '武汉': {
    name: 'Wuhan',
    hanzi: '武汉',
    historicalName: 'Jianghan (Yellow Crane Tower)',
    region: 'Central Plains',
    capital: 'Wuhan',
    parentProvince: 'Hubei',
    parentHanzi: '湖北',
    landmarks: ['Yellow Crane Tower', 'Yangtze River Confluence', 'East Lake', 'Guiyuan Temple'],
    description: 'Crucial waterway pivot where the Han joins the Yangtze. Major hub for Beggar Sect conclaves and merchant guilds.'
  },
  '荆州': {
    name: 'Jingzhou',
    hanzi: '荆州',
    historicalName: 'Jingchu Stronghold',
    region: 'Central Plains',
    capital: 'Jingzhou',
    parentProvince: 'Hubei',
    parentHanzi: '湖北',
    landmarks: ['Jingzhou Ancient Brick Citadel', 'Guan Yu Ancestral Shrine', 'Chu Capital Ying Ruins'],
    description: 'Storied military citadel of the Three Kingdoms, fortified by massive stone battlements.'
  },
  '宜昌': {
    name: 'Yichang',
    hanzi: '宜昌',
    historicalName: 'Xiling (Three Gorges)',
    region: 'Central Plains',
    capital: 'Yichang',
    parentProvince: 'Hubei',
    parentHanzi: '湖北',
    landmarks: ['Xiling Gorge', 'Sanxia Chasm', 'Qu Yuan Memorial'],
    description: 'Eastern entrance to the mighty Three Gorges where swift rapids test the skill of martial boat escorts.'
  },
  '神农架': {
    name: 'Shennongjia',
    hanzi: '神农架',
    historicalName: 'Divine Farmer Wilderness',
    region: 'Central Plains',
    capital: 'Songbai',
    parentProvince: 'Hubei',
    parentHanzi: '湖北',
    landmarks: ['Shennongding Cloud Summit', 'Primeval Virgin Forest', 'Hundred Herbs Cave'],
    description: 'Uncharted primeval wilderness where Shennong tasted hundreds of herbs. Mythic beasts, rare spiritual herbs, and hidden masters.'
  }
};

export function getSubprovinceMeta(cleanKey: string, parentKey = ''): ProvinceMeta {
  const custom = SUBPROVINCE_METADATA[cleanKey];
  const parentMeta = PROVINCE_METADATA[parentKey] || {
    id: 'unknown',
    name: parentKey,
    hanzi: parentKey,
    historicalName: parentKey,
    region: 'Central Plains' as const,
    capital: '',
    landmarks: [],
    description: 'Subprovince of the Great Realm'
  };

  if (custom) {
    return {
      id: `${parentKey}_${cleanKey}`,
      name: custom.name || cleanKey,
      hanzi: custom.hanzi || cleanKey,
      historicalName: custom.historicalName || `${cleanKey} (${parentMeta.historicalName})`,
      region: (custom.region || parentMeta.region) as any,
      capital: custom.capital || cleanKey,
      parentProvince: custom.parentProvince || parentMeta.name,
      parentHanzi: custom.parentHanzi || parentKey,
      landmarks: custom.landmarks || [`${cleanKey} Commandery`, `${cleanKey} River Crossing`],
      description: custom.description || `Subprovince in ${parentMeta.name}. Strategic commandery and martial crossroads.`
    };
  }

  return {
    id: `${parentKey}_${cleanKey}`,
    name: cleanKey,
    hanzi: cleanKey,
    historicalName: `${cleanKey} Commandery`,
    region: parentMeta.region,
    capital: cleanKey,
    parentProvince: parentMeta.name,
    parentHanzi: parentKey,
    landmarks: [`${cleanKey} Fortress`, `${cleanKey} Market`],
    description: `Subprovince in ${parentMeta.name}. Governed by regional commanderies and local martial arts schools.`
  };
}

