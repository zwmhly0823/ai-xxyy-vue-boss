<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-05-14 14:11:21
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-07 22:04:02
 -->
<template>
  <el-row type="flex" class="app-main team-container">
    <el-col class="team-container-content">
      <div class="grid-content">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="header-search-container" border>
            <table-search
              v-if="showSearch"
              @change="searchChange"
              :regType="regType"
            ></table-search>
          </div>
          <div class="tabs-operate">
            <div
              v-for="(team, index) in teamStatus"
              :key="index"
              :class="{ active: index == teamIndex }"
              @click="team_tabs_click(team, index)"
            >
              <span>{{ team.title }}</span>
            </div>
          </div>
          <div ref="tableContainer">
            <ele-table
              :tableHeight="tableHeight"
              :tableSize="'small'"
              :dataList="tableData"
              :loading="flags.loading"
              :size="tabQuery.size"
              :page="tabQuery.page"
              :total="totalElements"
              :showAllTotalNum="true"
              @pageChange="pageChange_handler"
              class="mytable add-first-cell-bg"
            >
              <el-table-column
                label="班级名称"
                min-width="110"
                align="center"
                prop="team_name"
              >
                <template slot-scope="scope">
                  <span
                    @click="goTeamDetail(scope.row)"
                    class="team-name-pointer"
                  >
                    {{ scope.row.team_name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="服务组"
                min-width="120"
                prop="department_name"
                align="center"
              ></el-table-column>
              <el-table-column
                label="辅导老师"
                width="80"
                prop="teacher_realname"
                align="center"
              ></el-table-column>
              <el-table-column
                label="班级人数"
                min-width="80"
                align="center"
                prop="student_count"
              >
                <template slot-scope="scope">
                  <span
                    >{{ scope.row.student_count }}/{{
                      scope.row.pre_enroll
                    }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="待加好友"
                min-width="70"
                prop="unadd_wechat"
                align="center"
              >
                <template slot="header">
                  <div
                    @click="onSortSystemCount('unadd_wechat')"
                    class="sort-operate-box"
                  >
                    <span>待加好友</span>
                    <div class="sort-icon-arrow">
                      <i
                        class="el-icon-caret-top top-color"
                        :class="{
                          active:
                            sortKeys['unadd_wechat'] == 'asc' &&
                            sortActive == 'unadd_wechat'
                        }"
                      ></i>
                      <i
                        class="el-icon-caret-bottom bottom"
                        :class="{
                          active:
                            sortKeys['unadd_wechat'] != 'asc' &&
                            sortActive == 'unadd_wechat'
                        }"
                      ></i>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="待发货"
                min-width="60"
                prop="to_be_delivered_count"
                align="center"
              >
                <template slot="header">
                  <div
                    @click="onSortSystemCount('to_be_delivered_count')"
                    class="sort-operate-box"
                  >
                    <span>待发货</span>
                    <div class="sort-icon-arrow">
                      <i
                        class="el-icon-caret-top top-color"
                        :class="{
                          active:
                            sortKeys['to_be_delivered_count'] == 'asc' &&
                            sortActive == 'to_be_delivered_count'
                        }"
                      ></i>
                      <i
                        class="el-icon-caret-bottom bottom"
                        :class="{
                          active:
                            sortKeys['to_be_delivered_count'] != 'asc' &&
                            sortActive == 'to_be_delivered_count'
                        }"
                      ></i>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="今日完课"
                min-width="70"
                prop="today_complete_course_count"
                align="center"
                v-if="!hideMutileTab"
              >
                <template slot="header">
                  <div
                    @click="onSortSystemCount('today_complete_course_count')"
                    class="sort-operate-box"
                  >
                    <span>今日完课</span>
                    <div class="sort-icon-arrow">
                      <i
                        class="el-icon-caret-top top-color"
                        :class="{
                          active:
                            sortKeys['today_complete_course_count'] == 'asc' &&
                            sortActive == 'today_complete_course_count'
                        }"
                      ></i>
                      <i
                        class="el-icon-caret-bottom bottom"
                        :class="{
                          active:
                            sortKeys['today_complete_course_count'] != 'asc' &&
                            sortActive == 'today_complete_course_count'
                        }"
                      ></i>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="昨日完课"
                min-width="70"
                prop="yesterday_complete_course_count"
                align="center"
                v-if="!hideMutileTab"
              >
                <template slot="header">
                  <div
                    @click="
                      onSortSystemCount('yesterday_complete_course_count')
                    "
                    class="sort-operate-box"
                  >
                    <span>昨日完课</span>
                    <div class="sort-icon-arrow">
                      <i
                        class="el-icon-caret-top top-color"
                        :class="{
                          active:
                            sortKeys['yesterday_complete_course_count'] ==
                              'asc' &&
                            sortActive == 'yesterday_complete_course_count'
                        }"
                      ></i>
                      <i
                        class="el-icon-caret-bottom bottom"
                        :class="{
                          active:
                            sortKeys['yesterday_complete_course_count'] !=
                              'asc' &&
                            sortActive == 'yesterday_complete_course_count'
                        }"
                      ></i>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="老师微信"
                min-width="120"
                prop="teacher_wechat_no"
                align="center"
              ></el-table-column>
              <el-table-column
                label="班级状态"
                min-width="70"
                prop="teamStatus"
                align="center"
                v-if="teamIndex == 4"
              ></el-table-column>
              <el-table-column
                label="课程进度"
                min-width="110"
                prop="current_lesson"
                align="center"
                v-if="!hideProgress"
              ></el-table-column>
              <el-table-column
                label="开课时间"
                min-width="100"
                prop="course_day"
                align="center"
              ></el-table-column>
              <el-table-column
                label="结课时间"
                min-width="120"
                prop="end_course_day"
                align="center"
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
import TableSearch from '../../components/tableSearch/index'
import { calculateWD } from '@/utils/validate'
import EleTable from '@/components/Table/EleTable'
import { formatData, openBrowserTab } from '@/utils/index'
// import ScheduleTable from './components/index.vue'

export default {
  props: [],
  components: {
    TableSearch,
    EleTable
  },
  data() {
    return {
      regType: 1, // 0 体验课，1 系统课
      teamIndex: 0,
      tableHeight: 'auto',
      flags: {
        loading: false
      },
      sortKeys: {
        system_order_count: 'asc',
        unadd_wechat: 'asc',
        today_complete_course_count: 'asc',
        yesterday_complete_course_count: 'asc',
        to_be_delivered_count: 'asc',
        order_conversion_rate: 'asc'
      },
      // 总页数
      totalElements: 0,
      tableData: [],
      tabQuery: {
        size: 20,
        page: 1,
        courseDay: ''
      },
      searchEmit: {},
      showSearch: true,
      sortActive: 'system_order_count',
      teamStatusKeyVal: {
        0: '待开课',
        1: '上课中',
        2: '已结课'
      },
      teamStatus: [
        {
          teamState: '0',
          title: '待开课',
          courseDay: ''
        },
        // {
        //   teamState: '1',
        //   title: '今日开课',
        //   courseDay: new Date(new Date().getTime()).setHours(0, 0, 0, 0)
        // },
        {
          teamState: '1',
          title: '上课中',
          courseDay: ''
        },
        {
          teamState: '2',
          title: '已结课',
          courseDay: ''
        },
        {
          teamState: '0,1,2',
          title: '全部班级',
          courseDay: ''
        }
      ]
    }
  },
  async created() {
    // const params = {
    //   teacherId: isToss() || ''
    // }

    // await this.getAllTeacherByRole(params)
    this.getTrialTeamList(this.tabQuery)
  },
  computed: {
    /** 待开课&全部班级: 课程进度隐藏 */
    hideProgress() {
      return [0, 1, 2, 3].includes(this.teamIndex)
    },
    /** 上课中&已结课: 今日完课、昨日完课 */
    hideMutileTab() {
      return [0, 1, 2, 3].includes(this.teamIndex)
    }
  },
  mounted() {
    this.calcTableHeight()
  },
  watch: {},
  methods: {
    goTeamDetail(row) {
      const id = row.id || ''
      const teamType = row.team_type || '1'
      this.$store.commit('setTeamItem', row)

      // id &&
      //   this.$router.push({
      //     path: `/teamDetail/${id}/${teamType}`
      //   })
      id &&
        openBrowserTab(
          `/write_app/#/teamDetail/${id}/${teamType}`,
          `${row.team_name}`
        )
    },
    onSortSystemCount(sortKey) {
      if (this.tableData.length) {
        if (this.sortKeys[sortKey] === 'desc') {
          this.sortKeys[sortKey] = 'asc'
        } else this.sortKeys[sortKey] = 'desc'

        Object.assign(this.tabQuery, {
          page: 1,
          sort: `{"${sortKey}":"${this.sortKeys[sortKey]}"}`
        })
        this.getTrialTeamList(this.tabQuery).then((content) => {
          this.sortActive = sortKey
          // if (content.length) this.amountStatus = !this.amountStatus
        })
      }
    },
    // 组件emit
    searchChange(res) {
      // 判断当前社群销售的老师是否属于当前老师权限
      // const { teacherId = '' } = res
      // if (teacherId && !this.tabQuery.teacherIdArr.includes(teacherId)) {
      //   this.$message({
      //     message: '当前社群销售不属于该老师团队',
      //     type: 'warning'
      //   })
      //   return
      // }

      this.initSearchData(res, true)
      this.getTrialTeamList(this.tabQuery)
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

      const {
        term = [],
        department = [],
        teacherId = '',
        sup = [],
        teamName = '',
        category = ''
      } = this.searchEmit

      Object.assign(this.tabQuery, {
        term,
        teamName,
        sup,
        department,
        teacherId,
        category,
        page: 1
      })
      // this.getTrialTeamList(this.tabQuery)
    },
    // async getAllTeacherByRole(params) {
    //   const teacherIds = await this.$http.Permission.getAllTeacherByRole(params)
    //   this.tabQuery.teacherIdArr = teacherIds
    // },
    // 条件查询列表
    async getTrialTeamList(params) {
      this.flags.loading = true
      try {
        const {
          data: {
            StudentSystemTeamStatisticsPage: { content = [], totalElements }
          }
        } = await this.$http.writeApp.Team.getSystemTeamList(params)
        // 总数、分页用
        this.totalElements = +totalElements || 0
        this.pakageListData(content)
        this.tableData = content
      } catch (err) {
        console.log('err', err)
      } finally {
        this.flags.loading = false
      }
    },
    // 组装table接口返回数据
    pakageListData(list) {
      list.forEach((item) => {
        item.course_day = +item.course_day ? formatData(item.course_day) : ''
        item.end_course_day = +item.end_course_day
          ? formatData(item.end_course_day)
          : ''
        item.ctime = +item.ctime ? formatData(item.ctime) : ''
        item.utime = +item.utime ? formatData(item.utime) : ''
        item.WD = item.current_lesson ? calculateWD(item.current_lesson) : ''
        item.teamStatus = item.team_state
          ? this.teamStatusKeyVal[+item.team_state]
          : ''
      })
    },
    team_tabs_click(team, index) {
      this.teamIndex = index
      // 更新:不要清空筛选 https://www.tapd.cn/61055427/prong/stories/view/1161055427001005799
      // this.initSearchData({})
      Object.assign(this.tabQuery, team, {
        page: 1
      })
      this.getTrialTeamList(this.tabQuery)
    },
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      this.tabQuery.page = page
      this.getTrialTeamList(this.tabQuery)
    },
    calcTableHeight() {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
        const tableTopHeight = this.$refs.tableContainer.getBoundingClientRect()
          .y
        //  document.body.clientHeight 返回body元素内容的高度
        const tableHeight = document.body.clientHeight - tableTopHeight - 60
        this.tableHeight = tableHeight + ''
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.team-container {
  &-content {
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
  }
  .team-name-pointer {
    cursor: pointer;
    color: #2a75ed;
  }
  // 排序css
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
        color: #2a75ed;
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
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header-search-container {
      // height: 50px;
      display: flex;
      padding-left: 15px;
      border-bottom: 1px solid #eee;
    }
    .tabs-operate {
      height: 40px;
      background: #f5f7fa;
      display: flex;
      > div {
        height: 100%;
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
  }
}
</style>
<style lang="scss">
.add-first-cell-bg > .el-table tbody tr:hover > td:first-child {
  background-color: #2a75ed !important;
  .team-name-pointer {
    color: #ffffff;
  }
}
.grid-content .scrollbar-wrapper {
  overflow-x: hidden;
}
.grid-content .el-scrollbar {
  flex: 1;
}
</style>
