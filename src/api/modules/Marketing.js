/*
 * @Descripttion: 营销中心
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-07 16:39:06
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-07 20:02:13
 */
import axios from '../axiosConfig'

export default {
  /**
   * 兑换码
   */

  // 获取营销标签
  getMarketingLabelList() {
    return axios.get('/api/toss/v1/toss-api/label/getMarketingLabelInfo')
  },

  // 获取商品套餐列表
  getPackageList(params = {}) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        PackagesList(query: ${JSON.stringify(JSON.stringify(params))}){
          id
          name
          price
          course_week
        }
      }`
    })
  },

  // 创建兑换码
  addRedeemCode(data) {
    if (!data) return
    return axios.post('/api/s/v1/exchange/code/save/config', data)
  }
}
