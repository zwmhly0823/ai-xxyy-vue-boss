<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2021-01-06 16:23:08
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-12 22:07:32
-->
<template>
  <div class="search-container d-flex justify-between" :key="resetSearch">
    <div class="form flex-1">
      <el-form
        :inline="true"
        ref="form"
        :model="form"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="学员搜索:">
          <div class="search-group">
            <search-phone-or-usernum-2
              style="margin-right: 10px;"
              type="2"
              tablename="StudentTrialV2StatisticsList"
              need-uid="uid"
              :team-id="teamId"
              @result="getSearchData('user', arguments)"
            />
          </div>
        </el-form-item>
        <!-- // packages_course_week 未转化-2；  半年课-24  年课-48 -->
        <!-- 有问题，临时取消 -->
        <!-- <el-form-item label="学员转化:" label-width="85px">
          <div class="search-group">
            <simple-select
              name="packages_course_week"
              placeholder="请选择"
              :my-style="{ width: '100px' }"
              :multiple="false"
              :data-list="conversionStatus"
              @result="getSearchData('packages_course_week', arguments)"
            />
          </div>
        </el-form-item> -->
        <el-form-item label="订单状态:" label-width="75px">
          <div class="search-group">
            <simple-select
              name="status"
              placeholder="请选择"
              :my-style="{ width: '100px' }"
              :multiple="false"
              :data-list="orderStatusList"
              :disabled="orderDisabled"
              @result="getSearchData('status', arguments)"
            />
          </div>
        </el-form-item>
        <el-form-item label="退费状态:" label-width="75px">
          <div class="search-group">
            <simple-select
              name="isrefund"
              placeholder="请选择"
              :my-style="{ width: '100px' }"
              :multiple="false"
              :data-list="orderRefundList"
              :disabled="refundDisabled"
              @result="getSearchData('isrefund', arguments)"
            />
          </div>
        </el-form-item>
        <br />
        <!-- 更多筛选项 -->
        <div v-show="showMore">
          <el-form-item label="订单类型:">
            <div class="search-group">
              <simple-select
                name="regtype"
                placeholder="请选择"
                :my-style="{ width: '100px' }"
                :multiple="true"
                :data-list="orderTypeList"
                @result="getSearchData('regtype', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="下单时间:" label-width="100px">
            <date-picker-with-quick-select
              :quick-btn="['day', 'yesterday', 'seven']"
              name="ctime"
              @result="getSearchData('ctime', arguments)"
            />
          </el-form-item>
          <el-form-item label="支付时间:">
            <date-picker-with-quick-select
              :quick-btn="['day', 'yesterday', 'seven']"
              name="buytime"
              @result="getSearchData('buytime', arguments)"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="handle">
      <!-- <el-link type="primary" :underline="false" @click="handleMore"
        >更多筛选<i :class="`el-icon-arrow-${showMore ? 'up' : 'down'}`"></i
      ></el-link> -->
      <el-link type="primary" :underline="false" @click="handleClear"
        >清空筛选</el-link
      >
    </div>
  </div>
</template>

<script>
import { getDataType } from '@/utils'
import SearchPhoneOrUsernum2 from '@/components/MSearch/searchItems/searchPhoneOrUsernum2.vue'
import DatePickerWithQuickSelect from '@/components/MSearch/searchItems/datePickerWithQuickSelect.vue'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
import enums from './searchData'
// import { isToss } from '@/utils/index'
export default {
  components: {
    SearchPhoneOrUsernum2,
    DatePickerWithQuickSelect,
    SimpleSelect
  },
  props: {
    statisticsIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      ...enums,
      showMore: true,
      form: {
        buytime: '',
        ctime: ''
      },
      searchQuery: {},
      nowDate: new Date().getTime(),
      teamId: ''
    }
  },
  computed: {
    resetSearch() {
      return this.nowDate
    },
    orderDisabled() {
      return [1, 2, 4, 5].includes(this.statisticsIndex)
    },
    refundDisabled() {
      return this.statisticsIndex === 3
    }
  },
  created() {
    const { id } = this.$route.params
    this.teamId = id
  },
  watch: {
    form: {
      handler(val, old) {
        if (val.ctime && val.ctime[0]) {
          Object.assign(this.searchQuery, {
            ctime: {
              gte: val.ctime[0],
              lte: val.ctime[1]
            }
          })
        } else {
          this.$delete(this.searchQuery, 'ctime')
        }
        if (val.buytime && val.buytime[0]) {
          Object.assign(this.searchQuery, {
            buytime: {
              gte: val.buytime[0],
              lte: val.buytime[1]
            }
          })
        } else {
          this.$delete(this.searchQuery, 'buytime')
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
    getSearchData(key, res) {
      const search = res && res[0]
      if (search) {
        console.log(search)
        // 系统课转化
        if (key === 'packages_course_week') {
          // 未转化
          if (search.packages_course_week === 0) {
            search.packages_course_week = { lte: 2 }
          }
          // 已购半年课
          if (search.packages_course_week === 2) {
            search.packages_course_week = 24
          }
          // 已购年课
          if (search.packages_course_week === 3) {
            search.packages_course_week = { gte: 48 }
          }
        }

        // 订单状态
        if (key === 'status') {
          search.status = search.status.split(',')
        }
        // 退费状态
        if (key === 'isrefund') {
          const { isrefund } = search
          search.isrefund =
            getDataType(isrefund) === 'String' && isrefund.includes(',')
              ? isrefund.split(',')
              : isrefund
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
      // 学员手机号或学员编号，订单中使用uid查询
      if (key === 'user') {
        if (!search.uid) this.$delete(this.searchQuery, 'uid')
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
