<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 15:16:26
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-24 19:52:00
 -->
<template>
  <div class="order-box">
    <m-search @search="handleSearch" hasaddress="hasaddress" />
    <el-tabs type="border-card" @tab-click="handleClick" class="tab-box">
      <el-tab-pane label="全部订单">
        <all-order />
      </el-tab-pane>
      <el-tab-pane label="代支付">代支付</el-tab-pane>
      <el-tab-pane label="已支付">已支付</el-tab-pane>
      <el-tab-pane label="已完成">已完成</el-tab-pane>
      <el-tab-pane label="退费中">退费中</el-tab-pane>
      <el-tab-pane label="已退费">已退费</el-tab-pane>
      <el-tab-pane label="已关闭">已关闭</el-tab-pane>
    </el-tabs>
  </div>
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
    return {}
  },
  computed: {},
  watch: {},
  methods: {
    handleClick(tab, event) {
      console.log(tab.index, event)
    },
    handleSearch(res) {
      console.log(res)
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
.order-box {
  // width: 100%;
  height: 100%;
  padding: 10px 10px 0 10px;
  .el-tabs--border-card > .el-tabs__content {
    padding: 15px 0 !important;
  }
}
</style>
<style lang="scss">
.order-box {
  .el-tabs--border-card > .el-tabs__content {
    padding: 15px 0 !important;
  }
}
</style>
