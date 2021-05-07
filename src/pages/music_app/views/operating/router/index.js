/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-17 10:52:16
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/router/index.js
 */
const operatingSchedule = [{
  path: '/operatingSchedule',
  name: 'operatingSchedule',
  meta: {
    title: '招生排期',
    keepAlive: true
  },
  component: () => import('../views/enrollmentSchedule/index.vue')
},
// 新增、编辑
{
  path: '/addSchedule/:period/:courseType/',
  name: 'addSchedule',
  meta: {
    title: '新建排期',
    keepAlive: false
  },
  component: () => import('../views/addSchedule/index.vue')
}, {
  path: '/scheduleDetail/:period/:courseType/',
  name: 'scheduleDetail',
  meta: {
    title: '排期详情',
    keepAlive: false
  },
  component: () => import('../views/scheduleDetail/index.vue')
},
]
const operatingRoutes = [{
  path: '/',
  name: 'operating',
  meta: {
    title: '运营中心',
    icon: 'el-icon-s-platform'
  },
  redirect: '/channelManagement'
},
{
  path: '/activityManagement',
  name: 'activityManagement',
  meta: {
    title: '活动管理',
    keepAlive: false
  },
  component: () => import('../views/activityManagement/index.vue')
},
{
  path: '/review',
  name: 'review',
  meta: {
    title: '作品审核',
    keepAlive: false
  },
  component: () => import('../views/review/index.vue')
},
{
  path: '/review/:promotionsId/:type',
  name: 'review',
  meta: {
    title: '新建审核',
    keepAlive: false
  },
  component: () =>
    import('../views/review/addReview/index.vue')
},
{
  path: '/newActivityManage/:promotionsId/:type',
  name: 'newActivityManage',
  meta: {
    title: '活动管理',
    keepAlive: false
  },
  component: () =>
    import('../views/activityManagement/addActivityManage/index.vue')
},
{
  path: '/channelManagement',
  name: 'channelManagement',
  meta: {
    title: '渠道管理',
    keepAlive: false
  },
  component: () => import('../views/channelManagement/channelManagement.vue')
},

{
  path: '/comment',
  name: 'comment',
  meta: {
    title: '语音库',
    keepAlive: false
  },
  component: () => import('../views/reviewManagement/comment.vue')
},
{
  path: '/reviewManagement',
  name: 'reviewManagement',
  meta: {
    title: '点评管理',
    keepAlive: false
  },
  component: () => import('../views/reviewManagement/index.vue')
},
{
  path: '/audioAdd',
  name: 'audioAdd',
  meta: {
    title: '点评管理',
    keepAlive: false
  },
  component: () => import('../views/reviewManagement/components/audioAdd.vue')
},
{
  path: '/verificationCode',
  name: 'verificationCode',
  meta: {
    title: '验证码查询',
    keepAlive: false
  },
  component: () =>
    import('../views/reviewManagement/components/verificationCode.vue')
},
{
  path: '/regroup',
  name: 'regroup',
  meta: {
    title: '重新分班',
    keepAlive: false
  },
  component: () =>
    import('../views/reviewManagement/components/regroup.vue')
},
{
  path: '/userResult',
  name: 'userResult',
  meta: {
    title: '用户登陆查询',
    keepAlive: false
  },
  component: () =>
    import('../views/reviewManagement/components/userResult.vue')
},
{
  path: '/labelManage',
  name: 'labelManage',
  meta: {
    title: '标签管理',
    keepAlive: false
  },
  component: () => import('../views/labelManage/index.vue')
},
{
  path: '/pushConfig',
  name: 'pushConfig',
  meta: {
    title: '推送配置',
    keepAlive: false
  },
  component: () => import('../views/pushConfig/index.vue')
},

{
  path: '/problem',
  name: 'problem',
  meta: {
    title: '问卷管理',
    keepAlive: false
  },
  component: () => import('../views/problem/index.vue')
},
{
  path: '/issueBearCoins',
  name: 'issueBearCoins',
  meta: {
    title: '发放小熊币',
    keepAlive: false
  },
  component: () => import('../views/issueBearCoins/index.vue')
},
{
  path: '/recommend',
  name: 'recommend',
  meta: {
    title: '转介绍截图审批',
    keepAlive: false
  },
  component: () => import('../views/recommend/changeRecommend.vue')
},

]
const operatingUploadList = [{
path: '/uploadFile',
name: 'uploadFile',
meta: {
  title: '上传素材',
  keepAlive: false
},
component: () => import('../views/uploadFile/index.vue')
}]
const operatingMobile = [{
path: '/changePhoneNumber',
name: 'changePhoneNumber',
meta: {
  title: '手机号替换',
  keepAlive: false
},
component: () => import('../views/changePhoneNumber/index.vue')
}]
export {
operatingRoutes,
operatingSchedule,
operatingUploadList,
operatingMobile
}
