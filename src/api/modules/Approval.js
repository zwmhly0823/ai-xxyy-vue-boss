import axios from '../axiosConfig'

export default {
  // 通过订单查当前开课日期
  getCurrentClassDate(query) {
    return axios.get(
      `/api/s/v1/management/getManagementsByPeriods?periods=${query.stage}&type=SYSTEMCOURSE`
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
  }
}
