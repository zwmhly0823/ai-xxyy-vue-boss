<!--
 * @Descripttion: 
 * @version: 
 * @Author: shentong
 * @Date: 2020-03-14 12:05:19
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-14 15:41:57
 -->
<template>
  <div>
    <ele-table
      :dataList="tableData"
      :loading="flags.loading"
      :size="query.size"
      :page="query.pageNum"
      :total="totalElements"
      @pageChange="pageChange_handler"
      class="mytable"
    >
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址" width="180">
      </el-table-column>

      <el-table-column label="自定义内容">
        <template slot-scope="scope">
          <div>{{ scope.row }}</div>
        </template>
      </el-table-column>
    </ele-table>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import EleTable from '@/components/Table/EleTable'
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      totalElements: 0,
      flags: {
        loading: true
      },
      query: {
        size: 2,
        pageNum: 1
      }
    }
  },
  components: {
    EleTable
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      setTimeout(() => {
        this.totalElements = this.tableData.length
        this.flags.loading = false
      }, 1000)
    },
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      this.query.pageNom = page
      // this.getList()
    }
  }
}
</script>
