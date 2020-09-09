/* eslint-disable camelcase */
/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-08 22:06:30
 */
// import axios from '../axios'
import axios from '../../axiosConfig'
import { getAppSubjectCode, injectSubject } from '@/utils/index'
const subject = getAppSubjectCode()

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
  // 体验课学员 V2
  trialCourseUsersV2(query = {}, page = 1, sortRules) {
    // Object.assign(query || {}, { subject })
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
            userExtends{
              grade
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
              userExtends{
                grade
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
    const formattingQuery = JSON.stringify(injectSubject({ id: query }))
    return axios.post('/graphql/v1/toss', {
      query: `{
        User(query:${JSON.stringify(formattingQuery)}){
          systemCourse_lifeCycle
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
            login_time
          }
          birthday
          sender{
            id
            username
            mobile
            user_num
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
            id
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
            ctime
            team_id
            added_group
            added_wechat
            orderInfo {
              isrefund
            }
            remaining_week
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
          jluserInfo{
            avatar
            nick_name
            wechat_no
            remark
            labels
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
          query:${JSON.stringify(formattingQuery)}
          
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
          query:${JSON.stringify(formattingQuery)},
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
        CouponUserPage(
          query:${JSON.stringify(formattingQuery)},
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
  // 小熊币
  getUserAssetsCoin(query = '', page = 1, size = 20) {
    const formattingQuery = JSON.stringify({
      uid: query,
      trans_type: ['1', '2', '3', '4', '5', '6', '8', '9', '10', '11'], // 经和后端确认前端滤掉0和7
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
      team_type,
      subject
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
    return axios.get(`/api/u/v1/user/userfollowlog/createUserFollowLog`, query)
  },
  // 获取学员发展的下线
  getRecommendList(query) {
    return axios.post('/graphql/v1/toss', {
      query: `{
            UserList(query: ${JSON.stringify(
              JSON.stringify({ send_id: query })
            )},size:200){
            id
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
  getTrackList({ uid, page = 1, size = 10 } = {}) {
    return axios.post('/graphql/v1/toss', {
      query: `{
            UserFollowLogPage(
              query: ${JSON.stringify(JSON.stringify({ uid }))},
              size:${size},
              page:${page},
              sort:${JSON.stringify(JSON.stringify({ ctime: 'desc' }))}
              )
            {
            content{
              uid
              teacherInfo{
                realname
                duty_id
                departmentInfo{
                  name
                }
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
          JSON.stringify({ id: query })
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
              query: ${JSON.stringify(JSON.stringify({ studentid: query }))},
              sort:${JSON.stringify(JSON.stringify({ ctime: 'asc' }))}
              )
            {
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
              weixin {
                weixin_no
              }
              phone
            }
          }
      }`
    })
  }
}
