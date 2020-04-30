/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-09 19:19:17
 */
// import axios from '../axios'
import axios from '../axiosConfig'

export default {
  updateTeamStudent(params) {
    return axios.put(
      '/api/tm/v1/teacher/manager/team/updateTeamStudent',
      params
    )
  },
  sendMsgForTeacher(orderId) {
    return axios.get(`/api/o/v1/order/sendMsgForTeacher?orderIds=${orderId}`)
  },
  getUserInfo(query = '') {
    return axios.post('/graphql/v1/toss', {
      query: `
      {
        User(query: ${JSON.stringify(query)}){
          id
        }
      }
      `
    })
  },

  // 模糊搜索手机号或微信号，获取用户ID或班级ID
  blurrySearch(queryString = '', teamType = '0', teamId = '') {
    const queryParams = `{"mobile":"${queryString}","team_id":"${teamId}","team_type":"${teamType}"}`
    return axios.post('/graphql/user', {
      query: `{
              blurrySearch(query: ${JSON.stringify(queryParams)}) {
                  mobile
                  wechat_nikename
                  id
                  last_team_id
                }
            }
          `
    })
  }
}
