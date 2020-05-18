/*
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-04-26 19:11:56
 * @LastEditors: Lukun
 * @LastEditTime: 2020-05-13 22:18:08
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 工具类路由
const routes = [
  // 二级路由
  {
    path: '/',
    name: 'ApprovalCenter',
    meta: {
      title: '审批中心',
      icon: 'el-icon-menu'
    },
    redirect: '/approvalCenter'
    // 子路由
  },
  {
    path: '/approvalCenter',
    name: 'approvalCenter',
    meta: {
      title: '审批中心',
      keepAlive: true
    },
    component: () => import('../approvalCenter/index.vue')
  },
  {
    path: '/moneyBack',
    name: 'moneyBack',
    meta: {
      title: '退款审批',
      keepAlive: true
    },
    component: () => import('../approvalCenter/components/moneyBack.vue')
  },
  {
    path: '/repair',
    name: 'repair',
    meta: {
      title: '补发货审批',
      keepAlive: true
    },
    component: () => import('../approvalCenter/components/repair.vue')
  }
]
const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'approval',
  routes
})

export default router
