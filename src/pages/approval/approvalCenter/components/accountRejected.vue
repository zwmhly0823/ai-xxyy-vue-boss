<template>
  <div class="container" v-loading="pageLoading">
    <div class="filter-box">
      <el-select
        clearable
        class="filter-status-select-class"
        v-model="filterStatusSelect"
        size="mini"
        placeholder="状态"
        @change="filterStatusSelectChange"
      >
        <el-option
          v-for="(item, i) in filterStatusSelectOptions"
          :key="i"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <searchPhone
        name="userTel"
        @result_lk="getPhone"
        style="margin-right:20px"
      />
      <department
        style="margin-right:20px"
        name="DepartmentIds"
        placeholder="全部部门"
        :onlyDept="1"
        @result="getSearchData1"
      />
      <group-sell
        style="margin-right:20px"
        @result="getSearchData2"
        :name="'groupSell'"
        tip="请选择老师"
      />
      <tabTimeSelect style="margin-left:0px" @result="getSeacherTime" />
    </div>

    <el-table :data="tableData" style="width: 100%" highlight-current-row>
      <el-table-column
        v-for="(item, key) in showData"
        :key="key"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
      >
      </el-table-column>
      <el-table-column label="状态" prop="status" width="150">
        <template slot-scope="scope">
          <el-button
            class="rejected-button"
            type="text"
            size="small"
            @click="clickStatusButton(scope.row)"
          >
            {{
              scope.row.financeStatus === 'DECLINE'
                ? '财务驳回'
                : scope.row.financeStatus === 'REPENDING'
                ? '已重提'
                : ''
            }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <adjust-drawer
      ref="adjustDrawerCom"
      :adjustDrawerData="adjustDrawerData"
      @drawButtonEmit="drawButtonEmit"
    ></adjust-drawer>
    <m-pagination
      class="bottom0"
      @current-change="paginationChange"
      :current-page="currentPage"
      :total="+totalElements"
      open="calc(100vw - 195px)"
      close="calc(100vw - 75px)"
    />
    <el-dialog
      title="提示"
      width="40%"
      :close-on-click-modal="false"
      :visible.sync="rejectedDialogShow"
    >
      <el-form
        ref="editInfoDialogForm"
        label-position="top"
        :rules="editInfoDialogRules"
        :model="editInfoDialogData"
      >
        <el-form-item label="请输入收款人姓名" prop="name">
          <el-input v-model="editInfoDialogData.name"></el-input>
        </el-form-item>
        <el-form-item label="请输入支付宝账号" prop="aliPayAccount">
          <el-input v-model="editInfoDialogData.aliPayAccount"></el-input>
        </el-form-item>
        <el-form-item class="rejected-dialog-button">
          <el-button size="small" @click="cancelSubmit">
            取消
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="submitForm('editInfoDialogForm')"
          >
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from './groupSell'
import searchPhone from '@/components/MSearch/searchItems/searchPhone.vue'
import tabTimeSelect from './timeSearch'
import MPagination from '@/components/MPagination/index.vue'
import { getStaffInfo } from '../common'
import { timestamp } from '@/utils/index'
import adjustDrawer from './adjustDrawer'
import _ from 'lodash'
export default {
  name: 'accountRejected',
  components: {
    Department,
    GroupSell,
    searchPhone,
    tabTimeSelect,
    adjustDrawer,
    MPagination
  },
  data() {
    return {
      pageLoading: true,
      filterStatusSelect: '',
      filterStatusSelectOptions: [
        { name: '驳回', value: 'DECLINE' },
        { name: '重提', value: 'REPENDING' }
      ],
      tableData: [], // 渲染的数据
      showData: [], // table框架
      staffId: '', // user数据
      isStaffId: '', // user数据
      currentPage: 1,
      totalElements: 0,
      // 列表数据的请求参数
      params: {
        type: 'REFUND',
        status: '',
        startTime: '',
        endTime: '',
        departmentIds: '', // 新添部门
        teacherIds: '', // 新添老师
        page: 1,
        size: 20,
        isFinance: 1,
        userTel: '',
        financeStatus: ''
      },
      adjustDrawerData: {
        width: '130px',
        loading: false
      },
      rejectedDialogShow: false,
      editInfoDialogData: {
        name: '',
        aliPayAccount: ''
      },
      editInfoDialogRules: {
        name: [
          { required: true, message: '请输入收款人姓名', trigger: 'blur' }
        ],
        aliPayAccount: [
          { required: true, message: '请输入支付宝账号', trigger: 'blur' },
          {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: '支付宝账号不能有汉字哦',
            trigger: 'blur'
          }
        ]
      },
      curFlowApprovalId: '',
      tempDialog: {}
    }
  },
  created() {
    // 用户数据
    this.initUserInfo()
    // 列表框架
    this.initList()
  },
  methods: {
    getSearchData1(val) {
      console.info('选择部门获取值:', val)
      this.params.departmentIds = val.DepartmentIds
        ? String(val.DepartmentIds)
        : ''
      this.initListData(this.params)
    },
    getSearchData2(val) {
      console.info('选择老师获取值:', val)
      this.params.teacherIds = val.groupSell ? String(val.groupSell) : ''
      this.initListData(this.params)
    },
    initUserInfo() {
      const staffData = getStaffInfo()
      this.staffId = staffData.staffId
      this.isStaffId = staffData.isStaffId
      this.params.staffId = this.staffId
      this.params.isOperation = this.isStaffId ? this.isStaffId : false
    },
    initList() {
      this.showData = [
        {
          prop: 'applyName',
          label: '申请人',
          width: '80'
        },
        {
          prop: 'applyDepartment',
          label: '申请人部门',
          width: '130'
        },
        {
          prop: 'type',
          label: '审批类型'
        },
        {
          prop: 'userTel',
          label: '用户电话',
          width: '200'
        },
        {
          prop: 'abstractContent',
          label: '审批摘要',
          width: '360'
        },
        {
          prop: 'ctime',
          label: '发起时间',
          width: '180'
        },
        {
          prop: 'approvalName',
          label: '审批人',
          width: '180'
        },
        {
          prop: 'endTime',
          label: '审批时间',
          width: '180'
        },
        {
          prop: 'financeMsg',
          label: '驳回原因',
          width: '230'
        }
      ]
    },
    dataToText(data) {
      const typeMap = new Map()
      typeMap.set('REISSUE', '补发货')
      typeMap.set('REFUND', '退款')
      typeMap.set('ADJUSTMENT_CLASS', '调班')
      typeMap.set('ADJUSTMENT_SUP', '调级')
      typeMap.set('ADJUSTMENT_STAGE', '调期')
      for (let i = 0, len = data.length; i < len; i++) {
        data[i].type = typeMap.get(data[i].type)
        data[i].abstractContent = data[i].abstractContent.replace(/\^/g, '\n')
        data[i].ctime = timestamp(data[i].ctime, 2)
        data[i].endTime = timestamp(data[i].endTime, 2)
      }
      return data
    },
    initListData() {
      this.pageLoading = true
      this.$http.Backend.checkListPending(this.params)
        .then((res) => {
          // console.log(res)
          if (res.payload.content && res.payload.content.length) {
            this.currentPage = res.payload.number - 0 + 1
            this.totalElements = res.payload.totalElements
            this.tableData.forEach((item, index) => {
              // item.applyDepartment = ''
            })
            // 个别数据做文字化处理
            this.tableData = this.dataToText(res.payload.content)
            // 重写部门名称
            // const idArr = this.tableData.map((item) => item.applyId)
            // this.$http.Backend.changeDepart(idArr).then(
            //   ({ data: { TeacherDepartmentRelationList } }) => {
            //     console.info(
            //       'lklk-财务拒绝',
            //       idArr,
            //       TeacherDepartmentRelationList
            //     )
            //     if (TeacherDepartmentRelationList.length) {
            //       TeacherDepartmentRelationList.forEach((item, index) => {
            //         this.tableData.forEach((itemx, indexX) => {
            //           if (item.teacher_id === itemx.applyId) {
            //             itemx.applyDepartment = item.department.name
            //           }
            //         })
            //       })
            //     }
            //   }
            // )
          } else {
            this.tableData = []
          }
          this.pageLoading = false
        })
        .catch(() => {
          this.tableData = []
          this.pageLoading = false
        })
    },
    filterStatusSelectChange(val) {
      this.params.financeStatus = val
      this.initListData(this.params)
    },
    // 新加手机号
    getPhone(val) {
      this.params.userTel = val.userTel
      this.initListData(this.params)
    },
    paginationChange(val) {
      Object.assign(this.params, { page: val })
      this.initListData(this.params)
    },
    getSeacherTime(val) {
      // console.log(val)
      if (!val) {
        this.params.startTime = ''
        this.params.endTime = ''
      } else {
        this.params.startTime = val.ctime.gte
        this.params.endTime = val.ctime.lte
      }
      this.initListData(this.params)
    },
    clickStatusButton(val) {
      // console.log(val)
      this.adjustDrawerData.loading = true
      this.$refs.adjustDrawerCom.handleDrawerOpen()
      this.$http.RefundApproval.getFlowDetail(val.id)
        .then((res) => {
          // console.log(res)
          if (res.payload && Object.keys(res.payload).length) {
            const payData = res.payload
            // 拼接drawer需要的值
            Object.assign(this.adjustDrawerData, {
              title: '退款申请',
              hasEdit: false,
              financeStatus: val.financeStatus,
              leftButtonText: '修改信息',
              rightButtonText: '重新提交',
              content: [
                {
                  label: '申请人',
                  value: payData.applyUserName
                },
                {
                  label: '申请人部门',
                  value: payData.applyUserDeapartmentName
                },
                {
                  label: '用户电话',
                  value: payData.customerPhone,
                  valueId: payData.userId
                },
                {
                  label: '订单号',
                  value: payData.outTradeNo
                },
                {
                  label: '业务类型',
                  value: payData.regType
                },
                {
                  label: '商品信息',
                  value: payData.productMsg
                },
                {
                  label: '退款规则',
                  value:
                    payData.refundRule === 0
                      ? '符合'
                      : payData.refundRule === 1
                      ? '不符合'
                      : ''
                },
                {
                  label: '交易金额',
                  value: payData.orderFee
                },
                {
                  label: '剩余金额',
                  value: payData.residueFee
                },
                {
                  label: '支付渠道',
                  value: payData.channel
                },
                {
                  label: '收款姓名',
                  value: payData.payeeName
                },
                {
                  label: '支付宝账号',
                  value: payData.payeeAccount
                },
                {
                  label: '退款类型',
                  value: {
                    0: '优惠券退款',
                    1: '课程退款',
                    2: '降半年包',
                    3: '补偿'
                  }[payData.refundType]
                },
                {
                  label: '已上课周期',
                  value: `${Math.floor(
                    payData.periodAlready / 4
                  )}月${payData.periodAlready % 4}周`
                },
                {
                  label: '关单赠品',
                  value: `${
                    payData.deductGift === 1
                      ? '扣除赠品费用'
                      : payData.deductGift === 0
                      ? '不扣除赠品费用'
                      : '-'
                  }`
                },
                {
                  label: '次月课程',
                  value: `${
                    payData.deductMonth === 1
                      ? '保留'
                      : payData.deductMonth === 0
                      ? '不保留'
                      : '-'
                  }`
                },
                {
                  label: '随材盒子',
                  value: `${
                    payData.deductMaterial === 1
                      ? '扣除随材盒子费用'
                      : payData.deductMaterial === 0
                      ? '不扣除随材盒子费用'
                      : '-'
                  }`
                },
                {
                  label: '退款月数',
                  value: `${Math.floor(payData.periodRefund / 4)}月`
                },
                {
                  label: '剩余可上课周期',
                  value: `${Math.floor(
                    payData.periodResidue / 4
                  )}月${payData.periodResidue % 4}周`
                },
                {
                  label: '退款金额',
                  value: payData.refundFee
                },
                {
                  label: '退款原因',
                  value: payData.refundReason
                },
                {
                  label: '退款说明',
                  value: payData.refundMsg
                },
                {
                  label: '附件',
                  type: 'img',
                  value: payData.attsUrl
                },
                {
                  label: '财务驳回原因',
                  value: val.financeMsg
                }
              ]
            })
            // dialog的预设值
            this.editInfoDialogData = {
              name: payData.payeeName,
              aliPayAccount: payData.payeeAccount
            }
            this.curFlowApprovalId = payData.flowApprovalId
          }
          this.adjustDrawerData.loading = false
        })
        .catch(() => {
          this.adjustDrawerData.loading = false
          this.$message.error('获取驳回详情失败')
        })
    },
    drawButtonEmit(data) {
      // console.log(data)
      if (data === 'left') {
        this.rejectedDialogShow = true
        this.tempDialog = _.cloneDeep(this.editInfoDialogData)
      } else if (data === 'right') {
        const params = {
          flowApprovalId: this.curFlowApprovalId,
          payeeName: this.editInfoDialogData.name,
          payeeAccount: this.editInfoDialogData.aliPayAccount
        }
        this.$http.Backend.rejectedUpdate(params)
          .then((res) => {
            // console.log(res)
            if (res.code === 0 && res.status === 'OK') {
              this.$refs.adjustDrawerCom.handleDrawerClose()
              this.initListData()
            }
          })
          .catch(() => {
            this.$message.error('重新提交失败')
          })
      }
    },
    cancelSubmit() {
      Object.assign(this.editInfoDialogData, this.tempDialog)
      this.rejectedDialogShow = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 数据回显到drawer上
          for (
            let i = 0, len = this.adjustDrawerData.content.length;
            i < len;
            i++
          ) {
            let num = 0
            const item = this.adjustDrawerData.content[i]
            if (item.label === '收款姓名') {
              item.value = this.editInfoDialogData.name.trim()
              num++
              continue
            }
            if (item.label === '支付宝账号') {
              item.value = this.editInfoDialogData.aliPayAccount.trim()
              continue
            }
            if (num === 2) {
              num++
              break
            }
          }
          this.adjustDrawerData.hasEdit = true
          this.$refs.adjustDrawerCom.reloadFun()
          this.rejectedDialogShow = false
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  .filter-status-select-class {
    width: 130px;
    margin-right: 20px;
  }
}
.el-table {
  /deep/ .cell {
    white-space: pre-line;
  }
  .rejected-button {
    font-size: 14px;
  }
}
.rejected-dialog-button {
  margin-top: 40px;
  margin-bottom: 0px;
  text-align: right;
}
</style>
