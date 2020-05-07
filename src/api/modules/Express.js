/*
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-31 22:54:28
 * @LastEditors: Lukun
 * @LastEditTime: 2020-05-04 17:32:30
 */
// import axios from '../axios'
import axios from '../axiosConfig'

export default {
  /**
   * 物流列表
   * */
  ExpressList(params) {
    // return this.post(this.API_HOST + '/admin/login/pass/2', params)
    return axios.get(
      `/api/o/v1/express/getExpressDetailForAPP?expressNo=${params.expressNo}`
    )
  },
  /**
   * 添加物流收货人信息
   * @param {*} param0
   */
  editAddressAndExpressForOrder(params) {
    return axios.get('/api/o/v1/express/editAddressAndExpressForOrder', params)
  },
  /**
   * 催发地址短信
   * @param {*} param0
   */
  pushMsgByOrderId(orderId) {
    return axios.get(`/api/o/v1/order/pushMsgByOrderId?orderId=${orderId}`)
  },
  /**
   * 物流失效功能
   * @param {*} param0
   */
  makeFailed(val, value, staffId) {
    return axios.post(
      `/api/o/v1/express/updateExpressToInvalid?expressIds=${val}&expressRemark=${value}&operatorId=${staffId}`
    )
  },
  checkPass(params) {
    return axios.post(`/api/o/v1/express/deliveryRequest`, params)
  },

  getExpressDetailJDForAPP(params) {
    return axios.get(
      `/api/o/v1/express/ getExpressDetailJDForAPP?expressNo=${params}`
    )
  }
  /**
   * v1 订单关联的物流
   */
  //   getOderExpress(query = '', page = 1) {
  //     return axios.post('/graphql/v1/toss', {
  //       query: `
  //         {
  //           ExpressPage(query: ${JSON.stringify(query)}, page: ${page}){
  //             totalElements
  //             content{
  //               id
  //               express_status
  //               order_id
  //             }
  //           }
  //         }
  //       `
  //     })
  //   }
}
