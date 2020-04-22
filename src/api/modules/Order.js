/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 16:20:48
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-07 13:54:19
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
