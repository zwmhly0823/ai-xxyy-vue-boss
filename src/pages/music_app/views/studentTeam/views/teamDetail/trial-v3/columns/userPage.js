/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-23 21:24:47
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-05 14:03:37
 */
import ExtendUserInfo from '@/components/BaseUserInfo/Extend.vue'
import BaseUserInfo from '@/components/BaseUserInfo/Base.vue'
import WechatInfo from '@/components/BaseUserInfo/Wechat.vue'
// import UserFollow from '../components/UserFollow.vue'
import SortBySurvey from '../components/Sort/SortBySurvey.vue'

export default [
  {
    fixed: true,
    width: '30',
    type: 'selection'
  },
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
          user: row.userInfo,
          sysLabel: row.sys_label,
          isHead: true
        }
      })
    }
    // align: 'center'
    // slot: 'user'
  },
  {
    prop: 'id',
    label: '学员信息',
    width: '190',
    render(h, data, row) {
      return h(BaseUserInfo, {
        props: {
          user: row.userInfo
        }
      })
    }
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
    // sortable: 'custom',
    label: '学习概况',
    width: '180',
    // slot
    slot: 'survey',
    // 自定义header - sort
    'render-header': (h, context) => {
      return <SortBySurvey ref="surveySort" />
    }
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
    slot: 'tags'
  },
  {
    prop: 'added_wechat',
    label: '课前准备',
    width: '140',
    slot: 'prepare'
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
  handleMessage
}) => {
  return {
    // user: (data, row, index) => {
    //   const { userPhone } = row
    //   return [
    //     {
    //       type: 'a',
    //       label: userPhone || '-',
    //       click: handleUser,
    //       attr: {
    //         style: {
    //           color: '#2a75ed'
    //         }
    //       }
    //     }
    //   ]
    // },
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
        label: '好友短信',
        click: handleMessage,
        attr: {
          style: {
            color: '#2a75ed'
          }
        }
      }
    ]
  }
}
