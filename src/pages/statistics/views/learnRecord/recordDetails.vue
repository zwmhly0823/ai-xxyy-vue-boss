<!--
 * @Descripttion: 学习记录详情页面
 * @version: 1.0.0
 * @Author: zhangjianwen
 * @Date: 2020-07-09 15:02:59
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-07-27 17:02:36
-->
<template>
  <div class="learn-record">
    <div class="basic-details">
      <div class="details-title">
        <span>基本信息</span>
      </div>
      <div class="details-con">
        <div class="details-img">
          <img :src="recordDetail.image" />
        </div>
        <div class="details-word">
          <p>课程类型：{{ learn_type[recordDetail.lesson_type] }}</p>
          <p>放课日期：{{ recordDetail.send_date }}</p>
          <p>课程标题：{{ recordDetail.title }}</p>
          <p>课程介绍：{{ recordDetail.desc }}</p>
          <el-tooltip
            class="item"
            effect="dark"
            :content="recordDetail.encyclopedias"
            placement="top-start"
          >
            <p class="word-list">百科知识：{{ recordDetail.encyclopedias }}</p>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="recordDetail.professional"
            placement="top-start"
          >
            <p class="word-list">专业知识：{{ recordDetail.professional }}</p>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="course-data">
      <div class="data-title">
        <span>课程数据</span>
      </div>
      <div class="data-con">
        <el-table
          :data="lessonData"
          style="width: 100%"
          align="center"
          :cell-style="{ fontSize: '16px' }"
        >
          <el-table-column prop="all_send_course_count" label="应参课人数">
          </el-table-column>
          <!-- <el-table-column prop="join_course_count" label="实际参课人数">
          </el-table-column> -->
          <el-table-column
            prop="join_course_count"
            label="实际参课人数"
            v-if="[0, 11].includes(lessonType)"
          >
          </el-table-column>
          <el-table-column
            prop="ad_join_course_count"
            label="实际参课人数"
            v-if="[10].includes(lessonType)"
          >
          </el-table-column>
          <el-table-column
            prop="learn_course_count"
            label="总参课次数"
            v-if="[0, 11].includes(lessonType)"
          >
          </el-table-column>
          <el-table-column
            prop="ad_learn_course_count"
            label="总参课次数"
            v-if="[10].includes(lessonType)"
          >
          </el-table-column>

          <el-table-column
            prop="all_join_course_rate"
            label="累计参课率"
            v-if="[0, 11].includes(lessonType)"
          >
            <template slot-scope="scope">
              <p>
                {{ `${scope.row.all_join_course_rate}%` }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="ad_all_join_course_rate"
            label="累计参课率"
            v-if="[10].includes(lessonType)"
          >
            <template slot-scope="scope">
              <p>
                {{ `${scope.row.ad_all_join_course_rate}%` }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="complete_course_count"
            v-if="[0, 11].includes(lessonType)"
            label="总完课人数"
          >
          </el-table-column>
          <el-table-column
            prop="ad_complete_course_count"
            v-if="[10].includes(lessonType)"
            label="总完课人数"
          >
          </el-table-column>
          <el-table-column
            prop="all_complete_course_rate"
            label="累计完课率"
            v-if="[0, 11].includes(lessonType)"
            >>
            <template slot-scope="scope">
              <p>
                {{ `${scope.row.all_complete_course_rate}%` }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="ad_all_complete_course_rate"
            label="累计完课率"
            v-if="[10].includes(lessonType)"
            >>
            <template slot-scope="scope">
              <p>
                {{ `${scope.row.ad_all_complete_course_rate}%` }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="task_count"
            label="总传作品数"
            v-if="[0, 11].includes(lessonType)"
          >
          </el-table-column>
          <el-table-column
            prop="ad_count"
            label="总答题数"
            v-if="lessonType === 11"
          >
          </el-table-column>
          <el-table-column
            prop="comment_count"
            label="总点评数"
            v-if="lessonType === 0"
          >
          </el-table-column>
          <el-table-column
            prop="lesson_comment_count"
            label="总听点评数"
            v-if="lessonType === 0"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="details-table">
      <div class="table-title">
        <span>学习情况</span>
      </div>
      <div class="table-con">
        <div class="table-btn">
          <el-button
            autofocus
            plain
            round
            v-bind:class="{ active: isActive === 1 }"
            @click="changeType(1)"
            >已完课</el-button
          >
          <el-button
            plain
            round
            v-bind:class="{ active: isActive === 0 }"
            @click="changeType(0)"
            >参课未完课</el-button
          >
          <el-button
            plain
            round
            v-bind:class="{ active: isActive === 2 }"
            @click="changeType(2)"
            >未参课</el-button
          >
        </div>
        <div>
          <el-form label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="学员搜索:">
                  <div class="search-group">
                    <search-phone-or-usernum
                      ref="useNum"
                      style="margin-right: 10px;"
                      type="2"
                      tablename="StudentTrialV2StatisticsList"
                      @result="getSearchData('user', arguments)"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item ref="formItem" label="班级名称">
                  <el-input
                    style="width:100"
                    v-model="classVal"
                    size="mini"
                    clearable
                    @change="getSearchData('name', arguments)"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22" v-show="isActive !== 2">
                <el-form-item label="时间搜索:" class="search-group flt">
                  <date-down-quick-select
                    ref="dataPick"
                    :quick-btn="['day', 'yesterday']"
                    :slectShow="isActive === 1"
                    name="dateTime"
                    @result="getSearchData('dateTime', arguments)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <el-table
        :data="learnRecordData"
        style="width: 100%"
        max-height="500"
        :header-cell-style="{ background: 'rgb(178, 185, 197,.3)' }"
        class="table-style"
        v-loading="loading"
      >
        <el-table-column prop="user_num" label="ID" min-width="80">
        </el-table-column>
        <el-table-column label="用户信息" min-width="200">
          <template slot-scope="scope">
            <base-user-info :user="scope.row" @handle-click="userHandle" />
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="参课"
          min-width="150"
          v-if="[10].includes(lessonType)"
        >
          <template slot-scope="scope">
            <p>
              {{ scope.row.ad_state === 2 ? '未参课' : '已参课' }}
            </p>
            <p>
              {{
                scope.row.ad_last_join_course_time
                  ? `最近：${formatDate(scope.row.ad_last_join_course_time)}`
                  : `最近：无`
              }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          prop="state"
          label="参课"
          min-width="150"
          v-if="[0, 11].includes(lessonType)"
        >
          <template slot-scope="scope">
            <p>
              {{ scope.row.state === 2 ? '未参课' : '已参课' }}
            </p>
            <p>
              {{
                scope.row.last_join_course_time
                  ? `最近：${formatDate(scope.row.last_join_course_time)}`
                  : `最近：无`
              }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          prop="learn_course_count"
          label="参课次数"
          width="80"
          v-if="[0, 11].includes(lessonType)"
        >
        </el-table-column>

        <el-table-column
          prop="ad_join_course_count"
          label="参课次数"
          width="80"
          v-if="[10].includes(lessonType)"
        >
        </el-table-column>
        <el-table-column
          prop="last_join_course_time"
          label="完课"
          v-if="[0, 11].includes(lessonType)"
          min-width="200"
        >
          <template slot-scope="scope">
            <p>
              {{ scope.row.state === 1 ? '已完课' : '未完课' }}
            </p>
            <p>
              {{
                scope.row.state === 1
                  ? `最近：${formatDate(scope.row.complete_time)}`
                  : ''
              }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          prop="ad_last_join_course_time"
          label="完课"
          v-if="[10].includes(lessonType)"
          min-width="200"
        >
          <template slot-scope="scope">
            <p>
              {{ scope.row.ad_state === 1 ? '已完课' : '未完课' }}
            </p>
            <p>
              {{
                scope.row.ad_state === 1
                  ? `最近：${formatDate(scope.row.ad_complete_time)}`
                  : ''
              }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          label="传作品"
          v-if="lessonType !== 10"
          min-width="200"
        >
          <template slot-scope="scope">
            <p>
              {{ scope.row.task_count > 0 ? '已上传' : '未上传' }}
            </p>
            <p>
              {{
                scope.row.last_task_time
                  ? `最近：${formatDate(scope.row.last_task_time)}`
                  : `最近：无`
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="ad_count"
          label="总答题数"
          v-if="lessonType === 11"
        >
        </el-table-column>
        <el-table-column
          prop="comment_count"
          label="点评数"
          v-if="lessonType === 0"
        >
        </el-table-column>
        <el-table-column
          prop="lesson_comment_count"
          label="听点评数"
          v-if="lessonType === 0"
        >
        </el-table-column>
        <el-table-column prop="status" label="是否转化" width="80">
          <template slot-scope="scope">
            <p>
              {{ use_status[scope.row.status] }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="班级-销售" min-width="200">
          <template slot-scope="scope">
            <p style="color:#2a75ed" @click="openTeam(scope.row)">
              {{ scope.row.team_name }}
            </p>
            <p>
              {{ `${scope.row.realname} ${scope.row.department_name}` }}
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pag-con">
      <m-pagination
        :current-page="currentPage"
        :page-count="totalPages"
        :pageSize="20"
        :total="totalElements"
        @current-change="handleSizeChange"
        show-pager
        open="calc(100vw - 170px - 25px)"
        close="calc(100vw - 50px - 25px)"
      ></m-pagination>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import MPagination from '@/components/MPagination/index.vue'
// import Search from '../../components/Search.vue'
import SearchPhoneOrUsernum from '@/components/MSearch/searchItems/searchPhoneOrUsernum.vue'
import DateDownQuickSelect from '@/components/MSearch/searchItems/dateDownQuickSelect.vue'
import BaseUserInfo from '../../components/BaseUserInfo.vue'
import { formatData, openBrowserTab } from '@/utils/index'

export default {
  name: 'trialUsers',
  components: {
    MPagination,
    SearchPhoneOrUsernum,
    DateDownQuickSelect,
    BaseUserInfo
    // Search
  },
  computed: {},
  data() {
    return {
      isActive: 1, // 参课类型 0 已参课 1已完课  2 未参课
      lessonType: 0, // 课程类型
      learn_type: {
        0: '小熊AI课',
        10: '家长课堂',
        11: '小熊TV课'
      },
      use_status: {
        0: '未转化',
        1: '未转化',
        2: '未转化',
        3: '未转化',
        4: '未转化',
        5: '已年系统课',
        6: '已年系统课',
        7: '已年系统课',
        8: '未转化',
        9: '未转化',
        10: '未转化',
        11: '已半年系统课',
        12: '已半年系统课',
        13: '已半年系统课'
      },
      lessonData: [],
      learnRecordData: [],
      classVal: null,
      num: null, // 学员编号或者手机号码
      term: '0',
      recordDetail: {},
      recordList: [],
      currentPage: 1,
      totalPages: null,
      totalElements: null,
      teacherIds: null,
      joinDate: '',
      overDate: '',
      loading: false
    }
  },
  watch: {},
  created() {
    this.term = this.$route.params.id
    this.lessonType = this.$route.params.lesson_type
  },
  mounted() {
    this.getStudentDetail()
    this.$nextTick(() => {
      console.log(this.lessonType)
      this.getRecordList()
    })
  },
  methods: {
    // 获取学员信息列表
    getRecordList() {
      this.loading = true
      const params = {
        term: this.$route.params.id,
        course_id: this.$route.params.course_id
      }
      if (+this.lessonType === 10) {
        params.ad_state = this.isActive
      } else {
        params.state = this.isActive
      }
      if (this.num) {
        this.num.length === 11
          ? (params.mobile = this.num)
          : (params.user_num = this.num)
      }
      if (this.joinDate) {
        ;+this.lessonType === 10
          ? (params.ad_last_join_course_time = this.joinDate)
          : (params.last_join_course_time = this.joinDate)
      }
      if (this.overDate) {
        ;+this.lessonType === 10
          ? (params.ad_complete_time = this.overDate)
          : (params.complete_time = this.overDate)
      }
      // if (this.joinDate) {
      //   if (+this.lessonType === 10) {
      //     params.ad_last_join_course_time = this.joinDate
      //     params.ad_complete_time = this.overDate
      //   } else {
      //     params.last_join_course_time = this.joinDate
      //     params.complete_time = this.overDate
      //   }
      // }

      if (this.classVal) {
        var teamName = this.classVal
      }
      // this.joinDate && params.complete_time = this.joinDate
      // this.joinDate = res[0].join
      //   this.overDate

      return this.$http.User.getStudentTRecordList(
        params,
        teamName,
        this.$route.params.sup,
        this.currentPage
      ).then((res) => {
        this.loading = false
        if (res && res.data && res.data.StudentTrialRecordListStatisticsPage) {
          if (res.data.StudentTrialRecordListStatisticsPage.length === 0) {
            return
          }
          const reponse = res.data.StudentTrialRecordListStatisticsPage
          this.learnRecordData = reponse.content
          console.log(this.learnRecordData)
          this.totalPages = +reponse.totalPages
          this.totalElements = +reponse.totalElements
        }
      })
    },
    // 学员记录详情基本信息
    getStudentDetail() {
      return this.$http.User.getStudentDetail(
        this.$route.params.id,
        this.$route.params.course_id,
        this.$route.params.sup
      )
        .then((res) => {
          if (
            res &&
            res.data &&
            res.data.StudentTrialRecordDetailBossStatistics
          ) {
            this.recordDetail = res.data.StudentTrialRecordDetailBossStatistics
            this.lessonType = this.recordDetail.lesson_type

            // this.lessonType = 10
            this.lessonData.push(this.recordDetail)

            console.log(111, this.lessonType)
          }
        })
        .catch(() => {
          // loading.close()
        })
    },
    // 切换类型
    changeType(val) {
      this.isActive = val
      this.currentPage = 1
      this.classVal = ''
      this.$refs.dataPick.handleChange()
      this.$refs.useNum.handleChange()

      this.getRecordList()
    },
    // 点击下拉
    handleCommand(command) {
      this.term = command
    },
    // 分页
    handleSizeChange(val) {
      this.currentPage = val
      this.getRecordList()
    },
    // 时间格式
    timeSplit(date) {
      return date
        .split('-')
        .splice(1)
        .join('-')
    },
    getClass() {},
    getSearchData(key, res) {
      console.log(res)
      if (key === 'user') {
        this.num = res[0].mobile || res[0].user_num_text
      }
      if (key === 'dateTime') {
        this.joinDate = res[0].join
        this.overDate = res[0].over
      }
      this.$nextTick(() => {
        this.getRecordList()
      })
    },
    // 点击用户信息回调事件
    userHandle(user) {
      console.log(user)

      const { username, mobile } = user
      const studentId = user.student_id

      // this.$router.push(`details?id=${uid}`)
      // 新标签打开详情页
      studentId &&
        openBrowserTab(
          `/users/#/details/${studentId}`,
          `学员:${username || mobile}`
        )
    },
    // 点击班级名称，打开班级详情
    openTeam(row) {
      console.log(row, '打开')
      //  if (!row.teacherInfo || !row.teamInfo || !row.team_id) return
      const teamId = row.team_id
      const teamType = '0'
      teamId &&
        openBrowserTab(`/student-team/#/teamDetail/${teamId}/${teamType}`)
    },
    formatDate(date) {
      return formatData(date, 's')
    }
  }
}
</script>

<style lang="scss" scoped>
.learn-record {
  padding: 10px;
  .basic-details {
    width: 100%;
    height: 230px;
    background-color: white;
    margin-bottom: 10px;
    .details-title {
      margin: 0 auto;
      height: 40px;
      line-height: 40px;
      width: 98%;
      border-bottom: 1px solid black;
    }
    .details-con {
      margin: 0 auto;
      width: 98%;
      display: flex;
      align-items: center;
      details-img {
        width: 200px;
      }
      img {
        // min-width: 100px;
        max-height: 150px;
      }
      .details-word {
        padding: 0 0 0 20px;
        .word-list {
          width: 90%;
          max-width: 900px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .course-data {
    width: 100%;
    height: 150px;
    background-color: white;
    margin-bottom: 10px;
    .data-title {
      margin: 0 auto;
      height: 40px;
      line-height: 40px;
      width: 98%;
      border-bottom: 1px solid black;
    }
    .data-con {
      margin: 0 auto;
      width: 98%;
    }
  }
  .details-table {
    width: 100%;
    height: 700px;
    background-color: white;
    margin-bottom: 20px;
    .table-title {
      margin: 0 auto;
      height: 40px;
      line-height: 40px;
      width: 98%;
      border-bottom: 1px solid black;
    }
    .table-btn {
      display: flex;
      justify-content: space-around;
      width: 30%;
      margin: 10px auto;
      .active {
        background-color: #2a75ed !important;
        color: white;
      }
    }
  }
}
.empty {
  text-align: center;
  background: white;
  width: 100%;
  height: 500px;
  line-height: 200px;
  font-size: 20px;
}
/deep/ .el-table .rowClass {
  background: #c3bfbc;
  color: blue;
}
/deep/ .el-form-item {
  margin-bottom: 5px;
}
/deep/ .el-table td,
.el-table td {
  padding: 0;
}
/deep/ .table-style .cell p {
  margin: 0;
}
/deep/ .user-info p .username {
  top: 8px;
}
</style>
