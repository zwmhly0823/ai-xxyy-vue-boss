/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-20 14:17:54
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-05-21 12:40:17
 * @Description: 枚举值
 */
export const TEAM_STATE = {
  '0': '待开课',
  '1': '开课中',
  '2': '已结课'
}

/**
 * 订单类型 regtype
 */
export const REGTYPE = {
  0: '',
  1: '体验课',
  2: '首单',
  3: '续费',
  4: '推荐有礼', // 宝石兑换
  5: '小熊商城', // 积分兑换
  6: '邀请有奖', // 赠送
  7: '素质课',
  8: '兑换',
  9: '营销活动',
  10: '新签补差',
  11: '续费补差'
}

/**
 * 订单状态  已完成:3, 待支付:0,1，已退费:6,7
 */
export const ORDER_STATUS = {
  0: '未激活状态',
  1: '已激活',
  2: '已支付',
  3: '已完成',
  4: '申请退款',
  5: '退款中',
  6: '部分退款',
  7: '退款完成',
  8: '关闭'
}
/**
 * 跟进记录 - 类型
 */
export const FOLLOW_TRACK_TYPE = {
  '0': '首通',
  '1': '首课',
  '2': '四课',
  '3': '八课',
  '4': '老生覆盖',
  '5': '日常沟通',
  '6': '退费挽单',
  '7': '运营',
  '8': '客服',
  '9': '投诉回访',
  '10': '首周回访',
  '11': '月度回访',
  '12': '7天未参课',
  '13': '15天未参课预警(教辅)',
  '14': '22天未参课预警(组长)',
  '15': '24天未参课预警(经理)'
}

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
    0: '双周体验课-49元', 
    2: '年系统课',
    3: '单周体验课-29元', 
    4: '半系统年课',
    506: '单周体验课-19元',
    507: '单周体验课-9.9元',
    505: '双周体验课-9.9元',
    503: '双周体验课-29元',
    508: '双周体验课-22元',
  }
  return TYPE[`${course}`] || ''
}

/**
 * @description operateType
 */
export const LOGINTYPE = {
  LOGIN: '登录',
  ADD: '新增账号',
  RESET: '重置密码'
}
