/**
 * 组织机构
 */
import axios from '../axiosConfig'

export default {
  /**
   * 获取组织机构 t_teacher_department
   */
  teacherDepartment(params = '') {
    return axios.post('/graphql/v1/toss', {
      query: `{
        TeacherDepartmentList(query: ${JSON.stringify(params)}, size: 300){
          id
          pid
          name
        }
      }`
    })
  },

  // 通过API获取组织机构
  getDepartmentList() {
    return axios.get(`/api/t/v1/department/getDepartmentTree`)
  },

  // 根据选择的部门ID获取老师ID
  getDepartmentTeacher(query = '') {
    return axios.post('/graphql/v1/toss', {
      query: `{
        TeacherList(query: ${JSON.stringify(query)}, size: 300){
          id
          realname
        }
      }`
    })
  },

  // 模糊查询teacherList
  getDepartmentTeacherEx(query = '') {
    return axios.post('/graphql/v1/toss', {
      query: `{
        TeacherListEx(query: ${JSON.stringify(query)}, size: 20){
          id
          realname
        }
      }`
    })
  }
}
