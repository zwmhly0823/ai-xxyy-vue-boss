<template>
  <div class="log-page-class">
    <p class="top-text">已放课程：{{ total }}节</p>
    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      v-loading="loading"
    >
      <el-table-column label="课程名称" min-width="130">
        <template slot-scope="scope"> 《{{ scope.row.title }}》 </template>
      </el-table-column>
      <el-table-column
        prop="lesson_type_name"
        label="课程类型"
        min-width="80"
      ></el-table-column>
      <el-table-column
        prop="send_date"
        label="放课时间"
        min-width="90"
      ></el-table-column>
      <el-table-column label="累计参课人" min-width="80">
        <template slot-scope="scope">
          <span class="red-color">{{ scope.row.join_count || 0 }}</span> /
          {{ scope.row.enrolled }}
        </template>
      </el-table-column>
      <el-table-column label="累计完课人" min-width="80">
        <template slot-scope="scope">
          <span class="red-color">{{ scope.row.complete_count || 0 }}</span> /
          {{ scope.row.enrolled }}
        </template>
      </el-table-column>
      <el-table-column label="累计传作品人" min-width="100">
        <template slot-scope="scope">
          <span class="red-color">{{ scope.row.task_student_count || 0 }}</span>
          / {{ scope.row.enrolled }}
        </template>
      </el-table-column>
      <el-table-column label="累计作品数" min-width="80">
        <template slot-scope="scope">
          <span class="red-color">{{ scope.row.task_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="今日参课人" min-width="80">
        <template slot-scope="scope">
          <span class="red-color">{{
            scope.row.new_today_join_count || 0
          }}</span>
          /
          {{ scope.row.enrolled }}
        </template>
      </el-table-column>
      <el-table-column label="今日完课人" min-width="80">
        <template slot-scope="scope">
          <span class="red-color">{{
            scope.row.new_today_complete_count || 0
          }}</span>
          / {{ scope.row.enrolled }}
        </template>
      </el-table-column>
      <el-table-column label="今日传作品人" min-width="100">
        <template slot-scope="scope">
          <span class="red-color">{{
            scope.row.today_task_student_count || 0
          }}</span>
          / {{ scope.row.enrolled }}
        </template>
      </el-table-column>
      <el-table-column label="今日传作品数" min-width="100">
        <template slot-scope="scope">
          <span class="red-color">{{ scope.row.today_task_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="toDetail(scope.row.course_id)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-class"
      layout="prev, pager, next"
      :total="+total"
      :current-page="currentpage"
      :page-size="pageSize"
      :hide-on-single-page="true"
      @current-change="pageChange"
    ></el-pagination>
  </div>
</template>

<script>
import { openBrowserTab } from '@/utils'
export default {
  name: 'logPageClass',
  props: {
    teamInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      currentpage: 1,
      pageSize: 20,
      total: 0,
      teamId: ''
    }
  },
  created() {
    this.teamId = this.$route.params.id
    this.initData()
  },
  methods: {
    async initData() {
      const res = await this.getData()
      if (!res) {
        return
      }
      this.total = res.totalElements
      this.tableData = this.formatData(res.content)
    },
    getData() {
      this.loading = true
      const params = {
        team_id: this.teamInfo.id
      }
      return this.$http.TeamV3.logPageClassData(
        params,
        this.currentpage,
        this.pageSize
      )
        .then((res) => {
          if (res?.data?.StudentTeamCourseStatisticsPage) {
            return res.data.StudentTeamCourseStatisticsPage
          }
          return false
        })
        .catch(() => {
          return false
        })
        .finally(() => {
          this.loading = false
        })
    },
    formatData(data) {
      data.forEach((item) => {
        switch (item.lesson_type) {
          case 0:
            item.lesson_type_name = '体验AI课'
            break
          case 1:
          case 2:
            item.lesson_type_name = '系统AI课'
            break
          case 10:
            item.lesson_type_name = '体验会销课'
            break
          case 11:
            item.lesson_type_name = '体验TV课程'
            break
          case 12:
            item.lesson_type_name = '系统TV课'
            break
          case 17:
            item.lesson_type_name = '特价课'
            break
        }
        item.task_count = item.task_count || 0
        item.today_task_count = item.today_task_count || 0
      })
      return data
    },
    pageChange(page) {
      this.currentpage = page
      this.initData()
    },
    toDetail(id) {
      // console.log(id)
      openBrowserTab(`/student-team/#/lessonDetail/${id}/${this.teamId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.log-page-class {
  .top-text {
    padding: 10px;
    background-color: #f8fafc;
    font-size: 12px;
  }
  .pagination-class {
    text-align: right;
  }
  .red-color {
    color: #f56c6c;
  }
  /deep/ {
    .el-table__header {
      th {
        background-color: #f4f4f5;
      }
    }
    .el-table th {
      padding: 0px 0;
    }
    .el-table td {
      padding: 5px 0;
    }
    .el-button--text {
      padding: 0px;
    }
  }
}
</style>
