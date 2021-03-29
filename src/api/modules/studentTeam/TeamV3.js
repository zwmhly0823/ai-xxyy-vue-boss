import { injectSubject } from '@/utils/index'
import axios from '../../axiosConfig'

export default {
  /**
   * 体验课班级详情 V3
   */

  // 根据班级ID获取班级详情
  getStudentTrialTeamStatisticsById(params = {}) {
    // const query = { id: params.id }
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialTeamStatistics(query: ${JSON.stringify(
          injectSubject(params)
        ) || null}) {
          id
          ctime
          utime
          team_name
          team_type
          team_state
          teacher_id
          teacher_nickname
          teacher_realname
          teacher_wechat_id
          teacher_wechat_no
          department_name
          department_id
          system_order_count
          order_conversion_rate
          student_count
          course_day,
          # 开课时间
          end_course_day,
          # 结课时间
          start_date,
          # 招生开始时间
          end_date,
          # 招生结束时间
          # all_join_course_count
          # all_join_course_rate
          # all_complete_course_count
          # all_complete_course_rate
          # all_task_count
          # all_task_rate
          # all_multiple_task_count
          # all_commont_count
          student_task_count
          student_join_course_count
          student_complete_course_count
          unadd_wechat
          unadd_group
          follow_count
          to_be_delivered_count
          # 待发货总数
          delivered_start_count
          # 已发货总数
          delivered_sign_count
          # 已签收总数
          no_address_count
          # 无地址数
          open_app_count
          # 打开App数
          current_lesson
          category
        }
      }`
    })
  },
  // 获取体验课班级学员列表
  getTialTeamUserList(
    params = {},
    { page = 1, size = 20 } = {},
    sortRules = {}
  ) {
    const query = JSON.stringify(injectSubject(params))
    const sort =
      Object.keys(sortRules).length === 0
        ? JSON.stringify(JSON.stringify({ buytime: 'desc' }))
        : JSON.stringify(JSON.stringify(sortRules))

    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialV2StatisticsPage(query:${query}, page: ${page}, size: ${size}, sort: ${sort}){
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
            task_course_count
            task_count
            last_task_time
            # all_task_count
            comment_count
            listen_comment_count
            last_join_time
            last_complete_time
            last_comment_time
            last_listen_comment_time
            last_open_app_time
            open_app_count
            added_group
            added_wechat
            follow
            user_status
            is_track
            today
            tomorrow
            userInfo {
              id
              user_num_text
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
              send_id
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
              id
              address_id
              province
              city
              area
              address_detail
              receipt_name
              receipt_tel
            }
            questionnaire_count
            bi_label
            sys_label
            userExtends {
              wechat_id
              wechat_avatar
              wechat_nick_name
            }
          }
        }
      }`
    })
  },
  // 体验课班级 订单统计 信息
  getStudentTrialTeamStatisticsExtra(teamId) {
    if (!teamId) return
    const query = { id: teamId }
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialTeamStatisticsExtra(query: ${JSON.stringify(
          injectSubject(query)
        )}) {
          all_system_order_count
          payment_system_order_count
          payment_system_order_amount
          no_payment_order_count
          no_payment_order_amount
          refund_order_count
          refund_order_amount
          today_no_payment_order_count
          today_no_payment_order_amount
          today_payment_order_count
          today_payment_order_amount    
    }
      }`
    })
  },
  // 体验课班级订单列表  last_team_id
  getStudentTrailTeamOrderPage(params = {}, { page = 1, size = 20 } = {}) {
    const query = Object.assign({}, params)
    if (!Object.keys(query).includes('regtype')) {
      Object.assign(query, { regtype: [2, 3, 10, 11] })
    }
    return axios.post('/graphql/v1/toss', {
      query: `{
        OrderPage(query: ${JSON.stringify(
          injectSubject(query)
        )}, page: ${page}, size: ${size}){
          totalElements
          totalPages
          number
          content{
            id
            regtype
            last_team_id
            teacher_id
            last_teacher_id
            teacher{
              id
              realname
              nickname
              department_name
            }
            ctime
            buydate
            buytime
            out_trade_no
            type
            isrefund
            rmbRefundStatusText
            status
            order_status
            product_name
            packages_name
            amount
            student_team_name
            packages_course_week
            team{
              team_name
            }
            user{
              id
              user_num_text
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
              status
              send_id
            }
            subject
            subject_text
          }
        }
      }`
    })
  },
  logPageClassData(params = {}, page = 1, size = 20) {
    const query = JSON.stringify(injectSubject(params))
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTeamCourseStatisticsPage(query:${query}, page: ${page}, size: ${size}){
          totalPages
          totalElements
          number
          content {
            id
            title
            lesson_type
            send_date
            enrolled
            join_count
            complete_count
            task_student_count
            task_count
            today_join_count
            today_complete_count
            today_task_student_count
            today_task_count
            course_id
            new_today_join_count
            new_today_complete_count
          }
        }
      }`
    })
  },
  StudentTeamCourseStatistics(params = {}) {
    const query = JSON.stringify(injectSubject(params))
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTeamCourseStatistics(query:${query}){
          id
          course_id
          title
          enrolled
          current_lesson
          send_date
          join_count
          complete_count
          task_student_count
          today_join_count
          today_complete_count
          no_task_comment_student_count
          new_today_join_count
          new_today_complete_count
        }
      }`
    })
  },
  StudentTrialLearnListStatisticsPage(
    params = {},
    { page = 1, size = 20 } = {},
    sortRules = {}
  ) {
    const query = JSON.stringify(injectSubject(params))
    const sort =
      Object.keys(sortRules).length === 0
        ? JSON.stringify(JSON.stringify({ ctime: 'desc' }))
        : JSON.stringify(JSON.stringify(sortRules))
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialLearnListStatisticsPage(query:${query}, page: ${page}, size: ${size}, sort: ${sort}){
          totalPages
          totalElements
          number
          content {
            id
            join_course_count
            last_join_course_time
            complete_course_count
            last_complete_course_time
            task_count
            comment_count
            listen_comment_count
            userIntention {
              type
              describe
              is_track
              today
              tomorrow
            }
            user_status
            user_label
            bu_join_state
            first_join_course_time
            bu_complete_state
            first_complete_course_time
            userInfo {
              id
              user_num_text
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
              send_id
            }
            sys_label
            userExtends {
              id
              u_id
              head
              mobile
              user_num_text
              user_num
              send_id
            }
          }
        }
      }`
    })
  }

  /**
   * 体验课班级详情 V3 - END
   */
}
