<!--
 * @Descripttion: 数据看板 - 列表
 * @version: 1.0.0
 * @Author: shasen
 * @Date: 2020-11-02 22:35:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-01 11:14:14
-->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container">
      <!-- container -->
      <div class="part-time-container">
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
              {{ selectName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="el-dropdown-wrapper2" slot="dropdown">
              <el-dropdown-item
                v-for="(tab, index) in priodTabsEnd"
                :key="index"
                :command="tab"
                ><span>{{ tab.period_name }}</span></el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div style="display:flex;padding:10px 0;">
          <el-form :inline="true" label-position="right" label-width="100px">
            <el-form-item label="兼职老师:">
              <div class="search-group">
                <Department
                  name="teacher_id"
                  placeholder="选择兼职组"
                  :multiple="false"
                  isParttimeTeacher
                  @result="getSelectDepartment"
                />
                <GroupSell
                  tip="请选择老师"
                  :teacherscope="handoverTeacherScope"
                  return-list
                  @result="getSelectTeacher"
                  name="teacher_id"
                  class="margin_l10"
                />
              </div>
            </el-form-item>
            <el-form-item label="配置部组:">
              <div class="search-group">
                <Department
                  name="bind_department_id"
                  placeholder="选择兼职组"
                  :multiple="false"
                  :onlyDept="1"
                  isArtsBackService
                  @result="getSelectParttime"
                />
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="orderStyle" ref="tableContainer">
          <ele-table
            :tableHeight="tableHeight"
            :tableSize="'small'"
            :dataList="tableData"
            :size="size"
            :page="page"
            :total="totalElements"
            :showAllTotalNum="true"
            @pageChange="pageChange_handler"
            class="mytable"
          >
            <el-table-column label="ID" width="150" align="center"
              ><template slot-scope="scope"
                ><span>{{ scope.row.teacher_id }} </span>
              </template></el-table-column
            >
            <el-table-column label="姓名" width="80" align="center"
              ><template slot-scope="scope"
                ><span
                  v-if="scope.row.teacherInfo && scope.row.teacherInfo.realname"
                  >{{ scope.row.teacherInfo.realname }}
                </span>
              </template></el-table-column
            >
            <el-table-column label="兼职老师部组" width="100" align="center"
              ><template slot-scope="scope"
                ><span
                  v-if="
                    scope.row.teacherInfo &&
                      scope.row.teacherInfo.department_name
                  "
                  >{{ scope.row.teacherInfo.department_name }}
                </span>
              </template></el-table-column
            >
            <el-table-column label="配置部组" width="100" align="center"
              ><template slot-scope="scope"
                ><span
                  v-if="
                    scope.row.bind_department_info &&
                      scope.row.bind_department_info.name
                  "
                  >{{ scope.row.bind_department_info.name }}
                </span>
              </template></el-table-column
            >
            <el-table-column label="课中学生数" width="80" align="center"
              ><template slot-scope="scope"
                ><span>{{ scope.row.total_student_count }} </span>
              </template></el-table-column
            >
            <el-table-column label="当期学员总数" width="100" align="center"
              ><template slot-scope="scope"
                ><span>{{ scope.row.dispatch_student_count }} </span>
              </template></el-table-column
            >
            <el-table-column label="作品总数" width="80" align="center"
              ><template slot-scope="scope"
                ><span>{{ scope.row.task_count }} </span>
              </template></el-table-column
            >
            <el-table-column label="参课率" width="80" align="center"
              ><template slot-scope="scope"
                ><span v-if="scope.row.join_course_rate"
                  >{{ scope.row.join_course_rate }}
                </span>
              </template></el-table-column
            >
            <el-table-column label="完课率" width="80" align="center"
              ><template slot-scope="scope"
                ><span v-if="scope.row.complete_course_rate"
                  >{{ scope.row.complete_course_rate }}
                </span>
              </template></el-table-column
            >
            <el-table-column label="续费率" width="80" align="center"
              ><template slot-scope="scope"
                ><span v-if="scope.row.continue_order_rate"
                  >{{ scope.row.continue_order_rate }}
                </span>
              </template></el-table-column
            >
            <el-table-column label="退费率" width="80" align="center"
              ><template slot-scope="scope"
                ><span v-if="scope.row.refund_order_rate"
                  >{{ scope.row.refund_order_rate }}
                </span>
              </template></el-table-column
            >
            <el-table-column label="听点评率" width="80" align="center"
              ><template slot-scope="scope"
                ><span v-if="scope.row.listen_comment_rate"
                  >{{ scope.row.listen_comment_rate }}
                </span>
              </template></el-table-column
            >
            <el-table-column label="今日新增作品" width="100" align="center"
              ><template slot-scope="scope"
                ><span>{{ scope.row.today_task_count }} </span>
              </template></el-table-column
            >
            <el-table-column label="今日待点评作品" width="110" align="center"
              ><template slot-scope="scope"
                ><span>{{ scope.row.today_un_comment_count }} </span>
              </template></el-table-column
            >
            <el-table-column label="超时作品" width="80" align="center"
              ><template slot-scope="scope"
                ><span>{{ scope.row.time_out_task_count }} </span>
              </template></el-table-column
            >
            <el-table-column label="平均点评时长" width="110" align="center"
              ><template slot-scope="scope"
                ><span>{{ scope.row.avg_comment_second }} </span>
              </template></el-table-column
            >
          </ele-table>
        </div>
      </div>
    </div>
  </el-row>
</template>

<script>
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
import EleTable from '@/components/Table/EleTable'
export default {
  name: 'dataprepareList',
  components: {
    Department,
    GroupSell,
    EleTable
  },
  data() {
    return {
      tableHeight: 'auto',
      hasLoadPeriod: false, // 是否已加载完期数列表
      selectName: '更多', // tabs标签默认状态
      handoverTeacherScope: null,
      tabIndex: 0,
      priodTabs: [],
      priodTabsEnd: [],
      proidList: [],
      tableData: [],
      tabQuery: {},
      totalElements: 0,
      size: 20,
      page: 1,
      teachers: []
    }
  },
  created() {
    this.init()
    this.$nextTick(() => {
      const tableHeight =
        document.body.clientHeight - this.$refs.tableContainer.offsetTop - 148
      this.tableHeight = tableHeight + ''
    })
  },
  methods: {
    async init() {
      const params = {
        team_state: [0, 1, 2],
        team_type: { gt: 0 },
        subject: '3'
      }
      const proidList = await this.getPriodByStatus(params)
      this.proidList = proidList.data || []

      if (proidList.length) {
        this.priodTabs = proidList.slice(0, 4)
        this.priodTabsEnd = proidList.slice(4)
        console.log(proidList, 'proidList')
        // this.getListAndSearchSta()
        this.tabQuery = {
          term: proidList[0].period
        }
        this.getCasualTeacherStatistics(this.tabQuery, this.page, this.size)
      }
    },
    // 获取兼职老师数据
    async getCasualTeacherStatistics(params = '', page, size) {
      this.$http.ReviewManage.getCasualTeacherStatisticsPage(
        params,
        page,
        size
      ).then((res) => {
        if (
          res &&
          res.data &&
          res.data.CasualTeacherStatisticsPage &&
          res.data.CasualTeacherStatisticsPage.content
        ) {
          res.data.CasualTeacherStatisticsPage.content.forEach((item) => {
            item.join_course_rate = item.join_course_rate
              ? (item.join_course_rate * 100).toFixed(2) + '%'
              : 0

            item.complete_course_rate = item.complete_course_rate
              ? (item.complete_course_rate * 100).toFixed(2) + '%'
              : 0
            item.continue_order_rate = item.continue_order_rate
              ? (item.continue_order_rate * 100).toFixed(2) + '%'
              : 0
            item.refund_order_rate = item.refund_order_rate
              ? (item.refund_order_rate * 100).toFixed(2) + '%'
              : 0
            item.listen_comment_rate = item.listen_comment_rate
              ? (item.listen_comment_rate * 100).toFixed(2) + '%'
              : 0
            const qq = +item.avg_comment_second
            item.avg_comment_second = qq ? qq.toFixed(2) : 0
          })
          this.tableData = res.data.CasualTeacherStatisticsPage.content
          this.totalElements = Number(
            res.data.CasualTeacherStatisticsPage.totalElements
          )
        }
        console.log(res, 'res')
      })
    },
    // 获取期数
    async getPriodByStatus(params) {
      try {
        const {
          data: { ManagementForTeacherList: proidList }
        } = await this.$http.User.ManagementForTeacherList(params)
        const newproidList = []
        console.log(proidList,"proidList");
        proidList.forEach((item) => {
          if (item.management && item.management.subject === params.subject) {
            newproidList.push(item.management)
          }
        })
        return newproidList
      } catch (err) {
        console.log(err)
      } finally {
        // 此处是为了防止->切换顶部状态后 期数显示抖动
        this.hasLoadPeriod = true
      }
    },
    // 点击期数
    priod_tabs_click(row, index) {
      console.log(row, 'row')
      this.tabIndex = index
      this.selectName = '更多'
      this.tabQuery = {
        ...this.tabQuery,
        term: row.period
      }
      this.page = 1
      this.getCasualTeacherStatistics(this.tabQuery, this.page, this.size)
    },
    // 更多 下拉框
    handleCommand(command) {
      console.log(command, 'command')
      this.tabIndex = 6
      this.selectName = command.period_name || ''
      this.tabQuery = {
        term: command.period
      }
      this.getCasualTeacherStatistics(this.tabQuery, this.page, this.size)
    },
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      // this.tabQuery.page = page
      this.page = page
      this.getCasualTeacherStatistics(this.tabQuery, this.page, this.size)
    },
    // 选择兼职组
    getSelectDepartment(res) {
      console.log(res, 'res')
      this.handoverTeacherScope =
        res.teacher_id.length !== 0 ? res.teacher_id : null

      if (res.teacher_id.length) {
        this.teachers = res.teacher_id
        this.tabQuery = {
          ...this.tabQuery,
          teacher_id: res.teacher_id
        }
      } else {
        this.teachers = []
        delete this.tabQuery.teacher_id
      }
      console.log('111111111')
      this.page = 1
      this.getCasualTeacherStatistics(this.tabQuery, this.page, this.size)
    },
    // 选择老师
    getSelectTeacher(res) {
      console.log(res, 'res-teacher')
      if (res.teacher_id && res.teacher_id.length) {
        this.tabQuery = {
          ...this.tabQuery,
          teacher_id: res.teacher_id
        }
      } else {
        if (this.teachers.length) {
          this.tabQuery = {
            ...this.tabQuery,
            teacher_id: this.teachers
          }
        } else {
          delete this.tabQuery.teacher_id
        }
      }
      this.page = 1
      this.getCasualTeacherStatistics(this.tabQuery, this.page, this.size)
    },
    // 配置部组
    getSelectParttime(res) {
      console.log(res)
      if (res.bind_department_id.length) {
        this.tabQuery = {
          ...this.tabQuery,
          bind_department_id: res.bind_department_id
        }
      } else {
        delete this.tabQuery.bind_department_id
      }
      console.log('111111111')
      this.page = 1
      this.getCasualTeacherStatistics(this.tabQuery, this.page, this.size)
    }
  }
}
</script>

<style lang="scss" scoped>
.part-time-container {
  padding: 10px;
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
.el-dropdown-wrapper2 {
  max-height: 350px;
  overflow: auto;
}
.search-group {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0 !important;
  &-item {
    margin-right: 10px;
  }
}
</style>
