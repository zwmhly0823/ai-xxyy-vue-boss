<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-03-16 20:22:24
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-18 20:10:53
 -->
<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tables.tableData"
      tooltip-effect="dark"
      :header-cell-style="headerCss"
      :row-class-name="tableRowClassName"
      @row-click="onClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column
        align="center"
        v-for="(item, index) in tables.tableLabel"
        :key="index"
        :prop="item.prop"
        :width="item.width"
        :label="item.label"
      >
      </el-table-column>
    </el-table>
    <div class="table-flex">
      <span class="table-text"
        >当前结果：共计<span class="table-flex-text">{{ tables.student }}</span
        >个学员，<span class="table-flex-text">{{ tables.friend }}</span
        >已加好友，<span class="table-flex-text">{{ tables.group }}</span>
        已进微信群</span
      >
      <el-pagination
        class="page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="tables.currentPage"
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
  props: ['tables'],
  data() {
    return {
      multipleSelection: []
    }
  },
  mounted() {},
  created() {},
  methods: {
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    onClick(row, column, event) {
      this.index = row.index
      // console.log(row, column, event, index)
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex, 'headerCss')
    },
    // 复选框
    handleSelectionChange(val) {
      console.log(val, 'val', this.table)
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
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  .table-text {
    padding-top: 5px;
    .table-flex-text {
      color: #1e90ff;
    }
  }
  .page {
    padding-top: 5px;
  }
}
</style>
