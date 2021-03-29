<!--
 * @Descripttion: 兼职老师配置
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-11-02 15:20:06
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-24 13:42:12
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
          <el-table-column prop="address" label="配置兼职老师" min-width="350">
            <template slot-scope="scope">
              <div
                class="d-flex teacher-set"
                v-for="(sup, key) in SUP_LEVEL_LIST_UPPER"
                :key="key"
              >
                <p>{{ sup.text }}：</p>
                <template
                  v-if="
                    scope.row[sup.id] &&
                      scope.row[sup.id].teacherSummaryList &&
                      scope.row[sup.id].teacherSummaryList.length > 0
                  "
                >
                  <span class="mr-10">{{
                    scope.row[sup.id].teacherSummaryList[0].departmentName
                  }}</span>
                  <div class="flex-1 d-flex teacher-set-list">
                    <span
                      v-for="(item, index) in scope.row[sup.id]
                        .teacherSummaryList"
                      :key="index"
                      >{{ `${item.teacherName};` }}</span
                    >
                  </div>
                </template>
                <p v-else>-</p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 步骤 -->
      <div class="step-section d-flex justify-center">
        <el-button size="small" @click="handlePrev">上一步</el-button>
        <el-button size="small" type="primary" @click="handleSave"
          >确&nbsp;&nbsp;认</el-button
        >
      </div>
    </div>
  </el-row>
</template>

<script>
// import Department from '@/components/MSearch/searchItems/department'
import { SUP_LEVEL_LIST_UPPER } from '@/utils/supList'
export default {
  components: {
    // Department
  },
  data() {
    return {
      tableHeight: 0,
      loading: false,
      tableData: [],
      term: '',
      onTeamIds: '',
      departmentId: '',
      SUP_LEVEL_LIST_UPPER
    }
  },

  created() {
    const { term } = this.$route.params
    const { onTeamIds = '' } = this.$route.query
    this.term = term
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
    // getDepartment(res) {
    //   console.log(res, 'department')
    //   this.departmentId = res?.departmentId || ''
    //   if (this.departmentId) {
    //     this.getTeacherConfigList()
    //   }
    // },

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
        type: 'RESULT'
      }
      const {
        payload = []
      } = await this.$http.ReviewManage.getTeacherConfigList(params)
      console.log(payload)
      // format data
      const result = payload.map((item) => {
        const { teamList = [] } = item
        teamList.forEach((team) => {
          const {
            sup = '',
            teamSummaryList = [],
            teacherSummaryList = []
          } = team
          if (sup) {
            Object.assign(item, {
              [`${sup}`]: { teamSummaryList, teacherSummaryList }
            })
          }
        })
        return item
      })
      console.log(result)

      this.tableData = result
      this.loading = false
    },

    /**
     * 返回上一步
     */
    handlePrev() {
      this.$router.push(`/scheduleSetView/${this.term}`)
    },

    /**
     * 保存
     */
    handleSave() {
      this.$router.replace('/schedule')
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
    margin: 10px 10px 0;
  }

  .teacher-set {
    > p {
      width: 60px;
    }
    &-list {
      flex-wrap: wrap;
      span {
        display: block;
      }
    }
  }

  .step-section {
    margin-bottom: 10px;
  }

  .mr-10 {
    margin-right: 10px;
  }
}
</style>
