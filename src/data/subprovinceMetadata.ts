import { pinyin } from 'pinyin-pro';

export const SPECIAL_ROMANIZATION: Record<string, string> = {
  // Direct Municipalities & Special Regions
  '北京': 'Beijing',
  '天津': 'Tianjin',
  '上海': 'Shanghai',
  '重庆': 'Chongqing',
  '香港': 'Hong Kong',
  '澳门': 'Macau',
  '台湾': 'Taiwan',

  // Tibet (Xizang)
  '拉萨': 'Lhasa',
  '日喀则': 'Shigatse',
  '昌都': 'Chamdo',
  '林芝': 'Nyingchi',
  '山南': 'Shannan (Lhoka)',
  '那曲': 'Nagqu',
  '阿里': 'Ngari',

  // Xinjiang
  '乌鲁木齐': 'Urumqi',
  '克拉玛依': 'Karamay',
  '吐鲁番': 'Turpan',
  '哈密': 'Hami (Kumul)',
  '喀什': 'Kashgar',
  '阿克苏': 'Aksu',
  '和田': 'Hotan',
  '阿勒泰': 'Altay',
  '塔城': 'Tacheng',
  '博尔塔拉': 'Bortala',
  '巴音郭楞': 'Bayingolin',
  '克孜勒苏': 'Kizilsu',
  '伊犁': 'Ili',

  // Inner Mongolia (Neimenggu)
  '呼和浩特': 'Hohhot',
  '包头': 'Baotou',
  '呼伦贝尔': 'Hulunbuir',
  '兴安': 'Hinggan',
  '通辽': 'Tongliao',
  '赤峰': 'Chifeng',
  '锡林郭勒': 'Xilingol',
  '乌兰察布': 'Ulanqab',
  '鄂尔多斯': 'Ordos',
  '巴彦淖尔': 'Bayannur',
  '乌海': 'Wuhai',
  '阿拉善': 'Alxa',

  // Cities with apostrophes / specific spellings
  '西安': "Xi'an",
  '延安': "Yan'an",
  '六安': "Lu'an",
  '淮安': "Huai'an",
  '吉安': "Ji'an",
  '临安': "Lin'an",
  '新安': "Xin'an",
  '长安': "Chang'an",
  '泰安': "Tai'an",
  '雅安': "Ya'an",
  '广安': "Guang'an",
  '普洱': "Pu'er",
  '定安': "Ding'an",
  '建安': "Jian'an",

  // Northeast
  '哈尔滨': 'Harbin',
  '齐齐哈尔': 'Qiqihar',
  '牡丹江': 'Mudanjiang',
  '佳木斯': 'Jiamusi',
  '大庆': 'Daqing',
  '伊春': 'Yichun',
  '鸡西': 'Jixi',
  '鹤岗': 'Hegang',
  '双鸭山': 'Shuangyashan',
  '七台河': 'Qitaihe',
  '黑河': 'Heihe',
  '绥化': 'Suihua',
  '大兴安岭': "Daxing'anling",
  '长春': 'Changchun',
  '吉林': 'Jilin City',
  '延边': 'Yanbian',
  '沈阳': 'Shenyang',
  '大连': 'Dalian',
  '鞍山': 'Anshan',
  '抚顺': 'Fushun',
  '本溪': 'Benxi',
  '丹东': 'Dandong',
  '锦州': 'Jinzhou',
  '营口': 'Yingkou',
  '阜新': 'Fuxin',
  '辽阳': 'Liaoyang',
  '盘锦': 'Panjin',
  '铁岭': 'Tieling',
  '朝阳': 'Chaoyang (Liaoning)',
  '葫芦岛': 'Huludao',

  // Guangdong
  '广州': 'Guangzhou',
  '深圳': 'Shenzhen',
  '珠海': 'Zhuhai',
  '汕头': 'Shantou',
  '佛山': 'Foshan',
  '韶关': 'Shaoguan',
  '湛江': 'Zhanjiang',
  '肇庆': 'Zhaoqing',
  '江门': 'Jiangmen',
  '茂名': 'Maoming',
  '惠州': 'Huizhou',
  '梅州': 'Meizhou',
  '汕尾': 'Shanwei',
  '河源': 'Heyuan',
  '阳江': 'Yangjiang',
  '清远': 'Qingyuan',
  '东莞': 'Dongguan',
  '中山': 'Zhongshan',
  '潮州': 'Chaozhou',
  '揭阳': 'Jieyang',
  '云浮': 'Yunfu',

  // Sichuan
  '成都': 'Chengdu',
  '自贡': 'Zigong',
  '攀枝花': 'Panzhihua',
  '泸州': 'Luzhou',
  '德阳': 'Deyang',
  '绵阳': 'Mianyang',
  '广元': 'Guangyuan',
  '遂宁': 'Suining',
  '内江': 'Neijiang',
  '乐山': 'Leshan',
  '南充': 'Nanchong',
  '眉山': 'Meishan',
  '宜宾': 'Yibin',
  '达州': 'Dazhou',
  '巴中': 'Bazhong',
  '资阳': 'Ziyang',
  '阿坝': 'Aba (Ngawa)',
  '甘孜': 'Garze',
  '凉山': 'Liangshan',

  // Zhejiang
  '杭州': 'Hangzhou',
  '宁波': 'Ningbo',
  '温州': 'Wenzhou',
  '嘉兴': 'Jiaxing',
  '湖州': 'Huzhou',
  '绍兴': 'Shaoxing',
  '金华': 'Jinhua',
  '衢州': 'Quzhou',
  '舟山': 'Zhoushan',
  '台州': 'Taizhou (Zhejiang)',
  '丽水': 'Lishui',

  // Jiangsu
  '南京': 'Nanjing',
  '无锡': 'Wuxi',
  '徐州': 'Xuzhou',
  '常州': 'Changzhou',
  '苏州': 'Suzhou',
  '南通': 'Nantong',
  '连云港': 'Lianyungang',
  '盐城': 'Yancheng',
  '扬州': 'Yangzhou',
  '镇江': 'Zhenjiang',
  '宿迁': 'Suqian',

  // Shandong
  '济南': 'Jinan',
  '青岛': 'Qingdao',
  '淄博': 'Zibo',
  '枣庄': 'Zaozhuang',
  '东营': 'Dongying',
  '烟台': 'Yantai',
  '潍坊': 'Weifang',
  '济宁': 'Jining',
  '威海': 'Weihai',
  '日照': 'Rizhao',
  '莱芜': 'Laiwu',
  '临沂': 'Linyi',
  '德州': 'Dezhou',
  '聊城': 'Liaocheng',
  '滨州': 'Binzhou',
  '菏泽': 'Heze',

  // Hubei
  '武汉': 'Wuhan',
  '黄石': 'Huangshi',
  '十堰': 'Shiyan',
  '宜昌': 'Yichang',
  '襄樊': 'Xiangyang',
  '襄阳': 'Xiangyang',
  '鄂州': 'Ezhou',
  '荆门': 'Jingmen',
  '孝感': 'Xiaogan',
  '荆州': 'Jingzhou',
  '黄冈': 'Huanggang',
  '咸宁': 'Xianning',
  '随州': 'Suizhou',
  '恩施': 'Enshi',
  '仙桃': 'Xiantao',
  '潜江': 'Qianjiang',
  '天门': 'Tianmen',
  '神农架': 'Shennongjia',

  // Hunan
  '长沙': 'Changsha',
  '株洲': 'Zhuzhou',
  '湘潭': 'Xiangtan',
  '衡阳': 'Hengyang',
  '邵阳': 'Shaoyang',
  '岳阳': 'Yueyang',
  '常德': 'Changde',
  '张家界': 'Zhangjiajie',
  '益阳': 'Yiyang',
  '郴州': 'Chenzhou',
  '永州': 'Yongzhou',
  '怀化': 'Huaihua',
  '娄底': 'Loudi',
  '湘西': 'Xiangxi',

  // Jiangxi
  '南昌': 'Nanchang',
  '景德镇': 'Jingdezhen',
  '萍乡': 'Pingxiang',
  '九江': 'Jiujiang',
  '新余': 'Xinyu',
  '鹰潭': 'Yingtan',
  '赣州': 'Ganzhou',
  '宜春': 'Yichun',
  '上饶': 'Shangrao',
  '抚州': 'Fuzhou (Jiangxi)',

  // Fujian
  '福州': 'Fuzhou',
  '厦门': 'Xiamen',
  '莆田': 'Putian',
  '三明': 'Sanming',
  '泉州': 'Quanzhou',
  '漳州': 'Zhangzhou',
  '南平': 'Nanping',
  '龙岩': 'Longyan',
  '宁德': 'Ningde',

  // Guizhou
  '贵阳': 'Guiyang',
  '六盘水': 'Liupanshui',
  '遵义': 'Zunyi',
  '安顺': 'Anshun',
  '铜仁': 'Tongren',
  '黔西南': 'Qianxinan',
  '毕节': 'Bijie',
  '黔东南': 'Qiandongnan',
  '黔南': 'Qiannan',

  // Yunnan
  '昆明': 'Kunming',
  '曲靖': 'Qujing',
  '玉溪': 'Yuxi',
  '保山': 'Baoshan',
  '昭通': 'Zhaotong',
  '丽江': 'Lijiang',
  '临沧': 'Lincang',
  '楚雄': 'Chuxiong',
  '红河': 'Honghe',
  '文山': 'Wenshan',
  '西双版纳': 'Xishuangbanna',
  '大理': 'Dali',
  '德宏': 'Dehong',
  '怒江': 'Nujiang',
  '迪庆': 'Diqing (Shangri-La)',

  // Guangxi
  '南宁': 'Nanning',
  '柳州': 'Liuzhou',
  '桂林': 'Guilin',
  '梧州': 'Wuzhou',
  '北海': 'Beihai',
  '防城港': 'Fangchenggang',
  '钦州': 'Qinzhou',
  '贵港': 'Guigang',
  '玉林': 'Yulin (Guangxi)',
  '百色': 'Baise',
  '贺州': 'Hezhou',
  '河池': 'Hechi',
  '来宾': 'Laibin',
  '崇左': 'Chongzuo',

  // Hainan
  '海口': 'Haikou',
  '三亚': 'Sanya',
  '三沙': 'Sansha',
  '儋州': 'Danzhou',
  '五指山': 'Wuzhishan',
  '琼海': 'Qionghai',
  '文昌': 'Wenchang',
  '万宁': 'Wanning',
  '东方': 'Dongfang',
  '屯昌': 'Tunchang',
  '澄迈': 'Chengmai',
  '临高': 'Lingao',
  '白沙': 'Baisha',
  '昌江': 'Changjiang',
  '乐东': 'Ledong',
  '陵水': 'Lingshui',
  '保亭': 'Baoting',
  '琼中': 'Qiongzhong',

  // Gansu
  '兰州': 'Lanzhou',
  '嘉峪关': 'Jiayuguan',
  '金昌': 'Jinchang',
  '白银': 'Baiyin',
  '天水': 'Tianshui',
  '武威': 'Wuwei',
  '张掖': 'Zhangye',
  '平凉': 'Pingliang',
  '酒泉': 'Jiuquan',
  '庆阳': 'Qingyang',
  '定西': 'Dingxi',
  '陇南': 'Longnan',
  '临夏': 'Linxia',
  '甘南': 'Gannan',

  // Qinghai
  '西宁': 'Xining',
  '海东': 'Haidong',
  '海北': 'Haibei',
  '黄南': 'Huangnan',
  '海南州': 'Hainan (Qinghai)',
  '果洛': 'Golog',
  '玉树': 'Yushu',
  '海西': 'Haixi',

  // Ningxia
  '银川': 'Yinchuan',
  '石嘴山': 'Shizuishan',
  '吴忠': 'Wuzhong',
  '固原': 'Guyuan',
  '中卫': 'Zhongwei',

  // Shanxi (山西)
  '太原': 'Taiyuan',
  '大同': 'Datong',
  '阳泉': 'Yangquan',
  '长治': 'Changzhi',
  '晋城': 'Jincheng',
  '朔州': 'Shuozhou',
  '晋中': 'Jinzhong',
  '运城': 'Yuncheng',
  '忻州': 'Xinzhou',
  '临汾': 'Linfen',
  '吕梁': 'Lvliang',

  // Hebei
  '石家庄': 'Shijiazhuang',
  '唐山': 'Tangshan',
  '秦皇岛': 'Qinhuangdao',
  '邯郸': 'Handan',
  '邢台': 'Xingtai',
  '保定': 'Baoding',
  '张家口': 'Zhangjiakou',
  '承德': 'Chengde',
  '沧州': 'Cangzhou',
  '廊坊': 'Langfang',
  '衡水': 'Hengshui',

  // Shaanxi (陕西)
  '宝鸡': 'Baoji',
  '咸阳': 'Xianyang',
  '铜川': 'Tongchuan',
  '渭南': 'Weinan',
  '汉中': 'Hanzhong',
  '安康': 'Ankang',
  '商洛': 'Shangluo',
  '榆林': 'Yulin (Shaanxi)',

  // Henan (河南)
  '洛阳': 'Luoyang',
  '开封': 'Kaifeng',
  '郑州': 'Zhengzhou',
  '平顶山': 'Pingdingshan',
  '安阳': 'Anyang',
  '鹤壁': 'Hebi',
  '新乡': 'Xinxiang',
  '焦作': 'Jiaozuo',
  '濮阳': 'Puyang',
  '许昌': 'Xuchang',
  '漯河': 'Luohe',
  '三门峡': 'Sanmenxia',
  '南阳': 'Nanyang',
  '商丘': 'Shangqiu',
  '信阳': 'Xinyang',
  '周口': 'Zhoukou',
  '驻马店': 'Zhumadian',
  '济源': 'Jiyuan'
};

/**
 * Robustly transliterates any Chinese geographic division name to clean, capitalized English Romanization.
 */
export function romanizeChinese(chineseText: string): string {
  if (!chineseText) return 'Prefecture';
  
  // Normalize administrative suffixes
  const clean = chineseText.replace(/(市|地区|藏族自治州|彝族自治州|自治州|哈萨克自治州|回族自治州|蒙古自治州|朝鲜族自治州|布依族苗族自治州|苗族侗族自治州|哈尼族彝族自治州|傣族自治州|白族自治州|藏族羌族自治州|土家族苗族自治州|壮族苗族自治州|林区|特别行政区|自治县|县|区)$/, '') || chineseText;

  if (SPECIAL_ROMANIZATION[clean]) {
    return SPECIAL_ROMANIZATION[clean];
  }
  if (SPECIAL_ROMANIZATION[chineseText]) {
    return SPECIAL_ROMANIZATION[chineseText];
  }

  // Use pinyin-pro to transliterate character array
  try {
    const pyArray = pinyin(clean, { toneType: 'none', type: 'array' });
    if (pyArray && pyArray.length > 0) {
      const combined = pyArray.join('');
      return combined.charAt(0).toUpperCase() + combined.slice(1);
    }
  } catch {
    // fallback
  }

  return clean;
}
