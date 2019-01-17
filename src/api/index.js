import promise from 'es6-promise'
// 配置文件，包括各种key
import { QQ_MAP_KEY } from'../config/index'
// 腾讯地图sdk
import qqmapWx from '../utils/qqmap-wx-jssdk'
// 请求库
import Fly from 'flyio/dist/npm/wx'

const fly = new Fly();

//初始化腾讯地图
const qqmapsdk = new qqmapWx({
  key: QQ_MAP_KEY
});
