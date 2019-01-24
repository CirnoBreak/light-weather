<template>
  <div class="wrapp">
    <div class="container" :style="{ paddingTop: paddingTop + 'px' }">
      <!-- 实时天气 -->
      <div class="current">
        <!-- 当前位置 -->
        <div class="loc">
          <w-icon type="dingwei"></w-icon>
          <span>{{ address }}</span>
        </div>
        <!-- 空气质量 -->
        <div v-if="air && air.aqi" class="air" :style="{ background: air.color}">
          <div>{{ air.aqi }}</div>
          <div class="qlty">{{ air.qlty }}</div>
        </div>
        <!-- 当前天气 -->
        <div class="current-weather">
          <div class="tmp">
            <span class="text">{{ current.tmp }}</span>
            <span class="text degree">°</span>
          </div>
          <div class="cur-weather">
            <div class="inline">
              <w-icon :type="current.icon"></w-icon>
              <span> {{ current.cond_txt }}</span>
            </div>
            <div class="inline today">
              <div class="item">
                {{ current.wind_dir }} {{ windLevel }}
              </div>
              <span class="item">{{ humidity }}</span>
            </div>
            <div class="inline tips">
              {{ tips }}
            </div>
          </div>
        </div>
        <!-- 今明两日天气 -->
        <div class="two-days">
          <div class="item">
            <div class="top">
              <span class="date">今天</span>
              <span class="tmp">{{ today.tmp }}</span>
            </div>
            <div class="bottom">
              <span class="text">{{ today.weather }}</span>
              <w-icon :type="today.icon"></w-icon>
            </div>
        </div>
        <div class="item">
          <div class="top">
            <span class="date">明天</span>
            <span class="tmp">{{ tomorrow.tmp }}</span>
          </div>
          <div class="bottom">
            <span class="text">{{ tomorrow.weather }}</span>
            <w-icon :type="tomorrow.icon"></w-icon>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 天气主页
 */
import { geocoder, fetchWeather, fetchAir } from '@/api/'
import { airBackgroundColor, getIconNameByCode, isNight, getTips } from '@/utils/'
import WIcon from '@/components/icon/icon.vue'

export default {
  components: {
    WIcon
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
      }
    }
  },
  onLoad () {
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        let width = res.windowWidth
        let scale = width / 375
        this.width = width
        this.scale = scale
        this.paddingTop = res.statusBarHeight + 12
      }
    })
    this.getLocation()
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
    },

    /**
     * 获取实况天气数据
     */
    async getWeather () {
      this.customLoading('获取天气数据中...')
      const { lat, lng, city } = this
      const [weatherRes, airRes] = await Promise.all([
        fetchWeather(lat, lng),
        fetchAir(city)
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
      this.current = {
        ...now,
        icon: getIconNameByCode(now.cond_code, isNight(hour, sr, ss))
      }

      if (weatherData) {
        this.getTwoDay(weatherData[0])
      }

      console.log(weatherData)
      console.log(airRes)
      const air = airData[0]['air_now_city']
      this.air = { ...air, color: airBackgroundColor(air.aqi) }
    }
  }
}
</script>

<style lang="less">
.flex-row {
  display: flex;
  flex-direction: row;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.current {
  height: 560rpx;
  overflow: hidden;
  position: relative;
  border: 1px solid #000;
  .loc {
    text-align: center;
    font-size: 26rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 200rpx;

    .icon {
      display: inline;
      font-size: 26rpx;
      margin-right: 4rpx;
    }
  }
  .air {
    position: absolute;
    .flex-column();
    top: 104rpx;
    height: 70rpx;
    padding: 5rpx 25rpx;
    text-align: center;
    border-radius: 13rpx;
    font-size: 20rpx;
    div {
      color: #fff;
      vertical-align: middle;
      line-height: 35rpx;
    }
    .qlty {
      font-size: 25rpx;
    }
  }
  .current-weather {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    text-align: center;
    transform: translateY(-50%);
    .tmp .text {
      font-size: 156rpx;
    }
    .cur-weather {
      position: relative;
      margin-bottom: 40rpx;
      .today {
        .flex-row();
        margin-top: 10rpx;
        .item {
          display: block;
          padding-right: 16rpx;
          margin: 0 16rpx 0 0;
          border-right: 1px solid #ccc;
          font-size: 28rpx;
          flex: 1;
          text-align: right;
          &:last-child {
            text-align: left;
            border: none;
            padding: 0;
            margin: 0;
          }
        }
      }
      .tips {
        font-size: 25rpx;
        margin-top: 30rpx;
      }
    }
  }
}
.two-days {
  .flex-row();
  width: 100%;
  overflow: hidden;
  position: relative;
  top: 75%;
  bottom: 0;
  margin-bottom: 0;
  .item {
    width: 50%;
    border-right: 1px solid #ccc;
    &:last-child {
      border-right: none;
    }
    .top {
      height: 24rpx;
      margin-bottom: 26rpx;
      margin-right: -20rpx;
    }
    .date, .text {
      float: left;
      margin-left: 10rpx;
    }
    .tmp, .icon {
      float: right;
      margin-right: 30rpx;
    }
  }
}
</style>
