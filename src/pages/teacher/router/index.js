/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-15 20:24:10
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'teacher',
    meta: {
      title: '社群销售',
      icon: 'el-icon-s-custom'
    },
    redirect: '/teacherManagement'
  },
  {
    path: '/teacherManagement',
    name: 'teacherManagement',
    meta: {
      title: '销售管理',
      keepAlive: true
    },
    component: () =>
      import(
        /* webpackChunkName: "teacherManagement" */
        '../views/teacherManagement/teacherManage.vue'
      )
  },
  {
    path: '/weixinManagement',
    name: 'weixinManagement',
    meta: {
      title: '微信管理',
      keepAlive: false
    },
    component: () => import('../views/weixinManagement/accountManagement.vue')
  },
  {
    path: '/newTeacher',
    name: 'newTeacher',
    // meta: {
    //   title: '新增老师'
    // },
    component: () =>
      import('../views/teacherManagement/components/newTeacher.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'teacher',
  routes
})

export default router
