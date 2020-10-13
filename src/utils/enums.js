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

/**
 * public static enum GRADE {
    DEFAULT,
    GRADE_PRE,
    GRADE_ONE,
    GRADE_TWO,
    GRADE_THREE,
    GRADE_FOUR,
    GRADE_FIVE,
    GRADE_SIX;

    private GRADE() {
    }
}
 */
// 写字学员基本信息-学员年级
export const GRADE = {
  0: '',
  1: '学龄前',
  2: '一年级',
  3: '二年级',
  4: '三年级',
  5: '四年级',
  6: '五年级',
  7: '六年级'
}
/**
 * @description  SUP对应 写字课中的年级
 * @params { sup: S1...S6, teamType: '0'体验课，'1'系统课}
 */

export const GETGRADE = (sup, teamType) => {
  if (!sup || !teamType) return ''

  const TU = {
    '0S1': '基础(S1)',
    '0S2': '高阶(S2)',
    '1S1': '一年级(S1)',
    '1S2': '二年级(S2)',
    '1S3': '三年级(S3)',
    '1S4': '四年级(S4)',
    '1S5': '五年级(S5)',
    '1S6': '六年级(S6)'
  }
  return TU[`${teamType}${sup}`] || ''
}

/** 系统课订单 */
export const SYSTEMRADE = (sup) => {
  if (!sup) return ''

  const TU = {
    S1: '一年级(S1)',
    S2: '二年级(S2)',
    S3: '三年级(S3)',
    S4: '四年级(S4)',
    S5: '五年级(S5)',
    S6: '六年级(S6)'
  }
  return TU[`${sup}`] || ''
}

/**
 * 用户跟进状态 user_status
 */
export const USER_FLLOW_UP = {
  0: '已注册',
  1: '已体验课',
  2: '体验课完课',
  3: '已月系统课',
  4: '月系统课完课',
  5: '已年系统课',
  6: '年系统课完课',
  7: '年系统课续费',
  8: '注销失效',
  9: '已季系统课',
  10: '季系统课完课',
  11: '已半年系统课',
  12: '半年系统课完课'
}

/**
 * 课程类型
 */

export const COURSECATEGORY = (course) => {
  if (!course) return ''

  const TYPE = {
    0: '双周体验课',
    2: '年系统课',
    3: '单周体验课',
    4: '半年系统课'
  }
  return TYPE[`${course}`] || ''
}
