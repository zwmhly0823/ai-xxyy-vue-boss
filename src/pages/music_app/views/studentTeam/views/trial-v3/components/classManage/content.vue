<template>
  <div class="component-content-box">
    <el-table
      ref="tableBox"
      class="table-box"
      height="tableHeight"
      :data="tableData"
      @sort-change="tableSortChange"
      :key="now"
    >
      <el-table-column prop="date" label="销售/班级" min-width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.teacher_realname }}</div>
          <el-button type="text" @click="goTeamDetail(scope.row)">{{ courseLevelReplace(scope.row.team_name) }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="department_name" label="销售组" min-width="120"></el-table-column>
      <el-table-column
        v-if="teamState === '0'"
        prop="teacher_wechat_no"
        label="招生微信"
        min-width="100"
      ></el-table-column>
      <el-table-column label="班级人数" min-width="85" sortable="custom" prop="student_count">
        <template slot-scope="scope">
          <span class="font-color-1">{{ scope.row.student_count }}</span>
          <span>/ {{ scope.row.pre_enroll }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="teamState === '1'" label="班级情况" min-width="110">
        <template slot-scope="scope">
          <div>
            好友
            <span class="font-color-1">{{ scope.row.added_wechat }}</span>
          </div>
          <div>
            完成物流
            <span class="font-color-1">{{ scope.row.delivered_sign_count }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '1' || teamState === '2' || teamState === '全部'"
        prop="order_conversion_rate"
        label="转化率"
        min-width="90"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span class="font-color-1">{{ fixedOne(scope.row.order_conversion_rate) }}%</span>
          <span>/ {{ scope.row.system_order_count }}人</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '1' || teamState === '2' || teamState === '全部'"
        prop="refund_system_rate"
        label="退费率"
        min-width="90"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span class="font-color-1">{{ fixedOne(scope.row.refund_system_rate) }}%</span>
          <span>/ {{ scope.row.refund_system_count }}人</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '0'"
        prop="today_enroll_count"
        label="今日招生"
        min-width="85"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        v-if="teamState === '0' || teamState === '2' || teamState === '全部'"
        prop="added_wechat_rate"
        label="加好友率"
        min-width="90"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span class="font-color-1">{{ fixedOne(scope.row.added_wechat_rate) }}%</span>
          <span>/ {{ scope.row.added_wechat }}人</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '0' || teamState === '2' || teamState === '全部'"
        prop="follow_rate"
        label="公众号关注率"
        min-width="110"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span class="font-color-1">{{ fixedOne(scope.row.follow_rate) }}%</span>
          <span>/ {{ scope.row.follow_count }}人</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '0' || teamState === '2' || teamState === '全部'"
        prop="open_app_rate"
        label="APP登录率"
        min-width="100"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span class="font-color-1">{{ fixedOne(scope.row.open_app_rate) }}%</span>
          <span>/ {{ scope.row.open_app_count }}人</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '0'"
        prop="no_address_rate"
        label="无地址率"
        min-width="90"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span class="font-color-1">{{ fixedOne(scope.row.no_address_rate) }}%</span>
          <span>/ {{ scope.row.no_address_count }}人</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '0'"
        prop="delivered_start_rate"
        label="班发货率"
        min-width="90"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span class="font-color-1">{{ fixedOne(scope.row.delivered_start_rate) }}%</span>
          <span>/ {{ scope.row.delivered_start_count }}人</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '0'"
        prop="delivered_sign_rate"
        label="班到货率"
        min-width="90"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span class="font-color-1">{{ fixedOne(scope.row.delivered_sign_rate) }}%</span>
          <span>/ {{ scope.row.delivered_sign_count }}人</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '1'"
        prop="today_actual_join_course_rate"
        label="今日参课率"
        min-width="100"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span class="font-color-1">{{ fixedOne(scope.row.today_actual_join_course_rate * 100) }}%</span>
          <span>/ {{ scope.row.today_actual_join_course_count }}人</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '1'"
        prop="today_actual_complete_course_rate"
        label="今日完课率"
        min-width="100"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span
            class="font-color-1"
          >{{ fixedOne(scope.row.today_actual_complete_course_rate * 100) }}%</span>
          <span>/ {{ scope.row.today_actual_complete_course_count }}人</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '1'"
        prop="today_system_order_rate"
        label="今日转化率"
        min-width="100"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span class="font-color-1">{{ fixedOne(scope.row.today_system_order_rate) }}%</span>
          <span>/ {{ scope.row.today_system_order_count }}人</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '1' || teamState === '2' || teamState === '全部'"
        prop="all_join_course_rate"
        label="总参课率"
        min-width="90"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ fixedOne(scope.row.all_join_course_rate) }}%</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '1' || teamState === '2' || teamState === '全部'"
        prop="all_complete_course_rate"
        label="总完课率"
        min-width="90"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ fixedOne(scope.row.all_complete_course_rate) }}%</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '1' || teamState === '2' || teamState === '全部'"
        prop="all_task_rate"
        label="传作品率"
        min-width="90"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ fixedOne(scope.row.all_task_rate) }}%</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '1' || teamState === '2' || teamState === '全部'"
        prop="all_commont_rate"
        label="作品点评率"
        min-width="100"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ fixedOne(scope.row.all_commont_rate) }}%</span>
        </template>
      </el-table-column>
      <el-table-column v-if="teamState === '0'" label="招生周期" min-width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.start_date }} 至 {{ scope.row.end_date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="teamState === '0' || teamState === '2' || teamState === '全部'"
        label="课程周期"
        min-width="170"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.class_start && scope.row.class_end"
          >{{ scope.row.class_start }} 至 {{ scope.row.class_end }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="pageChange"
      @size-change="sizeChange"
      :page-size="20"
      :page-sizes="[20, 60, 100]"
      class="pagination-box"
      layout="sizes, total, prev, pager, next"
      :total="+totalElements"
    ></el-pagination>
  </div>
</template>

<script>
import { formatData, openBrowserTab } from '@/utils/index'
import {courseLevelReplace} from "@/utils/supList.js"
export default {
  name: 'componentContentBox',
  data() {
    return {
      params: {
        size: 20,
        page: 1
      },
      tableHeight: 0,
      tableData: [],
      totalElements: '0',
      teamState: '0',
      now: new Date().getTime(),
      courseLevelReplace
    }
  },
  created() {
    // 默认是待开课
    this.params.teamState = this.teamState
    this.initData()
  },
  mounted() {
    this.tableHeight = this.$refs.tableBox.height
  },
  computed: {
    fixedOne() {
      return function(num) {
        if (num) {
          if (parseInt(num) === +num) {
            return num
          } else {
            return Number(num).toFixed(1)
          }
        } else {
          return '0'
        }
      }
    }
  },
  methods: {
    async initData() {
      // 还走原来的接口
      const resData = await this.getTableData()
      if (!resData) {
        return
      }
      // console.log(resData)
      resData.content.forEach((item) => {
        item.start_date = item.start_date ? formatData(item.start_date) : ''
        item.end_date = item.end_date ? formatData(item.end_date) : ''
        item.course_day = item.course_day ? formatData(item.course_day) : ''
        item.end_course_day = item.end_course_day
          ? formatData(item.end_course_day)
          : ''
        item.class_start = item.class_start ? formatData(item.class_start) : ''
        item.class_end = item.end_date ? formatData(item.class_end) : ''
        item.stop_end_time = item.stop_end_time
          ? formatData(item.stop_end_time)
          : ''
      })
      console.log(resData)
      this.tableData = resData.content
      this.totalElements = resData.totalElements
    },
    getTableData() {
      this.$emit('loading', true)
      return this.$http.Team.getTrialTeamList(this.params)
        .then((res) => {
          if (res?.data?.StudentTrialTeamStatisticsPage) {
            return res.data.StudentTrialTeamStatisticsPage
          } else {
            return false
          }
        })
        .catch(() => {
          return false
        })
        .finally(() => {
          this.$emit('loading', false)
        })
    },
    tableSortChange(sort) {
      if (!sort.order) {
        delete this.params.sort
      } else {
        let sortRule = sort.order.slice(0, -6)
        // 产品觉得应该反过来才对
        if (sortRule === 'asc') {
          sortRule = 'desc'
        } else if (sortRule === 'desc') {
          sortRule = 'asc'
        }
        this.params.sort = `{"${sort.prop}":"${sortRule}"}`
      }
      this.params.page = 1
      this.initData()
    },
    changeSearchParams(params) {
      Object.assign(this.params, params, { page: 1 })
      Object.keys(this.params).forEach((item) => {
        if (!this.params[item]) {
          delete this.params[item]
        }
      })
      this.initData()
    },
    changeTeamState(val) {
      if (val === this.teamState) {
        return
      }
      this.now = new Date().getTime()
      this.teamState = val
      this.params.page = 1
      this.params.teamState = this.teamState
      this.initData()
    },
    goTeamDetail(row) {
      const id = row.id || ''
      let teamParams = ''
      let url = ''
      // 不同的入口要跳到不同的班级详情
      // if (this.$route.name === 'classManage') {
      //   url = 'teamDetail'
      //   teamParams = row.team_type || '0'
      // } else if (this.$route.name === 'student-team-trial') {
      //   // url = 'student-trial-detail'
      //   url = 'detail/trial'
      //   teamParams = row.team_state || '0'
      // }
      url = 'teamTrialDetail'
      teamParams = row.team_state || '0'
      id &&
        openBrowserTab(
          `/music_app/#/${url}/${id}/${teamParams}`,
          `${row.team_name}`
        )
    },
    pageChange(page) {
      // console.log(page)
      this.params.page = page
      this.initData()
    },
    sizeChange(size) {
      this.params.size = size
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.component-content-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  .font-color-1 {
    color: #ed9a97;
  }
  .table-box {
    flex: 1;
  }
  .pagination-box {
    text-align: right;
  }
  /deep/ {
    .el-button {
      padding: 0;
    }
    .el-table {
      th,
      td {
        padding: 5px 0;
      }
      .cell {
        padding-right: 0px;
      }
    }
  }
}
</style>
