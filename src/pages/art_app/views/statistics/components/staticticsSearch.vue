<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-25 14:35:19
 * @LastEditors: Shentong
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

    <div class="comp-cell">
      <stage-sup-levels
        @supCallBack="supCallBack"
        :disabled="true"
        :supName="sup"
        style="margin-bottom:0px"
      />
    </div>
  </div>
</template>
<script>
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
import StageSupLevels from '@/components/MSearch/searchItems/stageSupLevels.vue'
export default {
  data() {
    return {
      emitInfo: {},
      sup: 'sup'
    }
  },
  components: {
    Department,
    GroupSell,
    StageSupLevels
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
    // 难度
    supCallBack(res) {
      this.manageChange(res || { sup: [] }, 'sup')
    },
    manageChange(res, key) {
      this.emitInfo[key] = res[key]
      // console.log('comps-emitInfo', this.emitInfo)

      this.$emit('searchChange', this.emitInfo)
    }
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
