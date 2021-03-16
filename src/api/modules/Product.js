/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-17 18:11:54
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-04-17 22:42:23
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
  },
  /**
   * /v1/product/TopicDetail 商品主题id查询
   */
  getTopicDetail(params) {
    return axios.get(`/api/p/v1/product/TopicDetail?topicId=${params}`)
  },
  /**
   * 散件商品信息
   * @param {Object} params
   */
  getCourseMaterialsParts(params) {
    return axios.get(
      `/api/p/v1/product/getCourseMaterialsParts?courseType=${params.packagesType}&courseDifficulty=${params.sup}&courseLevel=${params.level}`
    )
  },
  /**
   *  o_order_product
   */
  orderProductPage(query = '', page = 1) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        OrderProductPage(query: ${JSON.stringify(query)}, page: ${page}){
          totalPages
          totalElements
          number
          content{
            pid
            oid
            id
          }
        }
      }`
    })
  },
  /**
    v1/product/getCourseMaterials?courseType=EXPERIENCE_COURSE&proVersion=&courseDifficulty=S1&courseLevel=LEVEL1
   * 盒子商品信息 
   */
  getCourseMaterials(params) {
    return axios.get(
      `/api/p/v1/product/getCourseMaterials?courseType=${params.packagesType}&proVersion=${params.proVersion}&courseDifficulty=${params.sup}&courseLevel=${params.level}`
    )
  },
  /**
   * @description 获取版本号
   * @param {type} params
   */
  getCourseVersion(params) {
    return axios.get(`/api/s/v1/data/dictionary/byType?type=${params.type}`)
  }
}
