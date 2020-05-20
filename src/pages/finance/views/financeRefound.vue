<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-05-19 17:18:39
 * @LastEditors: liukun
 * @LastEditTime: 2020-05-20 16:03:37
-->
<template>
  <section class="bianju10">
    <div class="bom10">
      <el-form :inline="true" size="mini">
        <el-form-item label="订单搜索:">
          <div class="concat">
            <el-select v-model="t1" placeholder="请选择">
              <el-option label="订单号" value="0"></el-option>
              <el-option label="交易流水号" value="1"></el-option>
            </el-select>
            <el-input v-model="t2" placeholder="请键入编号"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="业务类型:">
          <el-select v-model="t1" placeholder="请键入">
            <el-option label="体验课" value="0"></el-option>
            <el-option label="系统课" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式:">
          <el-select v-model="t1" placeholder="请键入">
            <el-option label="微信" value="0"></el-option>
            <el-option label="支付宝" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款状态:">
          <el-select v-model="t1" placeholder="请键入">
            <el-option label="退款中" value="0"></el-option>
            <el-option label="退款成功" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户搜索:">
          <div class="concat">
            <el-input v-model="t2" placeholder="请键入用户ID"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="时间查询:">
          <div class="concat">
            <el-select v-model="t1" placeholder="活动区域">
              <el-option label="订单支付时间" value="0"></el-option>
              <el-option label="申请退款时间" value="1"></el-option>
              <el-option label="完成退款时间" value="2"></el-option>
            </el-select>
            <el-date-picker
              v-model="times"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item class="marginL20">
          <el-button type="primary" size="medium">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-divider></el-divider>
    <div>
      <el-table :data="tableData" style="width: 100%" max-height="616">
        <el-table-column prop="outTradeNo" label="订单编号" align="center">
        </el-table-column>
        <el-table-column prop="uid" label="用户ID" align="center">
        </el-table-column>
        <el-table-column prop="regtypeStr" label="业务类型" align="center">
        </el-table-column>
        <el-table-column prop="tradeTypeStr" label="支付方式" align="center">
        </el-table-column>
        <el-table-column
          prop="transactionId"
          label="订单交易流水号"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="buytime"
          label="订单支付时间"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column prop="statusStr" label="退款状态" align="center">
        </el-table-column>
        <el-table-column prop="refundFee" label="退款金额" align="center">
        </el-table-column>
        <el-table-column
          prop="ctime"
          label="申请退款时间"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="refundTime"
          label="完成退款时间"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
              >退款审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    >
    </el-pagination>
  </section>
</template>

<script>
export default {
  mounted() {},
  data() {
    return {
      currentPage1: 1,
      currentPage2: 2,
      currentPage3: 3,
      currentPage4: 4,
      times: '',
      hh: {},
      t1: 'shanghai',
      t2: 'haha',
      tableData: [
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        },
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        },
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        },
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        },
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        },
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        },
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        },
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        },
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        },
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        },
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        },
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        },
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        },
        {
          outTradeNo: '201602',
          uid: '7897899',
          regtypeStr: '系统课',
          tradeTypeStr: '支付宝',
          transactionId: '22323234433',
          buytime: '2012/12/12 12:12:32',
          statusStr: '已退款',
          refundFee: '90',
          ctime: '2012/12/12 12:12:32',
          refundTime: '2012/12/12 12:12:32'
        }
      ]
    }
  },
  provide() {
    return { self: this }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    handleEdit() {
      console.info('index:', arguments[0])
      console.info('row:', arguments[1])
      console.info('column:', arguments[2])
    }
  },
  computed: {
    t3() {
      return this.data.t1 + 1
    }
  },
  render(h) {
    return h()
  },
  filters: {
    fnName: function(value) {
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
.bianju10 {
  margin: 0 10px;
  background-color: #fff;
}
.bom10 {
  padding: 20px;
}
.bom10 .el-form-item {
  vertical-align: middle;
}
.concat {
  display: flex;
}
.marginL20 {
  margin-left: 20px;
}
</style>
