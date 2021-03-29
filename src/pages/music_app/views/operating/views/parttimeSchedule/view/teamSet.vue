<!--
 * @Descripttion: 班级配置
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-11-02 15:20:06
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-20 11:49:49
-->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container d-flex column">
      <!-- <div class="search-section d-flex"> -->
      <div class="set-item">
        <h3>需兼职老师点评作品选择</h3>
        <!-- 待开课，开课中的系统课期数 -->
        <div class="set-item-section d-flex align-center">
          <span>期：</span>
          <p>{{ (termInfo && termInfo.period_name) || '-' }}</p>
        </div>
      </div>
      <div class="set-item">
        <h3>指定点评班级</h3>
        <div class="set-item-section d-flex align-center">
          <Department
            placeholder="部组"
            name="departmentId"
            :onlyDept="1"
            :key="flagKey"
            @result="getDepartment"
          />
          <HardLevel
            name="sup"
            upper
            addSupS
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
        </el-table>
      </div>

      <!-- 步骤 -->
      <div class="step-section d-flex justify-center">
        <el-button size="small" @click="handleCancel"
          >返&nbsp;&nbsp;回</el-button
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
import { SUP_LEVEL_UPPER } from '@/utils/supList'
import Department from '@/components/MSearch/searchItems/department'
import HardLevel from '@/components/MSearch/searchItems/hardLevel.vue'
export default {
  components: {
    Department,
    HardLevel
  },
  data() {
    return {
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
      loading: false,
      termInfo: {},
      // 不需要缓存的path
      noAliveList: ['/schedule']
    }
  },
  created() {
    const { term } = this.$route.params
    if (!term) {
      this.$message.error('缺少参数：期')
      return
    }
    this.currentTerm = term
    this.getManagementByPeriod()
    this.getTeamConfigListByTerm()
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
      if (this.noAliveList.includes(from.path)) {
        this.flagKey = Date.now()
        this.getTeamConfigListByTerm()
      }
    }
  },

  methods: {
    /**
     * search
     */
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

    // 根据期获取对应班级
    async getTeamConfigListByTerm() {
      const term = this.currentTerm
      if (!term) return
      this.loading = true
      const {
        payload = []
      } = await this.$http.ReviewManage.getTeamConfigListByTerm(term, 'RESULT')
      console.log(payload)
      //  仅展示已配置的数据
      const data = payload.filter((item) => item.switches === 'ON')
      // format data;
      const result = data.map((item) => {
        item.supText = SUP_LEVEL_UPPER[item.sup] || '-'
        return item
      })
      this.teamList = result
      this.allTeamList = cloneDeep(result)
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

    /**
     * 取消操作
     */
    handleCancel() {
      this.$router.push('/schedule')
    },

    /**
     * 下一步，保存当前设置, 并跳转下一设置
     */
    async handleNext() {
      if (!this.currentTerm) {
        this.$message.error('缺少参数：期')
        return
      }
      if (this.teamList.length === 0) {
        this.$message.error('暂无数据')
        return
      }
      const onTeamIds = []
      this.teamList.forEach((item) => {
        const { teamId, switches } = item
        if (switches === 'ON') onTeamIds.push(teamId)
      })
      this.$router.push(
        `/scheduleTeacherSetView/${
          this.currentTerm
        }?onTeamIds=${onTeamIds.join()}`
      )
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
