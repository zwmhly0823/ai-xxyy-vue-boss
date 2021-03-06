/*
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-31 22:54:28
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-13 16:22:00
 */
import {
  getAppSubjectCode, injectSubject
} from '@/utils/index'
import axios from '../axiosConfig'
const subjectCode = getAppSubjectCode()

export default {
  /**
   * 物流列表
   * */
  ExpressList (params) {
    // return this.post(this.API_HOST + '/admin/login/pass/2', params)
    return axios.get(
      `/api/ex/v1/express/getExpressDetailForAPP?expressNo=${params.expressNo}`
    )
  },
  /**
   * 获取物流中台物流详情
   * */
  getExpressDetails (params) {
    return axios.get(
      `/api/ex/v1/express/getExpressDetailCenterForAPP?expressNo=${params.expressNo}`
    )
  },
  /**
   * 添加物流收货人信息
   * @param {*} param0
   */
  createExpressAddressNew (params) {
    return axios.get('/api/ex/v1/express/createExpressAddressNew', params)
  },
  /**
   * 催发地址短信
   * @param {*} param0
   */
  pushMsgByOrderId (orderId) {
    return axios.get(`/api/o/v1/order/pushMsgByOrderId?orderId=${orderId}`)
  },
  /**
   * 物流失效功能
   * @param {*} param0
   */
  makeFailed (val, value, staffId) {
    return axios.post(
      `/api/o/v1/express/updateExpressToInvalid?expressIds=${val}&expressRemark=${value}&operatorId=${staffId}`
    )
  },
  checkPass (params) {
    return axios.post(`/api/o/v1/express/deliveryRequest`, params)
  },

  // 模糊搜索收货人手机号
  searchExpressByRecieptTel (queryString = '') {
    const query = {
      bool: {
        must: [{
          wildcard: {
            receipt_tel: `*${queryString}*`
          }
        },
        {
          term: {
            subject: subjectCode
          }
        }
        ]
      }
    }
    const q = JSON.stringify(query)
    return axios.post('/graphql/v1/toss', {
      query: `
        {
          ExpressListEx(query:${JSON.stringify(q)}){
            id
            receipt_tel
            user_id
          }
        }
      `
    })
  },

  /**
   * 京东物流明细查询
   */
  getExpressDetailJDForAPP (params) {
    return axios.get(
      `/api/o/v1/express/getExpressDetailJDForAPP?expressNo=${params}`
    )
  },
  // 物流上传
  expressUpload (params) {
    return axios.post(
      `/api/o/v1/express/importExpressListNew?operatorId=${params.operatorId}`,
      // `/api/ex/v1/express/importExpressListNew?operatorId=${params.operatorId}`,
      params
    )
  },
  /**
   * 通过订单id查询物流信息
   */
  getExpressByOrderId (params) {
    return axios.get(`/api/o/v1/express/getExpressByOrderId?orderId=${params}`)
  },
  /**
   * 带班详情 物流 修改地址 查询地址接口
   * @param {*} param0
   */
  getAddressList (params) {
    return axios.get(`/api/o/v1/express/getAddressList?userId=${params}`)
  },
  /**
   * 带班详情 物流 修改地址
   * @param {*} param0
   */
  updateExpressAddressNew (params) {
    return axios.get('/api/ex/v1/express/updateExpressAddressNew', params)
  },
  /**
   * 新增地址信息
   * @param {*} param0
   */
  createAddress (params) {
    return axios.get('/api/o/v1/express/createAddress', params)
  },
  // 物流列表
  getLogisticsList (params) {
    return axios.post('/graphql/logisticsList', params)
  },
  // 获取物流筛选数据
  getSearchList (params) {
    return axios.post('/graphql/v1/toss', params)
  },
  // 物流统计
  getLogisticsStatistics (params) {
    return axios.post('/graphql/logisticsStatistics', params)
  },
  /**
   * 自动发货/全国发货 开关控制
   * @param {Array} params
   */
  updateSwitchStatus (params) {
    return axios.post(`/api/ex/v1/switch/updateSwitchStatus`, {
      list: params
    })
  },
  /**
   * 自动发货/全国发货 获取开关数据
   * @param {String} type //开关类型(AUTOMATIC自动发货/COUNTRY全国发货)
   */
  getSwitchByType (type) {
    return axios.post(`/api/ex/v1/switch/getSwitchByType`, type)
  },
  /**
   * 立即发货
   */
  immediately () {
    return axios.get(`/api/ex/v1/express/deliveryTrialCourseByCenterNow`)
  },
  /**
   * 物流状态修改
   * @param {Object} params
   * @param {String} params.expressId - 物流ID
   * @param {String} params.expressStatus - 需要改成的状态：下单失败：DELIVER_WAIT_CONFIRM、无效：INVALID、已签收：DELIVER_SING
   * @param {String} params.expressRemark - 修改备注原因
   * @param {String} params.operatorId - 操作人ID
   */
  updateExpressStatus (params) {
    return axios.post(
      `/api/ex/v1/express/updateExpressStatusForBackend?expressId=${params.expressId}&expressStatus=${params.expressStatus}&expressRemark=${params.expressRemark}&operatorId=${params.operatorId}`,
      params
    )
  },
  /**
   * 获取物流单号
   */
  getExpressNuByCenter (expressId) {
    return axios.get(
      `/api/ex/v1/express/getExpressNuByCenter?expressId=${expressId}`
    )
  },
  /**
   * 回填快递单号:
   * @param {Object} params
   * @param {String} params.expressId // 物流id
   * @param {String} params.expressNu // 物流单号
   * @param {String} params.expressCompany // 物流公司名称
   * @param {String} params.expressCompanyNu // 物流公司编号
   */
  createExpressNu (params) {
    return axios.get(`/api/ex/v1/express/createExpressNu`, params)
  },
  /**
   * v1 订单关联的物流
   */
  //   getOderExpress(query = '', page = 1) {
  //     return axios.post('/graphql/v1/toss', {
  //       query: `
  //         {
  //           ExpressPage(query: ${JSON.stringify(query)}, page: ${page}){
  //             totalElements
  //             content{
  //               id
  //               express_status
  //               order_id
  //             }
  //           }
  //         }
  //       `
  //     })
  //   }
  // 获取第三级地址
  getCenterAddressList (code) {
    return axios.get(`/api/ex/v1/express/getCenterAddressList?code=${code}`)
  },
  // 获取第四级地址
  getCenterAddressTownList (code) {
    return axios.get(`/api/ex/v1/express/getCenterAddressTownList?code=${code}`)
  },
  // 一键发货
  deliveryByCenter (type) {
    return axios.get(`/api/ex/v1/express/deliveryByCenter`, type)
  },
  /**
   * 通过地址id查询物流信息-new
   */
  getAddressById (params) {
    return axios.get(`/api/ex/v1/express/getAddressById?addressId=${params}`)
  },
  /**
   * 通过orderId、producType获取订单签收时间
   */
  getOrderSignTime (query) {
    return axios.get(
      '/api/ex/v1/express/getSigningTimeByOrderIdAndType',
      query
    )
  },
  /**
   * 通过uid、oid获取 退费类型
   */
  getRefundtypeById (params) {
    return axios.get(`/api/b/v1/backend/refund/flow/get`, params)
  },
  saveAndUpdatecontract (params) {
    return axios.post(
      `/api/c/v1/contract/createContract`,
      JSON.stringify(params)
    )
  },
  /**
   * 合同管理 列表查询
   */
  getContracts (params, pages) {
    return axios.post(
      `/api/c/v1/contract/getContracts?name=${params.name}&body=${params.body}&contractType=${params.contractType}&beginTime=${params.beginTime}&endTime=${params.endTime}&page=${pages.page}&size=${pages.size}`
    )
  },
  /**
   * 通过id查询合同详情
   */
  getContractById (params) {
    return axios.get(`/api/c/v1/contract/getContractDetail?id=${params}`)
  },
  /**
   * 通过id查询合同套餐详情
   */
  getOperationRecordById (params) {
    return axios.get(
      `/api/c/v1/contract/getContractPriceDetails?contractId=${params}`
    )
  },
  /**
   * 删除合同
   */
  deleteContractById (params) {
    return axios.get(`/api/c/v1/contract/deleteContract?id=${params}`)
  },
  /**
   * 删除合同套餐
   */
  deleteContractDetailById (params) {
    return axios.get(
      // `/api/c/v1/contract/deleteContractDetail?contractDetailId=${params}`
      `/api/c/v1/contract/stopContractPriceDetail?id=${params}`
    )
  },
  /**
   * 合同配置套餐价格
   */
  createContractPrice (params) {
    return axios.post(`/api/c/v1/contract/createContractPriceDetails`, params)
  },
  /**
   * 合同配置套餐的创建时间 ，获取数据校验时间段
   */
  getCheckPriceDataById (params) {
    return axios.post(`/api/c/v1/contract/checkPriceData?contractId=${params}`)
  },
  /**
   * 获取合同类型
   */
  getContractInfo () {
    return axios.get(`/api/c/v1/contract/contractInfo`)
  },
  /**
   * 通过id修改合同
   */
  getmodifyContractById (params) {
    return axios.put(
      `/api/c/v1/contract/modifyContract`,
      JSON.stringify(params)
    )
  },
  /**
   * 通过orderId、producType获取订单签收时间
   */
  getOrderSignTime (query) {
    return axios.get(
      '/api/ex/v1/express/getSigningTimeByOrderIdAndType',
      query
    )
  },
  expressIsSwitch (params) {
    return axios.post('/graphql/filter',
      {
        query: `{
        isSwitch(query: ${JSON.stringify(
          injectSubject(params)
        )}),{
        is_allow
        }
      }`
      })
  },
}