/*
 * @Descripttion:
 * @version:
 * @Author: zhouzebin
 * @Date: 2020-05-06 14:38:28
 */
// import axios from '../axios'
import axios from '../axiosConfig'

export default {
  getTeacherIdByCategory({ queryParams = '' }) {
    return axios.get('/graphql/v1/toss', {
      query: `{
        StudentTeamList(
            query: ${JSON.stringify(queryParams)}
        ) {
            teacher_id
        }
      }`
    })
  }
}
