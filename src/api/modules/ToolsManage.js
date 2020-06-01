/*
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-06-01 11:10:15
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-01 15:55:02
 */

import axios from '../axiosConfig'

export default {
  // 系统标签 标签分类
  findClassifyList() {
    return axios.get(`/api/toss/v1/toss-api/label/findClassifyList`)
  },
  // 系统标签 表格接口
  findLabelByPage(params) {
    return axios.get(`/api/toss/v1/toss-api/label/findLabelByPage`)
  }
}
