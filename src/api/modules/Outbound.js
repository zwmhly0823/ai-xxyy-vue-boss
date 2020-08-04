/*
 * @Descripttion:外呼相关接口
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-08-03 15:50:58
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-08-04 18:35:26
 */

import axios from '../axiosConfig'

// import { getToken } from '@/utils/auth'

// const getHeaders = () => {
//   const token = getToken() || ''
//   const headers = {
//     'Content-Type': 'application/json;charset=UTF-8'
//   }
//   if (token) {
//     headers.Authorization = token.includes('Bearer ')
//       ? token
//       : 'Bearer ' + token
//   }
//   return headers
// }
// const judgeToken = () => {
//   const token = getHeaders().Authorization
//   const needToken = location.href.indexOf('login') === -1

//   if (needToken && !token) {
//     // location.href = `${baseUrl}login/#/`
//     location.href = `/login/#/`
//     return 0
//   }
//   return 1
// }
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
              }
            }
          }
        }`
    })
  },
  // 绑定坐席
  bindTel(params) {
    return axios.post(
      `/api/tm/v1/teacher/outbound/bindTel?id=${params.id}&teacherId=${params.teacherId}&tel=${params.tel}&telType=${params.telType}`
    )
  }
}
