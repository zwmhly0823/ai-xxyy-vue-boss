/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: shentong
 * @LastEditTime: 2020-03-13 18:59:59
 */

import axios from './axios'
import Qs from 'qs'

import User from './modules/User' // 用户接口
import Order from './modules/Order' // 订单接口

export default Object.assign(
  {},
  { Order },
  { User },
  {
    /**
     * get方法，对应get请求
     * @param {String} url [请求的url地址]
     * @param {Object} params [请求时携带的参数]
     */
    get(url, ...params) {
      return new Promise((resolve, reject) => {
        axios
          .get(url, {
            params: params,
            headers: this.getHeaders()
          })
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            reject(err.data)
          })
      })
    },
    post(url, ...params) {
      return new Promise((resolve, reject) => {
        axios
          .post(url, Qs.stringify(...params), {
            headers: { token: this.getHeaders().token }
          })
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            reject(err.data)
          })
      })
    },
    /**
     * post方法，对应post请求
     * @param {String} url [请求的url地址]
     * @param {Object} params [请求时携带的参数]
     */
    getHeaders() {
      // const token = Utils.getCookie('token')
      const headers = {
        'Content-Type': 'application/json;charset=UTF-8'
      }

      // if (token) {
      //   headers.token = token
      // } else {
      //   window._Vue.$router.push({ path: '/login' })
      // }
      return headers
    }
  }
)
