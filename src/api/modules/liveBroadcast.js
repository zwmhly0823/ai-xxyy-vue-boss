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
                    huo_user_id
                    chat_count
                    watch_time
                    user_status
                    packages_name
                    like_count
                    chat_count
                    play_status_text
                    in_room_count
                    live_watch_time
                    join_at
                    playback_watch_time
                    first_join_time
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
    /**
   * 体验课班级直播活动
   */

  // 获取直播活动
  getLiveActive(params) {
    return axios.get(
      `/api/ump/live/activity/list/byTeam?teamId=${params.teamId}`
    )
  },
  // 获取直播活动统计接口
  getLiveCount(params) {
    return axios.get(
      `/api/ump/live/activity/team/trialcourse/detail/count?teamId=${params.teamId}&activityId=${params.activityId}`
    )
  },

  // 获取直播活动列表
  getActiveList(
    params = {},
    { page = 1, size = 20 } = {},
  ) {
    const query = JSON.stringify(injectSubject(params))

    return axios.post('/graphql/v1/toss', {
      query: `{
        ActivityUserStatisticsPage(query:${query}, page: ${page}, size: ${size}){
          totalPages
          totalElements
          number
          content {
            uid
            act_id
            is_in_room_text
            in_room_count
            first_join_time
            play_status_text
            chat_count
            live_watch_time
            playback_watch_time
            user_status
            packages_name
            like_count
            chat_count
            user {
              id
              mobile
              head
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
}