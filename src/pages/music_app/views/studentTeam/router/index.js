 const routes = [{
     path: '/trail/0/prepare',
     name: 'trialTeamV2Prepare',
     meta: {
       title: '待上课'
     },
     component: () => import('../views/trial-v2/prepare.vue')
   },
   {
     path: '/trail/1/ongoing',
     name: 'trialTeamV2Ongoing',
     meta: {
       title: '上课中'
     },
     component: () => import('../views/trial-v2/ongoing.vue')
   },
   {
     path: '/trail/2/complete',
     name: 'trialTeamV2Complete',
     meta: {
       title: '已完课'
     },
     component: () => import('../views/trial-v2/complete.vue')
   },
   {
     path: '/trail/:status',
     name: 'trialTeamV2',
     meta: {
       title: '班级管理',
       keepAlive: true
     },
     component: () => import('../views/trial-v2/index.vue')
   },

   /**
    * 体验课班级V2.0  
    */
   {
     path: '/trialTeam', // 体验课班级
     name: 'trialTeam',
     meta: {
       title: '体验课班级',
       keepAlive: true
     },
     hidden: true,
     component: () => import('../views/trial-v3/index.vue')
   },
   {
     path: '/systemTeam', // 系统课班级
     name: 'systemTeam',
     meta: {
       title: '系统课班级',
       keepAlive: true
     },
     hidden: true,
     component: () => import('../views/systemTeam/index.vue')
   },
   {
     path: '/teamTrialDetail/:id/:type', // 体验课班级中心
     name: 'teamDetail',
     meta: {
       title: '体验课班级中心'
     },
     hidden: true,
     component: () => import('../views/teamDetail/trial-v3/index.vue')
   },
   {
    path: '/teamDetail/:id/:type', // 系统课班级中心
    name: 'teamDetail',
    meta: {
      title: '系统课班级中心'
    },
    hidden: true,
    component: () =>
      import(/* webpackChunkName: "student" */ '../views/teamDetail/index.vue')
  },
  {
    path: '/lessonDetail/:lessonId/:teamId',
    name: 'lessonDetail',
    meta: {
      title: '课程详情'
    },
    hidden: true,
    component: () =>
      import(
        /* webpackChunkName: "lessonDetail" */ '../views/teamDetail/trial-v3/pages/LogPageClassDetail.vue'
      )
  }
 ]
 export default routes;
