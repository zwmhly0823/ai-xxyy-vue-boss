<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-19 20:50:40
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-21 16:25:21
 -->
<template>
  <div>
    <div class="tab-box">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        type="card"
        class="box-shadow-0"
      >
        <el-tab-pane label="学员" name="students">
          <studens-tab :classId="classId" />
        </el-tab-pane>
        <el-tab-pane label="带班详情" name="details">
          <details-tab :classId="classId" />
        </el-tab-pane>
        <el-tab-pane label="订单" name="order">
          <order-tab :classId="classId" />
        </el-tab-pane>

        <!-- <el-tab-pane label="微信群聊" name="groupChat">
        <groupchat-tab />
      </el-tab-pane>
      <el-tab-pane label="系统课订单" name="systemOrder">
        <systemorder-tab />
      </el-tab-pane> -->
      </el-tabs>
    </div>
    <div class="tab-box" v-show="suckTop">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        type="card"
        class="box-shadow"
      >
        <el-tab-pane label="学员" name="students"></el-tab-pane>
        <el-tab-pane label="带班详情" name="details"> </el-tab-pane>
        <el-tab-pane label="订单" name="order"> </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import StudensTab from './StudentsTab'
import DetailsTab from './DetailsTab'
import OrderTab from './OrderTab'
// import GroupchatTab from './GroupchatTab'
// import SystemorderTab from './SystemorderTab'
export default {
  props: {
    classId: {
      type: Object,
      default: null
    }
  },
  components: {
    StudensTab,
    DetailsTab,
    OrderTab
    // GroupchatTab,
    // SystemorderTab
  },
  data() {
    return {
      activeName: 'students',
      suckTop: false
    }
  },
  watch: {},
  created() {
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleClick(tab, event) {
      document
        .getElementById('right-scroll')
        .querySelector('.scrollbar-wrapper').scrollTop = 0
      console.log(tab, event)
    },
    handleScroll() {
      const dom = document
        .getElementById('right-scroll')
        .querySelector('.scrollbar-wrapper').scrollTop
      dom > 190 ? (this.suckTop = true) : (this.suckTop = false)
    }
  }
}
</script>
<style scoped lang="scss">
.box-shadow {
  width: 100%;
  position: absolute;
  border-bottom: 1px solid #ebeef5;
  top: -1px;
  z-index: 1000;
}
.tab-box {
  padding: 0;
  flex: 1;
}
</style>
<style lang="scss">
.tab-box {
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs--border-card > .el-tabs__content {
    padding: 0px;
  }
  .el-table_1_column_1 {
    .cell {
      margin-left: 15px;
    }
  }
  .el-table_1_column_4 {
    .cell {
      margin-right: 15px;
    }
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-tabs__nav-scroll {
    background: #f5f7fa;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    background: #fff;
    border: none;
  }
}
</style>
