# lite weather

![qrcode](./QRCode.png)

lite weather是个人开发的一款简单的天气小程序，项目基于mpvue官方脚手架开发，使用flyio做http请求处理、echarts做图表，对接[和风天气](https://www.heweather.com/documents/api/)、[腾讯位置服务 WebServiceAPI](https://lbs.qq.com/webservice_v1/index.html)、QQ天气 api(和风天气与腾讯位置服务均需要注册获取key才能使用，出于本项目都是用个人注册的免费api,有请求次数限制就不在github上公开个人的key)，项目参考[《微信小程序开发入门：从 0 到 1 实现天气小程序》](https://juejin.im/book/5b70f101e51d456669381803/)

小程序目前版本为0.0.1。

- [x] 获取当前位置
- [x] 获取当前位置对应的天气
- [x] 今明两日天气
- [x] 逐小时天气预测
- [x] 八天天气预报图表
- [x] 生活指数
- [ ] 选择位置
- [ ] 根据天气自动切换壁纸
- [ ] 自定义壁纸
- [ ] 心情签到