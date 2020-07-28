/*
 * @Descripttion: 常用基础数据接口
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-07-18 15:45:45
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-18 18:40:22
 */

import axios from '../axiosConfig'

export default {
  // 获取省市区三级地址
  getCenterAddressList(code = '') {
    return axios.get(`/api/ex/v1/express/getCenterAddressList?code=${code}`)
  },
  // 获取第四级地址， code 为第三级code
  getCenterAddressTownList(code) {
    return axios.get(`/api/ex/v1/express/getCenterAddressTownList?code=${code}`)
  }
}
