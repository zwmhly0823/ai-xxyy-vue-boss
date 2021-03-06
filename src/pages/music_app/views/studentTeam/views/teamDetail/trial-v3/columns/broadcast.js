/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-23 21:24:47
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-05 14:03:37
 */
import { isToss } from '@/utils'
import ExtendUserInfo from '@/components/BaseUserInfo/Extend.vue'
import moment from 'moment'
const teacher = isToss(true)
export default [
  {
    fixed: true,
    width: '30',
    type: 'selection'
  },
  {
    action: true,
    prop: 'uid',
    name: 'user',
    label: '学员',
    fixed: true,
    width: '160',
    // 自定义组件
    render(h, data, row) {
    return h(ExtendUserInfo, {
       props: {
          user: row.user,
          isHead: true
        }
      })
    }
  },
  {
    prop: 'is_in_room_text',
    label: '是否进入直播间',
    width: '190',
  },
  {
    prop: 'in_room_count',
    label: '进入直播间次数',
    width: '150',
  },
  // {
  //   prop: 'play_status_text',
  //   label: '进入直播间时机',
  //   width: '150',
  // },
  {
    prop: 'first_join_time',
    label: '首次进入时间',
    minWidth: '120',
    render(h, data, row) {
      return data ? moment(data * 1000).format('YYYY-MM-DD HH:mm:ss') : '-';
    }
  },
  {
    prop: 'live_watch_time',
    label: '观看直播总时长/分钟',
    width:"200"
  },
  {
    prop: 'playback_watch_time',
    label: '观看回放总时长/分钟',
    width:"200"
  },
  {
    prop: 'chat_count',
    label: '评论数',
    slot: 'chat',
  },
  // {
  //   prop: 'like_count',
  //   label: '点赞数',
  //   width: '70',
  // },
  {
    prop: 'packages_name',
    label: '购买商品',
    width: '70',
  },
  {
    prop: 'userIntention',
    label: '跟进',
    minWidth: '120',
    slot:"follow"
  },
  {
    prop: 'live',
    label: '进入终端',
    width: '70',
    render(h, data, row) {
      if (data) {
        return data.push_terminal ? data.push_terminal : '-'
      }
    }
  },
  {
    prop: 'user_status',
    label: '系统课转化',
    width: '70',
    fixed: 'right',
    render(h, data, row) {
      switch (+data) {
        case 0:
        case 1:
        case 2:
          return '未转化'
          break
        case 3:
        case 4:
          return '已购月课'
          break
        case 5:
        case 6:
        case 7:
          return '已购年课'
          break
        case 8:
          return '注销失效'
          break
        case 9:
        case 10:
          return '已购季度课'
          break
        case 11:
        case 12:
          return '已购半年课'
          break
      }
    }
  },
  {
    action: true,
    name: 'action',
    prop: 'uid',
    label: '操作',
    width: '170',
    fixed: 'right',
    align: 'center',
  }
]

export const actions = ({
  handleUserDetail,
  handletest,
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
    ]
  }
}
