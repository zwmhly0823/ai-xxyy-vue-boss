<!--
 * @Descripttion:订单
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 15:16:26
 * @LastEditors: liukun
 * @LastEditTime: 2020-04-29 15:15:35
 -->
<template>
  <el-scrollbar wrap-class="order-wrapper" id="order-scroll">
    <!-- topicType="topic_id" -->
    <div class="order-box">
      <el-tabs
        type="border-card"
        @tab-click="handleClick"
        v-model="activeTopic"
      >
        <!-- 包含全部系统课订单数据（月系统课、季系统课、半年系统课、年系统课） -->
        <el-tab-pane label="系统课" name="5">
          <searchList1
            @search="handleSearch"
            channel="pay_channel"
            sup="sup"
            date="ctime"
            date-placeholder="下单时间"
            phone="uid"
            search-stage="stage"
            department="pay_teacher_id"
            groupSell="pay_teacher_id"
            search-team-name="last_team_id"
            search-trial-team-name="uid"
          />
          <all-order :topic="activeTopic" :search="search" />
        </el-tab-pane>

        <!-- 包含全部体验课订单数据（双周体验课、单周体验课） -->
        <el-tab-pane label="体验课" name="4">
          <searchList2
            @search="handleSearch"
            channel="pay_channel"
            sup="sup"
            date="ctime"
            date-placeholder="下单时间"
            phone="uid"
            schedule="stage"
            department="last_teacher_id"
            groupSell="last_teacher_id"
            search-trial-team-name="last_team_id"
          />
          <all-order :topic="activeTopic" :search="search" />
        </el-tab-pane>
        <el-tab-pane label="活动订单" name="1,2,6">
          <all-order :topic="activeTopic" :search="search" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-scrollbar>
</template>

<script>
import allOrder from './components/allOrder'
import searchList1 from './components/searchList1.vue'
import searchList2 from './components/searchList2.vue'
export default {
  name: 'orderModule',
  props: [],
  components: {
    allOrder,
    searchList1,
    searchList2
  },
  data() {
    return {
      // 默认显示tab
      activeTopic: '5',
      // 搜索
      search: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 点击tab(无用啊已经v-model了)
    handleClick(tab, event) {
      this.activeTopic = tab.name
    },
    // 点击搜索
    handleSearch(res) {
      console.log(res, 'search')
      this.search = res
    }
  },
  created() {},
  mounted() {},
  destroyed() {}
}
</script>

<style lang="scss" scoped>
#order-scroll {
  height: calc(100vh - 60px);
  position: relative;

  .order-box {
    width: 100%;
    height: 100%;
    padding: 10px 10px 0 10px;

    .el-tabs--border-card > .el-tabs__content {
      padding: 15px 0 !important;
    }

    .tab-top {
      position: absolute;
      top: 0px;
      right: 10px;
      left: 10px;
      z-index: 1001;
    }

    .el-table__header-wrapper {
      padding: 0px 10px 0px 10px !important;
    }
  }
}
</style>
<style lang="scss">
.order-box {
  .el-tabs--border-card > .el-tabs__content {
    padding: 15px 0 !important;
  }

  .el-tabs--border-card > .el-tabs__header {
    background: #f5f7fa;
  }

  .el-tabs--border-card > .el-tabs__content {
    padding: 0 !important;
  }

  .el-table__empty-block {
    display: none;
  }

  .call {
    font-size: 12px;
  }
}

.el-popper {
  z-index: 2000 !important;
}

.top-style1 {
  padding-left: 10px !important;
}

.top-style2 {
  padding-left: 8px !important;
}

.top-style3 {
  padding-left: 6px !important;
}

.top-style4 {
  padding-left: 4px !important;
}

.top-style5 {
  padding-left: 2px !important;
}
</style>
