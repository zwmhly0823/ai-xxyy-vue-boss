

const module = 'music_app'

let bearArt = [
  // {
  //   path: '/student-team',
  //   name: 'student-team',
  //   meta: {
  //     title: '体验课班级(新版)',
  //     icon: 'iconbanjiguanli',
  //     module
  //   },
  //   children: [{
  //     path: '/trail/0/prepare',
  //     name: 'trialTeam0',
  //     meta: {
  //       title: '待上课',
  //       module,
  //       show: true
  //     }
  //   },
  //   {
  //     path: '/trail/1/ongoing',
  //     name: 'trialTeam1',
  //     meta: {
  //       title: '上课中',
  //       module,
  //       show: true
  //     }
  //   },
  //   {
  //     path: '/trail/2/complete',
  //     name: 'trialTeam2',
  //     meta: {
  //       title: '已完课',
  //       module,
  //       show: true
  //     }
  //   }
  //   ]
  // },
  // {
  //   path: '/systemTeam',
  //   name: 'systemTeam',
  //   meta: {
  //     title: '系统课班级',
  //     icon: 'iconbanjiguanli',
  //     module
  //   }
  // },
  {
    path: '/trail/:status',
    name: '',
    meta: {
      title: '班级管理',
      icon: 'iconbanjiguanli',
      module
    },
    children: [{
      path: '/trialTeam',
      name: 'trialTeam',
      meta: {
        title: '体验课',
        // module: 'student-team',
        module,
        show: true
      }
    },
    {
      path: '/systemTeam',
      name: 'systemTeam',
      meta: {
        title: '系统课',
        // module: 'student-team',
        module,
        show: true
      }
    }
    ]
  },
  {
    path: '/users',
    name: 'users',
    hidden: false,
    meta: {
      title: '学员管理',
      icon: 'iconxueyuanguanli',
      module
    },
    children: [{
      path: '/trial',
      name: 'trial',
      meta: {
        title: '体验课',
        module,
        // module,
        show: true
      }
    },
    {
      path: '/system',
      name: 'system',
      meta: {
        title: '系统课',
        module,
        // module,
        show: true
      }
    },
    {
      path: '/allUsers',
      name: 'allUsers',
      meta: {
        title: '全部学员',
        module,
        // module,
        show: true
      }
    }
    ]
  },
  {
    path: '/trading',
    name: 'trading',
    // hidden: true,
    meta: {
      title: '交易管理',
      icon: 'iconjianyiguanli',
      // module: 'trading'
      module
    },
    children: [{
      path: '/order',
      name: 'order',
      meta: {
        title: '订单管理',
        // module: 'trading',
        module,
        show: true
      }
    },
    {
      path: '/financeRefound',
      name: 'financeRefound',
      meta: {
        title: '订单退款',
        // module: 'trading',
        module,
        show: true
      }
    },
    {
      path: '/invoiceManage',
      name: 'invoiceManage',
      meta: {
        title: '发票管理',
        // module: 'trading',
        module,
        show: true
      }
    }
    ]
  },
  {
    path: '/express',
    name: 'express',
    meta: {
      title: '物流管理',
      icon: 'iconwuliuguanli',
      // module: 'express'
      module
    }
  },
  {
    path: '/finance',
    name: 'finance',
    hidden: true, // 原封不动,丹阳还会回来
    meta: {
      title: '财务',
      icon: 'el-icon-s-finance',
      // module: 'finance'
      module
    },
    children: [{
      path: '/financeRefound',
      name: 'financeRefound',
      meta: {
        title: '退款',
        // module: 'finance'
        module
      }
    }]
  },
  {
    path: '/operating',
    name: 'operating',
    // hidden: true,
    meta: {
      title: '运营管理',
      icon: 'iconyunyingzhongxin',
      // module: 'operating',
      module,
      bottom: true
    },
    children: [
      {
        path: '/activityManagement',
        name: 'activityManagement',
        meta: {
          title: '活动管理',
          // module: 'operating'
          module
        }
      },
      {
        path: '/review',
        name: 'review',
        meta: {
          title: '作品审核',
          // module: 'operating'
          module
        }
      },
      {
        path: '/channelManagement',
        name: 'channelManagement',
        meta: {
          title: '渠道管理',
          // module: 'operating'
          module
        }
      },
      {
        path: '/comment',
        name: 'comment',
        meta: {
          title: '语音库',
          // module: 'operating'
          module
        }
      },
      {
        path: '/reviewManagement',
        name: 'reviewManagement',
        meta: {
          title: '点评管理',
          // module: 'operating'
          module
        }
      },
      {
        path: '/verificationCode',
        name: 'verificationCode',
        meta: {
          title: '验证码查询',
          // module: 'operating'
          module
        }
      },
      {
        path: '/labelManage',
        name: 'labelManage',
        meta: {
          title: '标签管理',
          // module: 'operating'
          module
        }
      },
      {
        path: '/pushConfig',
        name: 'pushConfig',
        meta: {
          title: '推送配置',
          // module: 'operating'
          module
        }
      },
      {
        path: '/problem',
        name: 'problem',
        meta: {
          title: '问卷管理',
          // module: 'operating'
          module
        }
      },
      {
        path: '/issueBearCoins',
        name: 'issueBearCoins',
        meta: {
          title: '发放小熊币',
          // module: 'operating'
          module
        }
      },
      {
        path: '/recommend',
        name: 'recommend',
        meta: {
          title: '转介绍截图',
          // module: 'operating'
          module
        }
      },
      // 投诉中心  经理和区长可以查看
      {
        path: '/complaint',
        name: 'complaint',
        // hidden: teacherInfo.dutyId !== '1',
        meta: {
          title: '投诉中心',
          module
        }
      },
      {
        path: '/uploadFile',
        name: 'uploadFile',
        meta: {
          title: '上传素材',
          // module: 'operating'
          module
        }
      },
      {
        path: '/operatingSchedule',
        name: 'operatingSchedule',
        meta: {
          title: '招生排期',
          // module: 'operating'
          module
        }
      },
      {
        path: '/changePhoneNumber',
        name: 'changePhoneNumber',
        meta: {
          title: '手机号替换',
          // module: 'operating'
          module
        }
      },
      {
        path: '/regroup',
        name: 'regroup',
        meta: {
          title: '重新分班',
          // module: 'operating'
          module
        }
      },
      {
        path: '/userResult',
        name: 'userResult',
        meta: {
          title: '用户登陆查询',
          // module: 'operating'
          module
        }
      },
    ]
  },
  {
    path: '/marketingCenter',
    name: 'marketing',
    meta: {
      title: '营销中心',
      icon: 'iconyingxiaoguanli',
      module: 'marketing'
      // module
    },
    children: [
      {
        path: '/marketing',
        name: 'marketing',
        meta: {
          title: '码库',
          module: 'marketing',
          // module,
          style: 'line'
        }
      },
      {
        path: '/coupon',
        name: 'coupon',
        meta: {
          title: '优惠券',
          module: 'marketing',
          // module,
          style: 'line'
        }
      },
      {
        path: '/whites',
        name: 'whites',
        meta: {
          title: '用户白名单',
          module: 'marketing',
          show: true
        }
      }
    ]
  },
  {
    path: '/approval',
    name: 'approval',
    meta: {
      title: '审批中心',
      icon: 'iconshenpizhongxin',
      // module: 'approval'
      module
    }
  },
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
        path: '/weixinManagement',
        name: 'weixinManagement',
        meta: {
          title: '员工微信',
          module: 'teacher'
        }
      },
      {
        path: '/wechatWaterArmy',
        name: 'wechatWaterArmy',
        meta: {
          title: '水军微信',
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
      },
      {
        path: '/workHandover/partTimeTeacher',
        name: 'partTimeTeacher',
        meta: {
          title: '兼职老师交接',
          module: 'teacher'
        }
      },
      {
        path: '/loginRecord',
        name: 'loginRecord',
        meta: {
          title: '操作日志',
          module: 'teacher'
        }
      }
    ]
  },
  {
    path: '/bossAuth',
    name: 'active',
    // hidden: true,
    meta: {
      title: 'boss权限',
      icon: 'iconiconset',
      module: 'bossAuth',
    },
    children: [
      {
        path: '/systemAccount',
        name: 'systemAccount',
        meta: {
          title: '系统帐号',
          module: 'boss-auth'
        }
      },
      {
        path: '/roleSetting',
        name: 'roleSetting',
        meta: {
          title: '角色设置',
          module: 'boss-auth'
        }
      },
      {
        path: '/menuSetting',
        name: 'menuSetting',
        meta: {
          title: '菜单分配',
          module: 'boss-auth'
        }
      },
    ],
  },
  {
    path: '/tossAuth',
    name: 'active',
    // hidden: true,
    meta: {
      title: 'toss权限',
      icon: 'iconiconset',
      module: 'tossAuth',
    },
    children: [
      {
        path: '/teacherManagement',
        name: 'teacherManagement',
        meta: {
          title: '员工帐号',
          module: 'toss-auth'
        }
      },
    ],
  },
  {
    path: '/backstageSql',
    name: 'backstageSql',
    // hidden: true,
    meta: {
      title: 'app升级管理',
      icon: 'iconxueyuanguanli',
      module: "teacher",
    },
  },
  {
    path: '/active',
    name: 'active',
    // hidden: true,
    meta: {
      title: '活动',
      icon: 'iconiconset',
      module: module,
    },
  },
]


// bearArt = [
// 班级

// 用户。体验课老师只能查看体验课学员，系统课只系统课学员

// 交易

// 社群工具
// {
//   path: '/community',
//   name: 'community',
//   meta: {
//     title: '社群工具',
//     icon: 'icongongju1',
//     // module: 'community'
//     module
//   },
//   children: [
//     {
//       path: '/groupSop',
//       name: 'groupSop',
//       meta: {
//         title: '群SOP',
//         // module: 'community',
//         module,
//         show: false
//       }
//     },
//     {
//       path:
//         'https://wgj.xiaoxiongmeishu.com/Site/AccuratePush/accuratePush.html',
//       meta: {
//         title: '群发消息',
//         show: false
//       }
//     },
//     {
//       path:
//         'https://wgj.xiaoxiongmeishu.com/Marketing/FriendsCircle/FriendsCircleList',
//       meta: {
//         title: '发朋友圈',
//         show: false
//       }
//     },
//     {
//       path:
//         'https://wgj.xiaoxiongmeishu.com/Equipment/QuickReply/QuickReplyList',
//       meta: {
//         title: '快捷回复',
//         show: false
//       }
//     },
//     {
//       path:
//         'https://wgj.xiaoxiongmeishu.com/Equipment/AutoCreateCluster/KeyClusterList',
//       meta: {
//         title: '自动拉群',
//         show: false
//       }
//     },
//     {
//       path: 'https://wgj.xiaoxiongmeishu.com/WeiXin/Tag/WeiXinTagList',
//       meta: {
//         title: '微信标签',
//         show: false
//       }
//     },
//     {
//       path: 'https://wgj.xiaoxiongmeishu.com/WeiXin/Cluster/ClusterList',
//       meta: {
//         title: '微信群',
//         show: false
//       }
//     },
//     {
//       path:
//         'https://wgj.xiaoxiongmeishu.com/Marketing/AutoPassFriend/AutoPassFriendList',
//       meta: {
//         title: '被动通过添加好友设置'
//       }
//     },
//     {
//       path:
//         'https://wgj.xiaoxiongmeishu.com/Equipment/MsgRule/UserAddRuleList',
//       meta: {
//         title: '通过好友自动回复设置'
//       }
//     },
//     {
//       path: 'https://wgj.xiaoxiongmeishu.com/Equipment/MsgRule/KeyRuleList',
//       meta: {
//         title: '单聊关键词自动回复设置'
//       }
//     },
//     {
//       path:
//         'https://wgj.xiaoxiongmeishu.com/Equipment/MsgRule/ClusterKeyRuleList?menuType=1',
//       meta: {
//         title: '群聊关键词自动回复设置'
//       }
//     }
//   ]
// },
// 物流管理new

// 财务(该模块先隐藏,丹阳还会回来)


// 运营中心

// 营销中心

// {
//   path: '/marketing',
//   name: 'marketing',
//   hidden: staff.roleId !== '7',
//   meta: {
//     title: '营销中心',
//     icon: 'iconyingxiaoguanli',
//     module: 'marketing'
//   }
// },
// 工具类路由

// {
//   path: '/outbound',
//   name: 'outbound',
//   meta: {
//     title: '呼叫中心',
//     icon: 'icondianhua',
//     // module: 'outbound'
//     module
//   },
//   children: [{
//       path: '/CallRecord',
//       name: 'CallRecord',
//       meta: {
//         title: '通话记录',
//         // module: 'outbound',
//         module,
//       }
//     },
//     {
//       path: '/CallCenter',
//       name: 'CallCenter',
//       meta: {
//         title: '席位配置',
//         // module: 'outbound',
//         module,
//       }
//     }
//   ]
// },
// 数据中心
// {
//   path: '/statistics',
//   name: 'statistics',
//   // hidden: true,
//   meta: {
//     title: '数据中心',
//     icon: 'icontongjifenxi',
//     // module: 'statistics'
//     module
//   },
//   children: [
//     {
//       path: '/priodPerformance',
//       name: 'priodPerformance',
//       meta: {
//         title: '按期汇总',
//         // module: 'statistics',
//         module,
//         style: 'line'
//       }
//     },
//     {
//       path: '/salesPerformance',
//       name: 'salesPerformance',
//       meta: {
//         title: '过程分析',
//         // module: 'statistics',
//         module,
//         style: 'line'
//       }
//     },
//     {
//       path: '/behavior',
//       name: 'behavior',
//       meta: {
//         title: '行为轨迹',
//         // module: 'statistics',
//         module,
//         style: 'line'
//       }
//     },
//     {
//       path: '/learnRecord',
//       name: 'learnRecord',
//       meta: {
//         title: '学习记录',
//         // module: 'statistics',
//         module,
//         style: 'line'
//       }
//     },
//     {
//       path: '/systemJoinCourseLog',
//       name: 'systemJoinCourseLog',
//       meta: {
//         title: '参课统计',
//         // module: 'statistics',,
//         module,
//         style: 'line'
//       }
//     }
//   ]
// },
// 设置 - 老师模块

// ]

export default bearArt
