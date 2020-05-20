<!--
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-20 10:10:19
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-20 10:15:50
 -->
<template>
  <div>
    <el-tabs type="border-card" @tab-click="handleTab">
      <el-tab-pane label="微信号交接">
        <div v-if="tabIndex === '0'">
          <Wechar />
        </div>
      </el-tab-pane>
      <el-tab-pane label="班级交接">
        <div v-if="tabIndex === '1'">
          <Class />
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
    handleTab(tab, event) {
      this.tabIndex = tab.index
    }
  },
  components: {
    Wechar: () => import('./components/wecharHandover.vue'),
    Class: () => import('./components/classHandover.vue')
  }
}
</script>

<style lang="scss" scoped></style>
