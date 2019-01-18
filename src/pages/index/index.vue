<template>
  <div class="container">
  </div>
</template>

<script>
/**
 * 天气主页
 */
import { geocoder } from '@/api/'
export default {
  data () {
    return {
      userInfo: {},
      address: '定位中', // 定位的地址
      province: '', // 定位的省份
      city: '北京', // 定位的城市
      county: '', // 定位的县
      lat: 39.98296, // 默认纬度
      lng: 116.30676 // 默认经度
    }
  },
  onLoad () {
    this.getLocation()
  },

  methods: {
    // 获取经纬度，获取成功后用腾讯地图api进行逆地址解析
    getLocation () {
      wx.getLocation({
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

      wx.showLoading({
        title: '定位中，请稍等',
        mask: true
      })

      try {
        const res = await geocoder(lat, lng)
        const { data: { result } } = res

        /* eslint-disable */

        // 地址描述跟位置描述
        let { address, formatted_addresses } = result
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
        this.address = address
        console.log('ok')
      } catch (e) {
        this.address = '北京市海淀区彩和坊路海淀西大街74号'
      }
    },

    getWeather () {
      wx.showLoading({
        title: '正在获取数据，请稍等...',
        mask: true
      })
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
