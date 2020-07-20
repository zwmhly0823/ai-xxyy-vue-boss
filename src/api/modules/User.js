/* eslint-disable camelcase */
/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-20 20:03:49
 */
// import axios from '../axios'
import axios from '../axiosConfig'

export default {
  /**
   * 修改学员是否已加微信、已进群状态
   * @param {*} Object
   * {
   *  studentId,
      teamId,
      courseType,
      addedGroup,
      addedWechat
   * }
   */
  updateTeamStudent(params) {
    // 增加操作人ID operatorId
    const staff = JSON.parse(localStorage.getItem('staff'))
    if (staff && staff.id) {
      const operatorId = { operatorId: staff.id }
      Object.assign(params, operatorId)
    }
    return axios.put(
      '/api/tm/v1/teacher/manager/team/updateTeamStudent',
      params
    )
  },
  sendMsgForTeacher(orderId) {
    return axios.get(`/api/o/v1/order/sendMsgForTeacher?orderIds=${orderId}`)
  },

  /**
   * 模糊搜索用户手机号，获取用户信息
   */
  searchUserByPhone(queryString = '') {
    const query = {
      bool: {
        must: [
          {
            wildcard: { mobile: `*${queryString}*` }
          }
        ]
      }
    }
    const q = JSON.stringify(query)
    return axios.post('/graphql/v1/toss', {
      query: `{
        UserListEx(query:${JSON.stringify(q)}){
          id
          mobile
          username
        }
      }`
    })
  },
  getUserInfo(query = '') {
    return axios.post('/graphql/v1/toss', {
      query: `
      {
        User(query: ${JSON.stringify(query)}){
          id
        }
      }
      `
    })
  },

  // 模糊搜索手机号或微信号，获取用户ID或班级ID
  blurrySearch(queryString = '', teamType = '0', teamId = '') {
    const queryParams = `{"mobile":"${queryString}","team_id":"${teamId}","team_type":"${teamType}"}`
    return axios.post('/graphql/user', {
      query: `{
              blurrySearch(query: ${JSON.stringify(queryParams)}) {
                  mobile
                  wechat_nikename
                  id
                  last_team_id
                }
            }
          `
    })
  },

  /**
   * 用户中心
   */
  // 体验课学员
  trialCourseUsers(query = {}, page = 1) {
    const q = JSON.stringify(JSON.stringify(query))
    const sort = JSON.stringify(JSON.stringify({ ctime: 'desc' }))
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialStatisticsPage(query: ${q},page: ${page}, sort: ${sort}){
            totalPages
            totalElements
            content{
              id
              username
              user_num
              nickname
              head
              sex
              birthday
              base_painting
              mobile
              mobile_city
              mobile_province
              team_id
              team_name
              teacher_realname
              department_name
              team_type
              team_state
              term
              wechat_nikename
              express_id
              express_status
              trial_order_no
              system_order_no
              follow
              added_group
              added_wechat
              channel
              is_conversion
              conversion_type
              is_today_join_course
              is_today_complete_course
              has_today_course_task
              today_course_task_count
              system_team_id
              system_team_name
              system_order_no
              system_order_buytime
              system_teacher_id
              system_teacher_realname
              system_teacher_username
              system_teacher_department_id
              system_teacher_department_name
              system_order_packages_name
              device_type
              last_login_time
            }
          }
        }
      `
    })
  },

  trialCourseUsersV2(query = {}, page = 1, sortRules) {
    const q = JSON.stringify(JSON.stringify(query))
    const sort =
      Object.keys(sortRules).length === 0
        ? JSON.stringify(JSON.stringify({ ctime: 'desc' }))
        : JSON.stringify(JSON.stringify(sortRules))
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialV2StatisticsPage(query: ${q},page: ${page}, sort: ${sort}){
          totalPages
          totalElements
          number
          content {
            id
            user_label
            team_id
            order_no
            teacher_id
            term
            express_id
            express_status
            last_login_time
            user_intention_type
            user_intention_describe
            send_course_count
            join_course_count
            all_join_course_count
            complete_course_count
            all_complete_course_count
            task_count
            comment_count
            listen_comment_count
            last_join_time
            last_complete_time
            added_group
            added_wechat
            follow
            user_status
            is_track
            today
            tomorrow
            userInfo {
              id
              nickname
              username
              user_num
              sex
              birthday
              head
              mobile
              base_painting
              mobile_city
              mobile_province
            }
            teamInfo {
              team_name
              team_type
              team_state
            }
            teacherInfo {
              realname
              departmentInfo {
                name
              }
            }
            orderInfo {
              trial_course {
                order_no
              }
            }
            userLoginDataInfo {
              device_type
            }
            userIntention {
              type
              describe
              is_track
              today
              tomorrow
            }
            payChannelInfo {
              channel_inner_name
              channel_outer_name
            }
            expressInfo{
              express_status
            }
            questionnaire_count
          }
        }
      }`
    })
  },

  /**
   * 用户中心- 系统课学员列表
   * "page":1,
      "size":1,
      "startTime":1582549598011,
      "endTime":1584549598011,
      "nickname":"甜甜",//昵称
      "mobile":"188843729847",//手机
      "addedWechat":0,//是否加微信
      "addedGroup":1,//是否进群
      "follow":1,//是否关注公众号
      "expressStatus":3,//物流状态
      "isNoactive":0,//是否参课
      "isActive":0,//是否完课
      "isTask":0,//是否作品
      "isFlag":0,//是否点评
      "teamCategory":3,//班级类别
      "teacherId":343,//老师id
      "teacherName":"张三",//老师名称
      "term":3,//期数
      "sup":"",//难度
      "isRefund":2,//退费
      "status":0//排期状态
   **/
  systemCourseUsers(query = {}, page = 1) {
    // const params = Object.assign(query, { page })
    // return axios.post('/api/b/v1/student/center/system/list', params)
    const q = JSON.stringify(JSON.stringify(query))
    const sort = JSON.stringify(JSON.stringify({ ctime: 'desc' }))
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentSystemStatisticsPage(query: ${q},page: ${page}, sort: ${sort}){
            totalPages
            totalElements
            content {
              studentid
              username
              usernum
              nickname
              ctime
              utime
              basepainting
              birthday
              mobile
              mobilecity
              mobileprovince
              head
              sex
              currentsuper
              currentlevel
              currentunit
              currentlesson
              currenttotal
              orderid
              packagescourseweek
              packagescourseday
              packagesname
              packagestype
              sup
              teacherid
              teamid
              term
              addedgroup
              addedwechat
              teamname
              teamstate
              realname
              departmentname
              expressstatus
              expresscount
              follow
              isnoactive
              noactivecount
              isactive
              activecount
              istask
              taskcount
              isflag
              flagcount
              devicetype
              lastlogintime
              isrefund
              trialcurrentlesson
              trialteamname
              trialrealname
              trialdepartmentname
            }
          }
        }
      `
    })
  },

  /**
   * 学员详情
   */

  // 学员基本信息
  getUser(query = '') {
    const formattingQuery = JSON.stringify({ id: query })
    return axios.post('/graphql/v1/toss', {
      query: `{
        User(query:${JSON.stringify(formattingQuery)}){

          id
          head
          sex
          nickname
          username
          user_num
          mobile
          send_id
          weixinUser {
            follow
            nickname
            uid
          }
          coupon {
            id
          }
          account {
            balance
          }
          mobile_province
          mobile_city
          channelInfo {
            channel_inner_name
          }
          loginData {
            device_type
            device_model
          }
          birthday
          sender{
            username
            mobile
          }
          base_painting_text
          address {
            id
            receipt_name
            receipt_tel
            province
            city
            area
            address_detail
            street
          }
          trialCourse{
            team_id
            added_group
            added_wechat
            orderInfo {
              isrefund
            }
          }
          systemCourse{
            team_id
            added_group
            added_wechat
            orderInfo {
              isrefund
            }
          }
          teams{
             id
             team_type
             team_name
             team_state
             wd_info
             teacher_info{
                realname
                nickname
            }
            teacher_wechat_info{
                wechat_no
            }
            course_count
            send_course_count
            day_join_course_count
            day_complete_course_count
            course_task_count
            task_comment_count
            listen_comment_count
            current_lesson
          }
          join_date
          status_text
          couponUserCollect{
            code
            value
          }
          accountUserCollect{
            code
            value
          }
        }
      }`
    })
  },
  // 统计分析的学习记录
  getStudentTrialRecordPage(page = 1, term, sup, sort = 'desc', size = 9) {
    const formattingQuery = JSON.stringify({
      term,
      'sup.keyword': sup
    })
    const formattingSort = JSON.stringify({ ctime: sort })
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        StudentTrialRecordOperatorStatisticsPage(
          query:${JSON.stringify(formattingQuery)},
          page: ${page},
          size:${size},
          sort:${JSON.stringify(formattingSort)}
          )
          {
            totalPages
            totalElements
            content{
              id
              ctime
              utime
              course_id
              term
              sup
              image
              team_state
              lesson_type
              title
              send_date
              all_send_course_count
              today_join_course_count
              today_complete_course_count
              yesterday_join_course_count
            }
          }
        }`
    })
  },
  // 学习记录
  getSendCourseLogPage(
    query = '',
    teamId = '',
    page = 1,
    lessonType = 0,
    del = 0,
    sort = 'asc',
    size = '20'
  ) {
    const formattingQuery = JSON.stringify({
      student_id: query,
      team_id: +teamId,
      del: del,
      lesson_type: +lessonType
    })
    const formattingSort = JSON.stringify({ id: sort })
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        SendCourseLogPage(
          query:${JSON.stringify(formattingQuery)},
          sort:${JSON.stringify(formattingSort)},
          page: ${page},
          size:${size})
          {
            totalPages
            totalElements
            content{
              wd_info
              title
              ctime
              studentCompleteCourseLog{
                ctime
                is_today_join_course
                complete_time
                is_today_complete_course
              }
            }
          }
        }`
    })
  },
  // 作品集
  getStudentCourseTaskPage(
    query = '',
    teamId = '',
    page = 1,
    size = '20',
    del = 0
  ) {
    const formattingQuery = JSON.stringify({
      student_id: query,
      team_id: +teamId,
      del: del
    })
    const sort = `{ "ctime": "asc" }`
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        StudentCourseTaskPage(query:${JSON.stringify(formattingQuery)},
        sort: ${JSON.stringify(sort)},
          page: ${page},
          size:${size}){
            totalPages
            totalElements
            content{
              student_id
              task_image
              task_video
              taskComment{
                id
                sound_comment
                sound_comment_second
                type
                ctime
              }
              listenComment{
                id
                flag_id
              }
              sendCourseLog{
              wd_info
              title
            }
             is_day_upload_task
             ctime
          }
        }
      }`
    })
  },
  // del\": 0
  // team_id\":班级id
  // lesson_type 体验课 0 系统课 大于0
  // status\": 3
  // teams》
  // team_state 0 开课中 1代开课 2已结课
  // team_type  判断返回几个对象展示几个标签 0 体验课 大于0 系统课
  // wd_info  课程进度
  // 订单·物流数据
  getOrderPage(query = '', page = 1, size = '20', status = 3) {
    const formattingQuery = JSON.stringify({
      uid: query,
      status: status
    })
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        OrderPage(query:${JSON.stringify(formattingQuery)},
          page: ${page},
          size:${size}){
          totalPages
          totalElements
          content{
            id
            packages_name
            amount
            order_status
            out_trade_no
            ctime
            express{
              express_total
              last_express_status
            }
            team{
              team_name
              teacher_info{
                realname
                departmentInfo{
                  id
                  name
                }
              }
            }
          }
        }
      }`
    })
  },
  // 优惠券
  getUserAssetsCoupon(query = '', page = 1, size = 20) {
    const formattingQuery = JSON.stringify({
      uid: query
    })
    const sort = `{ "ctime": "desc" }`
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        CouponUserPage(query:${JSON.stringify(formattingQuery)},
          sort: ${JSON.stringify(sort)},
          page: ${page},
          size:${size}) {
            totalElements
            totalPages
            content{
              id
              status
              start_date
              end_date
              notity_date
              ctime
              utime
              coupon {
                name
                type
                amount
              }
              order {
                ctime
                packages_type
                packages_name
              }
            }
          }
      }`
    })
  },
  getUserAssetsCoin(query = '', page = 1, size = 20) {
    const formattingQuery = JSON.stringify({
      uid: query,
      trans_type: ['1', '2', '3', '4', '5', '6', '8', '9'], // 经和后端确认前端滤掉0和7
      account_type: 2
    })
    const sort = `{ "ctime": "desc" }`
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        AccountPage(query:${JSON.stringify(formattingQuery)},
        sort: ${JSON.stringify(sort)},
        page: ${page},
        size:${size}) {
          totalElements
          totalPages
          content {
            id
            trans_type
            desc
            amount
            update_date
          }
        }
      }`
    })
  },
  getNotifyPage(query) {
    return axios.get(
      `/api/toss/v1/toss-api/iCode/student/course/task/findIvrCallRecordByWhere?stime=${query.stime}&etime=${query.etime}&cdrStatus=${query.cdrStatus}&sjstime=${query.sjstime}&ejstime=${query.ejstime}&pageNum=${query.pageNum}&pageSize=${query.pageSize}&userId=${query.userId}`
    )
  },
  getSwitchStatus(query) {
    return axios.get(
      `/api/u/v1/user/getUserNotifySwitch?userId=${query.userId}`
    )
  },
  changeSwitchStatus(query) {
    return axios.get(
      `/api/u/v1/user/updateUserNotifySwitch?userId=${query.userId}&status=${query.status}`
    )
  },
  // 搜索老师自定义的标签
  getDefineLabelListEx(query = '') {
    // const query = {
    //   name,
    //   teacher_id: ''
    // }
    const q = query ? JSON.stringify(query) : ''
    const sort = `{ "id": "desc" }`
    return axios.post('/graphql/v1/toss', {
      query: `{
        DefineLabelListEx(query: ${JSON.stringify(q)}, sort: ${JSON.stringify(
        sort
      )}){
          id
          name
          teacher_id
        }
      }`
    })
  },

  /**
   * 获取当前登录老师（及下属老师）开课中或待开课的期数
   * {
   * teacher_id:[],
   * team_state: [0,1], 0-待开课，1-开课中，2-已结课
   * team_type: 0, 0-体验课，1-系统课
   * }
   * @return {
   *  status // '1 招生中   2待开课   3 开课中  4 已结课',
   * }
   **/
  ManagementForTeacherList({
    // teacher_id = [],
    team_state = [1, 2],
    team_type = 0
  } = {}) {
    const query = {
      // teacher_id,
      team_state,
      team_type
    }
    const params = JSON.stringify(query)
    // const sort = `{"id": "desc"}`
    return axios.post('/graphql/v1/toss', {
      query: `{
        ManagementForTeacherList(query: ${JSON.stringify(params)}){
           management{
            period_name
            period
            status
          }
        }
      }`
    })
  },
  // 创建用户意向度
  createUserInetention(query) {
    let q = `uid=${query.uid}&type=${query.type}&describe=${query.describe}&isTrack=${query.isTrack}`
    q += `&today=${query.today || ''}`
    q += `&tomorrow=${query.tomorrow || ''}`
    return axios.get(`/api/u/v1/user/userintention/create?${q}`)
  },
  // 更新用户意向度
  updateUserInetention(query) {
    let q = `uid=${query.uid}&type=${query.type}&describe=${query.describe}&isTrack=${query.isTrack}`
    q += `&today=${query.today || ''}`
    q += `&tomorrow=${query.tomorrow || ''}`
    return axios.get(`/api/u/v1/user/userintention/update?${q}`)
  },
  getQuestionnairePage(query) {
    return axios.get(
      `/api/f/v1/questionnaire/getQuestionnairePage?uid=${query.uid}&page=${query.page}&pagesize=${query.pagesize}&mobile=${query.mobile}`
    )
  },
  getQuestionnaireByUserId(query) {
    return axios.get(
      `/api/f/v1/questionnaire/getQuestionnaireByUserId?uid=${query.uid}&questionnaireId=${query.questionnaireId}&mobile=${query.mobile}`
    )
  },
  // 学员详情 修改地址
  updateExpressAddressNew(query) {
    return axios.get(`/api/ex/v1/express/updateExpressAddressNew`, query)
  }
}
