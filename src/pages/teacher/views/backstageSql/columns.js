/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2021-01-26 17:40:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-25 19:22:32
 */
import { formatData } from '@/utils'
const status = {
  0: '非强制升级',
  1: '强制升级'
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
    prop: 'applyName',
    label: '应用名称',
  },
  {
    prop: 'applyCode',
    label: '应用标识',

  },
  {
    prop: 'version',
    label: '升级版本号'
  },
  {
    prop: 'versionCode',
    label: '版本标识',

  },
  {
    prop: 'title',
    label: '升级标题',
    render(h, data, row) {
      return row.title ? row.title : '-'
    }
  },
  {
    prop: 'buttonContent',
    label: '按钮文案',
    render(h, data, row) {
      return row.buttonContent ? row.buttonContent : '-'
    }
  },
  {
    prop: 'content',
    label: '升级文案',
    render(h, data, row) {
      return row.content ? row.content : '-'
    }
  },
  {
    prop: 'downloadUrl',
    label: '下载链接',
    width: '300',
    render(h, data, row) {
      return row.downloadUrl ? row.downloadUrl: '-'
    }
  },
  {
    prop: 'grayReleaseCount',
    label: '灰度数量',
  },
  {
    prop: 'ostype',
    label: '系统类型',
    render(h, data, row) {
      return row.ostype ? row.ostype : '-'
    }
  },
  {
    prop: 'type',
    label: '升级类型',
    render(h, data, row) {
      return status[row.type] || '-'
    }
  },
  {
    prop: 'upgradeStatus',
    label: '状态',

  },
  {
    prop: 'remarks',
    label: '备注',
    render(h, data, row) {
      return row.remarks ? row.remarks : '-'
    }
  },
  {
    fixed: 'right',
    prop: 'id',
    label: '操作',
    width: '60',
    slot: 'handle',
    width: '100'
  }
]
