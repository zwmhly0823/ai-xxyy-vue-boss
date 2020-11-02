/*
 * @Descripttion: 班级V2.0
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-03 18:21:57
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-15 19:57:58
 */
import { injectSubject } from '@/utils/index'
import axios from '../axiosConfig'

export default {
  // 获取体验课班级列表
  getTrialTeamList(params = {}) {
    const { query = {}, page = 1, size = 5, sort = { ctime: 'desc' } } = params
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialTeamStatisticsPage(page: ${page}, size:${size},query: ${JSON.stringify(
        injectSubject(query)
      ) || null}, sort: ${JSON.stringify(JSON.stringify(sort))}) {
          first
          totalPages
          totalElements
          number
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
            sup
            term
            category
            teacher_wechat_no
            department_id
            pre_enroll
            #订单转化率
            order_conversion_rate
            #人数90/120
            pre_enroll
            enrolled
            #添加好友率
            added_wechat_rate
            #公众号添加率
            follow_rate
            #app打开率
            open_app_rate
            #盒子发货率
            delivered_start_rate
            #盒子签收率
            delivered_sign_rate
            #今日参课率
            today_join_course_rate
            #今日完课率
            today_complete_course_rate
            #今日打开app率
            today_open_app_rate
            teacher_realname
            department_name
          }
      }}`
    })
  },

  // 根据班级ID获取班级详情
  getTeamDetailById(params = {}) {
    // const query = { id: params.id }
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTeam(query: ${JSON.stringify(JSON.stringify(params)) || null}) {
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
            weixin{
              weixin_no
            }
          }
          teacher_wechat_info{
            wechat_no
          }
          managementInfo{
            course_day
            end_course_day
          }
        }
      }`
    })
  },

  // 获取班级详情 顶部 统计数据
  // getTeacherStatistic(teamId) {
  //   const queryParams = `[{id:${teamId}}]`
  //   return axios.get('/graphql/getClassTeacher', {
  //     query: `{
  //           detail (query: "${queryParams}"){
  //             id
  //             team_name
  //             team_state
  //             team_type
  //             teacher_wx
  //             enrolled
  //             teacher{
  //               id
  //               nickname
  //               weixin_ids
  //               weichat_num
  //               ctime
  //               realname
  //             }
  //             statictis {
  //               today_order
  //                 yesterday_order
  //                 order_all
  //                 wait_sent
  //                 unadd_wechat
  //                 unadd_group
  //                 unlogin
  //                 today_add_class
  //                 yesterday_add_class
  //                 tody_comp_class
  //                 yesterday_comp_class
  //                 tody_works
  //                 yesterday_works
  //                 tody_comment
  //                 yesterday_comment
  //               }
  //             }
  //           }`
  //   })
  // },

  /**
   * 根据班级ID获取班级转化的系统课订单
   * regtype:[2,3]
   */
  getTrialTeamOrderList(params = {}, page = 1, sort) {
    const regtype = {
      regtype: [2, 3]
    }
    const query = Object.assign({}, regtype, params || {})
    console.log(query)
    return axios.post('/graphql/v1/toss', {
      query: `{
        OrderPage(query: ${JSON.stringify(
          JSON.stringify(query)
        )}, page: ${page}, size: 20, sort: ${JSON.stringify(
        JSON.stringify(sort)
      )}) {
          totalElements
          totalPages
          number
          content {
            id
            uid
            user{
              id
              mobile
              username
              weixinUser{
                avatar
              }
            }
            out_trade_no
            packages_name
            product_name
            buytime
            ctime
            paymentPay{
              ctime
              buytime
            }
            status
            order_status
            teacher{
              realname
              department_name
            }
            team{
              id
              team_name
            }
          }
        }
      }`
    })
  },

  /**
   * 获取班级统计数据
   * 
    @type:  0-课前准备, 1-上课情况, 2-本班订单
   */
  getTrialTeamStatisticsExtra(params = {}, type = '0') {
    const query = Object.assign({}, params || {})
    const queryStr = JSON.stringify(JSON.stringify(query))
    // 根据不同的状态，请求对应的统计数据
    let fileds = ''
    if (type === '0') {
      fileds = `
        student_count
        to_be_delivered_count
        un_follow_count
        un_open_app_count
        no_address_count
        un_added_wechat_count
        un_added_group_count
        today_track_count
        tomorrow_track_count
      `
    }
    if (type === '1') {
      fileds = `
        student_count
        today_track_count
        tomorrow_track_count
        yesterday_join_course_uids
        yesterday_complete_course_uids
        yesterday_course_task_uids
        yesterday_task_comment_uids
        yesterday_listen_comment_uids
        yesterday_un_join_course_uids
        yesterday_un_complete_course_uids
        # yesterday_un_task_comment_uids
        yesterday_un_listen_comment_uids
        yesterday_un_open_app_uids
        today_join_course_uids
        today_complete_course_uids
        today_course_task_uids
        today_task_comment_uids
        today_listen_comment_uids
        today_un_join_course_uids
        today_un_complete_course_uids
        # today_un_task_comment_uids
        today_un_listen_comment_uids
        today_un_open_app_uids
        complete_course_count_group
        send_course_count_per_student
      `
    }
    if (type === '2') {
      fileds = `
        student_count
        total_system_order_count
        system_order_count
        system_order_amount
        yesterday_system_order_amount
        yesterday_system_order_count
        today_system_order_amount
        today_system_order_count
      `
    }
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialTeamStatisticsExtra(query: ${queryStr}){
          ${fileds}
        }
      }`
    })
  }
}
