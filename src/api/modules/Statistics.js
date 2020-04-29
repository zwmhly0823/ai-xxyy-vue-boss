/*
 * @Descripttion: 统计模块
 * @version:
 * @Author: Shentong
 * @Date: 2020-04-07 13:52:26
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-29 13:57:29
 */
import axios from '../axiosConfig'

export default {
  /**
   * 统计模块
   * */
  getCodeByPhone(params) {
    return axios.post(`/api/t/v1/teacher/sendCode?mobile=${params.mobile}`)
  },
  // 通过状态 获取 期号list
  getPriodByStatus(params) {
    const { status = 'on_going' } = params
    const query = `{"status": "${status}"}`

    return axios.post('/graphql/v1/toss', {
      query: `{
        ManagementStatusList(query: ${JSON.stringify(query) || null}) {
          period
          end_date
          start_date
          period_name
          course_day
          end_course_day
      }}`
    })
  },
  // 通过期号，获取table (转化统计接口)
  getChangecListByProid(params) {
    const {
      status = 'on_going',
      period = '',
      page = 1,
      size = '20',
      teacher = '',
      department = '',
      sup = ''
    } = params
    const query = `{"status": "${status}", "period": "${period}","department": "${department}", "sup": "${sup}","page":"${page}", "size": "${size}", "teacher":"${teacher}"}`

    return axios.post('/graphql/v1/toss', {
      query: `{
        ConversionRateStatistics(query: ${JSON.stringify(query) || null}) {
          start_date
          end_date
          course_days
          order_number
          amount_total
          conversion_rate_total
          total_elements
          teacher_conversion_rates{
            sup
            department
            period_name
            teacher
            student_total
            order_total
            conversion_total
            amount_total
            conversion_rate_daily{
              is_last
              weekday
              order_number
              amount
              conversion
            }
          }
      }}`
    })
  },
  // 按期汇总模块 接口 通过期数、销售部门、社群销售、难度 条件过滤 数量统计接口
  getCountStatisticBySearch(params) {
    const { period = '', department = '', sup = '' } = params
    const query = `{"term": "${period}","departmentId": "${department}", "sup": "${sup}"}`

    return axios.post('/graphql/v1/toss', {
      query: `{
        termDepartmentReport(query: ${JSON.stringify(query) || null}) {
          teacherNum
          trialStudentNum
          systemStudentNum
          systemTotalAmount
      }}`
    })
  },
  // 按期汇总模块 接口，获取list
  getStatisticsByProid(params) {
    const {
      period = '',
      page = 1,
      size = '20',
      teacher = '',
      department = '',
      sup = ''
    } = params
    const query = `{"term": "${period}","departmentId": "${department}", "sup": "${sup}","teacherIds":"${teacher}"}`

    return axios.post('/graphql/v1/toss', {
      query: `{
        termDepartmentTeacherReportPage(page: ${page}, size:${size},query: ${JSON.stringify(
        query
      ) || null}) {
          first
          totalPages
          totalElements
          content {
            trial_stage_name
            task_comment_count
            join_course_count
            send_course_count
            added_wechat_count
            listen_comment_count
            task_count
            no_address_count
            sup
            trial_stage
            stage_name
            department_id
            department_name
            complete_course_count
            pay_teacher_id
            realname
            system_order_total_amount
            stage
            system_order_count
            trial_course_count
          }
      }}`
    })
  },
  getdepartmentList(params) {
    // const { status = 'on_going' } = params
    return axios.post('/graphql/v1/toss', {
      query: `{
        ManagementStatusList(query: "{}") {
            number
            totalPages
            totalElements
            content {
              id
              pid
              name
            }
          }
        }`
    })
  }
}
