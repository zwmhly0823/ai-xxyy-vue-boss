<template>
  <div>
    <el-drawer
      ref="drawerLk"
      :visible.sync="drawer"
      size="60%"
      :destroy-on-close="true"
    >
      <template v-slot:title>
        <h1 class="rawer-title">退费订单详情</h1>
      </template>
      <drawer :orderData="choutidata" :approveData="approv" />
    </el-drawer>
    <el-dialog title="订单退款记录" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column
          property="refundTypeStr"
          label="退款类型"
        ></el-table-column>
        <el-table-column
          property="refundFee"
          label="退款金额"
        ></el-table-column>
        <el-table-column property="address" label="退款申请人·部门">
          <template slot-scope="scope">
            <p>{{ scope.row.applyName }}</p>
            <p>{{ scope.row.applierDepartment }}</p>
          </template>
        </el-table-column>
        <el-table-column
          property="refundTime"
          label="完成退款时间"
        ></el-table-column>
        <el-table-column property="address" label="操作">
          <template slot-scope="scope">
            <span
              @click="handleRefund(scope.row)"
              class="logistics"
              style="color:#0099FF"
              >详情</span
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import drawer from '../../../components/drawer'
export default {
  name: 'seeRefund',
  components: {
    drawer
  },
  props: ['outTradeNo'],
  data() {
    return {
      drawer: false,
      approv: '',
      choutidata: {},
      gridData: [],
      dialogTableVisible: false
    }
  },
  watch: {
    outTradeNo(val) {
      this.gridData = val
      console.log(val, '子组件')
    }
  },
  methods: {
    handleSee() {
      this.dialogTableVisible = true
    },
    // 获取退款详情
    async handleRefund(val) {
      const params = {
        paymentId: val.id
      }
      this.$http.Finance.getDetail(params).then((res) => {
        console.log(res)
        Object.assign(this.choutidata, res.payload)
        this.drawer = true
      })
      this.approv = await this.$http.Finance.getApprov({
        flowApprovalId: val.approvalId
      })
      console.log(this.approv)
    }
  }
}
</script>
<style lang="scss" scoped>
.logistics {
  cursor: pointer;
}
</style>
