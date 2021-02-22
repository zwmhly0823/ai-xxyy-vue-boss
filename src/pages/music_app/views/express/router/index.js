/*
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-05-18 16:51:39
 * @LastEditors: zhouzebin
 * @LastEditTime: 2020-07-11 15:59:42
 */

const routes = [
  {
    path: '/express',
    name: 'expressCenter',
    meta: {
      title: '物流管理',
      keepAlive: false
    },
    component: () =>
      import(
        /* webpackChunkName: "expressCenter" */
        '../views/expressCenter/index.vue'
      )
  },
  {
    path: '/experienceClass',
    name: 'experienceClass',
    meta: {
      title: '体验课物流',
      keepAlive: false
    },
    component: () =>
      import(
        /* webpackChunkName: "experienceClass" */
        '../views/experienceClass/index.vue'
      )
  },
  {
    path: '/activityClass',
    name: 'activityClass',
    meta: {
      title: '活动物流',
      keepAlive: false
    },
    component: () =>
      import(
        /* webpackChunkName: "activityClass" */
        '../views/activityClass/index.vue'
      )
  },
  {
    path: '/systemClass',
    name: 'systemClass',
    meta: {
      title: '系统课物流',
      keepAlive: false
    },
    component: () =>
      import(
        /* webpackChunkName: "systemClass" */
        '../views/systemClass/system.vue'
      )
  }
]


export default routes
