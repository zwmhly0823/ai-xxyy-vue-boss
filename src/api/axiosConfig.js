/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-17 11:50:18
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-03 19:22:25
 */
import axios from './axios'
import { getToken } from '@/utils/auth'
// import { baseUrl } from '@/utils/index'

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
  /**
   * post方法，对应post请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   */
  post(url, params) {
    if (this.judgeToken()) {
      return new Promise((resolve, reject) => {
        axios
          .post(url, params, {
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
  /**
   * put方法，对应put请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   */
  put(url, params) {
    if (this.judgeToken()) {
      return new Promise((resolve, reject) => {
        axios
          .post(url, params, {
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
    const token = getToken() || 'authorization-bear'
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    }
    if (token) {
      headers.Authorization = token
    }
    return headers
  }
}
