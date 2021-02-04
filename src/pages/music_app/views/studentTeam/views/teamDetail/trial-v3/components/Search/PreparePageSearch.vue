<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-28 11:29:53
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-12 18:09:59
-->
<template>
  <div class="search-container d-flex justify-between" :key="resetSearch">
    <div class="form flex-1">
      <el-form
        :inline="true"
        ref="form"
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
        <!-- // express_status 0 未转化 1 月课 2半年课 3 年课 -->
        <!-- 无地址、待审核、待发货、已发货、已完成、退款暂停发货、异常物流 -->
        <el-form-item
          v-if="!this.limit.isSpecial9dot9"
          label="盒子物流:"
          label-width="85px"
        >
          <div class="search-group">
            <simple-select
              name="express_status"
              placeholder="请选择"
              :my-style="{ width: '100px' }"
              :multiple="true"
              :data-list="FOLLOW_EXPRESS_STATUS_LIST"
              @result="getSearchData('express_status', arguments)"
            />
          </div>
        </el-form-item>
        <el-form-item
          label="意向度:"
          label-width="75px"
          v-if="!this.limit.isSpecial9dot9"
        >
          <div class="search-group">
            <simple-select
              name="user_intention_type"
              placeholder="请选择"
              :my-style="{ width: '100px' }"
              :multiple="true"
              :data-list="intentionList"
              @result="getSearchData('user_intention_type', arguments)"
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
import { FOLLOW_EXPRESS_STATUS_LIST } from '@/utils/enums'
import SearchPhoneOrUsernum from '@/components/MSearch/searchItems/searchPhoneOrUsernum.vue'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
import enums from './searchData'
// import { isToss } from '@/utils/index'
export default {
  props: {
    limit: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SearchPhoneOrUsernum,
    SimpleSelect
  },
  data() {
    return {
      ...enums,
      FOLLOW_EXPRESS_STATUS_LIST,
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
  methods: {
    handleClear() {
      this.nowDate = new Date().getTime()
      this.searchQuery = {}
      this.$emit('search', {})
    },
    getSearchData(key, res) {
      const search = res && res[0]
      if (search) {
        console.log(search)
        // 盒子物流
        if (key === 'express_status') {
          const { express_status: expressStatus } = search
          if (expressStatus && expressStatus.length > 0) {
            const express = expressStatus.map((item) => item.split(','))
            const arr = []
            for (const item of express) {
              arr.push(...item)
            }
            search.express_status = arr
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
