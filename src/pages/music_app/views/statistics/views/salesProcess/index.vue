<!--
 * @Descripttion:
 * @version:
 * @Author: huzhifu
 * @Date: 2020-04-25 13:04:27
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-26 17:19:33
 -->
<template>
  <el-row type="flex" class="app-main height process-container">
    <el-col class="process-container-right">
      <div class="grid-content">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="top-tabs">
            <div
              v-for="(btn, index) in btnTabs"
              :key="index"
              :class="{ active: index == btnIndex }"
              @click="btn_tabs_click(index)"
            >
              {{ btn }}
            </div>
          </div>
          <div class="tabs-operate">
            <div
              v-for="(tab, index) in priodTabs"
              :key="index"
              :class="{ active: index == tabIndex }"
              @click="tabs_click(index)"
            >
              <span>{{ tab }}</span>
            </div>
            <el-dropdown
              @command="handleCommand"
              class="activeCommand"
              :class="{ active: '6' == tabIndex }"
            >
              <span class="el-dropdown-link">
                {{ selectName
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(tab, index) in priodTabsEnd"
                  :key="index"
                  :command="tab"
                  >{{ tab }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="sear-container">
            <m-search
              @searchDepartment="searchDepartment"
              @searchSale="searchSale"
              @searchSup="searchSup"
            />
          </div>
          <p class="descripte">
            开课日期：<span class="label-val">4月6日</span> 结课日期：
            <span class="label-val">4月20日</span>开课天数
            <span class="label-val">11天</span>
            <span class="label-val">当前结果:</span>
            <template v-if="activeName == 'conversion'">
              <span>总订单数:</span>
              <span class="label-val green">600</span>
              <span>总转化率:</span>
              <span class="label-val green">60%</span>
              <span>总金额:</span>
              <span class="label-val green">9695</span>
            </template>
            <template v-else>
              <span>本期总{{ despMap[activeName] }}人数:</span>
              <span class="label-val green">600</span>
              <span>本期总{{ despMap[activeName] }}率:</span>
              <span class="label-val green">60%</span>
              <span>本日总{{ despMap[activeName] }}人数:</span>
              <span class="label-val green">50</span>
              <span>本日总{{ despMap[activeName] }}率:</span>
              <span class="label-val green">30%</span>
            </template>
          </p>
          <div class="summary-tabs">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="转化统计" name="conversion"> </el-tab-pane>
              <el-tab-pane label="参课统计" name="attendClass"> </el-tab-pane
              ><el-tab-pane label="完课统计" name="finishClass"> </el-tab-pane>
            </el-tabs>
          </div>
          <div class="orderStyle">
            <ele-table
              :dataList="tableDatasss"
              :loading="flags.loading"
              :size="tabQuery.size"
              :page="tabQuery.page"
              :total="totalPages"
              @pageChange="pageChange_handler"
              class="mytable"
            >
              <!-- <el-table-column
                fixed
                label="难度级别"
                width="80"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                label="销售组"
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                label="社群销售"
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                label="体验课学生"
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                v-for="item in tableDatasss"
                :label="item.label"
                :key="item.index"
                align="center"
              >
                <el-table-column
                  v-for="(item1, index) in item.children"
                  :label="item1.label"
                  :key="index"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.$index }}</span>
                  </template>
                </el-table-column>
              </el-table-column> -->
            </ele-table>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
// import MSearch from '@/components/MSearch/index.vue'
import MSearch from '../../components/staticticsSearch'
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
    MSearch,
    EleTable
  },
  data() {
    return {
      despMap: {
        conversion: '转化',
        attendClass: '参课',
        finishClass: '完课'
      },
      // tabs标签默认状态
      selectName: '更多',
      activeName: 'conversion',
      btnStatus: 'primary',
      // canClick: true,
      query: '',
      tabIndex: 0,
      btnIndex: 0,
      btnTabs: ['进行中', '招生中', '已结课'],
      priodTabs: [],
      priodTabsEnd: [],
      totalElements: 0,
      flags: {
        loading: false
      },
      tabQuery: {
        size: 1,
        page: 1
      },
      // 总页数
      totalPages: 10,
      // 当前页数
      currentPage: 1,
      // 多选选择项
      checkList: [],
      // 表格数据
      tableData: [],
      tableDatasss: [
        {
          label: '总计',
          children: [
            { label: '订单数' },
            { label: '转化率' },
            { label: '总金额' }
          ]
        },
        {
          label: 'W1D1',
          children: [
            { label: '订单数' },
            { label: '转化率' },
            { label: '总金额' }
          ]
        },
        {
          label: 'W1D2',
          children: [
            { label: '订单数' },
            { label: '转化率' },
            { label: '总金额' }
          ]
        },
        {
          label: 'W1D3',
          children: [
            { label: '订单数' },
            { label: '转化率' },
            { label: '总金额' }
          ]
        },
        {
          label: 'W1D4',
          children: [
            { label: '订单数' },
            { label: '转化率' },
            { label: '总金额' }
          ]
        },
        {
          label: 'W1D5',
          children: [
            { label: '订单数' },
            { label: '转化率' },
            { label: '总金额' }
          ]
        }
      ]
    }
  },
  computed: {},
  watch: {
    activeName(val, oldVal) {
      if (val === 'attendClass') {
        this.tableDatasss = [
          {
            label: '总计',
            children: [{ label: '总参课人数' }, { label: '总参课率' }]
          },
          {
            label: 'W1D1',
            children: [{ label: '当日参课人数' }, { label: '当日参课率' }]
          },
          {
            label: 'W1D2',
            children: [{ label: '当日参课人数' }, { label: '当日参课率' }]
          },
          {
            label: 'W1D3',
            children: [{ label: '当日参课人数' }, { label: '当日参课率' }]
          },
          {
            label: 'W1D4',
            children: [{ label: '当日参课人数' }, { label: '当日参课率' }]
          },
          {
            label: 'W1D5',
            children: [{ label: '当日参课人数' }, { label: '当日参课率' }]
          },
          {
            label: 'W1D6',
            children: [{ label: '当日参课人数' }, { label: '当日参课率' }]
          },
          {
            label: 'W1D7',
            children: [{ label: '当日参课人数' }, { label: '当日参课率' }]
          }
        ]
      } else if (val === 'finishClass') {
        this.tableDatasss = [
          {
            label: '总计',
            children: [{ label: '总完课人数' }, { label: '总完课率' }]
          },
          {
            label: 'W1D1',
            children: [{ label: '当日完课人数' }, { label: '当日完课率' }]
          },
          {
            label: 'W1D2',
            children: [{ label: '当日完课人数' }, { label: '当日完课率' }]
          },
          {
            label: 'W1D3',
            children: [{ label: '当日完课人数' }, { label: '当日完课率' }]
          },
          {
            label: 'W1D4',
            children: [{ label: '当日完课人数' }, { label: '当日完课率' }]
          },
          {
            label: 'W1D5',
            children: [{ label: '当日完课人数' }, { label: '当日完课率' }]
          },
          {
            label: 'W1D6',
            children: [{ label: '当日完课人数' }, { label: '当日完课率' }]
          },
          {
            label: 'W1D7',
            children: [{ label: '当日完课人数' }, { label: '当日完课率' }]
          }
        ]
      } else if (val === 'conversion') {
        this.tableDatasss = [
          {
            label: '总计',
            children: [
              { label: '订单数' },
              { label: '转化率' },
              { label: '总金额' }
            ]
          },
          {
            label: 'W1D1',
            children: [
              { label: '订单数' },
              { label: '转化率' },
              { label: '总金额' }
            ]
          },
          {
            label: 'W1D2',
            children: [
              { label: '订单数' },
              { label: '转化率' },
              { label: '总金额' }
            ]
          },
          {
            label: 'W1D3',
            children: [
              { label: '订单数' },
              { label: '转化率' },
              { label: '总金额' }
            ]
          },
          {
            label: 'W1D4',
            children: [
              { label: '订单数' },
              { label: '转化率' },
              { label: '总金额' }
            ]
          },
          {
            label: 'W1D5',
            children: [
              { label: '订单数' },
              { label: '转化率' },
              { label: '总金额' }
            ]
          }
        ]
      }
    }
  },
  async activated() {
    this.tabsPriodTabs()
    // await this.getCourseListByType()
  },
  methods: {
    // 销售部门
    searchDepartment(data) {
      console.log(data)
    },
    // 社群销售
    searchSale(data) {
      console.log(data)
    },
    // 难度级别
    searchSup(data) {
      console.log(data)
    },
    // 点击tabs页签
    handleClick(tab, event) {
      console.log(tab.index)
      this.tabQuery.page = 1
      this.getCourseListByType()
    },
    // 更多 下拉框
    handleCommand(command) {
      console.log(command)
      this.tabIndex = 6
      this.selectName = command
      this.tabQuery.page = 1
      this.getCourseListByType()
      // this.$message('click on item ' + command)
    },
    tabsPriodTabs() {
      const priodTabss = [
        '0413期',
        '0414期',
        '0415期',
        '0416期',
        '0417期',
        '0418期',
        '0419期',
        '0420期',
        '0421期',
        '0422期',
        '0423期',
        '0424期'
      ]
      const priodTabsState = priodTabss.slice(0, 5)
      const priodTabsEnd = priodTabss.slice(5)
      this.priodTabs = priodTabsState
      this.priodTabsEnd = priodTabsEnd
    },
    btn_tabs_click(index) {
      this.btnIndex = index
    },
    tabs_click(index) {
      this.tabIndex = index
      this.tabQuery.page = 1
      this.getCourseListByType()
      this.selectName = '更多'
    },
    tabs_click_end() {
      console.log('12312312')
    },
    // 新增、编辑
    addEditSchedule(row) {
      const { period = 0 } = row // TODO:

      this.$router.push({ path: `/addSchedule/${period}/${this.tabIndex}` })
    },
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      this.tabQuery.page = page
      this.getCourseListByType()

      // console.log(aa, 'aa')
    },
    /** adolf-end */
    async getCourseListByType() {
      this.flags.loading = true
      const status = {
        '0': '待开始',
        '1': '招生中',
        '2': '待开课',
        '3': '已结课'
      }
      this.tabQuery = {
        ...this.tabQuery,
        // page: --this.tabQuery.page,
        courseType: this.tabIndex
      }
      // TODO:
      try {
        const {
          content = [],
          totalElements = 0
        } = await this.$http.Operating.getCourseListByType(this.tabQuery)
        this.totalPages = Number(totalElements)

        content.forEach((item) => {
          item.startDate = formatData(item.startDate)
          item.endDate = formatData(item.endDate)
          item.courseDay = formatData(item.courseDay)
          item.endCourseDay = +item.endCourseDay
            ? formatData(item.endCourseDay)
            : ''
          item.status = status[item.status]
        })
        this.flags.loading = false

        this.tableData = content
      } catch (err) {
        this.flags.loading = false
        return new Error(err)
      }
    },
    // 搜索
    handleSearch(data) {
      console.log(data)
    }
  }
}
</script>
<style lang="scss" scoped>
.process-container {
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
        background: #2a75ed;
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
          color: #2a75ed;
        }
      }
    }
  }
  .descripte {
    padding-left: 20px;
    color: #333;
    min-width: 800px;
    .label-val {
      margin-right: 16px;
      &.green {
        color: #2a75ed;
        margin-left: 10px;
      }
    }
  }
  .summary-tabs {
    margin-left: 20px;
  }
  .sear-container {
    display: flex;
    margin: 20px;
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
      color: #2a75ed;
    }
  }
  .el-dropdown-link.active {
    cursor: pointer;
    color: #2a75ed;
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
