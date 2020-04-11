/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-09 19:19:17
 */
// import axios from '../axios'
import axios from '../axiosConfig'

export default {
  /**
   * 用户登录
   * */
  loginIn(params) {
    return axios.post('/data/admin/login/pass111', params)
  },
  orderList(params) {
    return axios.post('/data/orderList', params)
  },
  updateTeamStudent(params) {
    return axios.put(
      '/api/tm/v1/teacher/manager/team/updateTeamStudent',
      params
    )
  },
  sendMsgForTeacher(orderId) {
    return axios.get(`/api/o/v1/order/sendMsgForTeacher?orderIds=${orderId}`)
  }
}
