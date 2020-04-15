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
   * 获取订单列表 v1
   * */
  orderPage(params) {
    return axios.post('/graphlql/v1/toss', {
      query: `{}`
    })
  }
}
