<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-27 19:04:54
 * @LastEditors: Shentong
 * @LastEditTime: 2020-03-30 21:33:36
 -->
<template>
  <div class="container">
    <div class="search-up">
      <!-- <m-search
        @search="handleSearch"
        phone="umobile"
        :timeData="[
          { text: '购买时间', value: 'ctime' },
          { text: '揽收时间', value: 'delivery_collect_time' },
          { text: '签收时间', value: 'signing_time' }
        ]"
      /> -->
      <m-search
        @search="handleSearch"
        phone="user_id"
        stage="stage"
        sup="sup"
        :timeData="[
          { text: '购买时间', value: 'ctime' },
          { text: '揽收时间', value: 'delivery_collect_time' },
          { text: '签收时间', value: 'signing_time' }
        ]"
      />
    </div>
    <div class="search-export" v-if="!teacherId">
      <div @click="exportExpress">
        <el-button size="small" type="primary">导出物流信息</el-button>
      </div>
      <div @click="importExpress">
        <el-button size="small" type="primary">导入物流信息</el-button>
      </div>
      <div @click="importRelAddress">
        <el-button size="small" type="primary">导入收货信息</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { isToss } from '@/utils/index'
import MSearch from '@/components/MSearch/index.vue'
export default {
  components: {
    MSearch
  },
  data() {
    return {
      teacherId: ''
    }
  },
  created() {
    this.teacherId = isToss()
  },
  methods: {
    importExpress() {
      console.log('导入物流信息')
    },
    exportExpress() {
      console.log('导出物流信息')
    },
    handleSearch(search) {
      console.log(search, '1111')
      this.$emit('search', search)
    },
    importRelAddress() {
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
