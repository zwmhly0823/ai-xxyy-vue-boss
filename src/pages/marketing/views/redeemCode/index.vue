<!--
 * @Descripttion: 兑换码 - 列表
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-06 17:15:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-12 14:11:24
-->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container redeem-code">
      <div class="redeem-code-header d-flex">
        <el-button type="primary" size="mini" @click="handleAdd">创建兑换码</el-button>
      </div>
      <!-- list -->
      <div class="redeem-code-list">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="title" label="兑换码标题" width="180"></el-table-column>
          <el-table-column prop="num" label="兑换个数/个数" width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.converted_num }}/{{ scope.row.num }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="package_name" label="套餐商品"></el-table-column>
          <el-table-column prop="course_level" label="绑定课程级别"></el-table-column>
          <el-table-column prop="customer_sign_name" label="标签">
            <template slot-scope="scope">
              {{
              scope.row.customer_sign_name || '--'
              }}
            </template>
          </el-table-column>
          <el-table-column prop="channel_name" label="渠道">
            <template slot-scope="scope">
              {{
              scope.row.channel_name || '--'
              }}
            </template>
          </el-table-column>
          <el-table-column prop="send_express" label="是否发物流">
          </el-table-column>
          <el-table-column prop="start_date" label="有效期" min-width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.expire && scope.row.expire !== '0'">
                <p>兑换当日{{ scope.row.expire }}天内</p>
              </template>
              <template v-else>
                <p>起：{{ scope.row.start_date_text }}</p>
                <p>止：{{ scope.row.end_date_text }}</p>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">{{ scope.row.status_text }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <p class="primary-text">
                <span @click="handleOpenLibrary(scope.row)">码库</span> |
                <span @click="handleInvalid(scope.row)" v-if="scope.row.status === 1">失效</span>
                <span @click="handleDelete(scope.row)" v-else>删除</span>
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

    <!-- 增加兑换码标题 -->
    <add-redeem-code
      v-if="isAddDialog"
      :show="showAddDialog"
      @cancel="handelCancelAdd"
      @confirm="handelConfirmAdd"
    />
  </el-row>
</template>

<script>
import { openBrowserTab, formatData } from '@/utils/index'
import MPagination from '@/components/MPagination/index.vue'
import AddRedeemCode from './add.vue'
export default {
  components: {
    AddRedeemCode,
    MPagination
  },
  data() {
    return {
      tableData: [],
      showAddDialog: false,
      isAddDialog: false,
      currentPage: 1,
      totalElements: 0,
      totalPages: 1
    }
  },

  created() {
    this.getData()
  },

  mounted() {
    this.$nextTick(() => {
      this.isAddDialog = true
    })
  },

  methods: {
    /**
     * 获取兑换码列表
     */
    getData() {
      const page = this.currentPage
      const sort = { status: 'desc', ctime: 'desc' }
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      this.$http.Marketing.getRedeemCodeList({}, page, sort)
        .then((res) => {
          console.log(res.data.ExchangeCodeConfigPage.content, 'list')
          if (res?.data?.ExchangeCodeConfigPage) {
            const {
              content = [],
              totalElements,
              totalPages,
              number
            } = res.data.ExchangeCodeConfigPage
            // 数据处理
            const list = content.map((item) => {
              item.start_date_text = formatData(item.start_date, 'm')
              item.end_date_text = formatData(item.end_date, 'm')
              item.status_text = item.status ? '有效' : '失效'
              item.send_express = item.send_express === 0 ?  '否' : item.send_express === 1 ? '是' : '-' 
              item.course_level = item.course_level == null || item.course_level == 0 ? '-' : 'M' + item.course_level
              if (item.packageInfo?.name) {
                item.package_name = item.packageInfo.name
              }
              // eslint-disable-next-line camelcase
              if (item.channelInfo?.channel_outer_name) {
                item.channel_name = item.channelInfo.channel_outer_name
              }
              if (item.customerSignInfo?.name) {
                item.customer_sign_name = item.customerSignInfo.name
              }
              return item
            })
            this.tableData = list || []
            this.totalElements = +totalElements
            this.totalPages = +totalPages
            this.currentPage = +number
          }
        })
        .finally(() => {
          loading.close()
        })
    },

    // 创建兑换码按钮
    handleAdd() {
      this.showAddDialog = true
    },
    // 查看码库
    handleOpenLibrary(row) {
      const { id, status } = row
      // 区分科目 TODO:新增其他科目时再优化
      const subject = this.$store.getters.subjects.subjectCode
      // var subjectText = +subject === 3 ? 'marketing' : 'write_app'
      var subjectText = 'marketing'
      // 如果是自定义时间，则加上参数 expire
      let url = `/${subjectText}/#/redeemCodeLibrary/${id}/${status}`
      if (row.expire && row.expire !== '0') {
        url += `?expire=${row.expire}`
      }
      openBrowserTab(url)
    },
    // 失效
    handleInvalid(row) {
      this.$confirm('设为失效后，兑换码将不可继续使用！', '提示', {
        type: 'warning'
      })
        .then(() => {
          // TODO: 调用接口
          const { id } = row
          if (!id) {
            this.$message.error('缺少参数：ID')
            return
          }
          this.$http.Marketing.handleSetRedeemCodeStatus(id).then((res) => {
            if (res?.code === 0) {
              this.$message.success('操作成功')
              setTimeout(() => {
                this.getData()
              }, 1000)
            }
          })
        })
        .catch(() => {})
    },
    // 删除
    handleDelete(row) {
      if (!row.id) {
        this.$message.error('缺少参数：ID')
        return
      }
      this.$confirm('是否确定删除？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$http.Marketing.handleDeleteRedeemCode(row.id).then((res) => {
            if (res?.code === 0) {
              this.$message.success('操作成功')
              setTimeout(() => {
                this.getData()
              }, 1000)
            }
          })
        })
        .catch(() => {})
    },

    handleSizeChange(page) {
      this.currentPage = page
      this.getData()
    },

    // 创建成功回调 @status - true:继续创建，false-返回列表
    handelConfirmAdd(status) {
      this.showAddDialog = status
      this.currentPage = 1
      setTimeout(() => {
        this.getData()
      }, 1500)
    },
    // 取消创建回调
    handelCancelAdd() {
      this.showAddDialog = false
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
    padding: 0 10px 25px;
    span {
      padding: 0 5px;
    }
  }
}
</style>
