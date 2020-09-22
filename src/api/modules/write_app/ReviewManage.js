/*
 * @Descripttion: 运营管理 - 点评管理
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-09-22 11:02:28
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-22 15:48:01
 */
import axios from '../../axiosConfig'

export default {
  /**
   * 点评列表
   * @param {*} query
   * @param {*} page
   * @param {*} size
   * @param {*} sort
   */
  getStudentTaskDispatchLogPage({
    query = {},
    page = 1,
    size = 10,
    sort = { ctime: 'desc' }
  } = {}) {
    // const queryObj = Object.assign(query, { subjetc: 1 })
    const queryStr = (query && JSON.stringify(JSON.stringify(query))) || `""`
    const sortStr = JSON.stringify(JSON.stringify(sort))
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTaskDispatchLogPage(query:${queryStr},page: ${page}, size: ${size}, sort: ${sortStr}) {
          number
          size
          numberOfElements
          totalElements
          totalPages
          content {
            id
            ctime  #老师接收时间
            is_comment  #点评状态
            course_type  #课程类型
            sup    #课程难度
            subject
            subject_text
            task_upload_time  
            term
            period_name   #期名
            task_comment_id
            task_comment_time
            userInfo {
              u_id
              mobile   #用户手机号
              username  #用户名
            }
            courseTaskList {
              id
              course_id
              course_name #课程名称
              task_image  #作品图片
              ctime   #作品上传时间
            }
            teacherInfo {
              id
              username  #老师名字
              nickname  #老师昵称
              realname  #老师真实名字
              departmentInfo {
                name  #老师所在部门名称
              }
            }
            commentInfo {
              id
              sound_comment  #点评语音地址
            }
            flagRecord {
              id
              ctime  #听点评时间
            }
          }
        }
      }`
    })
  }
}
