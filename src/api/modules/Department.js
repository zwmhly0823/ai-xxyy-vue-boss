/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-03 17:21:52
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-12 22:37:36
 */

/**
 * 组织机构 injectSubject,
 */
import { getAppSubjectCode } from '@/utils/index'
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
  getDepartmentTeacher(query = '', size = 300, isParttimeTeacher = false) {
    const obj = JSON.parse(query || '{}')
    Object.assign(obj, { 'subject.like': { 'subject.keyword': `*0*` } })
    isParttimeTeacher && Object.assign(obj, { duty_id: ['3', '4'] })
    return axios.post('/graphql/v1/toss', {
      query: `{
        TeacherList(query: ${JSON.stringify(
          JSON.stringify(obj)
        )}, size: ${size}){
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
          departmentInfo {
            name
          }
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
