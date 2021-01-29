import axios from '../axiosConfig'
import { injectSubject } from '@/utils/index'
// const subject = getAppSubjectCode()

export default {
  // 统计分析的学习记录 体验课
  getStudentTrialRecordPage(page = 1, term, sup, sort = 'desc', size = 12) {
    const formattingQuery = JSON.stringify({
      term,
      'sup.keyword': sup
    })
    const formattingSort = JSON.stringify({ ctime: sort })
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        StudentTrialRecordOperatorStatisticsPage(
          query:${JSON.stringify(injectSubject(formattingQuery))},
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
  // 统计分析的学习记录 系统课
  getStudentSystemRecordPage(page = 1, term, sup, sort = 'desc', size = 12) {
    const formattingQuery = JSON.stringify({
      term,
      'sup.keyword': sup
    })
    const formattingSort = JSON.stringify({ ctime: sort })
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        StudentSystemRecordOperatorStatisticsPage(
          query:${JSON.stringify(injectSubject(formattingQuery))},
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
  // 学习记录  体验课 基本信息
  getStudentTrialDetail(term, courseId, sup) {
    // console.log(query)
    const formattingQuery = JSON.stringify({
      term,
      courseId,
      sup: sup.toLowerCase()
    })
    console.log(formattingQuery)
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        StudentTrialRecordDetailBossStatistics(
          query:${JSON.stringify(injectSubject(formattingQuery))}
          
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
  // 学习记录 系统课 基本信息
  getStudentSystemDetail(term, courseId, sup) {
    // console.log(query)
    const formattingQuery = JSON.stringify({
      term,
      course_id: courseId,
      sup: sup.toLowerCase()
    })
    console.log(formattingQuery)
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        StudentSystemRecordDetailBossStatistics(
          query:${JSON.stringify(injectSubject(formattingQuery))}
          
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
  // 学习记录 体验课 详情页
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
          query:${JSON.stringify(injectSubject(formattingQuery))},
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
  // 学习记录 系统课 详情页
  // getStudentSRecordList(query, teamName = '', sup, page = 1, sort = 'desc') {
  //   console.log(teamName)
  //   teamName &&
  //     Object.assign(query, {
  //       'team_name.like': { 'team_name.keyword': `*${teamName}*` }
  //     })
  //   const formattingQuery = JSON.stringify({
  //     ...query,
  //     sup: sup.toLowerCase()
  //   })
  //   console.log(formattingQuery)
  //   const formattingSort = JSON.stringify({ ctime: sort })
  //   return axios.post(`/graphql/v1/toss`, {
  //     query: `{
  //       StudentSystemRecordListStatisticsPage(
  //         query:${JSON.stringify(injectSubject(formattingQuery))},
  //         page: ${page},
  //         size:20,
  //         sort:${JSON.stringify(formattingSort)}
  //         )
  //         {
  //            content {
  //     id
  //     cid
  //     mid
  //     ctime
  //     utime
  //     student_id
  //     course_id
  //     team_id
  //     team_name
  //     term
  //     sup
  //     team_state
  //     teacher_id
  //     realname
  //     department_id
  //     department_name
  //     user_num
  //     username
  //     nickname
  //     birthday
  //     base_painting
  //     mobile
  //     sex
  //     mobile_city
  //     mobile_province
  //     status
  //     state
  //     learn_course_count
  //     last_join_course_time
  //     complete_time
  //     task_count
  //     last_task_time
  //     comment_count
  //     lesson_comment_count
  //     ad_count
  //     ad_last_join_course_time
  //     ad_complete_time
  //     ad_join_course_count
  //     ad_complete_course_count
  //     ad_state
  //     completed_count
  //     studentSystemStatistics{
  //     life_cycle
  //     remain_order_count
  //     }

  //   }
  //   empty
  //   first
  //   last
  //   number
  //   size
  //   numberOfElements
  //   totalElements
  //   totalPages
  //         }
  //       }`
  //   })
  // },
  getStudentSRecordList(query, teamName = '', sup, page = 1, sort = 'desc') {
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
        StudentSystemRecordListStatisticsPage(
          query:${JSON.stringify(injectSubject(formattingQuery))},
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
      # realname
      # department_id
      # department_name
      user_num
      # username
      # nickname
      # birthday
      # base_painting
      mobile
      # sex
      # mobile_city
      # mobile_province
      # status
      state
      learn_course_count
      last_join_course_time
      complete_time
      # task_count
      # last_task_time
      comment_count
      lesson_comment_count
      ad_count
      ad_last_join_course_time
      ad_complete_time
      ad_join_course_count
      ad_complete_course_count
      ad_state
      completed_count
      studentSystemStatistics {
        life_cycle
        remain_order_count
      }
      teacherInfo {
        id
        realname
        department_id
        department_name
      }
      task {
        id
        ctime
        task_image
      }
      userExtends{
        mobile
        username
        nickname
        birthday
        base_painting
        sex
        status
      }
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
  // 学习记录(查普通系统课体验课+写字0元体验课)
  getSendCourseLogPage({
    page,
    subject,
    studentId,
    teamId, // 只普通用
    lessonType, // 只普通用
    courseId // 只写字0元体验课用
  }) {
    const formattingQuery = JSON.stringify(
      courseId && courseId.length
        ? {
            del: 0,
            subject,
            student_id: studentId,
            team_id: 0,
            lesson_type: 0,
            // 写字0元体验课
            course_id: courseId
          }
        : {
            del: 0,
            subject,
            student_id: studentId,
            // normal 体验系统课
            team_id: teamId,
            lesson_type: lessonType
          }
    )
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        SendCourseLogPage(
          query:${JSON.stringify(formattingQuery)},
          sort:${JSON.stringify(JSON.stringify({ id: 'asc' }))},
          page: ${page},
          size:20)
          {
            totalPages
            totalElements
            content{
              wd_info
              title
              ctime
              start_date
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
  }
}
