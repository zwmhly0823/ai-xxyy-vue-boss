/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: Shentong
 * @LastEditTime: 2020-03-17 18:49:07
 */
import Login from './modules/Login'
import User from './modules/User' // 用户接口
import Order from './modules/Order' // 订单接口

export default Object.assign({}, { Login }, { Order }, { User })
