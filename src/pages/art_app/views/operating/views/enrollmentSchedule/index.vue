<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-04-02 15:35:27
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-24 18:25:35
 -->
<template>
  <el-row type="flex" class="app-main height schedule-container">
    <el-col class="schedule-container-right">
      <div class="grid-content">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <schedule-table :department="currentDept" />
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import ScheduleTable from './components/index.vue'

export default {
  props: [],
  components: { ScheduleTable },
  data() {
    return {
      // 当前选择的机构
      currentDept: {}
    }
  },
  computed: {},
  watch: {},
  methods: {
    leftBarHandler(data) {
      this.currentDept = data
    }
  }
}
</script>
<style lang="scss" scoped>
.schedule-container {
  &-left {
    padding-left: 0px;
    width: 220px;
    min-width: 220px;
    border-right: 1px solid #e3e3e3;
  }
  &-right {
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
  }
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.right {
      padding: 0;
    }
  }
}
</style>
<style lang="scss">
.grid-content .scrollbar-wrapper {
  overflow-x: hidden;
}
.grid-content .el-scrollbar {
  flex: 1;
}
</style>
