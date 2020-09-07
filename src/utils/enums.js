/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-20 14:17:54
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-05-21 12:40:17
 * @Description: 枚举值
 */

/*  随材物流状态
  0: "无地址",
    1: "待发货",
    2: "已发货",
    3: "已签收",
    4: "签收失败",
    5: "已退货",
    6: "确认待发货",
    7: "无效",
    8: "疑难",
    */
export const FOLLOW_EXPRESS_STATUS = {
  0: '无地址',
  6: '待审核',
  1: '待发货',
  2: '已发货',
  3: '已完成',
  9: ' 退款，暂停发货',
  '4,5,7,8': '异常物流'
}
// 随材物流状态 数组形式
function expressStatusList() {
  const list = []
  const pre = {} // 待审核
  for (const key in FOLLOW_EXPRESS_STATUS) {
    const item = FOLLOW_EXPRESS_STATUS[key]
    const obj = {}
    if (+key === 6) {
      Object.assign(pre, { id: key, text: item })
      continue
    }
    Object.assign(obj, { id: key, text: item })
    list.push(obj)
  }
  list.splice(1, 0, pre)
  return list
}
export const FOLLOW_EXPRESS_STATUS_LIST = expressStatusList()

// 用户绘画水平（base_painting）
export const BASE_PAINTING = {
  0: '',
  1: '无基础',
  2: '1年以下',
  3: '1年以上'
}

// 用户性别（sex）
export const USER_SEX = {
  0: '',
  1: '男',
  2: '女',
  3: '保密'
}

/**
 * 退款状态
     * 默认
    DEFAULT,
     * 退款已完成,由于历史原因只能把退款已完成设置为1
    REFUNDEND,
     * 申请退款
    APPLY,
     * 退款中
    INREFUND
 **/
export const ISREFUND = {
  0: '-',
  1: '已退费',
  2: '申请退费',
  3: '退费中'
}

// 学员年级
export const GRADE = {
  1: '一年级',
  2: '二年级',
  3: '三年级',
  4: '四年级',
  5: '五年级',
  6: '六年级'
}
