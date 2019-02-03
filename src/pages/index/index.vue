<template>
  <div class="wrapper">
    <div class="bg"></div>
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
    <!-- 逐小时天气与七天天气预报 -->
    <div class="weather">
      <!-- 逐小时天气预报 -->
      <div class="forecast-hour-container">
        <scroll-view scroll-x>
          <div class="scroll-x">
            <div class="item" v-for="(item, idx) in hourly" :key="idx">
              <div class="time">{{ item.update_time }}</div>
              <w-icon :type="item.weather_code"></w-icon>
              <div class="tmp">{{ item.degree }}°C</div>
            </div>
          </div>
        </scroll-view>
      </div>
      <!-- 七天天气预报 -->
      <div class="forecast-week-container">
        <div class="week">
          <div class="week-weather">
            <div class="item" v-for="(item, index) in weekly" :key="index">
              <div class="day">{{ item.date }}</div>
              <div class="date">{{ item.time }}</div>
              <div class="daytime">
                <div class="weather-text">{{item.day_weather}}</div>
                <w-icon :type="item.day_weather_code"></w-icon>
              </div>
              <div class="night">
                <w-icon :type="item.night_weather_code"></w-icon>
                <div class="weather-text">{{item.night_weather}}</div>
              </div>
              <div class="wind">{{ item.day_wind_direction }}</div>
              <div class="wind">{{ item.night_wind_direction }}</div>
            </div>
          </div>
          <!-- 一周温度走势图 -->
          <div class="week-chart">
            <mpvue-echarts lazyload :echarts="echarts" :onInit="handleInit" ref="echarts"/>
          </div>
        </div>
      </div>
      <!-- 生活指数 -->
      <div class="life-style-container">
        <div class="life-style">
          <div class="item" v-for="(item, index) in lifestyle" :key="index">
            <div class="title">
              <w-icon :type="item.icon"></w-icon>
              <span style="margin-left: -25rpx;">{{item.name}}</span>
            </div>
            <div class="content">{{item.info}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./index.js">

</script>

<style lang="less">
@import url('./index.less');
</style>
