/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2021-01-05 14:02:13
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-09 19:21:37
 */
import { formatData } from '@/utils'
import { REGTYPE } from '@/utils/enums'
import ExtendUserInfo from '@/components/BaseUserInfo/Extend.vue'
// import BaseUserInfo from '@/components/BaseUserInfo/Base.vue'
// const teacher = isToss(true)
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
          user: row.user,
          sysLabel: row.sys_label,
          isHead: true
        }
      })
    }
  },
  {
    prop: 'regtype',
    label: '订单类型',
    width: '90',
    render(h, data, row) {
      return REGTYPE[data] || '-'
    }
  },
  {
    prop: 'packages_name',
    label: '商品信息',
    slot: 'package'
  },
  {
    prop: 'user_status',
    label: '辅教老师',
    width: '220',
    slot: 'teacher'
  },
  {
    prop: 'ctime',
    label: '下单时间·订单号',
    slot: 'orderTime'
  },
  {
    prop: 'buytime',
    label: '支付时间',
    render(h, data) {
      return data && data !== '0' ? formatData(data, 's') : '-'
    }
    // slot: 'status',
  },
  {
    prop: 'status',
    label: '订单状态',
    width: '80',
    slot: 'orderStatus'
  },
  {
    prop: 'rmbRefundStatusText',
    label: '退费状态',
    width: '80'
    // render: (h, data, row, index) => {
    //   return data === 1 ? '退费成功' : '未退费'
    // }
  },
  {
    prop: 'user_status_name',
    label: '学员转化',
    width: '90',
    fixed: 'right',
    slot: 'status'
  }
]
