<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 15:16:26
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-24 19:52:00
 -->
<template>
  <el-scrollbar wrap-class="order-wrapper" id="order-scroll">
    <div class="order-box">
      <m-search @search="handleSearch" hasaddress="hasaddress" />
      <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
        <el-tab-pane label="全部订单" name="allOrders">
          <all-order />
        </el-tab-pane>
        <el-tab-pane label="代支付" name="generationPay">
          <all-order />
        </el-tab-pane>
        <el-tab-pane label="已支付" name="havePay">已支付</el-tab-pane>
        <el-tab-pane label="已完成" name="hasCompleted">已完成</el-tab-pane>
        <el-tab-pane label="退费中" name="theRefund">退费中</el-tab-pane>
        <el-tab-pane label="已退费" name="haveRefund">已退费</el-tab-pane>
        <el-tab-pane label="已关闭" name="closed">已关闭</el-tab-pane>
      </el-tabs>
      <el-tabs
        v-show="suckTop"
        type="border-card"
        @tab-click="handleClick"
        v-model="activeName"
        class="tab-top"
      >
        <el-tab-pane label="全部订单" name="allOrders"></el-tab-pane>
        <el-tab-pane label="代支付" name="generationPay"></el-tab-pane>
        <el-tab-pane label="已支付" name="havePay"></el-tab-pane>
        <el-tab-pane label="已完成" name="hasCompleted"></el-tab-pane>
        <el-tab-pane label="退费中" name="theRefund"></el-tab-pane>
        <el-tab-pane label="已退费" name="haveRefund"></el-tab-pane>
        <el-tab-pane label="已关闭" name="closed"></el-tab-pane>
      </el-tabs>
    </div>
  </el-scrollbar>
</template>

<script>
import allOrder from './components/allOrder'
import MSearch from '@/components/MSearch/index.vue'
export default {
  props: [],
  components: {
    allOrder,
    MSearch
  },
  data() {
    return {
      activeName: 'allOrders',
      suckTop: false
    }
  },
  computed: {},
  watch: {},
  methods: {
    handleClick(tab, event) {
      document
        .getElementById('order-scroll')
        .querySelector('.order-wrapper').scrollTop = 0
      console.log(tab, event)
    },
    handleSearch(res) {
      console.log(res)
    },
    handleScroll() {
      const dom = document
        .getElementById('order-scroll')
        .querySelector('.order-wrapper').scrollTop
      dom > 100 ? (this.suckTop = true) : (this.suckTop = false)
    }
  },
  created() {
    window.addEventListener('scroll', this.handleScroll, true)
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
#order-scroll {
  height: calc(100vh - 60px);
  position: relative;
  .order-box {
    width: 100%;
    height: 100%;
    padding: 10px 10px 0 10px;
    .el-tabs--border-card > .el-tabs__content {
      padding: 15px 0 !important;
    }
    .tab-top {
      position: absolute;
      top: 0px;
      right: 10px;
      left: 10px;
      z-index: 1000;
    }
  }
}
</style>
<style lang="scss">
.order-box {
  .el-tabs--border-card > .el-tabs__content {
    padding: 15px 0 !important;
  }
  .el-tabs--border-card > .el-tabs__header {
    background: #f5f7fa;
  }
  .el-tabs--border-card > .el-tabs__content {
    padding: 0 !important;
  }
  // .el-tabs--border-card {
  //   box-shadow: none;
  // }
}
</style>
