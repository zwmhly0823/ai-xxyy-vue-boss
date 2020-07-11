<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-25 14:35:19
 * @LastEditors: Shentong
 * @LastEditTime: 2020-05-27 19:50:50
 -->
<template>
  <!-- <el-scrollbar class="scroll-search-container"> -->
  <div class="table-searcher-container">
    <div class="comp-cell">
      <span class="label" v-if="!regType">体验课排期：</span>
      <span class="label" v-else>系统课排期：</span>
      <search-stage
        class="margin_l10"
        @result="selectSchedule"
        name="stage"
        :type="regType + ''"
        :placeholder="coursePlaceholder[regType]"
      />
    </div>
    <div class="comp-cell">
      <span class="label" v-if="!regType">销售组：</span>
      <span class="label" v-else>服务部：</span>
      <department
        style="width:130px;"
        @result="getDepartment"
        :name="'department'"
        :onlyDept="1"
      />
    </div>
    <div class="comp-cell">
      <span class="label" v-if="!regType">社群销售：</span>
      <span class="label" v-else>辅导老师：</span>
      <group-sell
        style="width:130px;"
        @result="selectSellTeacher"
        :name="'groupSell'"
      />
    </div>
    <div class="comp-cell">
      <span class="label">课程难度：</span>
      <stage-sup-levels
        @supCallBack="supCallBack"
        :disabled="true"
        :supName="sup"
        style="margin-bottom:0px"
      />
    </div>
    <div class="comp-cell">
      <span class="label">班级名称：</span>
      <el-input
        placeholder="班级名称"
        v-model="teamName"
        clearable
        size="mini"
        class="base-input"
        @input="handleDebounce"
      >
      </el-input>
    </div>
    <div class="comp-cell" v-if="regType">
      <span class="label" style="width:84px">全部类型：</span>
      <el-select
        class="item-style"
        size="mini"
        v-model="category"
        clearable
        placeholder="请选择类型"
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
  </div>
  <!-- </el-scrollbar> -->
</template>
<script>
import _ from 'lodash'
// import SearchTeamName from '@/components/MSearch/searchItems/searchTeamName'
import Department from '@/components/MSearch/searchItems/department'
import SearchStage from '@/components/MSearch/searchItems/searchStage'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
import StageSupLevels from '@/components/MSearch/searchItems/stageSupLevels.vue'
export default {
  props: {
    regType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      val1: '',
      teamName: '',
      category: '',
      sup: 'sup',
      coursePlaceholder: {
        0: '体验课排期',
        1: '系统课排期'
      },
      categoryTypeList: [
        {
          label: '年课班',
          value: '2'
        },
        {
          label: '半年课班',
          value: '4'
        }
      ],
      emitInfo: {}
    }
  },
  computed: {
    handleDebounce() {
      return _.debounce(this.inputHandler, 500)
    }
  },
  components: {
    SearchStage,
    // SearchTeamName,
    Department,
    GroupSell,
    StageSupLevels
  },
  methods: {
    // 课程排期emit
    selectSchedule(res) {
      const { stage = [] } = res
      this.manageChange(stage, 'term')
      // console.log(res, 'res')
      // this.setSeachParmas(res, ['stage'], 'terms')
    },
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
      // const reg = /^[A-Za-z0-9]+$/
      // if (data && !reg.test(data)) {
      //   this.$message('请输入正确的物流单号!')
      //   this.input = ''
      //   return
      // }
    },
    // 班级名称
    // getTrialTeamName(res) {
    //   console.log('res1111', res)
    // },
    onSelectTeamName() {
      this.manageChange(this.teamName, 'teamName')
    },
    // 课程类型
    courseTypeChange(res) {
      console.log(res, 'res')
      this.manageChange(this.category, 'category')
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
  min-width: 1200px;
  flex-wrap: wrap;
  // height: 50px;
  .comp-cell {
    margin: 5px 15px 5px 0;
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
