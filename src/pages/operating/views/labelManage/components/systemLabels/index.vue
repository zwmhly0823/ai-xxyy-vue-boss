<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-05-30 18:37:24
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-10 10:56:11
-->
<template>
  <div class="system-label">
    <div class="search-box">
      <systemSearch
        class="search"
        @systemLabelInputValue="systemLabelInputValue"
        @onAttribute="onAttribute"
      />
    </div>
    <div class="table-bottom">
      <el-table
        :data="tableData"
        :header-cell-style="headerCss"
        style="width: 100%;border-top:1px solid #EBEEF5"
        @cell-mouse-enter="hoverow"
      >
        <el-table-column prop="name" label="标签名称" align="center">
        </el-table-column>
        <el-table-column prop="labelAttr" label="标签属性" align="center">
        </el-table-column>
        <el-table-column prop="desc" label="标签定义" align="center">
        </el-table-column>
        <el-table-column label="覆盖学员数" align="center">
          <template slot-scope="scope">
            <span style="color:#409eff;">{{ scope.row.userNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="changeRule" label="标签更改机制" align="center">
        </el-table-column>
      </el-table>
    </div>

    <m-pagination
      @current-change="handleCurrentChange"
      :current-page="+currentPage"
      :total="+totalElements"
      open="calc(100vw - 55px - 100px)"
      close="calc(100vw - 50px)"
    />
  </div>
</template>
<script>
import MPagination from '@/components/MPagination/index.vue'
import systemSearch from '../searchComponents/systemSearch'
export default {
  components: {
    systemSearch,
    MPagination
  },
  data() {
    return {
      tableData: [],
      currentPage: '1',
      totalElements: '',
      tableName: '',
      tableAttribute: ''
    }
  },
  created() {
    this.getFindLabelByPage()
  },
  methods: {
    getFindLabelByPage() {
      const params = {
        type: 'SYSTEM',
        name: (this.tableName = this.tableName ? this.tableName : ''),
        labelAttr: (this.tableAttribute = this.tableAttribute
          ? this.tableAttribute
          : null),
        pageNo: this.currentPage,
        pageSize: 20
      }
      this.$http.Operating.findLabelByPage(params).then((res) => {
        this.totalElements = res.payload.totalElements
        const _data = res.payload.content
        _data.forEach((item) => {
          item.labelAttr =
            item.labelAttr === 'CONSTANT' ? '恒量标签' : '变量标签'
          if (item.changeRule === 'ASSIGN') {
            item.changeRule = '用户购课后分到所属班级事件触发'
          } else if (item.changeRule === 'BUY_COURSE') {
            item.changeRule = '用户购课事件触发'
          }
        })
        this.tableData = _data
      })
    },
    // 打开编辑
    onEdit() {
      this.$refs.systemForms.dialogFormVisible = true
    },
    // 鼠标移入表格 获取表格数据
    hoverow(row, column, cell, event) {
      // console.log(row)
    },
    // 搜索组件 输入标签名称搜索
    systemLabelInputValue(data) {
      this.tableName = data
      this.getFindLabelByPage()
    },
    // 搜索组件 下拉属性
    onAttribute(data) {
      this.tableAttribute = data
      this.getFindLabelByPage()
      console.log(data)
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getFindLabelByPage()
      console.log(val)
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      return 'font-size:12px;color:#666;font-weight:normal;'
    }
  }
}
</script>
<style lang="scss" scoped>
.system-label {
  background: #f0f1f2;
  padding: 10px;
  height: calc(100vh - 150px);
  overflow: scroll;
  .search-box {
    padding-bottom: 10px;
    background: #f0f1f2;
    .search {
      padding-left: 20px;
      height: 50px;
      line-height: 50px;
      background: #fff;
    }
  }
  .table-bottom {
    margin-bottom: 28px;
  }
}
</style>
