<!--
 * @Descripttion:订单v1.3
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 15:16:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-15 15:35:53
 -->
<template>
  <el-row type="flex" class="orderModule app-main height">
    <div class="order-container">
      <div class="order-container-content">
        <el-scrollbar wrap-class="order-wrapper" id="order-scroll">
          <div class="order-box">
            <el-tabs type="border-card" v-model="activeTopic">
              <!-- 包含全部系统课订单数据（月系统课、季系统课、半年系统课、年系统课） -->
              <el-tab-pane label="系统课" name="5">
                <search-list1
                  @search="handleSearch"
                  :searchProp="searchProp"
                  :pay-status="payStatus"
                  v-if="activeTopic === '5'"
                />
                <all-order1
                  :topic="activeTopic"
                  :search="search"
                  @pay-status="getPayStatus"
                  v-if="activeTopic === '5'"
                />
              </el-tab-pane>
              <!-- 包含全部体验课订单数据（双周体验课、单周体验课） -->
              <el-tab-pane label="体验课" name="4">
                <search-list2
                  :pay-status="payStatus"
                  @search="handleSearch"
                  v-if="activeTopic === '4'"
                />
                <all-order2
                  :topic="activeTopic"
                  :search="search"
                  @pay-status="getPayStatus"
                  v-if="activeTopic === '4'"
                />
              </el-tab-pane>
              <el-tab-pane label="活动订单" name="1,2,6,10">
                <search-list3
                  @search="handleSearch"
                  v-if="activeTopic === '1,2,6,10'"
                />
                <all-order3
                  :topic="activeTopic"
                  :search="search"
                  v-if="activeTopic === '1,2,6,10'"
                />
              </el-tab-pane>
              <!-- 预付款优惠券 -->
              <el-tab-pane label="预付款优惠券" name="1,2,6,10,11">
                <search-list5
                  :pay-status="payStatus"
                  @search="handleSearch"
                  v-if="activeTopic === '1,2,6,10,11'"
                />
                <all-order5
                  :topic="activeTopic"
                  :search="search"
                  @pay-status="getPayStatus"
                  v-if="activeTopic === '1,2,6,10,11'"
                />
              </el-tab-pane>
              <el-tab-pane label="兑换码订单" name="13">
                 <search-list6
                  @search="handleSearch"
                  v-if="activeTopic === '13'"
                />
                <all-order6
                  :topic="activeTopic"
                  :search="search"
                  v-if="activeTopic === '13'"
                /> 
              </el-tab-pane>

                <el-tab-pane label="乐器订单" name="14">
                 <search-list7
                  @search="handleSearch"
                  v-if="activeTopic === '14'"
                />
                <all-order7
                  :topic="activeTopic"
                  :search="search"
                  v-if="activeTopic === '14'"
                /> 
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </el-row>
</template>

<script>
import allOrder1 from './components/allOrder1'
import allOrder2 from './components/allOrder2'
import allOrder3 from './components/allOrder3'
import allOrder5 from './components/allOrder5'
import allOrder6 from './components/allOrder6'
import allOrder7 from './components/allOrder7'
import searchList1 from './components/searchList1.vue'
import searchList2 from './components/searchList2.vue'
import searchList3 from './components/searchList3.vue'
import searchList5 from './components/searchList5.vue'
import searchList6 from './components/searchList6.vue'
import searchList7 from './components/searchList7.vue'
export default {
  name: 'orderModule',
  props: [],
  components: {
    allOrder1,
    allOrder2,
    allOrder3,
    allOrder5,
    allOrder6,
    allOrder7,
    searchList1,
    searchList2,
    searchList3,
    searchList5,
    searchList6,
    searchList7,
  },
  data() {
    return {
      // 默认显示tab
      activeTopic: '5',
      // 搜索
      search: [],
      showSearch: true,
      searchProp: {},
      payStatus: '3', // 支付状态
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 点击搜索
    handleSearch(res) {
      console.log(res, 'search')

      this.search = res
    },

    getPayStatus(status) {
      console.log(status, 'pay status')
      this.payStatus = status
    },
  },
  created() {
    const urlParams = localStorage.getItem('noticeParams')
    if (urlParams) {
      // 本期消息中心跳转只做体验课的
      // 更新:本期虽然但是，都要往系统课跳，默认就是系统课
      // this.activeTopic = '4'
      this.searchProp = {
        name: urlParams.split(',')[0],
        value: urlParams.split(',')[1],
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.order-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  &-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }
}
#order-scroll {
  height: calc(100vh - 60px);
  position: relative;

  .order-box {
    width: 100%;
    height: 100%;
    padding: 10px 10px 0 10px;
    overflow: hidden;

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
.orderModule {
  .el-popper {
    z-index: 2000 !important;
  }
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
