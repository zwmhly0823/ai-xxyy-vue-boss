<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-25 14:35:19
 * @LastEditors: Shentong
 * @LastEditTime: 2020-07-07 18:18:56
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
      <el-select
        v-if="isShowLevel"
        v-model="level"
        clearable
        size="mini"
        multiple
        placeholder="销售等级"
        @change="sellerLevelChange"
      >
        <el-option
          v-for="item in sellerLevelList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="comp-cell">
      <el-select
        v-if="isShowLevel"
        v-model="courseDifficulties"
        clearable
        size="mini"
        multiple
        placeholder="招生级别"
        @change="scheduleLevel"
      >
        <el-option
          v-for="item in scheduleLevelList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
export default {
  props: ['isShowLevel'],
  data() {
    return {
      emitInfo: {},
      level: '',
      courseDifficulties: '',
      // 销售等级
      sellerLevelList: [
        { label: '1级社群销售', value: 1 },
        { label: '2级社群销售', value: 2 },
        { label: '3级社群销售', value: 3 },
        { label: '新兵营', value: 0 }
      ],
      // 招生级别
      scheduleLevelList: [
        {
          label: 'S1',
          value: 'S1'
        },
        {
          label: 'S2',
          value: 'S2'
        },
        {
          label: 'S3',
          value: 'S3'
        },
        { label: 'S4', value: 'S4' }
      ]
    }
  },
  components: {
    Department,
    GroupSell
  },
  methods: {
    // 招生级别 TODO:
    scheduleLevel(courseDifficulties) {
      this.manageChange({ courseDifficulties }, 'courseDifficulties')
    },
    // 销售等级
    sellerLevelChange(level) {
      this.manageChange({ level }, 'level')
    },
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
      this.$emit('change', this.emitInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-searcher-container {
  // height: 50px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  .comp-cell {
    margin-right: 20px;
  }
}
</style>
