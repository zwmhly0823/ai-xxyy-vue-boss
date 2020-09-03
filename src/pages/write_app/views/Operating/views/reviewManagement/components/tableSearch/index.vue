<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-25 14:35:19
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-03 17:50:31
 -->
<template>
  <!-- <el-scrollbar class="scroll-search-container"> -->
  <div class="table-searcher-container">
    <div class="comp-cell">
      <department
        style="width:130px;"
        @result="getDepartment"
        :name="'department'"
        :placeholder="'区部'"
        :onlyDept="1"
      />
    </div>
    <div class="comp-cell">
      <group-sell
        style="width:130px;"
        @result="selectSellTeacher"
        :name="'groupSell'"
        :tip="'老师'"
      />
    </div>
    <!-- 点评状态 -->
    <div class="comp-cell">
      <el-select
        class="item-style"
        size="mini"
        v-model="formInfo.cmtStatus"
        clearable
        placeholder="点评状态"
        @change="courseTypeChange"
      >
        <el-option
          v-for="item in commentStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <div class="comp-cell" v-if="regType">
      <el-select
        class="item-style"
        size="mini"
        v-model="formInfo.courseType"
        clearable
        placeholder="课程类型"
        @change="courseTypeChange"
      >
        <el-option
          v-for="item in categoryTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="comp-cell">
      <el-input
        placeholder="用户手机号"
        v-model="formInfo.phone"
        clearable
        size="mini"
        class="base-input"
        @input="handleDebounce"
      >
      </el-input>
    </div>
    <div class="comp-cell">
      <el-date-picker
        size="small"
        v-model="formInfo.receiveTime"
        type="datetimerange"
        value-format="timestamp"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        @change="sellCycleTimeChange"
      >
      </el-date-picker>
    </div>
  </div>
  <!-- </el-scrollbar> -->
</template>
<script>
import _ from 'lodash'
// import SearchTeamName from '@/components/MSearch/searchItems/searchTeamName'

import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
// import StageSupLevels from '@/components/MSearch/searchItems/stageSupLevels.vue'
export default {
  props: {
    regType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      teamName: '',
      sup: 'sup',
      coursePlaceholder: {
        0: '体验课排期',
        1: '系统课排期'
      },
      commentStatus: [
        {
          label: '已点评',
          value: '1'
        },
        {
          label: '未点评',
          value: '2'
        }
      ],
      categoryTypeList: [
        {
          label: '体验课',
          value: '0'
        },
        {
          label: '系统课',
          value: '1'
        }
      ],
      formInfo: {
        cmtStatus: '',
        courseType: '',
        phone: '',
        receiveTime: ''
      },
      emitInfo: {}
    }
  },
  computed: {
    handleDebounce() {
      return _.debounce(this.inputHandler, 500)
    }
  },
  components: {
    Department,
    GroupSell
  },
  methods: {
    sellCycleTimeChange(tiemArr = []) {
      const [startTime = '', endTime = ''] = tiemArr
      console.log(startTime, endTime)
    },
    // 课程排期emit
    selectSchedule(res) {
      const { stage = [] } = res
      this.manageChange(stage, 'term')
      // console.log(res, 'res')
      // this.setSeachParmas(res, ['stage'], 'terms')
    },
    // supCallBack(level) {
    //   console.log(level)
    // },
    // 社群销售
    selectSellTeacher(teachers) {
      const { groupSell = '' } = teachers || {}
      this.manageChange(groupSell, 'teacherId')
    },
    // 销售组
    getDepartment(depts) {
      // console.log(depts, 'depts')
      const { department = [] } = depts || {}
      this.manageChange(department, 'department')
    },
    // 难度
    supCallBack(res) {
      console.log(res, 'sup')
      let { sup = [] } = res || {}

      if (sup.length) {
        sup = _.cloneDeep(sup)
        let strSup = sup.map((item) => `S${item}`)
        strSup = strSup.join().split(',')
        this.manageChange(strSup, 'sup')
      } else this.manageChange(sup, 'sup')
    },
    inputHandler(data) {
      console.log(this.teamName)
      this.manageChange(this.teamName, 'teamName')
    },
    // 课程类型
    courseTypeChange(res) {
      console.log(res, 'res')
      this.manageChange(this.formInfo.courseType, 'courseType')
    },
    manageChange(res, key) {
      this.emitInfo[key] = res
      this.$emit('change', this.emitInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-search-container {
  overflow-y: hidden;
}
.table-searcher-container {
  display: flex;
  align-items: center;
  // min-width: 1200px;
  flex-wrap: wrap;
  // justify-content: space-around;
  // height: 50px;
  .comp-cell {
    margin: 5px 30px 5px 0;
    display: flex;
    align-items: center;
    .search-item.small {
      width: auto !important;
    }
    .base-input {
      width: 130px;
    }
    .item-style {
      width: 140px;
    }
  }
}
</style>
