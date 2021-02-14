<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2021-01-23 16:49:28
 * @LastEditors: liukun
 * @LastEditTime: 2021-02-02 18:07:56
-->
<template>
  <el-drawer
    :visible.sync="isShow"
    :destroy-on-close="true"
    :before-close="handleClose"
    size="50%"
    class="drawer-approval-detail"
  >
    <template v-slot:title>
      <h2>
        体验课调级审批
      </h2>
    </template>
    <div class="approvallk">
      <el-row>
        <el-col :offset="1" :span="23"><h4>审批详情</h4></el-col>
      </el-row>
      <el-row>
        <el-col :span="4">申请人:</el-col>
        <el-col :span="19" :offset="1">{{
          drawerApprovalDeatail.applyUserName
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">申请部门:</el-col>
        <el-col :span="19" :offset="1">{{
          drawerApprovalDeatail.applyUserDeapartmentName
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">用户电话:</el-col>
        <el-col :span="19" :offset="1"
          ><el-link
            type="primary"
            :href="
              devATestChange(
                '/users/#/details/' + drawerApprovalDeatail.userId,
                'toss'
              )
            "
            target="_blank"
            >{{ drawerApprovalDeatail.userTel }}</el-link
          ></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="4">订单号:</el-col>
        <el-col :span="19" :offset="1">{{
          drawerApprovalDeatail.outTradeNo
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">当前报名级别:</el-col>
        <el-col :span="19" :offset="1">{{
          drawerApprovalDeatail.currentSup
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">申请调级级别:</el-col>
        <el-col :span="19" :offset="1">{{
          drawerApprovalDeatail.targetSup
        }}</el-col>
      </el-row>
      <el-row v-if="drawerApprovalDeatail.targetClassName">
        <el-col :span="4">接收班级:</el-col>
        <el-col :span="19" :offset="1">{{
          drawerApprovalDeatail.targetClassName
        }}</el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="4">选择接收班级:</el-col>
        <el-col :span="19" :offset="1">
          <el-select size="mini" v-model="classSelected">
            <el-option
              v-for="item of classList"
              :key="item.id"
              :label="item.teamName + '--' + item.teacherName"
              :value="item.id + '^' + item.teamName + '--' + item.teacherName"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">调级理由:</el-col>
        <el-col :span="19" :offset="1">{{
          drawerApprovalDeatail.adjustReason
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">发起时间:</el-col>
        <el-col :span="19" :offset="1">{{
          timeFormate(drawerApprovalDeatail.ctime)
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="23"><h4>审批节点</h4></el-col>
        <el-col :offset="1" :span="22">
          <el-table
            :data="tableDataNode"
            :header-cell-style="{
              background: 'rgba(31,116,249,.7)',
              color: '#fff'
            }"
          >
            <el-table-column
              prop="approvalName"
              label="发起人/审核人"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="statusStr" label="审批状态" align="center">
            </el-table-column>
            <el-table-column
              prop="approvalRemark"
              label="审批意见"
              align="center"
            >
            </el-table-column>
            <el-table-column label="操作时间" align="center">
              <template slot-scope="scope">
                {{ timeFormate(scope.row.utime) }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row v-if="name === 'pending'">
        <el-col :span="22" :offset="1" style="text-align:right;padding-top:5px">
          <el-button @click="comfirmEnd(0)">拒绝</el-button>
          <el-button type="primary" @click="comfirmEnd(1)">同意</el-button>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script>
import { assertdt } from '@/utils/mini_tool_lk'
import * as tools from '@/utils/mini_tool_lk'
import { getStaffInfo } from './common'

export default {
  name: 'trialChangeLevel',
  inject: ['cr'],
  props: {
    name: { type: String, default: '' },
    forSonDataApprovalId: {
      type: String,
      default: ''
    },
    forSonDataApprovalPersonId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      staffName: getStaffInfo().staffName, // storage体验或系统课老师-realName
      staffId: getStaffInfo().staffId, // storage体验或系统课老师id

      isShow: false,
      drawerApprovalDeatail: {},
      classList: [],
      classSelected: '',
      tableDataNode: [] // 审批流程节点-专有接口获取
    }
  },
  methods: {
    handleClose() {
      this.isShow = false
      this.cr.currentType = '' // 该抽屉关闭,父dom抹掉该组件;确报再次开屉,父级dom树重新添加,它能初始化-全接口新数据
    },
    async getAllData() {
      // 详细信息
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const { code, payload } = await this.$http.RefundApproval.getAllData(
        this.forSonDataApprovalId
      ).finally(() => {
        loading.close()
      })
      if (!code && payload) {
        this.drawerApprovalDeatail = payload
      } else {
        this.$message.error('右边框数据加载失败')
        this.this.drawerApprovalDeatail = {}
      }
    },
    async getTableNode() {
      // 抽屉里审核流程table
      this.$http.RefundApproval.getFlowDetailNodeTable(
        this.forSonDataApprovalId
      ).then(({ code, payload }) => {
        if (!code) {
          this.tableDataNode = payload
        }
      })
    },
    getClassList() {
      // 可调级别班级列表
      this.$http.RefundApproval.getClassList(
        this.drawerApprovalDeatail.orderId,
        this.drawerApprovalDeatail.targetSup
      ).then(({ code, payload }) => {
        if (!code && payload.length) {
          this.classList = payload
        } else if (!code && !payload.length) {
          this.classList = []
          this.$message.error('没有可选的调级班级')
        }
      })
    },
    comfirmEnd(assert) {
      this.$prompt('请输入审批原因', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        inputValue: !assert ? '' : '同意'
      }).then(({ value }) => {
        if (/\S+/g.test(value)) {
          const params = {
            staffName: this.staffName,
            staffId: this.staffId,
            flowApprovalId: this.forSonDataApprovalId,
            approvalRemark: value,
            isConfirm: true,
            targetClassId: this.classSelected.split('^')[0],
            targetClassName: this.classSelected.split('^')[1]
          }
          if (!assert) {
            params.isConfirm = false
            delete params.targetClassId
            delete params.targetClassName
          }
          if (assert) {
            if (!this.classSelected) {
              this.$message.error('同意调级时-请务必选择接收班级')
              return
            }
          }
          this.$http.RefundApproval.comfirmEnd(params).then(({ code }) => {
            if (!code) {
              this.$message.success('审核处理完成')
              this.cr.checkPending(this.cr.params) // 刷新列表
            }
          })
        } else {
          this.$message.error('审批原因是必填项')
        }
      })
    }
  },
  computed: {
    devATestChange() {
      return assertdt
    },
    timeFormate() {
      return tools.formatDate
    }
  },
  async mounted() {
    this.getTableNode()
    await this.getAllData()
    // await ↓↓依赖上方接口返回的数据才能判断是否发起请求+请求参数
    if (!this.drawerApprovalDeatail.targetClassName) {
      this.getClassList()
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-approval-detail {
  padding-top: 50px;
  font-size: 16px;
  .el-drawer {
    overflow: auto;
  }
}
// el原类名追加样式
.approvallk {
  padding-left: 10px;
}
.approvallk .el-row {
  margin-bottom: 10px;
}
.approvallk .el-row:nth-last-of-type {
  margin-bottom: 0;
}
.approvallk .el-row .el-col-4 {
  text-align: right;
}
</style>
