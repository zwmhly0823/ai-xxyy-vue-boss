/*
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-04-07 13:52:26
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-07 13:59:18
 */
import axios from '../axiosConfig'

export default {
  /**
   * 订单列表
   * */
  getDepartmentTree(id) {
    return axios.get(`/api/t/v1/department/getDepartmentTree?Id=${id}`)
  },
  // 老师列表
  getTeacherPage() {
    return axios.post('/graphql/boss', {
      query: `{
        TeacherPage(page: 1) {
          totalPages
          content {
            id
            realname
            sex
            nickname
            phone
            status
            is_login
            head_image
            department {
              id
            }
            duty {
              id
              name
            }
            rank {
              id
              name
            }
            weixin {
              id
              weixin_no
            }
          }
        }
      }`
    })
  },
  // 老师职务
  getTeacherDutyList() {
    return axios.post('/graphql/boss', {
      query: `{
          TeacherDutyList{
            id
            name
          }
        }`
    })
  }
}
