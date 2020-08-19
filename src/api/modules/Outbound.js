/*
 * @Descripttion:外呼相关接口
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-08-03 15:50:58
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-08-19 15:45:21
 */

import axios from '../axiosConfig'
export default {
  // 获取绑定坐席列表
  getOutboundListPage(parmes, page = 1, sort = 'asc', size = 20) {
    const formattingQuery = JSON.stringify(parmes)
    const formattingSort = JSON.stringify({ cno: sort })
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        TeacherOutboundPage(
           query:${JSON.stringify(formattingQuery)},
          page: ${page},
          size:${size},
          sort:${JSON.stringify(formattingSort)}
          )
          {
            totalPages
            totalElements
            content{
               id
              cid
              ctime
              del
              mid
              utime
              cno
              agent_name
              teacher_id
              tel_type
              tel
              use_status
              bind_time
              teacherInfo{
                realname
                department_name
                department_id
              }
            }
          }
        }`
    })
  },
  // 获取通话记录列表
  getRecordListPage(parmes, page = 1, sort = 'asc', size = 20) {
    const formattingQuery = JSON.stringify(parmes)
    const formattingSort = JSON.stringify({ cno: sort })
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        TeacherOutboundCallRecordPage(
           query:${JSON.stringify(formattingQuery)},
          page: ${page},
          size:${size},
          sort:${JSON.stringify(formattingSort)}
          )
          {
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
        cid
        ctime
        del
        mid
        utime
        cno
        agent_name
        teacher_id
        student_id
        student_mobile
        request_unique_id
        cdr_status
      cdr_status_text
        call_type
      call_type_text
        start_time
        bridge_time
        answer_time
        end_time
        answer_duration
        end_reason
      end_reason_text
      teacherInfo {
        id
        ding_userid
        realname
        nickname
        phone
        status
        head_image
        sex
        level
        is_login
        join_date
        leave_date
        leave_train
        ctime
        utime
        cid
        mid
        duty_id
        duty_name
        rank_id
        rank_name
        group_id
        group_name
        department_id
        department_name
        area_id
        area_name
      }
      studentInfo {
        id
        sex
        status
        mobile
        username
        mobile_city
        mobile_province
        birthday
        teams{
          team_name
          team_type
        }
        trialCourse{
          term
          current_lesson
        }
        systemCourse{
          term
          current_level
        }
      }
    }
           
          }
        }`
    })
  },
  // 获取通话统计数据
  getRecordgetStatistics(parmes) {
    const formattingQuery = JSON.stringify(parmes)
    return axios.post(`/graphql/v1/toss`, {
      query: `{
        TeacherOutboundStatistics(
           query:${JSON.stringify(formattingQuery)}, 
          )
          {
             total
              answerTotal
              notAnswerTotal
              answerTotalTime
              answerRate
              avgTime
              }
           
        }`
    })
  },
  // 根据id 获取老师id
  getTeachId(parmes, page = 1, size = 500) {
    const formattingQuery = JSON.stringify(parmes)

    return axios.post(`/graphql/v1/toss`, {
      query: `{
        TeacherList(
           query:${JSON.stringify(formattingQuery)},
          page: ${page},
          size:${size},
          
          )
          {
            department_id
            id
              }
           
        }`
    })
  },
  // 绑定坐席
  bindTel(params) {
    return axios.post(
      `/api/tm/v1/teacher/outbound/bindTel?id=${params.id}&teacherId=${params.teacherId}&tel=${params.tel}&telType=${params.telType}`
    )
  },
  // 解绑
  unbindTel(val) {
    return axios.get(`/api/tm/v1/teacher/outbound/unbindAgentTel?id=${val}`)
  }
}
