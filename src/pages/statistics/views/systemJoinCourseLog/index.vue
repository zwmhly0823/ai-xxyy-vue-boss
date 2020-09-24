<!--
 * @Descripttion: 系统课 - 完课统计
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-09-21 15:00:30
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-24 18:46:49
-->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container">
      <div class="course-log">
        <!-- search -->
        <search />

        <!-- 统计信息 -->
        <div class="statistics-info d-flex">
          <p>
            系统课学员
            <span class="primary-text">{{ summary.student_count || 0 }}</span>
          </p>
          <p>
            参课率
            <span class="primary-text"
              >{{ summary.join_course_rate || 0 }}%</span
            >
          </p>
          <p>
            完课率
            <span class="primary-text"
              >{{ summary.complete_course_rate || 0 }}%</span
            >
          </p>
        </div>

        <!-- dom -->
        <div class="tableInner" ref="tableInner"></div>
        <!-- list -->
        <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="loading"
          :height="tableHeight"
        >
          <el-table-column prop="sup" label="难度级别" min-width="70">
          </el-table-column>
          <el-table-column label="班主任" min-width="80">
            <template slot-scope="scope">
              {{
                (scope.row.teacherInfo && scope.row.teacherInfo.realname) || '-'
              }}
            </template>
          </el-table-column>
          <el-table-column label="服务组" min-width="130">
            <template slot-scope="scope">
              {{
                (scope.row.teacherInfo &&
                  scope.row.teacherInfo.department_name) ||
                  '-'
              }}
            </template>
          </el-table-column>
          <el-table-column label="用户信息" min-width="180">
            <template slot-scope="scope">
              <p
                v-if="scope.row.userExtends"
                class="primary-text"
                @click="openUserDetail(scope.row.userExtends)"
              >
                {{ scope.row.userExtends.mobile }} -
                {{ scope.row.userExtends.username }}
              </p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column label="用户状态" min-width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.userExtends">
                {{ scope.row.userExtends.status_text || '-' }}
              </p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column label="课程名称" min-width="140">
            <template slot-scope="scope">
              <p>
                {{ scope.row.lesson || '-' }}
              </p>
              <p>{{ scope.row.title || '-' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="ctime" label="放课时间" min-width="140">
          </el-table-column>
          <el-table-column
            prop="join_course_time"
            label="参课时间"
            min-width="140"
          >
          </el-table-column>
          <el-table-column
            prop="complete_course_time"
            label="完课时间"
            min-width="140"
          >
          </el-table-column>
          <el-table-column label="班级信息" min-width="140">
            <template slot-scope="scope">
              <p
                v-if="scope.row.teamInfo"
                @click="openTeamDetail(scope.row.teamInfo)"
                class="primary-text"
              >
                {{ scope.row.teamInfo.team_name || '-' }}
              </p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <!-- <el-table-column label="期数" min-width="80">
            <template slot-scope="scope">
              <p v-if="scope.row.management">
                {{ scope.row.management.period_name || '-' }}
              </p>
              <p v-else>-</p>
            </template>
          </el-table-column> -->
        </el-table>

        <!-- 分页 -->
        <m-pagination
          :current-page="currentPage"
          :page-count="totalPages"
          :total="totalElements"
          @current-change="handleSizeChange"
          show-pager
        />
      </div>
    </div>
  </el-row>
</template>

<script>
import { formatData, openBrowserTab } from '@/utils/index'
import MPagination from '@/components/MPagination/index.vue'
import Search from './components/Search'
export default {
  components: {
    MPagination,
    Search
  },
  data() {
    return {
      loading: false,
      tableData: [],
      totalPages: 1,
      totalElements: 0,
      currentPage: 1,
      searchParams: null,
      summary: {},
      tableHeight: 0
    }
  },

  created() {
    this.getData()
    this.getSummary()
  },

  methods: {
    // 获取列表数据
    getData() {
      this.loading = true
      const page = this.currentPage
      this.$http.Statistics.getStudentSystemJoinCoursePage(
        this.searchParams,
        page
      )
        .then((res) => {
          if (res?.data?.StudentSystemJoinCourseDetailPage) {
            const {
              content = [],
              totalPages = 1,
              totalElements = 0
            } = res.data.StudentSystemJoinCourseDetailPage
            // this.tableData = content
            this.setData(content)
            this.totalPages = +totalPages
            this.totalElements = +totalElements
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 重新组合数据
    setData(data = []) {
      const list = data.map((item) => {
        item.join_course_time =
          (item.join_course_time && formatData(item.join_course_time, 's')) ||
          '-'
        item.complete_course_time =
          (item.complete_course_time &&
            formatData(item.complete_course_time, 's')) ||
          '-'
        // 放课时间
        item.ctime = (item.ctime && formatData(item.ctime, 's')) || '-'
        item.sup = item.sup || '-'
        // item.course_tilte = `${item.lesson} · ${item.title}`
        return item
      })
      this.tableData = list
      this.calcTableHeight()
    },

    // 获取统计数据
    async getSummary() {
      const {
        data: { StudentSystemJoinCourseDetailSummary = {} }
      } = await this.$http.Statistics.getStudentSystemJoinCourseDetailSummary(
        this.searchParams || {}
      )
      this.summary = StudentSystemJoinCourseDetailSummary || {}
    },

    openUserDetail(user) {
      if (!user || !user.u_id) return
      openBrowserTab(`/users/#/details/${user.u_id}`)
    },
    openTeamDetail(team) {
      if (!team || !team.id) return
      // const type = team.team_type || '1'
      const type = '1'
      openBrowserTab(`/student-team/#/teamDetail/${team.id}/${type}`)
    },
    // page
    handleSizeChange(page) {
      this.currentPage = page
      this.getData()
    },
    calcTableHeight() {
      this.$nextTick(() => {
        const tableHeight =
          document.body.clientHeight - this.$refs.tableInner.offsetTop - 90
        this.tableHeight = tableHeight + ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.course-log {
  .statistics-info {
    margin: 20px 10px;
    p {
      margin-right: 15px;
    }
  }
  .m-pagination {
    background-color: transparent;
  }
}
</style>
