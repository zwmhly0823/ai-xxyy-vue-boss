
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'tossAuth',
    meta: {
      title: 'toss权限',
      icon: 'el-icon-s-custom',
      keepAlive: true
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
  },  {
    path: '/newTeacher',
    name: 'newTeacher',
    meta: {
      title: '新增员工账号',
      keepAlive: false
    },
    component: () =>
      import('../views/teacherManagement/components/newTeacher.vue')
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'toss-auth',
  routes
})

export default router
