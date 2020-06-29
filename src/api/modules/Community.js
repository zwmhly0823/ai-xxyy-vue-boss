/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 18:42:38
 * @LastEditors: Shentong
 * @LastEditTime: 2020-06-29 18:42:54
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
