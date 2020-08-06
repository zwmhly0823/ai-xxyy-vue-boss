/*
 * @Descripttion:外呼相关接口
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-08-03 15:50:58
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-08-06 15:35:24
 */

import axios from '../axiosConfig'
export default {
  // 获取绑定坐席列表
  getOutboundListPage(parmes, page = 1, sort = 'desc', size = 9) {
    const formattingQuery = JSON.stringify(parmes)
    const formattingSort = JSON.stringify({ ctime: sort })
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
