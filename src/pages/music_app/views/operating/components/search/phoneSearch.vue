<template>
  <div class="search-box">
    <div class="search-item">
      <span class="search-text">学员查询</span>
      <search-phone
        @result="getSearchPhoneData"
        name="student_id"
        tip="学员手机号"
      />
    </div>
  </div>
</template>

<script>
import SearchPhone from '@/components/MSearch/searchItems/searchPhone'
export default {
  name: 'haveRiviewSearch',
  components: {
    SearchPhone,
  },
  data() {
    return {
      searchParams: {},
    }
  },
  methods: {
    getSearchPhoneData(val) {
      val
        ? Object.assign(this.searchParams, val)
        : this.$delete(this.searchParams, 'student_id')
      this.$emit('result', this.searchParams)
    },
    // resetPartOfFormData(val) {
    //   console.log(val, 'student')
    // }
  },
}
</script>

<style lang="scss" scoped>
.search-box {
  .search-item {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 10px;
    .search-text {
      font-size: 12px;
      margin-right: 10px;
    }
  }
  /deep/ .el-icon-circle-close {
    color: #c0c4cc;
  }
}
</style>