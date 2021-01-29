/*
 * @Descripttion: 营销中心
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-07 16:39:06
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-22 17:11:48
 */
import axios from '../axiosConfig'

export default {
  // 获取白名单用户
  getMktWhites(params) {
    return axios.post('/api/o/h5/v1/order/getMktWhites', params)
  },
  // 添加白名单
  addMktWhite(params) {
    console.log(params)
    return axios.post(`/api/o/h5/v1/order/addMktWhite`, params)
  },
  // 删除白名单
  updateMktWhite(params) {
    return axios.post(`/api/o/h5/v1/order/updateMktWhite`, params)
  },
  /**
   * 兑换码
   */
  // 获取营销标签
  getMarketingLabelList() {
    return axios.get('/api/toss/v1/toss-api/label/getMarketingLabelInfo')
  },
  // 获取商品套餐列表
  getPackageList(params = {}, sort) {
    const sortObj = sort || { id: 'asc' }
    return axios.post('/graphql/v1/toss', {
      query: `{
        PackagesList(query: ${JSON.stringify(
          JSON.stringify(params)
        )}, sort: ${JSON.stringify(JSON.stringify(sortObj))}){
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
            expire
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
    const sortObj = sort ? JSON.stringify(JSON.stringify(sort)) : `""`
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
  },

  // 优惠券列表
  getCouponList(params) {
    const { page = 0, size = 20 } = params
    return axios.get(`/api/s/v1/coupon/getCouponInfo?page=${page}&size=${size}`)
  },

  // 优惠券基本信息、发放规则
  getCouponInfo(params) {
    return axios.get(
      `/api/s/v1/couponDispensed/getCouponDetailInfo?couponId=${params.couponId}`
    )
  },
  // 优惠券 期 下拉框
  getPeriodByStatus(status) {
    return axios.get(
      `/api/s/v1/management/user/getManagementListByStatus?status=${status}`
    )
  },
  // 新增、查看 优惠券发放规则，部门id和天数关联数据
  getDayTimeAndDeptId(params) {
    return axios.post(`/api/s/v1/couponDispensed/selectCouponDispensed`, params)
  },
  // 新增 优惠券发放规则， 保存按钮
  saveCouponRule(params) {
    return axios.post(`/api/s/v1/couponDispensed/createCouponDispensed`, params)
  },
  // 根据选择的 select期数，联动tree组件
  lookSendRule(params) {
    return axios.post(
      `/api/s/v1/couponDispensed/selectCouponDispensedDetails`,
      params
    )
  }
}
