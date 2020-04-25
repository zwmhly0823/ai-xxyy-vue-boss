/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-16 19:46:39
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-25 17:39:18
 */
import axios from '../axiosConfig'

export default {
  /**
   * 获取体验课、系统课列表
   */
  getCourseListByType(params) {
    const page = params.page - 1
    return axios.get(
      `/api/s/v1/management/enroll/count/page?courseType=${params.courseType}&pageSize=${params.size}&pageNumber=` +
        page
    )
  },
  /**
   * 新增招生排期第一步-add
   */
  addScheduleFirstStep(params) {
    return axios.post(`/api/s/v1/management/enroll/sell/save`, params)
  },
  /**
   * 新增招生排期第一步-edit获取数据
   */
  getScheduleFirstStep(params) {
    return axios.get(
      `/api/s/v1/management/enroll/sell?courseType=${params.courseType}&period=${params.period}`
    )
  },
  /**
   * 新增招生排期第三步-获取 已选择的老师
   */
  getHasSelectTeacher(params) {
    return axios.get(
      `/api/t/v1/teacher/course/enroll/config/getTeacher?courseType=${params.courseType}&period=${params.period}`
    )
  },
  /**
   * 新增招生排期第三步-获取老师列表
   *
   */
  getTeacherConfigList(params) {
    return axios.post(
      `/api/t/v1/teacher/course/enroll/teacher/config?courseType=${params.courseType}&period=${params.period}`,
      params.ids
    )
  },
  /**
   * 保存 招生排期 设置
   */
  saveScheduleConfig(params) {
    return axios.post(
      `/api/t/v1/teacher/course/enroll/teacher/config/save?courseType=${params.courseType}&period=${params.period}`,
      params.body
    )
  },
  /*
   * 密码登录
   */
  pwdLoginIn(params) {
    return axios.post('/api/b/v1/staff/login', params)
  },
  /**
   *
   *招生排期 详情 列表
   */
  getScheduleDetailList(params) {
    return axios.get(
      `/api/s/v1/management/enroll/getDetail?teacherId=${params.teacherId}&departmentIds=${params.departmentIds}&courseType=${params.courseType}&period=${params.period}&pageSize=${params.size}&pageNumber=` +
        params.pageNum
    )
  },
  /**
   *
   *招生排期 详情 基本信息
   */
  getScheduleDetailInfo(params) {
    return axios.get(
      `/api/s/v1/management/enroll/getManagement?courseType=${params.courseType}&period=${params.period}`
    )
  },
  /**
   *
   *招生排期 详情 基本信息
   */
  getScheduleDetailStatistic(params) {
    return axios.get(
      `/api/s/v1/management/enroll/calculation/byPeriod?courseType=${params.courseType}&period=${params.period}`
    )
  }
}
