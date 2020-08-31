/*
 * @Descripttion: 常用基础数据接口
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-07-18 15:45:45
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-08-31 15:55:32
 */

import axios from '../axiosConfig'
import { injectSubject } from '@/utils'

export default {
  // 获取省市区三级地址
  getCenterAddressList(code = '') {
    return axios.get(`/api/ex/v1/express/getCenterAddressList?code=${code}`)
  },
  // 获取第四级地址， code 为第三级code
  getCenterAddressTownList(code) {
    return axios.get(`/api/ex/v1/express/getCenterAddressTownList?code=${code}`)
  },
  // 模糊 搜索用户 手机号、用户编码（ID
  getUserNumPhone(val) {
    const query = {
      'mobile.like': { 'mobile.keyword': `*${val}*` },
      'user_num.like': { 'user_num.keyword': `*${val}*` }
    }
    // const q = JSON.stringify(query)
    const sort = `{"id":"desc"}`
    return axios.post('/graphql/v1/toss', {
      query: `{
        UserSubjectStatisticsList(query: ${JSON.stringify(
          injectSubject(query)
        )}, sort: ${JSON.stringify(sort)}){
            id
            mobile
            username
            user_num
            subject
            }
          }`
    })
  }
}
