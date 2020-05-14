<!--
/*
 * @Descripttion:
 * @version:
 * @Author: songyanan
 * @Date: 2020-05-11 10:48:18
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-11 10:48:50
 */
 -->
<template>
  <div class="container">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="待点评">
        <ToRiview />
      </el-tab-pane>
      <el-tab-pane label="已点评">
        <div v-if="tabIndex === '1'">
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

<style lang="scss" scoped></style>
