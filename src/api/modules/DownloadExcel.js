/*
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-05-14 14:31:42
 * @LastEditors: Shentong
 * @LastEditTime: 2020-07-07 21:46:31
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
    headers.Authorization = token.includes('Bearer ')
      ? token
      : 'Bearer ' + token
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
  /**
   * @description 招生排期上传excel
   */
  updateScheduleExcel(params) {
    if (judgeToken()) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: `/api/t/v1/enroll/import?courseType=${params.courseTypes}`,
          responseType: 'blob',
          headers: getHeaders(),
          data: params
        })
          .then((res) => {
            console.log('updateScheduleExcel-res', res)
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  },
  /**
   * 订单导出
   * @param {*} params 
   * {
      "apiName": "OrderPage",
      "header": {
        "id": "订单ID",
          "packages_name":"套餐名称",
          "team.team_name": "班级名称",
          "out_trade_no": "订单编号",
          "buytime":"下单时间",
          "order_status": "订单状态",
          "user.mobile_city":"城市",
          "user.mobile_province":"省份",
          "user.mobile":"用户手机号",
          "user.sex":"性别",
          "user.birthday":"生日",
          "channel.channel_outer_name":"订单来源",
          "express.last_express_status":"最后一次物流状态"
      },
      "fileName":"OrderPage",
      "query": "{\"status\":1}"
      }
   */
  exportOrder(params) {
    console.log(params)

    if (judgeToken()) {
      return axios({
        method: 'POST',
        url: '/graphql/export',
        responseType: 'blob',
        headers: getHeaders(),
        timeout: 300000,
        data: params
      })
    }
  }
}
