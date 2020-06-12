/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-16 19:46:39
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-12 11:56:56
 */
import axios from '../axiosConfig'
// import { getToken } from '@/utils/auth'

export default {
  /**
   * @description 获取版本号
   * @param {type} params
   */
  getCourseVersion(params) {
    return axios.get(`/api/s/v1/data/dictionary/byType?type=${params.type}`)
  },
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
      `/api/s/v1/management/enroll/calculation/byPeriod?teacherId=${params.teacherId}&departmentIds=${params.departmentIds}&courseType=${params.courseType}&period=${params.period}`
    )
  },
  /**
   *
   *渠道查询
   */
  channelDetailPage(queryParams) {
    return axios.post('/graphql/channelDetail', {
      query: `{
        channelDetailPage(channelQuery:${queryParams},size:20){
          number
          size
          numberOfElements
          totalElements
          totalPages
          content {
            channelId
            channelName
            channelClassId
            channelClassName
            channelParentName
            channelParentId
            orderUserAllNums
            orderUserPayNums
            orderUserNoPayNums
            wechatAddNums
            joinCourseNums
            completeCourseNums
            systemOrderNums
            systemOrderAmounts
            channelCtime
          }
          counts {
            allUserNums
            allPayUserNums
            allJoinUserNums
            allCompleteUserNums
            allSystemUserNums
            allSystemUserAmounts
            allWechatAddNums
          }
        }
      }`
    })
  },
  /**
   * 一级 二级 三级 查询渠道
   * @param {*} param0
   */
  getChannelAndClass(params) {
    return axios.get(
      `/api/c/v1/channel/getChannelAndClass?channelClassParentId=${params}`
    )
  },
  /**
   * 推广人统计查看
   * @param {*} param0
   */
  getEncode(params) {
    return axios.get(`/api/o/v1/order/channel/getEncode?channelId=${params}`)
  },
  /**
   * 渠道信息管理 添加渠道
   * @param {*} param0
   */
  createChannel(params) {
    return axios.post('/api/c/v1/channel/createChannel', params)
  },
  /**
   * 渠道信息管理 修改渠道
   * @param {*} param0
   */
  updateChannel(params) {
    return axios.post('/api/c/v1/channel/updateChannel', params)
  },
  /**
   *
   *渠道查询
   */
  ChannelDetailStatisticsPage(Params = `""`, page = 1) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        ChannelDetailStatisticsPage(query:${Params},page:${page},size:20){
          totalPages
          totalElements
          number
          content {
            id
            channel_inner_name
            channel_link
            channel_link_short
            short_er_code
            status
            ctime
            cdate
            utime
            udate
            remarks
            channel_sort
            channel_class_id
            channel_class_name
            p_channel_class_name
            p_channel_class_id
          }
        }
      }`
    })
  },
  /*
   * 密码登录
   */
  channelUpload(file) {
    // const token = getToken()
    const headers = {
      token:
        'Bearer ' +
        'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0NTgwNTIyOTY3NzgwNTk3NzYiLCJzdWIiOiI0NTgwNTIyOTY3NzgwNTk3NzYiLCJpYXQiOjE1ODkzNzQ2NDMsImF1ZCI6InVzZXIiLCJleHAiOjE1OTgwMTQ2NDN9.VMeHKQHHOHb_9Hd764BjDGQwYLwHrgbavqHcvisKGeFu5ZWAFGckS60dkNVHo20x_tU8vGlnDS8AC97IKTBFEw',
      responseType: 'blob'
    }
    return axios.post(`/api/b/v1/import/importCompletedOrder`, file, {
      headers,
      params: {}
    })
    // return axios.post(`/api/b/v1/import/importCompletedOrder`, file)
  },
  /**
   * 系统标签 列表查询
   * @param {*} param0
   */
  findLabelByPage(params) {
    return axios.post('/api/toss/v1/toss-api/label/findLabelByPage', params)
  },
  // 查询验证码
  getVerification(parmas) {
    return axios.get(`/api/m/v1/sms/getCodeByMobile?mobile=${parmas}`)
  }
}
