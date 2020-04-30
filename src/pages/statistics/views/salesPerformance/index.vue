<!--
 * @Descripttion: 销售过程转化分析
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-04-02 15:35:27
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-29 17:07:12
 -->
<template>
  <el-row type="flex" class="app-main height schedule-container">
    <el-col class="schedule-container-right">
      <div class="grid-content">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <!-- 期状态 -->
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
          <!-- 期标签页 -->
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
                {{ selectName }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(tab, index) in priodTabsEnd"
                  :key="index"
                  :command="tab"
                  >{{ tab.period_name }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 搜索 -->
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
            <span>当前结果：</span>
            <template v-if="activeName == 'conversion'">
              <span>总订单数：</span>
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
            </template>
            <template v-else-if="activeName == 'attendClass'">
              <span>本期总{{ despMap[activeName] }}人数：</span>
              <span class="label-val for-light">
                {{ statisticsInfo.join_nums || '-' }}
              </span>
              <span>本期总{{ despMap[activeName] }}率：</span>
              <span class="label-val for-light">{{
                statisticsInfo.join_rate || '-'
              }}</span>
              <span>本日总{{ despMap[activeName] }}人数：</span>
              <span class="label-val for-light">{{
                statisticsInfo.now_join_nums || '-'
              }}</span>
              <span>本日总{{ despMap[activeName] }}率：</span>
              <span class="label-val for-light">{{
                statisticsInfo.now_join_rate || '-'
              }}</span>
            </template>
            <!-- 完课统计数据统计 -->
            <template v-else-if="activeName == 'finishClass'">
              <span>本期总{{ despMap[activeName] }}人数：</span>
              <span class="label-val for-light"
                >{{ statisticsInfo.complete_nums || '-' }}
              </span>
              <span>本期总{{ despMap[activeName] }}率：</span>
              <span class="label-val for-light">
                {{ statisticsInfo.complete_rate || '-' }}
              </span>
              <span>本日总{{ despMap[activeName] }}人数：</span>
              <span class="label-val for-light">
                {{ statisticsInfo.now_complete_nums || '-' }}
              </span>
              <span>本日总{{ despMap[activeName] }}率：</span>
              <span class="label-val for-light">
                {{ statisticsInfo.now_complete_rate || '-' }}
              </span>
            </template>
          </p>
          <div style="padding: 0 15px;">
            <el-tabs
              v-model="activeName"
              @tab-click="statisticsTypehandleClick"
            >
              <el-tab-pane label="转化统计" name="conversion"> </el-tab-pane>
              <!-- TODO: -->
              <el-tab-pane label="参课统计" name="attendClass"> </el-tab-pane>
              <el-tab-pane label="完课统计" name="finishClass"> </el-tab-pane>
            </el-tabs>
          </div>
          <!-- 完课统计列表 -->
          <div
            class="orderStyle"
            v-if="tableDataAttend.length && activeName === 'finishClass'"
          >
            <ele-table
              :dataList="tableDataAttend"
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
                width="70"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                label="销售组"
                width="120"
                align="center"
                prop="department_name"
              ></el-table-column>
              <el-table-column
                fixed
                label="社群销售"
                width="80"
                align="center"
                prop="teacher_name"
              ></el-table-column>
              <el-table-column
                fixed
                label="体验课学生"
                width="85"
                prop="student_nums"
                align="center"
              ></el-table-column>
              <el-table-column align="center" label="总计">
                <el-table-column
                  fixed
                  label="总完课人数"
                  prop="total_complete_nums"
                  align="center"
                ></el-table-column>
                <el-table-column
                  fixed
                  label="总完课率"
                  prop="total_complete_rate"
                  align="center"
                ></el-table-column>
              </el-table-column>
              <!-- child-table-start -->
              <el-table-column
                align="center"
                v-for="(a, i) in tableDataChildAttend"
                :label="a.current_lesson"
                :key="i"
              >
                <el-table-column fixed label="当日完课人数" align="center">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.completeArr[i].complete_nums }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column fixed label="当日完课率" align="center">
                  <template slot-scope="scope">
                    <span> {{ scope.row.completeArr[i].complete_rate }}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column fixed label="总金额" align="center"
                  ><template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.conversion_rate_daily).length &&
                          scope.row.conversion_rate_daily[i] &&
                          !scope.row.conversion_rate_daily[i].is_last
                      "
                    >
                      {{ scope.row.conversion_rate_daily[i].amount }}
                    </span>
                    <span v-else>--</span>
                  </template></el-table-column
                >-->
              </el-table-column>
            </ele-table>
          </div>

          <div
            class="orderStyle"
            v-if="tableData.length && activeName == 'conversion'"
          >
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
                width="70"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                label="销售组"
                width="120"
                align="center"
                prop="department"
              ></el-table-column>
              <el-table-column
                fixed
                label="社群销售"
                width="80"
                align="center"
                prop="teacher"
              ></el-table-column>
              <el-table-column
                fixed
                label="体验课学生"
                width="85"
                prop="student_total"
                align="center"
              ></el-table-column>
              <el-table-column align="center" label="总计">
                <el-table-column
                  fixed
                  label="订单数"
                  prop="order_total"
                  align="center"
                ></el-table-column>
                <el-table-column
                  fixed
                  label="转化率"
                  prop="conversion_total"
                  align="center"
                ></el-table-column>
                <el-table-column
                  fixed
                  label="总金额"
                  prop="amount_total"
                  align="center"
                ></el-table-column>
              </el-table-column>
              <!-- child-table-start -->
              <el-table-column
                align="center"
                v-for="(a, i) in tableDataChild"
                :label="a.weekday"
                :key="i"
              >
                <el-table-column fixed label="订单数" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.conversion_rate_daily).length &&
                          scope.row.conversion_rate_daily[i] &&
                          !scope.row.conversion_rate_daily[i].is_null
                      "
                    >
                      {{ scope.row.conversion_rate_daily[i].order_number }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column fixed label="转化率" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.conversion_rate_daily).length &&
                          scope.row.conversion_rate_daily[i] &&
                          !scope.row.conversion_rate_daily[i].is_null
                      "
                    >
                      {{ scope.row.conversion_rate_daily[i].conversion }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column fixed label="总金额" align="center"
                  ><template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.conversion_rate_daily).length &&
                          scope.row.conversion_rate_daily[i] &&
                          !scope.row.conversion_rate_daily[i].is_null
                      "
                    >
                      {{ scope.row.conversion_rate_daily[i].amount }}
                    </span>
                    <span v-else>--</span>
                  </template></el-table-column
                >
              </el-table-column>
            </ele-table>
          </div>
          <!-- 参课统计 table -->
          <div
            class="orderStyle"
            v-if="tableDataAttend.length && activeName == 'attendClass'"
          >
            <ele-table
              :dataList="tableDataAttend"
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
                width="70"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                label="销售组"
                width="120"
                align="center"
                prop="department_name"
              ></el-table-column>
              <el-table-column
                fixed
                label="社群销售"
                width="80"
                align="center"
                prop="teacher_name"
              ></el-table-column>
              <el-table-column
                fixed
                label="体验课学生"
                width="85"
                prop="student_nums"
                align="center"
              ></el-table-column>
              <el-table-column align="center" label="总计">
                <el-table-column
                  fixed
                  label="总参课人数"
                  prop="total_join_nums"
                  align="center"
                ></el-table-column>
                <el-table-column
                  fixed
                  label="总参课率"
                  prop="total_join_rate"
                  align="center"
                ></el-table-column>
              </el-table-column>
              <el-table-column
                align="center"
                v-for="(a, i) in tableDataChildAttend"
                :label="a.current_lesson"
                :key="i"
              >
                <el-table-column fixed label="当日参课人数" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.completeArr).length &&
                          scope.row.completeArr[i] &&
                          !scope.row.completeArr[i].is_null
                      "
                    >
                      {{ scope.row.completeArr[i].join_nums }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column fixed label="当日参课率" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.completeArr).length &&
                          scope.row.completeArr[i] &&
                          !scope.row.completeArr[i].is_null
                      "
                    >
                      {{ scope.row.completeArr[i].join_rate }}
                    </span>
                  </template>
                </el-table-column>
              </el-table-column>
            </ele-table>
          </div>
          <div
            v-if="tableDataAttend.length === 0 || tableData.length === 0"
            class="no-data"
          >
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
      despMap: {
        conversion: '转化',
        attendClass: '参课',
        finishClass: '完课'
      },
      // tabs标签默认状态
      selectName: '更多',
      // 统计表title
      activeName: 'conversion',
      tabIndex: 0,
      // 状态index
      btnIndex: 0,
      topStatus: [
        {
          status: 'on_going',
          label: '进行中'
        },
        {
          status: 'not_start',
          label: '招生中'
        },
        {
          status: 'over',
          label: '已结课'
        }
      ],
      supStatus: {
        1: 'S1',
        2: 'S2',
        3: 'S3',
        4: 'S4',
        5: 'S5'
      },
      priodTabs: [],
      // 期标签页面更多下拉
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
      tableDataAttend: [],
      tableDataChild: [],
      tableDataChildAttend: []
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
    /**
     * @description: 通过状态获取'期数' ‘进行中’、‘已结课’，‘招生中’
     * @param:{ status: 'on_going/over/not_start'}
     */
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
      const { department = [], groupSell = '', sup = [] } = search
      Object.assign(this.tabQuery, {
        teacher: groupSell,
        page: 1,
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
        if (this.activeName === 'finishClass') {
          // 完课统计
          const { period, teacher, department, sup } = this.tabQuery
          const {
            data: { getCompeteCourseList }
          } = await this.$http.Statistics.getCompeteCourseList({
            ...this.tabQuery,
            term: period,
            teacher_ids: teacher,
            department_ids: department,
            sups: sup
          })
          // 表格上的统计信息
          this.statisticsInfo = getCompeteCourseList || {}
          // 格式化时间
          this.statisticsInfo.start_date = this.statisticsInfo.start_date
            ? formatData(this.statisticsInfo.start_date)
            : ''
          this.statisticsInfo.end_date = this.statisticsInfo.end_date
            ? formatData(this.statisticsInfo.end_date)
            : ''
          // 总数、分页用
          this.totalElements = getCompeteCourseList.totalElements || 0
          this.formatTableData(getCompeteCourseList.completeCourse || [])
        } else if (this.activeName === 'attendClass') {
          // 参课统计tab
          const { period, teacher, department, sup } = this.tabQuery
          const {
            data: { getCompeteCourseList }
          } = await this.$http.Statistics.getAttendClasscListByProid({
            ...this.tabQuery,
            term: period,
            teacher_ids: teacher,
            department_ids: department,
            sups: sup
          })
          // 表格上的统计信息
          this.statisticsInfo = getCompeteCourseList || {}
          // 格式化时间
          this.statisticsInfo.start_date = this.statisticsInfo.start_date
            ? formatData(this.statisticsInfo.start_date)
            : ''
          this.statisticsInfo.end_date = this.statisticsInfo.end_date
            ? formatData(this.statisticsInfo.end_date)
            : ''
          // 总数、分页用
          this.totalElements = getCompeteCourseList.totalElements || 0
          this.formatTableData(getCompeteCourseList.completeCourse || [])
        } else {
          let {
            data: { ConversionRateStatistics }
          } = await this.$http.Statistics.getChangecListByProid(this.tabQuery)

          !ConversionRateStatistics && (ConversionRateStatistics = {})
          // 总数、分页用
          this.totalElements = ConversionRateStatistics.total_elements || 0

          // 表格上的统计信息
          this.statisticsInfo = ConversionRateStatistics
          this.pakageListDate(ConversionRateStatistics)
        }
        this.flags.loading = false
      } catch (err) {
        console.log(err)
        // loadingInstance.close()
      }
    },
    // 包装 接口返回的数据
    pakageListDate(tabList) {
      // 初始化
      this.tableDataChild = []
      // 格式化时间
      tabList.start_date = tabList.start_date
        ? formatData(tabList.start_date)
        : ''
      tabList.end_date = tabList.end_date ? formatData(tabList.end_date) : ''

      const teacherConversion = tabList.teacher_conversion_rates || []

      // 大表格 遍历，选择一个‘conversion_rate_daily’最大的值，作为表头
      // let _length = 0
      teacherConversion.forEach((item, index) => {
        const conversionRateArr = item.conversion_rate_daily || []
        const childLength = conversionRateArr.length

        if (this.tableDataChild.length <= childLength) {
          this.tableDataChild = conversionRateArr
        }
        // if (childLength >= _length) {
        //   _length = childLength
        // }
      })
      // for (let i = 0; i < _length; i++) {
      //   this.tableDataChild.push({
      //     row_index: i + 1
      //   })
      // }
      this.tableData = teacherConversion
    },
    //  参课统计 数据格式化
    formatTableData(list) {
      // list = [
      //   {
      //     sup: 'S2',
      //     teacher_id: '80',
      //     teacher_name: '周艺达',
      //     department_id: '19',
      //     department_name: '3部S2战队',
      //     student_nums: '95',
      //     total_nums: '285',
      //     total_join_nums: '28',
      //     total_join_rate: '9.82%',
      //     total_complete_nums: '157',
      //     total_complete_rate: '55.09%',
      //     completeArr: [
      //       {
      //         current_lesson: 'W1D3',
      //         sum: '95',
      //         join_nums: '14',
      //         join_rate: '14.74%',
      //         complete_nums: '35',
      //         complete_rate: '36.84%'
      //       },
      //       {
      //         current_lesson: 'W1D1',
      //         sum: '95',
      //         join_nums: '6',
      //         join_rate: '6.32%',
      //         complete_nums: '67',
      //         complete_rate: '70.53%'
      //       },
      //       {
      //         current_lesson: 'W1D2',
      //         sum: '95',
      //         join_nums: '8',
      //         join_rate: '8.42%',
      //         complete_nums: '55',
      //         complete_rate: '57.89%'
      //       }
      //     ]
      //   },
      //   {
      //     sup: 'S2',
      //     teacher_id: '79',
      //     teacher_name: '张晨阳',
      //     department_id: '19',
      //     department_name: '3部S2战队',
      //     student_nums: '94',
      //     total_nums: '282',
      //     total_join_nums: '39',
      //     total_join_rate: '13.83%',
      //     total_complete_nums: '152',
      //     total_complete_rate: '53.9%',
      //     completeArr: [
      //       {
      //         current_lesson: 'W1D3',
      //         sum: '94',
      //         join_nums: '12',
      //         join_rate: '12.77%',
      //         complete_nums: '42',
      //         complete_rate: '44.68%'
      //       },
      //       {
      //         current_lesson: 'W1D1',
      //         sum: '94',
      //         join_nums: '10',
      //         join_rate: '10.64%',
      //         complete_nums: '65',
      //         complete_rate: '69.15%'
      //       },
      //       {
      //         current_lesson: 'W1D2',
      //         sum: '94',
      //         join_nums: '17',
      //         join_rate: '18.09%',
      //         complete_nums: '45',
      //         complete_rate: '47.87%'
      //       }
      //     ]
      //   }
      // ]
      // 初始化
      this.tableDataChildAttend = []
      list.forEach((item, index) => {
        const completeArr = item.completeArr || []
        const childLength = completeArr.length
        if (this.tableDataChildAttend.length <= childLength) {
          this.tableDataChildAttend = completeArr
        }
      })
      this.tableDataAttend = list
    },
    // 点击tabs页签（转化统计 按钮）
    statisticsTypehandleClick(tab) {
      this.tableDataAttend = []
      this.tableData = []
      // console.log(tab.index, 'tab')
      this.tabQuery.page = 1
      this.getChangecListByProid()
    },
    // 更多 下拉框
    handleCommand(command) {
      const { period = '' } = command
      this.tabIndex = 6

      this.selectName = command.period_name
      Object.assign(this.tabQuery, {
        page: 1,
        period
      })
      this.getChangecListByProid()
    },
    top_tabs_click(index, statusInfo) {
      this.tabIndex = 0
      this.btnIndex = index
      const { status } = statusInfo

      this.tabQuery.status = status
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
    }
    // 如果返回的 ’conversion_rate_daily‘(this.tableDataChild) 字段为空数组，则：模拟一个列
    // if (!this.tableDataChild.length) {
    //   this.tableDataChild = [
    //     {
    //       label: `暂无数据`,
    //       children: [
    //         { label: '订单数', value: `暂无数据` },
    //         { label: '转化率', value: `暂无数据` },
    //         { label: '总金额', value: `暂无数据` }
    //       ]
    //     }
    //   ]
    // }
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
    margin: 0 10px 10px 10px;
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
    height: 50px;
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
