<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-05-30 18:37:24
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-01 17:32:08
-->
<template>
  <div class="system-label">
    <div class="search-box">
      <systemSearch
        class="search"
        @systemLabelInputValue="systemLabelInputValue"
        @onClassification="onClassification"
        @onAttribute="onAttribute"
      />
    </div>
    <div class="table-bottom">
      <el-table
        :data="tableData"
        style="width: 100%;border-top:1px solid #EBEEF5"
        @cell-mouse-enter="hoverow"
      >
        <el-table-column prop="name" label="标签名称" align="center">
        </el-table-column>
        <el-table-column prop="name" label="标签分类" align="center">
        </el-table-column>
        <el-table-column prop="name" label="标签属性" align="center">
        </el-table-column>
        <el-table-column prop="name" label="标签排序" align="center">
        </el-table-column>
        <el-table-column prop="name" label="标签定义" align="center">
        </el-table-column>
        <el-table-column prop="name" label="覆盖学员数" align="center">
          <template slot-scope="scope">
            <span style="color:#409eff;">{{ scope.row.name }}</span>
            <!-- <span style="color:#4644f6;">{{ scope.row }}</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="name" label="标签更改机制" align="center">
        </el-table-column>
        <el-table-column prop="name" label="创建人" align="center">
        </el-table-column>
        <el-table-column prop="name" label="操作" align="center">
          <template slot-scope="scope">
            <span style="display:none;">{{ scope.row }}</span>
            <span @click="onEdit" style="color:#409eff;cursor:pointer;"
              >编辑</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <m-pagination
      @current-change="handleCurrentChange"
      :current-page="+1"
      :total="+20"
      open="calc(100vw - 55px - 100px)"
      close="calc(100vw - 50px)"
    />
    <systemForm @onRefresh="onRefresh" ref="systemForms" />
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
import systemSearch from '../searchComponents/systemSearch'
import systemForm from '../systemLabels/systemForm'
export default {
  components: {
    systemSearch,
    systemForm,
    MPagination
  },
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
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  methods: {
    // 打开编辑
    onEdit() {
      this.$refs.systemForms.dialogFormVisible = true
    },
    // 鼠标移入表格 获取表格数据
    hoverow(row, column, cell, event) {
      console.log(row)
    },
    // 点击保存 子组件返回值
    onRefresh(data) {
      console.log(data)
    },
    // 搜索组件 输入标签名称搜索
    systemLabelInputValue(data) {
      console.log(data)
    },
    // 搜索组件 下拉分类
    onClassification(data) {
      console.log(data)
    },
    // 搜索组件 下拉属性
    onAttribute(data) {
      console.log(data)
    },
    // 分页
    handleCurrentChange(val) {
      console.log(val)
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
