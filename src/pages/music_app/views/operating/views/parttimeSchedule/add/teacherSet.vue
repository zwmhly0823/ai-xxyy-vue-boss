<!--
 * @Descripttion: 兼职老师配置
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-11-02 15:20:06
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-12-11 21:06:21
-->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container d-flex column">
      <!-- <div class="set-item">
        <h3>兼职老师配置</h3>
        <div class="set-item-section d-flex align-center">
          <Department
            placeholder="部组"
            name="departmentId"
            :onlyDept="1"
            @result="getDepartment"
          />
        </div>
      </div> -->

      <!-- 班级列表 -->
      <!-- dom -->
      <div class="tableInner" ref="tableInner"></div>
      <div class="team-list flex-1">
        <el-table
          :data="tableData"
          :height="tableHeight"
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column prop="date" label="部组" width="140">
            <template slot-scope="scope">
              <p>{{ scope.row.departmentName }}</p>
              <p>{{ scope.row.parentDepartmentName }}</p>
            </template>
          </el-table-column>
          <el-table-column
            :label="item.text + '班级'"
            min-width="130"
            v-for="item in SUP_LEVEL_LIST_UPPER"
            :key="item.id"
          >
            <template slot-scope="scope">
              <template
                v-if="
                  scope.row[item.id] &&
                    scope.row[item.id].teamSummaryList &&
                    scope.row[item.id].teamSummaryList.length > 0
                "
              >
                <p
                  v-for="team in scope.row[item.id].teamSummaryList"
                  :key="team.teamId"
                >
                  {{ team.teamName }}
                </p>
              </template>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="配置兼职老师" min-width="400">
            <template slot-scope="scope">
              <div
                class="d-flex teacher-set"
                v-for="(item, index) in SUP_LEVEL_LIST_UPPER"
                :key="item.id"
              >
                <p>{{ item.text }}</p>
                <Department
                  placeholder="部组"
                  name="teacherId"
                  :isDisabled="!scope.row[item.id]"
                  isParttimeTeacher
                  :multiple="false"
                  :value="scope.row[item.id] && scope.row[item.id].departmentId"
                  @result="selectDepartment(item.id, scope, arguments)"
                />
                <group-sell
                  :teacherscope="
                    (scope.row[item.id] && scope.row[item.id].teacherscope) ||
                      []
                  "
                  :value="
                    (type === 'edit' &&
                      scope.row[item.id] &&
                      scope.row[item.id].teacherList) ||
                      null
                  "
                  :department-id="
                    type === 'edit'
                      ? (scope.row[item.id] &&
                          scope.row[item.id].departmentId) ||
                        null
                      : null
                  "
                  is-multiple
                  :page-size="400"
                  :is-disabled="!scope.row[item.id]"
                  :is-init-fetch="type === 'edit'"
                  :clear-cache="false"
                  :reserve-keyword="false"
                  :key="`${scope.$index}-${index}`"
                  @result="selectPartTeacher(item.id, scope, arguments)"
                  name="teacherIdList"
                  class="margin_l10"
                  tip="选择兼职老师"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 步骤 -->
      <div class="step-section d-flex justify-center">
        <el-button size="small" @click="handlePrev">上一步</el-button>
        <el-button size="small" type="primary" @click="handleSave"
          >保&nbsp;&nbsp;存</el-button
        >
      </div>
    </div>
  </el-row>
</template>

<script>
import { SUP_LEVEL_LIST_UPPER } from '@/utils/supList'
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
export default {
  components: {
    Department,
    GroupSell
  },
  data() {
    return {
      SUP_LEVEL_LIST_UPPER,
      type: '', // add, edit
      tableHeight: 0,
      loading: false,
      tableData: [],
      teamList: [],
      term: '',
      onTeamIds: '',
      departmentId: ''
    }
  },

  created() {
    const { term, type } = this.$route.params
    const { onTeamIds = '' } = this.$route.query
    this.term = term
    this.type = type
    this.onTeamIds = onTeamIds

    this.getTeacherConfigList()
  },

  mounted() {
    this.$nextTick(() => {
      let tableHeight =
        document.body.clientHeight - this.$refs.tableInner.offsetTop - 150
      this.tableHeight = tableHeight + ''
      tableHeight = null
    })
  },

  methods: {
    /**
     * search
     */
    selectDepartment(sup, scope, args) {
      const { row, $index } = scope
      const { teacherId = [] } = (args && args[0]) || {}
      row &&
        Object.assign(row[sup], {
          teacherscope: teacherId,
          departmentId: '',
          teacherList: null
        })
      this.$set(this.tableData, $index, row)
    },

    selectPartTeacher(sup, scope, args) {
      const { teacherIdList = [] } = (args && args[0]) || {}
      const { row, $index } = scope
      row && row[sup] && Object.assign(row[sup], { teacherIdList })
      if (this.type === 'edit') {
        row &&
          row[sup] &&
          Object.assign(row[sup], {
            // departmentId: '',
            teacherList: teacherIdList,
            changed: true
          })
      }
      this.$set(this.tableData, $index, row)
    },

    /**
     * 根据部门获取列表
     */
    async getTeacherConfigList() {
      const { term, onTeamIds } = this
      if (!term) {
        this.$message.error('参数错误：请选择有效期数')
        return
      }
      if (!onTeamIds) {
        this.$message.error('参数错误：无要配置的班级')
        return
      }
      this.loading = true
      const params = {
        term,
        teamId: onTeamIds,
        type: this.type === 'add' ? 'CONFIG' : 'RESULT'
      }
      const {
        payload = []
      } = await this.$http.ReviewManage.getTeacherConfigList(params)
      console.log(payload)
      const totalTeamList = []
      // format data
      const result = payload.map((item) => {
        const { teamList = [] } = item
        totalTeamList.push(...teamList)
        teamList.forEach((team) => {
          const {
            sup = '',
            groupId = null, // 如果设置过，会有 groupId
            teamSummaryList = [],
            teacherSummaryList = []
          } = team
          if (sup) {
            const obj = {
              teamSummaryList: teamSummaryList || [],
              teacherSummaryList: teacherSummaryList || [],
              groupId
            }
            // 如果是编辑，回显部组和兼职老师
            if (this.type === 'edit') {
              const teacherList = teacherSummaryList
                ? teacherSummaryList.map((teacher) => teacher.teacherId)
                : []
              const departmentId =
                teacherSummaryList && teacherSummaryList[0]?.departmentId
              Object.assign(obj, {
                teacherList,
                departmentId
              })
            }
            Object.assign(item, {
              [`${sup}`]: obj
            })
          }
        })
        return item
      })
      this.teamList = totalTeamList
      console.log(result)

      this.tableData = result
      this.loading = false
    },

    /**
     * 返回上一步
     */
    handlePrev() {
      this.$router.push(`/scheduleSet/${this.type}?term=${this.term}`)
    },

    /**
     * 保存
     */
    handleSave() {
      if (!this.term) {
        this.$message.error('缺少参数：期数')
        return
      }
      const data = []
      const supArr = SUP_LEVEL_LIST_UPPER.map((item) => item.id)
      this.tableData.forEach((item) => {
        supArr.forEach((sup) => {
          if (item[sup]) {
            const {
              teacherIdList = [],
              teamSummaryList = [],
              groupId = null,
              teacherList = null
            } = item[sup]
            const teamIdList = teamSummaryList.map((t) => t.teamId)
            const obj = {
              sup,
              // teacherIdList,
              teamIdList
            }
            if (groupId) {
              Object.assign(obj, { groupId })
            }
            if (teacherIdList.length > 0) {
              Object.assign(obj, { teacherIdList })
              data.push(obj)
            } else if (this.type === 'edit' && teacherList?.length > 0) {
              Object.assign(obj, { teacherIdList: teacherList })
              data.push(obj)
            }
          }
        })
      })
      console.log(data)
      // 所有可配置的级别，都要配置老师
      // if (data.length === 0) {
      if (data.length < this.teamList.length) {
        this.$message.error('请配置兼职老师~')
        return
      }
      const params = {
        term: this.term,
        configs: data
      }
      const loading = this.$loading({
        lock: true,
        text: '正在保存……',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      this.$http.ReviewManage.dispatchTeacherConfig(params)
        .then((res) => {
          console.log(res)
          if (res?.code === 0) {
            this.$message.success('配置成功')
            setTimeout(() => {
              this.$router.push('/schedule')
            }, 2000)
          }
        })
        .finally(() => {
          loading.close()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main-container {
  position: relative;
  padding: 10px 0;
  .set-item {
    margin: 10px 0 0 20px;
    h3 {
      font-size: 14px;
    }
    &-section {
      margin: 0 0 0 10px;
      span {
        padding-right: 10px;
      }
    }
  }
  .team-list {
    margin: 10px 0 0;
  }
  .teacher-set {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
    > p {
      width: 50px;
    }
  }

  .step-section {
    margin-bottom: 10px;
  }
}
</style>
