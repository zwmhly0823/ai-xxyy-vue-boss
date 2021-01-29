/*
 * @Descripttion: 组合所有接口文件
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-15 22:09:19
 */
/**
 * 美术宝写字 专有。 业务代码中引用： this.$http.writeApp.User(params).then()
 */
import writeApp from './index_write_app'

/**
 * 小熊美术 及 公共
 */
import Base from './modules/Base'
import Login from './modules/Login'
import User from './modules/User' // 用户接口
import Order from './modules/Order' // 订单接口
import Team from './modules/Team' // 班级接口
import Express from './modules/Express' // 物流接口
import StudentTerm from './modules/StudentTerm' // 班级graphql接口
import Permission from './modules/Permission' // 老师权限接口
import Department from './modules/Department' // 组织机构接口
import Product from './modules/Product' // 产品相关接口
import Teacher from './modules/Teacher' // 老师模块
import Statistics from './modules/Statistics' // 统计模块
import DownloadExcel from './modules/DownloadExcel' // 统计模块
import Backend from './modules/Backend' // 后台相关接口
import RefundApproval from './modules/refundApproval' // 退款申请表单
import Approval from './modules/Approval' // 审批相关模块
import Weixin from './modules/Weixin' // 微信graphql接口
import Operating from './modules/Operating' // 运营中心
import RiviewCourse from './modules/RiviewCourse'
import Finance from './modules/finance' // 财务退款
import WorkerHandover from './modules/WorkerHandover'
import Staff from './modules/Staff' // 员工
import NoticeCenter from './modules/NoticeCenter'
import Community from './modules/Community' // 社群工具
import Outbound from './modules/Outbound' // 社群工具
import Marketing from './modules/Marketing' // 营销中心
import LearnRecord from './modules/LearnRecord' // 学习记录
import Setting from './modules/Setting'
import TeamV2 from './modules/TeamV2'
import Active from './modules/Active'

export default Object.assign(
  {},
  { writeApp },
  { Base },
  { Login },
  { Order },
  { User },
  { Team },
  { StudentTerm },
  { Express },
  { Permission },
  { Department },
  { Product },
  { Teacher },
  { Weixin },
  { Operating },
  { Statistics },
  { RiviewCourse },
  { DownloadExcel },
  { Backend },
  { RefundApproval },
  { Approval },
  { Finance },
  { WorkerHandover },
  { Staff },
  { NoticeCenter },
  { Community },
  { Outbound },
  { Marketing },
  { LearnRecord },
  { Setting },
  { TeamV2 },
  { Active },
)
