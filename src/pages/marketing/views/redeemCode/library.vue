<!--
 * @Descripttion: 码库
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-06 19:52:15
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-06 22:00:29
-->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container redeem-code-library">
      <header>
        <h4>这是一个兑换码标题</h4>
        <p>有效期：2020-08-13 13:30 至 2020-08-13 13:30</p>
      </header>
      <!-- search -->
      <div class="library-search d-flex align-center justify-between">
        <div class="library-search-item">
          search
        </div>
        <el-button type="primary" size="mini">导出码库</el-button>
      </div>
      <!-- search end -->

      <!-- table -->
      <!-- list -->
      <div class="redeem-code-library_list">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="兑换码" width="120">
          </el-table-column>
          <el-table-column prop="name" label="用户" width="200">
          </el-table-column>
          <el-table-column prop="status" label="使用状态" width="120">
          </el-table-column>
          <el-table-column prop="address" label="使用时间"> </el-table-column>
          <el-table-column prop="address" label="班级/销售">
            <template slot-scope="scope">
              <p class="primary-text">0804期S1-15班{{ scope.row.id }}</p>
              <p>张三 社群一部-辽阔</p>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="APP登录">
            <template slot-scope="scope">
              <p>iPhone</p>
              <p>{{ scope.row.date }}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>

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
  </el-row>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
export default {
  components: {
    MPagination
  },
  data() {
    return {
      // 兑换码ID
      redeemCodeId: '',
      tableData: [
        {
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          status: '已使用',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 2,
          date: '2016-05-04',
          name: '王小虎',
          status: '已使用',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          status: '已使用',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          status: '已使用',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      currentPage: 1,
      totalElements: 0,
      totalPages: 1
    }
  },
  created() {
    const { id } = this.$route.params
    this.redeemCodeId = id
  },

  methods: {
    handleSizeChange(page) {
      console.log(page, 'page')
      this.currentPage = page
    }
  }
}
</script>

<style lang="scss" scoped>
.redeem-code-library {
  padding: 10px;
  font-size: 12px;
  header {
    padding: 10px;
    background-color: #f7f7f7;
    h4 {
      margin: 0;
    }
    h4 {
      font-size: 14px;
    }
    p {
      margin-top: 5px;
      color: #999;
    }
  }
  .library-search {
    margin: 10px 0;
  }
}
</style>
