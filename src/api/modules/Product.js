/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-17 18:11:54
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-04-17 19:18:13
 * @Description: 产品及套餐相关接口
 */

import axios from '../axiosConfig'
export default {
  /**
   * p_packages_topic 商品主题，获取关联id
   */
  topicRelationId(query = '') {
    return axios.post('/graphql/v1/toss', {
      query: `{
        PackagesTopicList(query:${JSON.stringify(query)}, size: 500){
          relation_id
        }
      }`
    })
  }
}
