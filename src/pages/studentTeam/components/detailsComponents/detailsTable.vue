<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-03-16 20:22:24
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-16 21:00:37
 -->
<template>
  <div>
    <el-table
      height="350"
      class="el-table-list"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      :header-cell-style="headerCss"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="35"> </el-table-column>
      <div prefix-icon="el-icon-more"></div>
      <el-table-column prop="name" label="手机号" width="120">
      </el-table-column>
      <el-table-column prop="name" label="购买时间" width="100">
      </el-table-column>
      <el-table-column prop="name" label="已加好友" width="120">
      </el-table-column>
      <el-table-column prop="name" label="已进群" width="120">
      </el-table-column>
      <el-table-column prop="name" label="关注公众号" width="120">
      </el-table-column>
      <el-table-column prop="name" label="微信信息" width="120">
      </el-table-column>
    </el-table>
    <div class="table-flex">
      <span
        >当前结果：共计<span class="table-flex-text">{{ student }}</span
        >个学员，<span class="table-flex-text">{{ friend }}</span
        >已加好友，<span class="table-flex-text">{{ group }}</span>
        已进微信群</span
      >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage3"
        :page-size="100"
        layout="prev, pager, next, jumper"
        :total="1000"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'detailsTable',
  props: [],
  data() {
    return {}
  },
  methods: {
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      console.log(row, column, rowIndex, columnIndex, 'headerCss')
    },
    // 复选框
    handleSelectionChange(val) {
      console.log(val, 'val')
      this.multipleSelection = val
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-flex {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  font-size: 12px;
  .table-flex-text {
    color: #1e90ff;
  }
}
.el-input-search {
  float: right;
  width: 180px;
}
.el-button--default {
  border-radius: 15px;
}
</style>
