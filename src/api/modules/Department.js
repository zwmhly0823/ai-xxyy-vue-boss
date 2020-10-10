/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-03 17:21:52
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-24 15:35:17
 */

/**
 * 组织机构
 */
import { injectSubject, getAppSubjectCode } from '@/utils/index'
import axios from '../axiosConfig'

const subjectCode = getAppSubjectCode()

export default {
  /**
   * 获取组织机构 t_teacher_department
   */
  teacherDepartment(params = '') {
    const query = {
      subject: subjectCode
    }
    return axios.post('/graphql/v1/toss', {
      query: `{
        TeacherDepartmentList(query: ${JSON.stringify(
          JSON.stringify(query)
        )}, size: 300){
          id
          pid
          name
        }
      }`
    })
  },

  // 通过API获取组织机构
  getDepartmentList(departmentId = 0) {
    return axios.get(
      `/api/t/v2/department/getDepartmentTree?departmentId=${departmentId}`
    )
  },

  // 根据选择的部门ID获取老师ID
  getDepartmentTeacher(query = '') {
    return axios.post('/graphql/v1/toss', {
      query: `{
        TeacherList(query: ${JSON.stringify(injectSubject(query))}, size: 300){
          id
          realname
        }
      }`
    })
  },

  // 模糊查询teacherList
  getDepartmentTeacherEx(query = '', size = 20) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        TeacherListEx(query: ${JSON.stringify(query)}, size: ${size}){
          id
          realname
        }
      }`
    })
  },
  // 模糊查询teacherList
  getCallTeacherEx(query = '') {
    return axios.post('/graphql/v1/toss', {
      query: `{
        TeacherOutboundPage(query: ${JSON.stringify(query)}, size: 20){
          teacher_id
          realname
        }
      }`
    })
  },
  // 申请人列表
  getOperatorNameList(query) {
    return axios.post('/graphql/logisticsStatistics', {
      query: `{
        operator(query:${JSON.stringify(query)}) {
          id
          realname
        }
      }`
    })
  }
}
