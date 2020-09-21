<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-08-15 15:42:18
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-21 20:36:41
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
              <div ref="tableContainer" class="table-container">
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%"
                  :header-row-class-name="tableHeaderClassName"
                  size="mini"
                >
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="date"
                    label="日期"
                    width="180"
                  >
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="name"
                    label="姓名"
                    width="180"
                  >
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="address"
                    label="地址"
                  >
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
      @emitDialogOperate="dialogOperate"
      v-if="centerDialogVisible"
    ></new-rule>
  </el-row>
</template>
<script>
import NewRule from './newRule'
export default {
  components: {
    NewRule
  },
  data() {
    return {
      centerDialogVisible: true,
      ruleContent: {},
      tableData: [],
      couponInfo: {}
    }
  },

  async created() {
    const { couponId } = this.$route.params

    await this.getCouponInfo({ couponId })
  },

  mounted() {},

  methods: {
    async getCouponInfo(params) {
      const loadingInstance = this.$loading({
        target: '.app-main',
        lock: true,
        text: '加载中...',
        fullscreen: true
      })

      const { getCouponInfo } = this.$http.Marketing

      const couponDetail = await getCouponInfo(params).catch((err) => {
        console.log(err)
      })

      const { payload: { couponDetailInfo = [], couponInfo = {} } = {} } =
        couponDetail || {}

      this.couponInfo = couponInfo
      this.tableData = couponDetailInfo

      loadingInstance.close()
    },
    /**
     * @description diolog模态框emit回来的事件
     * @tip { msgType } 1: 文本；3: 图片
     */
    dialogOperate(args) {
      const { close = true } = args
      this.centerDialogVisible = !close
    },
    /** 新建规则 */
    newRuleHandle() {
      this.centerDialogVisible = true
    },
    tableHeaderClassName() {
      return 'header-row'
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
        margin-bottom: 40px;
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
          margin-top: 50px;
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
