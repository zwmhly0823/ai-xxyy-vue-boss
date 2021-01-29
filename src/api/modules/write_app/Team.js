/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-21 11:58:33
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-11 17:28:49
 * @Description: 班级
 */
import axios from '../../axiosConfig'
import { getAppSubjectCode, injectSubject } from '@/utils/index'
const subject = getAppSubjectCode()

export default {
  // 加好友进群 新接口  体验课 改版2.0写字
  StudentTrialV2StatisticsPage({ querysData, currentPage, sortGroup }) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialV2StatisticsPage(query:${JSON.stringify(
          querysData
        )} , page: ${currentPage}, size: 20,${sortGroup}) {
          empty
          first
          last
          number
          size
          numberOfElements
          totalElements
          totalPages
          content {
            data_id
            id
            ctime
            utime
            added_group
            added_wechat
            team_id
            teacher_id
            sup
            term
            current_lesson
            course_state
            team_category
            remaining_week
            buytime
            orderInfo {
              out_trade_no
            }
            order_no
            fast_follow_time
            follow
            userExtends {
              grade
              birthday
              channel
              head
              join_date
              mobile
              nickname
              page_origin
              page_origin_id
              send_id
              sex
              status
              username
              weixin_openid
              weixin_unionid
              user_num
              base_painting
              import_remark
              import_time
              weixinUser {
                nickname
              }
            }
          }
        }
      }`
    })
  },
  // 加好友进群 新接口  系统课 改版2.0写字
  StudentSystemStatisticsPage({ querysData, currentPage, sortGroup }) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentSystemStatisticsPage(query:${JSON.stringify(
          querysData
        )} , page: ${currentPage}, size: 20,${sortGroup}) {
          empty
          first
          last
          number
          size
          numberOfElements
          totalElements
          totalPages
          content {
            studentid
            ctime
            utime
            addedgroup
            addedwechat
            teamid
            teacherid
            sup
            term
            currentsuper
            currentlevel
            currentunit
            currentlesson  
            course_state
            orderInfo {
              out_trade_no
              buytime
            }   
            orderid
            follow
            userExtends {
              birthday
              channel
              head
              join_date
              mobile
              nickname
              page_origin
              page_origin_id
              send_id
              sex
              status
              username
              weixin_openid
              weixin_unionid
              user_num
              base_painting
              import_remark
              import_time
              weixinUser{
                nickname
                fastFollowTime
              }
              grade
            }
          }
        }
      }`
    })
  },
  // 加好友进群 新接口  体验课
  StudentTrialForTeamStatisticsPage({ querysData, currentPage, sortGroup }) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialForTeamStatisticsPage(query:${JSON.stringify(
          querysData
        )} , page: ${currentPage}, size: 20,${sortGroup}) {
          empty
          first
          last
          number
          size
          numberOfElements
          totalElements
          totalPages
          content {
            id
            student_id
            ctime
            utime
            added_group
            added_group_time
            added_wechat
            added_wechat_time
            team_id
            teacher_id
            sup
            term
            current_lesson
            course_state
            team_category
            remaining_week
            birthday
            channel
            country
            head
            join_date
            mobile
            nickname
            page_origin
            page_origin_id
            send_id
            sex
            status
            username
            weixin_openid
            weixin_unionid
            user_num
            base_painting
            base_painting_text
            import_remark
            import_time
            mobile_city
            mobile_province
            buytime
            out_trade_no
            order_id
            fast_follow_time
            follow
            wechat_nickname
          }
        }
      }`
    })
  },
  // 加好友进群 新接口  系统课
  StudentSystemForTeamStatisticsPage({ querysData, currentPage, sortGroup }) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentSystemForTeamStatisticsPage(query:${JSON.stringify(
          querysData
        )} , page: ${currentPage}, size: 20,${sortGroup}) {
          empty
          first
          last
          number
          size
          numberOfElements
          totalElements
          totalPages
          content {
            mobile
            student_id
            nickname
            sex
            head
            birthday
            base_painting
            buytime
            base_painting_text
            added_wechat
            added_wechat_time
            added_group
            added_group_time
            follow
            fast_follow_time
          }
        }
      }`
    })
  },
  // 新版班级详情
  getTeamDetailById(params) {
    const query = { id: params.id }
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTeam(query: ${JSON.stringify(JSON.stringify(query)) || null}) {
          id
          ctime
          utime
          team_name
          team_type
          teacher_id
          teacher_wechat_id
          pre_enroll
          enrolled
          added_wechat
          unadd_wechat
          added_group
          unadd_group
          enroll_state
          team_state
          current_lesson
          progress
          sup
          term
          category
          teacher_info{
            realname
          }
          managementInfo{
            course_day
            end_course_day
          }
        }
      }`
    })
  },
  // 获取系统课班级列表
  getSystemTeamList(params = {}) {
    const {
      term = [],
      department = [],
      teacherId = '',
      teacherIdArr = [],
      sup = [],
      teamName = '',
      teamState = '0',
      courseDay = '',
      category = '',
      page = 1,
      size = '20',
      sort = `{"ctime":"desc"}`
    } = params
    const query = { team_state: teamState.split(','), subject }
    teamName &&
      Object.assign(query, {
        'team_name.like': { 'team_name.keyword': `*${teamName}*` }
      })
    courseDay && Object.assign(query, { courseDay })
    category && Object.assign(query, { category })
    term.length && Object.assign(query, { term })
    department.length && Object.assign(query, { department_id: department })
    sup.length && Object.assign(query, { 'sup.keyword': sup })
    // 社群销售下的过滤
    teacherId && Object.assign(query, { teacher_id: teacherId })
    console.log(teacherIdArr)
    // 老师权限下的过滤 TODO:
    !teacherId &&
      teacherIdArr.length &&
      Object.assign(query, { teacher_id: teacherIdArr })
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentSystemTeamStatisticsPage(page: ${page}, size:${size},query: ${JSON.stringify(
        JSON.stringify(query)
      ) || null}, sort: ${JSON.stringify(sort)}) {
          first
          totalPages
          totalElements
          content {
            id
            ctime
            utime
            team_name
            team_type
            teacher_id
            teacher_wechat_id
            pre_enroll
            enrolled
            added_wechat
            unadd_wechat
            added_group
            unadd_group
            enroll_state
            team_state
            current_lesson
            progress
            sup
            term
            category
            teacher_realname
            teacher_nickname
            teacher_username
            teacher_wechat_no
            department_id
            department_name
            student_count
            pre_enroll
            today_complete_course_count
            yesterday_complete_course_count
            to_be_delivered_count
            course_day
            end_course_day
          }
      }}`
    })
  },
  // 获取体验课班级列表
  getTrialTeamList(params = {}) {
    const {
      term = [],
      department = [],
      teacherId = '',
      teacherIdArr = [],
      sup = [],
      teamName = '',
      teamState = '0',
      courseDay = '',
      page = 1,
      size = '20',
      sort = `{"ctime":"desc"}`
    } = params
    /** 写字项目query需要subject参数 */
    const query = { team_state: teamState.split(','), subject }
    teamName &&
      Object.assign(query, {
        'team_name.like': { 'team_name.keyword': `*${teamName}*` }
      })
    courseDay && Object.assign(query, { courseDay })
    term.length && Object.assign(query, { term })
    department.length && Object.assign(query, { department_id: department })
    sup.length && Object.assign(query, { 'sup.keyword': sup })
    // 社群销售下的过滤
    teacherId && Object.assign(query, { teacher_id: teacherId })
    // 老师权限下的过滤 TODO:
    !teacherId &&
      teacherIdArr.length &&
      Object.assign(query, { teacher_id: teacherIdArr })

    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialTeamStatisticsPage(page: ${page}, size:${size},query: ${JSON.stringify(
        JSON.stringify(query)
      ) || null}, sort: ${JSON.stringify(sort)}) {
          first
          totalPages
          totalElements
          content {
            id
            ctime
            utime
            team_name
            team_type
            teacher_id
            teacher_wechat_id
            pre_enroll
            enrolled
            added_wechat
            unadd_wechat
            added_group
            unadd_group
            enroll_state
            team_state
            current_lesson
            progress
            sup
            term
            category
            teacher_realname
            teacher_nickname
            teacher_username
            teacher_wechat_no
            department_id
            department_name
            student_count
            pre_enroll
            system_order_count
            order_conversion_rate
            today_complete_course_count
            yesterday_complete_course_count
            to_be_delivered_count
            course_day
            end_course_day
          }
      }}`
    })
  },
  // 获取体验课状态列表
  getExperienceStatusList(params) {
    return axios.post(`/graphql/team`, params)
  },
  // 学员列表获取所有优惠券
  getAllCoupons(params) {
    return axios.get(`/api/s/v1/coupon/getAllCoupons?page=${params}`)
  },
  // 批量发放优惠券
  sendCoupon(id, endDate, params) {
    return axios.post(
      `/api/s/v1/coupon/send/batch/sendCoupon?couponId=${id}&endDate=${endDate}`,
      params
    )
  },
  // 加好友进群接口
  getuserListForTeam({ querysData, currentPage, sortGroup }) {
    return axios.post('/graphql/user', {
      query: `{
        userListForTeam(query:${JSON.stringify(
          querysData
        )} , page: ${currentPage}, size: 20,${sortGroup}) {
          empty
          first
          last
          number
          size
          numberOfElements
          totalElements
          totalPages
          content {
            id
            nickname
            sex
            birthday
            head
            mobile
            base_painting
            follow
            added_group
            added_wechat
            buytime
            added_wechat_time
            added_group_time
            follow_time
            order_id
          }
        }
      }`
    })
  },
  // 物流接口
  getStuExpressPage({ querysData, currentPage }) {
    return axios.post('/graphql/express', {
      query: `{
        stuExpressPage(query:${JSON.stringify(
          querysData
        )} , page: ${currentPage}, size: 20) {
        empty
        first
        last
        number
        size
        numberOfElements
        totalElements
        totalPages
        content {
          id
          head
          nickname
          username
          address_detail
          province
          city
          area
          express_status
          ctime
          mobile
          user_id
          order_id
          receipt_tel
          receipt_name
          product_name
          address_id
          street
          order_ctime
        }
      }
    }`
    })
  },
  // 打开APP接口
  getStuLoginPage({ querysData, currentPage }) {
    return axios.post('/graphql/getClassLogin', {
      query: `{
    stuLoginPage(query:${JSON.stringify(
      querysData
    )}, page: ${currentPage}, size: 20) {
          first
          last
          number
          size
          totalPages
          totalElements
          content {
            id
            head
            username
            nickname
            ctime
            mobile
            status
            login_time
            express_ctime
            first_login_time
            page_origin
            order_ctime
          }
        }
      }`
    })
  },
  // 参课和完课接口
  getClassCompPage({ querysData, currentPage }) {
    return axios.post('/graphql/getClassComplete', {
      query: `{
      getClassCompPage(query:${JSON.stringify(
        querysData
      )}, page: ${currentPage}, size: 20) {
        first
        last
        number
        size
        totalPages
        totalElements
        content {
          mobile
          buy_time
          username
          nickname
          head
          status
          course_id
          course_title
          course_begin_time
          course_current_num
          join_course_state
          join_course_time
          complete_course_state
          complete_course_time
          student_id
          is_start_course
          start_date
        }
      }
    }`
    })
  },
  // 作品及点评接口
  getStuCommentPage({ querysData, currentPage }) {
    return axios.post('/graphql/getStuComment', {
      query: `{
      getStuCommentPage(query:${JSON.stringify(
        querysData
      )}, page: ${currentPage}, size: 20) {
        empty
        first
        last
        number
        size
        numberOfElements
        totalElements
        totalPages
        content {
          id
          team_name
          current_lesson
          buytime
          classTitle
          course_current_num
          start_course_date
          status
          head
          mobile
          username
          nickname
          task_image
          works_ctime
          task_sound
          task_video
          task_video_second
          task_sound_second
          has_comment_ctime
          has_comment_utime
          has_listen_time
          sound_comment
          sound_comment_second
          student_id
          teacher_id
          teacher_name
          start_date
          listenInfoArr {
            task_image
            works_ctime
            task_sound
            task_video
            task_video_second
            task_sound_second
          }
        }
      }
    }`
    })
  },
  // 生成完课榜 / 生成作品展
  finishClassList({ queryParams }) {
    return axios.post('/graphql/getStuRankingList', {
      query: `{
                getStuComRankingList(query : ${JSON.stringify(queryParams)}){
                student_id
                mobile
                username
                head
                completeArr {
                current_lesson
                is_complete
                }
            }
          }`
    })
  },
  exhibitionOfWorks({ QueryParams }) {
    return axios.post('/graphql/getStuRankingList', {
      query: `{
            getStuTaskRankingList(query : ${JSON.stringify(QueryParams)}){
            student_id
            mobile
            username
            head
            completeArr {
            current_lesson
            task_image
                }
                }
                  }`
    })
  },
  // 获取课程下拉框接口
  getStuCourseList({ query }) {
    return axios.post('/graphql/getStuComment', {
      query: `{
        getStuCourseList(query:${JSON.stringify(query)}) {
          course_id
          classTitle
        }
      }`
    })
  },

  // 获取体验课列表
  getTrialCourseList(query = '', size = 20) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialCourseList(query: ${JSON.stringify(
          injectSubject(query)
        )}, size: ${size}) {
          student_id
          team_id
          order_no
        }
      }`
    })
  },

  // 获取班级信息
  getStudentTeamV1(query = '') {
    const sort = `{"term": "desc", "sup.keyword": "asc", "id": "desc" }`
    return axios.post('/graphql/v1/toss', {
      query: `
        {
          StudentTeamList(query: ${JSON.stringify(
            query
          )}, sort: ${JSON.stringify(sort)}) {
            id
            team_name
          }
        }
      `
    })
  },

  // 获取班级信息 - 模糊搜索
  getStudentTeamV1Search(query = '') {
    const sort = `{"term": "desc", "sup.keyword": "asc", "id": "desc" }`
    return axios.post('/graphql/v1/toss', {
      query: `
        {
          StudentTeamListEx(query: ${JSON.stringify(
            query
          )}, sort: ${JSON.stringify(sort)}) {
            id
            team_name
            teacher_id
          }
        }
      `
    })
  },
  // 获取班级详情 顶部 统计数据
  getTeacherStatistic(teamId) {
    const queryParams = `[{id:${teamId}}]`
    return axios.get('/graphql/getClassTeacher', {
      query: `{
            detail (query: "${queryParams}"){
              id
              team_name
              team_state
              team_type
              teacher_wx
              enrolled
                teacher{
                  id
                  nickname
                  weixin_ids
                  weichat_num
                  ctime
                  realname
                }
              statictis {
                today_order
                  yesterday_order
                  order_all
                  wait_sent
                  unadd_wechat
                  unadd_group
                  unlogin
                  today_add_class
                  yesterday_add_class
                  tody_comp_class
                  yesterday_comp_class
                  tody_works
                  yesterday_works
                  tody_comment
                  yesterday_comment
                }
              }
            }`
    })
  }
}
