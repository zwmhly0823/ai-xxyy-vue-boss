<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-04-27 17:47:58
 * @LastEditors: liukun
 * @LastEditTime: 2020-05-18 16:16:33
 -->
<template>
  <div class="container">
    <div class="time">
      <tabTimeSelect @result="getSeacherTime" />
      <CheckType @result="getcheckType" />
      <SearchPart @result="getSeachePart" />
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @cell-mouse-enter="handleMouseEnter"
      @cell-mouse-leave="handleMouseLeave"
    >
      <el-table-column width="50">
        <template slot-scope="scope">
          <el-dropdown placement="bottom-start">
            <div :class="scope.row.id === current.id ? 'three-dot' : 'disnone'">
              <img src="@/assets/images/icon/icon-three-dot.jpg" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <div @click="pullDownList(scope.row.id, scope.row.type)">
                <el-dropdown-item>撤销</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="申请人" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.applyName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请人部门" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.applyDepartment }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审批类型">
        <template slot-scope="scope">
          <div v-show="scope.row.type === 'REISSUE'">
            补发货
          </div>
          <div v-show="scope.row.type === 'REFUND'">
            退款
          </div>
          <div v-if="scope.row.type === 'ADJUSTMENT_STAGE'">
            调期申请
          </div>
          <div v-else-if="scope.row.type === 'ADJUSTMENT_CLASS'">
            调班申请
          </div>
          <div v-if="scope.row.type === 'ADJUSTMENT_SUP'">
            调级申请
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审批摘要" width="450">
        <template slot-scope="scope">
          <div>{{ scope.row.repiarContent }}</div>
          <div>{{ scope.row.receptContent }}</div>
          <div>{{ scope.row.reason }}</div>
          <div
            v-if="
              scope.row.type === 'ADJUSTMENT_STAGE' ||
                scope.row.type === 'ADJUSTMENT_SUP'
            "
          >
            {{
              scope.row.abstractContent.substring(
                scope.row.abstractContent.lastIndexOf('^') + 1
              )
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.openTime }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <div
            @click="getApprovalDeatail(scope.row.type, scope.row.id)"
            v-show="scope.row.status === 'PENDING'"
            class="wait-pending"
          >
            待审批
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      :visible.sync="drawerApproval"
      :destroy-on-close="true"
      size="50%"
      class="drawer-approval-detail"
      :title="drawerApprovalDeatail.addressId ? '补发货审批' : '退款审批'"
    >
      <div v-if="drawerApprovalDeatail.addressId">
        <el-row>
          <el-col :span="3">申请人:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.applyUserName
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">申请部门:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.applyUserDeapartmentName
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">补发商品:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.productInfo
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">收货信息:</el-col>
          <el-col :span="20" :offset="1">{{
            `${drawerApprovalDeatail.receiptName +
              '' +
              drawerApprovalDeatail.receiptTel}~~${drawerApprovalDeatail.receiptAddressProvince +
              '' +
              drawerApprovalDeatail.receiptAddressCity +
              '' +
              drawerApprovalDeatail.receiptAddressArea +
              '' +
              drawerApprovalDeatail.receiptAddressDetail}`
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">订单号:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.outTradeNo
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">商品信息:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.productNames
          }}</el-col>
        </el-row>
        <el-row v-show="+drawerApprovalDeatail.stage !== 0">
          <el-col :span="3">开课期数:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.stage
          }}</el-col>
        </el-row>
        <el-row v-if="isStaffId && drawerApprovalDeatail.mode === 'DEFAULT'">
          <el-col :span="3">版本信息:</el-col>
          <el-col :span="20" :offset="1">
            <moreVersionBox
              name="version"
              @result="getVersion"
            ></moreVersionBox>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">补发原因:</el-col>
          <el-col :span="20" :offset="1">
            {{
              drawerApprovalDeatail.reason == 'TRANSPORT_BAD'
                ? '发货漏发'
                : '运输损坏'
            }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">发起时间:</el-col>
          <el-col :span="20" :offset="1">
            {{ drawerApprovalDeatail.ctimeFormdate }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">状态:</el-col>
          <el-col :span="20" :offset="1">
            {{ drawerApprovalDeatail.status == 'PENDING' ? '待审批' : '-' }}
          </el-col>
        </el-row>
        <el-row v-if="isStaffId" class="BOTTOM">
          <el-col :span="20" :offset="1">
            <el-button type="button" @click="refuseReplenish">拒 绝</el-button>
            <el-button type="button" @click="ensureReplenish">同 意</el-button>
          </el-col>
        </el-row>
      </div>
      <div v-else class="approvallk">
        <el-row>
          <el-col :span="5">申请人:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.applyUserName
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">申请部门:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.applyUserDeapartmentName
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">用户电话:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.customerPhone
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">订单号:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.outTradeNo
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">业务类型:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.regType
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">商品信息:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.productMsg
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">支付渠道:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.channel
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">退款类型:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.refundType
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">已上课周期:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.periodAlready
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">退款月数:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.periodRefund
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">剩余可上课周期:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.periodResidue
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">退款金额:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.refundFee
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">退款原因:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.refundReason
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">附件:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.attsUr
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">状态:</el-col>
          <el-col :span="18" :offset="1">
            {{
              drawerApprovalDeatail.status == 'COMPLETED'
                ? '审批通过'
                : '审批驳回'
            }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">备注:</el-col>
          <el-col :span="18" :offset="1">
            {{ drawerApprovalDeatail.approvalRemark }}
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <adjust-drawer
      ref="adjustDrawerCom"
      :adjustDrawerData="adjustDrawerData"
      :isStaffId="isStaffId"
      @result="adjustDrawerPass"
    ></adjust-drawer>
    <el-dialog
      class="adjust-dialog-class"
      :title="
        adjustDialogType === 'reject'
          ? '审批拒绝'
          : adjustDialogType === 'pass'
          ? '审批同意'
          : ''
      "
      :visible.sync="adjustResultDialogShow"
    >
      <p class="adjust-dialog-p">
        请确认是否{{
          adjustDialogType === 'reject'
            ? '拒绝'
            : adjustDialogType === 'pass'
            ? '同意'
            : ''
        }}此条申请
      </p>
      <p style="font-size: 14px;">
        备注 <span style="color:red;font-size: 12px;">必填</span>
      </p>
      <el-input
        class="adjust-dialog-input"
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="adjustDrawerData.checkSuggestion"
        maxlength="100"
        show-word-limit
        @input="adjustDialogErrShow = false"
      >
      </el-input>
      <div v-show="adjustDialogErrShow" class="adjust-dialog-err-p">
        请输入审批意见
      </div>
      <div class="adjust-dialog-button-box">
        <el-button
          @click="
            adjustDrawerData.checkSuggestion = ''
            adjustResultDialogShow = false
            adjustDialogErrShow = false
          "
          >取消</el-button
        >
        <el-button type="primary" @click="adjustResultDialogConfirm"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 待审批的撤销 -->
    <el-dialog
      title="撤销申请"
      :visible.sync="endback"
      width="30%"
      :before-close="closeEndBack"
    >
      <span>你确定要撤销申请嘛！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endback = false">取 消</el-button>
        <el-button type="primary" @click="ensureBackend">确 定</el-button>
      </span>
    </el-dialog>
    <m-pagination
      class="bottom0"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :total="+totalElements"
      open="calc(100vw - 195px)"
      close="calc(100vw - 75px)"
    />
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
import tabTimeSelect from './timeSearch'
import moreVersionBox from '@/components/MSearch/searchItems/moreVersionBox.vue'
import CheckType from './checkType'
import { timestamp } from '@/utils/index'
import SearchPart from './searchPart'
import adjustDrawer from './adjustDrawer'
export default {
  props: ['typeTime', 'activeName'],
  watch: {
    activeName(val) {
      if (val === 'second') {
        this.checkPending(this.params)
      }
    }
  },
  components: {
    MPagination,
    tabTimeSelect,
    moreVersionBox,
    CheckType,
    SearchPart,
    adjustDrawer
  },
  data() {
    return {
      params: {}, // 列表的参数
      resetParams: {}, // 撤销的参数
      staffId: '',
      tableData: [],
      current: {},
      drawerApproval: false,
      drawerApprovalDeatail: {},
      currentPage: 1,
      totalElements: 0,
      endback: false,
      isStaffId: false,
      version: {},
      adjustDrawerData: {
        width: '130px',
        checkSuggestion: '', // 调期调级调班的dialog数据
        loading: false
      },
      adjustResultDialogShow: false, // drawer同意后的弹窗
      adjustDialogType: null, // dialog的类型
      adjustDialogErrShow: false // dialog的错误提示
    }
  },
  created() {
    const staff = localStorage.getItem('staff')
    const teacher = localStorage.getItem('teacher')
    if (staff) {
      this.staffId = JSON.parse(staff).id
      this.staffName = JSON.parse(staff).id.realName
      this.isStaffId = JSON.parse(staff).positionId + 0 === 1 || ''
    }
    if (teacher) {
      this.staffId = JSON.parse(teacher).id
      this.staffName = JSON.parse(teacher).realName
    }
    // this.staffName = getStaffInfo().staffName
    this.resetParams = {
      staffId: this.staffId,
      staffName: this.staffName
    }
    // Parameters:
    this.params = {
      type: '',
      keyword: '',
      status: 'PENDING',
      staffId: this.staffId,
      isOperation: false,
      startTime: '',
      endTime: '',
      page: 1,
      size: 20
    }
    this.checkPending(this.params)
  },

  methods: {
    // 销售部门搜索
    getSeachePart(val) {
      Object.assign(this.params, { keyword: val })
      console.log(val, 'app-container')
      this.checkPending(this.params)
    },
    // 查询审批类型判断
    getcheckType(val) {
      Object.assign(this.params, { type: val })
      this.checkPending(this.params)
    },
    // 获取版本盒子
    getVersion(val) {
      console.log(val, 'banben')
      this.version = val.version
    },
    // 拒绝申请
    refuseReplenish() {
      this.$prompt('请输入原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '内容不能为空'
      })
        .then(({ value }) => {
          const params = {
            approvalRemark: value,
            flowApprovalId: this.drawerApprovalDeatail.flowApprovalId,
            isConfirm: false,
            version: this.version,
            staffId: this.staffId,
            staffName: this.staffName
          }
          this.$http.Backend.isAggrePass(params).then((res) => {
            console.log(res)
            this.checkPending(this.params)
            this.drawerApproval = false
            this.$message({
              message: '拒绝审核通过',
              type: 'success'
            })
            this.$emit('result', 'third')
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 同意申请
    ensureReplenish() {
      this.$prompt('请输入原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '内容不能为空'
      })
        .then(({ value }) => {
          const params = {
            approvalRemark: value,
            flowApprovalId: this.drawerApprovalDeatail.flowApprovalId,
            isConfirm: true,
            version: this.version,
            staffId: this.staffId,
            staffName: this.staffName
          }
          this.$http.Backend.isAggrePass(params).then((res) => {
            console.log(res)
            this.checkPending(this.params)
            this.drawerApproval = false
            this.$message({
              message: '同意审核通过',
              type: 'success'
            })
            this.$emit('result', 'third')
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },

    // 点x关闭按钮
    closeEndBack() {
      this.endback = false
    },
    // ensureBackend 撤销弹出框确认按钮
    ensureBackend() {
      this.$http.Backend.getReplenishReset(this.resetParams).then((res) => {
        if (res && res.payload) {
          this.checkPending(this.params)
          this.$emit('result', 'forth')
          this.endback = false
        }
      })
    },
    // 时间筛选
    getSeacherTime(val) {
      if (val) {
        Object.assign(this.params, {
          startTime: val.ctime.gte,
          endTime: val.ctime.lte
        })
      } else {
        Object.assign(this.params, {
          startTime: '',
          endTime: ''
        })
      }
      this.checkPending(this.params)
    },
    // 应该是当前选择第几页吧
    handleCurrentChange(val) {
      Object.assign(this.params, { page: val })
      this.checkPending(this.params)
    },
    // 打开抽屉 传进来两个参数 一个type 一个id  type用来区分补发货还是退款
    getApprovalDeatail(type, id) {
      if (type === 'REISSUE') {
        this.$http.Backend.getReplenishDetail(id).then((res) => {
          if (res && res.payload) {
            res.payload.ctimeFormdate = timestamp(res.payload.ctime, 2)
            this.drawerApprovalDeatail = res.payload
            // 对传过来的对象做处理
            console.log(
              this.drawerApprovalDeatail,
              'this.drawerApprovalDeatail'
            )
            this.drawerApproval = true
          }
        })
      }
      // 退款详情
      if (type === 'REFUND') {
        this.$http.RefundApproval.getFlowDetail(id).then((res) => {
          if (res && res.payload) {
            res.payload.ctimeFormdate = timestamp(res.payload.ctime, 2)
            this.drawerApprovalDeatail = res.payload
            // 对传过来的对象做处理
            console.log(this.drawerApprovalDeatail)
            this.drawerApproval = true
          }
        })
      }
      // 调级调期调班
      const ADJUST_TYPE = [
        'ADJUSTMENT_CLASS',
        'ADJUSTMENT_STAGE',
        'ADJUSTMENT_SUP'
      ]
      if (ADJUST_TYPE.includes(type)) {
        this.openAdjustDetail(type, id)
      }
    },
    // 打开调x调x调x的审批详情
    openAdjustDetail(type, id) {
      this.adjustDrawerData.loading = true
      this.$refs.adjustDrawerCom.handleDrawerOpen()
      let typeText = ''
      switch (type) {
        case 'ADJUSTMENT_STAGE':
          typeText = '调期申请'
          break
        case 'ADJUSTMENT_SUP':
          typeText = '调级申请'
          break
        case 'ADJUSTMENT_CLASS':
          typeText = '调班申请'
          break
      }
      this.$http.Approval.getAdjustDetail(id)
        .then((res) => {
          if (res && res.payload) {
            const payData = res.payload
            // console.log(payData)
            // 用于显示的和一些杂项
            // 公共部分
            Object.assign(this.adjustDrawerData, {
              type: 'notDone', // notDone是待审批
              title: typeText,
              flowApprovalId: payData.flowApprovalId,
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
                  value: payData.userTel
                },
                {
                  label: '订单号',
                  value: payData.outTradeNo
                },
                {
                  label: '审批类型',
                  value: typeText
                }
              ]
            })
            // 调期
            if (type === 'ADJUSTMENT_STAGE') {
              this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
                [
                  {
                    label: '当前开课时间',
                    value: payData.currentStartClassDate
                  },
                  {
                    label: '申请开课时间',
                    value: payData.targetStage
                  }
                ]
              )
            }
            // 调级
            if (type === 'ADJUSTMENT_SUP') {
              this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
                [
                  {
                    label: '已上课周期',
                    value: payData.currentPeriod
                  },
                  {
                    label: '调级级别',
                    value: payData.targetSup
                  }
                ]
              )
            }
            // 调班
            if (type === 'ADJUSTMENT_CLASS') {
              this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
                [
                  {
                    label: '当前班级',
                    value: payData.currentClassName
                  }
                ]
              )
            }
            const aTime = new Date(payData.applyTime - 0)
            // 公共数据
            this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
              [
                {
                  label: '选择班级',
                  value: payData.targetClassName
                },
                {
                  label: '调级理由',
                  value: payData.adjustReason
                },
                {
                  label: '发起时间',
                  value: `${aTime.getFullYear()}-${aTime.getMonth() +
                    1}-${aTime.getDate()} ${aTime.getHours()}:${aTime.getMinutes()}:${aTime.getSeconds()}`
                },
                {
                  label: '状态',
                  value: '待审批'
                }
              ]
            )
          }
          this.adjustDrawerData.loading = false
        })
        .catch(() => {
          this.adjustDrawerData.loading = false
          this.$message.error('获取审批详情失败')
        })
    },
    // 关闭审批详情查看
    handleClose() {
      this.drawerApproval = false
    },
    // 点击下拉操作
    pullDownList(id, type) {
      Object.assign(this.resetParams, { flowApprovalId: id })
      this.endback = true
    },
    // 鼠标进入
    handleMouseEnter(row) {
      this.current = row
    },
    // 鼠标离开
    handleMouseLeave(row) {
      this.current = {}
    },
    // 待审核列表渲染
    checkPending(params) {
      this.$http.Backend.checkListPending(params).then((res) => {
        if (res && res.payload && res.payload.content) {
          this.totalElements = res.payload.totalElements
          this.tableData = res.payload.content.map((item) => {
            const zhaiyao = item.abstractContent.split('^')
            item.repiarContent = zhaiyao[0]
            item.receptContent = zhaiyao[1]
            item.reason = zhaiyao[2]
            item.openTime = timestamp(item.ctime, 2)
            item.approveTime = timestamp(item.endTime, 2)
            return item
          })
        }
      })
    },
    // 调期调级调班的drawer同意或拒绝
    adjustDrawerPass(type) {
      this.adjustDialogType = type
      if (type === 'pass') {
        this.adjustDrawerData.checkSuggestion = '同意'
      }
      this.adjustResultDialogShow = true
    },
    // adjust-dialog的按钮
    adjustResultDialogConfirm() {
      if (!this.adjustDrawerData.checkSuggestion) {
        this.adjustDialogErrShow = true
        return
      }
      let isConfirm = null
      if (this.adjustDialogType === 'reject') {
        isConfirm = false
      } else if (this.adjustDialogType === 'pass') {
        isConfirm = true
      }
      const params = {
        approvalRemark: this.adjustDrawerData.checkSuggestion,
        flowApprovalId: this.adjustDrawerData.flowApprovalId - 0,
        isConfirm: isConfirm,
        staffId: this.staffId,
        staffName: this.staffName
      }
      // 特殊字符
      const reg = new RegExp('[&%#$*^<>]')
      if (reg.test(params.approvalRemark)) {
        this.$message('不能包含特殊字符&%#$*^<>哦')
        return
      }
      this.$http.Approval.isAggrePass(params)
        .then((res) => {
          // console.log(res)
          this.adjustResultDialogShow = false
          this.$refs.adjustDrawerCom.handleDrawerClose()
          this.adjustDrawerData.checkSuggestion = ''
          this.$emit('approvalDone')
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('提交出错啦')
        })
    }
  }
}
</script>

<style lang="scss" module>
:global {
  .drawer-approval-detail {
    padding-top: 50px;
    font-size: 16px;
  }
  // el原类名追加样式
  .approvallk .el-drawer__body {
    padding-left: 10px;
  }
  .approvallk .el-row {
    margin-bottom: 20px;
  }
  .approvallk .el-row:nth-last-of-type {
    margin-bottom: 0;
  }
  .approvallk .el-row .el-col-5 {
    text-align: right;
  }

  // 操作
  .wait-pending {
    cursor: pointer;
    color: #409eff;
  }
  .time {
    display: flex;
    align-items: center;
  }
  // 是否三点
  .disnone {
    display: none;
  }
  .three-dot {
    display: flex;
    justify-content: center;
    img {
      width: 14px;
      height: 14px;
    }
  }
  .adjust-dialog-class {
    .el-dialog {
      padding: 10px 20px;
      .adjust-dialog-p {
        font-size: 16px;
        margin-bottom: 25px;
      }
      .adjust-dialog-err-p {
        color: red;
      }
      .adjust-dialog-button-box {
        margin-top: 50px;
        text-align: center;
      }
    }
  }
}
</style>
