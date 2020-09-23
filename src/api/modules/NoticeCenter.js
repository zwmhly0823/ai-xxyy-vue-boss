import axios from '../axiosConfig'

export default {
  // boss获取角标数字
  getBadgeBoss(query) {
    return axios.get(
      `/api/tm/v1/teacher/manager/notify/count/noRead/byStaffId?staffId=${query.staffId}`
    )
  },
  // toss获取角标数字
  getBadgeToss(query) {
    return axios.get(
      `/api/tm/v1/teacher/manager/notify/count/noRead/byTeacherId?teacherId=${query.teacherId}`
    )
  },
  // boss获取所有消息
  getAllNotifyByStaffId(query) {
    return axios.get(
      `/api/tm/v1/teacher/manager/notify/byStaffId?pageNumber=${query.pageNumber}&pageSize=${query.pageSize}&staffId=${query.staffId}&typeId=${query.typeId}`
    )
  },
  // toss获取所有消息
  getAllNotifyByTeacherId(query) {
    return axios.get(
      `/api/tm/v1/teacher/manager/notify/byTeacherId?pageNumber=${query.pageNumber}&pageSize=${query.pageSize}&teacherId=${query.teacherId}&typeId=${query.typeId}`
    )
  },
  // boss更新消息状态
  updateNotifyIsReadByStaffId(query) {
    return axios.post(
      `/api/tm/v1/teacher/manager/notify/updateNotify/byStaffId?staffId=${query.staffId}&notifyIds=${query.notifyIds}`
    )
  },
  // toss更新消息状态
  updateNotifyIsReadByTeacherId(query) {
    return axios.post(
      `/api/tm/v1/teacher/manager/notify/updateNotify/byTeacherId?teacherId=${query.teacherId}&notifyIds=${query.notifyIds}`
    )
  },
  // 全部已读
  arrReadNotifyIsReadByStaffId(query) {
    return axios.post(
      `/api/tm/v1/teacher/manager/notify/updateNotify/byStaffId?staffId=${query.staffId}&notifyIds=&isAllRead=${query.isAllRead}`
    )
  }
}
