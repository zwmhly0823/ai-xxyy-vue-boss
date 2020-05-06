/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-30 21:09:50
 */
import Login from './modules/Login'
import User from './modules/User' // 用户接口
import Order from './modules/Order' // 订单接口
import Team from './modules/Team' // 班级接口
import Express from './modules/Express' // 物流接口
import StudentTerm from './modules/StudentTerm' // 班级graphql接口
import Permission from './modules/Permission' // 老师权限接口
import Department from './modules/Department' // 组织机构接口
import Product from './modules/Product' // 产品相关接口
import Teacher from './modules/Teacher' // 产品相关接口

export default Object.assign(
  {},
  { Login },
  { Order },
  { User },
  { Team },
  { StudentTerm },
  { Express },
  { Permission },
  { Department },
  { Product },
  { Teacher }
)
