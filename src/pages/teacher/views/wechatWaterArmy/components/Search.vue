<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2021-01-26 17:56:15
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-28 20:22:09
-->
<template>
  <div class="search d-flex align-center">
    <div class="search-item">
      <el-input
        v-model="weixinNo"
        placeholder="微信号搜索"
        size="mini"
        suffix-icon="el-icon-search"
        @input="handleDebounce"
        clearable
        style="width: 140px;"
      />
    </div>
    <div class="search-item">
      <simple-select
        placeholder="智群登陆状态"
        name="zqStatus"
        :multiple="false"
        :data-list="statusList"
        @result="getStatus"
      />
    </div>
    <div class="search-item">
      <department
        placeholder="所属部门"
        name="departmentIds"
        :only-dept="1"
        @result="getDepartment"
      />
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect'
import Department from '@/components/MSearch/searchItems/department'
export default {
  components: {
    SimpleSelect,
    Department
  },
  data() {
    return {
      weixinNo: '',
      statusList: [
        {
          id: 0,
          text: '离线'
        },
        {
          id: 1,
          text: '在线'
        },
        {
          id: 2,
          text: '未知'
        }
      ],
      searchParams: {}
    }
  },
  computed: {
    handleDebounce() {
      return debounce(this.handleInput, 500)
    }
  },
  watch: {
    searchParams: {
      handler(val) {
        this.$emit('search', val)
      },
      deep: true
    }
  },
  methods: {
    handleInput(res) {
      if (res) {
        this.$set(this.searchParams, 'weixinNo', res)
      } else {
        this.$delete(this.searchParams, 'weixinNo')
      }
    },
    getStatus(res) {
      if (res.zqStatus!=2) {
        this.$set(this.searchParams, 'zqStatus', res.zqStatus)
      } else {
        this.$delete(this.searchParams, 'zqStatus')
      }
    },
    getDepartment(res) {
      if (res) {
        this.$set(this.searchParams, 'departmentIds', res.departmentIds)
      } else {
        this.$delete(this.searchParams, 'departmentIds')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-item {
  margin: 0 0 0 5px;
}
</style>
