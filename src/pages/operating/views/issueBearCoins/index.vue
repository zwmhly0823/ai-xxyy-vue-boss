<template>
  <el-row type="flex" class="app-main height coins">
    <div class="app-main-container">
      <div class="app-main-container-scrollbar change-phone">
        <!-- search -->
        <coins-search
          @search="getSearchType"
          @ctime="getSearchTime"
          @searchUid="getSearchUid"
          @exportFile="getExport"
        />
        <!-- table -->
        <div class="coins-table">
          <el-table
            :data="tableData"
            style="width: 100%;border-top:1px solid #EBEEF5"
          >
            <el-table-column
              label="用户编号"
              min-width="15%"
              align="center"
              prop="user"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.user === null"></span>
                <span v-else class="user-detail" @click="userHandle(scope.row)">
                  {{ scope.row.user.user_num }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="补发类型"
              min-width="15%"
              align="center"
              prop="account_type"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.trans_type === '8'">运营活动</span>
                <span v-if="scope.row.trans_type === '9'">投诉补偿</span>
              </template>
            </el-table-column>
            <el-table-column
              label="补发数量"
              min-width="15%"
              align="center"
              prop="amount"
            >
            </el-table-column>
            <el-table-column
              label="补发原因"
              min-width="35%"
              align="center"
              prop="desc"
            >
            </el-table-column>
            <el-table-column
              label="发放时间"
              min-width="20%"
              align="center"
              prop="ctime"
            >
            </el-table-column>
          </el-table>
        </div>
        <m-pagination
          @current-change="handleCurrentChange"
          :current-page="+currentPage"
          :total="+totalElements"
          open="calc(100vw - 195px)"
          close="calc(100vw - 75px)"
        />
      </div>
    </div>
  </el-row>
</template>
<script>
import coinsSearch from './components/coinsSearch.vue'
import MPagination from '@/components/MPagination/index.vue'
import { formatData, openBrowserTab } from '@/utils/index'
export default {
  name: 'index',
  components: {
    coinsSearch,
    MPagination
  },
  data() {
    return {
      tableData: [],
      // 总页数
      totalPages: 1,
      totalElements: 0, // 总条数
      // 当前页数
      currentPage: 1,
      query: {},
      searchType: {},
      searchTime: {},
      searchMobile: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 列表数据
    getData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const query = {
        account_type: 2,
        trans_type: [8, 9]
      }
      Object.assign(query, this.searchMobile, this.searchType, this.searchTime)
      const params = JSON.stringify(JSON.stringify(query))
      this.$http.Operating.issueBearList(params, this.currentPage)
        .then((res) => {
          const data = res.data && res.data.AccountPage
          if (data) {
            const { totalElements, content = [] } = data
            this.totalElements = totalElements
            this.tableData = content.map((item) => {
              item.ctime = formatData(item.ctime, 's')
              return item
            })
          }
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    getSearchType(res) {
      this.searchType = res
      this.currentPage = 1
      this.getData()
    },
    getSearchTime(res) {
      this.searchTime = res
      this.currentPage = 1
      this.getData()
    },
    getSearchUid(res) {
      this.searchMobile = res
      this.currentPage = 1
      this.getData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    // 导入数据列表
    getExport(res) {
      if (res) {
        const timer = setTimeout(() => {
          this.getData()
          clearTimeout(timer)
        }, 2000)
      }
    },
    // 点击用户信息回调事件
    userHandle(user) {
      if (!user || !user.id) {
        this.$message.error('缺少用户信息')
        return
      }
      const { id } = user.user
      // 新标签打开详情页
      id && openBrowserTab(`/users/#/details/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main-container {
  margin: 0;
}
.coins {
  padding: 10px;
  &-table {
    margin-top: 10px;
  }
  .user-detail {
    cursor: pointer;
    color: #2a75ed;
  }
}
</style>
