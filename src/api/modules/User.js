/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-07 14:51:44
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
  sendBatch(mobiles, type, params) {
    return axios.post(
      `/api/m/v1/sms/sendBatch?mobiles=${mobiles}&type=${type}&params=${params}`
    )
  }
}
