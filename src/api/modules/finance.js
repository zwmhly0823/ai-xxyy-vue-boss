/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-05-22 12:39:14
 * @LastEditors: liukun
 * @LastEditTime: 2020-06-02 19:05:58
 */

import axios from '../axiosConfig'
// 听青龙的提出来_不侧漏
const change = '/api'
export default {
  // 查询表单数据
  getTable(params) {
    console.warn('接口-我来取表单数据')
    return axios.post(change + `/o/v1/order/findPayment`, params)
  },

  // 调取同意,驳回
  toAgree({ refundUid, paymentId, auditType = 1, rejectReason } = {}) {
    console.warn('接口-财务同意或驳回发出')
    return axios.post(
      change +
        `/o/v1/order/updateRefundComplete?refundUid=${refundUid}&paymentId=${paymentId}&auditType=${auditType}${
          auditType === 2 ? '&rejectReason=' + rejectReason : ''
        }`
    )
  },

  // 导出
  exportExcel(params) {
    console.warn('接口-导出excel')
    return axios.post(change + `/o/v1/order/exportPayment`, params, {
      responseType: 'blob' // 跟headers同级的
      // 给文件流加个字段,excel就不会有内部错误了
      // 二进制大对象(表示一个不可变、原始数据的类文件对象)
    })
  },
  // 获取抽屉详情
  getDetail(params) {
    console.warn('接口-我来取抽屉数据')
    return axios.get(change + `/o/v1/order/getOrderRefundDetail`, params)
  }
}
