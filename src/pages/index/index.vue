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
        <div v-if="air && air.aqi" class="air" :style="{ background: air.color}">
          <div>{{ air.aqi }}</div>
          <div>{{ air.qlty }}</div>
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
      airLevel: ''
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

    airBackgroundColor (aqi) {
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
      const { HeWeather6: weatherData } = weatherRes.data
      const { HeWeather6: airData } = airRes.data
      console.log(weatherData)
      console.log(airRes)
      const air = airData[0]['air_now_city']
      this.air = {...air, color: this.airBackgroundColor(air.aqi)}
    }
  }
}
</script>

<style lang="less">
.current {
  height: 560rpx;
  overflow: hidden;
  position: relative;
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
    display: flex;
    flex-direction: column;
    top: 100rpx;
    left: 20rpx;
    height: 70rpx;
    padding: 5rpx 20rpx;
    text-align: center;
    border-radius: 13rpx;
    font-size: 20rpx;
    div {
      color: #fff;
      vertical-align: middle;
      line-height: 35rpx;
    }
  }
}
</style>
