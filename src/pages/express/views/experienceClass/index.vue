<template>
  <div class="container">
    <div class="automatic-config" @click="isShowSetUp = true">
      <span><i class="el-icon-setting"></i> 自动发货设置</span>
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
          <div class="scroll" ref="scroll" :style="{ height: scrollHeight }">
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
          <div class="scroll" :style="{ height: scrollHeight }">
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
    <el-dialog
      class="set-up-dialog"
      title="自动发货设置"
      :visible.sync="isShowSetUp"
      @close="setUpClose"
      width="600px"
    >
      <div class="set-up-area">
        <div class="config-items time-switch">
          <span class="label">规则条件:</span>
          <div class="time-groups">
            <div
              class="time-item"
              v-for="(item, index) in automaticParams"
              :key="index"
            >
              <el-input v-model="item.tag" disabled>
                <template slot="prepend">每天</template>
              </el-input>
              <el-switch
                v-model="item.status"
                @change="switchHandle"
                :width="45"
                active-color="#13ce66"
                active-value="ON"
                inactive-value="OFF"
                active-text="开"
                inactive-text="关"
              >
              </el-switch>
            </div>
          </div>
        </div>
        <div class="config-items effective-time">
          <span class="label">生效时间:</span>
          <span>长期有效</span>
        </div>
        <div class="config-items nationwide">
          <span class="label">开启全国调拨:</span>
          <el-switch
            v-model="AUTOMATIC"
            :width="45"
            active-color="#13ce66"
            active-value="ON"
            inactive-value="OFF"
            active-text="开"
            inactive-text="关"
          >
          </el-switch>
          <span class="warring">请谨慎开启！</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="immediately">
          立即发货
        </el-button>
        <el-button @click="isShowSetUp = false">启用定时发货</el-button>
        <el-button @click="isShowSetUp = false">取 消</el-button>
      </span>
    </el-dialog>
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
  replenishMethod: ''
}
const replenishHideCol = {
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
      isShowSetUp: true, // 自动发货按钮配置弹窗
      scrollHeight: 'auto', // scroll高度
      automaticParams: [
        {
          type: 'AUTOMATIC', // COUNTRY
          tag: '10:00',
          status: 'OFF'
        },
        {
          type: 'AUTOMATIC', // COUNTRY
          tag: '14:00',
          status: 'OFF'
        },
        {
          type: 'AUTOMATIC', // COUNTRY
          tag: '20:00',
          status: 'OFF'
        }
      ],
      AUTOMATIC: 'ON', // 自动发货 默认关闭
      COUNTRY: 'OFF', // 全国发货 默认关闭
      activeName: '0',
      sortItem: {},
      search: '',
      hideSearchItem: allExpressHideSearchItem,
      regtype: '1', // 体验课是1  系统课是2，3
      hideToggleBtn: ['9', '0'],
      source_type: allExpressSourceType,
      hideCol: allExpressHideCol,
      teamClass: '0' // 排期组件添加类别区分 系统课传1 体验课传0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.calcSrollHeight()
    })
  },
  methods: {
    // 计算滚动区域高度
    calcSrollHeight() {
      const topH = this.$refs.scroll.getBoundingClientRect().y
      const scrollH = document.body.clientHeight - topH - 60
      this.scrollHeight = scrollH + 'px'
    },
    // 立即发货
    immediately() {
      const h = this.$createElement
      this.$confirm(
        h('div', null, [
          h('p', { style: 'font-weight: 600;' }, `确定要立即启动发货任务?`),
          h('p', null, `动后将所有待审核发货任务进行批量自动发货，请谨慎操作！`)
        ]),
        {
          showCancelButton: true,
          type: 'warning'
        }
      )
        .then(() => {
          // TODO 立即发货
        })
        .catch(() => {
          this.$message.warning('没有发生变化')
        })
    },
    // 自动发货配置弹窗关闭
    setUpClose() {
      this.isShowSetUp = false
      // TODO 关闭弹窗的一些处理
    },
    // 开关处理
    switchHandle(status, type) {
      this.isShowSetUp = true
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
  position: relative;
  margin: 10px;
  .fixed-tabs {
    position: fixed;
  }
  .automatic-config {
    height: 40px;
    line-height: 40px;
    position: absolute;
    right: 15px;
    top: 0px;
    z-index: 2;
    cursor: pointer;
    font-weight: 500;
    color: #909399;
  }
  .set-up-area {
    .config-items {
      display: flex;
      margin-bottom: 20px;
      .label {
        width: 100px;
        text-align: right;
        padding-top: 12px;
        margin-right: 15px;
      }
    }
    .time-switch {
      .time-groups {
        flex: 1;
        .time-item {
          display: flex;
          align-items: center;
          margin-top: 15px;
          &:first-child {
            margin-top: 0;
          }
          .el-input {
            width: 60%;
          }
        }
      }
    }
    .effective-time {
      span {
        padding-top: 12px;
      }
    }
  }
}
</style>
<style lang="scss">
.set-up-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #e6e6e6;
  }
}
.time-item,
.nationwide {
  .el-switch__label--left {
    position: relative;
    left: 48px;
    color: #fff;
    z-index: -1111;
  }
  .el-switch__label--right {
    position: relative;
    right: 48px;
    color: #fff;
    z-index: -1111;
  }
  .el-switch__label.is-active {
    z-index: 1111;
    color: #fff;
  }
}
.nationwide {
  .el-switch {
    padding-top: 20px;
    margin-left: -25px;
  }
  .warring {
    padding-top: 12px;
    font-weight: 500;
    color: red;
  }
}
</style>
