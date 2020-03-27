<template>
  <div class="container">
    <div class="search-up">
      <m-search
        @search="handleSearch"
        topicType="topicType"
        stage="stage"
        sup="sup"
        level="current_level"
        date="octime"
        date-placeholder="下单时间"
        phone="umobile"
        style="width: 100%"
      />
    </div>
    <div class="search-export">
      <div><el-button size="small" type="primary">导出物流信息</el-button></div>
      <div><el-button size="small" type="primary">导入物流信息</el-button></div>
    </div>
  </div>
</template>

<script>
import MSearch from '@/components/MSearch/index.vue'
export default {
  components: {
    MSearch
  },
  methods: {
    handleSearch() {
      console.log('1111')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100px;
  background-color: #fff;
  padding: 5px;
  .search {
    display: flex;
    align-content: center;
    &-up {
      width: 100%;
    }
    &-export {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-content: center;
      & div {
        margin-right: 20px;
      }
    }
  }
}
</style>
