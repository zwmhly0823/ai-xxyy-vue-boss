<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-07-23 16:26:04
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-23 18:41:29
-->
<template>
  <div class="history-box">
    <div>
      <groupSell
        @onHandover="onHandover"
        @onReceive="onReceive"
        @onType="onType"
      />
    </div>
    <div class="table-box">
      <el-table
        :header-cell-style="headerCss"
        :data="tableData"
        style="width: 100%;margin-bottom:50px;"
      >
        <el-table-column prop="date" label="交接类型"> </el-table-column>
        <el-table-column prop="name" label="交出方"> </el-table-column>
        <el-table-column prop="name" label="交出内容"> </el-table-column>
        <el-table-column prop="name" label="接收方"> </el-table-column>
        <el-table-column prop="name" label="接收微信号"> </el-table-column>
        <el-table-column prop="name" label="操作人"> </el-table-column>
        <el-table-column prop="name" label="交接时间"> </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        style="bottom:0px;right:0px;"
        @current-change="handleCurrentChange"
        :current-page="+currentPage"
        :total="+totalElements"
        open="calc(100vw - 147px)"
        close="calc(100vw - 26px)"
      />
    </div>
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
import groupSell from './groupSell.vue'
export default {
  components: {
    groupSell,
    MPagination
  },
  data() {
    return {
      currentPage: '1',
      totalElements: '',
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  methods: {
    onHandover(data) {
      console.log(data)
    },
    onReceive(data) {
      console.log(data)
    },
    onType(data) {
      console.log(data)
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
    },
    headerCss({ row, column, rowIndex, columnIndex }) {
      return 'font-size:12px;color:#666;font-weight:normal;background:#f1f1f1;'
    }
  }
}
</script>

<style lang="scss" scoped>
.history-box {
  .table-box {
    // margin-bottom: 60px;
  }
}
</style>
