<!--
 * @Descripttion:订单v1.3
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 15:16:26
 * @LastEditors: liukun
 * @LastEditTime: 2020-05-08 15:09:38
 -->
<template>
  <el-scrollbar wrap-class="order-wrapper" id="order-scroll">
    <!-- topicType="topic_id" -->
    <div class="order-box">
      <el-tabs type="border-card" v-model="activeTopic">
        <!-- 包含全部系统课订单数据（月系统课、季系统课、半年系统课、年系统课） -->
        <el-tab-pane label="系统课" name="5">
          <search-list1 @search="handleSearch" v-if="activeTopic === '5'" />
          <all-order1
            :topic="activeTopic"
            :search="search"
            v-if="activeTopic === '5'"
          />
        </el-tab-pane>

        <!-- 包含全部体验课订单数据（双周体验课、单周体验课） -->
        <el-tab-pane label="体验课" name="4">
          <search-list2 @search="handleSearch" v-if="activeTopic === '4'" />
          <all-order2
            :topic="activeTopic"
            :search="search"
            v-if="activeTopic === '4'"
          />
        </el-tab-pane>
        <!-- <el-tab-pane label="活动订单" name="1,2,6">
          <all-order :topic="activeTopic" :search="search" />
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </el-scrollbar>
</template>

<script>
import allOrder1 from './components/allOrder1'
import allOrder2 from './components/allOrder2'
import searchList1 from './components/searchList1.vue'
import searchList2 from './components/searchList2.vue'
export default {
  name: 'orderModule',
  props: [],
  components: {
    allOrder1,
    allOrder2,
    searchList1,
    searchList2
  },
  data() {
    return {
      // 默认显示tab
      activeTopic: '5',
      // 搜索
      search: [],
      showSearch: true
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 点击tab(无用啊已经v-model了)
    // handleClick(tab, event) {
    //   // this.activeTopic = tab.name
    //   // 子组件重新渲染
    //   this.showSearch = false
    //   this.$nextTick(() => {
    //     this.showSearch = true
    //   })
    // },
    // 点击搜索
    handleSearch(res) {
      console.log(res, 'search callback')

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
