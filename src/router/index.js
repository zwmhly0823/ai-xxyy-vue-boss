/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-14 15:07:26
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-05-18 11:32:42
 * @Description: 设置左侧导航展示数据
 * 通过导入模块router/index.js判断，规定模块入口文件为 {path: '/', name: 'Home'}
 * TODO: 自动完成
 */
// import dashboardRouter from '@/pages/dashboard/router/index'
// import studentTeamdRouter from '@/pages/studentTeam/router/index'
// console.log(dashboardRouter.options)
// console.log(studentTeamdRouter.options)

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
  // 班级
  {
    path: '/student-team',
    name: 'student-team',
    meta: {
      title: '班级中心',
      icon: 'el-icon-s-custom',
      module: 'student-team'
    },
    children: [
      {
        path: '/trialTeam',
        name: 'trialTeam',
        meta: {
          title: '体验课班级',
          module: 'student-team'
        }
      },
      {
        path: '/systemTeam',
        name: 'systemTeam',
        meta: {
          title: '系统课班级',
          module: 'student-team'
        }
      }
    ]
  },
  // 交易
  {
    path: '/trading',
    name: 'trading',
    // hidden: true,
    meta: {
      title: '交易中心',
      icon: 'el-icon-s-data',
      module: 'trading'
    },
    children: [
      {
        path: '/order',
        name: 'order',
        meta: {
          title: '订单',
          module: 'trading'
        }
      },
      {
        path: '/express',
        name: 'express',
        meta: {
          title: '物流',
          module: 'trading'
        }
      }
    ]
  },
  // 财务
  {
    path: '/finance',
    name: 'finance',
    // hidden: true,
    meta: {
      title: '财务',
      icon: 'el-icon-s-finance',
      module: 'finance'
    },
    children: [
      {
        path: '/financeRefound',
        name: 'financeRefound',
        meta: {
          title: '退款',
          module: 'finance'
        }
      }
    ]
  },
  // 老师模块
  {
    path: '/teacher',
    name: 'teacher',
    // hidden: true,
    meta: {
      title: '社群销售',
      icon: 'el-icon-user',
      module: 'teacher'
    },
    children: [
      {
        path: '/teacherManagement',
        name: 'teacherManagement',
        meta: {
          title: '销售管理',
          module: 'teacher'
        }
      },
      {
        path: '/weixinManagement',
        name: 'weixinManagement',
        meta: {
          title: '微信管理',
          module: 'teacher'
        }
      }
    ]
  },
  // 运营中心
  {
    path: '/operating',
    name: 'operating',
    // hidden: true,
    meta: {
      title: '运营中心',
      icon: 'el-icon-s-platform',
      module: 'operating'
    },
    children: [
      // {
      //   path: '/enrollmentSchedule',
      //   name: 'enrollmentSchedule',
      //   meta: {
      //     title: '招生排期',
      //     module: 'operating'
      //   }
      // },
      {
        path: '/channelManagement',
        name: 'channelManagement',
        meta: {
          title: '渠道管理',
          module: 'operating'
        }
      },
      {
        path: '/reviewManagement',
        name: 'reviewManagement',
        meta: {
          title: '点评管理',
          module: 'operating'
        }
      }
    ]
  },
  // 工具类路由
  {
    path: '/approval',
    name: 'approval',
    meta: {
      title: '审批中心',
      icon: 'el-icon-menu',
      module: 'approval'
    }
  },
  // 统计分析
  {
    path: '/statistics',
    name: 'statistics',
    // hidden: true,
    meta: {
      title: '统计分析',
      icon: 'el-icon-s-marketing',
      module: 'statistics'
    },
    children: [
      // {
      //   path: '/salesPerformance',
      //   name: 'salesPerformance',
      //   meta: {
      //     title: '销售业绩',
      //     module: 'statistics',
      //     style: 'line'
      //   }
      // },

      {
        path: '/priodPerformance',
        name: 'priodPerformance',
        meta: {
          title: '按期汇总',
          module: 'statistics',
          style: 'line'
        }
      },
      {
        path: '/salesPerformance',
        name: 'salesPerformance',
        meta: {
          title: '销售过程',
          module: 'statistics',
          style: 'line'
        }
      }

      // {
      //   path: '/salesProcess',
      //   name: 'salesProcess',
      //   meta: {
      //     title: '按期汇总',
      //     module: 'statistics',
      //     style: 'line'
      //   }
      // }
    ]
  },
  // 物流管理
  {
    path: '/express',
    name: 'express',
    // hidden: true,
    meta: {
      title: '物流管理',
      icon: 'el-icon-s-data',
      module: 'express'
    },
    children: [
      {
        path: '/experienceClass',
        name: 'experienceClass',
        meta: {
          title: '体验课物流',
          module: 'express'
        }
      },
      {
        path: '/systemClass',
        name: 'systemClass',
        meta: {
          title: '系统课物流',
          module: 'express'
        }
      },
      {
        path: '/activityClass',
        name: 'activityClass',
        meta: {
          title: '活动物流',
          module: 'express'
        }
      }
    ]
  }
]

export default routes
