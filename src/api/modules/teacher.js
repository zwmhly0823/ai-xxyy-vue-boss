/*
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-04-07 13:52:26
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-07 13:59:18
 */
import axios from '../axiosConfig'

export default {
  /**
   * 订单列表
   * */
  getDepartmentTree(id) {
    return axios.get(`/api/t/v1/department/getDepartmentTree?Id=${id}`)
  }
}
