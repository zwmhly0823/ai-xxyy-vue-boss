<!--
/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 10:08:48
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-13 08:46:00
 */
 -->
<template>
  <div class="container">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="语音库">
        <AudioLib />
      </el-tab-pane>
      <el-tab-pane label="作业点评">
        <div v-if="tabIndex === '1'">
          <WorkRiview />
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
    AudioLib: () => import('./components/audioLib'),
    WorkRiview: () => import('./components/workRiview')
  }
}
</script>

<style lang="scss" scoped></style>
