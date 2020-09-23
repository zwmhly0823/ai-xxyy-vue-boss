<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-08-15 15:42:18
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-23 15:35:51
-->
<template>
  <el-row type="flex" class="app-main grantRule">
    <el-col class="grantRule-content">
      <div class="grid-content">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="content">
            <div class="base-info divider">
              <div class="label">
                <span>基本信息</span>
              </div>
              <div class="coupon-info">
                <div>
                  <span>优惠券名称：</span>
                  <span class="val">{{ couponInfo.name }}</span>
                </div>
                <div>
                  <span>优惠券类型：</span>
                  <span class="val">代金券</span>
                </div>
                <div>
                  <span>面额：</span>
                  <span class="val">{{ `${couponInfo.amount}元` }}</span>
                </div>
              </div>
            </div>
            <div class="grand-rule divider">
              <div class="label">
                <span>发放规则</span>
                <div class="btn">
                  <el-button size="mini" type="primary" @click="newRuleHandle"
                    >新建规则</el-button
                  >
                </div>
              </div>
              <div ref="tr" class="table-container">
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%"
                  :header-row-class-name="tableHeaderClassName"
                  size="mini"
                  :height="ctnHeight"
                >
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="executeTime"
                    label="执行时间"
                    width="180"
                  >
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="periodName"
                    label="影响期"
                    width="180"
                  >
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="excuteName"
                    label="执行状态"
                  >
                    <template slot-scope="scope">
                      <div
                        class="excuse-status"
                        :class="{ active: scope.row.excuteName == '执行中' }"
                      >
                        {{ scope.row.excuteName }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <div class="opt">
                        <span @click="look_handle(scope.row)">查看</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
    <new-rule
      :centerDialogVisible="centerDialogVisible"
      :ruleContent="ruleContent"
      :couponInfo="couponInfo"
      :period="lookPeriod"
      @emitDialogOperate="dialogOperate"
      v-if="centerDialogVisible"
    ></new-rule>
  </el-row>
</template>
<script>
import NewRule from './newRule'
import { formatData } from '@/utils/index'
export default {
  components: {
    NewRule
  },
  data() {
    return {
      centerDialogVisible: false,
      ruleContent: {},
      tableData: [],
      couponInfo: {},
      lookPeriod: '',
      couponId: '',
      ctnHeight: 'auto'
    }
  },

  async created() {
    const { couponId } = this.$route.params
    this.couponId = couponId

    await this.getCouponInfo({ couponId })
  },

  mounted() {
    this.calcTableHeight()
  },

  methods: {
    refreshData() {},
    async getCouponInfo(params) {
      const loadingInstance = this.$loading({
        target: '.app-main',
        lock: true,
        text: '加载中...',
        fullscreen: true
      })

      const { getCouponInfo } = this.$http.Marketing

      const couponDetail = await getCouponInfo(params).catch()

      const { payload: { couponDetailInfo = [], couponInfo = {} } = {} } =
        couponDetail || {}

      this.couponInfo = couponInfo

      /**
       * @description 执行完毕，executeType = 0: 执行完毕，executeType = 1 执行中
       */
      couponDetailInfo.forEach((item) => {
        const { executeTime = '' } = item
        item.executeTime = executeTime ? formatData(executeTime) : ''
        item.excuteName = '执行完毕'
      })
      for (var i = 0; i < couponDetailInfo.length; i++) {
        const item = couponDetailInfo[i]
        if (item.executeType === 1) {
          item.excuteName = '执行中'
          break
        }
      }

      this.tableData = couponDetailInfo

      loadingInstance.close()
    },
    /**
     * @description diolog模态框emit回来的事件
     * @tip { msgType } 1: 文本；3: 图片
     */
    dialogOperate(args) {
      const { close = true, refresh = false } = args
      this.centerDialogVisible = !close
      if (refresh) {
        this.getCouponInfo({
          couponId: this.couponId
        })
      }
    },
    /** 新建规则 */
    newRuleHandle() {
      this.centerDialogVisible = true
      this.lookPeriod = ''
    },
    look_handle(row) {
      const { id } = row
      this.centerDialogVisible = true

      this.lookPeriod = id
    },
    tableHeaderClassName() {
      return 'header-row'
    },
    calcTableHeight(ref) {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
        const tableTopHeight = this.$refs.tr.getBoundingClientRect().y
        //  document.body.clientHeight 返回body元素内容的高度
        const ctnHeight = document.body.clientHeight - tableTopHeight - 40

        this.ctnHeight = ctnHeight + ''
        console.log('tableTopHeight', this.ctnHeight)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.grantRule {
  &-content {
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
  }
  .team-name-pointer {
    cursor: pointer;
    color: #2a75ed;
  }
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    .content {
      padding: 30px;
      .base-info {
        margin-bottom: 30px;
        .coupon-info {
          display: flex;
          height: 40px;
          align-items: center;
          padding-left: 15px;
          > div {
            margin-right: 60px;
            .val {
              color: #666;
            }
          }
        }
      }
      .grand-rule {
        .table-container {
          margin-top: 20px;
        }
      }
      .divider {
        .label {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 500;
          justify-content: space-between;
          span {
            display: flex;
            align-items: center;
            &::before {
              display: inline-block;
              content: '';
              width: 5px;
              height: 22px;
              background: #409eff;
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
  .opt {
    color: #2a75ed;
    cursor: pointer;
  }
  .excuse-status.active {
    color: #67c23a;
  }
}
</style>

<style lang="scss">
.grid-content .scrollbar-wrapper {
  overflow-x: hidden;
}
.grid-content .el-scrollbar {
  flex: 1;
}
.header-row th {
  background-color: #ccc !important;
  color: #fff;
  border: none;
}
</style>
