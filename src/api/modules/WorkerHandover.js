/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-22 19:12:45
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-25 11:11:35
 */
import axios from '../axiosConfig'

export default {
  /**
   * 根据部门和老师,微信号获取班级信息
   * @params params 老师id或者老师微信号
   * */
  getHandoverSteam(params) {
    return axios.get(`/api/t/v1/handover/getHandoverSteam?teacherId=${params}`)
  },
  /**
   * 根据部门获取老师微信号和班级
   * @params params 老师id或者老师微信号
   * */
  getHandoverWechat(params) {
    return axios.get(`/api/t/v1/handover/getHandoverWechat?teacherId=${params}`)
  },
  /**
   * 根据部门获取老师微信号
   * @params params 老师id或者老师微信号
   * */
  getWeixinByTeacherId(params) {
    return axios.get(
      `/api/t/v1/handover/getWeixinByTeacherId?teacherId=${params}`
    )
  },
  /**
   * 班级确认交接
   * */
  postHandoverSteam(
    studentSteams,
    sendTeacherId,
    sendWeixinIds,
    receiveTeacherId,
    weixinId
  ) {
    return axios.post(
      `/api/t/v1/handover/postHandoverSteam?studentSteamIds=${studentSteams}&sendTeacherId=${sendTeacherId}&sendWeixinIds=${sendWeixinIds}&receiveTeacherId=${receiveTeacherId}&weixinId=${weixinId}`
    )
  },
  /**
   * 微信确认交接
   * */
  postHandoverWechat(sendTeacherId, receiveTeacherId, weixinId) {
    return axios.post(
      `/api/t/v1/handover/postHandoverWechat?sendTeacherId=${sendTeacherId}&receiveTeacherId=${receiveTeacherId}&weixinIds=${weixinId}`
    )
  },
  /**
   * 交接完table列表
   * */
  fishHandvorGetTable(sendTeacherId, pageSize, pageNumber) {
    return axios.get(
      `/api/t/v1/handover/getHandoverRecordsteam?sendTeacherId=${sendTeacherId}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    )
  },
  /**
   * 历史查询
   * */
  getHandoverRecord(params) {
    return axios.get(
      `/api/t/v1/handover/page/getHandoverRecord?teacherSendId=${
        params.teacherSendId
      }&teacherReceiveId=${params.teacherReceiveId}&handoverType=${
        params.handoverType
      }&pageNumber=${params.page}&pageSize=${
        params.size
      }&weixinSendId=${params.weixinSendId || ''}&teamId=${params.teamId || ''}`
    )
  },
  getDispatchStudentList(teacherId) {
    return axios.get(
      `/api/tm/v1/teacher/manager/getDispatchStudentList?teacherId=${teacherId}`
    )
  },
  // 兼职交接
  dispatchAjax(query) {
    return axios.post(
      `/api/tm/v1/teacher/manager/manual/dispatch?teacherId=${query.teacherId}&newTeacherId=${query.newTeacherId}${query.userIdList}`
    )
  }
}
