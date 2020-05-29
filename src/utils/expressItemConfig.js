export const replenishProductTypeList = [
  { label: '小熊商城', value: 'STORE', id: 1 },
  { label: '推荐有礼', value: 'RECOMMEND', id: 2 },
  { label: '邀请有奖', value: 'INVITATION', id: 6 }
]

export const replenishTypeList = [
  { label: '单件补发', value: '0' },
  { label: '整盒补发', value: '1' }
]

export const replenishReasonSearchList = [
  { label: '发货漏发', value: '0' },
  { label: '运输损坏', value: '1' }
]

export const expressToggleList = [
  { label: '全部', id: '0,1,2,3,4,5,6,7,8,9' },
  { label: '无地址', id: '0' },
  { label: '待审核', id: '6', center_express_id: { lte: 0 } },
  { label: '待发货', id: '1' },
  { label: '已发货', id: '2' },
  { label: '已完成', id: '3' },
  { label: '疑难', id: '8' },
  { label: '退签', id: '4' },
  { label: '退回', id: '5' },
  { label: '失效', id: '7' },
  { label: '暂停发货', id: '9' },
  { label: '下单失败', id: '6', center_express_id: { gt: 0 } }
]

export const productTopicList = [
  { name: '小熊商城', id: '5' },
  { name: '推荐有礼', id: '4' },
  { name: '邀请有奖', id: '6' }
]
