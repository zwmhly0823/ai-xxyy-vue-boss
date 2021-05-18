/*
 * @Author: liuzhiyuan
 * @LastEditors: liuzhiyuan
 */

export default [
  {
    slot: 'index',
    label: '序号',
    width: '60'
  },
  {
    prop: 'contract.id',
    label: '合同ID',
    width: '120',
    showOverflowTooltip: true
  },
  {
    prop: 'contract.contractName',
    label: '合同名称',
    width: '120',
    showOverflowTooltip: true
  },
  {
    prop: 'contract.collaboratorName',
    label: '合作方简称',
    width: '120',
    showOverflowTooltip: true
  },
  {
    prop: 'contract.contractBody',
    label: '对方合同主体全称',
    width: '120',
    showOverflowTooltip: true
  },
  {
    prop: 'contractPriceDetailList',
    label: '合同结算课单价（元）',
    width: '170',
    slot: 'before'
  },
  {
    prop: 'contractPriceDetailList',
    label: '实际结算课单价（元）',
    width: '170',
    slot: 'now'
  },
  {
    prop: 'contractPriceDetailList',
    label: '订单入库价格（元）',
    width: '170',
    slot: 'store'
  },
  {
    prop: 'contract.contractTypeName',
    label: '合同类型',
    width: '90'
  },
  {
    prop: 'contract.linkName',
    label: '签约方联系人',
    width: '120',
    showOverflowTooltip: true
  },
  {
    prop: 'contract.linkPhone',
    label: '联系人电话',
    width: '120',
    showOverflowTooltip: true
  },
  {
    prop: 'contract.createUser',
    label: '创建人',
    width: '80'
  },
  {
    prop: 'contract.ctime',
    label: '创建日期',
    width: '90'
  },
  {
    prop: 'user_status_name',
    label: '操作',
    children: true,
    fixed: 'right',
    width: '140',
    slot: 'handle'
  }
]
