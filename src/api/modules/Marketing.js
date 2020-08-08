/*
 * @Descripttion: 营销中心
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-07 16:39:06
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-08 15:45:34
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
  },

  // 获取兑换码列表
  getRedeemCodeList(query = {}, page = 1, sort = {}) {
    const params = Object.assign({}, query || {}, { del: 0 })
    return axios.post('/graphql/v1/toss', {
      query: `{
        ExchangeCodeConfigPage(query:${JSON.stringify(
          JSON.stringify(params)
        )}, page: ${page}, sort: ${JSON.stringify(JSON.stringify(sort))}){
          totalElements
          totalPages
          number
          content{
            id
            title
            num
            package_id
            package_name
            channel_id
            channel_name
            customer_sign_id
            customer_sign_name
            start_date
            end_date
            status
            code
            ctime
            channelInfo{
              channel_outer_name
            }
            packageInfo{
              name
            }
            customerSignInfo{
              name
            }
          }
        }
      }`
    })
  },

  // 更改兑换码状态 （把兑换码设为失效）
  handleSetRedeemCodeStatus(id) {
    if (!id) return
    return axios.post(`/api/s/v1/exchange/code/updateConfigStatus?id=${id}`)
  },

  // 删除兑换码
  handleDeleteRedeemCode(id) {
    if (!id) return
    return axios.post(`/api/s/v1/exchange/code/deleteConfig?id=${id}`)
  }
}
