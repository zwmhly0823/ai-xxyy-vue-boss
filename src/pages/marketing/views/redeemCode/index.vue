<!--
 * @Descripttion: 兑换码 - 列表
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-06 17:15:04
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-06 18:36:54
-->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container redeem-code">
      <div class="redeem-code-header d-flex">
        <el-button type="primary" size="mini">创建兑换码</el-button>
      </div>
      <!-- list -->
      <div class="redeem-code-list">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="兑换码标题" width="180">
          </el-table-column>
          <el-table-column prop="name" label="兑换个数/个数" width="180">
          </el-table-column>
          <el-table-column prop="address" label="套餐商品"> </el-table-column>
          <el-table-column prop="address" label="客户标识"> </el-table-column>
          <el-table-column prop="address" label="有效期"> </el-table-column>
          <el-table-column prop="address" label="状态"> </el-table-column>
          <el-table-column label="操作">
            <template>
              <p class="primary-text">
                <span>码库</span> | <span @click="handleInvalid">失效</span> |
                <span @click="handleDelete">删除</span>
              </p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-row>
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
      ],
      visibleInvalid: false,
      visibleDelete: false
    }
  },

  methods: {
    // 失效
    handleInvalid(row) {
      console.log(row, 'invalid')
      this.$confirm('设为失效后，兑换码将不可继续使用！', '提示', {
        type: 'warning'
      }).then(() => {
        // TODO: 调用接口
        this.$message.success('操作成功')
      })
    },
    // 删除
    handleDelete(row) {
      console.log(row, 'delete')
      this.$confirm('是否确定删除？', '提示', {
        type: 'warning'
      }).then(() => {
        // TODO: 调用接口
        this.$message.success('操作成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.redeem-code {
  &-header {
    padding: 10px;
    border-bottom: 5px solid #f0f1f2;
  }
  &-list {
    padding: 10px;
    p {
      margin: 0;
    }
    span {
      padding: 0 5px;
    }
  }
}
</style>
