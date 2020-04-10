<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-04-02 15:35:27
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-02 19:01:16
 -->
<template>
  <el-row type="flex" class="app-main height teacherContainer">
    <el-col class="teacherContainer-left">
      <div class="grid-content">
        <left-bar @change="leftBarHandler" />
      </div>
    </el-col>
    <el-col class="teacherContainer-right">
      <div class="grid-content">
        <el-scrollbar wrap-class="scrollbar-wrapper" id="right-scroll">
          <right-bar :department="currentDept" />
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import LeftBar from './components/leftBar.vue'
import RightBar from './components/rightBar.vue'

export default {
  props: [],
  components: { LeftBar, RightBar },
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
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
.teacherContainer {
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
    padding-bottom: 45px;
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
