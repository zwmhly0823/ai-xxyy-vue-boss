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
  }
}
