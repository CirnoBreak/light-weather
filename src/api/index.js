/**
 * api接口页面
 */

import { QQ_MAP_KEY, weatherKey } from '../config/index'
// 请求库
import fly from '../utils/http'

// 和风天气api
const hfApi = 'https://free-api.heweather.com/s6'
// 腾讯地图api
const mapApi = 'https://apis.map.qq.com/ws/geocoder/v1/'
// QQ天气api
const qqwApi = 'https://wis.qq.com/weather/common'

/**
 * 逆地址解析(经纬度 => 真实地址)
 * @param {number} lat 纬度
 * @param {number} lng 经度
 */
export const geocoder = (lat, lng) => {
  /**
   * 请求参数
   * @param {string} location 经纬度
   * @param {string} key 腾讯地图key
   * @param {string} get_poi 是否返回周边POI列表，1返回，0不返回(默认)
   */
  const params = {
    location: `${lat},${lng}`,
    key: QQ_MAP_KEY,
    get_poi: 0
  }
  return fly.get(mapApi, params)
}

/**
 * 获取实况天气
 * @param {number} lat 纬度
 * @param {number} lng 经度
 */
export const fetchWeather = (lat, lng) => {
  /**
   * 请求参数
   * @param {string} location 经纬度
   * @param {string} unit 单位，m为公制
   * @param {string} key 和风天气key
   */
  const params = {
    location: `${lat},${lng}`,
    unit: 'm',
    key: weatherKey
  }

  return fly.get(`${hfApi}/weather`, params)
}

/**
 * 获取空气质量数据集合
 * @param {number} lat 纬度
 * @param {number} lng 经度
 */
export const fetchAir = (city) => {
  /**
   * 请求参数
   * @param {string} city 城市
   * @param {string} unit 单位，m为公制
   * @param {string} key 和风天气key
   */
  const params = {
    location: city,
    unit: 'm',
    key: weatherKey
  }
  return fly.get(`${hfApi}/air`, params)
}

export const fetchForecast = (province, city) => {
  const params = {
    province,
    city,
    source: 'pc',
    weather_type: 'forecast_1h|forecast_24h'
  }
  return fly.get(`${qqwApi}`, params)
}
