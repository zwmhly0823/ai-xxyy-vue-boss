/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-21 11:58:33
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-03-21 12:05:08
 * @Description: 班级
 */
import axios from '../axiosConfig'

export default {
  // 获取体验课状态列表
  getExperienceStatusList(params) {
    return axios.post(`/graphql/team`, params)
  }
}
