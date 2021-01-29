<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-05-30 17:21:58
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-03 13:01:11
-->
<template>
  <div class="app-main height">
    <!-- <div class="channel-box-top"> -->
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="系统标签" name="systemLabel">
        <system-labels />
      </el-tab-pane>
      <!-- <el-tab-pane label="自定义标签" name="customLabel"
        >自定义标签</el-tab-pane
      > -->
    </el-tabs>
    <!-- </div> -->
  </div>
</template>

<script>
import systemLabels from '../labelManage/components/systemLabels/index.vue'
export default {
  name: 'index',
  components: {
    systemLabels
  },
  data() {
    return {
      activeName: 'systemLabel'
    }
  },
  methods: {
    handleClick(tab, event) {}
  }
}
</script>

<style></style>
