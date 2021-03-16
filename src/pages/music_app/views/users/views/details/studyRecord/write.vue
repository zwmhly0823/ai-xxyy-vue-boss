<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-24 18:21:56
-->
<template>
  <div class="write-comps">
    <div>
      <el-tabs v-model="courseData" @tab-click="courseBtn">
        <el-tab-pane
          v-for="(item, key) in teamsFilter"
          :key="key"
          :label="`${item.team_type_formatting || '体验课'}:${item.team_name}`"
          :courseIds="item.course_ids"
          :teamId="item.id"
          :lessonType="item.team_type > 0 ? [1, 12] : [0, 12]"
        >
          <div class="inner_lk">
            <div class="statistical">
              <div>
                <span>社群销售</span>:
                {{ item.teacher_info && item.teacher_info.realname }}
              </div>
              <div>
                <span>微信昵称</span>:
                {{ item.teacher_info && item.teacher_info.nickname }}
              </div>
              <div>
                <span>微信号</span>:
                {{
                  item.teacher_wechat_info && item.teacher_wechat_info.wechat_no
                }}
              </div>
            </div>
            <div class="statistical">
              <div v-if="subjectCode">
                <span>已解锁</span>
                <span class="tatistical-span">
                  {{ item.start_course_count }}
                </span>
              </div>
              <div v-else>
                <span>已放课</span>:
                <span class="tatistical-span">
                  {{ item.send_course_count }}
                </span>
              </div>
              <div v-if="!subjectCode">
                <span>当日参课</span>:
                <span class="tatistical-span">
                  {{ item.day_join_course_count }}
                </span>
              </div>
              <div v-if="!subjectCode">
                <span>当日完课</span>:
                <span class="tatistical-span">
                  {{ item.day_complete_course_count }}
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-table
      :data="studyTableData"
      style="width: 100%"
      header-row-class-name="learning-record-sty"
      v-loading="flag.loading"
    >
      <el-table-column label="课程计划">
        <template slot-scope="scope">
          <div>{{ scope.row.wd_info }} ·《{{ scope.row.title }}》</div>
          <div>{{ scope.row.ctime }}</div>
        </template>
      </el-table-column>

      <el-table-column label="首次参课时间">
        <template slot-scope="scope">
          <div>
            {{
              scope.row.studentCompleteCourseLog &&
              scope.row.studentCompleteCourseLog.ctime !== '-'
                ? scope.row.studentCompleteCourseLog.ctime
                : '未参课'
            }}
          </div>
          <div class="course-btn" v-if="!subjectCode">
            {{
              scope.row.studentCompleteCourseLog &&
              scope.row.studentCompleteCourseLog.is_today_join_course === 1
                ? '当日参课'
                : ''
            }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="首次完课时间">
        <template slot-scope="scope">
          <div>
            {{
              scope.row.studentCompleteCourseLog.complete_time !== '-'
                ? scope.row.studentCompleteCourseLog.complete_time
                : '未完课'
            }}
          </div>
          <div class="course-btn" v-if="!subjectCode">
            {{
              scope.row.studentCompleteCourseLog &&
              scope.row.studentCompleteCourseLog.is_today_complete_course === 1
                ? '当日完课'
                : ''
            }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="解锁状态" v-if="subjectCode">
        <template slot-scope="scope">
          <section>
            {{
              scope.row.start_date && scope.row.start_date !== '-'
                ? '解锁'
                : '未解锁'
            }}
          </section>
          <section>
            {{
              scope.row.start_date && scope.row.start_date !== '-'
                ? scope.row.start_date
                : ''
            }}
          </section>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination_lk">
      <el-pagination
        layout="prev,pager,next,total"
        :page-size="20"
        :total="allDigit"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
export default {
  name: 'studyRecordWrite',
  props: {
    stuInfor: {
      type: Object,
      default: () => {}
    },
    subjectCode: {
      type: Number,
      default: 0
    },
    tab: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.initPage()
  },
  data() {
    return {
      teamsFilter: [],
      flag: {
        loading: false
      },
      teams_free_write: [], // tab-pane(写字0元体验)
      teams: [], // tab-pane
      courseData: '0', // tab-pane v-model
      studyTableData: [], // table展示数据

      // 数据查询
      lessonType: '', // 课程类型
      teamId: '', // 班级Id
      courseId: [], // 写字0元体验课
      currentPage: 1, // 页码

      // 分页组件
      allDigit: 1 // 总量
    }
  },
  computed: {
    // teamsFilter() {
    //   const arrNew = this.teams
    //     .filter((item) => +item.subject === this.subjectCode)
    //     .concat(this.subjectCode ? this.teams_free_write : [])

    //   return arrNew
    // },
    // 1v1跳过来的
    isFrom1v1() {
      const { from } = this.$route.query
      return from === '1v1'
    }
  },
  watch: {
    tab(val) {
      if (val === 'learningRecord') this.initPage()
    },
    stuInfor: {
      handler(val, oldval) {
        // console.log('write-val', val)
      },
      deep: true // 对象内部的属性监听，也叫深度监听
    },
    subjectCode: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        this.reqSendCourseLogPage()
      }
    }
  },
  methods: {
    initPage() {
      const { teams = [], zero_teamid_write_trials: ztwt } = this.stuInfor || {}
      this.teams = teams
      this.teams_free_write = ztwt || []

      this.teamsFilter = this.filterTeams()

      const [first = {}] = this.teamsFilter
      console.log('first', first)
      if (first.id) {
        const { id, team_type: teamType, course_ids: courseIds } = first
        this.teamId = id
        this.lessonType = teamType > 0 ? [1, 12] : [0, 12]
        this.courseId = Array.isArray(courseIds) ? courseIds : []
        this.reqSendCourseLogPage()
      }
    },
    filterTeams() {
      return this.teams
        .filter((item) => +item.subject === this.subjectCode)
        .concat(this.subjectCode ? this.teams_free_write : [])
    },
    // 切换课程
    courseBtn(r) {
      if (r.$attrs.courseIds && r.$attrs.courseIds.length) {
        // 写字0元体验课
        this.courseId = r.$attrs.courseIds
      } else {
        // 普通系统体验课
        this.teamId = r.$attrs.teamId
        this.lessonType = r.$attrs.lessonType
        this.courseId = []
      }
      this.reqSendCourseLogPage()
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val
      this.reqSendCourseLogPage()
    },
    // 数据接口_学习记录
    reqSendCourseLogPage() {
      this.flag.loading = true
      this.$http.User.getSendCourseLogPage({
        page: this.currentPage,
        subject: this.subjectCode,
        studentId: this.$route.params.id,

        teamId: this.teamId, // 班级Id
        lessonType: this.lessonType, // 课程类型
        courseId: this.courseId // 写字0元体验课
      })
        .then((res) => {
          const _data =
            res.data.SendCourseLogPage &&
            res.data.SendCourseLogPage.content &&
            res.data.SendCourseLogPage.content.length
              ? res.data.SendCourseLogPage.content
              : []
          _data.forEach((item) => {
            // 课程计划时间
            item.ctime = item.ctime !== '0' ? formatData(item.ctime, 's') : '-'
            if (!item.studentCompleteCourseLog)
              item.studentCompleteCourseLog = {}

            // 参课时间
            if (
              item.studentCompleteCourseLog &&
              item.studentCompleteCourseLog.ctime
            ) {
              item.studentCompleteCourseLog.ctime =
                formatData(item.studentCompleteCourseLog.ctime, 's') || '-'
            } else {
              item.studentCompleteCourseLog.ctime = '-'
            }

            // 完课时间
            if (
              item.studentCompleteCourseLog &&
              item.studentCompleteCourseLog.complete_time
            ) {
              item.studentCompleteCourseLog.complete_time =
                formatData(item.studentCompleteCourseLog.complete_time, 's') ||
                '-'
            } else {
              item.studentCompleteCourseLog.complete_time = '-'
            }

            // 解锁时间(写字特有)
            if (item.start_date !== '0') {
              item.start_date = formatData(item.start_date, 's')
            } else {
              item.start_date = '-'
            }
          })
          this.studyTableData = _data // 赋值
          this.allDigit =
            res.data.SendCourseLogPage &&
            +res.data.SendCourseLogPage.totalElements
              ? +res.data.SendCourseLogPage.totalElements
              : 0
        })
        .finally(() => {
          this.flag.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.write-comps {
  padding: 10px;
}
.inner_lk {
  display: flex;
  align-items: center;
}
.statistical {
  background-color: #fff;
  min-width: 200px;
  display: flex;
  margin-right: 30px;
}

.statistical .tatistical-span {
  color: #5ea0f5;
}

.statistical {
  div {
    margin-right: 10px;
    span {
      color: #aeaeae;
    }
  }
}
.learning-record-sty {
  th {
    background-color: #f5f7fa;
    padding: 5px 0;
  }
}
.course-btn {
  color: #67c23a;
  // cursor: pointer;
}
.pagination_lk {
  width: 100%;
  height: 40px;
  background-color: #fff;
  position: fixed;
  right: 0px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
