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
      title: '班级管理',
      icon: 'iconbanjiguanli',
      module: 'student-team'
    },
    children: [
      {
        path: '/trialTeam',
        name: 'trialTeam',
        meta: {
          title: '体验课',
          module: 'student-team',
          show: true
        }
      },
      {
        path: '/systemTeam',
        name: 'systemTeam',
        meta: {
          title: '系统课',
          module: 'student-team',
          show: true
        }
      }
    ]
  },
  // 用户。体验课老师只能查看体验课学员，系统课只系统课学员
  {
    path: '/users',
    name: 'users',
    hidden: false,
    meta: {
      title: '学员管理',
      icon: 'iconxueyuanguanli',
      module: 'users'
    },
    children: [
      {
        path: '/trial',
        name: 'trial',
        meta: {
          title: '体验课',
          module: 'users',
          show: true
        }
      },
      {
        path: '/system',
        name: 'system',
        meta: {
          title: '系统课',
          module: 'users',
          show: true
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
      title: '交易管理',
      icon: 'iconjianyiguanli',
      module: 'trading'
    },
    children: [
      {
        path: '/order',
        name: 'order',
        meta: {
          title: '订单管理',
          module: 'trading',
          show: true
        }
      },
      {
        path: '/financeRefound',
        name: 'financeRefound',
        meta: {
          title: '订单退款',
          module: 'trading',
          show: true
        }
      }
    ]
  },
  // 物流管理
  {
    path: '/express',
    name: 'express',
    // hidden: true,
    meta: {
      title: '物流管理',
      icon: 'iconwuliuguanli',
      module: 'express'
    },
    children: [
      {
        path: '/experienceClass',
        name: 'experienceClass',
        meta: {
          title: '体验课',
          module: 'express',
          show: false
        }
      },
      {
        path: '/systemClass',
        name: 'systemClass',
        meta: {
          title: '系统课',
          module: 'express',
          show: false
        }
      },
      {
        path: '/activityClass',
        name: 'activityClass',
        meta: {
          title: '活动商品',
          module: 'express',
          show: false
        }
      }
    ]
  },
  // 财务(该模块先隐藏,丹阳还会回来)
  {
    path: '/finance',
    name: 'finance',
    hidden: true, // 原封不动,丹阳还会回来
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

  // 运营中心
  {
    path: '/operating',
    name: 'operating',
    // hidden: true,
    meta: {
      title: '运营管理',
      icon: 'iconyunyingzhongxin',
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
      },
      {
        path: '/verificationCode',
        name: 'verificationCode',
        meta: {
          title: '验证码查询',
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
      icon: 'iconshenpizhongxin',
      module: 'approval'
    }
  },
  // 数据中心
  {
    path: '/statistics',
    name: 'statistics',
    // hidden: true,
    meta: {
      title: '数据中心',
      icon: 'icontongjifenxi',
      module: 'statistics'
    },
    children: [
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
          title: '过程分析',
          module: 'statistics',
          style: 'line'
        }
      },
      {
        path: '/behavior',
        name: 'behavior',
        meta: {
          title: '行为轨迹',
          module: 'statistics',
          style: 'line'
        }
      }
    ]
  },
  // 设置 - 老师模块
  {
    path: '/teacher',
    name: 'teacher',
    // hidden: true,
    meta: {
      title: '设置',
      icon: 'iconiconset',
      module: 'teacher'
    },
    children: [
      {
        path: '/teacherManagement',
        name: 'teacherManagement',
        meta: {
          title: '员工帐号',
          module: 'teacher'
        }
      },
      {
        path: '/weixinManagement',
        name: 'weixinManagement',
        meta: {
          title: '员工微信',
          module: 'teacher'
        }
      },
      {
        path: '/workHandover',
        name: 'workHandover',
        meta: {
          title: '离职交接',
          module: 'teacher'
        }
      }
    ]
  }
]

export default routes
