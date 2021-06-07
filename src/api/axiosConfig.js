/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-17 11:50:18
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-13 22:04:02
 */
import axios from './axios'
import { getToken } from '@/utils/auth'
import { baseUrl, getAppSubject } from '@/utils/index'
import defaultSetting  from '../settings';
// 转json

axios.defaults.withCredentials = true

const getPlateformByUa = () => {
  const ua = window.navigator.userAgent;
  const reg = /\((.*?)\)/;
  const result = ua.match(reg);
  return result[1];
}

const platform = getPlateformByUa();

function strToJson(str) {
  // eslint-disable-next-line no-new-func
  var json = new Function('return ' + str)()
  return json
}
export default {
  // 判断是否需要token
  judgeToken() {
    const token = this.getHeaders().Authorization
    const { href = '' } = location || {}

    const needToken =
      href.indexOf('login') === -1 && href.lastIndexOf('?from=1v1') === -1

    if (needToken && !token) {
      location.href = `${baseUrl()}login/#/`
      // location.href = `/login/#/`
      return 0
    }
    return 1
  },
  /**
   * get方法，对应get请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   */
  get(url, params, extend = {}) {
    if (this.judgeToken()) {
      const headers =
        params && params.headers ? params.headers : this.getHeaders()
      if (extend?.responseType === 'blob') {
        headers.responseType = 'blob'
      }
      return new Promise((resolve, reject) => {
        axios
          .get(url, {
            params: params,
            headers: headers
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
          url
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
            const visableData = strToJson(str)
            params = { ...params, data: visableData }
          } catch (error) {
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
  form(url, params, extend = {}) {
    if (process.env.NODE_ENV === 'development') {
      if (url.match(/graphql/)) {
        const reg = /[\s][\w]+\(query:/
        const matchs = params.query.match(reg)
        if (matchs && matchs.length) {
          const tail = matchs[0].replace(/\s/, '').replace('(query:', '')
          url
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
            const visableData = strToJson(str)
            params = { ...params, data: visableData }
          } catch (error) {
          }
        }
      }
    }
    if (this.judgeToken()) {
      return new Promise((resolve, reject) => {
        const extendObj = {
          headers:
            params && params.headers ? params.headers : this.getHeadersForm(),
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
    // 科目
    const subject = getAppSubject()
    // 增加操作人ID
    const staff = JSON.parse(localStorage.getItem('staff') || '{}')
    const operatorId = (staff && staff.id) || ''
    const token = getToken() || ''
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      operatorId,
      subject,
      'version': defaultSetting.version,
      'os-type': platform,
      Authorization: getToken(),
    }
    if (token) {
      headers.Authorization = token.includes('Bearer ')
        ? token
        : `Bearer ${token}`
    }
    return headers
  },
  getHeadersForm() {
    // 科目
    const subject = getAppSubject()
    // 增加操作人ID
    const staff = JSON.parse(localStorage.getItem('staff') || '{}')
    const operatorId = (staff && staff.id) || ''
    const token = getToken() || ''
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      operatorId,
      subject,
      'version': defaultSetting.version,
      'os-type': platform,
      Authorization: getToken(),
    }
    if (token) {
      headers.Authorization = token.includes('Bearer ')
        ? token
        : `Bearer ${token}`
    }
    return headers
  }
}
