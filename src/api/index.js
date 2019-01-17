/**
 * api接口页面
 */

import { QQ_MAP_KEY } from '../config/index'
// 请求库
import Fly from 'flyio/dist/npm/wx'
const fly = new Fly()

/**
 * 逆地址解析(经纬度 => 真实地址)
 * @param {number} lat 纬度
 * @param {number} lng 经度
 */
export const geocoder = (lat, lng) => {
  return fly.get('https://apis.map.qq.com/ws/geocoder/v1/', {
    location: `${lat},${lng}`,
    key: QQ_MAP_KEY,
    get_poi: 0
  })
}
