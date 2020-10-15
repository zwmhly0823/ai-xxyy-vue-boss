<template>
  <div class="search-box">
    <div class="search-item">
      <span class="search-text">辅导老师</span>
      <department
        name="department_id"
        :only-dept="1"
        placeholder="选择销售组"
        style="margin-right: 10px;"
        @result="getSearchData('department_id', arguments)"
      />
      <group-sell
        name="teacher_id"
        tip="选择销售人员"
        is-multiple
        @result="getSearchData('teacher_id', arguments)"
      />
    </div>
    <div class="search-item">
      <span class="search-text">兼职老师</span>
      <department
        name="department_id"
        :only-dept="1"
        placeholder="选择销售组"
        style="margin-right: 10px;"
        @result="getSearchData('department_id', arguments)"
      />
      <group-sell
        name="teacher_id"
        tip="选择销售人员"
        is-multiple
        @result="getSearchData('teacher_id', arguments)"
      />
    </div>
    <div class="search-item">
      <span class="search-text">期/班级</span>
      <search-stage
        class="search-group-item"
        name="term"
        placeholder="请选择"
        type="1"
        :myStyle="{ width: '100px' }"
        @result="getSearchData('term', arguments)"
      />
      <search-team-name
        teamnameType="1"
        @result="getSearchData('teamid', arguments)"
        name="teamid"
        class="margin_l10"
      />
    </div>
    <div class="search-item">
      <span class="search-text">学员查询</span>
      <search-phone
        @result="getSearchPhoneData"
        name="phone"
        @inputChange="resetPartOfFormData"
      />
    </div>
  </div>
</template>

<script>
import Department from '@/components/MSearch/searchItems/department.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell.vue'
import SearchStage from '@/components/MSearch/searchItems/searchStage.vue'
import SearchTeamName from '@/components/MSearch/searchItems/searchTeamName'
import SearchPhone from '@/components/MSearch/searchItems/searchPhone'
export default {
  name: 'haveRiviewSearch',
  components: {
    Department,
    GroupSell,
    SearchStage,
    SearchTeamName,
    SearchPhone
  },
  methods: {
    getSearchData(key, res) {
      console.log(key, res)
    },
    getSearchPhoneData(val) {
      console.log(val)
    },
    resetPartOfFormData() {}
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  .search-item {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 10px;
    .search-text {
      font-size: 12px;
      margin-right: 10px;
    }
  }
  /deep/ .el-icon-circle-close {
    color: #c0c4cc;
  }
}
</style>
