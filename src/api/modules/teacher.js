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
    return axios.get(`/api/t/v1/department/getDepartmentTree?id=${id}`)
  },
  getOssSign() {
    return axios.get(`/api/home/v1/ossconfig/getStsPubWriteToken`)
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
              name
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
  },
  // 获取教师详情
  getTeacherDetail(id) {
    return axios.get(`/api/t/v1/teacher/getTeacherDetail?teacherId=${id}`)
  },
  // 上传头像
  getPubWriteSinged() {
    return axios.get(`/api/home/v1/ossconfig/getPubWriteSinged`)
  },
  // 部门
  getdepartmentList() {
    return axios.post('/graphql/boss', {
      query: `{
         TeacherDepartmentPage(query: "") {
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
  // 职级
  TeacherRankList() {
    return axios.post('/graphql/boss', {
      query: `{
         TeacherRankList{
            id
            name
          }
        }`
    })
  },
  // 级别
  courseSupList() {
    return axios.post('/graphql/filter', {
      query: `{
          courseSupList{
            id
            name
          }
       }`
    })
  }
}
