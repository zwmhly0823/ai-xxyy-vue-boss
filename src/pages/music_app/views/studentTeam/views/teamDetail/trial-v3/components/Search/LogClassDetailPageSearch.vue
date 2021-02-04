<template>
  <div class="search-container d-flex justify-between" :key="resetSearch">
    <div class="form">
      <el-form
        :inline="true"
        ref="form"
        :model="form"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="学员搜索:">
          <div class="search-group">
            <search-phone-or-usernum
              style="margin-right: 10px;"
              type="2"
              :team-id="teamId"
              tablename="StudentTrialV2StatisticsList"
              @result="getSearchData('user', arguments)"
            />
          </div>
        </el-form-item>
        <!-- // user_status 0 未转化 1 月课 2半年课 3 年课 -->
        <el-form-item label="学员转化:" label-width="85px">
          <div class="search-group">
            <simple-select
              name="user_status"
              placeholder="请选择"
              :my-style="{ width: '100px' }"
              :multiple="false"
              :data-list="conversionStatus"
              @result="getSearchData('user_status', arguments)"
            />
          </div>
        </el-form-item>
        <el-form-item label="上课情况:" label-width="75px">
          <div class="search-group">
            <el-radio-group
              style="line-height: 40px"
              v-model="classStatus"
              @change="classStatusChange($event, arguments)"
              size="mini"
            >
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="已完课"></el-radio-button>
              <el-radio-button label="参课未完课"></el-radio-button>
              <el-radio-button label="未参课"></el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
        <br />
        <!-- 更多筛选项 -->
        <div v-show="showMore">
          <el-form-item label="最近参课:" prop="last_join_course_time">
            <div class="search-group">
              <el-radio-group
                style="line-height: 40px"
                v-model="joinCourseRadio"
                size="mini"
                @change="radioChange($event, 'joinCourse')"
              >
                <el-radio-button label="今天"></el-radio-button>
                <el-radio-button label="昨天"></el-radio-button>
                <el-radio-button label="最近7天"></el-radio-button>
                <el-radio-button label="最近14天"></el-radio-button>
              </el-radio-group>
              <el-date-picker
                class="date-picker"
                style="width: 220px; margin-top: 6px"
                v-model="form.last_join_course_time"
                type="daterange"
                size="mini"
                value-format="timestamp"
                start-placeholder="参课时间"
                end-placeholder="参课时间"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="最近完课:" prop="last_complete_course_time">
            <div class="search-group">
              <el-radio-group
                style="line-height: 40px"
                v-model="completeCourseRadio"
                size="mini"
                @change="radioChange($event, 'completeCourse')"
              >
                <el-radio-button label="今天"></el-radio-button>
                <el-radio-button label="昨天"></el-radio-button>
                <el-radio-button label="最近7天"></el-radio-button>
                <el-radio-button label="最近14天"></el-radio-button>
              </el-radio-group>
              <el-date-picker
                class="date-picker"
                style="width: 220px; margin-top: 6px"
                v-model="form.last_complete_course_time"
                type="daterange"
                size="mini"
                value-format="timestamp"
                start-placeholder="完课时间"
                end-placeholder="完课时间"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="最近传作品:" prop="last_task_time">
            <div class="search-group">
              <el-radio-group
                style="line-height: 40px"
                v-model="taskRadio"
                size="mini"
                @change="radioChange($event, 'task')"
              >
                <el-radio-button label="今天"></el-radio-button>
                <el-radio-button label="昨天"></el-radio-button>
                <el-radio-button label="最近7天"></el-radio-button>
                <el-radio-button label="最近14天"></el-radio-button>
              </el-radio-group>
              <el-date-picker
                class="date-picker"
                style="width: 220px; margin-top: 6px"
                v-model="form.last_task_time"
                type="daterange"
                size="mini"
                value-format="timestamp"
                start-placeholder="传作品时间"
                end-placeholder="传作品时间"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="handle">
      <el-link type="primary" :underline="false" @click="handleMore"
        >更多筛选<i :class="`el-icon-arrow-${showMore ? 'up' : 'down'}`"></i
      ></el-link>
      <el-link type="primary" :underline="false" @click="handleClear"
        >清空筛选</el-link
      >
    </div>
  </div>
</template>

<script>
import SearchPhoneOrUsernum from '@/components/MSearch/searchItems/searchPhoneOrUsernum.vue'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
import enums from './searchData'
// import { isToss } from '@/utils/index'
export default {
  components: {
    SearchPhoneOrUsernum,
    SimpleSelect
  },
  data() {
    return {
      ...enums,
      showMore: true,
      form: {
        last_complete_course_time: '',
        last_join_course_time: '',
        last_task_time: ''
      },
      searchQuery: {},
      nowDate: new Date().getTime(),
      teamId: '',
      classStatus: '',
      joinCourseRadio: '',
      completeCourseRadio: '',
      taskRadio: ''
    }
  },
  computed: {
    resetSearch() {
      return this.nowDate
    }
  },
  created() {
    const { id } = this.$route.params
    this.teamId = id
  },
  watch: {
    form: {
      handler(val, old) {
        if (val.last_join_course_time && val.last_join_course_time[0]) {
          Object.assign(this.searchQuery, {
            last_join_course_time: {
              gte: val.last_join_course_time[0],
              lte: val.last_join_course_time[1]
            }
          })
        } else {
          this.joinCourseRadio = ''
          this.$delete(this.searchQuery, 'last_join_course_time')
        }
        if (val.last_complete_course_time && val.last_complete_course_time[0]) {
          Object.assign(this.searchQuery, {
            last_complete_course_time: {
              gte: val.last_complete_course_time[0],
              lte: val.last_complete_course_time[1]
            }
          })
        } else {
          this.completeCourseRadio = ''
          this.$delete(this.searchQuery, 'last_complete_course_time')
        }
        if (val.last_task_time && val.last_task_time[0]) {
          Object.assign(this.searchQuery, {
            last_task_time: {
              gte: val.last_task_time[0],
              lte: val.last_task_time[1]
            }
          })
        } else {
          this.taskRadio = ''
          this.$delete(this.searchQuery, 'last_task_time')
        }
        this.$emit('search', this.searchQuery)
      },
      deep: true
    }
  },
  methods: {
    handleMore() {
      this.showMore = !this.showMore
    },
    handleClear() {
      this.nowDate = new Date().getTime()
      this.$refs.form.resetFields()
      this.searchQuery = {}
      this.$emit('search', {})
    },
    classStatusChange(label, argu) {
      switch (label) {
        case '全部':
          argu[0] = ''
          break
        case '已完课':
          argu[0] = { state: 1 }
          break
        case '参课未完课':
          argu[0] = { state: 0 }
          break
        case '未参课':
          argu[0] = { state: 2 }
          break
      }
      this.getSearchData('state', argu)
    },
    radioChange(label, type) {
      const today0clock = new Date(new Date().toLocaleDateString()).getTime()
      const today24clock = today0clock + 24 * 60 * 60 * 1000 - 1
      let time = []
      switch (label) {
        case '今天':
          time = [today0clock, today24clock]
          break
        case '昨天':
          time = [today0clock - 24 * 60 * 60 * 1000, today0clock - 1]
          break
        case '最近7天':
          time = [today0clock - 6 * 24 * 60 * 60 * 1000, today24clock]
          break
        case '最近14天':
          time = [today0clock - 13 * 24 * 60 * 60 * 1000, today24clock]
          break
      }
      if (type === 'joinCourse') {
        this.form.last_join_course_time = time
      } else if (type === 'completeCourse') {
        this.form.last_complete_course_time = time
      } else if (type === 'task') {
        this.form.last_task_time = time
      }
    },
    async getSearchData(key, res) {
      // console.log(key)
      // console.log(res)
      const search = res && res[0]
      if (search) {
        // console.log(search)
        // 系统课转化
        if (key === 'user_status') {
          // 未转化
          if (search.user_status === 0) {
            search.user_status = { lte: 2 }
          }
          // 已购半年课
          if (search.user_status === 2) {
            search.user_status = { gte: 11, lte: 12 }
          }
          // 已购年课
          if (search.user_status === 3) {
            search.user_status = { gte: 5, lte: 7 }
          }
        }
        // 走模糊查询
        if (key === 'user') {
          const studentId = await this.getStudentByMobileOrNum(res[0])
          // console.log('studentId', studentId)
          search.student_id = studentId
          delete search.mobile
          delete search.user_num_text
        }

        this.searchQuery = {
          ...this.searchQuery,
          ...search
        }
      } else {
        this.$delete(this.searchQuery, key)
      }

      // 删除返回值没空数组的情况
      if (key !== 'user' && search && search[key].length === 0) {
        this.$delete(this.searchQuery, key)
      }
      // 学员手机号或学员编号
      if (key === 'user' && !res[0]) {
        // console.log('!res[0]', res[0])
        this.$delete(this.searchQuery, 'student_id')
      }
      // console.log(this.searchQuery)
      this.$emit('search', this.searchQuery)
    },
    getStudentByMobileOrNum(num) {
      const numText = num.mobile || num.user_num_text
      return this.$http.Base.getUserNumPhone(numText).then((res) => {
        if (res?.data?.UserExtendsListEx?.length === 1) {
          return res.data.UserExtendsListEx[0].u_id
        } else if (
          res?.data?.UserExtendsListEx?.length > 1 &&
          num.length < 11
        ) {
          const arrList = []
          res.data.UserExtendsListEx.map((item) => {
            arrList.push(item.user_num)
          })
          const idx = arrList.indexOf(num)
          return res.data.UserExtendsListEx[idx].u_id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mg-l-10 {
  margin-left: 10px;
}
.search-container {
  position: relative;
  padding: 6px 0;
  margin-bottom: 8px;
  font-size: 12px;
  border-bottom: 1px solid #dfe6ee;
  ::v-deep {
    .el-form-item__label {
      font-size: inherit;
      font-weight: 500;
    }
    .el-form--inline .el-form-item {
      margin-bottom: 0;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 130px;
    }
    .handle {
      margin-top: 15px;
      .el-link {
        margin-left: 10px;
        font-size: 12px;
        font-weight: normal;
      }
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
