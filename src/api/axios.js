/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: shentong
 * @LastEditTime: 2020-03-13 18:00:57
 */
import axios from 'axios'
// import _ from 'lodash'

// axios.defaults.baseURL = ''
// 请求超时时间
axios.defaults.timeout = 20000

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'

axios.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    let _data = null
    if (response.status === 200) {
      _data = response.data
      /**
      if (_.isPlainObject(_data) && _data.code) {
        switch (_data.code) {
          case '0':
            window._Vue.$message.error(_data.errMsg)
            _data = null
            break
          case '2':
          default:
            window._Vue.$message.error('服务器异常')
            break
        }
      }
       */
    }
    return _data
  },
  (err) => {
    switch (err.response.status) {
      case 400:
        // Utils.removeCookie('token')
        break
      case 401: {
        break
      }
      case 404: {
        window._Vue.$message.error('接口不存在')
        break
      }
      case 500:
      default:
        window._Vue.$message.error('服务器异常')
        break
    }
    return err.response
  }
)

export default axios
