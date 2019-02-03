/**
 * 结合日出日落时间判断现在是否是晚上
 * @param {number} hour 现在的时间(时)
 * @param {string} sr 日出时间
 * @param {string} ss 日落时间
 */
export function isNight (hour, sr, ss) {
  sr = +sr + 1
  ss = +ss
  let isNight
  if (hour > ss) {
    isNight = true
  } else if (hour < sr) {
    isNight = true
  }
  return isNight
}

const dateName = ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日']

/**
 * 把当前日期转换成对应的星期几
 * @param {number} index 数组索引
 */
export function formatWeeklyDate (index) {
  const now = new Date()
  const threeDay = ['昨天', '今天', '明天']
  const curDate = now.getDay()
  if (threeDay[index]) {
    return threeDay[index]
  }
  return dateName[curDate + index - 1]
}

/**
 * 把xxxx-xx-xx(年-月-日)转成xx/xx(月/日)
 * @param {stromg} date 日期
 */
export function formatDate (date) {
  return date.split('-').slice(1).join('/')
}

/**
 * 获取aqi对应的空气质量颜色
 * @param {number} aqi 空气质量指数
 */
export function airBackgroundColor (aqi) {
  if (aqi < 50) {
    return '#a3d765'
  } else if (aqi < 100) {
    return '#f0cc35'
  } else if (aqi < 150) {
    return '#f1ab62'
  } else if (aqi < 200) {
    return '#e03131'
  } else if (aqi > 300) {
    return '#ff6600'
  }
}
/**
 * 随机获取一句tips
 */
export function getTips () {
  const list = [
    '生活就像海洋，只有意志坚强的人才能到达彼岸',
    '空山新雨后，天气晚来秋',
    '你不能左右天气，但你可以改变心情',
    '天气是老天爷给你的，它就是老天爷的表情'
  ]
  const ranIdx = Math.floor((Math.random() * list.length))
  return list[ranIdx]
}

/**
 * 转换生活指数相关数据
 * @param {Array} data 生活指数数据
 */
export function getLifeStyle (data) {
  let arr = []
  const map = {
      cw: {
        icon: 'xichezhishu',
        name: '洗车'
      },
      sport: {
        icon: 'yundongzhishu',
        name: '运动'
      },
      flu: {
        icon: 'ganmao',
        name: '感冒'
      },
      uv: {
        icon: 'ziwaixian',
        name: '紫外线强度'
      },
      drsg: {
        icon: 'liangshai',
        name: '穿衣'
      },
      air: {
        icon: 'beikouzhao',
        name: '污染扩散'
      },

      trav: {
        icon: 'fangshai',
        name: '旅游'
      },
      comf: {
        icon: 'guominzhishu',
        name: '舒适度'
      }
    }
    data.map((v) => {
      let t = map[v.type]
      arr.push({
        name: t.name,
        icon: t.icon,
        info: v.brf,
        detail: v.txt
      })
    })
    return arr
}
/**
 * 获取实况天气状况代码对应的图标
 * @param {number} code 实况天气代码
 * @param {*} isNight 是否是晚上
 */
export function getIconNameByCode (code, isNight) {
  const nightMap = {
    '00': 'qingye',
    '100': 'qingye',
    '200': 'qingye',
    '201': 'qingye',
    '202': 'qingye',
    '203': 'qingye',
    '204': 'qingye',
    '01': 'duoyunye',
    '101': 'duoyunye',
    '102': 'duoyunye',
    '103': 'duoyunye',
    '03': 'zhenyuye',
    '300': 'zhenyuye',
    '301': 'zhenyuye',
    '302': 'zhenyuye',
    '303': 'zhenyuye',
    '304': 'zhenyuye',
    '305': 'zhenyuye',
    '306': 'zhenyuye',
    '307': 'zhenyuye',
    '308': 'zhenyuye',
    '309': 'zhenyuye',
    '310': 'zhenyuye',
    '311': 'zhenyuye',
    '312': 'zhenyuye',
    '313': 'zhenyuye',
    '314': 'zhenyuye',
    '315': 'zhenyuye',
    '316': 'zhenyuye',
    '399': 'zhenyuye',
    '317': 'zhenyuye',
    '318': 'zhenyuye',
    '13': 'zhenxueye',
    '400': 'zhenxueye',
    '401': 'zhenxueye',
    '402': 'zhenxueye',
    '403': 'zhenxueye',
    '404': 'zhenxueye',
    '405': 'zhenxueye',
    '406': 'zhenxueye',
    '407': 'zhenxueye',
    '408': 'zhenxueye',
    '409': 'zhenxueye',
    '410': 'zhenxueye',
    '499': 'zhenxueye'
  }
  const dayMap = {
    '100': 'qingbai',
    '101': 'duoyunbai',
    '102': 'duoyunbai',
    '103': 'duoyunbai',
    '02': 'yin',
    '104': 'yin',
    '00': 'qingye',
    '201': 'qingye',
    '202': 'qingye',
    '203': 'qingye',
    '204': 'qingye',
    '01': 'duoyunye',
    '205': 'fengli',
    '206': 'fengli',
    '207': 'fengli',
    '208': 'fengli',
    '209': 'yin',
    '210': 'yin',
    '211': 'yin',
    '212': 'yin',
    '213': 'yin',
    '03': 'zhenyubai',
    '300': 'zhenyubai',
    '301': 'zhenyubai',
    '04': 'leizhenyu',
    '302': 'leizhenyu',
    '303': 'leizhenyu',
    '05': 'leizhenyuzhuanbingbao',
    '304': 'leizhenyuzhuanbingbao',
    '07': 'xiaoyu',
    '305': 'xiaoyu',
    '08': 'zhongyu',
    '306': 'zhongyu',
    '307': 'dayu',
    '308': 'tedabaoyu',
    '309': 'xiaoyu',
    '310': 'baoyu',
    '311': 'dabaoyu',
    '312': 'tedabaoyu',
    '19': 'dongyu',
    '313': 'dongyu',
    '314': 'xiaoyu',
    '315': 'zhongyu',
    '09': 'dayu',
    '316': 'dayu',
    '10': 'baoyu',
    '317': 'baoyu',
    '11': 'dabaoyu',
    '318': 'dabaoyu',
    '399': 'xiaoyu',
    '14': 'xiaoxue',
    '400': 'xiaoxue',
    '15': 'zhongxue',
    '401': 'zhongxue',
    '16': 'daxue',
    '402': 'daxue',
    '17': 'baoxue',
    '403': 'baoxue',
    '06': 'yujiaxue',
    '404': 'yujiaxue',
    '405': 'yujiaxue',
    '406': 'yujiaxue',
    '407': 'zhenxuebai',
    '408': 'xiaoxue',
    '409': 'zhongxue',
    '410': 'daxue',
    '499': 'xiaoxue',
    '18': 'wu',
    '500': 'wu',
    '501': 'wu',
    '502': 'wumaibai',
    '30': 'yangsha',
    '503': 'yangsha',
    '504': 'yangsha',
    '20': 'shachenbao',
    '507': 'shachenbao',
    '31': 'qiangshachenbao',
    '508': 'qiangshachenbao',
    '509': 'wu',
    '510': 'wu',
    '53': 'wumaibai',
    '511': 'wumaibai',
    '512': 'wumaibai',
    '513': 'wumaibai',
    '514': 'wu',
    '515': 'wu',
    '900': 'qingbai',
    '901': 'qingbai',
    '902': 'yin'
  }
  if (isNight && nightMap[code]) {
    return nightMap[code]
  }
  return dayMap[code] ? dayMap[code] : 'yin'
}
