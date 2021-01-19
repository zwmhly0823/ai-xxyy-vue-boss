/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 20:26:32
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-25 22:11:13
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

const staff = JSON.parse(localStorage.getItem('staff'))

let superOperatingRouter = []
let uploadFilePeimission = []
// 管理员、
const adminRouter = []
if (staff.mobile === '15801332536') {
  uploadFilePeimission = [
    {
      path: '/uploadFile',
      name: 'uploadFile',
      meta: {
        title: '上传素材'
        // module: 'operating'
      },
      component: () => import('../views/operating/views/uploadFile/index.vue')
    }
  ]
}
// 超级管理员权限
if (staff.roleId === '7') {
  superOperatingRouter = [
    {
      path: '/operatingSchedule',
      name: 'operatingSchedule',
      meta: {
        title: '招生排期'
      },
      component: () =>import('../views/operating/views/enrollmentSchedule/index.vue')
    },
    {
      path: '/changePhoneNumber',
      name: 'changePhoneNumber',
      meta: {
        title: '手机号替换'
      },
      component: () =>
        import('../views/operating/views/changePhoneNumber/index.vue')
    }
  ]
}
// 管理员权限
if (staff.roleId === '1') {
  adminRouter.push({
    path: '/changePhoneNumber',
    name: 'changePhoneNumber',
    meta: {
      title: '手机号替换'
    },
    component: () =>
      import('../views/operating/views/changePhoneNumber/index.vue')
  })
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/trail/:status',
    name: 'trialTeamV2',
    meta: {
      title: '班级管理',
      keepAlive: true
    },
    component: () => import('../views/studentTeam/views/trial-v2/index.vue')
  },
  {
    path: '/trail/0/prepare',
    name: 'trialTeamV2Prepare',
    meta: {
      title: '待上课'
    },
    component: () => import('../views/studentTeam/views/trial-v2/prepare.vue')
  },
  {
    path: '/trail/1/ongoing',
    name: 'trialTeamV2Ongoing',
    meta: {
      title: '上课中'
    },
    component: () => import('../views/studentTeam/views/trial-v2/ongoing.vue')
  },
  {
    path: '/trail/2/complete',
    name: 'trialTeamV2Complete',
    meta: {
      title: '已完课'
    },
    component: () => import('../views/studentTeam/views/trial-v2/complete.vue')
  },
  /**
   * 体验课班级V2.0 End
   */
  {
    path: '/trialTeam', // 体验课班级
    name: 'trialTeam',
    meta: {
      title: '体验课班级',
      keepAlive: true
    },
    hidden: true,
    component: () => import('../views/studentTeam/views/trialTeam/index.vue')
  },
  {
    path: '/systemTeam', // 系统课班级
    name: 'systemTeam',
    meta: {
      title: '系统课班级',
      keepAlive: true
    },
    hidden: true,
    component: () => import('../views/studentTeam/views/systemTeam/index.vue')
  },
  {
    path: '/teamDetail/:id/:type', // 班级详情
    name: 'teamDetail',
    meta: {
      title: '班级中心'
    },
    hidden: true,
    component: () => import('../views/studentTeam/views/teamDetail/index.vue')
  },
  {
    path: '/trading',
    name: 'trading',
    // hidden: true,
    meta: {
      title: '交易管理',
      icon: 'iconjianyiguanli'
    },
    component: () => import('../views/trading/views/order/orderModule.vue')
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      title: '订单管理',
      show: true
    },
    component: () => import('../views/trading/views/order/orderModule.vue')
  },
  {
    path: '/financeRefound',
    name: 'financeRefound',
    meta: {
      title: '订单退款',
      show: true
    },
    component: () =>
      import('../views/trading/views/financeRefound/financeRefound.vue')
  },
  {
    path: '/invoiceManage',
    name: 'invoiceManage',
    meta: {
      title: '发票管理',
      show: true
    },
    component: () => import('../views/trading/views/invoiceManage/index.vue')
  },
  {
    path: '/express',
    name: 'express',
    meta: {
      title: '物流管理',
      icon: 'iconwuliuguanli'
    },
    component: () => import('../views/express/views/expressCenter/index.vue')
  },
  {
    path: '/operating',
    name: 'operating',
    // hidden: true,
    meta: {
      title: '运营管理',
      icon: 'iconyunyingzhongxin',
      bottom: true
    },
    component: () =>
      import('../views/operating/views/activityManagement/index.vue')
  },
  {
    path: '/activityManagement',
    name: 'activityManagement',
    meta: {
      title: '活动管理'
    },
    component: () =>
      import('../views/operating/views/activityManagement/index.vue')
  },
  {
    path: '/channelManagement',
    name: 'channelManagement',
    meta: {
      title: '渠道管理'
    },
    component: () =>
      import('../views/operating/views/channelManagement/channelManagement.vue')
  },
  {
    path: '/comment',
    name: 'comment',
    meta: {
      title: '语音库'
    },
    component: () =>
      import('../views/operating/views/reviewManagement/comment.vue')
  },
  {
    path: '/reviewManagement',
    name: 'reviewManagement',
    meta: {
      title: '点评管理'
    },
    component: () =>
      import('../views/operating/views/reviewManagement/index.vue')
  },
  {
    path: '/verificationCode',
    name: 'verificationCode',
    meta: {
      title: '验证码查询'
    },
    component: () =>
      import(
        '../views/operating/views/reviewManagement/components/verificationCode.vue'
      )
  },
  {
    path: '/labelManage',
    name: 'labelManage',
    meta: {
      title: '标签管理'
    },
    component: () => import('../views/operating/views/labelManage/index.vue')
  },
  {
    path: '/pushConfig',
    name: 'pushConfig',
    meta: {
      title: '推送配置'
    },
    component: () => import('../views/operating/views/pushConfig/index.vue')
  },
  {
    path: '/problem',
    name: 'problem',
    meta: {
      title: '问卷管理'
    },
    component: () => import('../views/operating/views/problem/index.vue')
  },
  {
    path: '/issueBearCoins',
    name: 'issueBearCoins',
    meta: {
      title: '发放小熊币'
    },
    component: () => import('../views/operating/views/issueBearCoins/index.vue')
  },
  {
    path: '/newActivityManage/:promotionsId/:type',
    name: 'newActivityManage',
    meta: {
      title: '活动管理',
      keepAlive: false
    },
    component: () =>
      import(
        '../views/operating/views/activityManagement/addActivityManage/index.vue'
      )
  },
  {
    path: '/addSchedule/:period/:courseType/',
    name: 'addSchedule',
    meta: {
      title: '新建排期',
      keepAlive: false
    },
    component: () => import('../views/operating/views/addSchedule/index.vue')
  },
  {
    path: '/scheduleDetail/:period/:courseType/',
    name: 'scheduleDetail',
    meta: {
      title: '排期详情',
      keepAlive: false
    },
    component: () => import('../views/operating/views/scheduleDetail/index.vue')
  },
  {
    path: '/recommend',
    name: 'recommend',
    meta: {
      title: '转介绍截图'
    },
    component: () =>
      import('../views/operating/views/recommend/changeRecommend.vue')
  },
  {
    path: '/approval',
    name: 'approval',
    meta: {
      title: '审批中心',
      icon: 'iconshenpizhongxin'
    },
    component: () => import('../views/approval/approvalCenter/index.vue')
  },

  {
    path: '/approvalCenter',
    name: 'approvalCenter',
    meta: {
      title: '审批中心',
      keepAlive: false
    },
    component: () => import('../views/approval/approvalCenter/index.vue')
  },
  {
    path: '/moneyBack',
    name: 'moneyBack',
    meta: {
      title: '退款审批',
      keepAlive: false
    },
    component: () =>
      import('../views/approval/approvalCenter/components/moneyBack.vue')
  },
  {
    path: '/repair',
    name: 'repair',
    meta: {
      title: '补发货审批',
      keepAlive: false
    },
    component: () =>
      import('../views/approval/approvalCenter/components/repair.vue')
  },
  {
    path: '/approvalCenter/adjust',
    name: 'adjust',
    meta: {
      title: '审批中心'
    },
    component: () =>
      import(
        /* webpackChunkName: "adjust" */
        '../views/approval/approvalCenter/components/adjustClass.vue'
      )
  },
  {
    path: '/approvalCenter/mergeboxes',
    name: 'mergeboxes',
    meta: {
      title: '审批中心'
    },
    component: () =>
      import(
        /* webpackChunkName: "mergeboxes" */
        '../views/approval/approvalCenter/views/mergeBoxes.vue'
      )
  },
  {
    path: '/outbound',
    name: 'outbound',
    meta: {
      title: '呼叫中心',
      icon: 'icondianhua'
    },
    component: () => import('../views/outbound/views/callRecord/index.vue')
  },
  {
    path: '/CallRecord',
    name: 'CallRecord',
    meta: {
      title: '通话记录',
      style: 'line'
    },
    component: () => import('../views/outbound/views/callRecord/index.vue')
  },
  {
    path: '/CallCenter',
    name: 'CallCenter',
    meta: {
      title: '席位配置',
      style: 'line'
    },
    component: () => import('../views/outbound/views/callCenter/index.vue')
  },
  {
    path: '/Active',
    name: 'Active',
    meta: {
      title: '活动',
      style: 'line'
    },
    component: () => import('../views/active/index.vue')
  },

  ...uploadFilePeimission,
  ...superOperatingRouter,
  ...adminRouter
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  moudle: 'music_app',
  routes
})

export default router
