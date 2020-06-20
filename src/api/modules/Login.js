/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-16 19:46:39
 * @LastEditors: songyanan
 * @LastEditTime: 2020-06-16 14:16:20
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
  },
  /**
   * 修改密码
   * */
  resetPwd(staffId, pwd) {
    return axios.put(`/api/b/v1/staff/resetPwd?staffId=${staffId}&pwd=${pwd}`)
  }
}
