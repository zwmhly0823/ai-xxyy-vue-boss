/*
 * @Descripttion: 美术宝写字接口文件
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 20:42:54
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-26 15:51:58
 */

import User from './modules/write_app/User' // 用户接口
import Operating from './modules/write_app/Operating' // 运营中心
import Order from './modules/write_app/Order' // 订单接口
import Team from './modules/write_app/Team' // 班级接口
import DownloadExcel from './modules/DownloadExcel' // 统计模块
export default Object.assign(
  {},
  { User },
  { Operating },
  { Order },
  { DownloadExcel },
  { Team }
)
