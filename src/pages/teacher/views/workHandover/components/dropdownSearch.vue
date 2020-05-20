<!--
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-20 11:32:49
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-07 14:27:57
 -->
<template>
  <div class="table-searcher-container">
    <div class="comp-cell">
      <department @result="getDepartment" :name="'department'" :onlyDept="1" />
    </div>
    <div class="comp-cell">
      <group-sell @result="selectSellTeacher" :name="'groupSell'" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      emitInfo: {},
      sup: 'sup'
    }
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

      this.$emit('searchChange', this.emitInfo)
    }
  },
  components: {
    Department: () => import('@/components/MSearch/searchItems/department'),
    GroupSell: () => import('@/components/MSearch/searchItems/groupSell')
  }
}
</script>

<style lang="scss" scoped>
.table-searcher-container {
  // height: 50px;
  // margin-bottom: 10px;
  display: flex;
  align-items: center;
  .comp-cell {
    margin-right: 20px;
  }
}
</style>
