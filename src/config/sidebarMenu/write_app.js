/*
 * @Descripttion: 美术宝写字导航菜单
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 21:14:16
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-30 17:09:23
 */
import { removeToken } from '@/utils/auth'
import { baseUrl } from '@/utils/index'
const staff = JSON.parse(localStorage.getItem('staff')) || {}
if (!staff) {
  removeToken()
  location.href = `${baseUrl()}login/#/`
}
const module = 'write_app'

let msbWriting = []

/**
 * 新增 教研 角色 （roleId: 18）
 * 美术BOSS只有 设置-员工账号 的权限
 */
if (staff.roleId === '18') {
  msbWriting = [
    // 运营中心
    {
      path: '/operating',
      name: 'operating',
      // hidden: true,
      meta: {
        title: '运营管理',
        icon: 'iconyunyingzhongxin',
        module
      },
      children: [
        {
          path: '/reviewManagement',
          name: 'reviewManagement',
          meta: {
            title: '兼职老师点评管理',
            module,
            show: true
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
            module,
            show: true
          }
        }
      ]
    }
  ]
} else {
  /**
   * 除教研外其他角色权限
   */
  let superOperatingRouter = []
  let superTeacherRouter = []

  // 管理员
  // const adminRouter = []

  // 超级管理员权限
  if (staff.roleId === '7') {
    superOperatingRouter = [
      {
        path: '/operatingSchedule',
        name: 'operatingSchedule',
        meta: {
          title: '招生排期',
          module
        }
      }
    ]
    superTeacherRouter = [
      {
        path: '/teacherManagement',
        name: 'teacherManagement',
        meta: {
          title: '员工帐号',
          module
        }
      },
      {
        path: '/weixinManagement',
        name: 'weixinManagement',
        meta: {
          title: '员工微信',
          module
        }
      },
      {
        path: '/systemAccount',
        name: 'systemAccount',
        meta: {
          title: '系统账号',
          module
        }
      }
    ]
  }
  // 管理员权限
  if (staff.roleId === '1') {
  }
  msbWriting = [
    // 班级
    {
      path: '/student-team',
      name: 'student-team',
      meta: {
        title: '班级管理',
        icon: 'iconbanjiguanli',
        module
      },
      children: [
        {
          path: '/trialTeam',
          name: 'trialTeam',
          meta: {
            title: '体验课',
            module,
            show: true
          }
        },
        {
          path: '/systemTeam',
          name: 'systemTeam',
          meta: {
            title: '系统课',
            module,
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
        module
      },
      children: [
        {
          path: '/trialUsers',
          name: 'trialUsers',
          meta: {
            title: '体验课',
            module,
            show: true
          }
        },
        {
          path: '/systemUsers',
          name: 'systemUsers',
          meta: {
            title: '系统课',
            module,
            show: true
          }
        },
        {
          path: '/allUsers',
          name: 'allUsers',
          meta: {
            title: '全部学员',
            module,
            show: true
          }
        }
        // {
        //   path: '/all',
        //   name: 'all',
        //   meta: {
        //     title: '全部学员',
        //     module,
        //     show: true
        //   }
        // }
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
        module
      },
      children: [
        {
          path: '/order',
          name: 'order',
          meta: {
            title: '订单管理',
            module,
            show: true
          }
        }
      ]
    },

    // 物流管理new
    {
      path: '/express',
      name: 'express',
      meta: {
        title: '物流管理',
        icon: 'iconwuliuguanli',
        module
      }
    },

    // 运营中心
    {
      path: '/operating',
      name: 'operating',
      // hidden: true,
      meta: {
        title: '运营管理',
        icon: 'iconyunyingzhongxin',
        module
      },
      children: [
        {
          path: '/channelManagement',
          name: 'channelManagement',
          meta: {
            title: '渠道管理',
            module
          }
        },
        {
          path: '/reviewManagement',
          name: 'reviewManagement',
          meta: {
            title: '兼职老师点评管理',
            module
          }
        },
        ...superOperatingRouter
      ]
    },
    // 营销中心
    {
      path: '/marketing',
      name: 'marketing',
      hidden: staff.roleId !== '7',
      meta: {
        title: '营销中心',
        icon: 'iconyingxiaoguanli',
        module
      }
    },
    // 设置 - 老师模块
    {
      path: '/teacher',
      name: 'teacher',
      hidden: staff.roleId !== '7', // 目前只有一个员工设置，只有超管有权限
      meta: {
        title: '设置',
        icon: 'iconiconset',
        module
      },
      children: [...superTeacherRouter]
    }
  ]
}

export default msbWriting
