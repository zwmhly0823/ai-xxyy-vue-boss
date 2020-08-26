/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 20:26:32
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-26 17:51:49
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
    path: '/operatingSchedule',
    name: 'operatingSchedule',
    meta: {
      title: '招生排期',
      keepAlive: true
    },
    component: () => import('../views/operating/scheduleList/index.vue')
  },
  // 新增、编辑
  {
    path: '/addSchedule/:period/:courseType/',
    name: 'addSchedule',
    meta: {
      title: '新建排期',
      keepAlive: false
    },
    component: () => import('../views/operating/addSchedule/index.vue')
  },
  {
    path: '/scheduleDetail/:period/:courseType/',
    name: 'scheduleDetail',
    meta: {
      title: '排期详情',
      keepAlive: false
    },
    component: () => import('../views/operating/scheduleDetail/index.vue')
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
    path: '/newTeacher',
    name: 'newTeacher',
    meta: {
      title: '新增员工',
      keepAlive: true
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
  //   {
  //     path: '/details/:id',
  //     name: 'detailsUsers',
  //     meta: {
  //       title: '学员详情',
  //       keepAlive: false
  //     },
  //     component: () => import('../views/details/index.vue')
  //   }

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
      import('../views/operating/views/channelManagement/channelManagement.vue')
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
