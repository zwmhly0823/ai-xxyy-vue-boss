<!--
 * @Descripttion: 班级配置
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-11-02 15:20:06
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-30 18:05:56
-->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container d-flex column">
      <!-- <div class="search-section d-flex"> -->
      <div class="set-item">
        <h3>需兼职老师点评作品选择</h3>
        <!-- 待开课，开课中的系统课期数 -->
        <div class="set-item-section d-flex align-center">
          <span>期</span>
          <SearchStage
            :status="termStatus"
            placeholder="请选择执行期"
            :isMultiple="false"
            name="term"
            @result="getStage"
            :key="termKey"
            v-if="type === 'add'"
          />
          <p v-if="type === 'edit'">
            {{ (termInfo && termInfo.period_name) || '-' }}
          </p>
        </div>
        <p class="tips-error" v-if="hasSetTerm && type === 'add'">
          系统已有此期，不可创建
        </p>
      </div>
      <div class="set-item">
        <h3>指定点评班级</h3>
        <div class="set-item-section d-flex align-center">
          <Department
            placeholder="部组"
            name="departmentId"
            :onlyDept="1"
            :isDisabled="!currentTerm"
            :key="flagKey"
            @result="getDepartment"
          />
          <HardLevel
            name="sup"
            upper
            addSupS
            :isDisabled="!currentTerm"
            :key="flagKey + 1"
            @result="getSup"
            style="margin-left: 10px"
          />
        </div>
      </div>
      <!-- </div> -->

      <!-- 班级列表 -->
      <!-- dom -->
      <div class="tableInner" ref="tableInner"></div>
      <div class="team-list flex-1">
        <el-table
          :data="teamList"
          :height="tableHeight"
          v-loading="loading"
          style="width: 100%"
          v-if="currentTerm"
        >
          <el-table-column prop="teamName" label="班级名称"> </el-table-column>
          <el-table-column prop="teamTeacherName" label="班主任">
          </el-table-column>
          <el-table-column label="部组">
            <template slot-scope="scope">
              <p>
                {{ scope.row.departmentName }}
              </p>
              <p>{{ scope.row.parentDepartmentName }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="supText" label="难度"> </el-table-column>
          <el-table-column prop="address" label="是否配置兼职老师">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.switches"
                active-value="ON"
                inactive-value="OFF"
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
        <!-- 没有选择期数时 -->
        <p class="tips-text" v-else>请选择有效期~</p>
      </div>

      <!-- 步骤 -->
      <div class="step-section d-flex justify-center">
        <el-button size="small" @click="handleCancel"
          >取&nbsp;&nbsp;消</el-button
        >
        <el-button size="small" type="primary" @click="handleNext"
          >下一步</el-button
        >
      </div>
    </div>
  </el-row>
</template>

<script>
import { cloneDeep } from 'lodash'
// import { openBrowserTab } from '@/utils'
import { SUP_LEVEL_UPPER } from '@/utils/supList'
import SearchStage from '@/components/MSearch/searchItems/searchStage'
import Department from '@/components/MSearch/searchItems/department'
import HardLevel from '@/components/MSearch/searchItems/hardLevel.vue'
export default {
  components: {
    SearchStage,
    Department,
    HardLevel
  },
  data() {
    return {
      // 操作类型 add, edit
      type: 'add',
      tableHeight: 0,
      // 待开课，开课中的系统课期数
      termStatus: [2, 3],
      // 选择的基数
      currentTerm: '',
      // 选择的部组
      currentDepartment: [],
      // 选择的难度级别
      currentSup: [],
      // 是否有设置此期
      hasSetTerm: false,
      // 期对应的班级列表
      teamList: [],
      allTeamList: [],
      flagKey: 0,
      termKey: 0,
      loading: false,
      termInfo: {},
      // 不需要缓存的path
      noAliveList: ['/schedule']
    }
  },

  created() {
    const { type } = this.$route.params
    this.type = type
    if (type === 'edit') {
      const { term } = this.$route.query
      this.currentTerm = term
      this.getManagementByPeriod()
      this.getTeamConfigListByTerm(term, false)
    }
  },

  mounted() {
    this.$nextTick(() => {
      let tableHeight =
        document.body.clientHeight - this.$refs.tableInner.offsetTop - 150
      this.tableHeight = tableHeight + ''
      tableHeight = null
    })
  },

  watch: {
    $route(to, from) {
      const { type } = this.$route.params
      this.type = type
      if (type === 'edit') {
        const { term } = this.$route.query
        this.currentTerm = term
      }
      if (this.noAliveList.includes(from.path)) {
        if (this.type === 'add') {
          this.termKey = Date.now()
          this.flagKey = Date.now() + 1
          this.getTeamConfigListByTerm()
        } else {
          this.getTeamConfigListByTerm(this.currentTerm)
          this.getManagementByPeriod()
        }
      }
    }
  },

  methods: {
    /**
     * search
     */
    // 获取期
    async getStage(res) {
      console.log(res, 'stage')
      const { term = '' } = res
      // 新增时 判断是否已设置过指定期
      if (term && this.type === 'add') {
        const {
          payload
        } = await this.$http.ReviewManage.dispatchTermConfigCheck(term)
        if (payload) {
          this.hasSetTerm = true
          this.currentTerm = ''
          return
        }
      }

      this.getTeamConfigListByTerm(term)
    },
    getDepartment(res) {
      console.log(res, 'department')
      this.currentDepartment = res?.departmentId || []
      this.handleFilterTeam()
    },
    getSup(res) {
      console.log(res, 'sup')
      this.currentSup = res?.sup || []
      this.handleFilterTeam()
    },

    // 根据期获取对应班级
    async getTeamConfigListByTerm(term, key = true) {
      // const term = this.currentTerm
      if (!term) {
        this.hasSetTerm = false
        this.currentTerm = ''
        return
      }
      this.loading = true
      const type = 'CONFIG' // this.type === 'add' ? 'CONFIG' : 'RESULT'
      const {
        payload = [],
        code
      } = await this.$http.ReviewManage.getTeamConfigListByTerm(term, type)
      if (code === 0) {
        // format data
        this.currentTerm = term
        this.hasSetTerm = false
        const result = payload.map((item) => {
          item.supText = SUP_LEVEL_UPPER[item.sup] || '-'
          return item
        })
        this.teamList = result
        this.allTeamList = cloneDeep(result)
      }
      if (key) this.flagKey = Date.now()
      this.loading = false
    },

    // 根据部组或难度级别筛选班级
    handleFilterTeam() {
      this.teamList = this.allTeamList.filter(
        (item) =>
          (this.currentSup.length > 0
            ? this.currentSup.includes(item.sup)
            : item.sup) &&
          (this.currentDepartment.length > 0
            ? this.currentDepartment.includes(item.departmentId)
            : item.departmentId)
      )
    },

    getManagementByPeriod() {
      if (!this.currentTerm) return
      const params = {
        type: 1,
        period: this.currentTerm
      }
      this.$http.ReviewManage.getManagementByPeriod(params).then((res) => {
        console.log(res)
        const term = res?.data?.Management || {}
        this.termInfo = term
      })
    },

    /**
     * 取消操作
     */
    handleCancel() {
      this.$router.replace('/schedule')
      // openBrowserTab('/review-manage/#/schedule', false, true)
    },

    /**
     * 下一步，保存当前设置, 并跳转下一设置
     */
    async handleNext() {
      if (!this.currentTerm) {
        this.$message.error('请选择有效期')
        return
      }
      if (this.teamList.length === 0) {
        this.$message.error('暂无数据')
        return
      }
      // 保存班级配置
      const onTeamIds = []
      const offTeamIds = []
      this.teamList.forEach((item) => {
        const { teamId, switches } = item
        if (switches === 'ON') onTeamIds.push(item.teamId)
        if (switches === 'OFF') offTeamIds.push(teamId)
      })
      if (onTeamIds?.length === 0) {
        this.$message.warning('请选择要配置的班级')
        return
      }
      const data = {
        term: this.currentTerm,
        onTeamIds,
        offTeamIds
      }
      if (this.type === 'edit') {
        Object.assign(data, { action: 'ACTION_EDIT' })
      }
      const { payload } = await this.$http.ReviewManage.dispatchTeamConfig(data)
      console.log(payload, 'save')
      if (payload) {
        this.$router.push(
          `/scheduleTeacherSet/${this.currentTerm}/${
            this.type
          }?onTeamIds=${onTeamIds.join()}`
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main-container {
  position: relative;
  padding: 10px;
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
  .tips-text {
    margin-top: 50px;
    color: #999;
    font-size: 18px;
  }
  .tips-error {
    margin: 5px 0 0 30px;
    font-size: 12px;
    color: #f56c6c;
  }
  .team-list {
    margin: 10px 30px 0;
  }

  .step-section {
    margin-bottom: 10px;
  }
}
</style>
