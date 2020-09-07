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
                style="margin-right: 10px;"
                type="2"
                :extension="true"
                user-num-key="user_num"
                tablename="UserSubjectStatisticsList"
                @result="getSearchData('uid', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="归属销售:" label-width="105px">
            <div class="search-group">
              <department
                name="teacher_ids"
                placeholder="选择销售组"
                style="margin-right: 10px;"
                @result="getSearchData('teacher_ids', arguments)"
              />
              <group-sell
                name="teacher_ids"
                tip="选择销售人员"
                is-multiple
                @result="getSearchData('teacher_ids', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="来源时间:" label-width="105px">
            <date-picker
              name="join_date"
              tip="时间控件"
              @result="getSearchData('join_date', arguments)"
            />
          </el-form-item>
          <el-form-item label="渠道选择:">
            <div class="search-group">
              <channel
                placeholder="请选择"
                :my-style="{ width: '100px' }"
                name="channel"
                @result="getSearchData('channel', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="系统课转化:" label-width="85px">
            <div class="search-group">
              <simple-select
                name="status"
                placeholder="请选择"
                :my-style="{ width: '100px' }"
                :multiple="false"
                :data-list="conversionStatus"
                @result="getSearchData('status', arguments)"
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
import Channel from '@/components/MSearch/searchItems/channel.vue'
import SearchPhoneOrUsernum from '@/components/MSearch/searchItems/searchPhoneOrUsernum.vue'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
import DatePicker from './Picker.vue'
import enums from '@/pages/write_app/views/users/components/searchData'

export default {
  components: {
    Department,
    GroupSell,
    SearchPhoneOrUsernum,
    Channel,
    SimpleSelect,
    DatePicker
  },
  props: {
    // 班级类型： 0-体验课 1-系统课
    teamType: {
      type: String,
      default: '0'
    },
    // 参数集合
    paramsToSearch: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      labelName: '',
      ...enums,
      searchQuery: {},
      nowDate: new Date().getTime()
    }
  },
  computed: {
    resetSearch() {
      return this.nowDate
    }
  },
  created() {},
  methods: {
    /**
     * search item 回调。 key,自定义参数，res，组件返回的值 res[0]
     */
    getSearchData(key, res) {
      const search = res && res[0]
      if (search) {
        // 系统课转化
        if (key === 'status') {
          // 未转化
          if (search.status === 0) {
            search.status = { lte: 2 }
          }
          // 已购半年课
          if (search.status === 2) {
            search.status = { gte: 11, lte: 12 }
          }
          // 已购年课
          if (search.status === 3) {
            search.status = { gte: 5, lte: 7 }
          }
        }

        this.searchQuery = {
          ...this.searchQuery,
          ...search
        }
      } else {
        this.$delete(this.searchQuery, key)
      }
      this.$emit('search', this.searchQuery)
    }
  }
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
        padding: 0 0 10px 10px;
      }
    }
    .el-form-item__label {
      font-size: inherit;
      font-weight: 500;
    }
    .el-form--inline .el-form-item {
      margin-bottom: -10px;
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
