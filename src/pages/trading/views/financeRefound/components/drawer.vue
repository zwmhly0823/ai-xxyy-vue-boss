<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-10 14:49:13
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-10-19 18:07:53
-->
<template>
  <div class="drawer-main">
    <div class="drawer-con">
      <div class="drawer-line">
        <p class="line-title">退款支付详情</p>
        <el-table
          :data="payDel"
          style="width: 90%;border: 1px solid #d7d7e0;"
          :header-cell-style="{ background: '#F0F9FD' }"
        >
          <el-table-column prop="status" label="选择支付状态">
            <template slot-scope="scope">
              <span
                :style="
                  scope.row.status === 5
                    ? styleObject[0]
                    : scope.row.status === 9
                    ? styleObject[1]
                    : ''
                "
                >{{ payType[scope.row.status - 1] }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="支付状态描述">
          </el-table-column>
          <el-table-column prop="ctime" label="退款支付时间">
            <template slot-scope="scope">
              {{ dayjs(scope.row.ctime) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="drawer-line">
        <p class="line-title">退款订单明细</p>
        <p class="line-delf">
          <span>用户信息:{{ orderData.userName }}</span>
          <span>订单号:{{ orderData.orderId }}</span>
          <span>订单交易流水号:{{ orderData.outTradeNo }}</span>
          <span>退款订单状态:{{ orderData.status }}</span>
        </p>
        <el-table
          :data="orderDel"
          style="width: 90%;border: 1px solid #d7d7e0;"
          :header-cell-style="{ background: '#F0F9FD' }"
        >
          <el-table-column prop="regTypeDesc" label="订单业务类型">
          </el-table-column>
          <el-table-column prop="title" label="订单商品信息"> </el-table-column>
          <el-table-column prop="totalFee" label="订单金额"> </el-table-column>
          <el-table-column prop="address" label="优惠金额"> </el-table-column>
          <el-table-column prop="tradeTypeDesc" label="支付方式">
          </el-table-column>
          <el-table-column prop="address" label="实付金额"> </el-table-column>
          <el-table-column prop="periodAlready" label="已上周期">
          </el-table-column>
          <el-table-column prop="periodRefund" label="退费周期">
          </el-table-column>
          <el-table-column prop="periodResidue" label="剩余周期">
          </el-table-column>
          <el-table-column prop="refundTypeDesc" label="退款类型">
          </el-table-column>
          <el-table-column prop="refundFee" label="订单退款金额">
          </el-table-column>
          <el-table-column prop="remainingAmount" label="订单剩余金额">
          </el-table-column>
        </el-table>
        <p class="line-delf">
          <span>开票状态:{{ orderData.invoiceStatus }}</span>
          <span>开票类型:{{ orderData.invoiceType }}</span>
          <span>发票号码:{{ orderData.invoiceCode }}</span>
          <span>支付宝信息:{{ orderData.payeeAccount }}</span>
          <span>附加扣费说明:{{ orderData.status }}</span>
        </p>
      </div>
      <div class="drawer-line">
        <p class="line-title">订单生命周期</p>
        <p style="width: 90%;height:100px; border: 1px solid #d7d7e0;">
          <el-steps style="padding-top:10px" :active="6" align-center>
            <!-- <el-step
              v-for="item in list"
              :key="item.title"
              :title="item.title"
              :description="item.word"
            ></el-step> -->
            <el-step
              title="订单创建时间"
              :description="dayjs(+orderData.payCtime)"
            ></el-step>
            <el-step
              title="订单支付时间"
              :description="dayjs(+orderData.buyTime)"
            ></el-step>
            <el-step
              title="申请退款时间"
              :description="dayjs(+orderData.applyTime)"
            ></el-step>
            <el-step
              title="申请通过时间"
              :description="dayjs(+orderData.refundCtime)"
            ></el-step>
            <el-step
              v-show="orderData.refundTime"
              title="完成退款时间"
              :description="dayjs(+orderData.refundTime)"
            ></el-step>
          </el-steps>
        </p>
      </div>
      <div class="drawer-line">
        <p class="line-title">审批过程记录</p>
        <el-table
          :data="approveArr"
          style="width: 90%;border: 1px solid #d7d7e0;"
          :header-cell-style="{ background: '#F0F9FD' }"
        >
          <el-table-column prop="approvalName" label="发起人/审批人">
          </el-table-column>
          <el-table-column prop="statusStr" label="审批意见"> </el-table-column>
          <el-table-column prop="utime" label="操作时间">
            <template slot-scope="scope">
              {{ dayjs(scope.row.utime) }}
            </template>
          </el-table-column>
          <el-table-column prop="approvalRemark" label="备注说明">
          </el-table-column>
        </el-table>
      </div>
      <div class="rawer-bot">
        <el-button type="primary" v-show="+roleId === 7" @click="comfirmRefund"
          >发起退款支付</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Dayjs from 'dayjs'
// const payType = [
//   '--',
//   '--',
//   '申请退款',
//   '退款中',
//   '退款成功',
//   '退款取消',
//   '退款财务驳回',
//   '退款异常',
//   '失败'
// ]
export default {
  props: {
    orderData: {
      type: Object,
      default: () => ({})
    },
    approveData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      roleId: JSON.parse(localStorage.getItem('staff')).roleId || '',
      payData: [],
      payType: [
        '--',
        '--',
        '申请退款',
        '退款中',
        '退款成功',
        '退款取消',
        '退款财务驳回',
        '退款异常',
        '失败'
      ],
      styleObject: [{ color: 'green' }, { color: 'red' }],
      list: [
        { title: '订单创建时间', word: 111 },
        { title: '订单支付时间', word: 222 },
        { title: '申请退款时间', word: 222 }
      ]
    }
  },
  computed: {
    approveArr() {
      const arr = []
      console.log(this.approveData)
      this.approveData.payload.map((item) => {
        arr.push(item[0])
      })
      console.log(arr)
      return arr
    },
    payDel() {
      return this.orderData.refundLogs
    },
    orderDel() {
      return [this.orderData]
    }
    // stepArr(){

    // }
  },
  watch: {},
  created() {},
  mounted() {
    console.log('参数', this.orderData)
  },
  methods: {
    // 时间处理
    dayjs(date) {
      return Dayjs(date).format('YYYY-MM-DD hh:mm')
    },
    async comfirmRefund() {
      const { code } = await this.$http.Finance.toAgree({
        refundUid: JSON.parse(localStorage.getItem('staff')).id,
        paymentId: this.orderData.paymentId
        // 默认不传就是1 审核通过
      }).catch((err) => {
        console.error(err)
        this.$message({
          message: '通过操作失败,稍后再试',
          type: 'error'
        })
        return -1
      })
      if (code === 0) {
        this.$message({
          message: '退款成功',
          type: 'success'
        })
        this.$emit('closeDrawer')
        // 跳回列表并刷新
        // this.$refs.drawerLk.closeDrawer() // 关闭抽屉
        // this.arrangeParams() // 刷新列表数据
      } else {
        this.$message({
          message: '通过操作失败,稍后再试',
          type: 'warning'
        })
      }
    }
    // closeFeed() {
    //   localStorage.setItem('feedFlag', true)
    //   this.feedShow = false
    // }
  }
}
</script>

<style lang="scss" scoped>
.drawer-line {
  margin-left: 10px;
  .line-title {
    font-size: 16px;
    font-weight: bold;
    margin: 10px;
  }
  .line-delf {
    width: 90%;
    margin: 10px 0;
    font-size: 12px;
    display: flex;
    justify-content: space-around;
  }
}
.rawer-bot {
  margin: 20px 0;
  text-align: center;
}
</style>
