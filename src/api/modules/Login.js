/*
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 19:46:39
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-17 14:54:06
 */
import axios from '../axiosConfig'

export default {
  /**
   * 根据手机号获取code
   *
   */
  getCodeByPhone(params) {
    return axios.post(`/api/t/v1/teacher/sendCode?mobile=${params.mobile}`)
  },
  /**
   * 验证码登录
   * */
  codeLoginIn(params) {
    return axios.post(`/api/t/v1/teacher/login`, params)
  },
  /**
   * 密码登录
   * */
  pwdLoginIn(params) {
    return axios.post('/api/t/v1/teacher/teacherLogin', params)
  }
}
