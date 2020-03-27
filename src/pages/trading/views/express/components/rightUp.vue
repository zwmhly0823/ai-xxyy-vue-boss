<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-27 19:04:54
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-27 20:08:57
 -->
<template>
  <div class="container">
    <div class="search-up">
      <m-search
        @search="handleSearch"
        topicType="topic_id"
        stage="stage"
        sup="sup"
        level="current_level"
        phone="umobile"
        :timeData="[
          { text: '创建时间', value: 'ectime' },
          { text: '发货时间', value: 'delivery_time' },
          { text: '签收时间', value: 'signing_time' }
        ]"
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
    handleSearch(res) {
      console.log(res, '1111')
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
