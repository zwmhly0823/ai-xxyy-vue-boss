/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 16:20:48
 * @LastEditors: shentong
 * @LastEditTime: 2020-03-13 19:40:26
 */
import axios from '../axios'

export default {
  /**
   * 订单列表
   * */
  loginIn(params) {
    return axios.post('/api/admin/login/pass222', params)
  },
  orderList(params) {
    // return this.post(this.API_HOST + '/admin/login/pass/2', params)
    return axios.post('/data/orderList', params)
  }
}
