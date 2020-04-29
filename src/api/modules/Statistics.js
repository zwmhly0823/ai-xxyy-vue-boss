/*
 * @Descripttion: 统计模块
 * @version:
 * @Author: Shentong
 * @Date: 2020-04-07 13:52:26
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-28 20:45:18
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
  },
  // 通过期号，获取table (参课统计接口)
  getAttendClasscListByProid(params) {
    const {
      // status = 'on_going',
      term = 1,
      page = 1,
      size = '20',
      teacher_ids = '', // eslint-disable-line
      department_ids = '', // eslint-disable-line
      sups = ''
    } = params
    // eslint-disable-next-line
    const query = `{"term": "${term}","department_ids": "${department_ids}", "sups": "${sups}","page":"${page}", "size": "${size}", "teacher_ids":"${teacher_ids}"}`

    return axios.post('/graphql/getDepartmentCourse', {
      query: `{
        getCompeteCourseList(query: ${JSON.stringify(query) || null}) {
          start_date
          end_date
          course_days
          join_nums
          join_rate
          now_join_nums
          now_join_rate
          completeCourse{
            sup
            department_name
            teacher_name
            student_nums
            total_join_nums
            total_join_rate
            completeArr{
              current_lesson
              sum
              join_nums
              join_rate
            }
          }
      }}`
    })
  },
  getCompeteCourseList(params) {
    const {
      term = 13,
      department_ids = '', // eslint-disable-line
      page = 1,
      size = '20',
      teacher_ids = '', // eslint-disable-line
      department = '',
      sups = ''
    } = params
    // eslint-disable-next-line
    const query = `{"term": "${term}", "department_ids": "${department_ids}","department": "${department}", "sups": "${sups}","page":"${page}", "size": "${size}", "teacher_ids":"${teacher_ids}"}`
    return axios.post('/graphql/getDepartmentCourse', {
      query: `{
        getCompeteCourseList(query: ${JSON.stringify(query) || null}){
          completeCourse{
            id
          }
        }
      }`
    })
  }
}
