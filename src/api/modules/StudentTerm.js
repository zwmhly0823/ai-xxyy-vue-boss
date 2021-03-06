/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-21 11:58:33
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-05-07 19:07:22
 * @Description: 班级
 */
// import axios from '../axios'
import axios from '../axiosConfig'

export default {
  // 班级列表左侧状态名称
  getTeamStatusCount({ data, teacherId, queryParams = '' }) {
    return axios.get('/graphql/team', {
      query: `{
        teamStatusCount(
          field: "team_state",
          team_type:${data},
          teacher_id: "${teacherId || []}", 
          query: ${JSON.stringify(queryParams)}
        ) {
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
        []}",page:${page},size:15){
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
  },
  getCalculationTeamInfo(params) {
    return axios.post(
      '/api/tm/v1/teacher/manager/team/calculationTeamInfo',
      params
    )
  },
  // 自动加好友
  updateStudentTeamByState(params) {
    return axios.get(
      `/api/tm/v1/teacher/manager/team/updateStudentTeamByState?status=${params.status}&teamId=${params.teamId}`
    )
  },

  /**
   * 根据难度 sup 搜索班级 TODO: 班级数量大于1000时做调整
   */
  searchTeamBySup(sup = '') {
    const query = { 'sup.keyword': sup }
    const q = JSON.stringify(query)
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTeamList(query:${JSON.stringify(q)}, size: 3000){
          id
          team_name
          sup
        }
      }`
    })
  },
  // 自动加好友默认状态
  getStudentTeamById(params) {
    return axios.get(
      `/api/tm/v1/teacher/manager/team/getStudentTeamById?teamId=${params.teamId}`
    )
  }
}
