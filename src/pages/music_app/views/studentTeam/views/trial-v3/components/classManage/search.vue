<template>
  <div class="component-search">
    <div class="search-part">
      <span>销售组：</span>
      <department
        class="inline-block"
        @result="deptRes"
        name="department"
        :onlyDept="1"
      />
    </div>
    <div class="search-part">
      <span>社群销售：</span>
      <group-sell
        class="inline-block"
        @result="teacherRes"
        name="teacherId"
        tip="社群销售"
      />
    </div>
    <div class="search-part">
      <span>课程难度：</span>
      <stage-sup-levels
        class="inline-block"
        @supCallBack="supRes"
        :disabled="true"
        supName="sup"
      />
    </div>
    <div class="search-part">
      <span>班级名称：</span>
      <el-input
        placeholder="班级名称"
        v-model="teamName"
        clearable
        size="mini"
        class="inline-block"
        @input="handleDebounce"
      >
      </el-input>
    </div>
    <div class="search-part">
      <span>体验课类型：</span>
      <trial-course-type
        class="inline-block"
        name="type"
        @result="getTrialCourseType"
      />
    </div>
    <div class="search-part">
      <search-stage
        class="inline-block"
        :category="categoryType"
        :isDisabled="isDisabled"
        @result="stageRes"
        name="stage"
        type="0"
        placeholder="体验课排期"
      />
    </div>
  </div>
</template>

<script>
import SearchStage from '@/components/MSearch/searchItems/searchStage'
import Department from '@/components/MSearch/searchItems/department'
// 单双周搜索  体验课类型
import TrialCourseType from '@/components/MSearch/searchItems/trialClassType'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
import StageSupLevels from '@/components/MSearch/searchItems/stageSupLevels.vue'
import { debounce } from 'lodash'
export default {
  name: 'componentSearch',
  components: {
    SearchStage,
    Department,
    GroupSell,
    StageSupLevels,
    TrialCourseType,
  },
  data() {
    return {
      teamName: '',
      categoryType: [0, 2],
      searchParams: {},
      isDisabled: false,
    }
  },
  computed: {
    handleDebounce() {
      return debounce(this.inputHandler, 500)
    },
  },
  methods: {
    stageRes(val) {
      let term = ''
      if (val) {
        term = val.stage
      }
      this.searchRes(term, 'term')
    },
    deptRes(val) {
      // console.log(val)
      let department = ''
      if (val?.department?.length) {
        department = val.department
      }
      this.searchRes(department, 'department')
    },

    // 体验课类型
    getTrialCourseType(val) {
      console.log(val, '体验课类型')
      // 当数组为全部的时候直接赋值
      if (val) {
        this.categoryType = val.type
        if (val.type.length == 2) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      }
      let lesssonArr = []
      if (val.type.length == 2) {
        lesssonArr = ['0', '3', '503', '505']
      } else if (val.type[0] == '0') {
        lesssonArr = ['0', '503', '505']
      } else if (val.type[0] == '2') {
        lesssonArr = ['3']
      }
      this.searchRes(lesssonArr, 'category')
    },
    teacherRes(val) {
      let teacherId = ''
      // console.log(val)
      if (val) {
        teacherId = val.teacherId
      }
      this.searchRes(teacherId, 'teacherId')
    },
    supRes(val) {
      // console.log(val)
      let sup = ''
      if (val.sup.length) {
        sup = val.sup
        sup = sup.map((item) => `${item}`)
        sup = sup.join().split(',')
      }
      this.searchRes(sup, 'sup')
    },
    inputHandler() {
      this.searchRes(this.teamName, 'teamName')
    },
    searchRes(val, name) {
      this.searchParams[name] = val
      this.$emit('searchParams', this.searchParams)
    },
  },
}
</script>

<style lang="scss" scoped>
.component-search {
  background-color: #fff;
  padding: 10px 0 0 20px;
  .inline-block {
    display: inline-block;
    width: auto;
  }
  .search-part {
    display: inline-block;
    margin: 0 20px 10px 0;
  }
}
</style>
