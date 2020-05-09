/*
 * @Descripttion: 统计模块
 * @version:
 * @Author: Shentong
 * @Date: 2020-04-07 13:52:26
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-29 16:52:58
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
              is_null
              weekday
              order_number
              amount
              conversion
            }
          }
      }}`
    })
  },
  // 按期汇总模块接口---->通过期数、销售部门、社群销售、难度 条件过滤 数量统计接口
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
  // 按期汇总模块接口---->获取table_list
  getStatisticsByProid(params) {
    const {
      period = '',
      page = 1,
      size = '20',
      teacher = '',
      totalSort = 'desc',
      department = '',
      sup = ''
    } = params
    const _totalSort = `{"system_order_total_amount":"${totalSort}"}`
    const query = `{"term": "${period}","departmentId": "${department}", "sup": "${sup}","teacherIds":"${teacher}"}`

    return axios.post('/graphql/v1/toss', {
      query: `{
        termDepartmentTeacherReportPage(page: ${page}, size:${size},query: ${JSON.stringify(
        query
      ) || null}, sort: ${JSON.stringify(_totalSort)}) {
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
    let supStr = ''
    if (sups) {
      supStr = sups
        .split(',')
        .map((item) => 'S' + item)
        .join(',')
    } else {
      supStr = sups
    }
    // eslint-disable-next-line
    const query = `{"term": "${term}","department_ids": "${department_ids}", "sups": "${supStr}", "teacher_ids":"${teacher_ids}"}` // eslint-disable-line

    return axios.post('/graphql/getDepartmentCourse', {
      query: `{
        getCompeteCourseList(query: ${JSON.stringify(query) ||
          null},page:${page}, size: ${size}) {
          start_date
          end_date
          course_days
          join_nums
          join_rate
          now_join_nums
          now_join_rate
          totalElements
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
  // 完课统计接口
  getCompeteCourseList(params) {
    const {
      term = 1,
      department_ids = '', // eslint-disable-line
      page = 1,
      size = '20',
      teacher_ids = '', // eslint-disable-line
      sups = ''
    } = params
    let supStr = ''
    if (sups) {
      supStr = sups
        .split(',')
        .map((item) => 'S' + item)
        .join(',')
    } else {
      supStr = sups
    }
    // eslint-disable-next-line
    const query = `{"term": "${term}", "department_ids": "${department_ids}", "sups": "${supStr}", "teacher_ids":"${teacher_ids}"}` // eslint-disable-line
    return axios.post('/graphql/getDepartmentCourse', {
      query: `{
        getCompeteCourseList(query: ${JSON.stringify(query) ||
          null},page:${page}, size: ${size}) {
          start_date
          end_date
          course_days
          join_nums
          join_rate
          now_join_nums
          now_join_rate
          totalElements
          complete_nums
          complete_rate
          now_complete_nums
          now_complete_rate
          completeCourse{
            sup
            department_name
            teacher_name
            student_nums
            total_complete_nums
            total_complete_rate
            completeArr{
              current_lesson
              sum
              complete_nums
              complete_rate
            }
          }
      }}`
    })
  },
  // 上传作品统计接口
  getBaseSaleStatisticsPage(params) {
    const {
      // period = '',
      page = 1,
      size = '20',
      // teacher = '',
      totalSort = 'desc'
      // department = '',
      // sup = ''
    } = params
    const _totalSort = `{"id.keyword":"${totalSort}"}`
    // const query = `{"term": "${period}","departmentId": "${department}", "sup": "${sup}","teacherIds":"${teacher}"}`
    const query = ''
    return axios.post('/graphql/v1/toss', {
      query: `{
        BaseSaleStatisticsPage(page: ${page}, size:${size},query: ${JSON.stringify(
        query
      ) || null}, sort: ${JSON.stringify(_totalSort)}){
        totalPages
        totalElements
        number
          content{
            id
            sup
            department_name
            realname
            trial_course_count
            studentCourseTaskStatisticsList{
              current_lesson
              course_task_count
            }
          }
        }
      }`
    })
  }
}
