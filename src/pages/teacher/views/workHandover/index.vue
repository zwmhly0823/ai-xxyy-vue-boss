<!--
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-20 10:10:19
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-23 16:29:24
 -->
<template>
  <div>
    <el-tabs type="border-card" @tab-click="handleTab">
      <el-tab-pane label="班级交接">
        <div v-if="tabIndex === '0'">
          <Class :tabIndex="tabIndex" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="微信号交接">
        <div v-if="tabIndex === '1'">
          <Wechar :tabIndex="tabIndex" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="历史记录">
        <div v-if="tabIndex === '2'">
          <history :tabIndex="tabIndex" />
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="兼职老师离职交接">
        <div v-if="tabIndex === '3'">
          <partTeacher :tabIndex="tabIndex" />
        </div>
      </el-tab-pane> -->
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
    handleTab(tab, event) {
      this.tabIndex = tab.index
    }
  },
  components: {
    Wechar: () => import('./components/wecharHandover.vue'),
    Class: () => import('./components/classHandover.vue'),
    history: () => import('./components/history.vue')
  }
}
</script>

<style lang="scss" scoped></style>
