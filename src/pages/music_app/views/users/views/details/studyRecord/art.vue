<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: Shentong
 * @LastEditTime: 2021-01-07 00:41:47
-->
<template>
  <div class="study-record">
    <!-- 头部统计 -->
    <header class="header-statistics" v-if="sendCourseLogPage.buytime">
      <!-- 系统课 -->
      <template v-if="sendCourseLogPage.isSystemPoriod">
        <div class="item">
          <span class="label">系统课报名期：</span>
          <span
            >{{ sendCourseLogPage.period || '-' }}-{{
              sendCourseLogPage.sup || '-'
            }}</span
          >
        </div>
        <div class="item">
          <span class="label">系统课报名时间：</span
          ><span>{{ sendCourseLogPage.buytime || '-' }}</span>
        </div>
        <div class="item">
          <span class="label">首次放课时间：</span
          ><span>{{
            (sendCourseLogPage.isSystem && sendCourseLogPage.firstSendTime) ||
              '-'
          }}</span>
        </div>
        <div class="item">
          <span class="label">课程进度：</span
          ><span>{{
            (sendCourseLogPage.isSystem && sendCourseLogPage.courseProgress) ||
              '-'
          }}</span>
        </div>
        <div class="item">
          <span class="label">最后放课时间：</span
          ><span>{{
            (sendCourseLogPage.isSystem && sendCourseLogPage.lastSendTime) ||
              '-'
          }}</span>
        </div>
      </template>
      <!-- 体验课 -->
      <template v-else>
        <div class="item">
          <span class="label"> 体验课报名期：</span
          ><span
            >{{ sendCourseLogPage.period || '-' }}-{{
              sendCourseLogPage.sup || '-'
            }}</span
          >
        </div>
        <div class="item">
          <span class="label">体验课报名时间：</span
          ><span>{{ sendCourseLogPage.buytime || '-' }}</span>
        </div>
        <div class="item">
          <span class="label">首次放课时间：</span
          ><span>{{
            (!sendCourseLogPage.isSystem && sendCourseLogPage.firstSendTime) ||
              '-'
          }}</span>
        </div>
        <div class="item">
          <span class="label">课程进度：</span
          ><span>{{
            (!sendCourseLogPage.isSystem && sendCourseLogPage.courseProgress) ||
              '-'
          }}</span>
        </div>
        <div class="item">
          <span class="label">最后放课时间：</span
          ><span>{{
            (!sendCourseLogPage.isSystem && sendCourseLogPage.lastSendTime) ||
              '-'
          }}</span>
        </div>
      </template>
    </header>
    <!-- 搜索选项 -->
    <section class="search-section">
      <div class="sear-container">
        <div class="bar">
          <div class="label">课程类型：</div>
          <el-radio-group
            v-model="searchTerm.courseType"
            size="mini"
            @change="courseTypeChange"
          >
            <el-radio-button :label="1">系统课</el-radio-button>
            <el-radio-button :label="0">体验课</el-radio-button>
          </el-radio-group>
        </div>
        <div class="bar">
          <div class="label">时间查询：</div>
          <el-select
            v-model="searchTerm.timeType"
            clearable
            placeholder="请选择"
            size="mini"
            @change="timeTypeChange"
            popper-class="time-type-class"
            style="margin-right: 10px;"
            @clear="clearTimeTypeHandle"
          >
            <el-option
              v-for="item in timeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-date-picker
            size="mini"
            v-model="searchTerm.timeArr"
            format="yyyy 年 MM 月 dd 日"
            type="datetimerange"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            @change="datePickerHandle"
          >
          </el-date-picker>
        </div>
        <div class="bar">
          <div class="label">课程状态：</div>
          <el-radio-group
            v-model="searchTerm.courseState"
            size="mini"
            @change="stateChange"
          >
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button :label="2">未参课</el-radio-button>
            <el-radio-button :label="0">仅参课未完课</el-radio-button>
            <el-radio-button :label="1">已完课</el-radio-button>
            <el-radio-button :label="99">补完课</el-radio-button>
            <!-- TODO: bu_complete_state :0(否)；1（补） -->
          </el-radio-group>
        </div>
      </div>

      <div class="tabs-btn"></div>
    </section>
    <section class="search-section spacelly">
      <div class="sear-container">
        <div class="label"><span>课程等级：</span></div>
        <div class="bar">
          <el-radio-group
            v-model="searchTerm.lesson"
            size="mini"
            class="marginBtoom"
          >
            <el-radio-button
              :label="item.value"
              v-for="(item, index) in courseLevel"
              :key="index"
              >{{ item.label }}</el-radio-button
            >
          </el-radio-group>
        </div>
      </div>
    </section>

    <!-- 课程统计 -->
    <el-row
      class="course-statistics"
      v-loading="flags.sLoading"
      element-loading-spinner="el-icon-loading"
    >
      <el-col :span="2" class="statistics">
        <div class="term">
          <div class="label">已放课</div>
          <span>{{ statistics.send_course_count || '--' }}节</span>
        </div>
      </el-col>
      <el-col :span="4" class="statistics">
        <div class="term">
          <div class="label">已参课节数</div>
          <span>{{ statistics.course_join_course_count || '--' }}节</span>
        </div>
        <div class="term">
          <div class="label">未参课节数</div>
          <span>{{ statistics.course_no_join_course_count || '--' }}节</span>
        </div>
      </el-col>
      <el-col :span="4" class="statistics">
        <div class="term">
          <div class="label">已完课节数</div>
          <span>{{ statistics.course_complete_course_count || '--' }}节</span>
        </div>
        <div class="term">
          <div class="label">未完课节数</div>
          <span
            >{{ statistics.course_no_complete_course_count || '--' }}节</span
          >
        </div>
      </el-col>
      <el-col :span="2" class="statistics">
        <div class="term">
          <div class="label">补完课节数</div>
          <span>{{ statistics.bu_complete_course_count || '--' }}节</span>
        </div>
      </el-col>
      <el-col :span="2" class="statistics">
        <div class="term">
          <div class="label">补参课节数</div>
          <span>{{ statistics.bu_join_course_count || '--' }}节</span>
        </div>
      </el-col>
      <el-col :span="3" class="statistics">
        <div class="term">
          <div class="label">作品节数 / 张数</div>
          <span
            >{{ statistics.course_task_count || '--' }}节 /
            {{ statistics.task_count || '--' }}张</span
          >
        </div>
      </el-col>
      <el-col :span="5" class="statistics last-child">
        <div class="term">
          <div class="label">点评节数 / 超时点评 / 听点评数</div>
          <span
            >{{ statistics.course_comment_count || '--' }}节 /
            {{ statistics.overtime_count || '--' }}节 /
            {{ statistics.course_listen_comment_count || '--' }}节</span
          >
        </div>
      </el-col>
    </el-row>
    <!-- table -->
    <section
      ref="tableRef"
      class="table-container"
      v-loading="flags.tLoading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="玩命加载中"
    >
      <ele-table
        :tableHeight="tableHeight"
        :tableSize="'small'"
        :dataList="tableData"
        :size="tabQuery.size"
        :page="tabQuery.page"
        :total="totalElements"
        :showAllTotalNum="true"
        :headerRowClasFn="headerRowClasFn"
        @pageChange="pageChange_handler"
        class="mytable"
      >
        <el-table-column
          label="课程等级"
          min-width="120"
          prop="lesson"
          align="center"
        ></el-table-column>
        <el-table-column
          label="课程名称"
          min-width="120"
          prop="department_name"
          align="center"
          ><template slot-scope="scope">
            <div class="scope-row">
              <div>{{ scope.row.title }}</div>
              <div class="orange-btn">{{ scope.row.courseType }}</div>
            </div>
          </template>
        </el-table-column>
        <!-- packageStudyList -->
        <el-table-column
          label="放课时间"
          min-width="120"
          prop="department_name"
          align="center"
        >
          <template slot-scope="scope">
            <div class="scope-row">
              <div>{{ scope.row.ctime && scope.row.ctime.substr(0, 10) }}</div>
              <div>{{ scope.row.ctime && scope.row.ctime.substr(10) }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="参课统计"
          min-width="190"
          prop="department_name"
          align="center"
        >
          <template slot-scope="scope">
            <div class="scope-row">
              <div>
                <span>最新参课：</span><span>{{ scope.row.lastJoinTime }}</span>
              </div>
              <div>
                <span>首次参课：</span><span>{{ scope.row.firstJoinTime }}</span
                ><span class="add" v-if="scope.row.bu_join_state == '1'"
                  >补</span
                >
              </div>
              <div>
                <span>累计参课：</span>
                <span
                  >{{
                    (scope.row.firstJoinTime && scope.row.join_course_count) ||
                      0
                  }}次
                </span>
                <span
                  >已学习第{{
                    (scope.row.firstJoinTime &&
                      scope.row.chapter_learned_count) ||
                      0
                  }}章节</span
                >
                <span
                  v-if="scope.row.firstJoinTime"
                  class="look"
                  @click="lookDetail(scope.row, 'completeCourse')"
                  >查看</span
                >
              </div>
            </div>
          </template>
          <template slot="header">
            <div
              @click="onSortSystemCount('last_join_course_time')"
              class="sort-operate-box"
            >
              <span>参课统计</span>
              <div class="sort-icon-arrow">
                <i
                  class="el-icon-caret-top top-color"
                  :class="{
                    active:
                      sortKeys['last_join_course_time'] == 'asc' &&
                      sortActive == 'last_join_course_time'
                  }"
                ></i>
                <i
                  class="el-icon-caret-bottom bottom"
                  :class="{
                    active:
                      sortKeys['last_join_course_time'] != 'asc' &&
                      sortActive == 'last_join_course_time'
                  }"
                ></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="完课统计"
          min-width="160"
          prop="department_name"
          align="center"
        >
          <template slot-scope="scope">
            <div class="scope-row">
              <div>
                <span>最新完课：</span
                ><span>{{ scope.row.lastCompleteTime }}</span>
              </div>
              <div>
                <span>首次完课：</span
                ><span>{{ scope.row.firstCompleteTime }}</span
                ><span class="add" v-if="scope.row.bu_complete_state == '1'"
                  >补</span
                >
              </div>
              <div>
                <span>累计完课：</span>
                <span>{{ scope.row.complete_course_count || '-' }}次 </span>
                <span
                  v-if="scope.row.firstCompleteTime"
                  class="look"
                  @click="lookDetail(scope.row, 'completeCourse')"
                  >查看</span
                >
              </div>
            </div>
          </template>
          <template slot="header">
            <div
              @click="onSortSystemCount('last_complete_course_time')"
              class="sort-operate-box"
            >
              <span>完课统计</span>
              <div class="sort-icon-arrow">
                <i
                  class="el-icon-caret-top top-color"
                  :class="{
                    active:
                      sortKeys['last_complete_course_time'] == 'asc' &&
                      sortActive == 'last_complete_course_time'
                  }"
                ></i>
                <i
                  class="el-icon-caret-bottom bottom"
                  :class="{
                    active:
                      sortKeys['last_complete_course_time'] != 'asc' &&
                      sortActive == 'last_complete_course_time'
                  }"
                ></i>
              </div>
            </div> </template
        ></el-table-column>
        <el-table-column
          label="上传作品"
          min-width="140"
          prop="department_name"
          align="center"
        >
          <template slot-scope="scope">
            <div class="scope-row">
              <div>
                <span>首次上传：</span
                ><span>{{ scope.row.firstTaskTime || '-' }}</span>
              </div>
              <div>
                <span>累计上传：</span>
                <span>{{ scope.row.task_count || '-' }}张 </span>
                <span
                  v-if="scope.row.task_count"
                  class="look"
                  @click="lookDetail(scope.row, 'uploadTask')"
                  >查看</span
                >
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="听点评"
          min-width="140"
          prop="department_name"
          align="center"
        >
          <template slot-scope="scope">
            <div class="scope-row">
              <div>
                <span>首次点评：</span
                ><span>{{ scope.row.firstCommentTime }}</span>
              </div>
              <div>
                <span>点评数量：</span>
                <span>{{ scope.row.comment_count || '-' }}条 </span>
                <span
                  v-if="scope.row.comment_count"
                  class="look"
                  @click="lookDetail(scope.row, 'uploadTask')"
                  >查看</span
                >
              </div>
              <div v-if="scope.row.isOverTime == 1" class="timeout">超时</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="点评反馈"
          min-width="120"
          prop="commentCH"
          align="center"
        >
          <template slot-scope="scope">
            <div class="comment-back">
              <el-popover
                :disabled="!scope.row.commentTag"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.commentTag"
              >
                <span slot="reference">{{ scope.row.commentCH }}</span>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </ele-table>
    </section>
    <!-- 查看作品 -->
    <TaskDetailDialog
      :showTaskDetail="dialogModal.taskDetail"
      @taskDetailClose="taskDetailClose"
      :rowData="rowData"
      v-if="dialogModal.taskDetail"
    />
    <!-- 查看参课、完课、统计数据 -->
    <JoinCompStatistics
      :showJoinComp.sync="dialogModal.joinCompStatistics"
      :rowData="rowData"
      v-if="dialogModal.joinCompStatistics"
    />
  </div>
</template>

<script>
import EleTable from '@/components/Table/EleTable'
import TaskDetailDialog from './TaskDetailDialog'
import JoinCompStatistics from './JoinCompStatistics'
import { formatTeamNameSup } from '@/utils/supList'
import { formatDateByType } from '@/utils/mini_tool_lk'
export default {
  name: 'studyRecordArt',
  props: {
    stuInforAdd: {
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
  components: {
    JoinCompStatistics,
    TaskDetailDialog,
    EleTable
  },
  data() {
    return {
      rowData: {},
      dialogModal: {
        taskDetail: false,
        joinCompStatistics: false
      },
      courseType: {
        0: 'AI课',
        1: 'AI课',
        11: 'TV课',
        12: 'TV课'
      },
      sortActive: '',
      sortKeys: {
        last_join_course_time: 'asc',
        last_complete_course_time: 'asc'
      },
      // 总页数
      totalElements: 0,
      flags: {
        tLoading: false,
        sLoading: false
      },
      tabQuery: {
        size: 20,
        page: 1
      },
      tableData: [],
      tableHeight: 'auto',
      searchTerm: {
        courseType: '1', // 课程类型
        timeType: 'ctime', // 时间查询
        timeArr: [],
        courseState: '', // 课程状态 中间值
        state: '',
        lesson: '',
        buCompleteState: '' // 补完课 单独处理
      },
      timeOptions: [
        {
          label: '放课时间',
          value: 'ctime'
        },
        {
          label: '参课时间',
          value: 'last_join_course_time'
        },
        {
          label: '完课时间',
          value: 'last_complete_course_time'
        }
      ],
      courseLevel: [],
      studentId: '',
      statistics: {},
      sendCourseLogPage: {}
    }
  },
  computed: {
    teamType() {
      return +this.searchTerm.courseType === 1 ? 'system' : 'trial'
    },
    // 1v1跳过来的
    isFrom1v1() {
      const { from } = this.$route.query
      return from === '1v1'
    }
  },
  created() {
    this.studentId = this.$route.params.id
  },
  mounted() {
    if (this.tab === 'learningRecord') {
      this.initData()
    }
    this.initWacher()
  },
  activated() {
    console.log('activitad')
  },
  watch: {
    tab(val) {
      if (val === 'learningRecord') {
        this.initData()
      }
    },
    stuInforAdd: {
      handler(val, oldval) {
        this.getLesson()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    onSortSystemCount(sortKey) {
      if (this.tableData.length) {
        if (this.sortKeys[sortKey] === 'desc') {
          this.sortKeys[sortKey] = 'asc'
        } else this.sortKeys[sortKey] = 'desc'

        Object.assign(this.tabQuery, {
          page: 1,
          sort: {
            [sortKey]: this.sortKeys[sortKey]
          }
          // sort: `{"${sortKey}":"${this.sortKeys[sortKey]}"}`
        })
        this.getLearningList().then((content) => {
          this.sortActive = sortKey
        })
      }
    },
    lookDetail(row, type) {
      this.rowData = {
        ...row,
        subjectCode: this.subjectCode
      }
      // 查看作品详情
      if (type === 'uploadTask') {
        this.dialogModal.taskDetail = true
      } else if (type === 'completeCourse') {
        this.dialogModal.joinCompStatistics = true
      }
    },
    // 初始化页面所有接口请求
    initData() {
      this.initPage()
      this.studentLearnStatistics()
      this.getSendCourseLogPage()
      this.getStudyRecordOrderPage()
    },
    // 初始化监听值
    initWacher() {
      const unWatch = [
        'courseState',
        'state',
        'buCompleteState',
        'timeType',
        'courseType'
      ]
      const watchHandle = () => this.initPage()
      Object.keys(this.searchTerm)
        .filter((_) => !unWatch.includes(_))
        .forEach((_) => {
          this.$watch((vm) => vm.searchTerm[_], watchHandle, {
            deep: true
          })
        })
    },
    courseTypeChange(val) {
      // 体验课
      if (this.searchTerm.lesson) {
        this.searchTerm.lesson = ''
      } else {
        this.initPage()
      }
      this.studentLearnStatistics()
      this.getLesson()
    },
    /**
     * @description 单独处理 非watch监听的“课程状态”过滤选项
     */
    stateChange(res) {
      if (res === 99) {
        this.searchTerm.state = ''
        this.searchTerm.buCompleteState = '1'
      } else {
        this.searchTerm.courseState = res
        this.searchTerm.state = res
        this.searchTerm.buCompleteState = '0'
      }

      this.initPage()
    },
    // 列表接口
    async getLearningList() {
      this.flags.tLoading = true
      try {
        const {
          StudentSysLearnRecord: system,
          StudentTrialLearnRecord: trial
        } = this.$http.User

        const { courseType } = this.searchTerm
        const params = this.handleApiParams(+courseType)

        const request = +courseType === 1 ? system : trial
        const { data } = await request(params)
        const {
          StudentSystemLearnListStatisticsPage: A = {},
          StudentTrialLearnListStatisticsPage: B = {}
        } = data

        const LearnPager = +courseType === 1 ? A : B

        const { content = [], totalElements = 0 } = LearnPager || {}

        this.totalElements = +totalElements
        this.packageStudyList(content)
        this.tableData = content
      } finally {
        this.flags.tLoading = false
      }
    },
    // 课程统计接口 系统课&&体验课
    async studentLearnStatisticsSysOrTial(courseType = 1) {
      this.flags.sLoading = true
      const params = {
        student_id: this.studentId,
        subject: this.subjectCode,
        del: 0
      }
      try {
        const {
          StudentSystemLearnStatistics: system,
          StudentTrialLearnStatistics: trial
        } = this.$http.User

        const request = +courseType === 1 ? system : trial
        const { data } = await request(params)
        const {
          StudentSystemLearnListStatisticsSummary: A = {},
          StudentTrialLearnListStatisticsSummary: B = {}
        } = data
        return courseType === 1 ? A : B
      } finally {
        this.flags.sLoading = false
      }
    },
    async studentLearnStatistics() {
      this.flags.sLoading = true
      const params = {
        student_id: this.studentId,
        subject: this.subjectCode,
        del: 0
      }
      try {
        const {
          StudentSystemLearnStatistics: system,
          StudentTrialLearnStatistics: trial
        } = this.$http.User
        const { courseType } = this.searchTerm

        const request = +courseType === 1 ? system : trial
        // 体验课
        if (+courseType !== 1) {
          params.lesson_type = [0, 11]
        }
        const { data } = await request(params)
        const {
          StudentSystemLearnListStatisticsSummary: A = {},
          StudentTrialLearnListStatisticsSummary: B = {}
        } = data

        this.statistics = +courseType === 1 ? A : B
      } finally {
        this.flags.sLoading = false
      }
    },
    // 首次放课时间、课程进度、最后放课时间
    async getSendCourseLogPage(courseType = 1) {
      const params = {
        student_id: this.studentId,
        subject: this.subjectCode
      }
      try {
        const {
          SendCourseLogPageSys: system,
          SendCourseLogPageTrial: trial
        } = this.$http.User

        const request = +courseType === 1 ? system : trial
        const { data = {} } = await request(params)
        const { SendCourseLogPage = {} } = data
        const { content = [] } = SendCourseLogPage

        // 如果系统课有数据，就在第一条数据上加上 标识 isSystem = 1
        if (courseType === 1) {
          if (content.length) content[0].isSystem = 1
          else return this.getSendCourseLogPage(0)
        }
        // 整理首次放课、最后放课，课程进度
        this.sendCourseLogPage = Object.assign(
          {},
          this.sendCourseLogPage,
          this.bundleFirstLastTime(content)
        )
      } catch (err) {}
    },
    // 上课记录 系统课报名期数
    async getStudyRecordOrderPage(courseType = 1) {
      const params = {
        student_id: this.studentId
      }
      try {
        const {
          StudyRecordOrderPage: system,
          StudyRecordOrderPageTrial: trial
        } = this.$http.User

        const request = +courseType === 1 ? system : trial
        const { data = {} } = await request(params)
        const { OrderPage = {} } = data

        const { content: [first = {}] = [] } = OrderPage

        const L = Object.keys(first).length

        // 如果系统课有数据，就在第一条数据上加上 标识 isSystemPoriod = 1
        if (+courseType === 1) {
          if (L) first.isSystemPoriod = 1
          else return this.getStudyRecordOrderPage(0)
        }

        this.sendCourseLogPage = Object.assign({}, this.sendCourseLogPage, {
          period: first.stageInfo && first.stageInfo.period_name,
          sup: first.sup_text && formatTeamNameSup(first.sup_text),
          buytime: formatDateByType(first.buytime, '-', 'Y'),
          isSystemPoriod: first.isSystemPoriod
        })
      } catch (err) {
        console.info(err)
      }
    },
    getLesson() {
      // 获取 课程等级 ** 体验课不展示
      const { lesson_sl: lesson = [] } =
        +this.searchTerm.courseType === 1 ? this.stuInforAdd || {} : {}

      const courseLevel = [
        {
          label: '全部',
          value: ''
        }
      ]
      const lessonList = []
      lesson.forEach((item) => {
        if (
          item.indexOf('TAS') !== 0 &&
          item.indexOf('S2020') !== 0 &&
          item.indexOf('TBS') !== 0 &&
          item.indexOf('T6S') !== 0
        ) {
          lessonList.push({
            label: formatTeamNameSup(item),
            value: item
          })
        }
      })
      this.courseLevel = courseLevel.concat(lessonList)
    },
    initPage(page = 0) {
      this.tabQuery.page = page
      this.getLearningList()
    },
    pageChange_handler(page) {
      this.initPage(page)
    },

    // select事件
    timeTypeChange(res) {
      console.log('res', this.searchTerm.timeArr)
      if (
        Array.isArray(this.searchTerm.timeArr) &&
        this.searchTerm.timeArr.length
      ) {
        this.searchTerm.timeArr = []
      }
    },
    // 清空时间查询
    clearTimeTypeHandle() {
      this.searchTerm.timeType = ''
    },
    // 时间选择事件
    datePickerHandle(res) {},
    // 处理接口请求的参数
    handleApiParams(courseType) {
      const params = {
        query: {
          student_id: this.studentId,
          subject: this.subjectCode
        },
        ...this.tabQuery
      }
      // 体验课
      if (+courseType !== 1) {
        params.query.lesson_type = [0, 11]
      }
      const { query } = params
      const timeArr = this.searchTerm.timeArr || []
      const [gt, lt] = timeArr
      const { state, timeType, lesson, buCompleteState } = this.searchTerm

      if (gt && lt) {
        Object.assign(query, {
          [timeType || 'ctime']: { gt, lt }
        })
      }

      state !== '' && Object.assign(query, { state })
      if (buCompleteState && buCompleteState !== '0') {
        Object.assign(query, { bu_complete_state: buCompleteState })
      }
      lesson &&
        Object.assign(query, {
          'lesson.like': { 'lesson.keyword': `${lesson}*` }
        })

      return params
    },
    bundleFirstLastTime(ct = []) {
      const { 0: first, length: l, [l - 1]: last } = ct
      return {
        firstSendTime: formatDateByType(first.ctime, '-', 'Y'),
        lastSendTime: formatDateByType(last.ctime, '-', 'MS'),
        courseProgress: last.lesson,
        isSystem: first.isSystem
      }
    },
    packageStudyList(list = []) {
      list.forEach((item) => {
        /**
         * ctime 放课时间
         * last_join_course_time 最新参课时间
         * first_join_course_time 首次参课时间
         * bu_join_state （补参课）0： 当日     1： 补
         * join_course_count 累计参课次数
         * chapter_id ：已学习第几章 TODO:
         * last_complete_course_time： 最新完课
         * first_complete_course_time 首次完课
         * bu_complete_state （补完课） 0：当日 1：补
         * complete_course_count 累计完课
         * first_task_time 首次上传
         * last_task_time 最近上传
         * task_count 累计上传
         * first_comment_time 首次点评
         * comment_count 点评数量
         * 超时 TODO: first_comment_time - ctime > 3600 * 24 * 1000 ? '超时' : ''
         * taskInfo[0].commentFeedback.feedback_type feedback_type: 0: 不满意；1：一版；2：满意
         */
        const COMMENT = {
          0: '不满意',
          1: '一般',
          2: '满意'
        }
        let {
          lesson = '',
          lesson_type: lessonType,
          ctime,
          last_join_course_time: lastJoinTime,
          first_join_course_time: firstJoinTime,
          last_complete_course_time: lastCompleteTime,
          first_complete_course_time: firstCompleteTime,
          first_task_time: firstTaskTime,
          first_comment_time: firstCommentTime,
          taskInfo = [],
          isOverTime = 0,
          commentCH = '',
          commentTag = ''
        } = item
        const courseType = this.courseType[lessonType]
        // const [lastCommentInfo] = taskInfo || []
        const { length: l, [l - 1]: lastCommentInfo } = taskInfo || []

        // 听点评 超时
        // const isOverTime = firstCommentTime - ctime > 3600 * 24 * 1000
        if (Array.isArray(taskInfo)) {
          taskInfo.forEach((task) => {
            ;+task.is_overtime && (isOverTime = +task.is_overtime)
          })
        }
        if (lastCommentInfo?.commentFeedback) {
          const {
            feedback_type: feedbackType,
            tag
          } = lastCommentInfo.commentFeedback
          if (feedbackType !== undefined) {
            commentCH = COMMENT[feedbackType]
            commentTag = tag
          }
        }

        lesson = formatTeamNameSup(lesson)
        ctime = formatDateByType(ctime, '-', 'M')
        lastJoinTime = formatDateByType(lastJoinTime, '-', 'MS')
        firstJoinTime = formatDateByType(firstJoinTime, '-', 'MS')
        lastCompleteTime = formatDateByType(lastCompleteTime, '-', 'MS')
        firstCompleteTime = formatDateByType(firstCompleteTime, '-', 'MS')
        firstTaskTime = formatDateByType(firstTaskTime, '-', 'MS')
        firstCommentTime = formatDateByType(firstCommentTime, '-', 'MS')

        Object.assign(item, {
          lesson,
          courseType,
          ctime,
          lastJoinTime,
          firstJoinTime,
          lastCompleteTime,
          firstCompleteTime,
          firstTaskTime,
          firstCommentTime,
          isOverTime,
          commentCH,
          commentTag
        })
      })
    },
    taskDetailClose(res) {
      this.dialogModal.taskDetail = false
      this.initPage()
    },
    // 自定义thead样式
    headerRowClasFn() {
      return 'header-row-class'
    }
  }
}
</script>

<style lang="scss" scoped>
.study-record {
  padding: 10px;
  .header-statistics {
    display: flex;
    align-items: center;
    padding: 7px 0;
    & > .item {
      margin-right: 30px;
      color: #444;
    }
  }
  .search-section {
    display: flex;
    &.spacelly {
      .sear-container {
        display: flex;
        .label {
          min-width: 72px;
          height: 100%;
          display: flex;
          position: relative;
          span {
            position: absolute;
            line-height: 30px;
            color: #444;
          }
        }
        .bar {
          flex: 1;
          height: auto;
          /deep/ .el-radio-group.marginBtoom > label {
            margin-bottom: 5px;
            .el-radio-button__inner {
              border-left: 1px solid #dcdfe6;
              box-shadow: none;
            }
          }
        }
      }
    }
    .sear-container {
      display: flex;
      flex: 1;
      align-items: center;
      flex-wrap: wrap;
      .bar {
        display: flex;
        height: 40px;
        align-items: center;
        &:not(:last-child) {
          margin-right: 20px;
        }
        .label {
          min-width: 72px;
          color: #444;
        }
        // /deep/ .el-select:has(.time-type-class) {
        //   margin-right: 100px;
        // }
      }
    }
    .tabs-btn {
      width: 120px;
    }
  }
  .course-statistics {
    display: flex;
    border-top: 5px solid #eee;
    padding-top: 10px;
    margin: 10px 0;
    .statistics {
      display: flex;
      justify-content: center;
      &:not(.last-child) {
        border-right: 1px solid #eee;
      }
      .term {
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .label {
          color: #999;
        }
        span {
          font-size: 18px;
          color: #67c23a;
        }
        &:first-child {
          margin-right: 5px;
        }
      }
      &:nth-of-type(2),
      &:nth-of-type(3) {
        .term {
          &:first-child {
            margin-right: 15px;
          }
        }
      }
    }
  }
  .table-container {
    margin-top: 10px;
  }
  .mytable {
    /deep/ .header-row-class th {
      background: #f5f7fa;
      height: 50px;
      text-align: left;
    }
    .timeout {
      color: #e4393c;
    }
    .scope-row {
      text-align: left;
      .orange-btn {
        display: inline-flex;
        background: #d8ba1c;
        color: #fff;
        line-height: 16px;
        padding: 0 3px;
        border-radius: 2px;
      }
      .add {
        background: mediumseagreen;
        color: #fff;
        padding: 0px 8px;
        line-height: 16px;
        border-radius: 1px;
        margin-left: 10px;
      }
      .look {
        cursor: pointer;
        color: #2a75ed;
        margin-left: 7px;
      }
    }
  }
  // 排序css
  .sort-operate-box {
    position: relative;
    .sort-icon-arrow {
      display: inline-block;
      position: relative;
      top: -2px;
      cursor: pointer;
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
}
</style>
