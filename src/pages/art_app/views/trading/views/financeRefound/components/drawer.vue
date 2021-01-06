<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-10 14:49:13
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-10-24 01:16:42
-->
<template>
  <div class="drawer-main">
    <div class="drawer-con">
      <div class="drawer-line">
        <p class="line-title">退款支付详情</p>
        <el-table
          :data="payDel"
          style="width: 95%;border: 1px solid #d7d7e0;"
          :header-cell-style="{ background: '#F0F9FD' }"
        >
          <el-table-column prop="status" label="退款支付状态">
            <template slot-scope="scope">
              <span
                :style="
                  scope.row.status === 2
                    ? styleObject[0]
                    : scope.row.status === 3
                    ? styleObject[1]
                    : styleObject[2]
                "
                >{{ scope.row.statusStr }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="支付状态描述">
          </el-table-column>
          <el-table-column prop="ctime" label="退款支付时间">
            <template slot-scope="scope">
              {{ dayjs(+scope.row.ctime) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="drawer-line">
        <p class="line-title">退款订单明细</p>
        <p class="line-delf">
          <span>用户信息:{{ dataShow(orderData.userName) }}</span>
          <span>订单号:{{ dataShow(orderData.outTradeNo) }}</span>
          <span>订单交易流水号:{{ dataShow(orderData.transactionId) }}</span>
          <span>退款订单状态:{{ dataShow(orderData.statusStr) }}</span>
        </p>
        <el-table
          :data="orderDel"
          style="width: 95%;border: 1px solid #d7d7e0;"
          :header-cell-style="{ background: '#F0F9FD' }"
        >
          <el-table-column prop="regTypeDesc" width="100" label="订单业务类型">
          </el-table-column>
          <el-table-column prop="title" width="100" label="订单商品信息">
          </el-table-column>
          <el-table-column prop="totalAmount" label="订单金额">
          </el-table-column>
          <el-table-column prop="discountAmount" label="优惠金额">
          </el-table-column>
          <el-table-column prop="tradeTypeDesc" label="支付方式">
          </el-table-column>
          <el-table-column prop="amount" label="实付金额"> </el-table-column>
          <el-table-column prop="periodAlready" label="已上周期">
          </el-table-column>
          <el-table-column prop="periodRefund" label="退费周期">
          </el-table-column>
          <el-table-column prop="periodResidue" label="剩余周期">
            <template slot-scope="scope">
              {{ scope.row.periodResidue - scope.row.periodRefund }}
            </template>
          </el-table-column>
          <el-table-column prop="refundTypeDesc" label="退款类型">
          </el-table-column>
          <el-table-column prop="refundFee" width="100" label="订单退款金额">
          </el-table-column>
          <el-table-column
            prop="remainingAmount"
            width="100"
            label="订单剩余金额"
          >
          </el-table-column>
        </el-table>
        <p class="line-delf">
          <span>开票状态:{{ invoiceStatus[+orderData.invoiceStatus] }}</span>
          <span>开票类型:{{ invoiceTypes[+orderData.invoiceType] }}</span>
          <span>发票号码:{{ dataShow(orderData.invoiceCode) }}</span>
          <span v-show="orderData.tradeTypeDesc === '支付宝'"
            >支付宝信息:{{ dataShow(orderData.payeeAccount) }}</span
          >
          <span>附加扣费说明:{{ payShow(orderData.deductInfo) }}</span>
        </p>
      </div>
      <div class="drawer-line">
        <p class="line-title">订单生命周期</p>
        <p style="width: 95%;height:110px; border: 1px solid #d7d7e0;">
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
              v-show="orderData.refundTime && orderData.refundTime !== '0'"
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
          style="width: 95%;border: 1px solid #d7d7e0;"
          :header-cell-style="{ background: '#F0F9FD' }"
        >
          <el-table-column prop="approvalName" label="发起人/审批人">
          </el-table-column>
          <el-table-column prop="statusStr" label="审批意见"> </el-table-column>
          <el-table-column prop="utime" label="操作时间">
            <template slot-scope="scope">
              {{ dayjs(+scope.row.utime) }}
            </template>
          </el-table-column>
          <el-table-column prop="approvalRemark" label="备注说明">
          </el-table-column>
        </el-table>
      </div>
      <div class="rawer-bot">
        <el-button
          type="primary"
          v-show="+roleId === 4 && ![5].includes(orderData.status)"
          @click="comfirmRefund"
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
      invoiceStatus: ['待开票', '开票中', '已开票', '开票失败', '作废'],
      invoiceTypes: ['无', '普通发票', '专票'],
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
      styleObject: [
        { color: '#49BF7C' },
        { color: '#FF0505' },
        { color: '#6E6E6E' }
      ],
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
    //
    payShow(val) {
      if (!val) {
        return '--'
      }
      switch (val) {
        case '0,0':
          return '无'

        case '0,1':
          return '随材扣费100'

        case '1,0':
          return '赠品扣费100'

        case '1,1':
          return '随材扣费100，赠品扣费100'

        default:
          return '--'
      }
    },
    // 数据展示处理 DEFAULT '' 都展示为--
    dataShow(data) {
      if (!data || ['DEFAULT'].includes(data)) {
        return '--'
      } else {
        return data
      }
    },
    // 时间处理
    dayjs(date) {
      return Dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    async comfirmRefund() {
      this.$confirm(`请再次确认发起退款`, '确认退款', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.Finance.toAgree({
            refundUid: JSON.parse(localStorage.getItem('staff')).id,
            paymentId: this.orderData.paymentId
            // 默认不传就是1 审核通过
          })
            .then((res) => {
              if (res.code === 0) {
                this.$message({
                  message: '退款发起成功',
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
            })
            .catch((err) => {
              this.$message({
                message: '通过操作失败,稍后再试',
                type: 'error'
              })
              return err
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退款'
          })
          this.toggleSelection()
        })
    }
    // closeFeed() {
    //   localStorage.setItem('feedFlag', true)
    //   this.feedShow = false
    // }
  }
}
</script>

<style lang="scss" scoped>
.drawer-main {
  max-height: 80vh;
  overflow: auto;
}
.drawer-line {
  margin-left: 10px;
  .line-title {
    font-size: 16px;
    font-weight: bold;
    margin: 6px 0 10px;
  }
  .line-delf {
    width: 95%;
    margin: 10px 0;
    font-size: 12px;
    color: #6e6e6e;
    display: flex;
    justify-content: space-around;
  }
}
.rawer-bot {
  margin: 20px 0;
  text-align: center;
}
</style>
