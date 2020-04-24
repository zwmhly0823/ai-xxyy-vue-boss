/*
 * @Descripttion: 统计模块
 * @version:
 * @Author: Shentong
 * @Date: 2020-04-07 13:52:26
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-24 17:42:23
 */
import axios from '../axiosConfig'

export default {
  /**
   * 统计模块
   * */
  getCodeByPhone(params) {
    return axios.post(`/api/t/v1/teacher/sendCode?mobile=${params.mobile}`)
  }
}
