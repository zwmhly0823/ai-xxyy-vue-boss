/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-16 19:46:39
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-23 20:24:10
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
   * 招生排期第一步，第二步之间 分配占比设置-add
   */
  addLeads(params, period) {
    return axios.post(
      `/api/t/v1/teacher/course/enroll/teacher/channel/config/save?period=${period}`,
      params
    )
  },
  /**
   * 招生排期第一步，第二步之间 分配占比-edit获取数据
   */
  getLeads(params) {
    return axios.get(
      `/api/t/v1/teacher/course/enroll/teacher/channel/config?courseType=${params.courseType}&period=${params.period}`
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
      `/api/t/v1/teacher/course/enroll/teacher/config?courseType=${params.courseType}&period=${params.period}&courseDifficulty=${params.courseDifficulty}&departmentIds=${params.departmentIds}&teacherWechatIds=${params.teacherWechatIds}&levels=${params.levels}`,
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
  // 导出
  exportExcel(params) {
    console.warn('接口-导出excel')
    return axios.post(
      `/api/s/v1/management/enroll/exportDetail?teacherId=${params.teacherId}&departmentIds=${params.departmentIds}&level=${params.level}&courseType=${params.courseType}&period=${params.period}&courseDifficulties=${params.courseDifficulties}`,
      params,
      {
        responseType: 'blob' // 跟headers同级的
        // 给文件流加个字段,excel就不会有内部错误了
        // 二进制大对象(表示一个不可变、原始数据的类文件对象)
      }
    )
  },
  /**
   * 招生排期列表 下载
   */
  downloadExcel(params) {
    return axios.post(
      `/api/s/v1/management/enroll/exportDetail?teacherId=${params.teacherId}&departmentIds=${params.departmentIds}&level=${params.level}&courseType=${params.courseType}&period=${params.period}&courseDifficulties=${params.courseDifficulties}`
    )
  },
  /**
   *
   *招生排期 详情 列表
   */
  getScheduleDetailList(params) {
    return axios.get(
      `/api/s/v1/management/enroll/getDetail?teacherId=${params.teacherId}&departmentIds=${params.departmentIds}&level=${params.level}&courseType=${params.courseType}&period=${params.period}&courseDifficulties=${params.courseDifficulties}&pageSize=${params.size}&pageNumber=` +
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
      `/api/s/v1/management/enroll/calculation/byPeriod?teacherId=${params.teacherId}&departmentIds=${params.departmentIds}&level=${params.level}&courseType=${params.courseType}&period=${params.period}&courseDifficulties=${params.courseDifficulties}`
    )
  },
  /**
   *
   *渠道查询
   */
  countsByTrialChannel(params) {
    return axios.get(
      `/api/o/v1/userOrderSuccess/channel/boss/countsByTrialChannel?trialChannels=${params.trialChannels}&trialChannelClassIds=${params.trialChannelClassIds}&stage=${params.stage}&startCtime=${params.startCtime}&endCtime=${params.endCtime}&page=${params.page}&pageSzie=${params.pageSzie}`
    )
  },
  // 查询渠道名称 渠道分类
  ChannelDetailStatisticsList(Params = `""`) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        ChannelDetailStatisticsList(query:${JSON.stringify(Params)}){
          id
          ctime
          channel_inner_name
          channel_class_id
          channel_class_name
          p_channel_class_name
          p_channel_class_id
        }
      }`
    })
  },
  // 渠道查询 模块数据
  countsByTrialChannelOfTotal(params) {
    return axios.get(
      `/api/o/v1/userOrderSuccess/channel/boss/countsByTrialChannelOfTotal?trialChannels=${params.trialChannels}&trialChannelClassIds=${params.trialChannelClassIds}&stage=${params.stage}&startCtime=${params.startCtime}&endCtime=${params.endCtime}`
    )
  },
  // 二级渠道查询 列表查询
  countsByTrialChannelClassId(params) {
    return axios.get(
      `/api/o/v1/userOrderSuccess/channel/boss/countsByTrialChannelClassId?trialChannelClassIds=${params.trialChannelClassIds}&stage=${params.stage}&startCtime=${params.startCtime}&endCtime=${params.endCtime}&page=${params.page}&pageSzie=${params.pageSzie}`
    )
  },
  // 二级渠道查询 模块数据
  countsByTrialChannelClassIdOfTotal(params) {
    return axios.get(
      `/api/o/v1/userOrderSuccess/channel/boss/countsByTrialChannelClassIdOfTotal?trialChannelClassIds=${params.trialChannelClassIds}&stage=${params.stage}&startCtime=${params.startCtime}&endCtime=${params.endCtime}`
    )
  },
  // 二级渠道查询名称 渠道分类
  ChannelClassPageName(Params, page = 1) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        ChannelClassPage(query:${JSON.stringify(Params)}){
          content{
            channel_class_name
            channel_level
            id
            channel_class_parent_id
            channelClassParent{
              channel_class_name
              id
            }
          }
          number
          totalElements
          totalPages
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
            channel_level
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
  /**
   *
   * 二级渠道查询
   */
  ChannelClassPage(Params, page = 1) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        ChannelClassPage(query:${Params},page:${page},size:20){
          content{
            channel_class_name
            channel_level
            id
            channel_class_parent_id
            channelClassParent{
              channel_class_name
              id
            }
          }
          number
          totalElements
          totalPages
        }
      }`
    })
  },
  /**
   * 二级渠道信息管理 修改渠道
   * @param {*} param0
   */
  updateChannelClassV2(params) {
    return axios.get('/api/c/v1/channel/updateChannelClassV2', params)
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
  },
  // 推送配置 创建
  pushNotificationsAdd(params) {
    return axios.post(`/api/b/v1/backend/PushNotifications/add`, params)
  },
  // 推送配置 修改保存
  pushNotificationsUpdate(params) {
    return axios.post(`/api/b/v1/backend/PushNotifications/update`, params)
  },
  // 推送配置列表
  getPushNotificationsList(currentPage) {
    return axios.get(
      `/api/b/v1/backend/PushNotifications/list?page=${currentPage}&size=20`
    )
  },
  // 推送配置 推送
  pushNotificationsExecute(id, operatorId, operatorName) {
    return axios.get(
      `/api/b/v1/backend/PushNotifications/execute?id=${id}&operatorId=${operatorId}&operatorName=${operatorName}`
    )
  },
  // 推送配置 推送
  queryQuestionnairePage(page, size) {
    return axios.get(
      `/api/f/v1/questionnaire/queryQuestionnairePage?page=${page}&pagesize=${size}`
    )
  },
  /**
   *
   *通过期数 获取期数下人员总数 (体验课)
   */
  StudentTrialCoursePage(Params) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialCoursePage(query:${Params}){
          totalElements
        }
      }`
    })
  },
  /**
   *
   *通过期数 获取期数下人员总数 (系统课)
   */
  StudentSystemCoursePage(Params) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentSystemCoursePage(query:${Params}){
          totalElements
        }
      }`
    })
  },

  /**
   * 替换用户手机号
   * v1/user/replaceMobile?staffId=1&oldMobile=13012345670&newMobile=13012345672
   *  */
  replaceMobile({ newMobile, oldMobile, staffId } = {}) {
    return axios.post(
      `/api/u/v1/user/replaceMobile?staffId=${staffId}&oldMobile=${oldMobile}&newMobile=${newMobile}`
    )
  },

  /**
   * 获取手机号替换记录
   */
  getUserReplaceMobileLog(params = '', page = 1) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        UserReplaceMobileLogPage(query: ${params}, page:${page}){
          totalElements
          totalPages
          number
          content{
            id
            cid
            ctime
            del
            mid
            utime
            new_mobile
            old_mobile
            new_uid
            uid
            staff_id
            remark
            user{
              id
              user_num
              username
            }
            staff{
              id
              real_name
              user_name
            }
          }
        }
      }`
    })
  },
  /**
   * @description 招生排期上传excel
   */
  updateScheduleExcel(parmas) {
    return axios.post(
      `/api/t/v1/enroll/import?courseType=${parmas.courseType}`,
      parmas
    )
  },
  // 问卷管理 查询问卷列表数据
  queryQuestionnairePages(page) {
    return axios.get(
      `/api/f/v1/questionnaire/queryQuestionnairePage?page=${page}&pagesize=20`
    )
  },
  // 问卷管理 根据id 查询问卷
  queryQuestionnaire(questionnaireId) {
    return axios.get(
      `/api/f/v1/questionnaire/queryQuestionnaire?questionnaireId=${questionnaireId}`
    )
  },
  // 问卷管理 保存 修改
  saveQuestionnaire(params) {
    return axios.post(`/api/f/v1/questionnaire/saveQuestionnaire`, params)
  }
}
