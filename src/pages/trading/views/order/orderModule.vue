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
      <!-- <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
        <el-tab-pane label="已完成" name="3"></el-tab-pane>
        <el-tab-pane label="待支付" name="0,1"> </el-tab-pane>
        <el-tab-pane label="退费中" name="5"></el-tab-pane>
        <el-tab-pane label="已退费" name="6,7"></el-tab-pane>
        <all-order :status="status" :search="search" />
      </el-tabs> -->
      <!-- tab - regtype -->
      <el-tabs
        type="border-card"
        @tab-click="handleClick"
        v-model="activeTopic"
      >
        <!-- 包含全部体验课订单数据（双周体验课、单周体验课） -->
        <el-tab-pane label="体验课" name="4"></el-tab-pane>
        <!-- 包含全部系统课订单数据（月系统课、季系统课、半年系统课、年系统课） -->
        <el-tab-pane label="系统课" name="5"></el-tab-pane>
        <!-- 包含小熊商城-1、邀请有奖-6、推荐有礼-2 -->
        <el-tab-pane label="活动订单" name="1,2,6"></el-tab-pane>

        <!-- 统计模块 + 列表 -->
        <all-order :topic="activeTopic" :search="search" />
      </el-tabs>

      <!-- 浮动层 -->
      <el-tabs
        type="border-card"
        @tab-click="handleClick"
        v-model="activeTopic"
        class="tab-top"
        v-show="suckTop"
      >
        <el-tab-pane label="体验课" name="4"></el-tab-pane>
        <el-tab-pane label="系统课" name="5"> </el-tab-pane>
        <el-tab-pane label="活动订单" name="1,2,6"></el-tab-pane>

        <el-table style="font-size:12px;" v-show="orderForm">
          <el-table-column label="用户信息" prop="user"></el-table-column>
          <el-table-column label="商品信息"></el-table-column>
          <el-table-column label="订单来源"></el-table-column>
          <el-table-column label="订单状态"> </el-table-column>
          <el-table-column label="班级信息"> </el-table-column>
          <el-table-column label="社群销售"> </el-table-column>
          <el-table-column label="销售组"> </el-table-column>
          <el-table-column label="下单时间"> </el-table-column>
          <el-table-column label="关联物流"> </el-table-column>
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
      activeTopic: '4',
      // 吸顶tab显示
      suckTop: false,
      // 吸顶表格显示
      orderForm: false,
      // 切换tab
      // tab: '4',
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
      this.activeTopic = tab.name
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
