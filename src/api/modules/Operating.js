/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-16 19:46:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-09 18:45:17
 */
import axios from '../axiosConfig'
import axiosSelf from '../axios'
import { getToken } from '@/utils/auth'
import defaultSetting from '@/settings';
import { injectSubject, getAppSubjectCode } from '@/utils/index'
const subjectCode = getAppSubjectCode()
const getPlateformByUa = () => {
  const ua = window.navigator.userAgent;
  const reg = /\((.*?)\)/;
  const result = ua.match(reg);
  return result[1];
}
const platform = getPlateformByUa();
const judgeToken = () => {
  const token = getHeaders().Authorization
  const needToken = location.href.indexOf('login') === -1

  if (needToken && !token) {
    // location.href = `${baseUrl}login/#/`
    location.href = `/login/#/`
    return 0
  }
  return 1
}
const getHeaders = () => {
  const token = getToken() || ''
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    'subject': 'music_app',
    'version': defaultSetting.version,
    'os-type': platform,
  }
  if (token) {
    headers.Authorization = token.includes('Bearer ') ?
      token :
      'Bearer ' + token
  }
  return headers
}
export default {
  /**
   * @description 获取版本号
   * @param {type} params
   */
  getCourseVersion (params) {
    return axios.get(`/api/s/v1/data/dictionary/byType?type=${params.type}`)
  },
  /**
   * 获取体验课、系统课列表
   * 
   */
  getCourseListByType (params) {
    const page = params.page - 1

    return axios.get(
      `/api/s/v1/management/v/enroll/count/page?courseType=${params.courseType}&pageSize=${params.size}&separatePeriod=52&pageNumber=` +
      page
    )
  },
  /**
   * 体验课按人调班
   */
  trialChangeClass (params) {
    return axios.post(
      `/api/ts/v1/teamChange/changeTrialTeamByMobile`,
      params.data
    )
  },

  /**
   * 查询体验课调班操作记录列表
   */
  operationClassList (params) {
    return axios.post(
      `/api/ts/v1/teamChange/queryChangeTeamLog`,
      params
    )
  },

  /**
   * 批量导入
   */
  changeTeamByImport (params) {
    if (judgeToken()) {
      return axiosSelf({
        method: 'POST',
        url: '/api/ts/v1/teamChange/changeTeamByImport',
        // responseType: 'blob',
        headers: getHeaders(),
        // data: {
        //   ...params
        // }
        data: params
      })
    }
  },
  /**
   * 体验课按班级调班
   */
  changeTrialTeam (params) {
    return axios.post(
      `/api/ts/v1/teamChange/changeTrialTeam`,
      params.data
    )
  },
  /**
   * 新增招生排期第一步-add
   */
  addScheduleFirstStep (params) {
    return axios.post(`/api/s/v1/management/enroll/sell/save`, params)
  },
  /**
   * 新增招生排期第一步-edit获取数据
   */
  getScheduleFirstStep (params) {
    return axios.get(
      `/api/s/v1/management/enroll/sell?courseType=${params.courseType}&period=${params.period}`
    )
  },
  /**
   * 招生排期第一步，第二步之间 分配占比设置-add
   */
  addLeads (params, period, courseType='') {
    return axios.post(
      `/api/t/v1/teacher/course/enroll/teacher/channel/config/save?period=${period}${courseType?'&courseType='+courseType:''}`,
      params
    )
  },
  /**
   * 招生排期第一步，第二步之间 分配占比-edit获取数据
   */
  getLeads (params) {
    return axios.get(
      `/api/t/v1/teacher/course/enroll/teacher/channel/config?period=${params.period}`
      // `/api/t/v1/teacher/course/enroll/teacher/channel/config?courseType=${params.courseType}&period=${params.period}`
    )
  },
  /**
   * 新增招生排期第三步-获取 已选择的老师
   */
  getHasSelectTeacher (params) {
    return axios.get(
      `/api/t/v1/teacher/course/enroll/config/getTeacher?courseType=${params.courseType}&period=${params.period}`
    )
  },
  /**
   * 新增招生排期第三步-获取老师列表
   *
   */
  getTeacherConfigList (params) {
    Object.assign(params, { subject: "MUSIC_APP" })
    return axios.post(
      `/api/t/v1/teacher/course/enroll/teacher/config?courseType=${params.courseType}&period=${params.period}&courseDifficulty=${params.courseDifficulty}&departmentIds=${params.departmentIds}&teacherWechatIds=${params.teacherWechatIds}&levels=${params.levels}`,
      params.ids
    )
  },
  /**
   * 保存 招生排期 设置
   */
  saveScheduleConfig (params) {
    Object.assign(params, { subject: "MUSIC_APP" })
    return axios.post(
      `/api/t/v1/teacher/course/enroll/teacher/config/save?courseType=${params.courseType}&period=${params.period}`,
      params.body
    )
  },
  /*
   * 密码登录
   */
  pwdLoginIn (params) {
    return axios.post('/api/b/v1/staff/login', params)
  },
  // 导出
  exportExcel (params) {
    return axios.post(
      `/api/s/v1/management/enroll/exportDetail?teacherId=${params.teacherId}&departmentIds=${params.departmentIds}&level=${params.level}&courseType=${params.courseType}&period=${params.period}&courseDifficulties=${params.courseDifficulties}`,
      params, {
      responseType: 'blob' // 跟headers同级的
      // 给文件流加个字段,excel就不会有内部错误了
      // 二进制大对象(表示一个不可变、原始数据的类文件对象)
    }
    )
  },
  /**
   * 招生排期列表 下载
   */
  downloadExcel (params) {
    return axios.post(
      `/api/s/v1/management/enroll/exportDetail?teacherId=${params.teacherId}&departmentIds=${params.departmentIds}&level=${params.level}&courseType=${params.courseType}&period=${params.period}&courseDifficulties=${params.courseDifficulties}`
    )
  },
  /**
   *
   *招生排期 详情 列表
   * 单周  双周  系统
   * 2 0 1
   */
  getScheduleDetailList (params) {
    return axios.get(
      `/api/s/v1/management/enroll/getDetail?teacherId=${params.teacherId}&departmentIds=${params.departmentIds}&level=${params.level}&courseType=${params.courseType}&period=${params.period}&courseDifficulties=${params.courseDifficulties}&pageSize=${params.size}&pageNumber=` +
      params.pageNum
    )
  },
  /**
   *
   *招生排期 详情 基本信息
   */
  getScheduleDetailInfo (params) {
    return axios.get(
      `/api/s/v1/management/enroll/getManagement?courseType=${params.courseType}&period=${params.period}`
    )
  },
  /**
   *
   *招生排期 详情 基本信息
   */
  getScheduleDetailStatistic (params) {
    return axios.get(
      `/api/s/v1/management/enroll/calculation/byPeriod?teacherId=${params.teacherId}&departmentIds=${params.departmentIds}&level=${params.level}&courseType=${params.courseType}&period=${params.period}&courseDifficulties=${params.courseDifficulties}`
    )
  },
  getDividerPeriod (params) {
    return axios.get(
      `/api/s/v1/management/getNewManagement?type=${params.type}&category=${params.category}`
    )
  },
  /**
   *
   *渠道查询
   */
  getChannelClassList (params = '') {
    const query =
      (params && injectSubject(params)) ||
      JSON.stringify({ subject: subjectCode })
    return axios.post('/graphql/v1/toss', {
      query: `{
              ChannelClassList(query: ${JSON.stringify(query)}, size: 500){
                id
                channel_class_parent_id
                channel_class_name
              }
            }
          `
    })
  },
  // countsByTrialChannel(params) {
  //   return axios.get(
  //     `/api/o/v1/userOrderSuccess/channel/boss/countsByTrialChannel?trialChannels=${params.trialChannels}&trialChannelClassIds=${params.trialChannelClassIds}&stage=${params.stage}&startCtime=${params.startCtime}&endCtime=${params.endCtime}&page=${params.page}&pageSzie=${params.pageSzie}`
  //   )
  // },
  // 查询渠道名称 渠道分类
  ChannelDetailStatisticsList (Params = `""`) {
    const query = injectSubject(Params)
    return axios.post('/graphql/v1/toss', {
      query: `{
        ChannelDetailStatisticsList(query:${JSON.stringify(query)},size:60){
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
  countsByTrialChannelOfTotal (params) {
    return axios.get(
      `/api/o/v1/userOrderSuccess/channel/boss/countsByTrialChannelOfTotal?trialChannels=${params.trialChannels}&trialChannelClassIds=${params.trialChannelClassIds}&stage=${params.stage}&startCtime=${params.startCtime}&endCtime=${params.endCtime}`
    )
  },
  // 渠道查询结果的数据  java 接口改成toss
  ChannelManagementStatisticsTotal (params) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        ChannelManagementStatisticsTotal(query: ${JSON.stringify(
        injectSubject(params)
      )}){
           trial_user_num
           order_user_no_pay_nums
           wet_nums
           join_user_num
           complete_user_num
           system_user_num
           system_user_amounts
        }
      }`
    })
  },
  // 查询渠道名称 渠道分类
  countsByTrialChannel (Params) {
    const query = injectSubject(Params)
    return axios.post('/graphql/v1/toss', {
      query: `{
        ChannelManagementStatisticsPage(query:${JSON.stringify(query)}){
          content {
            trial_user_num,
            pay_channel,
            order_user_no_pay_nums,
            wet_nums,
            join_user_num,
            complete_user_num,
            system_user_num,
            system_user_amounts
            trial_channel_class_id
            },
            numberOfElements,
            totalElements,
            totalPages,
            size,
          number
        }
      }`
    })
  },
  // 二级渠道查询 列表查询
  countsByTrialChannelClassId (params) {
    return axios.get(
      `/api/o/v1/userOrderSuccess/channel/boss/countsByTrialChannelClassId?trialChannelClassIds=${params.trialChannelClassIds}&stage=${params.stage}&startCtime=${params.startCtime}&endCtime=${params.endCtime}&page=${params.page}&pageSzie=${params.pageSzie}`
    )
  },
  // 二级渠道查询 模块数据
  countsByTrialChannelClassIdOfTotal (params) {
    return axios.get(
      `/api/o/v1/userOrderSuccess/channel/boss/countsByTrialChannelClassIdOfTotal?trialChannelClassIds=${params.trialChannelClassIds}&stage=${params.stage}&startCtime=${params.startCtime}&endCtime=${params.endCtime}`
    )
  },
  // 二级渠道查询名称 渠道分类
  ChannelClassPageName (Params, page = 1) {
    const query = injectSubject(Params)

    return axios.post('/graphql/v1/toss', {
      query: `{
        ChannelClassPage(query:${JSON.stringify(query)},size:60){
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
  getChannelAndClass (params) {
    return axios.get(
      `/api/c/v1/channel/getChannelAndClass?channelClassParentId=${params}`
    )
  },
  /**
   * 推广人统计查看
   * @param {*} param0
   */
  getEncode (params) {
    return axios.get(`/api/o/v1/order/channel/getEncode?channelId=${params}`)
  },
  /**
   * 渠道信息管理 添加渠道
   * @param {*} param0
   */
  createChannel (params) {
    return axios.post('/api/c/v1/channel/createChannel', params)
  },
  /**
   * 渠道信息管理 修改渠道
   * @param {*} param0
   */
  updateChannel (params) {
    return axios.post('/api/c/v1/channel/updateChannel', params)
  },
  /**
   *
   *渠道查询
   */
  ChannelDetailStatisticsPage (Params = `""`, page = 1) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        ChannelDetailStatisticsPage(query:${Params},page:${page},size:10000){
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
            create_user
            cdate
            utime
            udate
            remarks
            channel_sort
            channel_class_id
            channel_class_name
            p_channel_class_name
            p_channel_class_id
            contract_id
            contract_name
          }
        }
      }`
    })
  },
  /**
   *
   * 二级渠道查询
   */
  ChannelClassPage (Params, page = 1) {
    const query = injectSubject(JSON.parse(Params))
    return axios.post('/graphql/v1/toss', {
      query: `{
        ChannelClassPage(query:${JSON.stringify(query)},page:${page},size:20){
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
  updateChannelClassV2 (params) {
    return axios.get('/api/c/v1/channel/updateChannelClassV2', params)
  },
  /*
   * 密码登录
   */
  channelUpload (file) {
    // const token = getToken()
    const headers = {
      token: 'Bearer ' +
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
  findLabelByPage (params) {
    return axios.post('/api/toss/v1/toss-api/label/findLabelByPage', params)
  },
  // 查询验证码
  getVerification (parmas) {
    return axios.get(`/api/m/v1/sms/getCodeByMobile?mobile=${parmas}`)
  },
  // 推送配置 创建
  pushNotificationsAdd (params) {
    return axios.post(`/api/b/v1/backend/PushNotifications/add`, params)
  },
  // 推送配置 修改保存
  pushNotificationsUpdate (params) {
    return axios.post(`/api/b/v1/backend/PushNotifications/update`, params)
  },
  // 推送配置列表
  getPushNotificationsList (currentPage) {
    return axios.get(
      `/api/b/v1/backend/PushNotifications/list?page=${currentPage}&size=20`
    )
  },
  // 推送配置 推送
  pushNotificationsExecute (id, operatorId, operatorName) {
    return axios.get(
      `/api/b/v1/backend/PushNotifications/execute?id=${id}&operatorId=${operatorId}&operatorName=${operatorName}`
    )
  },
  // 推送配置 推送
  queryQuestionnairePage (page, size) {
    return axios.get(
      `/api/f/v1/questionnaire/queryQuestionnairePage?page=${page}&pagesize=${size}`
    )
  },
  /**
   *
   *通过期数 获取期数下人员总数 (体验课)
   */
  StudentTrialCoursePage (Params) {
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
  StudentSystemCoursePage (Params) {
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
  replaceMobile ({ newMobile, oldMobile, staffId } = {}) {
    return axios.post(
      `/api/u/v1/user/replaceMobile?staffId=${staffId}&oldMobile=${oldMobile}&newMobile=${newMobile}`
    )
  },

  /**
   * 获取手机号替换记录
   */
  getUserReplaceMobileLog (params = '', page = 1) {
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
  // 问卷管理 查询问卷列表数据
  queryQuestionnairePages (page) {
    return axios.get(
      `/api/f/v1/questionnaire/queryQuestionnairePage?page=${page}&pagesize=20`
    )
  },
  // 问卷管理 根据id 查询问卷
  queryQuestionnaire (questionnaireId) {
    return axios.get(
      `/api/f/v1/questionnaire/queryQuestionnaire?questionnaireId=${questionnaireId}`
    )
  },
  // 问卷管理 保存 修改
  saveQuestionnaire (params) {
    return axios.post(`/api/f/v1/questionnaire/saveQuestionnaire`, params)
  },
  /**
   * @description 招生排期上传excel
   */
  updateScheduleExcel (parmas) {
    return axios.post(
      `/api/t/v1/enroll/import?courseType=${parmas.courseType}`,
      parmas
    )
  },
  /**
   * @description 导入模板
   */
  exportUpload (parmas) {
    return axios.post('/api/a/v1/account/batchUpdateAccount', parmas)
  },
  /**
   * @description 小熊币发放列表
   */
  // issueBearList(params = '', page = 1) {
  //   return axios.post('/graphql/v1/toss', {
  //     query: `{
  //       AccountPage(query: ${params}, page:${page}) {
  //         totalPages
  //         totalElements
  //         content {
  //           user{
  //             user_num
  //             id
  //           }
  //           id
  //           uid
  //           ctime
  //           account_type
  //           trans_type
  //           amount
  //           note
  //           desc
  //         }
  //       }
  //     }`
  //   })
  // },
  issueBearList (params) {
    return axios.get(`/api/a/v1/account/getImportLogList`, params)
  },
  /**
   * 教师渠道绑定-保存
   */
  saveOrUpdate (params) {
    return axios.post('/api/t/v1/teacherChannel/saveOrUpdate', params)
  },
  /**
   * 教师渠道绑定-查找记录
   */
  getRecord (params) {
    return axios.post(
      `/api/t/v1/teacherChannel/getRecord?period=${params.period}`
    )
  },
  // 截图转介绍
  getTable (parmas) {
    return axios.get('/api/b/v1/backend/userflow/sharereward/pageList', parmas)
  },
  // 提交截图审核
  submit_img (parmas) {
    return axios.post(
      `/api/b/v1/backend/userflow/complete?id=${parmas.id}&isAgree=${parmas.isAgree}&remark=${parmas.remark}`
    )
  },
  // 提交复审
  submit_img_2 (parmas) {
    return axios.post(`/api/b/v1/backend/userflow/reComplete?id=${parmas}`)
  },
  // 新建活动编辑活动保存
  saveAndUpdatePromotions (params) {
    return axios.post(`/api/p/v1/promotions/saveAndUpdatePromotions`, params)
  },
  // 活动管理列表
  getPromotionsPageList (params) {
    return axios.get(`/api/p/v1/promotions/getPromotionsPageList`, params)
  },
  // 审核列表
  getReviewPageList (params) {
    return axios.post(`/api/wk/v1/works/getStuWorks`, params)
  },
  // 批量审核
  auditWorks (params) {
    return axios.post(`/api/wk/v1/works/auditWorks`, params)
  },
  // 修改权重
  topLevel (params) {
    return axios.post(`/api/wk/v1/works/topLevel`, params)
  },
  // 活动管理详情
  getPromotionsById (params) {
    return axios.get(`/api/p/v1/promotions/getPromotionsById`, params)
  },
  // 修改活动结束时间
  updatePromotionsDate (params) {
    return axios.post(`/api/p/v1/promotions/updatePromotionsDate`, params)
  },
  // 获取销售等级
  getSellLevel (params) {
    return axios.get(`/api/t/v1/teacher/course/teacherLevelByType?level=0`)
  },
  // 招生排期获取招生状态
  getStatusByperiods (periods, courseType) {
    return axios.get(`/api/t/v1/enroll/getStatusByperiods?periods=${periods}&courseType=${courseType}`)
  },
  // 招生排期切换状态
  updateStatusByPeriod (params) {
    return axios.get(
      `/api/t/v1/enroll/updateStatusByPeriod?period=${params.period}&status=${params.status}&courseType=${params.courseType}`
    )
  },
  /**
   * 获取招生容量 列表
   *
   */
  getScheduleVolumeList (params) {
    let pageNum = params.pageNum
    return axios.post(
      `/api/t/v1/teacher/course/enrollSchedule/teacher/config?pageNum=${--pageNum}&pageSize=${params.size
      }&courseType=${params.courseType}&period=${params.period
      }&courseDifficulty=${params.courseDifficulty}&departmentIds=${params.departmentIds
      }&teacherWechatIds=${params.teacherWechatIds}&levels=${params.levels
      }&courseVersion=${params.courseVersion}`,
      params.ids
    )
  },
  /**
   * @description 新版体验课 设置招生容量列表
   */
  trialSetVolumeList (params) {
    let pageNum = params.pageNum
    return axios.post(
      `/api/t/v1/teacher/course/v/enroll/teacher/config?pageNum=${--pageNum}&pageSize=${params.size
      }&courseType=${params.courseType}&period=${params.period
      }&courseDifficulty=${params.courseDifficulty}`,
      params.ids
    )
  },

  // 转介绍招生数
  getIntroduceCountByIds (query) {
    return axios.get(
      `/api/t/v1/teacher/getIntroduceCountByIds?term=${query.term}&ids=${query.ids}`
    )
  },
  /**
   * @description 根据老师id和部门id查询老师关联微信号
   */
  getTeacherAllWechatByDept (params) {
    return axios.post(
      `/api/t/v1/wechat/teacher/getTeacherByDepartmentIdAndTeacherId?teacherId=${params.teacherId}&departmentId=${params.departmentId}`,
      params
    )
  },
  /**
   * @description 编辑微信保存按钮
   * /**
  * @description 查询排期
  */
  getAllCategory () {
    return axios.get(
      `/api/s/v1/management/getAllCategory`,
    )
  },
  saveEditTeacherWeChat (params) {
    return axios.post(
      `/api/t/v1/wechat/teacher/saveTeacherChangeWeixinRecord?teacherId=${params.teacherId}&oldWeixinNo=${params.oldWeixinNo}&oldWeixinId=${params.oldWeixinId}&weixinId=${params.weixinId}&weixinNo=${params.weixinNo}&courseType=${params.courseType}&period=${params.period}`
    )
  },
  // 删除定向分配销售
  async removeChannelSales (params) {
    return axios.post(
      '/api/t/v1/teacherChannel/delRecord?id=' + params
    )
  },
  // 删除定向分配销售
  async channelMobile (params) {
    return axios.post(
      '/api/u/v2/user/cancelMobile',
      params
    )
  },
  // 机型管理添加
  addPhoneType (query) {
    return axios.get(
      `/api/home/v1/config/addPhoneModel?phoneModel=${query.phoneModel}`
    )
  },
  // 机型管理list
  getPhoneTypeList () {
    return axios.get(
      `/api/home/v1/config/getPhoneModel`
    )
  },
  // 体验课定向排期列表
  getTrialOperPeroid (params) {
    return axios.get(
      `/api/s/v1/managementChannel/getConfigPage?channelIds=${params.channelIds
      }&pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&type=${params.type
      }&category=${params.category}&channelId=${params.channelId
      }&periods=${params.periods || ''}`
    )
  },
  /**
  * @description 获取课程类型
  * @params courseType { 0: 体验课； 1： 系统课}
  */
  getCourseListByCourseType (params) {
    return axios.get(
      `/api/t/v1/teacher/category/config/getByCourseType?courseType=${params.courseType}`
    )
  },
  // 体验课新建定向招生渠道
  saveConfigTrialOperPeroid (params) {
    return axios.post(
      '/api/s/v1/managementChannel/saveConfig',
      JSON.stringify(params)
    )
  },

  // 体验课新建定向招生渠道
  saveConfigTrialOperPeroid (params) {
    return axios.post(
      '/api/s/v1/managementChannel/saveConfig',
      JSON.stringify(params)
    )
  },

  // 体验课编辑定向招生渠道
  editConfigTrialOperPeroid (params) {
    const curstomQuery = {
      id: params.id,
      period: params.period,
      subject: params.subject
    }
    return axios.post(
      '/api/s/v1/managementChannel/changeChannelPeriod',
      JSON.stringify(curstomQuery)
    )
  },

  // 体验课定向招生渠道切换启用、禁用状态
  switchStatusTrialOperPeroid (params) {
    return axios.post('/api/s/v1/managementChannel/switchStatus', params)
  },
  /**
   * 新版体验课 新增招生排期第一步-edit获取数据
   */
  getTrialScheduleFirstStep (params) {
    return axios.get(
      `/api/s/v1/management/enroll/sell?courseType=${params.courseType}&period=${params.period}`
    )
  },
  /**
   * 体验课 新增招生排期第一步-add
   */
  addTrialScheduleFirstStep (params) {
    return axios.post(`/api/s/v1/management/enroll/sell/save`, params)
  },
  /**
   * 招生排期 保存老师 
   * 其中  courseType    0 双周|3单周|2系统课
   */
  saveAddTeacherWxList (params) {
    const { courseDifficulty, period, wxList, courseType } = params
    return axios.post(`/api/t/v1/teacher/course/v/enroll/teacher/teacherInfo?courseDifficulty=${courseDifficulty}&period=${period}&courseType=${courseType}`, wxList)
  },
  /**
 * 保存 招生排期 设置
 */
  saveTrialVolumeRow (params) {
    const { courseType, period, category } = params
    return axios.post(
      `/api/t/v1/teacher/course/v/enroll/config/save?courseType=${courseType}&period=${period}&category=${category ||
      ''}`,
      params.body
    )
  },
  /**
   *
   *渠道查询（根据期数查询，作用于新版体验课）
   */
  getTrialChannelList (params = '') {
    return axios.get(
      `/api/t/v1/teacher/direct/getAllChannel?period=${params.period
      }&courseType=${params.courseType}`
    )
  },
  // 获取渠道来源 filter: 过滤关键词  eg：filter:"抖音"
  getChannel (params) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        ChannelAllList(query:${JSON.stringify(
        JSON.stringify(params.subject)
      )}) {
            id
            channel_class_id
            channel_outer_name
          }
        }
      `
    })
  },
  /** 添加定向分配老师下拉菜单 */
  getDirectTeacherList (params) {
    return axios.get(
      `/api/t/v1/teacher/direct/getDirectTeacher?courseType=${params.courseType
      }&period=${params.period}&category=${params.category || ''}`
    )
  },
  /** 保存定向分配渠道 */
  saveDirectChannel (params) {
    const { directConfigList = [], courseType = '0', category } = params
    return axios.post(
      `/api/t/v1/teacher/direct/saveDirectChannel?courseType=${courseType}&category=${category ||
      ''}`,
      directConfigList
    )
  },
  /**
   * 定向渠道列表
   */
  getDirecteChannelList (params) {
    const {
      channelIds = [],
      teacherIds = '',
      pageNum = '0',
      pageSize = 5,
      courseType = '0',
      period
    } = params
    return axios.get(
      `/api/t/v1/teacher/direct/findDirectList?channelIds=${channelIds}&teacherIds=${teacherIds}&pageNum=${pageNum -
      1}&pageSize=${pageSize}&courseType=${courseType}&period=${period}`
    )
  },
  /** 修改定向状态 */
  updateDirectStatus (params) {
    return axios.get(
      `/api/t/v1/teacher/direct/updateSelfStatus?status=${params.status}&id=${params.id}`
    )
  },
  /** 修改其它状态 */
  updateOthertStatus (params) {
    return axios.get(
      `/api/t/v1/teacher/direct/updateOtherStatus?status=${params.status}&id=${params.id}`
    )
  },
  /**
   *
   *招生排期(新版体验课) 详情 基本信息表格统计
   */
  getTrialDetailStatistic (params) {
    return axios.get(
      `/api/s/v1/management/v/enroll/calculation/byPeriod?channelIds=${params.channel}&category=${params.category}&overshootStatus=${params.overshootStatus}&conversionStatus=${params.conversionStatus}&marketStatus=${params.marketStatus}&teacherIds=${params.teacherId}&departmentIds=${params.departmentIds}&courseType=${params.courseType}&period=${params.period}&courseDifficulties=${params.courseDifficulties}`
    )
  },
  /**
   *
   *招生排期(新版体验课) 详情 平均招生完成率
   */
   getTrialEnrollRate(params) {
    return axios.post(
      `/api/t/v1/teacher/course/getEnrollRate?period=${params.period}&courseType=${params.courseType}`
    )
  },
  /**
   *
   *招生排期 详情 列表(新版)
   * 单周  双周  系统
   * 3 0 2
   */
   getTrialDetailList(params) {
    return axios.get(
      `/api/s/v1/management/v/enroll/getDetail?teacherIds=${params.teacherId}&departmentIds=${params.departmentIds}&courseType=${params.courseType}&period=${params.period}&courseDifficulties=${params.courseDifficulties}&overshootStatus=${params.overshootStatus}&channelIds=${params.channel}&conversionStatus=${params.conversionStatus}&marketStatus=${params.marketStatus}&pageSize=${params.size}&pageNumber=` +
        params.pageNum
    )
  },
}