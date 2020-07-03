/*
 * @Descripttion: 退款申请提交表单
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-05-12 15:22:25
 * @LastEditors: liukun
 * @LastEditTime: 2020-07-03 15:53:38
 */

import axios from '../axiosConfig'
export default {
  // 获取支付渠道(assert→IMPORT终止)
  getPaymentPay(query = '') {
    console.warn('我来查支付渠道', query)
    return axios.post('/graphql/v1/toss', {
      query: `
        {
          PaymentPay(query: ${JSON.stringify(query)}
      ){
            oid
            trade_type
            status
            type
            packages_id
         }
        }
      `
    })
  },
  getBackStatus(query) {
    console.warn('我来查退款新规则', query)
    return axios.get('/api/o/v1/order/getOrderRefundStatus', query)
  },

  // 通过uid查询订单号
  getOrdersByUid(uid) {
    console.warn('我来查名下订单list')
    return axios.get(
      `/api/o/v1/order/getOrdersByStatus?userId=${uid}&status=COMPLETED&page=0`
    )
  },

  getPeriod(query = '') {
    console.warn('我来查系统课已上时长', query)
    return axios.get('/graphql/v1/toss', {
      query: `
        {
          StudentSystemCourse(query: ${JSON.stringify(query)}
      ){
      remaining_week
      reduce_week
         }
        }
      `
    })
  },
  // 获取单价
  getEveryPrice(params) {
    console.warn('我来取单价')
    return axios.post(`/api/o/v1/order/getOrderPrice?orderId=${params}`)
  },

  // 获取剩余金额
  getResidueFee({ orderId }) {
    console.warn('获取剩余金额')
    return axios.get(`/api/o/v1/order/getRemainingAmount?orderId=${orderId}`)
    // return new Promise((resolve, reject) => {
    //   resolve({ code: 0, data: { bala: 54188 } })
    // })
  },
  // 获取优惠券list
  getCoupon(params) {
    console.warn('获取优惠券list')
    return axios.get('/api/s/v1/coupon/getUserCouponByPackageId', params)
  },
  // 提交表单
  submito(params) {
    return axios.post('/api/b/v1/backend/refund/detail/add', params)
  },
  // 退款详情信息
  // /api/b/v1/backend/refund/detail/get?flowApprovalId=2
  getFlowDetail(params) {
    return axios.get(
      `/api/b/v1/backend/refund/detail/get?flowApprovalId=${params}`
    )
  },
  // 获取系统课全年/半年
  // SYSTEM_COURSE_YEAR 年课
  // SYSTEM_COURSE_HALFYEAR 半年课

  getPackages(packagesId) {
    console.warn('获取系统课全年/半年')
    return axios.get(`/api/p/v1/product/getPackages?packagesId=${packagesId}`)
  },
  // 获取第三方渠道来源
  // channelOuterName
  getChannel(payChannel) {
    console.warn('获取第三方渠道来源')
    return axios.get(`/api/c/v1/channel/getChannelById?id=${payChannel}`)
  }
}
