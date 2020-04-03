/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-21 11:58:33
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-03-21 12:05:08
 * @Description: 班级
 */
// import axios from '../axios'
import axios from '../axiosConfig'

export default {
  // 班级列表左侧状态名称
  getTeamStatusCount({ data, teacherId }) {
    return axios.get('/graphql/team', {
      query: `{
        teamStatusCount(field: "team_state", team_type: 
        ${data}, teacher_id: "${teacherId || ''}") {
          code,
          value,
          name
        }
      }`
    })
  },
  // 班级列表中栏数据
  getTeamStatusPage({ queryParams, type, teacherId, page, classStatus }) {
    return axios.get('/graphql/team', {
      query: `{
        teamStatusPage(query:${JSON.stringify(
          queryParams
        )},team_state:"${classStatus.join()}", team_type: ${type}, teacher_id: "${teacherId ||
        ''}",page:${page},size:15){
          empty,
          first,
          last,
          number,
          size,
          numberOfElements,
          totalElements,
          totalPages,
          content {
            id,
            team_state,
            team_type,
            team_name,
            ctime,
            sup,
            term,
            start_day,
            end_day,
            enroll_state,
            enrolled,
            pre_enroll,
            teacher_id,
            teacher {
              realname,
            }
            current_lesson,
            week
          }
        }
      }`
    })
  }
}
