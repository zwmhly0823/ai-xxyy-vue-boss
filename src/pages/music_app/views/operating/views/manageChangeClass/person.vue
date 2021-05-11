<template>
  <el-row class="coins">
    <!-- search -->
    <el-form :inline="true" ref="ruleForm" :model="form" :rules="rules">
      <el-form-item label="添加学员" prop="mobile" v-if="flag == 0">
        <search-phone-or-usernum
          ref="mobile"
          class="manageclass-maxwidth"
          defaultType="0"
          :isHidden="false"
          :name="['mobile']"
          type="3"
          tablename="UserExtendsList"
          @result="getSearchUid('user', arguments)"
        />
      </el-form-item>
      <el-form-item label="添加班级" prop="fromTeamId" v-if="flag == 1">
        <search-team-name
          ref="teamName1"
          class="manageclass-maxwidth"
          teamnameType="0"
          :isMultiple="isCheckbox"
          :term="form_term_trial"
          :changeClassName="true"
          team_state="0"
          placeholderLabel="原班级"
          @result="getTrialTeamName('fromTeamId', 'fromTeam', arguments)"
        />
      </el-form-item>
      <el-form-item prop="toTeamId">
        <search-team-name
          ref="teamName2"
          class="manageclass-maxwidth"
          teamnameType="0"
          name="toTeamId"
          :isMultiple="isCheckbox"
          :term="term_trial"
          :changeClassName="true"
          team_state="0"
          placeholderLabel="调入班级"
          @result="getTrialTeamName('toTeamId', 'toTeam', arguments)"
        />
      </el-form-item>
      <el-button type="primary" style="margin-top: 5px" size="mini" @click="add"
        >添加</el-button
      >
      <el-button
        type="primary"
        class="submit"
        size="small"
        @click="submit"
        v-show="tableData.length > 0"
        >确认调班</el-button
      >
    </el-form>
    <!-- table -->
    <div class="coins-table" v-show="tableData.length > 0">
      <el-table
        v-if="flag == 0"
        :data="tableData"
        style="width: 100%; border-top: 1px solid #ebeef5"
      >
        <el-table-column
          label="序号"
          align="center"
          type="index"
          :index="indexMethod"
          width="80px"
        >
        </el-table-column>
        <el-table-column
          label="学员"
          align="center"
          prop="mobile"
          width="100px"
        >
        </el-table-column>
        <el-table-column label="原班级" align="center" prop="fromTeam">
        </el-table-column>
        <el-table-column label="调入班级" align="center" prop="toTeam">
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="danger"
              @click="deleteItem(scope.$index)"
              size="mini"
              >移除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="flag == 1"
        v-loading="loading"
        :data="tableData"
        style="width: 100%; border-top: 1px solid #ebeef5"
      >
        <el-table-column
          label="序号"
          align="center"
          type="index"
          :index="indexMethod"
          width="80px"
        >
        </el-table-column>
        <el-table-column label="原班级" align="center" prop="fromTeam">
        </el-table-column>
        <el-table-column label="调入班级" align="center" prop="toTeam">
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="danger"
              @click="deleteItem(scope.$index)"
              size="mini"
              >移除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <m-pagination
        :current-page="query.pageNum"
        :page-size="query.pageSize"
        @current-change="handleCurrentChange"
        :total="+totalElements"
        open="calc(100vw - 195px)"
        close="calc(100vw - 75px)"
      />
    </div>
    <change-class-dialog
      :dialogVisible="dialogVisible"
      :returnSuccess="successList"
    />
  </el-row>
</template>
<script>
import SearchPhoneOrUsernum from '@/components/MSearch/searchItems/searchPhoneOrUsernum.vue'
import SearchTeamName from '@/components/MSearch/searchItems/searchClassName'
import MPagination from '@/components/MPagination/index.vue'
import changeClassDialog from './changeClassDialog'
import { deepClone, getAppSubject } from '@/utils/index'
export default {
  name: 'person',
  components: {
    SearchPhoneOrUsernum,
    SearchTeamName,
    MPagination,
    changeClassDialog,
  },
  props: {
    flag: {
      type: String,
      default: '0',
    },
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      isCheckbox: false,
      term_trial: null,
      form_term_trial: null,
      form: {
        mobile: '',
        toTeamId: '',
        fromTeamId: '',
      },
      params: {
        operationId: '',
        subject: '',
        type: '',
        data: null,
      },
      tableData: [],
      AllTableData: [],
      successList: [], // 返回成功数组
      totalElements: 0, // 总条数
      query: {
        pageSize: 10,
        pageNum: 1,
      },
      // 当前页数
      rules: {
        mobile: [{ required: true, message: '请添加学员', trigger: 'blur' }],
        fromTeamId: [
          {
            required: true,
            message: '请添加调出班级',
            trigger: 'blur',
          },
        ],
        toTeamId: [
          { required: true, message: '请添加调入班级', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    // boss获取操作ID使用staff   toss获取操作ID teacher
    const operation = localStorage.getItem('staff')
    operation && (this.params.operationId = JSON.parse(operation).id)
    // 科目
    this.params.subject = getAppSubject()
  },
  watch: {
    tableData() {
      this.totalElements = this.AllTableData?.length
      if (this.AllTableData.length > this.query.pageSize) {
        this.tableData.length = this.query.pageSize
      }
    },
  },
  mounted() {},
  methods: {
    indexMethod(index) {
      return index + 1 + (this.query.pageNum - 1) * this.query.pageSize
    },
    submit() {
      this.params.data = this.AllTableData
      this.params.type = this.flag === '0' ? '1' : null
      this.loading = true
      if (this.flag == 1) {
        this.$http.Operating.trialChangeClass(this.params).then((res) => {
          this.loading = false
          if (res.payload && res.payload.length > 0) {
            this.dialogVisible = true
            this.successList = res.payload
          }
        })
      } else {
        this.$http.Operating.changeTrialTeam(this.params).then((res) => {
          this.loading = false
          if (res.payload && res.payload.length > 0) {
            this.dialogVisible = true
            this.successList = res.payload
          }
        })
      }
    },
    // 删除条目
    deleteItem(i) {
      this.tableData.forEach((item, index) => {
        if (index === i) {
          const prevtotal = (this.query.pageNum - 1) * this.query.pageSize
          this.AllTableData.splice(prevtotal + i, 1)
          this.$nextTick((_) => {
            if (this.AllTableData.length - prevtotal === 0) {
              // 最后一页最后一条
              if (this.query.pageNum > 1) {
                this.query.pageNum--
              }
              this.tableData = this.AllTableData.slice(
                prevtotal - this.query.pageSize
              )
            } else {
              this.tableData = this.AllTableData.slice(prevtotal)
            }
            if (this.tableData.length > this.query.pageSize) {
              this.tableData.length = this.query.pageSize
            }
          })
        }
      })
    },
    // 添加到列表
    add() {
      const arr = this.AllTableData
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].mobile === this.form.mobile && this.flag === '0') {
          this.$message.error('此人信息已经添加')
          this.$refs.ruleForm.resetFields()
          this.$refs.teamName2.teamName = this.$refs.mobile.value = ''
          return
        }
        if (arr[i].toTeamId === this.form.fromTeamId && this.flag === '1') {
          this.$message.error('该班级信息已经添加')
          this.$refs.ruleForm.resetFields()
          this.$refs.teamName1.teamName = this.$refs.teamName2.teamName = ''
          return
        }
      }
      // 按人调班
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.GET_tableData()
        }
      })
    },
    async GET_tableData() {
      // 按班级调班
      if (this.flag === '1') {
        // var obj = deepClone(this.form)
        this.AllTableData.unshift(this.form)
        this.form = { toTeamId: '', originTeamId: '' }
        this.$nextTick((_) => {
          this.tableData = deepClone(this.AllTableData)
          this.$refs.teamName1.teamName = this.$refs.teamName2.teamName = ''
        })
        return
      }
      const query = { mobile: this.form.mobile }
      const res = await this.$http.User.trialCourseUsersV2(query, 1, {})
      if (res?.data?.StudentTrialV2StatisticsPage) {
        const { content } = res.data.StudentTrialV2StatisticsPage
        if (content && content.length > 0) {
          const _obj = {
            toTeamId: content[0].team_id,
            fromTeam: content[0].teamInfo && content[0].teamInfo.team_name,
            toTeam: this.form.toTeam,
          }
          Object.assign(this.form, _obj)
          this.AllTableData.unshift(this.form)
          this.form = { mobile: '', toTeamId: '' }
          this.$nextTick((_) => {
            this.tableData = deepClone(this.AllTableData)
            this.$refs.mobile.value = this.$refs.teamName2.teamName = ''
          })
        } else {
          this.$message.error('暂无此人班级')
        }
      }
    },
    getTrialTeamName(flagid, flag, res) {
      if (res[0]) {
        if (flagid == 'toTeamId') {
          this.rules.toTeamId = res[0].id
        }
        if (flagid == 'fromTeamId') {
          this.rules.fromTeamId = res[0].id
        }
        const classData = res[0][0]
        classData[flagid] = classData.id
        classData[flag] = classData.team_name
        delete classData.id
        delete classData.team_name
        delete classData.teacher_id
        Object.assign(this.form, classData)
      }
    },
    getSearchUid(key, res) {
      const search = res && res[0]
      this.form.mobile = search.mobile
    },
    handleCurrentChange(val) {
      const firstIndex = Number.parseInt((val - 1) * this.query.pageSize)
      const lastIndex = Number.parseInt(val * this.query.pageSize)
      this.$nextTick((_) => {
        this.query.pageNum = val
        this.tableData = this.AllTableData.slice(firstIndex, lastIndex + 1)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.coins {
  padding: 10px;
  &-table {
    margin-top: 10px;
  }
  .manageclass-maxwidth {
    width: 200px !important;
    /deep/ .el-select {
      width: 100%;
    }
    /deep/ .search-item {
      width: 100%;
    }
  }
  .submit {
    float: right;
    margin-right: 10px;
  }
}
</style>
