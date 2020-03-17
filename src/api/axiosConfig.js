/*
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-17 11:50:18
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-17 18:31:36
 */
import axios from './axios'
import { getToken } from '@/utils/auth'

export default {
  // 判断是否需要token
  judgeToken() {
    const token = this.getHeaders().token
    const needToken = location.href.indexOf('login') === -1

    if (needToken && !token) {
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
  get(url, ...params) {
    this.judgeToken()

    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params,
          headers: this.getHeaders()
        })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  /**
   * post方法，对应post请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   */
  post(url, ...params) {
    this.judgeToken()

    return new Promise((resolve, reject) => {
      axios
        .post(url, ...params, {
          headers: { Authorization: this.getHeaders().token }
        })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getHeaders() {
    const token = getToken()
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    }
    if (token) {
      headers.token = token
    }
    return headers
  }
}
