<!--
 * @Descripttion: 码库
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-06 19:52:15
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-11 14:26:57
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
        <div class="library-search-item d-flex align-center">
          <!-- 手机号搜索 -->
          <search-phone
            name="user_id"
            @result="getPhone"
            style="margin-right: 10px;"
          />
          <!-- 状态搜索 -->
          <simple-select
            placeholder="全部状态"
            :multiple="false"
            name="status"
            :data-list="statusList"
            @result="getStatus"
          />
        </div>
        <el-button
          type="primary"
          size="mini"
          @click="handleExport"
          :disabled="exporting"
          >导出码库</el-button
        >
      </div>
      <!-- search end -->

      <!-- table -->
      <!-- list -->
      <div class="redeem-code-library_list">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="code" label="兑换码" width="120">
          </el-table-column>
          <el-table-column label="用户" width="200">
            <template slot-scope="scope">
              <p
                class="primary-text"
                @click="openDetailPage({ id: scope.row.user_id })"
                v-if="scope.row && scope.row.userInfo"
              >
                {{ scope.row.userInfo.mobile }}-{{
                  scope.row.userInfo.username
                }}
              </p>
              <p v-else>--</p>
            </template>
          </el-table-column>
          <el-table-column prop="status_text" label="使用状态" width="120">
          </el-table-column>
          <el-table-column
            prop="converted_date"
            label="兑换时间"
          ></el-table-column>
          <el-table-column prop="use_date" label="使用时间"></el-table-column>
          <el-table-column
            :label="isTrialPackage ? '班级/销售' : '班级/班主任'"
          >
            <template slot-scope="scope">
              <p
                class="primary-text"
                v-if="scope.row.teamInfo"
                @click="
                  openDetailPage(
                    {
                      id: scope.row.team_id,
                      type: scope.row.teamInfo.team_type
                    },
                    1
                  )
                "
              >
                {{ scope.row.teamInfo.team_name }}
              </p>
              <p v-else>--</p>
              <p v-if="scope.row.teacherInfo">
                {{ scope.row.teacherInfo.realname }}
                {{ scope.row.teacherInfo.department_name }}
              </p>
              <p v-else>--</p>
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
import { downloadHandle } from '@/utils/download'
import MPagination from '@/components/MPagination/index.vue'
import SearchPhone from '@/components/MSearch/searchItems/searchPhone.vue'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
export default {
  components: {
    MPagination,
    SimpleSelect,
    SearchPhone
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
      totalPages: 1,
      statusObj: {
        '0': '已失效', // 已失效，手动设置失效
        '1': '未使用', // 未使用，未兑换
        '4': '已失效', // 未使用，已兑换
        '2': '已兑换', // 已兑换成功
        '3': '已使用' // 兑换码已领取成功
      },
      searchParams: {},
      exporting: false,
      // 体验课套餐类型 0-单周体验课，6-双周体验
      packageTypeMap: ['0', '6']
    }
  },
  computed: {
    statusList() {
      const arr = []
      for (const key in this.statusObj) {
        if (key === '0') continue
        if (Object.keys(this.statusObj).includes(key)) {
          const text = this.statusObj[key]
          const obj = {
            id: key,
            text
          }
          arr.push(obj)
        }
      }
      return arr
    },
    // 是不是体验课套餐
    isTrialPackage() {
      return (
        this.packageTypeMap.includes(this.redeemCode?.packageInfo?.type) ||
        false
      )
    }
  },
  created() {
    const { id } = this.$route.params
    this.redeemCodeId = id
    this.searchParams = { config_id: id }
    this.getRedeemCodeDetail()
    this.getRedeemCodeLog()
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

    // 获取兑换记录
    getRedeemCodeLog() {
      const page = this.currentPage
      const params = this.searchParams || {}
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      this.$http.Marketing.getRedeemCodeLog(params, page)
        .then((res) => {
          console.log(res)
          if (res.data && res.data.ExchangeCodeLogPage) {
            const {
              content,
              totalPages,
              number,
              totalElements
            } = res.data.ExchangeCodeLogPage
            this.currentPage = +number
            this.totalPages = +totalPages
            this.totalElements = +totalElements
            const list = content.map((item) => {
              item.converted_date =
                item.converted_date && item.converted_date !== '0'
                  ? formatData(item.converted_date, 'm')
                  : '--'
              item.use_date =
                item.use_date && item.use_date !== '0'
                  ? formatData(item.use_date, 'm')
                  : '--'
              item.status_text = item.status
                ? this.statusObj[item.status]
                : '--'
              return item
            })
            this.tableData = list
          }
        })
        .finally(() => {
          loading.close()
        })
    },

    // 打开用户或班级详情页 0-用户，1-班级
    openDetailPage(obj, type = 0) {
      let url = `/users/#/details/${obj.id}`
      if (type === 1) {
        url = `/student-team/#/teamDetail/${obj.id}/${obj.type}`
      }
      openBrowserTab(url)
    },

    // 手机号搜索
    getPhone(data) {
      if (!data) {
        delete this.searchParams.user_id
      }
      this.handleSearch(data)
    },

    // 搜索-状态
    getStatus(data) {
      if (!data) {
        delete this.searchParams.status
      }
      this.handleSearch(data)
    },

    // 搜索回调 - data:返回的对象
    handleSearch(data = {}) {
      Object.assign(this.searchParams, data)
      this.currentPage = 1
      this.getRedeemCodeLog()
    },

    // 导出码库
    handleExport() {
      console.log('导出')
      const params = {
        apiName: 'ExchangeCodeLogPage',
        header: {
          'library.packageInfo.name': '套餐名称',
          code: '兑换码',
          card_no: '卡号',
          'userInfo.mobile': '用户手机号',
          'userInfo.username': '用户昵称',
          'library.customerSignInfo.name': '用户标签',
          status_text: '使用状态',
          use_date_text: '使用时间',
          converted_date_text: '兑换时间',
          'teamInfo.team_name': '班级',
          'teamInfo.teacher_info.realname': this.isTrialPackage
            ? '销售'
            : '班主任'
        },
        fileName: `${this.redeemCode.title || '码库'}`,
        query:
          Object.keys(this.searchParams).length > 0
            ? JSON.stringify(this.searchParams)
            : `""`,
        sort: JSON.stringify({ use_date: 'desc' })
      }
      const loading = this.$loading({
        lock: true,
        text: '正在导出……',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      this.exporting = true
      this.$http.DownloadExcel.exportRedeemCodeLog(params)
        .then((res) => {
          console.log(res)
          downloadHandle(res, `码库-${this.redeemCode.title}`, () => {
            this.$message.success('导出成功')
          })
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          loading.close()
          this.exporting = false
        })
    },

    handleSizeChange(page) {
      this.currentPage = page
      this.getRedeemCodeLog()
    }
  }
}
</script>

<style lang="scss" scoped>
.redeem-code-library {
  padding: 10px;
  font-size: 12px;
  &_list {
    padding-bottom: 20px;
  }
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
