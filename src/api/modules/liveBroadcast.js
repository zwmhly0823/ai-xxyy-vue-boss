/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-16 19:46:39
 * @LastEditors: Shentong
 * @LastEditTime: 2020-11-09 21:53:20
 */
import axios from '../axiosConfig'
import { injectSubject, getAppSubjectCode } from '@/utils/index'
export default {
  /**
   * 获取直播活动分页列表接口
   *
   */
  liveBroadcastActivityList(params) {
    return axios.get(`/api/ump//live/activity/page/list`, params)
  },

  /**
   * 获取自动联想活动名称接口
   *
   */
  liveAssociationActivityName(params) {
    return axios.get(`/api/ump/live/activity/select/list`, params)
  },

  /**
   * 获取直播活动详情页统计接口
   *
   */
  liveBroadcastActivityDetailCountDetail(params) {
    return axios.get(`/api/ump/live/activity/detail/count`, params)
  },

  /**
   * 直播活动详情列表
   * 
   */
  ActivityUserStatisticsPage(query, page = 1, sort) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        ActivityUserStatisticsPage(sort:${JSON.stringify(
          injectSubject(sort)
        )} query: ${JSON.stringify(
        injectSubject(query)
      )}, page: ${page}), {
                  totalPages
                  totalElements
                  number
                  content {
                    uid
                    is_in_room_text
                    in_room_num
                    chat_count
                    watch_time
                    user_status
                    packages_name
                    like_count
                    chat_count
                    join_at
                    user {
                      id
                      mobile
                      head
                      username
                    }
                    team {
                      team_name
                      team_type
                      team_state
                    }
                    teacher_trial {
                      id
                      realname
                      departmentInfo {
                        name
                      }
                    }
                    teacher_system {
                      realname
                      departmentInfo {
                        name
                      }
                    }
                    live {
                      open_time
                      live_name
                      live_status
                      push_terminal
                    }
                  }
                }
            }`
    })
  },

  /**
  * 获取直播评论分页列表接口
  * 
  */
  liveBroadcastChatList(params) {
    return axios.get(`/api/ump/live/chat/page/list`, params)
  },
}