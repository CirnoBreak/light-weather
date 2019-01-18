<template>
  <div class="container">
  </div>
</template>

<script>
/**
 * 天气主页
 */
import { geocoder, fetchWeather, fetchAir } from '@/api/'
export default {
  data () {
    return {
      userInfo: {},
      address: '定位中', // 定位的地址,用于显示
      province: '', // 定位的省份
      city: '北京', // 定位的城市
      district: '', // 定位的县
      lat: 39.98296, // 默认纬度
      lng: 116.30676 // 默认经度
    }
  },
  onLoad () {
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
          wx.showToast({
            title: '请开启地理位置权限😄',
            icon: 'none',
            duration: 2000
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
        this.address = '北京市海淀区彩和坊路海淀西大街74号'
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
      console.log(airData)
    }
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
