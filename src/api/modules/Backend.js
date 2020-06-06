/*
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-05-10 16:17:21
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-05 22:48:39
 */
import axios from '../axiosConfig'
export default {
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
   */
  getReplenishDetail(params) {
    return axios.get(
      `/api/b/v1/backend/reissue/flow/info?flowApprovalId=${params}`
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
      `/api/b/v1/backend/completed/reissue/flow?flowApprovalId=${params.flowApprovalId}&staffName=${params.staffName}&staffId=${params.staffId}&version=${params.version}&isConfirm=${params.isConfirm}&approvalRemark=${params.approvalRemark}`
    )
  },
  // 财务驳回的重新提交
  rejectedUpdate(params) {
    return axios.post(`/api/b/v1/backend/refund/detail/update`, params)
  },
  changeCash(params) {
    return axios.post(`/api/b/v1/backend/refund/detail/updateRefundFee`, params)
  }
}
