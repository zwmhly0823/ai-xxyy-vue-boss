<!--
 * @Descripttion: 兑换码 - 列表
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-06 17:15:04
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-06 22:03:52
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
            <template slot-scope="scope">
              <p class="primary-text">
                <span @click="handleOpenLibrary(scope.row)">码库</span> |
                <span @click="handleInvalid(scope.row)">失效</span> |
                <span @click="handleDelete(scope.row)">删除</span>
              </p>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <m-pagination
          :current-page="currentPage"
          :page-count="totalPages"
          :total="totalElements"
          @current-change="handleSizeChange"
          show-pager
          open="calc(100vw - 170px - 25px)"
          close="calc(100vw - 50px - 25px)"
        ></m-pagination>
      </div>
    </div>
  </el-row>
</template>

<script>
import { openBrowserTab } from '@/utils/index'
import MPagination from '@/components/MPagination/index.vue'
export default {
  components: {
    MPagination
  },
  data() {
    return {
      tableData: [
        {
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      currentPage: 1,
      totalElements: 0,
      totalPages: 1
    }
  },

  methods: {
    // 查看码库
    handleOpenLibrary(row) {
      console.log(row, 'library')
      const { id } = row
      openBrowserTab(`/marketing/#/redeemCodeLibrary/${id}`)
    },
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
    },

    handleSizeChange(page) {
      console.log(page, 'page')
      this.currentPage = page
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
    padding: 0 10px 10px;
    span {
      padding: 0 5px;
    }
  }
}
</style>
