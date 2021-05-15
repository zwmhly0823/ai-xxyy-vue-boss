/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 16:20:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-19 11:34:19
 */
import axios from '../axiosConfig'
import { injectSubject, getAppSubjectCode } from '@/utils/index'
const subjectCode = getAppSubjectCode()
// 素质课的时候，测试环境暂时删除
// department{
//   department{
//     id
//     pid
//     name
//   }
// }
// teacher_department{
//   department{
//     id
//     pid
//     name
//   }
// }

export default {
  /**
   * ##根据用户ID，查询用户登录信息
   * */
  getClassName(item) {
    return axios.post('/graphql/filter', {
      query: `{
        trialExpressPackageList(query: ${JSON.stringify(item)}){
          id
          name
        }
      }`
    })
  },
  UserLoginDataPage(query, page = 1, size = 20) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        UserLoginDataPage(query: ${JSON.stringify(
        injectSubject(query)
      )}, page: ${page},size:${size}) {
          totalPages
          totalElements
          number
          content {
            id
            ctime
            login_time
            login_source
            ostype
            old_token
            new_token
            device_id
            device_model
            device_type
            user_agent
            appname
            appversion
            buildcode
            system_version
            channel
            market
            carrier
            headers
            }
         }
      }`
    })
  },
  /**
   * 获取订单列表 v1
   * */
  orderPage(query, page = 1) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        OrderPage(query: ${JSON.stringify(
        injectSubject(query)
      )}, page: ${page}) {
          totalPages
          totalElements
          number
          content {
            id
            uid
            associated_order_regtype
            associated_order_out_trade_no
            ctime
            buytime
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
            pay_teacher_duty_id
            user{
              id
              username
              nickname
              mobile
              mobile_province
              mobile_city
              birthday
            }
            user_coupon{
              status
              oid
              status_text
            }
            channel {
              channel_outer_name
            }
            team {
              id
              team_name
            }
            last_teacher_id
            trial_team_id
            teacher{
              realname
              area_name
              department_name
              group_name 
            }
            salesman{
              realname
              area_name
              department_name
              group_name
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
            isrefund
            topic_id
            exchange_type_text 
            exchange_code 
            exchange_code_log{
              library{
                title
              }
            }
          }
        }
      }`
    })
  },
  /**
    * 系统课列表  v1
  * */
  OrderOptStatisticsPage(query, page = 1) {
    return axios.post('/graphql/v1/toss', {
      query: `{

        OrderOptStatisticsPage(query: ${JSON.stringify(

        injectSubject(query)

      )}, page: ${page}) {

          totalPages

          totalElements
          number
         
          content {  
            id
            paymentPay{
              transaction_id
              trade_type_text
            }
            channelDetail {
              channel_outer_name
            }
            discount_amount
            packages_course_week
            remaining_week
            promotionsList{
              gifts_name
            }
            pay_channel_user_extends{
              username
              mobile
              u_id
            }
            invoice_status_text
            uid
            rmbRefundStatusText
            associated_order_regtype
            associated_order_out_trade_no

            ctime

            buytime
            order_total_amount
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

            pay_teacher_duty_id

            user{

              id

              username

              nickname

              mobile

              mobile_province

              mobile_city

              birthday

            }

            user_coupon{

              status

              oid

              status_text

            }

            channel {

              channel_outer_name

            }

            team {

              id

              team_name

            }

            last_teacher_id

            trial_team_id

            teacher{

              realname

              area_name

              department_name

              group_name 

            }

            salesman{

              realname

              area_name

              department_name

              group_name

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

            isrefund

            topic_id

            exchange_type_text 

            exchange_code

            course_sub_out_trade_no
            course_product_name
            course_order_total_amount
            instrument_product_name
            instrument_order_total_amount 
            instrument_sub_out_trade_no 
            instrument_invoice_code
            instrument_invoice_status_text
            instrument_invoice_type_text
            product_type
            exchange_code_log{
            library{
              title
              }

            }

          }

        }

      }`

    })

  },
  /**
    * 乐器订单显示金额
  * */
  OrderOptSumStatistics(must = {}, sumField, termField) {
    // bool 表达式
    // const queryObj = { bool: { must } }
    const queryStr = `${JSON.stringify(must)}`
    return axios.post('/graphql/v1/toss', {
      query: `{
        OrderOptSumStatistics(query: ${JSON.stringify(
        injectSubject(queryStr)
      )}, sumField:"${sumField}", termField:"${termField}"){
          code
          type
          count
          value
        }
      }`
    })
  },
  /**
   * 预付款优惠券列表  v1
   * */
  CouponOrderStatisticsPage(query, page = 1) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        CouponOrderStatisticsPage(query: ${JSON.stringify(
        injectSubject(query)
      )}, page: ${page}) {
          totalPages
          totalElements
          number
          content {
            id
            uid
            ctime
            buytime
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
            pay_teacher_duty_id
            user{
              id
              username
              nickname
              mobile
              mobile_province
              mobile_city
              birthday
            }
            user_coupon{
              status
              oid
              status_text
            }
            channel {
              channel_outer_name
            }
            team {
              id
              team_name
            }
            last_teacher_id
            trial_team_id
            teacher{
              realname
              area_name
              department_name
              group_name 
            }
            salesman{
              realname
              area_name
              department_name
              group_name
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
            isrefund
            topic_id
          }
        }
      }`
    })
  },
  /**
  * 重新分班
  * */
  getRegrounpreSendOrder(params) {
    return axios.post(`/api/b/v1/reSendOrderCompleteMessage?orderId=${params.orderId}&operatorId=${params.operatorId}`)
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
          },
          {
            term: { subject: subjectCode }
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
        injectSubject(queryStr)
      )}, sumField:"${sumField}", termField:"${termField}"){
          code
          type
          count
          value
        }
      }`
    })
  },
  // 预付款优惠券
  CouponOrderSumStatistics(must = {}, sumField, termField) {
    // bool 表达式
    // const queryObj = { bool: { must } }
    const queryStr = `${JSON.stringify(must)}`
    return axios.post('/graphql/v1/toss', {
      query: `{
        CouponOrderSumStatistics(query: ${JSON.stringify(
        injectSubject(queryStr)
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
  },

  /**
   * 批量发送 地址催发短信
   * get
   * @orderIds: String, '1,2,4'
   */
  pushMsgByOrderIds(orderIds) {
    return axios.get(`/api/o/v1/order/pushMsgByOrderIds?orderIds=${orderIds}`)
  },
  /**
   * 素质课批量获取商品信息
   */
  getQualityClassProductDetail(ids) {
    const query = {
      oid: ids,
      is_gifts: '1'
    }
    const q = JSON.stringify(query)
    return axios.post('/graphql/v1/toss', {
      query: `{
        OrderProductList(query: ${JSON.stringify(q)}){
          oid
          name
          price
        }
      }`
    })
  },
  /*
   *获取交易流水号
   * */
  searchPaymentPay(no = '', size = 20) {
    const query = {
      bool: {
        must: [
          {
            wildcard: { transaction_id: `*${no}*` }
          },
          {
            term: { subject: subjectCode }
          },
          {
            term: { status: 2 }
          },
          {
            term: { type: 1 }
          }
        ]
      }
    }
    const q = JSON.stringify(query)
    return axios.post('/graphql/v1/toss', {
      query: `{
        PaymentPayListEx(query: ${JSON.stringify(q)}, size: ${size}){
          oid,
          transaction_id
        }
      }`
    })
  },
  /*
   * 获取发票管理列表
   * */
  invoicePage(query, page = 1) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        InvoiceRecordPage(query: ${JSON.stringify(query)}, page: ${page}) {
          content {
            id
            oid
            ctime
            uid
            invoice_status
            title_type
            company_name
            invoice_img
            invoice_pdf
            invoice_status
            invoice_type
            email
            address
            phone
            taxnum
            buyername
            account
            message
            money
            uniq_id
            complete_time
            isImport
            userInfo {
              user_num
              username
              mobile
            }
            orderInfo {
              out_trade_no
              invoice_code
            }
            paymentPayInfo {
              transaction_id
            }
          }
          empty
          first
          last
          number
          size
          numberOfElements
          totalElements
          totalPages
        }
      }`
    })
  },

  /*
   *获取交易流水号 v2
   {'transaction_id.like':{'transaction_id.keyword':'*word*'}}
   * */
  searchPaymentPayV2(params = {}) {
    const query = Object.assign(params || {}, { subject: subjectCode })
    return axios.post('/graphql/v1/toss', {
      query: `{
        PaymentPayList(query: ${JSON.stringify(JSON.stringify(query))}){
          oid,
          transaction_id
        }
      }`
    })
  }
}
