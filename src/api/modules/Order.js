/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 16:20:48
 * @LastEditors: shentong
 * @LastEditTime: 2020-03-13 19:40:26
 */
import axios from '../axiosConfig'

export default {
  /**
   * 获取订单列表 v1
   * */
  orderPage(query, page = 1) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        OrderPage(query: ${JSON.stringify(query)}, page: ${page}) {
          totalPages
          totalElements
          number
          content {
            id
            ctime
            packages_name
            sup
            stage
            regtype
            amount
            status
            order_status
            bear_integral
            gem_integral
            product_name
            user{
              nickname
              mobile
            }
            channel {
              channel_outer_name
            }
            team {
              team_name
            }
            last_teacher_id
            department{
              department{
                id
                pid
                name
              }
            }
            teacher{
              realname
            }
          }
        }
      }`
    })
  },

  /**
   * 订单统计, 只能用表达式 {bool:{must:[]}}
   */
  orderStatistics(must = [], sumField, termField) {
    // bool 表达式
    const queryObj = { bool: { must } }
    // if (query && Object.prototype.toString.call(query) === '[object Object]') {
    //   let must = []
    //   must = Object.keys(query).map((k) => {
    //     const item = query[k]
    //     const key = Array.isArray(item) ? 'terms' : 'term'
    //     return { [key]: { [k]: query[k] } }
    //   })
    //   queryObj.bool.must = must
    // }
    const queryStr = `${JSON.stringify(queryObj)}`
    return axios.post('/graphql/v1/toss', {
      query: `{
        OrderStatistics(query: ${JSON.stringify(
          queryStr
        )}, sumField:"${sumField}", termField:"${termField}"){
          code
          type
          count
          value
        }
      }`
    })
  }
}
