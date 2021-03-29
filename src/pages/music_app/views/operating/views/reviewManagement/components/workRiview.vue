<!--
/*
 * @Descripttion:
 * @version:
 * @Author: songyanan
 * @Date: 2020-05-11 10:48:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-29 14:11:35
 */
 -->
<template>
  <div class="container">
    <el-tabs type="border-card" @tab-click="handleClick">
        <el-tab-pane label="全部">
        <div v-if="tabIndex === '0'">
          <ToRiview />
        </div>
      </el-tab-pane>
      <el-tab-pane label="已审核待点评">
        <div v-if="tabIndex === '1'">
          <ToRiview />
        </div>
      </el-tab-pane>
      <el-tab-pane label="已审核已点评">
        <div v-if="tabIndex === '2'">
          <HaveRiview />
        </div>
      </el-tab-pane>
        <el-tab-pane label="审核未通过">
        <div v-if="tabIndex === '3'">
          <HaveRiview />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabIndex: '0'
    }
  },
  methods: {
    handleClick(tab, event) {
      this.tabIndex = tab.index
    }
  },
  components: {
    ToRiview: () => import('./toRiview'),
    HaveRiview: () => import('./haveRiview')
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: -10px;
  padding: 15px;
}
</style>
