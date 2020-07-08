/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 18:42:38
 * @LastEditors: Shentong
 * @LastEditTime: 2020-07-08 15:25:39
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
   */
  getWeChatCluster(params) {
    return axios.get(
      `/api/toss/v1/toss-api/sopJobTask/getWeChatCluster?wechatNo=${params.wechatNo}&taskstatus=${params.taskstatus}&name=${params.name}`
    )
  },
  /**
   * 保存或者更新任务
   */
  saveOrUpdateSopJobTask(data) {
    return axios.post(
      '/api/toss/v1/toss-api/sopJobTask/saveOrUpdateSopJobTask',
      data
    )
  },
  /**
   * SOP模板列表
   */
  getTemplateList(params) {
    const { templateName = '', state } = params
    return axios.post(
      `/api/toss/v1/toss-api/soptemplate/saveOrUpdate?&templateName=${templateName}&state=${state}`
    )
  },
  /**
   * 保存或者更新SOP模板信息
   */
  saveOrUpdateSopTmpInfo(params) {
    const { templateName = '', templateId = '', state, map = [] } = params
    return axios.post(
      `/api/toss/v1/toss-api/soptemplate/saveOrUpdate?templateId=${templateId}&templateName=${templateName}&state=${state}`,
      map
    )
  }
}
