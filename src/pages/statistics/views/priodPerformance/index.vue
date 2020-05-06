<!--
 * @Descripttion: 按期汇总分析
 * @version:
 * @Author: Shentong
 * @Date: 2020-04-02 15:35:27
 * @LastEditors: Shentong
 * @LastEditTime: 2020-05-06 21:36:16
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
                  :command="tab"
                  >{{ tab.period_name }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="sear-container">
            <statictics-search
              @searchChange="searchChange"
              v-if="showSearch"
            ></statictics-search>
          </div>
          <p class="descripte" v-if="currentPriodStatistic">
            开课日期：<span class="label-val">{{
              currentPriodStatistic.course_day || '-'
            }}</span>
            结课日期：
            <span class="label-val">{{
              currentPriodStatistic.end_course_day || '-'
            }}</span
            >开课天数
            <span class="label-val"
              >{{ currentPriodStatistic.startCourseDay }} 天</span
            >
            <span> 社群销售 </span>
            <span class="for-light">{{
              searchStatistic.teacherNum || '-'
            }}</span>
            <span> 体验学生 </span>
            <span class="for-light">{{
              searchStatistic.trialStudentNum || '-'
            }}</span>
            <span> 总转化率 </span>
            <span class="for-light">{{
              searchStatistic.systemConversion || '-'
            }}</span>
            <span> 系统课支付学生 </span>
            <span class="for-light">{{
              searchStatistic.systemStudentNum || '-'
            }}</span>
            <span> 支付总金额 </span>
            <span class="for-light">{{
              searchStatistic.systemTotalAmount || '-'
            }}</span>
          </p>
          <div class="orderStyle">
            <ele-table
              :tableSize="'small'"
              :dataList="tableData"
              :loading="flags.loading"
              :size="tabQuery.size"
              :page="tabQuery.page"
              :total="totalElements"
              @pageChange="pageChange_handler"
              class="mytable"
            >
              <el-table-column label="转化总金额排名" width="110" align="center"
                ><template slot-scope="scope"
                  ><span v-if="tabQuery.totalSort === 'desc'"
                    >{{ scope.$index + calcIndex }}
                  </span>
                  <span v-else>{{
                    Math.abs(totalElements - calcIndex - scope.$index + 1)
                  }}</span>
                </template></el-table-column
              >
              <el-table-column label="级别" width="50" align="center">
                <template slot-scope="scope">
                  <span v-if="+scope.row.sup">{{ `S${scope.row.sup}` }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="部门"
                min-width="140"
                align="center"
                prop="department_name"
              ></el-table-column>
              <el-table-column
                label="社群销售"
                prop="realname"
                min-width="80"
                align="center"
              ></el-table-column>
              <el-table-column
                label="体验学生数"
                min-width="85"
                prop="trial_course_count"
                align="center"
              ></el-table-column>
              <el-table-column
                label="无收货地址"
                min-width="80"
                prop="no_address_count"
                align="center"
              ></el-table-column>
              <el-table-column
                label="微信添加率"
                min-width="80"
                prop="addWechatRate"
                align="center"
              ></el-table-column>
              <el-table-column
                label="参课率"
                min-width="80"
                prop="joinCourseRate"
                align="center"
              ></el-table-column>
              <el-table-column
                label="完课率"
                min-width="80"
                prop="compCourseRate"
                align="center"
              ></el-table-column>
              <el-table-column
                label="人均上传作品"
                min-width="100"
                prop="uploadTaskRate"
                align="center"
              ></el-table-column>
              <el-table-column
                label="作品点评率"
                min-width="80"
                prop="commentTaskRate"
                align="center"
              ></el-table-column>
              <el-table-column
                label="查看点评率"
                min-width="80"
                prop="lookCommentRate"
                align="center"
              ></el-table-column>
              <el-table-column
                label="支付学生数"
                min-width="80"
                prop="system_order_count"
                align="center"
              ></el-table-column>
              <el-table-column label="转化率" width="80" prop="transferRate">
                <template slot="header">
                  <div @click="onSortConversion" class="sort-operate-box">
                    <span>转化率</span>
                    <!-- TODO: -->
                    <!-- <div class="sort-icon-arrow">
                      <i
                        class="el-icon-caret-top top-color"
                        :class="{ active: conversionStatus }"
                      ></i>
                      <i
                        class="el-icon-caret-bottom bottom"
                        :class="{ active: !conversionStatus }"
                      ></i>
                    </div> -->
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="支付总金额"
                prop="system_order_total_amount"
                align="center"
                min-width="100"
              >
                <template slot="header">
                  <div @click="onSortAmount" class="sort-operate-box">
                    <span>支付总金额</span>
                    <div class="sort-icon-arrow">
                      <i
                        class="el-icon-caret-top top-color"
                        :class="{ active: amountStatus }"
                      ></i>
                      <i
                        class="el-icon-caret-bottom bottom"
                        :class="{ active: !amountStatus }"
                      ></i>
                    </div>
                  </div> </template
              ></el-table-column>
            </ele-table>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import _ from 'lodash'
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
          status: 'not_start',
          label: '招生中'
        },
        {
          status: 'over',
          label: '已结课'
        }
      ],
      // 默认降序
      conversionStatus: 0,
      amountStatus: 0,
      priodTabs: [],
      priodTabsEnd: [],
      flags: {
        loading: false
      },
      tabQuery: {
        size: 20,
        page: 1,
        rateSort: 'desc',
        totalSort: 'desc'
      },
      // 总页数
      totalElements: 0,
      // 表格数据
      statisticsInfo: {},
      // 表格上面的数据统计
      searchStatistic: {},
      tableData: [],
      proidList: [],
      tableDatasss: [],
      currentPriodStatistic: {},
      searchEmit: {},
      showSearch: true
    }
  },
  computed: {
    calcIndex() {
      return this.tabQuery.size * (this.tabQuery.page - 1) + 1
    }
  },
  created() {
    this.init()
  },
  methods: {
    // TODO
    onSortConversion() {
      if (this.tabQuery.rateSort === 'desc') {
        this.tabQuery.rateSort = 'asc'
      } else this.tabQuery.rateSort = 'desc'
      this.conversionStatus = !this.conversionStatus
    },
    onSortAmount() {
      if (this.tableData.length) {
        // 添加排序参数TODO:
        if (this.tabQuery.totalSort === 'desc') {
          this.tabQuery.totalSort = 'asc'
        } else this.tabQuery.totalSort = 'desc'

        this.tabQuery.page = 1
        this.getStatisticsByProid().then((content) => {
          if (content.length) this.amountStatus = !this.amountStatus
        })
      }
    },
    async init(status = 'on_going') {
      const params = { status }

      const proidList = await this.getPriodByStatus(params)
      this.proidList = proidList || []

      if (proidList.length) {
        this.priodTabs = proidList.slice(0, 5)
        this.priodTabsEnd = proidList.slice(5)

        const { period = '' } = proidList[0]
        this.tabQuery.period = period

        this.currentPriodStatistic = this.getStaByProid(period)

        this.getListAndSearchSta()
      }
    },
    // 遍历期数,获取当前期下的统计结果
    getStaByProid(period) {
      const _index = this.proidList.findIndex((item) => item.period === period)
      return this.proidList[_index]
    },
    // 获取期数 ---- 通过状态‘进行中’、‘已结课’，‘招生中’
    async getPriodByStatus(params) {
      try {
        const {
          data: { ManagementStatusList: proidList }
        } = await this.$http.Statistics.getPriodByStatus(params)

        this.calcStartCourseDay(proidList)

        return proidList
      } catch (err) {
        console.log(err)
      }
    },
    // 通过期数、销售部门、社群销售、难度条件过滤 数量统计接口
    async getCountStatisticBySearch() {
      try {
        const {
          data: { termDepartmentReport: searchStatistic }
        } = await this.$http.Statistics.getCountStatisticBySearch(this.tabQuery)
        // 系统课转化率/ 体验课
        const { trialStudentNum = 0, systemStudentNum = 0 } = searchStatistic
        const rate = +trialStudentNum
          ? ((+systemStudentNum / +trialStudentNum) * 100).toFixed(2)
          : 0
        searchStatistic.systemConversion = `${rate}%`
        this.searchStatistic = searchStatistic
      } catch (err) {
        console.log(err)
      }
    },
    // table列表
    async getStatisticsByProid() {
      // TODO:
      this.flags.loading = true
      try {
        let {
          data: { termDepartmentTeacherReportPage: statisticsByPriodList }
        } = await this.$http.Statistics.getStatisticsByProid(this.tabQuery)

        !statisticsByPriodList && (statisticsByPriodList = {})

        const { content = [], totalElements = 0 } = statisticsByPriodList

        this.totalElements = +totalElements

        this.pakageListDate(content)

        this.tableData = content
        this.flags.loading = false

        return content
      } catch (err) {
        console.log(err)
        this.flags.loading = false
      }
    },
    // 包装 table接口返回的数据
    pakageListDate(tableList) {
      tableList.forEach((item, index) => {
        item.addWechatRate = this.calcRate(
          item.added_wechat_count,
          item.trial_course_count
        )
        item.joinCourseRate = this.calcRate(
          item.join_course_count,
          item.send_course_count
        )
        item.compCourseRate = this.calcRate(
          item.complete_course_count,
          item.send_course_count
        )
        // 人均上传作品
        const uploadTaskRate = +item.trial_course_count
          ? +item.task_count / +item.trial_course_count
          : 0
        item.uploadTaskRate = uploadTaskRate.toFixed(2)
        item.commentTaskRate = this.calcRate(
          item.task_comment_count,
          item.task_count
        )
        item.lookCommentRate = this.calcRate(
          item.listen_comment_count,
          item.task_comment_count
        )
        item.transferRate = this.calcRate(
          item.system_order_count,
          item.trial_course_count
        )
      })
    },
    // 计算开课天数
    calcStartCourseDay(proidList) {
      proidList.forEach((item, index) => {
        const now = new Date().getTime()
        // 开课时间
        const courseDay = +item.course_day
          ? new Date(+item.course_day).setHours(0, 0, 0, 0)
          : 0
        // 结课时间
        const EndCourseDay = +item.end_course_day
          ? new Date(+item.end_course_day).setHours(0, 0, 0, 0)
          : 0
        let startCourseDay = 0
        // 如果当前时间 大于 结课时间，说明本期课已进行完毕
        if (EndCourseDay && now > EndCourseDay) {
          const diffTime = Number(EndCourseDay) - Number(courseDay)
          startCourseDay = Math.floor(diffTime / (24 * 3600 * 1000)) + 1
        } else if (
          courseDay &&
          EndCourseDay &&
          now > courseDay &&
          now < EndCourseDay
        ) {
          // 当前时间 大于 开课时间，小于结课时间
          const diffTime = Number(now) - Number(courseDay)
          startCourseDay = Math.floor(diffTime / (24 * 3600 * 1000)) + 1
        } else {
          startCourseDay = 0
        }
        // 格式化时间
        item.course_day = courseDay ? formatData(courseDay) : ''
        item.end_course_day = EndCourseDay ? formatData(EndCourseDay) : ''

        item.startCourseDay = startCourseDay
      })
    },
    // 计算 xx率
    calcRate(num, den) {
      const rate = +den ? ((+num / +den) * 100).toFixed(2) : 0
      return `${rate}%`
    },
    // 获取列表数据以及列表上的统计数据
    getListAndSearchSta() {
      this.getStatisticsByProid()
      this.getCountStatisticBySearch()
    },

    // 组件emit
    searchChange(res) {
      this.initSearchData(res, true)

      this.getListAndSearchSta()
    },
    initSearchData(res, isFromEmit = false) {
      // 如果是子组件emit而来的数据，则不需要清空
      if (!isFromEmit) {
        this.showSearch = false
        this.$nextTick(() => {
          this.showSearch = true
        })
      }

      this.searchEmit = _.cloneDeep(res)

      const { department = [], groupSell = '', sup = [] } = this.searchEmit
      Object.assign(this.tabQuery, {
        teacher: groupSell,
        department: department.join(),
        sup: sup.join()
      })
    },
    // 更多 下拉框
    handleCommand(command) {
      this.initSearchData({})

      const { period = '' } = command

      this.tabIndex = 6
      this.selectName = command.period_name || ''
      this.tabQuery.page = 1
      this.tabQuery.period = period

      this.getListAndSearchSta()

      this.currentPriodStatistic = this.getStaByProid(period)
    },
    // 点击  ’进行中、已结课、招生中‘ 按钮
    top_tabs_click(index, statusInfo) {
      this.initSearchData({})

      this.tabIndex = 0
      this.btnIndex = index
      const { status } = statusInfo
      this.init(status)
    },
    // 点击期数
    priod_tabs_click(row, index) {
      this.initSearchData({})

      const { period = '' } = row
      this.tabIndex = index
      this.tabQuery.page = 1
      this.tabQuery.period = period

      this.getListAndSearchSta()

      this.currentPriodStatistic = this.getStaByProid(period)

      this.selectName = '更多'
    },
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      this.tabQuery.page = page
      this.getStatisticsByProid()
    }
  }
}
</script>
<style lang="scss" scoped>
.schedule-container {
  .sort-operate-box {
    position: relative;
    .sort-icon-arrow {
      display: inline-block;
      position: relative;
      top: -2px;
      .top {
        position: absolute;
        bottom: 0;
      }
      .active {
        color: #409eff;
      }
      .top-color {
        position: absolute;
        bottom: 0;
      }
      .bottom {
        position: absolute;
        top: -6px;
      }
      .bottom-color {
        position: absolute;
        top: -6px;
      }
    }
  }
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
      height: 40px;
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
      margin-right: 5px;
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
