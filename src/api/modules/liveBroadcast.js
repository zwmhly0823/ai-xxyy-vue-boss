/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-16 19:46:39
 * @LastEditors: Shentong
 * @LastEditTime: 2020-11-09 21:53:20
 */
import axios from '../axiosConfig'

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

}