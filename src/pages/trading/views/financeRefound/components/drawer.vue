<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-10 14:49:13
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-10-13 21:17:56
-->
<template>
  <div class="drawer-main" v-show="feedShow">
    <div class="drawer-con">
      <div class="drawer-line">
        <p class="line-title">退款支付详情</p>
        <el-table :data="payData" style="width: 90%">
          <el-table-column prop="date" label="选择支付状态" width="180">
          </el-table-column>
          <el-table-column prop="name" label="支付状态描述" width="180">
          </el-table-column>
          <el-table-column prop="address" label="退款支付时间">
          </el-table-column>
        </el-table>
      </div>
      <div class="drawer-line">
        <p class="line-title">退款订单明细</p>
        <p class="line-delf">
          <span>用户信息:小雨</span>
          <span>订单号:小雨</span>
          <span>订单交易流水号:小雨</span>
          <span>退款订单状态:小雨</span>
        </p>
        <el-table :data="payData" style="width: 90%">
          <el-table-column prop="date" label="订单业务类型" width="180">
          </el-table-column>
          <el-table-column prop="name" label="订单商品信息" width="180">
          </el-table-column>
          <el-table-column prop="address" label="订单金额"> </el-table-column>
          <el-table-column prop="address" label="优惠金额"> </el-table-column>
          <el-table-column prop="address" label="支付方式"> </el-table-column>
          <el-table-column prop="address" label="实付金额"> </el-table-column>
          <el-table-column prop="address" label="已上周期"> </el-table-column>
          <el-table-column prop="address" label="退费周期"> </el-table-column>
          <el-table-column prop="address" label="剩余周期"> </el-table-column>
          <el-table-column prop="address" label="退款类型"> </el-table-column>
          <el-table-column prop="address" label="订单退款金额">
          </el-table-column>
          <el-table-column prop="address" label="订单剩余金额">
          </el-table-column>
        </el-table>
        <p class="line-delf">
          <span>开票状态:小雨</span>
          <span>开票类型:小雨</span>
          <span>发票号码:小雨</span>
          <span>支付宝信息:小雨</span>
          <span>附加扣费说明:小雨</span>
          <span class="downPay">下载支付回单</span>
        </p>
      </div>
      <div class="drawer-line">
        <p class="line-title">订单生命周期</p>
        <el-table :data="payData" style="width: 90%">
          <el-table-column prop="date" label="选择支付状态" width="180">
          </el-table-column>
          <el-table-column prop="name" label="支付状态描述" width="180">
          </el-table-column>
          <el-table-column prop="address" label="退款支付时间">
          </el-table-column>
        </el-table>
      </div>
      <div class="drawer-line">
        <p class="line-title">审批过程记录</p>
        <el-table :data="payData" style="width: 90%">
          <el-table-column prop="date" label="发起人/审批人" width="180">
          </el-table-column>
          <el-table-column prop="name" label="审批意见" width="180">
          </el-table-column>
          <el-table-column prop="address" label="操作时间"> </el-table-column>
          <el-table-column prop="address" label="备注说明"> </el-table-column>
        </el-table>
      </div>
      <el-button type="primary" @click="comfirmRefund">确认退款</el-button>
      <!-- <el-row v-if="choutidata.buytime !== ''">
        <el-col :span="4">订单支付时间:</el-col>
        <el-col :span="18" :offset="2"
          >{{ new Date(Number(choutidata.buytime)).toLocaleString() }}
        </el-col>
      </el-row>
      <el-row v-if="choutidata.outTradeNo !== ''">
        <el-col :span="4">订单号:</el-col>
        <el-col :span="18" :offset="2"
          >{{
            choutidata.outTradeNo &&
              choutidata.outTradeNo.replace(/[a-z]*/g, '')
          }}<span
            style="color:red"
            v-if="Number(choutidata.importTime) > 0 && choutidata.importTime"
            >(此为第三方导入订单)</span
          >
        </el-col>
      </el-row>
      <el-row v-if="choutidata.channelOuterName !== ''">
        <el-col :span="4">第三方订单来源:</el-col>
        <el-col :span="18" :offset="2"
          >{{ choutidata.channelOuterName }}
        </el-col>
      </el-row>
      <el-row v-if="choutidata.regtypeStr !== ''">
        <el-col :span="4">业务类型:</el-col>
        <el-col :span="18" :offset="2">{{ choutidata.regtypeStr }} </el-col>
      </el-row>
      <el-row v-if="choutidata.tradeTypeStr !== ''">
        <el-col :span="4">支付渠道:</el-col>
        <el-col :span="18" :offset="2">{{ choutidata.tradeTypeStr }} </el-col>
      </el-row>
      <el-row v-if="choutidata.transactionId !== ''">
        <el-col :span="4">支付流水号:</el-col>
        <el-col :span="18" :offset="2">{{ choutidata.transactionId }} </el-col>
      </el-row>
      <el-row v-if="choutidata.payeeName !== ''">
        <el-col :span="4">收款人姓名:</el-col>
        <el-col :span="18" :offset="2">{{ choutidata.payeeName }} </el-col>
      </el-row>
      <el-row v-if="choutidata.payeeAccount !== ''">
        <el-col :span="4">支付宝账号:</el-col>
        <el-col :span="18" :offset="2">{{ choutidata.payeeAccount }} </el-col>
      </el-row>
      <el-row v-if="choutidata.periodAlready !== ''">
        <el-col :span="4">已上课周期:</el-col>
        <el-col :span="18" :offset="2">{{ choutidata.periodAlready }} </el-col>
      </el-row>
      <el-row v-if="choutidata.periodRefund !== ''">
        <el-col :span="4">退款月数:</el-col>
        <el-col :span="18" :offset="2"
          >{{ Math.floor(choutidata.periodRefund / 4) + '个月' }}
        </el-col>
      </el-row>
      <el-row v-if="choutidata.refundFee !== ''">
        <el-col :span="4">退款金额:</el-col>
        <el-col :span="18" :offset="2">{{ choutidata.refundFee }} </el-col>
      </el-row>
      <el-row v-if="choutidata.amount !== ''">
        <el-col :span="4">交易金额:</el-col>
        <el-col :span="18" :offset="2">{{ choutidata.amount }} </el-col>
      </el-row>
      <el-row v-if="choutidata.refundTypeStr !== ''">
        <el-col :span="4">退款类型:</el-col>
        <el-col :span="18" :offset="2">{{ choutidata.refundTypeStr }} </el-col>
      </el-row>
      <el-row v-if="choutidata.refundRuleStr !== ''">
        <el-col :span="4">退款规则:</el-col>
        <el-col :span="18" :offset="2">{{ choutidata.refundRuleStr }} </el-col>
      </el-row>
      <el-row v-if="choutidata.invoiceStatus !== ''">
        <el-col :span="4">开票状态:</el-col>
        <el-col :span="18" :offset="2"
          ><span v-if="choutidata.invoiceStatus == 'DEFAULT'">待开票</span>
          <span v-else-if="choutidata.invoiceStatus == 'PENDING'">开票中</span>
          <span v-else-if="choutidata.invoiceStatus == 'COMPLETED'"
            >已开票</span
          >
          <span v-else-if="choutidata.invoiceStatus == 'FAILED'">开票失败</span>
          <span v-else>作废</span>
        </el-col>
      </el-row>
      <el-row v-if="choutidata.invoiceType !== ''">
        <el-col :span="4">发票类型:</el-col>
        <el-col :span="18" :offset="2"
          ><span v-if="choutidata.invoiceType == 'DEFAULT'">无</span>
          <span v-else-if="choutidata.invoiceType == 'GENERAL'">普通发票</span>
          <span v-else>专票</span>
        </el-col>
      </el-row>
      <el-row v-if="choutidata.invoiceCode !== ''">
        <el-col :span="4">发票号码:</el-col>
        <el-col :span="18" :offset="2">{{ choutidata.invoiceCode }} </el-col>
      </el-row>
      <el-row v-if="choutidata.refundReason !== ''">
        <el-col :span="4">退款原因:</el-col>
        <el-col :span="18" :offset="2">{{ choutidata.refundReason }} </el-col>
      </el-row>
      <el-row v-if="choutidata.refundMsg !== ''">
        <el-col :span="4">退款说明:</el-col>
        <el-col :span="18" :offset="2">{{ choutidata.refundMsg }} </el-col>
      </el-row>
      <el-row v-if="choutidata.attsUrl !== ''">
        <el-col :span="4">附件:</el-col>
        <el-col :span="18" :offset="2">
          <el-image
            style="width: 200px"
            :src="choutidata.attsUrl"
            fit="contain"
            :preview-src-list="[choutidata.attsUrl]"
          ></el-image>
        </el-col>
      </el-row>
      <el-row class="buttonBetween" v-if="statusStr === '退款中'">
        <el-button
          v-if="choutidata.payeeAccount !== ''"
          type="warning"
          @click="rejectRefund"
          >退款驳回</el-button
        >
        <el-button type="primary" @click="comfirmRefund">确认退款</el-button>
      </el-row>
      <el-row class="buttonCenter" v-else-if="statusStr === '退款成功'">
        <el-button type="success" :disabled="true">已经退款</el-button>
      </el-row>
      <el-row class="buttonCenter" v-else-if="statusStr === '退款驳回'">
        <el-button type="danger" :disabled="true">已驳回</el-button>
      </el-row>-->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderData: {
      type: Object,
      default: () => ({})
    },
    singleData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      feedShow: !localStorage.getItem('feedFlag')
    }
  },
  watch: {},
  created() {},
  methods: {
    closeFeed() {
      localStorage.setItem('feedFlag', true)
      this.feedShow = false
    }
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
    margin-top: 10px;
    font-size: 12px;
    display: flex;
    justify-content: space-around;
  }
}
</style>
