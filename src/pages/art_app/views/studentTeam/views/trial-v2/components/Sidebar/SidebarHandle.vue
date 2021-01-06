<!--
 * @Descripttion: sidebar 筛选操作区
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-07-31 21:58:19
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-15 16:50:59
-->
<template>
  <div class="team-layout-sidebar-handle">
    <!-- 组员不显示 -->
    <div class="d-flex align-center">
      <!-- 选择部门  -->
      <department
        placeholder="选择部门"
        name="teacher_id"
        :my-style="{ width: '110px !important' }"
        class="department"
        @result="getDepartment"
      />
      <!-- 选择销售 -->
      <group-sell
        tip="选择销售"
        name="teacher_id"
        :teacherscope="teacherIds"
        :my-style="{ 'max-width': '100% !important', margin: '10px 0' }"
        @result="getTeacher"
      />
    </div>
    <!-- 课程等级 -->
    <simple-select
      placeholder="课程等级"
      name="sup.keyword"
      :data-list="supList"
      @result="getLevel"
    />
    <!-- 期数，多选， -->
    <div
      class="management-list d-flex wrap"
      v-if="managementList.length > 0 && (status === '0' || status === '1')"
    >
      <el-button
        v-for="item in managementList"
        :key="item.management.period"
        :type="term.includes(item.management.period) ? 'primary' : 'default'"
        size="mini"
        @click="getTerm(item.management)"
        >{{ item.management.period_name }}</el-button
      >
    </div>
    <div v-if="managementList.length > 0 && status === '2'">
      <el-select
        class="management-select-class"
        v-model="managementSelectVal"
        multiple
        clearable
        placeholder="请选择期数"
        size="mini"
        @change="selectManagement"
      >
        <el-option
          v-for="(item, index) in managementList"
          :key="index"
          :label="item.management.period_name"
          :value="item.management.period"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { SUP_LEVEL_LIST_UPPER } from '@/utils/supList'
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect'
export default {
  components: {
    Department,
    GroupSell,
    SimpleSelect
  },
  props: {
    // 班级状态  0-待上课，1-上课中，2-已完课
    status: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      teacherIds: null,
      teacherIdsClone: null,
      supList: [],
      managementList: [],
      // 选择的期数
      term: [],
      search: {},
      managementSelectVal: '',
      departmenting: false
    }
  },
  created() {
    this.getManagement()

    this.supList = SUP_LEVEL_LIST_UPPER
  },

  methods: {
    // 获取 选择的部门下老师ID
    getDepartment(data) {
      // console.log(data, 'department')
      this.departmenting = true
      if (data) {
        this.teacherIds = data.teacher_id
      } else {
        delete this.search.teacher_id
        this.teacherIds = this.teacherIdsClone
      }
      Object.assign(this.search, data)
      this.$emit('search', this.search)
      setTimeout(() => {
        this.departmenting = false
      }, 0)
    },
    // 选择老师
    getTeacher(data) {
      if (this.departmenting) {
        return
      }
      // console.log(data, 'teacher')
      if (!data) {
        delete this.search.teacher_id
      }
      Object.assign(this.search, data)
      this.$emit('search', this.search)
    },
    // 课程等级
    getLevel(data) {
      // console.log(data)
      // 清空时
      if (Object.values(data)[0].length === 0) {
        const key = Object.keys(data)[0]
        delete this.search[key]
      } else {
        Object.assign(this.search, data)
      }
      this.$emit('search', this.search)
    },

    selectManagement(item) {
      if (item.length) {
        Object.assign(this.search, { term: item })
      } else {
        delete this.search.term
      }
      this.$emit('search', this.search)
    },

    // 选择期数 - 点击选中，再次点击取消选中
    getTerm(term) {
      const { period } = term
      if (!period) return
      if (!this.term.includes(period)) {
        this.term.push(period)
      } else {
        this.term = this.term.filter((item) => item !== period)
      }
      if (this.term.length === 0) {
        delete this.search.term
      } else {
        Object.assign(this.search, { term: this.term })
      }
      this.$emit('search', this.search)
    },

    // 获取待开课的期数 teacher_id, team_state=0
    getManagement() {
      const params = {
        teacher_id: this.teacherIds,
        team_state: this.status
      }
      this.$http.User.ManagementForTeacherList(params).then((res) => {
        if (res?.data?.ManagementForTeacherList) {
          let { ManagementForTeacherList = [] } = res.data
          ManagementForTeacherList = ManagementForTeacherList.filter((item) => {
            return item.management !== null
          })
          ManagementForTeacherList.sort((a, b) => {
            return b.management.period - a.management.period
          })
          // 待上课 - 只显示待开课的期数 根据班级状态- status  0 待开始 1 招生中   2待开课   3 开课中  4 已结课',
          if (this.status === '0') {
            this.managementList = ManagementForTeacherList.filter(
              (item) => item.management && +item.management.status < 3
            )
          }
          // 上课中
          if (this.status === '1') {
            this.managementList = ManagementForTeacherList.filter(
              (item) => item.management && +item.management.status === 3
            )
          }
          // 已完课
          if (this.status === '2') {
            this.managementList = ManagementForTeacherList.filter(
              (item) => item.management && +item.management.status === 4
            )
          }
          // console.log(this.managementList)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.department {
  ::v-deep {
    .item-style {
      min-width: 100%;
      width: 110px;
    }
  }
}
.management-list {
  ::v-deep {
    .el-button {
      margin-top: 10px;
      margin-right: 10px;
      padding: 7px 10px;
    }
    .el-button + .el-button {
      margin-left: 0;
    }
  }
}
.management-select-class {
  margin-top: 10px;
}
</style>
