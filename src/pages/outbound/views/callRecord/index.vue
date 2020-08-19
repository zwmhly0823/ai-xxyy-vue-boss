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

        <courseTeam
          @result="getSearchData('teamId', arguments)"
          style="width:400px;padding-top: 0px;"
        />

        <el-form-item>
          <el-select
            size="mini"
            v-model="status"
            placeholder="通话状态查询"
            @change="getSearchData('status', arguments)"
            clearable
            style="width:100px;padding-top: 4px;margin-right: 20px;"
          >
            <el-option label="使用中" value="1"></el-option>
            <el-option label="空闲中" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            size="mini"
            v-model="status"
            placeholder="呼叫类型查询"
            @change="getSearchData('type', arguments)"
            clearable
            style="width:100px;padding-top: 4px;margin-right: 20px;"
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
          :data="outboundList"
          style="width: 100%"
          align="center"
          border
          :header-cell-style="{ background: 'rgb(178, 185, 197,.3)' }"
          :cell-style="{ fontSize: '16px' }"
        >
          <el-table-column fixed prop="cno" label="通话总数"> </el-table-column>
          <el-table-column prop="agent_name" label="接通总数">
          </el-table-column>
          <el-table-column prop="agent_name" label="未接通总数">
          </el-table-column>
          <el-table-column prop="agent_name" label="接通率"> </el-table-column>
          <el-table-column prop="agent_name" label="总通话时长">
          </el-table-column>
          <el-table-column prop="agent_name" label="总通话平均时长">
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
      <el-table-column fixed prop="cno" label="坐席工号" width="150">
      </el-table-column>
      <el-table-column prop="student_mobile" label="用户电话" width="120">
      </el-table-column>
      <el-table-column prop="agent_name" label="课程期数" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.studentInfo.teams[0].team_name }}</span>
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
import courseTeam from '../components/courseTeam'
import MPagination from '@/components/MPagination/index.vue'
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '../components/groupSell'
import DateDownQuickSelect from '@/components/MSearch/searchItems/dateDownQuickSelect.vue'
// import SearchStage from '@/components/MSearch/searchItems/searchStage'
import { formatData, isToss } from '@/utils/index'

export default {
  data() {
    return {
      user: '',
      cno: '',
      lessonData: [],
      status: '', // 使用状态
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
      user_phone: ''
    }
  },
  components: {
    MPagination,
    Department,
    GroupSell,

    DateDownQuickSelect,
    courseTeam
  },
  // components: { MPagination, GroupSell, SearchPhone },
  created() {
    this.teacherId = isToss()
  },
  mounted() {
    this.getPhoneList()
  },
  methods: {
    // 获取通话记录列表
    getPhoneList() {
      const parmes = {
        teacher_id: this.agent
      }
      if (this.phone) {
        parmes.tel = this.phone
      }
      if (this.status) {
        parmes.use_status = this.status
      }
      if (this.cno) {
        parmes.cno = this.cno
      }
      if (this.department && this.department.length > 0) {
        parmes.department_id = this.department
      }
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
        console.log(this.department)
      }
      if (key === 'groupSell') {
        // 返回的id
        this.groupSell = val[0].groupSell
      }
      if (key === 'teamId') {
        this.period = val[0].period
        this.lessonType = val[0].managementType
      }
      if (key === 'phone') {
        this.phone = val[0]
      }

      this.getPhoneList()
    },
    // 输入电话号码
    changeNum() {
      if (this.user_phone.length > 11) {
        this.$message({
          showClose: true,
          message: '输入长度不能超过11位',
          type: 'error'
        })
      }
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
    getDepartment() {},
    // 时间转化
    formatDuring(t) {
      const HOUR = 1000 * 60 * 60
      const d = parseInt(t / (HOUR * 24))
      const h = parseInt((t % (HOUR * 24)) / HOUR)
      const m = parseInt((t % HOUR) / (1000 * 60))
      const s = parseInt((t % (1000 * 60)) / 1000)

      let text = ''
      d && (text += `${d}天`)
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
