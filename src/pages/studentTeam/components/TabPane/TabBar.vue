<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-19 20:50:40
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-20 18:56:00
 -->
<template>
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
      <!-- <el-tab-pane label="微信群聊" name="groupChat">
        <groupchat-tab />
      </el-tab-pane>
      <el-tab-pane label="系统课订单" name="systemOrder">
        <systemorder-tab />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import StudensTab from './StudentsTab'
import DetailsTab from './DetailsTab'
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
    DetailsTab
    // GroupchatTab,
    // SystemorderTab
  },
  data() {
    return {
      activeName: 'students'
    }
  },
  watch: {},
  created() {
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleScroll() {
      const dom = document
        .getElementById('right-scroll')
        .querySelector('.scrollbar-wrapper').scrollTop
      if (dom > 190) {
        document
          .getElementById('right-scroll')
          .querySelector('.scrollbar-wrapper')
          .scrollTo(0, 190)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.tab-box {
  padding: 0;
  flex: 1;
}
</style>
<style lang="scss">
.tab-box {
  // .el-table__header {
  //   border-bottom: 1px solid #e6e6e6;
  // }
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
