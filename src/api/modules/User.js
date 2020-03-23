/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-23 16:25:07
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
  },
  updateTeamStudent(params) {
    // return this.post(this.API_HOST + '/admin/login/pass/2', params)
    return axios.put(
      '/api/tm/v1/teacher/manager/team/updateTeamStudent',
      params
    )
    // return axios.put('/api/v1/teacher/manager/team/updateTeamStudent', params)
  }
}
