<template>
  <div class="container">
    <div class="switch-area">
      <div class="switch-btn">
        <span>自动发货</span>
        <el-switch
          v-model="AUTOMATIC"
          @change="switchHandle($event, 'AUTOMATIC')"
          active-color="#409eff"
          :active-value="'ON'"
          :inactive-value="'OFF'"
        >
        </el-switch>
      </div>
      <div class="switch-btn">
        <span>全国发货</span>
        <el-switch
          v-model="COUNTRY"
          @change="switchHandle($event, 'COUNTRY')"
          active-color="#409eff"
          :active-value="'ON'"
          :inactive-value="'OFF'"
        >
        </el-switch>
      </div>
    </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="switchTab">
      <el-tab-pane label="全部物流" name="0">
        <toggle
          @result="getStatus"
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
          :teamClass="teamClass"
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
          :hideToggleBtn="hideToggleBtn"
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
          :teamClass="teamClass"
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
  courseType: false
}
const allExpressHideSearchItem = {
  level: '',
  replenishReason: '',
  replenishMethod: '',
  teacherTip: '辅导老师'
}
const replenishHideCol = {
  level: true,
  productName: true,
  productVersion: false,
  term: false,
  className: false,
  teacher: false,
  courseType: false
}
const replenishHideSearchItem = {
  level: '',
  moreVersion: '',
  schedule: '',
  sup: 'product_type',
  groupSell: '',
  teamDetail: '',
  operatorId: 'operator_id'
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
      AUTOMATIC: 'OFF', // 自动发货 默认关闭
      COUNTRY: 'OFF', // 全国发货 默认关闭
      activeName: '0',
      sortItem: {},
      search: '',
      hideSearchItem: allExpressHideSearchItem,
      regtype: '2,3', // 体验课是1  系统课是2，3
      hideToggleBtn: ['9', '0'],
      source_type: allExpressSourceType,
      hideCol: allExpressHideCol,
      teamClass: '1' // 排期组件添加类别区分 系统课传1 体验课传0
    }
  },
  methods: {
    // 开关处理
    switchHandle(status, type) {
      const isOpen = status === 'ON' ? '开启' : '关闭'
      const typeName = type === 'AUTOMATIC' ? '自动发货' : '全国发货'
      this.$confirm(`是否${isOpen}${typeName}?`, {
        showCancelButton: true
      })
        .then(() => {
          this.updateSwitchStatus({ status, type })
        })
        .catch(() => {
          this[type] = status === 'ON' ? 'OFF' : 'ON'
        })
    },
    // 更新开关状态
    updateSwitchStatus(params) {
      this.$http.Express.updateSwitchStatus(params)
        .then((res) => {
          if (res.status === 'OK') {
            this.$message.success('更新成功')
          } else {
            this.$message.error('更新失败')
            this[params.type] = params.status === 'ON' ? 'OFF' : 'ON'
          }
        })
        .catch(() => {
          this.$message.error('更新失败')
          this[params.type] = params.status === 'ON' ? 'OFF' : 'ON'
        })
    },
    // 获取物流搜索的条件值
    getSearch(val) {
      this.search = val
    },
    getStatus(val) {
      this.sortItem = val
      this.handleHideCol(val)
    },
    // 展示失败原因
    handleHideCol(val) {
      if (val.id === '6' && val.centerExpressId !== 0) {
        this.$set(this.hideCol, 'expressRemark', true)
      } else {
        this.$set(this.hideCol, 'expressRemark', false)
      }
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
  position: relative;
  .fixed-tabs {
    position: fixed;
  }
  .switch-area {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    position: absolute;
    right: 15px;
    top: 0px;
    z-index: 2;
    .switch-btn {
      margin-left: 10px;
      span {
        padding-right: 5px;
        font-size: 14px;
        font-weight: 500;
        color: #909399;
      }
    }
  }
}
</style>
