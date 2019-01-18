import Fly from 'flyio/dist/npm/wx'
const fly = new Fly()

fly.interceptors.request.use((req) => {
  req.timeout = 10000
  return req
})

fly.interceptors.response.use((res) => {
  wx.hideLoading()
  return res
}, (err) => {
  console.log(err)
  wx.hideLoading()
  if (err.status === 0) {
    return '网络连接异常'
  } else if (err.status === 1) {
    return '网络连接超时'
  } else if (err.status === 401) {
    return '用户未登录'
  } else {
    if (err.response.data.message) {
      return err.response.data.message
    } else {
      return '请求数据失败,请稍后再试'
    }
  }
})

export default fly
