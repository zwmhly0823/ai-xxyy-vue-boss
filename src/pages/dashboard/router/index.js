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
      title: '关于',
      icon: 'user'
    },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  },

  {
    path: '/components',
    name: 'Components',
    meta: {
      title: '组件',
      icon: 'user'
    },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () =>
          import(/* webpackChunkName: "table" */ '../views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'form',
        name: 'Form',
        component: () =>
          import(/* webpackChunkName: "form" */ '../views/form/index'),
        meta: { title: 'Form', icon: 'table' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
