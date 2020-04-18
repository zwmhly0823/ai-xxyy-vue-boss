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
        TeacherDepartmentList(query: ${JSON.stringify(params)}){
          id
          pid
          name
        }
      }`
    })
  }
}
