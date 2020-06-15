<template>
  <div class="search-container">
    <el-card border="false" shadow="never">
      <div class="form">
        <el-form :inline="true" label-position="right" label-width="80px">
          <el-form-item label="课前准备:" class="search-group">
            <simple-select
              name="added_wechat"
              placeholder="是否添加微信"
              :multiple="false"
              :data-list="addedWechatStatus"
              @result="getSearchData('added_wechat', arguments)"
              class="search-group-item"
            />
            <simple-select
              name="added_group"
              placeholder="是否进群"
              :multiple="false"
              :data-list="addedGroupStatus"
              @result="getSearchData('added_group', arguments)"
              class="search-group-item"
            />
            <follow-express-status
              name="express_status"
              @result="getSearchData('express_status', arguments)"
              class="search-group-item"
            />
            <simple-select
              name="follow"
              placeholder="是否关注公众号"
              :multiple="false"
              :data-list="followWechatStatus"
              @result="getSearchData('follow', arguments)"
              class="search-group-item"
            />
          </el-form-item>
          <el-form-item label="今日学习:" class="search-group">
            <simple-select
              name="is_today_join_course"
              placeholder="是否参课"
              :multiple="false"
              :data-list="joinCourseStatus"
              @result="getSearchData('is_today_join_course', arguments)"
              class="search-group-item"
            />
            <simple-select
              name="is_today_complete_course"
              placeholder="是否完课"
              :multiple="false"
              :data-list="completeCourseStatus"
              @result="getSearchData('is_today_complete_course', arguments)"
              class="search-group-item"
            />
            <simple-select
              name="has_today_course_task"
              placeholder="是否上传作品"
              :multiple="false"
              :data-list="courseTaskStatus"
              @result="getSearchData('has_today_course_task', arguments)"
              class="search-group-item"
            />
          </el-form-item>
          <el-form-item label="招生排期:" class="search-group">
            <!-- 体验课 -->
            <department
              name="department_id"
              :only-dept="1"
              placeholder="全部销售组"
              @result="getSearchData('department_id', arguments)"
              class="search-group-item"
            />
            <group-sell
              name="teacher_id"
              tip="全部社群销售"
              is-multiple
              @result="getSearchData('teacher_id', arguments)"
              class="search-group-item"
            />
            <search-stage
              class="search-group-item"
              name="term"
              placeholder="全部体验课排期"
              type="0"
              @result="getSearchData('term', arguments)"
            />
            <hard-level
              class="search-group-item"
              placeholder="全部体验课难度"
              style="width:140px"
              name="sup"
              @result="getSearchData('sup', arguments)"
            />
            <!-- // conversion_type 0 未转化 1 月课 2半年课 3 年课 -->
            <simple-select
              name="conversion_type"
              placeholder="是否转化"
              :multiple="false"
              :data-list="conversionStatus"
              @result="getSearchData('conversion_type', arguments)"
              class="search-group-item"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="extra">
      <div class="extra-up">
        <search-phone-and-username
          name="id"
          type="2"
          :custom-style="{ width: '195px !important' }"
          tablename="StudentTrialStatisticsListEx"
          @result="getSearchData('id', arguments)"
        />
      </div>
      <div class="extra-down">
        <slot name="down"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import FollowExpressStatus from '@/components/MSearch/searchItems/followExpressStatus.vue'
import Department from '@/components/MSearch/searchItems/department.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell.vue'
import SearchStage from '@/components/MSearch/searchItems/searchStage.vue'
import HardLevel from '@/components/MSearch/searchItems/hardLevel.vue'
import SearchPhoneAndUsername from '@/components/MSearch/searchItems/searchPhoneAndUsername.vue'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
import enums from '../components/searchData'
export default {
  components: {
    FollowExpressStatus,
    Department,
    GroupSell,
    SearchStage,
    HardLevel,
    SearchPhoneAndUsername,
    SimpleSelect
  },
  props: {
    // 班级类型： 0-体验课 1-系统课
    teamType: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      ...enums,
      searchQuery: {}
    }
  },
  methods: {
    /**
     * search item 回调。 key,自定义参数，res，组件返回的值 res[0]
     */
    getSearchData(key, res) {
      const search = res && res[0]
      console.log(key, res)

      if (search) {
        if (key === 'sup') {
          const r = search[key].map((item) => `s${item}`)
          search[key] = r
        }
        this.searchQuery = {
          ...this.searchQuery,
          ...search
        }
      } else {
        // delete this.searchQuery[key]
        this.$delete(this.searchQuery, key)
      }
      // 删除返回值没空数组的情况
      if (search && search[key].length === 0) {
        this.$delete(this.searchQuery, key)
      }
      console.log(search, 'getSearchData')
      console.log(this.searchQuery, 'this.searchQuery')
      this.$emit('search', this.searchQuery)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  display: flex;
  justify-content: space-between;
  .el-card /deep/ {
    border: 0;
    .el-card__body {
      padding: 0 0 10px 0;
    }
  }
  .extra {
    padding: 10px 0;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // &-up {
    //   flex: 1;
    // }
    // &-down {
    //   flex: 1;
    // }
  }
}
.search-group /deep/ {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0 !important;
  .el-form-item__content {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    .search-group-item {
      margin-right: 10px;
    }
  }
}
</style>
