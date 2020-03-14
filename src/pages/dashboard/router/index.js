/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-14 16:43:52
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-03-14 17:17:47
 * @Description: 模块的默认首页 设为 path: '/', name: 'Home'。显示在左侧导航中
 * 如果要作为快捷导航显示在左侧，为设置 meta:{showMenu: true}
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    // hidden: true, // 不显示在导航中
    meta: {
      title: 'Dashboard',
      icon: 'el-icon-s-data'
    },
    // redirect: '/about',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      title: '关于我们',
      showMenu: true
    },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  },

  // 二级目录
  {
    path: '/components/table',
    name: 'Components',
    meta: {
      title: '组件',
      showMenu: true
    },
    component: () => import('../views/components/table/index'),
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () =>
          import(
            /* webpackChunkName: "table" */ '../views/components/table/index'
          ),
        meta: { title: '全部订单' }
      },
      {
        path: 'form',
        name: 'Form',
        component: () =>
          import(
            /* webpackChunkName: "form" */ '../views/components/form/index'
          ),
        meta: { title: '支付流水' }
      },
      {
        path: 'table2',
        name: 'Table',
        component: () =>
          import(
            /* webpackChunkName: "table" */ '../views/components/table/index'
          ),
        meta: { title: '全部订单' }
      },
      {
        path: 'form2',
        name: 'Form',
        component: () =>
          import(
            /* webpackChunkName: "form" */ '../views/components/form/index'
          ),
        meta: { title: '支付流水' }
      }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
