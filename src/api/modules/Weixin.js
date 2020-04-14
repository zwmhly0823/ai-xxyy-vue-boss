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
  getWeChatTeacherPage() {
    return axios.get(`/graphql/v1/boss`, {
      query: `{
        WeChatTeacherPage {
          totalElements
          totalPages
          content {
            id
            wechat_no
            wechat_qr_code
            nickname
            teacher_id
            head_img_url
          }
        }
      }`
    })
  },
  getTeacherList(params) {
    const obj = JSON.stringify({ id: params })
    return axios.get(`/graphql/v1/boss`, {
      query: `{
        TeacherList(query: ${JSON.stringify(obj)}) {
          id
          realname
          department {
            id
            name
            pname
          }
        }
      }`
    })
  }
}
