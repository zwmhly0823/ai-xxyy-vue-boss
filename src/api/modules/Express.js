/*
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-31 22:54:28
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-01 14:05:38
 */
import axios from '../axios'

export default {
  /**
   * 物流列表
   * */
  ExpressList(params) {
    // return this.post(this.API_HOST + '/admin/login/pass/2', params)
    return axios.get(
      `/api/o/v1/express/getExpressDetailForAPP?expressNo=${params.expressNo}`
    )
  },
  /**
   * 添加物流收货人信息
   * @param {*} param0
   */
  editAddressAndExpressForOrder(params) {
    return axios.get(`/api/o/v1/express/editAddressAndExpressForOrder?operatorId=${params.operatorId}&orderId=${params.orderId}
    &addressId=${params.addressId}&expressId=${params.expressId}&userId=${params.userId}&receiptName=${params.receiptName}
    &receiptTel=${params.receiptTel}&province=${params.province}&city=${params.city}&area=${params.area}
    &addressDetail=${params.addressDetail}&areaCode=${params.areaCode}&expressNo=${params.expressNo}&expressCompany=${params.expressCompany}
    &expressCompanyNu=${params.expressCompanyNu}`)
  }
}
