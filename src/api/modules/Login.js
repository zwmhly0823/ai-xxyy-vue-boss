/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-16 19:46:39
 * @LastEditors: Shentong
 * @LastEditTime: 2020-03-17 18:49:23
 */
import axios from '../axiosConfig'

export default {
  /**
   * 根据手机号获取code
   *
   */
  getCodeByPhone(params) {
    return axios.post(`/api/b/v1/staff/sendCode?mobile=${params.mobile}`)
  },
  /**
   * 验证码登录
   * */
  codeLoginIn(params) {
    return axios.post(`/api/b/v1/staff/mobileLogin`, params)
  },
  /**
   * 密码登录
   * */
  pwdLoginIn(params) {
    return axios.post('/api/b/v1/staff/login', params)
  }
}
