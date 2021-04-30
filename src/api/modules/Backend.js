/*
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-05-10 16:17:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-24 17:02:48
 */
import axios from '../axiosConfig'
export default {
  /**
  * /v1/backend/approval/staffIds/get
  * 获取退款审批权限id
  */
  getStaffIds() {
    return axios.post('/api/b/v1/backend/approval/staffIds/get?redisKey=approval:uncreditedApprovalIds', {})
  },
  /**
   * /v1/backend/apply/reissue/flow
   * 申请补发货接口
   */
  applyReplenish(params) {
    return axios.post('/api/b/v1/backend/apply/reissue/flow', params)
  },
  checkListPending(params) {
    return axios.get('/api/b/v1/backend/flow/list', params)
  },
  /**
   * 获取补发货流程详情 /v1/backend/reissue/flow/info
   *
   */
  getReplenishDetail(params) {
    return axios.get(
      `/api/b/v1/backend/reissue/flow/info?flowApprovalId=${params}`
    )
  },
  /**
   * 获取无归属订单审批详情
   */
  getNoAttributionDetail(params) {
    return axios.get(
      `/api/b/v1/backend/uncredited/detail/get?flowApprovalId=${params}`
    )
  },
  /**
   * /v1/backend/revocation/flow  补发货撤销 ?flowApprovalId=${params.flowApprovalId}&staffName=${params.staffName}&staffId=${params.staffId}
   */
  getReplenishReset(params) {
    return axios.post(
      `/api/b/v1/backend/revocation/flow?flowApprovalId=${params.flowApprovalId}&staffName=${params.staffName}&staffId=${params.staffId}`
    )
  },
  /**
   * /v1/backend/completed/reissue/flow  补发货同意接口
   */
  isAggrePass(params) {
    return axios.post(
      `/api/b/v1/backend/completed/reissue/flow?flowApprovalId=${params.flowApprovalId
      }&staffName=${params.staffName}&staffId=${params.staffId}&version=${params.version
      }&isConfirm=${params.isConfirm}&approvalRemark=${params.approvalRemark}&${'isRecover' in params ? 'isRecover=' + params.isRecover : ''
      }`
    )
  },
  // 校验关单赠品权限的
  isPromotions() {
    return axios.get(
      `/api/b/v1/backend/promotions/checkpriviles`
    )
  },
  // 财务驳回的重新提交
  rejectedUpdate(params) {
    return axios.post(`/api/b/v1/backend/refund/detail/update`, params)
  },
  changeCash(params) {
    return axios.post(`/api/b/v1/backend/refund/detail/updateRefundFee`, params)
  },
  // 赠品详情
  getGiftDetail(params) {
    return axios.get(
      `/api/b/v1/backend/promotions/detail/get?flowApprovalId=${params}`
    )
  },
  changeCount(params) {
    return axios.post(`/api/b/v1/backend/update/reissue/productdetails`, params)
  },
  // 赠品批量审批
  batchApproval(params) {
    return axios.post(`/api/b/v1/backend/completed/batch/flow`, params)
  },
  // 临时解决方案-显示申请人部门
  changeDepart(params) {
    console.warn('临时解决方案-显示申请人部门')
    return axios.post('/graphql/v1/toss', {
      query: `{
            TeacherDepartmentRelationList(
              query: ${JSON.stringify(JSON.stringify({ teacher_id: params }))},
              )
            {teacher_id department {name}}    
      }`
    })
  }
}
