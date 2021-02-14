/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2021-01-26 17:40:11
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-29 12:03:41
 */
import { formatData } from '@/utils'
const status = {
  0: '启用',
  1: '停用'
}
const zqStatus = {
  0: '离线',
  1: '在线',
  2: '未知'
}
const zqClass = {
  0: 'downline',
  1: 'online',
  2: 'unknown'
}

export default [
  {
    prop: 'weixinNo',
    label: '微信号',
    // minWidth: '160',
    slot: 'weixin'
  },
  {
    prop: 'wxid',
    label: 'WXID',
    // width: '160'
    render(h, data) {
      return data || '-'
    }
  },
  {
    prop: 'zqStatus',
    label: '智群登录',
    render(h, data, row) {
      const text = zqStatus[data] || '未知'
      return h(
        'span',
        {
          attrs: { class: zqClass[data] || 'unknown' }
        },
        text
      )
    }
  },
  {
    prop: 'status',
    label: '使用状态',
    render(h, data, row) {
      return status[data] || '-'
    }
  },
  {
    prop: 'departmentName',
    label: '所属部门'
  },
  {
    prop: 'teacherName',
    label: '保管人',
    render(h, data) {
      return data || '-'
    }
  },
  {
    prop: 'ctime',
    label: '创建日期',
    render(h, data) {
      return formatData(data, 's') || '-'
    }
  },
  {
    prop: 'remark',
    label: '备注',
    maxWidth: '160'
  },
  {
    fixed: 'right',
    prop: 'id',
    label: '操作',
    width: '60',
    slot: 'handle'
  }
]
