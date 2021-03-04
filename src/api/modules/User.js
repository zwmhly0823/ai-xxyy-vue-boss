/* eslint-disable camelcase */
/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-04 18:07:44
 */
// import axios from '../axios'
import axios from '../axiosConfig'
import { getAppSubjectCode, injectSubject } from '@/utils/index'
const subject = getAppSubjectCode()
console.log(subject)
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
   * 多学科 新版
   */
  searchUserByPhone(queryString = '') {
    const query = {
      'mobile.like': { 'mobile.keyword': `*${queryString}*` }
    }
    const q = JSON.stringify(query)
    return axios.post('/graphql/v1/toss', {
      query: `{
        UserExtendsList(query:${JSON.stringify(injectSubject(q))}){
          id
          mobile
          username
        }
      }`
    })
  },
  /**
   * 模糊搜索用户手机号，获取用户信息
   */
  // searchUserByPhone(queryString = '') {
  //   const query = {
  //     bool: {
  //       must: [
  //         {
  //           wildcard: { mobile: `*${queryString}*` }
  //         }
  //       ]
  //     }
  //   }
  //   const q = JSON.stringify(query)
  //   return axios.post('/graphql/v1/toss', {
  //     query: `{
  //       UserListEx(query:${JSON.stringify(q)}){
  //         id
  //         mobile
  //         username
  //       }
  //     }`
  //   })
  // },
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
    const q = JSON.stringify(injectSubject(query))
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
    const q = JSON.stringify(injectSubject(query))
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
            last_listen_comment_time
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
              id
              trial_course {
                order_no
              }
            }
            userLoginDataInfo {
              device_type
              appversion
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
            bi_label
            sys_label
          }
        }
      }`
    })
  },

  // 全部学员
  studentAllUserList(query = {}, page = 1, sortRules) {
    const q = JSON.stringify(injectSubject(query))
    const sort =
      Object.keys(sortRules).length === 0
        ? JSON.stringify(JSON.stringify({ join_date: 'desc' }))
        : JSON.stringify(JSON.stringify(sortRules))
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentAllUserStatisticsPage(query: ${q},page: ${page}, sort: ${sort}){
          totalPages
          totalElements
          number
          content {
            id
            ctime
            utime
            uid
            channel
            join_date
            status
            oids
            teacher_ids
            last_teacher_ids
            pay_teacher_ids
            sale_department_ids
            last_department_ids
            is_trial
            is_system
            subject
            subject_text
            grade
            channelInfo {
              channel_outer_name
            }
            userInfo {
              id
              join_date
              status
              status_text
              user_num
              mobile
              username
              sex
              birthday
              teams {
                id
                team_name
                subject
                team_type
                team_type_text
                teacher_info {
                  realname
                  department_id
                  departmentInfo {
                    name
                  }
                }
              }
            }
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
  systemCourseUsers(query = {}, page = 1, sortRules = {}) {
    // const params = Object.assign(query, { page })
    // return axios.post('/api/b/v1/student/center/system/list', params)
    const q = JSON.stringify(injectSubject(query))
    const sort =
      Object.keys(sortRules).length === 0
        ? JSON.stringify(JSON.stringify({ ctime: 'desc' }))
        : JSON.stringify(JSON.stringify(sortRules))
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentSystemStatisticsPage(query: ${q},page: ${page}, sort: ${sort}){
            totalPages
            totalElements
            content {
              last_complete_time
              last_join_time
              flag_total_count
              pay_channel
              channel_outer_name
              life_cycle
              studentid
              user_num_text
              username
              usernum
              nickname
              userlabel
              usernum
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
              user_status
              department_id
              sys_label
              send_id
              remain_order_count
              user_info{
                sender{
                  id
                  username
                  user_num
                }
              }
              userLoginDataInfo {
                device_type
                appversion
              }
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
          jluserInfo {
            avatar
            nick_name
            wechat_no
            remark
            labels
          }
          bought_subject
          mobile_province
          mobile_city
          teams {
            subject
            id
            team_type
            team_name
            team_state
            wd_info
            teacher_info {
              realname
              nickname
            }
            teacher_wechat_info {
              wechat_no
            }
            course_count
            start_course_count
            send_course_count
            day_join_course_count
            day_complete_course_count
            course_task_count
            task_comment_count
            listen_comment_count
            current_lesson
          }
          zero_teamid_write_trials {
            start_course_count
            course_task_count
            task_comment_count
            listen_comment_count
            course_ids
            team_name
          }
          address {
            id
            receipt_name
            receipt_tel
            province
            city
            area
            address_detail
            street
            id
          }
        }
      }`
    })
  },
  // 学员基本信息——分类补充
  getUser_add(query) {
    const formattingQuery = JSON.stringify(query)
    return axios.post('/graphql/v1/toss', {
      query: `{
        UserExtends(query:${JSON.stringify(formattingQuery)}){
          head
          sex
          username
          user_num
          birthday
          mobile
          join_date
          weixinUser {
            follow
          }
          channelInfo {
            channel_inner_name
          }
          lastLoginData {
            device_model
            login_time
          }
          sender {
            username
            user_num
            u_id
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
          query:${JSON.stringify(injectSubject(formattingQuery))},
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
              join_course_count
              ad_join_course_count
              ad_today_join_course_count
              ad_today_complete_course_count
              ad_yesterday_join_course_count
            }
          }
        }`
    })
  },
  // 学习记录基本信息
  getStudentDetail(term, course_id, sup) {
    // console.log(query)
    const formattingQuery = JSON.stringify({
      term,
      course_id,
      sup: sup.toLowerCase()
    })
    console.log(formattingQuery)
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        StudentTrialRecordDetailBossStatistics(
          query:${JSON.stringify(injectSubject(formattingQuery))}
          
          )
          {
    id
    ctime
    utime
    course_id
    term
    sup
    team_state
    lesson_type
    title
    send_date
    image
    current_lesson
    week
    desc
    encyclopedias
    professional
    all_send_course_count
    join_course_count
    complete_course_count
    all_join_course_rate
    all_complete_course_rate
    task_count
    comment_count
    lesson_comment_count
    learn_course_count
    ad_count
    ad_join_course_count
      ad_complete_course_count
      ad_learn_course_count
      ad_all_join_course_rate
      ad_all_complete_course_rate
  }
          
        }`
    })
  },
  // 学习记录详情页
  getStudentTRecordList(query, teamName = '', sup, page = 1, sort = 'desc') {
    console.log(teamName)
    teamName &&
      Object.assign(query, {
        'team_name.like': { 'team_name.keyword': `*${teamName}*` }
      })
    const formattingQuery = JSON.stringify({
      ...query,
      sup: sup.toLowerCase()
    })
    console.log(formattingQuery)
    const formattingSort = JSON.stringify({ ctime: sort })
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        StudentTrialRecordListStatisticsPage(
          query:${JSON.stringify(injectSubject(formattingQuery))},
          page: ${page},
          size:20,
          sort:${JSON.stringify(formattingSort)}
          )
          {
             content {
      id
      cid
      mid
      ctime
      utime
      student_id
      course_id
      team_id
      team_name
      term
      sup
      team_state
      teacher_id
      realname
      department_id
      department_name
      user_num
      username
      nickname
      birthday
      base_painting
      mobile
      sex
      mobile_city
      mobile_province
      status
      state
      learn_course_count
      last_join_course_time
      complete_time
      task_count
      last_task_time
      comment_count
      lesson_comment_count
      ad_count
      ad_last_join_course_time
      ad_complete_time
      ad_join_course_count
      ad_complete_course_count
      ad_state

    }
    empty
    first
    last
    number
    size
    numberOfElements
    totalElements
    totalPages
          }
        }`
    })
  },
  // 学习记录(查普通系统课体验课+写字0元体验课)
  getSendCourseLogPage({
    page,
    subject,
    studentId,
    teamId, // 只普通用
    lessonType, // 只普通用
    courseId, // 只写字0元体验课用
    size = 20
  }) {
    const formattingQuery = JSON.stringify(
      courseId && courseId.length
        ? {
            del: 0,
            subject,
            student_id: studentId,
            team_id: 0,
            lesson_type: 0,
            // 写字0元体验课
            course_id: courseId
          }
        : {
            del: 0,
            subject,
            student_id: studentId,
            // normal 体验系统课
            team_id: teamId,
            lesson_type: lessonType,
            course_id: { lt: '99999990' }
          }
    )
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        SendCourseLogPage(
          query:${JSON.stringify(formattingQuery)},
          sort:${JSON.stringify(JSON.stringify({ id: 'asc' }))},
          page: ${page},
          size:${size})
          {
            totalPages
            totalElements
            content{
              wd_info
              title
              ctime
              start_date
              studentCompleteCourseLog{
                ctime
                is_today_join_course
                complete_time
                is_today_complete_course
                learn_course_count
                course_task_count
                task_comment_count
                state
              }
            }
          }
        }`
    })
  },
  // 作品集(查普通系统课体验课+写字0元体验课)
  getStudentCourseTaskPage({
    page,
    subject,
    studentId,
    teamId, // 只普通用
    courseId // 只写字0元体验课用
  }) {
    const formattingQuery = JSON.stringify(
      courseId && courseId.length
        ? {
            del: 0,
            subject,
            student_id: studentId,
            team_id: 0,
            // 写字0元体验课
            course_id: courseId
          }
        : {
            del: 0,
            subject,
            student_id: studentId,
            // normal 体验系统课
            team_id: teamId
          }
    )
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        StudentCourseTaskPage(query:${JSON.stringify(formattingQuery)},
        sort: ${JSON.stringify(`{ "ctime": "asc" }`)},
          page: ${page},
          size:20){
            totalPages
            totalElements
            content{
              id
              student_id
              task_image
              task_video
              taskComment{
                id
                sound_comment
                sound_comment_second
                type
                ctime
                teacherInfo{
                  realname
                }
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
  // 获取用户行为记录
  getUserBehaviorLogPage(params, page, size = 5, sort) {
    const query = params ? Object.assign({}, params || {}) : `""`
    const sortParams = Object.assign({}, sort || {}, { ctime: 'desc' })
    return axios.post('/graphql/v1/toss', {
      query: `{
        UserBehaviorLogPage(query: ${JSON.stringify(
          JSON.stringify(query)
        )}, page: ${page}, size: ${size}, sort: ${JSON.stringify(
        JSON.stringify(sortParams)
      )}){
          totalPages
          totalElements
          content{
            action_time
            action_type
            action_type_text
            device_model
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
            rmbRefundStatusText
            id
            isrefund
            invoice_status_text
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
  // 小熊币优惠券上头
  _reqGetUserTop(paramsObj) {
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        UserExtends(query:${JSON.stringify(JSON.stringify(paramsObj))}) {
           couponUserList{
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
           accountUserCollect{
             code
             value
           }
        }
      }`
    })
  },
  // 优惠券(↑从上面取了↑)
  // getUserAssetsCoupon(subject = '', query = '', page = 1, size = 20) {
  //   const formattingQuery = JSON.stringify({
  //     subject,
  //     uid: query
  //   })
  //   const sort = `{ "ctime": "desc" }`
  //   return axios.post(`/graphql/v1/toss`, {
  //     query: `{
  //       CouponUserPage(
  //         query:${JSON.stringify(formattingQuery)},
  //         sort: ${JSON.stringify(sort)},
  //         page: ${page},
  //         size:${size}) {
  //           totalElements
  //           totalPages
  //           content{
  //             id
  //             status
  //             start_date
  //             end_date
  //             notity_date
  //             ctime
  //             utime
  //             coupon {
  //               name
  //               type
  //               amount
  //             }
  //             order {
  //               ctime
  //               packages_type
  //               packages_name
  //             }
  //           }
  //         }
  //     }`
  //   })
  // },
  // 小熊币
  getUserAssetsCoin(
    subject = '',
    query = '',
    page = 1,
    trans_type,
    ctime,
    size = 20
  ) {
    console.info('小熊币接口触发trans_type值', trans_type)
    const formattingQuery = JSON.stringify({
      subject,
      uid: query,
      trans_type,
      ctime,
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
   * team_type: 0, 0-体验课，2-系统课
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
      team_type,
      subject
    }
    // const params = JSON.stringify(query)
    const params = injectSubject(query)
    // const sort = `{"id": "desc"}`
    return axios.post('/graphql/v1/toss', {
      query: `{
        ManagementForTeacherList(query: ${JSON.stringify(params)}){
           management{
            period_name
            period
            status
            subject
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
    return axios.get(`/api/u/v2/user/userintention/create?${q}`)
  },
  // 更新用户意向度
  updateUserInetention(query) {
    let q = `uid=${query.uid}&type=${query.type}&describe=${query.describe}&isTrack=${query.isTrack}`
    q += `&today=${query.today || ''}`
    q += `&tomorrow=${query.tomorrow || ''}`
    return axios.get(`/api/u/v2/user/userintention/update?${q}`)
  },
  // 学员详情 修改地址
  updateExpressAddressNew(query) {
    return axios.get(`/api/ex/v1/express/updateExpressAddressNew`, query)
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
  // 提交跟踪表单
  submitForm(query) {
    return axios.get(`/api/u/v2/user/userfollowlog/createUserFollowLog`, query)
  },
  // 获取学员发展的下线
  getRecommendList(query) {
    return axios.post('/graphql/v1/toss', {
      query: `{
            UserExtendsList(query: ${JSON.stringify(
              JSON.stringify(query)
            )},size:200){
            u_id
            user_num
            username
           }
      }`
    })
  },
  // 获取除了艾克外的所有标签4种
  listLabelsForUser(userId) {
    return axios.get(
      `/api/toss/v1/toss-api/label/listLabelsForUser?userId=${userId}&teacherId=111`
    )
  },
  // track_flow_list
  getTrackList({ uid, subject, page = 1, size = 10 } = {}) {
    return axios.post('/graphql/v1/toss', {
      query: `{
            UserFollowLogPage(
              query: ${JSON.stringify(JSON.stringify({ uid, subject }))},
              size:${size},
              page:${page},
              sort:${JSON.stringify(JSON.stringify({ ctime: 'desc' }))}
              )
            {
            content{
              uid
              label_text
              createTeacherInfo{
                realname
                duty_id
                departmentInfo{
                  name
                }
              }
              createStaffInfo {
                real_name
              }
              contact_type
              point_type
              finish_type
              content
              ctime
            }
            totalElements
           }
      }`
    })
  },

  /**
   * v2.2 新增 - 自定义人群组
   * teacherId -老师ID
   * name - 组名
   * expression - 条件数据 String
   * remark - 备注
   * type - 自定义类型: PERSONAL(个人)，DEPARTMENT(部门)，ADVANCEDSEARCH(高级搜索)
   */
  addTeacherFollowGroup(params) {
    return axios.post('/api/t/v1/teacher/teacherFollowGroup/add', params)
  },

  /**
   * v2.2 编辑 - 自定义人群组
   * id - 群组id
   * name - 组名
   * expression - 条件数据 String
   * remark - 备注
   */
  updateTeacherFollowGroup(params = {}) {
    return axios.post('/api/t/v1/teacher/teacherFollowGroup/update', params)
  },

  // 获取自定义人群组信息
  getTeacherFollowGroup(id) {
    if (!id) return
    return axios.get(`/api/t/v1/teacher/teacherFollowGroup/get?id=${id}`)
  },

  // 删除自定义人群组信息
  deleteTeacherFollowGroup(id) {
    if (!id) return
    return axios.get(`/api/t/v1/teacher/teacherFollowGroup/delete?id=${id}`)
  },

  // 根据teacherId和类型,查询老师跟进组信息
  // type: PERSONAL(个人)，DEPARTMENT(部门)
  getAllFollowGroup(teacherId, type = 'PERSONAL') {
    if (!teacherId) return
    return axios.get(
      `/api/t/v1/teacher/teacherFollowGroup/findAllByTeacherIdAndType?teacherId=${teacherId}&type=${type}`
    )
  },
  // 截图转介绍
  getTable(parmas) {
    return axios.get('/api/b/v1/backend/userflow/sharereward/pageList', parmas)
  },
  JLLabelRecordInfoList(query) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        JLLabelRecordInfoList(query: ${JSON.stringify(
          JSON.stringify({ label_id: query })
        )},size:1000){
          uid
        }
      }`
    })
  },
  // 学员详情_详细信息_体验课
  StudentTrialV2Statistics(query) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialV2Statistics(query: ${JSON.stringify(
          JSON.stringify(query)
        )}){
            sup
            id
            buytime
            payChannelInfo {
              channel_inner_name
            }
            teacherInfo {
              realname
              departmentInfo {
                name
              }
              weixin {
                weixin_no
              }
              phone
            }
            managementInfo {
              course_day
              end_course_day
            }
            teamInfo {
              id
              team_name
            }
            orderInfo {
              packages_name
            }
            all_join_course_count
            join_course_count
            send_course_count
            start_course_count
            all_complete_course_count
            complete_course_count
            task_count
            comment_count
            listen_comment_count
            current_lesson
            added_group
            added_wechat
            express_status
        }
      }`
    })
  },

  // 系统课
  StudentSystemStatisticsList(query) {
    return axios.post('/graphql/v1/toss', {
      query: `{
            StudentSystemStatisticsList(
              query: ${JSON.stringify(JSON.stringify(query))},
              sort:${JSON.stringify(JSON.stringify({ ctime: 'asc' }))}
              )
            {
            remaining_week
            departmentname
            addedgroup
            addedwechat
            expressstatus
            currentlevel
            currentsuper
            currentunit
            currentlesson
            teamid
            teamname
            noactivecount
            all_noactivecount
            activecount
            all_activecount
            taskcount
            flag_total_count
            flagcount
            currenttotal
            start_course_count
            channel_outer_name
            orderInfo {
              packages_name
              buytime
            }
            managementInfo {
              course_day
              end_course_day
            }
            teacherInfo {
              realname
              departmentInfo {
                name
              }
              phone
            }
            teacherWeixinRelationInfo {
              weixin_no
            }
            casualTeacherInfo {
              realname
            }
          }
      }`
    })
  },
  taskDelete(taskId) {
    return axios.post(
      `/api/ts/v1/teaching/student/task/delete?taskId=${taskId}`
    )
  },
  // 2021/3/3 新增
  // 提现记录
  getUserAssetsCashRecord(subject = '', uid = '', page = 1, size = 20) {
    const formattingQuery = JSON.stringify({
      subject,
      uid,
      account_type: 1,
      trans_type: [1, 3, 4, 8]
    })
    const sort = `{ "ctime": "desc" }`
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        AccountPage(query:${JSON.stringify(formattingQuery)},
        sort: ${JSON.stringify(sort)},
        page: ${page},
        size:${size}) {
          totalElements
          content {
            trans_type
            desc
            amount
            ctime
          }
        }
      }`
    })
  },
  // 审批记录列表
  approvalRecordList(params = {}, size = 20, page = 1, sort) {
    const q = JSON.stringify(injectSubject(params))
    return axios.post('/graphql/v1/toss', {
      query: `{
      FlowApprovalPage(query:${q},size:${size},page:${page},sort:${JSON.stringify(
        sort
      )}) {
        totalPages
        totalElements
        content{
          id
          type
          status
          apply_name
          apply_department
          ctime
          end_time
          abstract_content
        }
      }
      }`
    })
  },
  
  // 转介绍记录tab给index取转介绍相关数据
  getDataStatiscsForDetailInDex(query) {
    console.warn('查询转介绍人数据对象')
    return axios.post('/graphql/v1/toss', {
      query: `{
        Order(
          query: ${JSON.stringify(JSON.stringify(query))}
        ){
          pay_channel_user_extends {
            u_id
            user_num
            username
          }
        }
      }`
    })
  },
  // 学员详情-转介绍记录列表
  OrderPageRecord(query, page, size) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        OrderPage(
          query: ${JSON.stringify(JSON.stringify(query))},
              size:${size},
              page:${page}
        ){
          totalElements
          content {
            user {
              id
              mobile
              user_num
              status
            }
            buytime
            sup_text
            packages_name
            channelDetail {
              channel_outer_name
            }
          }
        }
      }`
    })
  },
  // 体验课list by shentong
  StudentTrialList(query) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialV2StatisticsList(query: ${JSON.stringify(
          JSON.stringify(query)
        )}){
            sup
            id
            buytime
            teacherInfo {
              realname
              departmentInfo {
                name
                parentDepartmentInfo {
                  name
                  parentDepartmentInfo {
                    name
                  }
                }
              }
              weixin {
                weixin_no
              }
              phone
            }
            managementInfo {
              course_day
              end_course_day
            }
            teamInfo {
              id
              team_name
              team_type
              class_start
              class_end
              stop_end_time
            }
            orderInfo {
              packages_name
            }
            all_join_course_count
            join_course_count
            send_course_count
            start_course_count
            all_complete_course_count
            complete_course_count
            task_count
            comment_count
            listen_comment_count
            current_lesson
            added_group
            added_wechat
            express_status
            course_state
            last_join_time
            last_complete_time
            remaining_week
            ctime
            team_id
        }
      }`
    })
  },
  // 钻石
  getUserAssetsDiamond(subject = '', uid = '', page = 1, size = 20) {
    const formattingQuery = JSON.stringify({
      subject,
      uid,
      account_type: 3,
      trans_type: [1, 5, 9]
    })
    const sort = `{ "ctime": "desc" }`
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        AccountPage(query:${JSON.stringify(formattingQuery)},
        sort: ${JSON.stringify(sort)},
        page: ${page},
        size:${size}) {
          totalElements
          content {
            trans_type
            desc
            amount
            ctime
          }
        }
      }`
    })
  },
  // 学员详情
  sysStudentDetails(query = {}) {
    const q = JSON.stringify(injectSubject(query))
    return axios.post('/graphql/v1/toss', {
      query: `{  StudentDetails(query: ${q}) {
        systemCourseOfStudentDetails {
              course_state
              current_super
              current_progress
              send_course_count
              join_course_count
              complete_course_count
              buy_system_order_weeks
              logic_end_course_time
              task_count
              comment_count
              listen_comment_count
              casualTeacherInfo {
                realname
              }
              teamInfo {
                id
                team_name
                team_type
                class_end
                teacher_wechat_info {
                  wechat_no
                }
                teacher_info {
                  phone
                  realname
                  departmentInfo {
                    name
                    parentDepartmentInfo {
                      name
                      parentDepartmentInfo {
                        name
                      }
                    }
                  }
                }
              }
              readyTeamInfo {
                id
                team_type
                team_name
                team_state
              }
              added_group
              added_wechat
              first_order_buytime
              system_order_count
              remaining_week
              first_send_course_time
            }
            trialOfStudentDetails {
              course_state
              current_super
              current_progress
              send_course_count
              join_course_count
              remaining_week
              complete_course_count
              task_count
              comment_count
              listen_comment_count
              logic_end_course_time
              teamInfo {
                id
                team_name
                class_end
                team_type
                teacher_wechat_info {
                  wechat_no
                }
                teacher_info {
                  phone
                  realname
                  departmentInfo {
                    name
                    parentDepartmentInfo {
                      name
                      parentDepartmentInfo {
                        name
                        parentDepartmentInfo{
                          name
                        }
                      }
                    }
                  }
                }
              }
              orderInfo{
                buytime
                packages_course_week
              }
              added_group
              added_wechat
              userIntention {
                id
                describe
                type
                today
              }
              first_send_course_time
            }
          }
        }`,
      variables: null
    })
  },
  // 订单·物流数据
  getExpressPage(query = '', page = 1, size = '20', status = 3) {
    const sort = `{ "ctime": "desc" }`
    const formattingQuery = JSON.stringify({
      user_id: query.id,
      source_type: query.regtype
    })
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        ExpressPage(query:${JSON.stringify(formattingQuery)},
          sort: ${JSON.stringify(sort)},
                page: ${page},
                size:${size}){
                totalPages
                totalElements
                content {
                  id
                  address_id
                  order_id
                  source_type
                  product_name
                  replenish_type
                  product_type
                  receipt_name
                  receipt_tel
                  province
                  city
                  area
                  address_detail
                  express_remark
                  express_status
                  express_status_text
                  ctime
                  express_company
                  express_nu
                  express_total
                  center_product_code
                  center_ctime
                  delivery_collect_time
                  signing_time
                }
              }
      }`
    })
  },
  // 获取系统课学员左侧人数统计
  systemStudentSystemPageMenu(query = {}) {
    // const params = Object.assign(query, { page })
    // return axios.post('/api/b/v1/student/center/system/list', params)
    const q = JSON.stringify(injectSubject(query))
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentSystemPageMenu(query: ${q}) {
            total_count
            today_new_count
            started_count
            un_started_count
            finish_count
            refund_count
            day7_no_join_count
            day15_no_join_count
            day30_no_join_count
            un_upload_count
            current_week_no_upload_count
            current_month_no_upload_count
          }
        }
      `
    })
  },
  // 获取该老师的自定义排版  返回list
  getTeacherFollowGroups(params) {
    return axios.get('/api/t/v1/teacher/teacherFollowGroup/getList', params)
  },
}
