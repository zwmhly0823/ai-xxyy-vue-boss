/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 16:20:48
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-12 18:01:03
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
            uid
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
            out_trade_no
            total_amount
            user{
              id
              username
              nickname
              mobile
              mobile_province
              mobile_city
              birthday
            }
            channel {
              channel_outer_name
            }
            team {
              id
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
            teacher_department{
              department{
                id
                pid
                name
              }
            }
            teacher{
              realname
            }
            salesman{
              realname
            }
            express{
              express_total
              last_express_status
              address_detail
              province
              city
              area
              product_name
              product_type
            }
            trial_course{
              team_category
            }
            first_order_send_id
            first_send_user{
              id
              username
              nickname
              mobile
            }
            trial_pay_channel
            trial_pay_channel_text
          }
        }
      }`
    })
  },

  /**
   * 模糊搜索订单号
   * @param {*} query 订单号
   * @param {*} size
   */
  searchOutTradeNo(no = '', size = 20) {
    const query = {
      bool: {
        must: [
          {
            wildcard: { out_trade_no: `*${no}*` }
          }
        ]
      }
    }
    const q = JSON.stringify(query)
    return axios.post('/graphql/v1/toss', {
      query: `{
        OrderListEx(query: ${JSON.stringify(q)}, size: ${size}){
          id,
          out_trade_no
        }
      }`
    })
  },

  /**
   * 订单统计, 只能用表达式 {bool:{must:[]}}
   * 更新：求和接口 sum 支持最新的对象传参 05-25 YangJiyong
   */
  orderStatistics(must = {}, sumField, termField) {
    // bool 表达式
    // const queryObj = { bool: { must } }
    const queryStr = `${JSON.stringify(must)}`
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
  },
  /*
  通过uid查询订单号
  */
  getOrdersByUid(uid) {
    return axios.get(
      `/api/o/v1/order/getOrdersByStatus?userId=${uid}&status=COMPLETED&page=0`
    )
  }
}
