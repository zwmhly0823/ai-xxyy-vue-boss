/*
 * @Descripttion: 统计模块
 * @version:
 * @Author: Shentong
 * @Date: 2020-04-07 13:52:26
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-08 20:25:34
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
          status
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
    const { period = '', department = '', sup = '', teacher = '' } = params
    const query = `{"term": "${period}","departmentId": "${department}", "sup": "${sup}", "teacherIds": "${teacher}"}`

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
      // totalSort = 'desc',
      conversionRateSort = 'desc',
      department = '',
      sup = ''
    } = params
    // const _totalSort = `{"system_order_total_amount":"${totalSort}"}`
    const sort = `{"conversion_rate":"${conversionRateSort}"}`
    const query = `{"term": "${period}","departmentId": "${department}", "sup": "${sup}","teacherIds":"${teacher}"}`

    return axios.post('/graphql/v1/toss', {
      query: `{
    termDepartmentTeacherReportPage(page: ${page}, size:${size},query: ${JSON.stringify(
        query
      ) || null}, sort: ${JSON.stringify(sort)}) {
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
        conversion_rate
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
    let {
      period = '',
      page = 1,
      size = '20',
      teacher = '',
      totalSort = 'desc',
      department = '',
      sup = ''
    } = params
    department = department ? department.split(',') : ''
    let supStr = ''
    if (sup) {
      supStr = sup
        .split(',')
        .map((item) => 'S' + item)
        .join(',')
    } else {
      supStr = sup
    }
    sup = supStr ? supStr.split(',') : ''

    teacher = teacher ? teacher.split(',') : ''
    const _totalSort = `{"id.keyword":"${totalSort}"}`

    const getdepartment =
      department.length > 0
        ? `,"department_id":${JSON.stringify(department)}`
        : ''
    const getsup = sup ? `,"sup.keyword": ${JSON.stringify(sup)}` : ''
    const getteacherIds = teacher
      ? `,"pay_teacher_id":${JSON.stringify(teacher)}`
      : ''
    const query = `{"trial_stage": "${period}"${getdepartment}${getsup}${getteacherIds}}`
    // const query = ''
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
              task_student_count
            }
             taskCommentStatisticsList {
                current_lesson
                comment_count
                task_count
                comment_listened_count
              }
          }
        }
      }`
    })
  },
  // 上传统计数据统计接口
  getCourseTaskStatistics(params) {
    let { period = '', teacher = '', department = '', sups = '' } = params
    teacher = teacher ? teacher.split(',') : ''
    department = department ? department.split(',') : ''
    let supStr = ''
    if (sups) {
      supStr = sups
        .split(',')
        .map((item) => 'S' + item)
        .join(',')
    } else {
      supStr = sups
    }
    sups = supStr ? supStr.split(',') : ''
    const query = `{"term": "${period}","departmentId": ${JSON.stringify(
      department
    )},"teacherIds":${JSON.stringify(teacher)},"sup":${JSON.stringify(sups)}}`
    // const query = ''
    return axios.post('/graphql/v1/toss', {
      query: `{
        courseTaskStatistics(query:${JSON.stringify(query) || null}){
          student_count
          course_task_count
          task_student_count
        }
      }`
    })
  },
  // 老师点评统计接口
  getTaskCommentStatistics(params) {
    let { period = '', teacher = '', department = '', sups = '' } = params
    teacher = teacher ? teacher.split(',') : ''
    department = department ? department.split(',') : ''
    let supStr = ''
    if (sups) {
      supStr = sups
        .split(',')
        .map((item) => 'S' + item)
        .join(',')
    } else {
      supStr = sups
    }
    sups = supStr ? supStr.split(',') : ''
    const query = `{"term": "${period}","departmentId": ${JSON.stringify(
      department
    )},"teacherIds":${JSON.stringify(teacher)},"sup":${JSON.stringify(sups)}}`
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        taskCommentStatistics(query:${JSON.stringify(query) || null}){
          comment_count
          task_count
          listen_count
        }
      }`
    })
  },
  // 获取用户行为下拉接口
  actionTypeList() {
    return axios.post('/graphql/filter', {
      query: `{
        actionTypeList(query:"") {
          id
          name
      }}`
    })
  },
  // 获取用户行为下拉接口
  UserBehaviorLogPage(params, currentPage) {
    // const {
    //   valueInput = '',
    //   valueBehavior = [],
    //   currentPage = 1,
    //   size = '20'
    // } = params
    // const query = {}
    // valueInput &&
    //   Object.assign(query, {
    //     'mobile.like': { 'mobile.keyword': `*${valueInput}*` }
    //   })
    // valueBehavior &&
    //   Object.assign(query, {
    //     action_type: `['${valueBehavior}']`
    //   })
    return axios.post('/graphql/v1/toss', {
      query: `{
        UserBehaviorLogPage(query:${JSON.stringify(
          params
        )},page:${currentPage}, size: 20) {
          number
          totalElements
          content {
            uid
            username
            nickname
            weixin_nick_name
            head
            birthday
            sex
            status
            status_text
            base_painting
            base_painting_text
            channel
            first_order_send_id
            join_date
            mobile
            mobile_province
            mobile_city
            device_model
            team_id
            team_name
            current_lesson
            teacher_id
            teacher_name
            teacher_department_id
            teacher_department_name
            order_id
            stage
            out_trade_no
            order_status
            order_regtype
            task_id
            comment_id
            course_id
            course_title
            team_state
            action_time
            action_type
            action_type_text
            user {
              id
              username
              nickname
              birthday
              head
              mobile
              status
              status_text
            }
            firstOrderSend {
              nickname
              username
              mobile
            }
            team {
              term
              team_name
              team_type
            }
            order {
              buytime
            }
            task {
              ctime
            }
          }
      }}`
    })
  }
}
