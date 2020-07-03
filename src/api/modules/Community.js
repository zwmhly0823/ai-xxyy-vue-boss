/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 18:42:38
 * @LastEditors: Shentong
 * @LastEditTime: 2020-07-03 17:22:55
 */
import axios from '../axiosConfig'

export default {
  /**
   * 查询模版信息
   *
   */
  getSopTemplate(params) {
    return axios.get(
      `/api/toss/v1/toss-api/soptemplate/getTemplate?templateId=${params.templateId}`
    )
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
