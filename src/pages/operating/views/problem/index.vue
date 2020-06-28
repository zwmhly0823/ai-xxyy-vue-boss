<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-24 17:01:54
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-24 17:16:33
-->
<template>
  <div class="problem-box">
    <div class="wenjuan-css">
      <el-button @click="onNewWenjuan" size="mini" type="primary"
        ><i class="el-icon-plus"></i>创建问卷</el-button
      >
    </div>
    <div class="table-box">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="问卷名称" align="center">
        </el-table-column>
        <el-table-column prop="name" label="问卷说明" align="center">
        </el-table-column>
        <el-table-column prop="address" label="封面图" align="center">
        </el-table-column>
        <el-table-column prop="address" label="地址" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div style="display:none;">{{ scope.row }}</div>
            <div>
              <el-button type="text">修改</el-button
              ><el-button type="text">发布</el-button
              ><el-button type="text" disabled>复制地址</el-button>
            </div>
            <!-- <div>
              <el-button type="text" disabled>修改</el-button
              ><el-button type="text" disabled>发布</el-button
              ><el-button type="text">复制地址</el-button>
            </div> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
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
      ]
    }
  },
  methods: {
    onNewWenjuan() {}
  }
}
</script>

<style lang="scss" scoped>
.problem-box {
  margin: 10px;
  .wenjuan-css {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding-right: 20px;
    height: 50px;
    background: #fff;
  }
  .table-box {
    margin-top: 10px;
  }
}
</style>
