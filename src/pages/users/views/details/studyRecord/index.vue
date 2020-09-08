<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: liukun
 * @LastEditTime: 2020-09-08 18:56:38
-->
<template>
  <div>
    <div class="course-sty">
      <el-radio-group v-model="changeSubject" size="mini">
        <el-radio-button :label="0">美术</el-radio-button>
        <el-radio-button :label="1">写字</el-radio-button>
      </el-radio-group>
      <el-tabs v-model="courseData" @tab-click="courseBtn">
        <el-tab-pane
          v-for="(item, key) of teams_lk_filter"
          :key="key"
          :label="`${item.team_type_formatting}:${item.team_name}`"
          :name="'' + key"
        >
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
          <div class="statistical class-statistical">
            <div>
              <span v-if="changeSubject">已解锁</span>
              <span v-else>已放课</span>:
              <span class="tatistical-span">
                {{ item.send_course_count }}
              </span>
            </div>
            <div v-if="!changeSubject">
              <span>当日参课</span>:
              <span class="tatistical-span">
                {{ item.day_join_course_count }}
              </span>
            </div>
            <div v-if="!changeSubject">
              <span>当日完课</span>:
              <span class="tatistical-span">
                {{ item.day_complete_course_count }}
              </span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-table
      :data="studyTableData"
      style="width: 100%"
      header-row-class-name="learning-record-sty"
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
              scope.row.studentCompleteCourseLog.ctime
                ? scope.row.studentCompleteCourseLog.ctime
                : '未参课'
            }}
          </div>
          <div class="course-btn">
            {{
              scope.row.studentCompleteCourseLog &&
              scope.row.studentCompleteCourseLog.is_today_join_course === 1
                ? '当日参课'
                : ''
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="首次完课时间">
        <template slot-scope="scope">
          <div>
            {{
              scope.row.studentCompleteCourseLog &&
              scope.row.studentCompleteCourseLog.complete_time &&
              scope.row.studentCompleteCourseLog.complete_time !==
                '1970-01-01 08:00:00'
                ? scope.row.studentCompleteCourseLog.complete_time
                : '未完课'
            }}
          </div>
          <div class="course-btn">
            {{
              scope.row.studentCompleteCourseLog &&
              scope.row.studentCompleteCourseLog.is_today_complete_course === 1
                ? '当日完课'
                : ''
            }}
          </div>
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
  name: 'studyRecord',
  mounted() {
    this.$root.$on('study', (r) => {
      console.info('老爹给学习记录的基础数据', r)
      this.teams_lk = r || []
    })
    // 初始化拿数据
    setTimeout(() => {
      this.lessonType = this.teams_lk_filter[0]
        ? this.teams_lk_filter[0].team_type
        : ''
      this.lessonId = this.teams_lk_filter[0] ? this.teams_lk_filter[0].id : ''
      this.reqSendCourseLogPage()
    }, 1000)
  },
  data() {
    return {
      teams_lk: [], // tab-pane
      courseData: '0', // tab-pane v-model
      studyTableData: [], // table展示数据

      // 数据查询
      lessonType: '', // 课程类型
      lessonId: '', // 课程Id
      currentPage: 1, // 页码

      // 分页组件
      allDigit: 1, // 总量
      changeSubject: this.$store.state.subjects.subjectCode
    }
  },
  computed: {
    teams_lk_filter() {
      return this.teams_lk.filter(
        (item) => item.subject === '' + this.changeSubject
      )
    }
  },
  watch: {
    changeSubject: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        console.info('学习记录-手动切换科目')
        this.reqSendCourseLogPage()
      }
    }
  },
  methods: {
    // 切换课程
    courseBtn(r) {
      this.lessonType = this.teams_lk_filter[r.name].team_type
      this.lessonId = this.teams_lk_filter[r.name].id
      this.reqSendCourseLogPage()
    },
    // 翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.reqSendCourseLogPage()
    },
    // 数据接口_学习记录
    reqSendCourseLogPage() {
      this.$http.User.getSendCourseLogPage(
        this.changeSubject,
        this.$route.params.id, // studentId
        this.lessonId, // 课程Id
        this.currentPage, // 页码
        this.lessonType // 课程类型
      ).then((res) => {
        console.log('学习记录模块接口', res.data.SendCourseLogPage)
        const _data =
          res.data.SendCourseLogPage && res.data.SendCourseLogPage.content
            ? res.data.SendCourseLogPage.content
            : []
        _data.forEach((item) => {
          // 课程计划时间
          item.ctime = item.ctime ? formatData(item.ctime, 's') : '-'
          if (item.studentCompleteCourseLog) {
            // 参课时间
            if (item.studentCompleteCourseLog.ctime) {
              item.studentCompleteCourseLog.ctime = formatData(
                item.studentCompleteCourseLog.ctime,
                's'
              )
            }
            // 完课时间
            if (item.studentCompleteCourseLog.complete_time) {
              item.studentCompleteCourseLog.complete_time = formatData(
                item.studentCompleteCourseLog.complete_time,
                's'
              )
            }
          }
        })
        this.studyTableData = _data // 赋值
        this.allDigit =
          res.data.SendCourseLogPage &&
          +res.data.SendCourseLogPage.totalElements
            ? +res.data.SendCourseLogPage.totalElements
            : 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.course-sty {
  background-color: #fff;
  .statistical {
    div {
      float: left;
      span {
        color: #aeaeae;
      }
    }
  }
  .class-statistical {
    margin: 0 15px 0 0;
    float: left;
    margin: 0 0 0 25px;
    .tatistical-span {
      color: #5ea0f5;
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
