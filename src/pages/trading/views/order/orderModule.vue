<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 15:16:26
 * @LastEditors: yangjiyong
 * @LastEditTime: 2020-03-28 19:34:29
 -->
<template>
  <el-scrollbar wrap-class="order-wrapper" id="order-scroll">
    <!-- topicType="topic_id" -->
    <div class="order-box">
      <m-search
        @search="handleSearch"
        channel="pay_channel"
        sup="sup"
        date="ctime"
        date-placeholder="下单时间"
        phone="uid"
        :search-stage="activeTopic === '5' ? 'stage' : ''"
        search-trial-stage="trial_stage"
        department="pay_teacher_id"
        groupSell="pay_teacher_id"
        :search-team-name="activeTopic === '5' ? 'last_team_id' : ''"
        :search-trial-team-name="activeTopic === '5' ? 'uid' : 'last_team_id'"
        :order-type="activeTopic === '5' ? 'regtype' : ''"
      />
      <!-- system-course-type="system-course-type" TODO -->

      <!-- tab - regtype -->
      <el-tabs
        type="border-card"
        @tab-click="handleClick"
        v-model="activeTopic"
      >
        <!-- 包含全部系统课订单数据（月系统课、季系统课、半年系统课、年系统课） -->
        <el-tab-pane label="系统课" name="5"></el-tab-pane>
        <!-- 包含全部体验课订单数据（双周体验课、单周体验课） -->
        <el-tab-pane label="体验课" name="4"></el-tab-pane>
        <!-- 包含小熊商城-1、邀请有奖-6、推荐有礼-2 -->
        <!-- <el-tab-pane label="活动订单" name="1,2,6"></el-tab-pane> -->

        <!-- 统计模块 + 列表 -->
        <all-order :topic="activeTopic" :search="search" />
      </el-tabs>

      <!-- 浮动层 -->
      <el-tabs
        type="border-card"
        @tab-click="handleClick"
        v-model="activeTopic"
        class="tab-top"
        v-show="suckTop"
      >
        <el-tab-pane label="系统课" name="5"> </el-tab-pane>
        <el-tab-pane label="体验课" name="4"></el-tab-pane>
        <!-- <el-tab-pane label="活动订单" name="1,2,6"></el-tab-pane> -->

        <el-table
          style="font-size:12px;"
          v-show="orderForm"
          v-if="activeTopic !== '5'"
        >
          <el-table-column label="用户信息"></el-table-column>
          <el-table-column label="商品信息"></el-table-column>
          <el-table-column label="体验课类型" v-if="activeTopic === '4'">
          </el-table-column>
          <el-table-column
            label="订单来源"
            v-if="activeTopic === '4' || activeTopic === '5'"
          ></el-table-column>
          <el-table-column label="订单状态"> </el-table-column>
          <!-- <el-table-column label="班级信息" v-if="activeTopic === '4'">
          </el-table-column> -->
          <el-table-column
            label="体验课班级"
            v-if="activeTopic === '4' || activeTopic === '5'"
          >
          </el-table-column>
          <el-table-column
            label="社群销售"
            v-if="activeTopic === '4' || activeTopic === '5'"
          >
          </el-table-column>
          <!-- <el-table-column
            label="销售部门"
            v-if="activeTopic === '4' || activeTopic === '5'"
          >
          </el-table-column> -->
          <el-table-column
            label="系统课班级"
            v-if="activeTopic === '5'"
          ></el-table-column>
          <el-table-column
            label="服务老师"
            v-if="activeTopic === '5'"
          ></el-table-column>
          <el-table-column label="下单时间"> </el-table-column>
          <el-table-column label="关联物流"> </el-table-column>
        </el-table>
      </el-tabs>
    </div>
  </el-scrollbar>
</template>

<script>
import allOrder from './components/allOrder'
import MSearch from '@/components/MSearch/index.vue'
export default {
  props: [],
  components: {
    allOrder,
    MSearch
  },
  data() {
    return {
      // 默认显示tab
      activeTopic: '5',
      // 吸顶tab显示
      suckTop: false,
      // 吸顶表格显示
      orderForm: false,
      // 切换tab
      // tab: '4',
      // 搜索
      search: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 点击tab
    handleClick(tab, event) {
      document
        .getElementById('order-scroll')
        .querySelector('.order-wrapper').scrollTop = 0
      this.activeTopic = tab.name
    },
    // 点击搜索
    handleSearch(res) {
      console.log(res, 'search')
      // 体验课排期和系统课排期
      const stage = []
      res.forEach((ele, index) => {
        if (ele.terms) {
          if (ele.terms.stage) {
            stage.push(...ele.terms.stage)
          }
          if (ele.terms.trial_stage) {
            stage.push(...ele.terms.trial_stage)
          }
          if (Object.keys(ele.terms).length === 0) res.splice(index, 1)
        }
      })
      const search = JSON.parse(JSON.stringify(res))
      if (stage.length > 0) search.push({ terms: { stage } })
      this.search = search
    },
    // 吸顶
    handleScroll() {
      const scroll = document.getElementById('order-scroll')
      const dom = scroll.querySelector('.order-wrapper').scrollTop
      const domheight = scroll.querySelector('.el-card__body').offsetHeight
      dom > domheight + 20 ? (this.suckTop = true) : (this.suckTop = false)
      dom > domheight + 175 ? (this.orderForm = true) : (this.orderForm = false)
    }
  },
  created() {},
  mounted() {
    // 吸顶
    window.addEventListener('scroll', this.handleScroll, true)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll, true)
  }
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
