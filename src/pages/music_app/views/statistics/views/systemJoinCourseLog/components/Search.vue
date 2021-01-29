<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-09-24 17:20:53
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-15 15:13:34
-->
<template>
  <div class="search d-flex">
    <div class="search-item">
      <search-phone-and-username
        placeholder="手机号或昵称"
        name="student_id"
        @result="getSearch('student_id', arguments)"
      />
    </div>
    <div class="search-item">
      <date-down-quick-select
        start-placeholder="放课开始时间"
        end-placeholder="放课结束时间"
        name="ctime"
        :slect-show="false"
        :quick-btn="['week', 'month']"
        :key="datepickerKey"
        @result="getCtime('ctime', arguments)"
      >
        <el-button
          slot="quick-prev"
          size="mini"
          plain
          :class="{ 'current-btn': isFirstWeek }"
          @click="quickHandleFirstWeek"
        >
          首周 <i v-if="isFirstWeek" class="el-icon-circle-close"></i>
        </el-button>
      </date-down-quick-select>
    </div>
    <div class="search-item">
      <simple-select
        placeholder="是否参课"
        name="is_join_course"
        :data-list="selectList"
        :multiple="false"
        @result="getSearch('is_join_course', arguments)"
      />
    </div>
    <div class="search-item">
      <simple-select
        placeholder="是否完课"
        name="is_complete_course"
        :data-list="selectList"
        :multiple="false"
        @result="getSearch('is_complete_course', arguments)"
      />
    </div>
    <div class="search-item">
      <department
        placeholder="服务组"
        name="teacher_id"
        :only-dept="0"
        @result="getDepartmentTeacher('teacher_id', arguments)"
      />
    </div>
    <div class="search-item">
      <group-sell
        name="teacher_id"
        tip="班主任"
        is-multiple
        :teacherscope="teacherFromDepartment"
        :key="teacherKey"
        @result="getTeacher"
      />
    </div>
    <div class="search-item">
      <hard-level addSupS upper :multiple="false" @result="getSup" />
    </div>
    <div class="search-item">
      <search-stage
        placeholder="期数"
        name="term"
        @result="getSearch('term', arguments)"
      />
    </div>
    <div class="search-item">
      <search-team-name
        name="team_id"
        placeholder="系统课班级"
        @result="getSearch('team_id', arguments)"
      />
    </div>
  </div>
</template>

<script>
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
import DateDownQuickSelect from '@/components/MSearch/searchItems/dateDownQuickSelect.vue'
import Department from '@/components/MSearch/searchItems/department.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell.vue'
import HardLevel from '@/components/MSearch/searchItems/hardLevel.vue'
import SearchStage from '@/components/MSearch/searchItems/searchStage.vue'
import SearchPhoneAndUsername from '@/components/MSearch/searchItems/searchPhoneAndUsername.vue'
import SearchTeamName from '@/components/MSearch/searchItems/searchTeamName'
export default {
  components: {
    SimpleSelect,
    DateDownQuickSelect,
    Department,
    GroupSell,
    HardLevel,
    SearchStage,
    SearchTeamName,
    SearchPhoneAndUsername
  },
  data() {
    return {
      mobile: '',
      selectList: [
        {
          id: '1',
          text: '是'
        },
        {
          id: '0',
          text: '否'
        }
      ],
      searchParams: {},
      teacherFromDepartment: null,
      teacherKey: 0,
      datepickerKey: 0,
      isFirstWeek: false
    }
  },

  methods: {
    // key,自定义参数，res，组件返回的值 res[0]
    getSearch(key, res) {
      console.log(res, 'search')
      console.log(key, 'key')
      const param = res && res[0]
      console.log(param, 'param')
      if (param) {
        Object.assign(this.searchParams, param)
      } else {
        this.$delete(this.searchParams, key)
      }
      console.log(this.searchParams)
      this.$emit('search', this.searchParams)
    },

    // 难度
    getSup(res) {
      const arr = []
      if (res) {
        const { sup } = res
        const param = Object.assign(
          {},
          { 'sup.like': { 'sup.keyword': `${sup}` } }
        )
        arr.push(param)
      }
      this.getSearch('sup.like', arr)
    },

    // 班主任
    getTeacher(res) {
      const arr = []
      if (res && res.teacher_id.length > 0) {
        arr.push(res)
      }
      this.getSearch('teacher_id', arr)
    },

    // 服务组-老师
    getDepartmentTeacher(key, res) {
      // 更换服务组时，更新 老师 筛选框
      this.teacherKey = new Date().getTime()
      const param = res && res[0]
      this.teacherFromDepartment = (param && param[key]) || null
      this.getSearch(key, res)
    },

    // 时间
    getCtime(key, res) {
      // 清除 首周
      // this.getSearch('is_first_week_send', [])
      this.$delete(this.searchParams, 'is_first_week_send')
      this.isFirstWeek = false

      this.getSearch(key, res)
    },

    /**
     * 首周
     */
    quickHandleFirstWeek() {
      console.log('fisrt')
      this.isFirstWeek = !this.isFirstWeek
      const arr = []
      if (this.isFirstWeek) {
        arr.push({
          is_first_week_send: 1
        })
      }
      // 清空 citme
      this.$delete(this.searchParams, 'ctime')

      this.datepickerKey = new Date().getTime()
      this.getSearch('is_first_week_send', arr)
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  padding: 15px 15px 5px;
  border-bottom: 5px solid #f0f1f2;
  flex-flow: wrap;
  &-item {
    margin-bottom: 5px;
    margin-right: 10px;
  }
}
</style>
