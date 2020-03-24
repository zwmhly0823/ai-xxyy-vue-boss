<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 15:16:26
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-24 16:20:20
 -->
<template>
  <div class="order-box">
    <el-tabs type="border-card" @tab-click="handleClick">
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
export default {
  props: [],
  components: {
    allOrder
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {
    handleClick(tab, event) {
      console.log(tab.index, event)
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped></style>
