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
              prop="userNum"
            >
              <template slot-scope="scope">
                <span v-if="!+scope.row.userNum">-</span>
                <span v-else class="user-detail" @click="userHandle(scope.row)">
                  {{ scope.row.userNum }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="补发类型"
              min-width="15%"
              align="center"
              prop="transTypeName"
            >
            </el-table-column>
            <el-table-column label="补发数量" min-width="15%" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.trans_type === '14'">-</span>
                <span>{{ scope.row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="补发原因"
              min-width="35%"
              align="center"
              prop="reason"
            >
            </el-table-column>
            <el-table-column
              label="发放时间"
              min-width="20%"
              align="center"
              prop="ctime"
            >
            </el-table-column>
            <el-table-column
              label="状态"
              min-width="15%"
              align="center"
              prop="statusName"
            >
            </el-table-column>
            <el-table-column
              label="备注"
              min-width="25%"
              align="center"
              prop="failedReason"
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
        pageNumber: this.currentPage - 1,
        pageSize: 20
      }
      Object.assign(query, this.searchMobile, this.searchType, this.searchTime)
      this.$http.Operating.issueBearList(query)
        .then((res) => {
          const data = res.payload
          if (data) {
            const { totalElements, content = [] } = data
            this.totalElements = totalElements
            this.tableData = this.modifyTableData(content)
          }
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    modifyTableData(content) {
      content.forEach((cItem) => {
        cItem.ctime = formatData(cItem.ctime, 's')
        switch (cItem.status) {
          case 'DEFAULT':
            cItem.statusName = '默认'
            break
          case 'SUCCESS':
            cItem.statusName = '导入成功'
            break
          case 'FAILED':
            cItem.statusName = '导入失败'
            break
        }
        switch (cItem.transType) {
          case 'OPERATION_ACTIVE':
            cItem.transTypeName = '运营活动'
            break
          case 'COMPLAINT_COMPENSATE':
            cItem.transTypeName = '投诉补偿'
            break
          case 'OPERATIONAL_DEDUCT':
            cItem.transTypeName = '系统扣除'
            break
          default:
            cItem.transTypeName = '-'
            break
        }
      })
      return content
    },
    getSearchType(res) {
      this.searchType = res
      this.currentPage = 1
      this.getData()
    },
    getSearchTime(res) {
      if (res) {
        this.searchTime = {
          startTime: res.ctime.gte,
          endTime: res.ctime.lte
        }
      } else {
        this.searchTime = ''
      }
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
      // const { id } = user.user
      const id = user.uid
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
