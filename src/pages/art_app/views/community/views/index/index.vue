<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 12:04:12
 * @LastEditors: Shentong
 * @LastEditTime: 2020-06-29 18:27:44
-->
<template>
  <el-row type="flex" class="group-sop app-main">
    <el-col class="grop-container">
      <div class="scroll-container">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="header-tabs">
            <div
              v-for="(tab, index) in headerTabs"
              :key="index"
              :class="{ active: index == headerTabIndex }"
              @click="top_tabs_click(index, tab)"
            >
              {{ tab.title }}
            </div>
          </div>
          <component :is="currentTabComponent"></component>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import SopTmp from './components/SopTmp'
import PlanTask from './components/PlanTask'
export default {
  data() {
    return {
      headerTabIndex: 0,
      headerTabs: [
        {
          title: 'SOP模板'
        },
        {
          title: 'SOP任务'
        }
      ]
    }
  },
  components: {
    SopTmp,
    PlanTask
  },
  computed: {
    currentTabComponent: function() {
      return !this.headerTabIndex ? 'sop-tmp' : 'plan-task'
    }
  },
  methods: {
    selectChange() {},
    handleDebounce() {},
    /** 顶部tabs切换事件 */
    top_tabs_click(index, tab) {
      this.headerTabIndex = index
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.group-sop {
  .grop-container {
    position: relative;
    margin: 10px;
    background: #fff;
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
    .scroll-container {
      background: white;
      height: 100%;
      display: flex;
      flex-direction: column;
      .scrollbar-wrapper {
        overflow-x: hidden;
      }
      .el-scrollbar {
        flex: 1;
      }
      .header-tabs {
        height: 40px;
        background: #f5f7fa;
        display: flex;
        > div {
          height: 100%;
          padding: 0 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          &.active {
            background: #fff;
            color: #2a75ed;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
