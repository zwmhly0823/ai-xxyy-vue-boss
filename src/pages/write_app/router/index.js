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

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'users',
    meta: {
      title: '学员中心',
      icon: 'el-icon-s-custom',
      keepAlive: true
    }
  },
  {
    path: '/details/:id',
    name: 'detailsUsers',
    meta: {
      title: '学员详情',
      keepAlive: false
    },
    component: () => import('../../users/views/details/index.vue')
  },
  {
    path: '/trialUsers',
    name: 'trialUsers',
    meta: {
      title: '体验课学员',
      keepAlive: true
    },
    component: () => import('../views/users/views/usersModule.vue')
  },
  {
    path: '/systemUsers',
    name: 'systemUsers',
    meta: {
      title: '系统课学员',
      keepAlive: true
    },
    component: () => import('../views/users/views/usersModule.vue')
  },
  {
    path: '/allUsers',
    name: 'allUsers',
    meta: {
      title: '全部学员',
      keepAlive: false
    },
    component: () => import('../views/users/views/usersModule.vue')
  },
  {
    path: '/operatingSchedule',
    name: 'operatingSchedule',
    meta: {
      title: '招生排期',
      keepAlive: true
    },
    component: () => import('../views/Operating/scheduleList/index.vue')
  },
  // 新增、编辑
  {
    path: '/addSchedule/:period/:courseType/',
    name: 'addSchedule',
    meta: {
      title: '新建排期',
      keepAlive: false
    },
    component: () => import('../views/Operating/addSchedule/index.vue')
  },
  {
    path: '/scheduleDetail/:period/:courseType/',
    name: 'scheduleDetail',
    meta: {
      title: '排期详情',
      keepAlive: false
    },
    component: () => import('../views/Operating/scheduleDetail/index.vue')
  },
  {
    path: '/teacherManagement',
    name: 'teacherManagement',
    meta: {
      title: '员工账号',
      keepAlive: true
    },
    component: () =>
      import('../../teacher/views/teacherManagement/teacherManage.vue')
  },
  {
    path: '/weixinManagement',
    name: 'weixinManagement',
    meta: {
      title: '员工微信',
      keepAlive: true
    },
    component: () =>
      import('../../teacher/views/weixinManagement/accountManagement.vue')
  },
  {
    path: '/systemAccount',
    name: 'systemAccount',
    meta: {
      title: '系统账号',
      keepAlive: true
    },
    component: () => import('../../teacher/views/systemAccount/index.vue')
  },
  {
    path: '/newTeacher',
    name: 'newTeacher',
    meta: {
      title: '新增员工',
      keepAlive: false
    },
    component: () =>
      import('../../teacher/views/teacherManagement/components/newTeacher.vue')
  },
  {
    path: '/express',
    name: 'express',
    meta: {
      title: '物流管理',
      keepAlive: true
    },
    component: () => import('../views/express/views/expressCenter/index.vue')
  },
  // {
  //   path: '/express',
  //   name: 'express',
  //   meta: {
  //     title: '物流管理',
  //     keepAlive: true
  //   },
  //   component: () => import('../views/express/views/expressCenter/index.vue')
  // },
  {
    path: '/order',
    name: 'order',
    meta: {
      title: '订单管理',
      keepAlive: true
    },
    component: () => import('../views/trading/views/order/orderModule.vue')
  },
  //   {
  //     path: '/system',
  //     name: 'systemUsers',
  //     meta: {
  //       title: '系统课学员',
  //       keepAlive: true
  //     },
  //     component: () => import('../views/usersModule.vue')
  //   },

  /**
   * 运营管理
   */
  {
    path: '/channelManagement',
    name: 'channelManagement',
    meta: {
      title: '渠道管理',
      keepAlive: true
    },
    component: () =>
      import('../views/Operating/views/channelManagement/channelManagement.vue')
  },
  /**
   * 点评管理
   */
  {
    path: '/reviewManagement',
    name: 'reviewManagement',
    meta: {
      title: '兼职老师点评管理',
      keepAlive: true
    },
    component: () =>
      import('../views/Operating/views/reviewManagement/index.vue')
  },
  /**
   * 营销中心  - 和小熊美术用一套
   */
  {
    path: '/marketing',
    name: 'marketing',
    meta: {
      title: '营销中心',
      keepAlive: true
    },
    component: () => import('../../marketing/views/redeemCode/index.vue')
  },
  //   兑换码 - 码库 @status: 1-有效 0-失效
  {
    path: '/redeemCodeLibrary/:id/:status',
    name: 'redeemCodeLibrary',
    meta: {
      title: '兑换码 / 码库',
      keepAlive: true
    },
    component: () => import('../../marketing/views/redeemCode/library.vue')
  },
  /**
   * @descript 班级模块 >>>>start
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
    path: '/verificationCode', // 验证码查询
    name: 'verificationCode',
    meta: {
      title: '验证码查询',
      keepAlive: false
    },
    component: () =>
      import(
        '../../art_app/views/operating/views/reviewManagement/components/verificationCode.vue'
      )
  }
  /**
   * @descript 班级模块 >>>> end
   */
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  module: 'write_app',
  routes
})

export default router
