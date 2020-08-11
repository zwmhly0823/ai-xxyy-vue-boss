/*
 * @Descripttion: 营销中心
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-07 16:39:06
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-11 18:59:22
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
            converted_num
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
  },

  // 根据ID获取一条兑换码详情
  getRedeemCodeDetail(params = {}) {
    if (!params && !params?.id) return
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        ExchangeCodeConfig(query:${JSON.stringify(JSON.stringify(params))}){
          id
          title
          num
          package_id
          channel_id
          customer_sign_id
          start_date
          end_date
          status
          code
          ctime
          packageInfo{
            name
            type
          }
        }
      }`
    })
  },

  // 获取兑换码用户兑换记录
  getRedeemCodeLog(params = {}, page = 1, sort = {}) {
    const query =
      !params || Object.keys(params).length === 0
        ? `""`
        : JSON.stringify(JSON.stringify(params))
    const sortObj = sort
      ? JSON.stringify(
          JSON.stringify(
            Object.assign(sort, { status: 'desc', use_date: 'desc' })
          )
        )
      : `""`
    return axios.post('/graphql/v1/toss', {
      query: `{
        ExchangeCodeLogPage(query:${query}, page: ${page}, sort: ${sortObj}){
          totalElements
          totalPages
          number
          content{
            id
            code
            config_id
            del
            use_date
            status
            user_id
            teacher_id
            team_id
            card_no
            order_no
            converted_date
            teacherInfo{
              realname
              department_name
              area_name
              group_name
            }
            teamInfo{
              team_name
              team_type
            }
            userInfo{
              username
              mobile
            }
          }
        }
      }`
    })
  }
}
