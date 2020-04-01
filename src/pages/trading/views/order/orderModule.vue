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
        v-show="suckTop"
        type="border-card"
        @tab-click="handleClick"
        v-model="activeName"
        class="tab-top"
      >
        <!-- <el-tab-pane label="全部订单" name=""> </el-tab-pane> -->
        <el-tab-pane label="已完成" name="3"></el-tab-pane>
        <el-tab-pane label="待支付" name="0,1"> </el-tab-pane>
        <!-- <el-tab-pane label="已支付" name="2"></el-tab-pane> -->

        <el-tab-pane label="退费中" name="5"></el-tab-pane>
        <el-tab-pane label="已退费" name="6,7"></el-tab-pane>
        <!-- <el-tab-pane label="已关闭" name="8"></el-tab-pane> -->
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
      console.log(res, 'res')

      this.search = res
      console.log(res, 'resdkdkskldldskdskldskldskl')
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
}
.el-popper {
  z-index: 2000 !important;
}
// .el-picker-panel {
//   top: 50px !important;
//   left: 50px !important;
// }
</style>
