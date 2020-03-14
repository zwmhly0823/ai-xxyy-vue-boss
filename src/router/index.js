/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-14 15:07:26
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-03-14 19:18:55
 * @Description: 设置左侧导航展示数据
 * 通过导入模块router/index.js判断，规定模块入口文件为 {path: '/', name: 'Home'}
 * TODO: 需要手动导入
 */
// import dashboardRouter from '@/pages/dashboard/router/index'
// import studentTeamdRouter from '@/pages/studentTeam/router/index'

// function getRoutes(router = {}) {
//   const { routes = [] } = router.options
//   let parent = {}
//   const children = []
//   routes.forEach((item) => {
//     if (item.path === '/' && item.name === 'Home' && !item.hidden) parent = item
//     if (item.meta && item.meta.showMenu) {
//       if (item.children) delete item.children
//       children.push(item)
//     }
//   })
//   return Object.assign(parent, { children })
// }
// const routes = [getRoutes(studentTeamdRouter)]
// console.log(routes)

const routes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    // hidden: true,
    meta: {
      title: 'Dashboard',
      icon: 'el-icon-s-data',
      moudle: true
    },
    children: [
      {
        path: '/components/table',
        name: 'Table',
        meta: {
          title: '全部订单'
        }
      },
      {
        path: '/components/form',
        name: 'Form',
        meta: {
          title: '支付流水'
        }
      }
    ]
  },
  {
    path: '/student-team',
    name: 'student-team',
    meta: {
      title: '班级',
      icon: 'el-icon-s-custom',
      moudle: true
    }
  }
]

export default routes
