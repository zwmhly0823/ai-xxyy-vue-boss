/*
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-05-14 14:31:42
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-20 18:09:08
 */
import axios from '../axios'
import { getToken } from '@/utils/auth'
// const Qs = require('qs')

const getHeaders = () => {
  const token = getToken() || ''
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  }
  if (token) {
    headers.Authorization = 'Bearer ' + token
  }
  return headers
}
const judgeToken = () => {
  const token = getHeaders().Authorization
  const needToken = location.href.indexOf('login') === -1

  if (needToken && !token) {
    // location.href = `${baseUrl}login/#/`
    location.href = `/login/#/`
    return 0
  }
  return 1
}
export default {
  // 物流页面导出物流Excle文件
  exportExpress(params) {
    if (judgeToken()) {
      return axios({
        method: 'POST',
        url: '/data/search/m1/v1/search/common/export',
        responseType: 'blob',
        headers: getHeaders(),
        params
      })
    }
  },
  exportChannel(params) {
    console.log('DownloadExcel:', params)

    if (judgeToken()) {
      return axios({
        method: 'POST',
        url: '/api/b/v1/import/importCompletedOrder',
        responseType: 'blob',
        headers: getHeaders(),
        // data: {
        //   ...params
        // }
        data: params
      })
    }
  },
  exportChannelss(params) {
    console.log('DownloadExcel:', params)

    if (judgeToken()) {
      return axios({
        method: 'POST',
        url: '/api/o/v1/order/exportPayment',
        responseType: 'blob',
        headers: getHeaders(),
        data: {
          ...params
        }
        // data: params
      })
    }
  }
}
