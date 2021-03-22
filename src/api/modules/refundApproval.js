/*
 * @Descripttion: 退款申请提交表单
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-05-12 15:22:25
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-17 14:42:47
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

  // 通过uid查询订单list
  getOrdersByUid(uid) {
    console.warn('我来查名下订单list')
    return axios.get(
      `/api/o/v1/order/getOrderByRegtypesAndStatus?userId=${uid}&status=COMPLETED&regtypes=DEFAULT,EXPERIENCE,FIRST_ORDER,RENEW,TICKET500`
    )
  },

  // getPeriod(query = '') {
  //   console.warn('我来查系统课已上时长', query)
  //   return axios.get('/graphql/v1/toss', {
  //     query: `
  //       {
  //         StudentSystemCourse(query: ${JSON.stringify(query)}
  //     ){
  //     remaining_week
  //     reduce_week
  //        }
  //       }
  //     `
  //   })
  // },
  getPeriod(query) {
    console.warn('我来查系统课已上时长', query)
    return axios.get(
      '/api/b/v1/backend/refund/system/findSystemReduceWeek',
      query
    )
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
  // 优惠券订单检测
  checkCouponOrderStatus({ orderId }) {
    console.warn('获取剩余金额')
    return axios.get(`/api/o/v1/order/checkCouponOrderStatus?orderId=${orderId}`)
    // return new Promise((resolve, reject) => {
    //   resolve({ code: 0, data: { bala: 54188 } })
    // })
  },
  // 获取优惠券list
  getCoupon(params) {
    console.warn('获取优惠券list')
    return axios.get('/api/s/v1/coupon/package/getCoupon', params)
    // return axios.get('/api/s/v1/coupon/getUserCouponByPackageId', params)
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
  getFlowDetailNodeTable(params) {
    return axios.get(
      `/api/b/v1/backend/flowApprovalLinkedRelation/findLinkedListByFlowApprovalIdForBoss?flowApprovalId=${params}`
    )
  },

  // 获取系统课全年/半年
  // SYSTEM_COURSE_YEAR 年课
  // SYSTEM_COURSE_HALFYEAR 半年课

  // getPackages(packagesId) {
  //   console.warn('获取系统课全年/半年')
  //   return axios.get(`/api/p/v1/product/getPackages?packagesId=${packagesId}`)
  // },
  // 获取第三方渠道来源
  // channelOuterName
  getChannel(payChannel) {
    console.warn('获取第三方渠道来源')
    return axios.get(`/api/c/v1/channel/getChannelById?id=${payChannel}`)
  },
  // 为了学员详情跳转来的审核页面，自动填入手机号-获取uid
  getUid_lk(query) {
    return axios.post('/graphql/user', {
      query: `{
              blurrySearch(query: ${JSON.stringify(JSON.stringify(query))}) {
                  id
                  mobile
                  wechat_nikename
                  last_team_id
                }
            }
          `
    })
  },
  // start-体验课调级申请
  assertLevel(orderId) {
    // 判断能否调级
    return axios.post(
      `/api/ts/v1/teaching/student/trial/isOpen/orderId?orderNo=${orderId}`
    )
  },
  showExpressStatus(orderId) {
    // 物流状态查询
    return axios.get('/api/ex/v1/express/getExperienceExpressListByOrderId', {
      orderId
    })
  },
  submitoTrial(params) {
    // 提交表单
    return axios.post(
      '/api/b/v1/backend/trial/apply/adjustment/sup/flow',
      params
    )
  },
  getAllData(flowApprovalId) {
    // 右抽屉详情数据
    return axios.get('/api/b/v1/backend/trial/adjustment/sup/flow/info', {
      flowApprovalId
    })
  },
  getClassList(orderNo, sup) {
    // 可选班级列表
    return axios.post(
      `/api/ts/v1/teaching/student/trial/teamList?orderNo=${orderNo}&sup=${sup}`
    )
  },
  comfirmEnd(params) {
    // 审批调级通过拒绝
    return axios.post(
      `/api/b/v1/backend/completed/reissue/flow?staffName=${
        params.staffName
      }&staffId=${params.staffId}&flowApprovalId=${
        params.flowApprovalId
      }&approvalRemark=${params.approvalRemark}&isConfirm=${params.isConfirm}${
        'targetClassId' in params
          ? '&targetClassId=' + params.targetClassId
          : ''
      }${
        'targetClassName' in params
          ? '&targetClassName=' + params.targetClassName
          : ''
      }`
    )
  }
}
