/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 18:42:38
 * @LastEditors: Shentong
 * @LastEditTime: 2020-07-03 17:22:55
 */
import axios from '../axiosConfig'

export default {
  /**
   * 查询模版信息
   *
   */
  getSopTemplate(params) {
    return axios.get(
      `/api/toss/v1/toss-api/soptemplate/getTemplate?templateId=${params.templateId}`
    )
  },
  /**
   * 编辑或者添加任务
   *
   */
  getToSaveOrUpdate(params) {
    return axios.get(
      `/api/toss/v1/toss-api/sopJobTask/toSaveOrUpdate?id=${params.id}&teacherId=${params.teacherId}`
    )
  },
  /**
   * 获取群信息
   *
   */
  getWeChatCluster(params) {
    return axios.get(
      `/api/toss/v1/toss-api/sopJobTask/getWeChatCluster?wechatNo=${params.wechatNo}&taskstatus=${params.taskstatus}&name=${params.name}`
    )
  },
  /**
   * 保存或者更新任务
   *
   */
  saveOrUpdateSopJobTask(data) {
    return axios.post(
      '/api/toss/v1/toss-api/sopJobTask/saveOrUpdateSopJobTask',
      data
    )
  },
  /**
   * 任务列表
   *
   */
  listJobTaskPage(data) {
    return axios.post('/api/toss/v1/toss-api/sopJobTask/listJobTaskPage', data)
  },
  /**
   * 获取模版列表
   *
   */
  getTempList(params) {
    return axios.get(
      `/api/toss/v1/toss-api/soptemplate/getTempList?uid=${params.uid}&type=${params.type}`
    )
  },
  /**
   * sop模板 查看详情
   *
   */
  viewSopJobTask(params) {
    return axios.get(
      `/api/toss/v1/toss-api/sopJobTask/viewSopJobTask?id=${params.id}`
    )
  },
  /**
   * sop模板 更新任务状态
   *
   */
  updateStatus(params) {
    return axios.get(
      `/api/toss/v1/toss-api/sopJobTask/updateStatus?id=${params.id}&taskstatus=${params.taskstatus}`
    )
  }
}
