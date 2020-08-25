/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 20:26:32
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-08-25 14:45:32
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
  // {
  //   path: '/trialUsers',
  //   name: 'trialUsers',
  //   meta: {
  //     title: '体验课学员',
  //     keepAlive: true
  //   },
  //   component: () => import('../views/users/index.vue')
  // },
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
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  module: 'write_app',
  routes
})

export default router
