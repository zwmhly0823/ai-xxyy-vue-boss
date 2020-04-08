<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 15:16:26
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-28 19:34:29
 -->
<template>
  <el-scrollbar wrap-class="order-wrapper" id="order-scroll">
    <!-- topicType="topic_id" -->
    <div class="order-box">
      <m-search
        @search="handleSearch"
        channel="pay_channel"
        stage="stage"
        sup="sup"
        date="ctime"
        date-placeholder="下单时间"
        phone="uid"
        topic-type="topic_id"
        outTradeNo="out_trade_no"
      />
      <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
        <!-- <el-tab-pane label="全部订单" name=""> </el-tab-pane> -->
        <el-tab-pane label="已完成" name="3"></el-tab-pane>
        <el-tab-pane label="待支付" name="0,1"> </el-tab-pane>
        <!-- <el-tab-pane label="已支付" name="2"></el-tab-pane> -->
        <el-tab-pane label="退费中" name="5"></el-tab-pane>
        <el-tab-pane label="已退费" name="6,7"></el-tab-pane>
        <!-- <el-tab-pane label="已关闭" name="8"></el-tab-pane> -->
        <all-order :status="status" :search="search" />
      </el-tabs>
      <el-tabs
        type="border-card"
        @tab-click="handleClick"
        v-model="activeName"
        class="tab-top"
        v-show="suckTop"
      >
        <!-- <el-tab-pane label="全部订单" name=""> </el-tab-pane> -->
        <el-tab-pane label="已完成" name="3"></el-tab-pane>
        <el-tab-pane label="待支付" name="0,1"> </el-tab-pane>
        <!-- <el-tab-pane label="已支付" name="2"></el-tab-pane> -->

        <el-tab-pane label="退费中" name="5"></el-tab-pane>
        <el-tab-pane label="已退费" name="6,7"></el-tab-pane>
        <!-- <el-tab-pane label="已关闭" name="8"></el-tab-pane> -->

        <el-table style="font-size:12px;" v-show="orderForm">
          <el-table-column
            label="用户信息"
            label-class-name="top-style1"
          ></el-table-column>
          <el-table-column
            label="商品信息"
            label-class-name="top-style2"
          ></el-table-column>
          <el-table-column
            label="订单来源"
            label-class-name="top-style3"
          ></el-table-column>
          <el-table-column label="订单状态" label-class-name="top-style4">
          </el-table-column>
          <el-table-column label="关联物流" label-class-name="top-style5">
          </el-table-column>
        </el-table>
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
      // 默认显示tab
      activeName: '3',
      // 吸顶tab显示
      suckTop: false,
      // 吸顶表格显示
      orderForm: false,
      // 切换tab
      status: '3',
      // 搜索
      search: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 点击tab
    handleClick(tab, event) {
      document
        .getElementById('order-scroll')
        .querySelector('.order-wrapper').scrollTop = 0
      this.status = tab.name
    },
    // 点击搜索
    handleSearch(res) {
      this.search = res
    },
    // 吸顶
    handleScroll() {
      const dom = document
        .getElementById('order-scroll')
        .querySelector('.order-wrapper').scrollTop
      const domheight = document
        .getElementById('order-scroll')
        .querySelector('.el-card__body').offsetHeight
      const formheight = document
        .getElementById('order-scroll')
        .querySelector('.title-box').offsetHeight
      console.log(formheight, 'formheight')
      dom > domheight + 20 ? (this.suckTop = true) : (this.suckTop = false)
      dom > domheight + 175 ? (this.orderForm = true) : (this.orderForm = false)
    }
  },
  created() {
    // 吸顶
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
      z-index: 1001;
    }
    .el-table__header-wrapper {
      padding: 0px 10px 0px 10px !important;
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
  .el-table__empty-block {
    display: none;
  }
  .call {
    font-size: 12px;
  }
}
.el-popper {
  z-index: 2000 !important;
}
.top-style1 {
  padding-left: 10px !important;
}
.top-style2 {
  padding-left: 8px !important;
}
.top-style3 {
  padding-left: 6px !important;
}
.top-style4 {
  padding-left: 4px !important;
}
.top-style5 {
  padding-left: 2px !important;
}
</style>
