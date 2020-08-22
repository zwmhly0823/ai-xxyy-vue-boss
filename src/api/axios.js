/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-22 17:33:23
 */
import axios from 'axios'
import _ from 'lodash'
import { removeToken } from '@/utils/auth'
import { getAppSubject } from '@/utils/index'

const appSubject = getAppSubject()

// 测试环境配置
// const isTest = process.env.BASE_URL === 'ghpagestest'
// const isTest = location.href.indexOf('test.')
// axios.defaults.baseURL = isTest ? 'http://47.98.38.59:43401' : ''
// 请求超时时间
axios.defaults.timeout = 240000

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'

axios.interceptors.request.use(
  (config) => {
    // 非graphql服务接口，统一回科目类型
    const { url, method } = config
    if (url.includes('/api/') && !url.includes('graphql')) {
      if (method.toLowerCase() === 'get') {
        config.url += !url.includes('?')
          ? `?appSubject=${appSubject}`
          : `&appSubject=${appSubject}`
      }
    }
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
      if (_.isPlainObject(_data) && _data.code) {
        switch (_data.code) {
          case '0':
            _data = null
            break
          case '2':
          default:
            window._Vue.$message.error(_data.errors || '服务器异常')
            break
        }
      }
    }
    return _data
  },
  (err) => {
    console.log('axios err', err)
    switch (err.response.status) {
      case 400:
        // Utils.removeCookie('token')
        window._Vue.$message.error('参数错误')
        break
      case 401: {
        // 有登录状态的token, 但已离职的老师会提示
        if (document.getElementsByClassName('el-message').length === 0) {
          window._Vue.$message.error('没有权限，禁止登录')
        }
        // 退出登录
        setTimeout(() => {
          removeToken()
          location.href = `/login/#/`
        }, 1000)
        break
      }
      case 404: {
        window._Vue.$message.error('接口不存在')
        break
      }
      case 420: {
        window._Vue.$message.error('无权限执行')
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
