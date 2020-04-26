<!--
 * @Descripttion: 销售过程转化分析
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-04-02 15:35:27
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-26 23:04:38
 -->
<template>
  <el-row type="flex" class="app-main height schedule-container">
    <el-col class="schedule-container-right">
      <div class="grid-content">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="top-tabs">
            <div
              v-for="(statusInfo, index) in topStatus"
              :key="index"
              :class="{ active: index == btnIndex }"
              @click="top_tabs_click(index, statusInfo)"
            >
              {{ statusInfo.label }}
            </div>
          </div>
          <div class="tabs-operate">
            <div
              v-for="(tab, index) in priodTabs"
              :key="index"
              :class="{ active: index == tabIndex }"
              @click="priod_tabs_click(tab, index)"
            >
              <span>{{ tab.period_name }}</span>
            </div>
            <!-- 大于5个 TODO: -->
            <el-dropdown
              @command="handleCommand"
              class="activeCommand"
              :class="{ active: '6' == tabIndex }"
              v-if="priodTabsEnd.length"
            >
              <span class="el-dropdown-link">
                {{ selectName
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(tab, index) in priodTabsEnd"
                  :key="index"
                  :command="tab.period_name"
                  >{{ tab.period_name }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="sear-container">
            <!-- TODO: -->
            <statictics-search @searchChange="searchChange"></statictics-search>
          </div>
          <p class="descripte" v-if="statisticsInfo">
            开课日期：<span class="label-val">{{
              statisticsInfo.start_date || '-'
            }}</span>
            结课日期：
            <span class="label-val">{{ statisticsInfo.end_date || '-' }}</span
            >开课天数：
            <span class="label-val"
              >{{ statisticsInfo.course_days || '-' }}天</span
            >
            <span>当前结果：总订单数：</span>
            <span class="label-val for-light">{{
              statisticsInfo.order_number || '-'
            }}</span>
            <span>总转化率：</span>
            <span class="label-val for-light">{{
              statisticsInfo.conversion_rate_total || '-'
            }}</span>
            <span>总金额：</span>
            <span class="for-light">{{
              statisticsInfo.amount_total || '-'
            }}</span>
          </p>
          <div style="padding: 0 15px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="转化统计" name="conversion"> </el-tab-pane>
              <!-- TODO: -->
              <!-- <el-tab-pane label="参课统计" name="attendClass"> </el-tab-pane
              ><el-tab-pane label="完课统计" name="finishClass"> </el-tab-pane> -->
            </el-tabs>
          </div>
          <div class="orderStyle" v-if="tableData.length">
            <ele-table
              :dataList="tableData"
              :loading="flags.loading"
              :size="tabQuery.size"
              :page="tabQuery.page"
              :total="totalElements"
              @pageChange="pageChange_handler"
              class="mytable"
            >
              <el-table-column
                fixed
                label="难度级别"
                prop="sup"
                width="80"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                label="销售组"
                width="150"
                align="center"
                prop="department"
              ></el-table-column>
              <el-table-column
                fixed
                label="社群销售"
                width="100"
                align="center"
                prop="teacher"
              ></el-table-column>
              <el-table-column
                fixed
                label="体验课学生"
                width="100"
                prop="student_total"
                align="center"
              ></el-table-column>
              <el-table-column
                v-for="item in tableDatasss"
                :label="item.label"
                :key="item.index"
                align="center"
              >
                <el-table-column
                  fixed
                  label="订单数"
                  width="100"
                  prop="label"
                  align="center"
                  >{{ item.children[0].label }}</el-table-column
                >
                <el-table-column
                  fixed
                  label="转化率"
                  width="100"
                  prop="label"
                  align="center"
                  >{{ item.children[1].label }}</el-table-column
                >
                <el-table-column
                  fixed
                  label="总金额"
                  width="100"
                  prop="label"
                  align="center"
                  >{{ item.children[2].label }}</el-table-column
                >
              </el-table-column>
            </ele-table>
          </div>
          <div v-else class="no-data">
            暂无数据
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
// import MSearch from '@/components/MSearch/index.vue'
import staticticsSearch from '../../components/staticticsSearch'
import EleTable from '@/components/Table/EleTable'
import { formatData } from '@/utils'
export default {
  props: {
    department: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    staticticsSearch,
    EleTable
  },
  data() {
    return {
      // tabs标签默认状态
      selectName: '更多',
      activeName: 'conversion',
      tabIndex: 0,
      btnIndex: 0,
      topStatus: [
        {
          status: 'on_going',
          label: '进行中'
        },
        {
          status: 'over',
          label: '已结课'
        },
        {
          status: 'not_start',
          label: '招生中'
        }
      ],
      susStatus: {
        1: 'S1',
        2: 'S2',
        3: 'S3',
        4: 'S4',
        5: 'S5'
      },
      priodTabs: [],
      priodTabsEnd: [],
      flags: {
        loading: false
      },
      tabQuery: {
        size: 20,
        page: 1
      },
      // 总页数
      totalElements: 0,
      // 表格数据
      statisticsInfo: {},
      tableData: [],
      tableDatasss: []
    }
  },
  computed: {},
  watch: {},
  activated() {
    this.init()
  },
  methods: {
    async init(status = 'on_going') {
      const params = { status }

      const proidList = await this.getPriodByStatus(params)
      if (proidList.length) {
        this.priodTabs = proidList.slice(0, 5)
        this.priodTabsEnd = proidList.slice(5)

        const { period = '' } = proidList[0]
        this.tabQuery.period = period

        await this.getChangecListByProid()
      }
    },
    // 通过状态获取期数 ‘进行中’、‘已结课’，‘招生中’
    async getPriodByStatus(params) {
      try {
        const {
          data: { ManagementStatusList: proidList }
        } = await this.$http.Statistics.getPriodByStatus(params)
        return proidList
      } catch (err) {
        console.log(err)
      }
    },
    // 组件emit
    searchChange(search) {
      // console.log('searchChange', search)
      const { department = [], groupSell = '', sup = [] } = search
      Object.assign(this.tabQuery, {
        teacher: groupSell,
        department: department.join(),
        sup: sup.join()
      })

      this.getChangecListByProid()
    },
    // table列表
    async getChangecListByProid() {
      this.flags.loading = true
      // TODO:
      // this.tabQuery.period = 13
      try {
        let {
          data: { ConversionRateStatistics }
        } = await this.$http.Statistics.getChangecListByProid(this.tabQuery)

        !ConversionRateStatistics && (ConversionRateStatistics = {})

        this.totalElements = ConversionRateStatistics.total_elements || 0

        ConversionRateStatistics.start_date = ConversionRateStatistics.start_date
          ? formatData(ConversionRateStatistics.start_date)
          : ''
        ConversionRateStatistics.end_date = ConversionRateStatistics.end_date
          ? formatData(ConversionRateStatistics.end_date)
          : ''

        this.statisticsInfo = ConversionRateStatistics
        this.tableData = ConversionRateStatistics.teacher_conversion_rates || []

        if (this.tableData.length) {
          this.tableData.forEach((item, index) => {
            item.sup = item.sup ? this.susStatus[item.sup] : ''
            const conversionRate = item.conversion_rate_daily || []

            const conversionArr = []
            conversionRate.forEach((label, lIndex) => {
              const _index = lIndex + 1
              conversionArr.push({
                label: `W1D${_index}`,
                children: [
                  { label: `${label.order_number}` },
                  { label: `${label.conversion}` },
                  { label: `${label.amount}` }
                ]
              })
            })

            this.tableDatasss = conversionArr
          })
        } else {
          this.tableDatasss = []
        }

        this.flags.loading = false
      } catch (err) {
        console.log(err)
        this.flags.loading = false
      }
    },
    // 点击tabs页签（转化统计 按钮）
    handleClick(tab) {
      this.tabQuery.page = 1
      this.getChangecListByProid()
    },
    // 更多 下拉框
    handleCommand(command) {
      this.tabIndex = 6
      this.selectName = command
      this.tabQuery.page = 1
      this.getChangecListByProid()
    },
    top_tabs_click(index, statusInfo) {
      this.tabIndex = 0
      this.btnIndex = index
      console.log(statusInfo, 'statusInfo')
      const { status } = statusInfo
      this.init(status)
    },
    priod_tabs_click(row, index) {
      this.tabIndex = index
      this.tabQuery.page = 1
      this.tabQuery.period = row.period

      this.getChangecListByProid()
      this.selectName = '更多'
    },
    // 新增、编辑
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      this.tabQuery.page = page
      this.getChangecListByProid()
    },
    // 搜索
    handleSearch(data) {
      console.log(data)
    }
  }
}
</script>
<style lang="scss" scoped>
.schedule-container {
  &-left {
    padding-left: 0px;
    width: 220px;
    min-width: 220px;
    border-right: 1px solid #e3e3e3;
  }
  &-right {
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
  }
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.right {
      padding: 0;
    }
  }
  .top-tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    background: #f0f1f2;
    > div {
      margin-right: 20px;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      text-align: center;
      box-sizing: border-box;
      outline: 0;
      transition: 0.1s;
      font-weight: 500;
      padding: 9px 15px;
      border-radius: 20px;
      font-size: 12px;
      &.active {
        background: #409eff;
        color: #fff;
      }
    }
  }
  .tabs-operate {
    background: #f5f7fa;
    display: flex;
    > div {
      height: 50px;
      padding: 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &.active {
        background: #fff;
        span {
          color: #409eff;
        }
      }
    }
  }
  .descripte {
    padding-left: 15px;
    color: #333;
    min-width: 800px;
    .label-val {
      margin-right: 20px;
    }
    .for-light {
      color: #409eff;
    }
  }
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7fa;
    height: 80px;
    color: #409eff;
    font-size: 15px;
  }
  .sear-container {
    display: flex;
    margin: 10px;
    align-items: center;
    .el-card {
      border: 0;
    }
  }
  .orderStyle {
    // padding-bottom: 45px;
  }
  .editStyle {
    color: #0401ff;
    cursor: pointer;
  }
  .activeCommand.active {
    background: #fff;
    .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
    }
  }
  .el-dropdown-link.active {
    cursor: pointer;
    color: #409eff;
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
</style>
