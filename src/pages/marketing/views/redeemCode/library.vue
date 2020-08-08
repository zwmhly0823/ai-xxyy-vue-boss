<!--
 * @Descripttion: 码库
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-06 19:52:15
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-08 16:21:38
-->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container redeem-code-library">
      <header>
        <h4>{{ redeemCode.title }}</h4>
        <p>
          有效期：{{ redeemCode.start_date_text }} 至
          {{ redeemCode.end_date_text }}
        </p>
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
          <el-table-column prop="address" label="兑换时间"> </el-table-column>
          <el-table-column prop="address" label="使用时间"> </el-table-column>
          <el-table-column prop="address" label="班级/销售">
            <template slot-scope="scope">
              <p class="primary-text">0804期S1-15班{{ scope.row.id }}</p>
              <p>张三 社群一部-辽阔</p>
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
import { openBrowserTab, formatData } from '@/utils/index'
import MPagination from '@/components/MPagination/index.vue'
export default {
  components: {
    MPagination
  },
  data() {
    return {
      // 兑换码ID
      redeemCodeId: '',
      // 当前兑换码信息
      redeemCode: {},
      tableData: [],
      currentPage: 1,
      totalElements: 0,
      totalPages: 1
    }
  },
  created() {
    const { id } = this.$route.params
    this.redeemCodeId = id
    this.getRedeemCodeDetail()
  },

  methods: {
    // 获取当前兑换码信息
    getRedeemCodeDetail() {
      if (!this.redeemCodeId) return
      const params = {
        id: this.redeemCodeId
      }
      this.$http.Marketing.getRedeemCodeDetail(params).then((res) => {
        if (res.data && res.data.ExchangeCodeConfig) {
          const info = res.data.ExchangeCodeConfig
          info.start_date_text = formatData(info.start_date, 'm')
          info.end_date_text = formatData(info.end_date, 'm')
          this.redeemCode = info || {}
          return
        }
        this.redeemCode = {}
      })
    },
    handleSizeChange(page) {
      console.log(page, 'page')
      this.currentPage = page
      openBrowserTab()
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
