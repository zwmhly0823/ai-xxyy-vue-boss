/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-23 21:24:47
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-05 14:03:37
 */
import ExtendUserInfo from '@/components/BaseUserInfo/Extend.vue'
import WechatInfo from '@/components/BaseUserInfo/Wechat.vue'
// import SortByClassInfo from '../components/Sort/SortByClassInfo.vue'

export default [
  {
    action: true,
    prop: 'id',
    name: 'user',
    label: '学员',
    fixed: true,
    width: '160',
    // 自定义组件
    render(h, data, row) {
      return h(ExtendUserInfo, {
        props: {
          user: row.userExtends,
          sysLabel: row.sys_label,
          isHead: true,
          linkUseUID: true
        }
      })
    }
    // align: 'center'
    // slot: 'user'
  },
  {
    prop: 'wechat',
    label: '微信信息',
    width: '150',
    render(h, data, row) {
      return h(WechatInfo, {
        props: {
          wechat: row.userExtends
        }
      })
    }
  },
  {
    prop: 'join_course_count',
    label: '参课',
    minWidth: '130',
    slot: 'joinCourse'
    // 自定义header - sort
    // 'render-header': (h, context) => {
    //   return (
    //     <SortByClassInfo sortType="joinCourse" pageType="logPageClassDetail" />
    //   )
    // }
  },
  {
    prop: 'bu_join_state',
    label: '放课日参课',
    minWidth: '130',
    slot: 'todayJoinCourse'
  },
  {
    prop: 'complete_course_count',
    label: '完课',
    minWidth: '130',
    slot: 'completeCourse'
  },
  {
    prop: 'bu_complete_state',
    label: '放课日完课',
    minWidth: '130',
    slot: 'todayCompleteCourse'
  },
  {
    prop: 'task_count',
    label: '传作品',
    minWidth: '60',
    slot: 'taskCount'
  },
  {
    prop: 'comment_count',
    label: '已点评作品',
    minWidth: '90',
    slot: 'commentCount'
  },
  {
    prop: 'listen_comment_count',
    label: '已听点评',
    minWidth: '90',
    slot: 'listenCommentCount'
  },
  {
    prop: 'userIntention',
    label: '跟进',
    minWidth: '120',
    slot: 'follow'
  },
  {
    prop: 'sys_label',
    label: '标签',
    minWidth: '120',
    slot: 'tags'
  },
  {
    prop: 'user_status',
    label: '转化',
    width: '70',
    slot: 'status',
    fixed: 'right'
  },
  {
    action: true,
    name: 'action',
    prop: 'id',
    label: '操作',
    width: '170',
    fixed: 'right'
  }
]

export const actions = ({
  handleTag,
  handleFollow,
  handleUserDetail,
  handleCoupon,
  handleOutbound
}) => {
  return {
    action: [
      {
        type: 'a',
        label: '详情',
        click: handleUserDetail,
        attr: {
          style: {
            color: '#2a75ed'
          }
        }
      },
      {
        type: 'a',
        label: '跟进',
        click: handleFollow,
        attr: {
          style: {
            color: '#2a75ed'
          }
        }
      },
      {
        type: 'a',
        label: '打标签',
        click: handleTag,
        attr: {
          style: {
            color: '#2a75ed'
          }
        }
      },
      {
        type: 'a',
        label: '发优惠券',
        click: handleCoupon,
        attr: {
          style: {
            color: '#2a75ed'
          }
        }
      }
    ]
  }
}
