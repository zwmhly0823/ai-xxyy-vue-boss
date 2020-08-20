<template>
  <div class="container">
    <div>
      <el-form :inline="false" class="demo-form-flex">
        <el-row>
          <el-col :span="24">
            <department
              style="width:130px;padding-top: 10px;margin-right: 20px;"
              name="pay_teacher_id"
              placeholder="全部部门"
              :arrIndex="[]"
              @result="getSearchData('department', arguments)"
          /></el-col>
        </el-row>

        <group-sell
          style="width:130px;padding-top: 10px;"
          @result="getSearchData('groupSell', arguments)"
          :name="'groupSell'"
          tip="请选择老师"
        />
        <el-select
          size="mini"
          v-model="classType"
          placeholder="班级类型"
          @change="changeType()"
          clearable
          style="width:120px;padding-top: 10px;margin:0 20px;"
        >
          <el-option label="系统课" value="1"></el-option>
          <el-option label="体验课" value="2"></el-option>
        </el-select>
        <search-team-name
          @result="getSearchData('team', arguments)"
          ref="lessonTypeA"
          name="teach"
          style="width:150px;padding-top: 10px;margin-right:20px;"
          v-show="classType == 1"
        />
        <search-trial-team-name
          @result="getSearchData('team', arguments)"
          ref="lessonTypeB"
          name="teach"
          style="width:150px;padding-top: 10px;margin-right:20px;"
          v-show="classType == 2"
        />
        <!-- <courseTeam
          @result="getSearchData('teamId', arguments)"
          style="width:400px;padding-top: 0px;"
        /> -->

        <el-form-item>
          <el-select
            size="mini"
            v-model="status"
            placeholder="通话状态查询"
            @change="getSearchData('status', arguments)"
            clearable
            style="width:120px;padding-top: 4px;margin-right: 20px;"
          >
            <el-option label="座席未接听" value="30"></el-option>
            <el-option label="座席接听,未呼叫客户" value="31"></el-option>
            <el-option label="座席接听,客户未接听" value="32"></el-option>
            <el-option label="双方接听" value="33"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            size="mini"
            v-model="type"
            placeholder="呼叫类型查询"
            @change="getSearchData('type', arguments)"
            clearable
            style="width:120px;padding-top: 4px;margin-right: 20px;"
          >
            <el-option label="回呼" value="1"></el-option>
            <el-option label="智能语音" value="2"></el-option>
            <el-option label="外呼" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="false" class="demo-form-flex">
        <date-down-quick-select
          ref="dataPick"
          :quick-btn="['day', 'yesterday']"
          :slectShow="true"
          name="dateTime"
          style="margin-bottom:20px;"
          @result="getSearchData('dateTime', arguments)"
        />
      </el-form>
    </div>
    <div class="course-data">
      <div class="data-con">
        <el-table
          :data="outboundStatistics"
          style="width: 100%"
          align="center"
          border
          :header-cell-style="{ background: 'rgb(178, 185, 197,.3)' }"
          :cell-style="{ fontSize: '16px' }"
        >
          <el-table-column fixed prop="total" label="通话总数">
          </el-table-column>
          <el-table-column prop="answerTotal" label="接通总数">
          </el-table-column>
          <el-table-column prop="notAnswerTotal" label="未接通总数">
          </el-table-column>
          <el-table-column prop="answerRate" label="接通率">
            <template slot-scope="scope">
              <span>{{ `${scope.row.answerRate}%` }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="answerTotalTime" label="总通话时长">
            <template slot-scope="scope">
              <span>{{ `${formatDuring(scope.row.answerTotalTime)}` }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="avgTime" label="总通话平均时长">
            <template slot-scope="scope">
              <span>{{ `${formatDuring(scope.row.avgTime)}` }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-table
      :data="outboundList"
      border
      style="width: 100%;margin-top:30px;"
      :header-cell-style="{ background: 'rgb(178, 185, 197,.3)' }"
    >
      <el-table-column fixed prop="cno" label="坐席工号" width="80">
      </el-table-column>
      <el-table-column prop="student_mobile" label="用户电话" width="160">
        <template slot-scope="scope">
          <span>{{
            scope.row.studentInfo &&
              `${scope.row.studentInfo.mobile}--${scope.row.studentInfo.mobile_city}`
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="agent_name" label="课程期数" width="160">
        <template slot-scope="scope">
          <span>{{
            scope.row.studentInfo &&
              scope.row.studentInfo.teams &&
              scope.row.studentInfo.teams[0].team_name
          }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="agent_name" label="呼叫坐席" width="120">
      </el-table-column>
      <el-table-column
        prop="teacherInfo.department_name"
        label="绑定坐席所属部门"
        width="300"
      >
      </el-table-column>
      <el-table-column prop="call_type_text" label="呼叫类型" width="120">
      </el-table-column>
      <el-table-column prop="start_time" label="拨打时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ `${formatDate(scope.row.start_time)}` }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="answer_time" label="接听时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ `${formatDate(scope.row.answer_time)}` }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="end_time" label="挂断时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ `${formatDate(scope.row.end_time)}` }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="answer_duration" label="通话时长" min-width="150">
        <template slot-scope="scope">
          <span>{{ `${formatDuring(scope.row.answer_duration)}` }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="cdr_status_text" label="通话状态" width="120">
      </el-table-column>

      <!-- <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <span
            class="handle-btn"
            @click="unBind(scope.row)"
            v-if="+scope.row.use_status === 1"
            >解绑</span
          >
          <span
            class="handle-btn"
            @click="goBind(scope.row)"
            v-if="+scope.row.use_status === 0"
            >绑定</span
          >
        </template>
      </el-table-column> -->
    </el-table>
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
    <el-dialog
      title="绑定坐席"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <div>
        <el-form :inline="true" class="demo-form-inline">
          <p style="padding-left: 19px;">
            <el-form-item label="绑定坐席人员">
              <group-sell
                ref="group"
                style="width:160px !important;margin-right: 20px;"
                @result="getTeachId('groupSell', arguments)"
                :name="'groupSell'"
                tip="请输入绑定坐席名称"
                size="small"
              />
            </el-form-item>
          </p>
          <p>
            <el-form-item label="绑定电话类型">
              <el-radio-group v-model="user_radio">
                <el-radio label="手机号"></el-radio>
                <el-radio label="IP电话"></el-radio>
              </el-radio-group>
            </el-form-item>
          </p>
          <p>
            <el-form-item label="绑定电话号码">
              <el-input
                size="mini"
                style="width:160px"
                @input="changeNum()"
                v-model="user_phone"
                placeholder="请输入绑定电话号码"
              ></el-input>
            </el-form-item>
          </p>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postBind()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import courseTeam from '../components/courseTeam'
import MPagination from '@/components/MPagination/index.vue'
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '../components/groupSell'
import DateDownQuickSelect from '../components/dateDownQuickSelect'
import SearchTeamName from '../components/searchTeamName'
import SearchTrialTeamName from '../components/searchTrialTeamName'
// import SearchStage from '@/components/MSearch/searchItems/searchStage'
import { formatData, isToss } from '@/utils/index'

export default {
  data() {
    return {
      outboundStatistics: [],
      status: '', // 使用状态
      type: '', // 外呼类型
      currentPage: 1,
      totalPages: 0,
      totalElements: 1,
      centerDialogVisible: false,
      radio: '1',
      outboundList: [],
      // agent: null,
      // department: '',
      teacherIds: [],
      user_name: '',
      user_radio: '',
      user_phone: '',
      classType: null
    }
  },
  components: {
    MPagination,
    Department,
    GroupSell,
    DateDownQuickSelect,
    // courseTeam,
    SearchTeamName,
    SearchTrialTeamName
  },
  // components: { MPagination, GroupSell, SearchPhone },
  created() {
    this.teacherId = isToss()
  },
  mounted() {
    this.getPhoneList()
    this.getStatistics()
  },
  methods: {
    // 获取通话记录列表
    getPhoneList() {
      const parmes = {}
      if (this.department) {
        parmes.teacher_id = this.department
      }
      if (this.groupSell) {
        parmes.teacher_id = [this.groupSell]
      }
      if (this.status) {
        parmes.cdr_status = [this.status]
      }
      if (this.callType) {
        parmes.call_type = this.callType
      }

      if (this.time_begin && this.time_type === 0) {
        parmes.start_time = this.joinDate
      }
      if (this.time_begin && this.time_type === 1) {
        parmes.end_time = this.overDate
      }
      // this.getStatistics(parmes)
      return this.$http.Outbound.getRecordListPage(parmes, this.currentPage)
        .then((res) => {
          if (res && res.data && res.data.TeacherOutboundCallRecordPage) {
            this.outboundList = res.data.TeacherOutboundCallRecordPage.content
            this.totalElements = +res.data.TeacherOutboundCallRecordPage
              .totalElements
            this.totalPages = +res.data.TeacherOutboundCallRecordPage.totalPages
          }
        })
        .catch(() => {
          // loading.close()
        })
    },
    // 获取通话统计数据
    getStatistics() {
      const parmes = {}
      if (this.department) {
        parmes.teacher_id = this.department
      }
      if (this.groupSell) {
        parmes.teacher_id = [this.groupSell]
      }
      if (this.status) {
        parmes.car_status = [this.status]
      }
      if (this.callType) {
        parmes.call_type = this.callType
      }
      // if (this.department && this.department.length > 0) {
      //   parmes.department_id = this.department
      // }
      if (this.time_begin) {
        parmes.time_type = this.time_type
        parmes.time_begin = this.time_begin
        parmes.time_end = this.time_end
      }
      return this.$http.Outbound.getRecordgetStatistics(parmes)
        .then((res) => {
          if (res && res.data && res.data.TeacherOutboundStatistics) {
            this.outboundStatistics = [res.data.TeacherOutboundStatistics]
          }
        })
        .catch(() => {
          // loading.close()
        })
    },
    // 切换老师
    selectSellTeacher(teachers) {
      const { groupSell = '' } = teachers || {}
      this.manageChange(groupSell, 'teacherId')
    },
    // 分页
    handleSizeChange(val) {
      this.currentPage = val
      this.getPhoneList()
    },
    // 获取id
    getTeachList(val) {
      const numVal = val.map((item) => {
        return +item
      })
      const parmes = { department_id: numVal }
      return this.$http.Outbound.getTeachId(parmes, this.currentPage)
        .then((res) => {
          if (res && res.data && res.data.TeacherOutboundPage) {
            this.outboundList = res.data.TeacherOutboundPage.content
            this.totalElements = +res.data.TeacherOutboundPage.totalElements
            this.totalPages = +res.data.TeacherOutboundPage.totalPages
            console.log(111, this.lessonType)
          }
        })
        .catch(() => {
          // loading.close()
        })
    },
    // 改变筛选项
    getSearchData(key, val) {
      console.log(key, val)
      if (key === 'department') {
        this.department = val[0].pay_teacher_id
      }
      if (key === 'groupSell') {
        // 返回的id
        this.groupSell = val[0].groupSell
      }
      if (key === 'teamId') {
        this.period = val[0].period
        this.lessonType = val[0].managementType
      }
      if (key === 'status') {
        this.status = val[0]
      }
      if (key === 'type') {
        this.callType = val[0] === '3' ? [4, 5, 6] : [val[0]]
      }
      if (key === 'dateTime') {
        this.time_type = val[0].over ? 1 : 0
        if (val[0].join) {
          this.time_begin = val[0].join.gte
          this.time_end = val[0].join.lte
          this.joinDate = val[0].join
        } else if (val[0].over) {
          this.time_begin = val[0].over.gte
          this.time_end = val[0].over.lte
          this.overDate = val[0].over
        } else {
          this.time_begin = ''
          this.time_end = ''
          this.joinDate = ''
          this.overDate = ''
        }
      }
      if (key === 'team') {
        this.groupSell = val[0].teach
      }

      this.getPhoneList()
    },

    getTeachId(key, val) {
      console.log(val)
      this.user_name = val[0].groupSell
      console.log(this.user_name)
    },
    //
    formatDate(date) {
      return formatData(date, 's')
    },
    //
    changeType() {
      console.log('test', this.$refs.lessonType)
      this.$refs.lessonTypeA.getEmpty()
      this.$refs.lessonTypeB.getEmpty()
    },
    // 获取班级列表
    getTeamName(value) {
      console.log(value)
    },
    // 时间转化
    formatDuring(t) {
      const HOUR = 1000 * 60 * 60
      const h = parseInt(t / HOUR)
      const m = parseInt((t % HOUR) / (1000 * 60))
      const s = parseInt((t % (1000 * 60)) / 1000)

      let text = ''

      h && (text += `${h}小时`)
      m && (text += `${m}分`)
      s && (text += `${s}秒`)
      return text || '-'
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 10px;
  padding: 20px;
  width: calc(100vw)-50px;
  background: white;
  overflow: hidden;
  .demo-form-inline {
    margin: 0 auto;
    text-align: center;
  }
  .demo-form-flex {
    display: flex;
  }
  .handle-btn {
    color: blue;
    cursor: pointer;
  }
}
.el-input__inner {
  width: 150px !important;
}
</style>
