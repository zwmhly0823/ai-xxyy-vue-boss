/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-17 11:50:18
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-05-26 19:45:24
 */
import axios from './axios'
import { getToken } from '@/utils/auth'
// import { baseUrl } from '@/utils/index'
// 转json

axios.defaults.withCredentials = true

function strToJson(str) {
  // eslint-disable-next-line no-new-func
  var json = new Function('return ' + str)()
  return json
}
export default {
  // 判断是否需要token
  judgeToken() {
    const token = this.getHeaders().Authorization
    const needToken = location.href.indexOf('login') === -1

    if (needToken && !token) {
      // location.href = `${baseUrl}login/#/`
      location.href = `/login/#/`
      return 0
    }
    return 1
  },
  /**
   * get方法，对应get请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   */
  get(url, params) {
    if (this.judgeToken()) {
      return new Promise((resolve, reject) => {
        axios
          .get(url, {
            params: params,
            headers:
              params && params.headers ? params.headers : this.getHeaders()
          })
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  },
  /**
   * post方法，对应post请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   */
  post(url, params, extend = {}) {
    if (process.env.NODE_ENV === 'development') {
      if (url.match(/graphql/)) {
        const reg = /[\s][\w]+\(query:/
        const matchs = params.query.match(reg)
        if (matchs && matchs.length) {
          const tail = matchs[0].replace(/\s/, '').replace('(query:', '')
          url += `/${tail}`
        }
        const regParam = /\(query:[\w\W]+\)/
        const matchsParam = params.query.match(regParam)
        if (matchsParam && matchsParam.length) {
          const str = matchsParam[0]
            .replace(/"{/g, '{')
            .replace(/}"/g, '}')
            .replace('(', '{')
            .replace(')', '}')
            .replace(/\\/g, '')
          try {
            // console.log(strToJson(str))
            const visableData = strToJson(str)
            params = { ...params, data: visableData }
          } catch (error) {
            console.log(error)
          }
        }
      }
    }
    if (this.judgeToken()) {
      return new Promise((resolve, reject) => {
        const extendObj = {
          headers:
            params && params.headers ? params.headers : this.getHeaders(),
          ...extend
        }
        axios
          .post(url, params, {
            ...extendObj
          })
          .then((res) => {
            if (res.status === 500) {
              reject(res)
              return
            }
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  },
  /**
   * put方法，对应put请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   */
  put(url, params) {
    if (this.judgeToken()) {
      return new Promise((resolve, reject) => {
        axios
          .put(url, params, {
            headers: this.getHeaders()
          })
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  },
  getHeaders() {
    const token = getToken() || ''
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    }
    if (token) {
      headers.Authorization = token.includes('Bearer ')
        ? token
        : `Bearer ${token}`
    }
    return headers
  }
}
