<!--
 * @Author: songyanan
 * @Email: songyanan@meishubao.com
 * @Date: 2020-08-27 10:44:00
 * @Last Modified by: songyanan
 * @Last Modified time: 2020-08-27 16:38:13
-->
<template>
  <div class="search-container" :key="resetSearch">
    <el-card border="false" shadow="never">
      <div class="form">
        <el-form :inline="true" label-position="right" label-width="80px">
          <el-form-item label="学员搜索:">
            <div class="search-group">
              <search-phone-or-usernum
                style="margin-right: 10px"
                type="2"
                :extension="true"
                user-num-key="user_num"
                tablename="UserExtendsList"
                @result="getSearchData('uid', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="归属销售/班主任:" label-width="105px">
            <div class="search-group">
              <department
                name="last_department_ids"
                placeholder="选择销售组"
                style="margin-right: 10px"
                :multiple="false"
                :checkStrictly="true"
                :only-dept="1"
                @result="getSearchData('last_department_ids', arguments)"
              />
              <group-sell
                name="last_teacher_ids"
                tip="选择销售人员"
                @result="getSearchData('last_teacher_ids', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="归属教辅:" label-width="105px">
            <div class="search-group">
              <department
                name="last_department_ids"
                placeholder="选择教辅组"
                style="margin-right: 10px"
                :multiple="false"
                :checkStrictly="true"
                :only-dept="1"
                @result="getSearchData('last_department_ids', arguments)"
              />
              <group-sell
                name="last_teacher_ids"
                tip="选择教辅人员"
                @result="getSearchData('last_teacher_ids', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="学员转化:" label-width="85px">
            <div class="search-group">
              <simple-select
                name="status"
                placeholder="请选择"
                :dataList="studentList"
                :my-style="{ width: '100px' }"
                :multiple="false"
                @result="getSearchData('status', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="体验课类型:" label-width="85px">
            <div class="search-group">
              <trial-course-type
                name="category"
                @result="getSearchData('category', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="体验课排期:" label-width="80px">
            <div class="search-group">
              <search-stage
                :category="categoryType"
                :isDisabled="isDisabled"
                @result="getSearchData('category', arguments)"
                name="stage"
                type="1"
                placeholder="体验课排期"
              />
            </div>
          </el-form-item>

          <el-form-item label="进入直播时机:" label-width="100px">
            <div class="search-group">
              <buyGoods
                :category="categoryType"
                @result="getSearchData('category', arguments)"
                name="stage"
                type="0"
              />
            </div>
          </el-form-item>

          <el-form-item label="是否购买商品:" label-width="100px">
            <div class="search-group">
              <enterTime
                :category="categoryType"
                @result="getSearchData('category', arguments)"
                name="stage"
                type="0"
              />
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import Department from '@/components/MSearch/searchItems/department.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell.vue'
import SearchPhoneOrUsernum from '@/components/MSearch/searchItems/searchPhoneOrUsernum.vue'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
// 单双周搜索  体验课类型
import TrialCourseType from '@/components/MSearch/searchItems/trialClassType'
import SearchStage from '@/components/MSearch/searchItems/searchStage'
import buyGoods from '@/components/MSearch/searchItems/buyGoods'
import enterTime from '@/components/MSearch/searchItems/enterTime'
export default {
  components: {
    Department,
    GroupSell,
    buyGoods,
    enterTime,
    TrialCourseType,
    SearchStage,
    SearchPhoneOrUsernum,
    SimpleSelect,
  },
  props: {
    // 班级类型： 0-体验课 1-系统课
    teamType: {
      type: String,
      default: '0',
    },
    // 参数集合
    paramsToSearch: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      // 学员转化
      studentList: [
        {
          id: 1,
          text: '未转化',
        },
        {
          id: 2,
          text: '已购年系统课、',
        },
        {
          id: 3,
          text: '已购半年系统课',
        },
      ],
      labelName: '',
      searchQuery: {},
      categoryType: [2],
      isDisabled: false,
      nowDate: new Date().getTime(),
    }
  },
  computed: {
    resetSearch() {
      return this.nowDate
    },
  },
  created() {},
  methods: {
    /**
     * search item 回调。 key,自定义参数，res，组件返回的值 res[0]
     */
    getSearchData(key, res) {
      // 体验课类型
      if (key == 'category' && res[0].category && Array.from(res[0].category).length == 2) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
      const search = res && res[0]
      console.log(key, search)

      if (search) {
        // 系统课转化
        if (key === 'status') {
          // 未转化
          if (search.status === 1) {
            search.status = { gt: 0, lte: 2 }
          }
          // 已购半年课
          if (search.status === 3) {
            search.status = { gte: 11, lte: 12 }
          }
          // 已购年课
          if (search.status === 4) {
            search.status = { gte: 5, lte: 7 }
          }
        }

        if (key === 'last_department_ids') {
          Object.assign(search, {
            [`${key}.like`]: {
              [`${key}.keyword`]: `*${search[key].join(',')}*`,
            },
          })
        }

        if (key === 'last_teacher_ids') {
          Object.assign(search, {
            [`${key}.like`]: {
              [`${key}.keyword`]: `*${search[key]}*`,
            },
          })
        }

        this.searchQuery = {
          ...this.searchQuery,
          ...search,
        }
      } else {
        this.$delete(this.searchQuery, key)
        if (key === 'last_department_ids' || key === 'last_teacher_ids') {
          this.$delete(this.searchQuery, `${key}.like`)
        }
      }
      // 删除返回值没空数组的情况
      if (search && search[key].length === 0) {
        this.$delete(this.searchQuery, key)
        if (key === 'last_department_ids' || key === 'last_teacher_ids') {
          this.$delete(this.searchQuery, `${key}.like`)
        }
      }
      if (key === 'last_department_ids' || key === 'last_teacher_ids') {
        this.$delete(this.searchQuery, key)
      }
      this.$emit('search', this.searchQuery)
    },
  },
}
</script>

<style lang="scss" scoped>
.search-container {
  position: relative;
  font-size: 12px;
  .seat-div {
    margin-left: 20px;
    display: inline-block;
    visibility: hidden;
    button {
      display: inline-block;
    }
    p {
      display: inline-block;
      margin: 0 0 0 10px;
    }
  }
  .handle-area {
    position: absolute;
    right: 20px;
    bottom: 10px;
    p {
      margin: 0 0 0 10px;
      text-decoration: underline;
    }
  }

  ::v-deep {
    .el-card {
      border: 0;
      border-radius: 0;
      border-bottom: 1px solid #ddd;
      .el-card__body {
        padding: 0 0 30px 10px;
      }
    }
    .el-form-item__label {
      font-size: inherit;
      font-weight: 500;
    }
    .el-form--inline .el-form-item {
      margin-bottom: -10px;
    }
    .el-range-editor--mini.el-input__inner {
      height: 22px;
    }
    .el-range-editor--mini .el-range-separator {
      line-height: 17px;
    }
  }
}
.search-group {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0 !important;
  &-item {
    margin-right: 10px;
  }
}
</style>
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
