<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-25 14:35:19
 * @LastEditors: Shentong
 * @LastEditTime: 2020-07-16 16:36:05
 -->
<template>
  <div class="table-searcher-container">
    <!-- 销售部 -->
    <div class="comp-cell">
      <department @result="getDepartment" :name="'department'" :onlyDept="1" />
    </div>
    <!-- 社群销售 -->
    <div class="comp-cell">
      <group-sell @result="selectSellTeacher" :name="'groupSell'" />
    </div>
    <!-- 微信号搜索 -->
    <div class="comp-cell" v-if="isShowWxSearch">
      <wx-list :wxSerch="wxSerch" @getWxSerch="getWxSerch" />
    </div>
    <!-- 销售等级 -->
    <div class="comp-cell" v-if="isShowLevel">
      <el-select
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
    <!-- 招生级别 -->
    <div class="comp-cell" v-if="isShowSup">
      <el-select
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
    <!-- 随材版本-->
    <div class="comp-cell" v-if="moreVersion">
      <more-version-box @result="getVersionNu" :name="'version'" />
    </div>
  </div>
</template>
<script>
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
import MoreVersionBox from '@/components/MSearch/searchItems/moreVersionBox'
import wxList from '../wxSearch'
export default {
  props: {
    // 是否显示销售等级
    isShowLevel: {
      type: Boolean,
      default: false
    },
    // 是否显示微信号搜索
    isShowWxSearch: {
      type: Boolean,
      default: false
    },
    // 是否显示招生级别
    isShowSup: {
      type: Boolean,
      default: false
    },
    // 是否显示随材版本
    moreVersion: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      emitInfo: {},
      wxSerch: '',
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
    GroupSell,
    wxList,
    MoreVersionBox
  },
  methods: {
    getVersionNu(res) {
      console.log(res, 'version-res')
      // this.manageChange({ version }, 'version')
      // this.setSeachParmas(res, [this.moreVersion || 'product_version'])
    },
    getWxSerch(res) {
      const sup = Object.values(res)[0]
      this.manageChange({ sup }, 'sup')
    },
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
