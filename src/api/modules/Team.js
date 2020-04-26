/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-21 11:58:33
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-04-26 23:27:22
 * @Description: 班级
 */
import axios from '../axiosConfig'
import newAxios from '../axios.js'

export default {
  // 获取体验课状态列表
  getExperienceStatusList(params) {
    return axios.post(`/graphql/team`, params)
  },
  // 学员列表获取所有优惠券
  getAllCoupons(params) {
    return newAxios.get(`/api/s/v1/coupon/getAllCoupons?page=${params}`)
  },
  // 批量发放优惠券
  sendCoupon(id, params) {
    return newAxios.post(
      `/api/s/v1/coupon/send/batch/sendCoupon?couponId=${id}`,
      params
    )
  },
  // 加好友进群接口
  getuserListForTeam({ querysData, currentPage, sortGroup }) {
    return axios.post('/graphql/user', {
      query: `{
        userListForTeam(query:${JSON.stringify(
          querysData
        )} , page: ${currentPage}, size: 20,${sortGroup}) {
          empty
          first
          last
          number
          size
          numberOfElements
          totalElements
          totalPages
          content {
            id
            nickname
            sex
            birthday
            head
            mobile
            base_painting
            follow
            added_group
            added_wechat
            buytime
            added_wechat_time
            added_group_time
            follow_time
            order_id
          }
        }
      }`
    })
  },
  // 物流接口
  getStuExpressPage({ querysData, currentPage }) {
    return axios.post('/graphql/express', {
      query: `{
        stuExpressPage(query:${JSON.stringify(
          querysData
        )} , page: ${currentPage}, size: 20) {
        empty
        first
        last
        number
        size
        numberOfElements
        totalElements
        totalPages
        content {
          id
          head
          nickname
          username
          address_detail
          province
          city
          area
          express_status
          ctime
          mobile
          user_id
          order_id
          receipt_tel
          receipt_name
          product_name
        }
      }
    }`
    })
  },
  // 打开APP接口
  getStuLoginPage({ querysData, currentPage }) {
    return axios.post('/graphql/getClassLogin', {
      query: `{
    stuLoginPage(query:${JSON.stringify(
      querysData
    )}, page: ${currentPage}, size: 20) {
          first
          last
          number
          size
          totalPages
          totalElements
          content {
            id
            head
            username
            nickname
            ctime
            mobile
            status
            login_time
            express_ctime
            first_login_time
            page_origin
          }
        }
      }`
    })
  },
  // 参课和完课接口
  getClassCompPage({ querysData, currentPage }) {
    return axios.post('/graphql/getClassComplete', {
      query: `{
      getClassCompPage(query:${JSON.stringify(
        querysData
      )}, page: ${currentPage}, size: 20) {
        first
        last
        number
        size
        totalPages
        totalElements
        content {
          mobile
          buy_time
          username
          nickname
          head
          status
          course_id
          course_title
          course_begin_time
          course_current_num
          join_course_state
          join_course_time
          complete_course_state
          complete_course_time
        }
      }
    }`
    })
  },
  // 作品及点评接口
  getStuCommentPage({ querysData, currentPage }) {
    return axios.post('/graphql/getStuComment', {
      query: `{
      getStuCommentPage(query:${JSON.stringify(
        querysData
      )}, page: ${currentPage}, size: 20) {
        empty
        first
        last
        number
        size
        numberOfElements
        totalElements
        totalPages
        content {
          id
          team_name
          current_lesson
          buytime
          classTitle
          course_current_num
          start_course_date
          status
          head
          mobile
          username
          nickname
          task_image
          works_ctime
          task_sound
          task_video
          task_video_second
          task_sound_second
          has_comment_ctime
          has_comment_utime
          has_listen_time
          sound_comment
          sound_comment_second
          listenInfoArr {
            task_image
            works_ctime
            task_sound
            task_video
            task_video_second
            task_sound_second
          }
        }
      }
    }`
    })
  },
  // 生成完课榜 / 生成作品展
  finishClassList({ queryParams }) {
    return axios.post('/graphql/getStuRankingList', {
      query: `{
                getStuComRankingList(query : ${JSON.stringify(queryParams)}){
                student_id
                mobile
                username
                head
                completeArr {
                current_lesson
                is_complete
                }
            }
          }`
    })
  },
  exhibitionOfWorks({ QueryParams }) {
    return axios.post('/graphql/getStuRankingList', {
      query: `{
            getStuTaskRankingList(query : ${JSON.stringify(QueryParams)}){
            student_id
            mobile
            username
            head
            completeArr {
            current_lesson
            task_image
                }
                }
                  }`
    })
  },
  // 获取课程下拉框接口
  getStuCourseList({ query }) {
    return axios.post('/graphql/getStuComment', {
      query: `{
        getStuCourseList(query:${JSON.stringify(query)}) {
          course_id
          classTitle
        }
      }`
    })
  },

  // 获取体验课列表
  getTrialCourseList(query = '') {
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTrialCourseList(query: ${JSON.stringify(query)}) {
          student_id
          team_id
          order_no
        }
      }`
    })
  },

  // 获取班级信息
  getStudentTeamV1(query = '') {
    const sort = `{"term": "desc", "sup.keyword": "asc", "id": "desc" }`
    return axios.post('/graphql/v1/toss', {
      query: `
        {
          StudentTeamList(query: ${JSON.stringify(
            query
          )}, sort: ${JSON.stringify(sort)}) {
            id
            team_name
          }
        }
      `
    })
  },

  // 获取班级信息 - 模糊搜索
  getStudentTeamV1Search(query = '') {
    const sort = `{"term": "desc", "sup.keyword": "asc", "id": "desc" }`
    return axios.post('/graphql/v1/toss', {
      query: `
        {
          StudentTeamListEx(query: ${JSON.stringify(
            query
          )}, sort: ${JSON.stringify(sort)}) {
            id
            team_name
          }
        }
      `
    })
  }
}
