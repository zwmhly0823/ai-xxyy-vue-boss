<template>
  <div class="container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="switchTab">
      <el-tab-pane label="全部物流" name="0">
        <toggle
          @result="getStatus"
          :tab="activeName"
          :regtype="regtype"
          :source_type="source_type"
          :hideToggleBtn="allHideToggleBtn"
        />
        <rightUp
          @result="getSearch"
          :regtype="regtype"
          :status="sortItem.id"
          :source_type="source_type"
          :hideCol="hideCol"
          :hideSearchItem="hideSearchItem"
        />
        <el-scrollbar
          wrap-class="scrollbar-wrapper-first"
          id="express-right-scroll-first"
        >
          <div class="scroll" style="height:500px">
            <rightDown
              :search="search"
              :sortItem="sortItem"
              :regtype="regtype"
              :source_type="source_type"
              :hideCol="hideCol"
            />
          </div>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="补发货" name="1">
        <toggle
          @result="getStatus"
          :hideToggleBtn="replenishHideToggleBtn"
          :tab="activeName"
          :regtype="regtype"
          :source_type="source_type"
        />
        <rightUp
          @result="getSearch"
          :regtype="regtype"
          :status="sortItem.id"
          :source_type="source_type"
          :hideCol="hideCol"
          :hideSearchItem="hideSearchItem"
        />
        <el-scrollbar
          wrap-class="scrollbar-wrapper-first"
          id="express-right-scroll-first"
        >
          <div class="scroll" style="height:500px">
            <rightDown
              :search="search"
              :sortItem="sortItem"
              :regtype="regtype"
              :source_type="source_type"
              :hideCol="hideCol"
            />
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import toggle from '../components/toggle'
import rightDown from '../components/rightDown'
import rightUp from '../components/rightUp'
const allExpressHideCol = {
  replenishType: false,
  productType: false,
  replenishReason: false,
  applicant: false,
  productVersion: false,
  term: false,
  className: false,
  teacher: false
}
const allExpressHideSearchItem = {
  level: '',
  replenishReason: '',
  replenishMethod: '',
  moreVersion: '',
  sup: '',
  schedule: '',
  groupSell: '',
  teamDetail: '',
  topicType: 'regtype'
}
const replenishHideCol = {
  productName: false,
  productVersion: false,
  term: false,
  className: false,
  teacher: false,
  replenishType: false,
  replenishFamily: true,
  courseType: false
}
const replenishHideSearchItem = {
  level: '',
  moreVersion: '',
  schedule: '',
  sup: '',
  groupSell: '',
  teamDetail: '',
  supPlaceholder: '补发商品',
  operatorId: 'operator_id',
  sourceType: '5',
  replenishProduct: '',
  replenishMethod: '',
  replenishProductType: 'product_type'
}
const allExpressSourceType = '0,1,2,3,4'
const replenishSourceType = '5'
export default {
  components: {
    toggle,
    rightDown,
    rightUp
  },
  data() {
    return {
      activeName: '0',
      sortItem: {},
      search: '',
      hideSearchItem: allExpressHideSearchItem,
      regtype: '4,5,6', // 体验课是1  系统课是2，3 活动课4,5,6
      replenishHideToggleBtn: ['9', '0'],
      allHideToggleBtn: ['9'],
      source_type: allExpressSourceType,
      hideCol: allExpressHideCol
    }
  },
  methods: {
    // 获取物流搜索的条件值
    getSearch(val) {
      this.search = val
    },
    getStatus(val) {
      this.sortItem = val
    },
    switchTab(tab) {
      if (this.activeName === '1') {
        this.hideSearchItem = replenishHideSearchItem
        this.hideCol = replenishHideCol
        this.source_type = replenishSourceType
      } else {
        this.hideSearchItem = allExpressHideSearchItem
        this.hideCol = allExpressHideCol
        this.source_type = allExpressSourceType
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 10px;
  .fixed-tabs {
    position: fixed;
  }
}
</style>
