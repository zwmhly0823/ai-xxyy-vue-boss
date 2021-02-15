/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-22 20:01:24
 * @LastEditors: liukun
 * @LastEditTime: 2020-09-18 21:39:14
 */

import axios from '../axiosConfig'

export default {
  // 通过订单查当前开课日期
  getCurrentClassDate(query) {
    return axios.get(
      `/api/ts/v1/teaching/findSystemCourseManagementByOrderNo?orderNo=${query.orderNo}`
    )
  },
  // 调期获取调整开课日期列表
  getAdjustStartClassDateList(query) {
    return axios.get(
      `/api/s/v1/management/getManagementBeforeOrNext?period=${query.stage}&type=SYSTEMCOURSE`
    )
  },
  // 调期获取班级列表
  getChooseClassList(query) {
    return axios.get(
      `/api/ts/v1/teaching/student/team/get/by/sup/term/type?teamType=YEAR&term=${query.stage}&sup=${query.sup}`
    )
  },
  // 调期获取已上课周期
  getDonePeriodicClass(query) {
    return axios.get(
      `/api/ts/v1/teaching/student/system/getTeamInfoByOrderNo?orderNo=${query.orderNo}`
    )
  },
  // 调期调级调班
  adjustApply(data) {
    return axios.post(`/api/b/v1/backend/apply/adjustment/flow`, data)
  },
  // 获取调期、调级、调班审批详情
  getAdjustDetail(flowApprovalId) {
    return axios.get(
      `/api/b/v1/backend/adjustment/flow/info?flowApprovalId=${flowApprovalId}`
    )
  },
  isAggrePass(params) {
    return axios.post(
      `/api/b/v1/backend/completed/reissue/flow?flowApprovalId=${params.flowApprovalId}&staffName=${params.staffName}&staffId=${params.staffId}&isConfirm=${params.isConfirm}&approvalRemark=${params.approvalRemark}`
    )
  },
  // 获取当前物流信息
  getExpressByOrderId(query) {
    return axios.get(
      `/api/ex/v1/express/getExpressByOrderId?orderId=${query.orderId}`
    )
  },
  // 通过当前物流信息获取商品信息
  getCourseMaterialsMoreThanLevel(query) {
    return axios.get(
      `/api/p/v1/product/getCourseMaterialsMoreThanLevel?courseDifficulty=${query.sup}&courseLevel=${query.level}`
    )
  },
  // 申请随材打包
  packageboxFlow(query) {
    return axios.post(
      `/api/b/v1/backend/v1/backend/apply/packagebox/flow`,
      query
    )
  },
  // 随材打包审批详情
  getPackageInfo(id) {
    return axios.get(
      `/api/b/v1/backend/v1/backend/packagebox/flow/info?flowApprovalId=${id}`
    )
  },
  getProductByTypes() {
    return axios.get(
      `/api/p/v1/product/getProductByTypes?types=ACTUAL_GOODS,VIRTUAL_GOODS`
    )
  },
  // 退款审批获取挽留单子的flow tags
  getTagsFangTao() {
    return axios.get(`/api/toss/v1/toss-api/label/getMarketingLabelInfo`, {
      type: 1
    })
  },
  // 校验退款的时候是否有审核中的关单赠品数据审批信息：
  // orderId
  findOrderGiftApprovalStatus(query) {
    return axios.post(`/api/b/v1/backend/refund/system/findOrderGiftApprovalStatus`, query)
  },
  // 查询赠品相关的信息（金额、产品列表等信息）
  // orderId
  findOrderGiftInfo(query) {
    return axios.post(`/api/b/v1/backend/refund/system/findOrderGiftInfo`, query)
  }
}
