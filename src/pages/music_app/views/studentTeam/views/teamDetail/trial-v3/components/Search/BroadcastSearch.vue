<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-28 11:29:53
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-12 17:38:34
-->
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
              :activeId="activeId"
              need-uid="uid"
              tablename="ActivityUserStatisticsList"
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
        <el-form-item label="是否进入直播间:" label-width="90">
            <div class="search-group">
              <simple-select
                name="in_room_num"
                placeholder="请选择"
                :my-style="{ width: '100px' }"
                :multiple="false"
                :data-list="isRoom"
                @result="getSearchData('in_room_num', arguments)"
              />
            </div>
          </el-form-item>
        <el-form-item label="是否购买商品:" label-width="90px">
          <div class="search-group">
            <simple-select
              name="by_shop_flag"
              placeholder="请选择"
              :my-style="{ width: '100px' }"
              :multiple="false"
              :data-list="isBuy"
              @result="getSearchData('by_shop_flag', arguments)"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="handle">
      <el-link type="primary" :underline="false" @click="handleClear"
        >清空筛选</el-link
      >
    </div>
  </div>
</template>

<script>
import SearchPhoneOrUsernum from './searchPhoneOrUsernum.vue'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
import enums from './searchData'
// import { isToss } from '@/utils/index'
export default {
  props: {
    activeId: {
      type: String,
      default: ''
    },
  },
  components: {
    SearchPhoneOrUsernum,
    SimpleSelect
  },
  data() {
    return {
      ...enums,
      form: {
        last_complete_time: '',
        last_join_time: ''
      },
      searchQuery: {},
      nowDate: new Date().getTime(),
      teamId: ''
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
        if (val.last_join_time && val.last_join_time[0]) {
          Object.assign(this.searchQuery, {
            last_join_time: {
              gte: val.last_join_time[0],
              lte: val.last_join_time[1]
            }
          })
        } else {
          this.$delete(this.searchQuery, 'last_join_time')
        }
        if (val.last_complete_time && val.last_complete_time[0]) {
          Object.assign(this.searchQuery, {
            last_complete_time: {
              gte: val.last_complete_time[0],
              lte: val.last_complete_time[1]
            }
          })
        } else {
          this.$delete(this.searchQuery, 'last_complete_time')
        }
        this.$emit('search', this.searchQuery)
      },
      deep: true
    }
  },
  methods: {
    handleClear() {
      this.nowDate = new Date().getTime()
      this.$refs.form.resetFields()
      this.searchQuery = {}
      this.$emit('search', {})
    },
    getSearchData(key, res) {
      const search = res && res[0]
      if (search) {
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

        if(key === 'in_room_num') {
          if (search.in_room_num === 1) {
            search.in_room_num = { gt: 0}
          }
        }

        // user_label 标签
        if (key === 'user_label.like') {
          search['user_label.like'] = {
            'user_label.keyword': `*${search['user_label.like']}*`
          }
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
      if (key === 'user') {
        if (search.mobile && search.mobile.length === 0)
          this.$delete(this.searchQuery, 'mobile')
        if (search.user_num_text && search.user_num_text.length === 0)
          this.$delete(this.searchQuery, 'user_num_text')
        if (!search.mobile && !search.user_num_text) {
          this.$delete(this.searchQuery, 'mobile')
          this.$delete(this.searchQuery, 'user_num_text')
        }
      }

      // if (this.form.last_join_time) {
      //   Object.assign(this.searchQuery, {
      //     last_join_time: this.form.last_join_time
      //   })
      // } else {
      //   this.$delete(this.searchQuery, 'last_join_time')
      // }
      // if (this.form.last_complete_time) {
      //   Object.assign(this.searchQuery, {
      //     last_complete_time: this.form.last_complete_time
      //   })
      // } else {
      //   this.$delete(this.searchQuery, 'last_complete_time')
      // }

      this.$emit('search', this.searchQuery)
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
