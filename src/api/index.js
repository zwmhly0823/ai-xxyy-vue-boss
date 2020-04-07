/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-07 13:57:34
 */
import Login from './modules/Login'
import User from './modules/User' // 用户接口
import Order from './modules/Order' // 订单接口
import Team from './modules/Team' // 班级接口
import Express from './modules/Express' // 物流接口
import StudentTerm from './modules/StudentTerm' // 班级graphql接口
import Teacher from './modules/teacher' // 老师模块接口

export default Object.assign(
  {},
  { Login },
  { Order },
  { User },
  { Team },
  { StudentTerm },
  { Express },
  { Teacher }
)
