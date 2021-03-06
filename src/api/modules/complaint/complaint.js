import axios from '../../axiosConfig'
// import { getAppSubjectCode } from '@/utils/index'
// const subjectCode = getAppSubjectCode()

// const subjectKey = getAppSubject()
export default {
  // 获取投诉列表
  getComplaintList(query) {
    return axios.post(`/api/b/v1/complaint/list`, query)
  },
  // 获取投诉详情
  getComplaintDetail(query) {
    return axios.post(`/api/b/v1/complaint/detail?complaintNo=${query.id}`)
  },
  // 处理投诉
  goComplaintDeal(query, data) {
    return axios.post(
      `/api/b/v1/complaint/deal?cpStatus=${query.cpStatus}&systemType=${query.systemType}&contactType=${query.contactType}&uid=${query.uid}&currentStaffMobile=${query.currentStaffMobile}&currentStaffName=${query.currentStaffName}&complaintNo=${query.complaintNo}&currentStaffId=${query.currentStaffId}&handleComment=${query.handleComment}`
    )
  },
  // 投诉中心数量
  getComplaintNum(query) {
    return axios.post(`/api/b/v1/complaint/num`, query)
  }
}
