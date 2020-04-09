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
   * 组织机构列表
   * */
  getDepartmentTree(id) {
    return axios.get(`/api/t/v1/department/getDepartmentTree?id=${id}`)
  },
  getOssSign() {
    return axios.get(`/api/home/v1/ossconfig/getStsPubWriteToken`)
  },
  // 老师列表
  getTeacherPage(page = 1, query = '') {
    return axios.post('/graphql/v1/boss', {
      query: `{
        TeacherManagePage(page: ${page}, query: ${query || null}) {
          number
          totalPages
          totalElements
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
              pid
              pname
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
  // 老师部门关系
  // getTeacherDepartmentRelation(query) {
  //   return axios.post('/graphql/boss', {
  //     query: `{
  //       TeacherDepartmentRelationList(query: ${query}){
  //         id
  //         name
  //       }
  //     }`
  //   })
  // },
  // 老师职务
  getTeacherDutyList() {
    return axios.post('/graphql/v1/boss', {
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
  }
}
