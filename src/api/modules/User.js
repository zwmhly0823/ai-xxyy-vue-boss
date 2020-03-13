/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: shentong
 * @LastEditTime: 2020-03-13 19:12:17
 */
import axios from '../axios'

export default {
  /**
   * 用户登录
   * */
  loginIn(params) {
    return axios.post('/data/admin/login/pass111', params)
  },
  orderList(params) {
    // return this.post(this.API_HOST + '/admin/login/pass/2', params)
    return axios.post('/data/orderList', params)
  }
}
