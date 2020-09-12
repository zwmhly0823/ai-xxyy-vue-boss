/*
 * @Descripttion: 常用基础数据接口
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-07-18 15:45:45
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-09-11 15:30:30
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
      bool: {
        must: [],
        filter: {
          bool: {
            should: [
              {
                wildcard: {
                  mobile: `*${val}*`
                }
              },
              {
                wildcard: {
                  usernum: `*${val}*`
                }
              },
              {
                wildcard: {
                  'username.keyword': `*${val}*`
                }
              }
            ]
          }
        }
      }
    }
    // const query = {
    //   'mobile.like': { 'mobile.keyword': `*${val}*` },
    //   'user_num.like': { 'user_num.keyword': `*${val}*` }
    // }
    // const q = JSON.stringify(query)
    const sort = `{"id":"desc"}`
    return axios.post('/graphql/v1/toss', {
      query: `{
        UserSubjectStatisticsListEx(query: ${JSON.stringify(
          injectSubject(query)
        )}, sort: ${JSON.stringify(sort)}){
            id
            mobile
            username
            user_num
            u_id
            subject
            }
          }`
    })
  }
}
