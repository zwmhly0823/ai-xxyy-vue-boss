<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-25 14:35:19
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-25 18:47:52
 -->
<template>
  <div class="table-searcher-container">
    <div class="comp-cell">
      <department @result="getDepartment" :name="'department'" :deptType="2" />
    </div>
    <div class="comp-cell">
      <group-sell @result="selectSellTeacher" :name="'groupSell'" />
    </div>
  </div>
</template>
<script>
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
export default {
  data() {
    return {
      emitInfo: {}
    }
  },
  components: {
    Department,
    GroupSell
  },
  methods: {
    // 社群销售
    selectSellTeacher(teachers) {
      this.manageChange(teachers, 'groupSell')
    },
    // 销售部门
    getDepartment(depts) {
      this.manageChange(depts, 'department')
    },
    manageChange(res, key) {
      this.emitInfo[key] = res[key]
      console.log(this.emitInfo, 'deptType')
      this.$emit('change', this.emitInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-searcher-container {
  height: 50px;
  display: flex;
  align-items: center;
  .comp-cell {
    margin-right: 20px;
  }
}
</style>
