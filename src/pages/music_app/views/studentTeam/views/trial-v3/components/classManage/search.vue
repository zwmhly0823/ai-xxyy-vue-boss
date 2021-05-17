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
       <span>体验课排期：</span>
      <search-lesson-type
        v-if="oddWeekTrial.length !== 0 && doubleWeekTrial.length !== 0"
        :odd="oddWeekTrial"
        :double="doubleWeekTrial"
        @stageTypeRes="stageTypeRes">
      </search-lesson-type>
      <search-stage
        class="inline-block"
        :category="categoryType"
        @result="stageRes"
        name="stage"
        type="0"
        placeholder="体验课排期"
        :isDisabled="stageDisabled"
      />
    </div>
    <div class="search-part">
      <span>体验课套餐：</span>
      <trial-classtype
        class="class-list"
        name="class_list"
        placeholder="套餐名称"
        :my-style="{ width: '100px' }"
        :multiple="false"
        @result="getSearchData"
        :classArr="classArr"
      />
    </div>
  </div>
</template>

<script>
import SearchStage from '@/components/MSearch/searchItems/searchStage'
import Department from '@/components/MSearch/searchItems/department'
// 单双周搜索  体验课类型
import TrialClasstype from '@/components/MSearch/searchItems/trialClassType.vue'
import SearchLessonType from '@/components/MSearch/searchItems/searchLessonType.vue'
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
    TrialClasstype,
    SearchLessonType
  },
  data() {
    return {
      stageDisabled: true, //排期不可选状态
      classArr: [],
      oddWeekTrial: [], // 单周体验课
      doubleWeekTrial: [], // 双周周体验课
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
    // getTrialCourseType(val) {
    //   console.log(val, '体验课类型')
    //   // 当数组为全部的时候直接赋值
    //   if (val) {
    //     this.categoryType = val.type
    //     if (val.type.length == 2) {
    //       this.isDisabled = true
    //     } else {
    //       this.isDisabled = false
    //     }
    //   }
    //   let lesssonArr = []
    //   if (val.type.length == 2) {
    //     lesssonArr = ['0', '3', '503', '505']
    //   } else if (val.type[0] == '0') {
    //     lesssonArr = ['0', '503', '505']
    //   } else if (val.type[0] == '2') {
    //     lesssonArr = ['3']
    //   }
    //   this.searchRes(lesssonArr, 'category')
    // },
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
     // 接收单双周体验课类型
    stageTypeRes(val) {
      if(!val.category || val.category.length > 5) {
        this.classArr = []
        this.stageDisabled = true
      } else {
        this.stageDisabled = false
      }
      if(val.category[0] == this.doubleWeekTrial[0].id) {
        this.categoryType = [0]
        this.classArr = this.doubleWeekTrial
      } else if (val.category[0] == this.oddWeekTrial[0].id) {
        this.categoryType = [2]
        this.classArr = this.oddWeekTrial
      }
      this.searchParams.category = val.category
      this.$emit('searchParams', this.searchParams)
    },
    // 请求单双周的类型以及套餐
    getTrialClass() {
      this.$http.Order.getClassName('trialCourseCategoryList', JSON.stringify({type: 0}))
        .then(({data}) => this.doubleWeekTrial = data.trialCourseCategoryList.map(item => {
          item.text = item.name
          delete item.name
          return item
        }))      
      this.$http.Order.getClassName('trialCourseCategoryList', JSON.stringify({type: 2}))
        .then(({data}) => {this.oddWeekTrial = data.trialCourseCategoryList.map(item => {
          item.text = item.name
          delete item.name
          return item
        })
        })
    },
    // 接收套餐类型
    getSearchData(data) {
      if (data.class_list === 0) {
        data.class_list = '0'
      }
      this.searchParams.category = data.class_list
      this.$emit('searchParams', this.searchParams)
    }
  },
  created() {
    this.getTrialClass()
  }
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
    .class-list {
      display: inline-block;
    }
  }
}
</style>
