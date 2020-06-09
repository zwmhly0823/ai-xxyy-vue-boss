/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-01 19:08:45
 */
// import axios from '../axios'
import axios from '../axiosConfig'

export default {
  updateTeamStudent(params) {
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
            receipt_name
            receipt_tel
            province
            city
            area
            address_detail
          }
          trialCourse{
            team_id
            added_group
            added_wechat
          }
          systemCourse{
            team_id
            added_group
            added_wechat
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
    const sort = `{ "ctime": "asc" }`
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
      uid: query
    })
    const sort = `{ "ctime": "asc" }`
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
            uid
            trans_type
            desc
            account_type
            amount
            balance
            expected_amount
            update_date
          }
        }
      }`
    })
  }
}
