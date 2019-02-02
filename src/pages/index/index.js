/**
 * 天气主页
 */
import {
  geocoder,
  fetchWeather,
  fetchAir,
  fetchForecast
} from '@/api/'
import {
  airBackgroundColor,
  getIconNameByCode,
  isNight,
  getTips,
  formatWeeklyDate,
  formatDate
} from '@/utils/'
import WIcon from '@/components/icon/icon.vue'
import { getChartConfig } from '@/utils/chart.js'
import * as echarts from 'echarts/dist/echarts.simple.min'
import mpvueEcharts from 'mpvue-echarts'

let chart = null

export default {
  components: {
    WIcon,
    mpvueEcharts
  },
  data () {
    return {
      userInfo: {},
      address: '定位中', // 定位的地址,用于显示
      province: '', // 定位的省份
      city: '北京', // 定位的城市
      district: '', // 定位的县
      lat: 39.98296, // 默认纬度
      lng: 116.30676, // 默认经度
      width: 375,
      scale: 1,
      paddingTop: 0,
      air: null,
      airLevel: '',
      current: {
        tmp: 0
      },
      tips: getTips() || '',
      today: {
        tmp: '',
        icon: '',
        weather: ''
      },
      tomorrow: {
        tmp: '',
        icon: '',
        weather: ''
      },
      hourly: [],
      weekly: [],
      echarts
    }
  },
  onLoad () {
    wx.getSystemInfo({
      success: (res) => {
        let width = res.windowWidth
        let scale = width / 375
        this.width = width
        this.scale = scale
        this.paddingTop = res.statusBarHeight + 12
      }
    })
    this.getLocation()
  },
  // 下拉刷新重新加载数据
  async onPullDownRefresh() {
    await this.getWeather()
    wx.stopPullDownRefresh()
  },
  computed: {
    humidity () {
      let h = this.current.hum
      return h ? `湿度${h}%` : h || ''
    },
    windLevel () {
      let level = this.current.wind_sc
      if (level === '1-2') {
        return '微风'
      } else {
        return level ? `${level}级` : ''
      }
    }
  },
  methods: {
    /**
     * 自定义loading文字
     * @param {string} text 自定义的文字
     */
    customLoading (text) {
      wx.showLoading({
        title: text,
        mask: true
      })
    },

    // 获取经纬度，获取成功后用腾讯地图api进行逆地址解析
    getLocation () {
      wx.getLocation({
        // gcj02类型可以获取到定位坐标，用于使用微信内置地图
        type: 'gcj02',
        success: (res) => {
          const { latitude, longitude } = res
          this.getAddress(latitude, longitude)
        },
        fail: (err) => {
          this.address = '北京市海淀区'
          wx.showToast({
            title: '请开启地理位置权限😄',
            icon: 'none',
            duration: 5000
          })
          console.log(err)
        }
      })
    },

    /**
     * 逆地址解析
     * @param {number} lat 纬度
     * @param {number} lng 经度
     */
    async getAddress (lat, lng) {
      this.lat = lat
      this.lng = lng

      this.customLoading('定位中，请稍等')

      try {
        const res = await geocoder(lat, lng)
        const {
          data: {
            result
          }
        } = res

        /* eslint-disable */
        console.log(res)
        // 地址描述跟位置描述
        let {
          address,
          formatted_addresses,
          address_component: {
            city,
            district,
            province
          }
        } = result
        // 优化过的位置跟大致位置
        
        const { recommend, rough } = formatted_addresses
        /**
         * 在腾讯地图WebService api文档上
         * address 是必然会返回的
         * 而formatted_address不一定返回,
         * formatted_address中的定位更为准确
         * 这里的判断是在formatted_address存在的情况下取最佳地址
         * @param {string} address 地址描述
         * @param {string} formatted_addresses.recommend 经过腾讯地图优化过的描述方式，更具人性化特点
         * @param {string} formatted_addresses.rough 大致位置，可用于对位置的粗略描述
         */
        if (address && (recommend || rough)) {
          address = recommend || rough
        }

        /* eslint-enable */
        this.city = city
        this.province = province
        this.district = district
        this.address = address
        this.getWeather()
        console.log('ok')
      } catch (e) {
        this.address = '北京市海淀区'
      }
    },

    /**
     * 获取今明两日数据
     * @param {Object} data 天气数据
     */
    getTwoDay (data) {
      const { daily_forecast: dailyForcast } = data
      const todayData = dailyForcast[0]
      const tomorrowData = dailyForcast[1]
      const _isNight = isNight((new Date()).getHours())
      const getIcon = (day) => {
        return _isNight ? getIconNameByCode(day.cond_code_n) : getIconNameByCode(day.cond_code_d)
      }
      const getWeather = (day) => {
        return _isNight ? day.cond_txt_n : day.cond_txt_d
      }
      const getData = (day) => {
        return {
          tmp: `${day.tmp_max}/${day.tmp_min}°C`,
          icon: getIcon(day),
          weather: getWeather(day)
        }
      }
      const today = getData(todayData)
      const tomorrow = getData(tomorrowData)
      this.today = today
      this.tomorrow = tomorrow
      this.daily = dailyForcast
    },

    /**
     * 获取实况天气数据
     */
    async getWeather () {
      this.customLoading('获取天气数据中...')
      const { lat, lng, city, province } = this
      const [weatherRes, airRes, forecastRes] = await Promise.all([
        fetchWeather(lat, lng),
        fetchAir(city),
        fetchForecast(province, city)
      ])
      // 常规天气数据
      const { HeWeather6: weatherData } = weatherRes.data
      // 空气质量数据
      const { HeWeather6: airData } = airRes.data
      // 现在的天气数据、天气预报
      const { now, daily_forecast: dailyForcast } = weatherData[0]
      // 今天的日出日落时间
      const { sr, ss } = dailyForcast[0]
      // 现在的时间(时)
      const hour = (new Date()).getHours()
      const _isNight = isNight(hour, sr, ss)
      this.current = {
        ...now,
        icon: getIconNameByCode(now.cond_code, _isNight)
      }

      if (weatherData) {
        this.getTwoDay(weatherData[0])
      }

      console.log(weatherData)
      console.log(airRes)
      const air = airData[0]['air_now_city']
      this.air = { ...air, color: airBackgroundColor(air.aqi) }
      const { data: { data: forecasts } } = forecastRes
      const { forecast_1h: hourly, forecast_24h: weekly } = forecasts
      console.log('for', hourly)
      console.log(Object.values(hourly).reduce((a, b) => [...a, b], []))
      const getHour24 = () => {
        return Object.values(hourly)
          .reduce((a, b) => [...a, b], [])
          .slice(0, 24)
          .map(v => {
            return Object.assign(
              v,
              {
                update_time: `${v.update_time.slice(8, 10)}:00`,
                weather_code: getIconNameByCode(v.weather_code, _isNight)
              }
            )
          })
      }
      const getWeek7 = () => {
        return Object.values(weekly)
          .reduce((prev, cur) => [...prev, cur], [])
          .map((v, idx, arr) => {
            return Object.assign(
              v,
              {
                day_weather_code: getIconNameByCode(v.day_weather_code, _isNight),
                night_weather_code: getIconNameByCode(v.night_weather_code, _isNight),
                date: formatWeeklyDate(idx),
                time: formatDate(v.time)
              }
            )
          })
      }
      const hour24 = getHour24()
      const week7 = getWeek7()
      this.hourly = hour24
      this.weekly = week7
      this.onInit = this.initChart
      this.$refs.echarts.init()
    },

    handleInit (canvas) {
      const scale = this.scale
      const chartHeight = 272 / 2
      const height = chartHeight * scale
      const width = this.width
      const weeklyData = this.weekly

      chart = echarts.init(canvas, null, {
        width: width,
        height: height + 80
      })

      canvas.setChart(chart)

      chart.setOption(getChartConfig(weeklyData))

      return chart
    }
  }
}
