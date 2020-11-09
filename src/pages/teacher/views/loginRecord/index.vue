<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-11-07 20:02:59
 * @LastEditors: Shentong
 * @LastEditTime: 2020-11-09 13:49:16
-->
<template>
  <div class="login-record app-main">
    <div class="record-contriner">
      <div ref="tbC" style="width:100%;">
        <ele-table
          :tableHeight="tableHeight"
          :tableSize="'small'"
          :dataList="recordList"
          :loading="tableQuery.loading"
          :size="tableQuery.size"
          :page="tableQuery.page"
          :showAllTotalNum="true"
          :total="totalElements"
          @pageChange="pageChange_handler"
          class="mytable add-first-cell-bg"
        >
          <el-table-column
            label="账号名称"
            prop="loginName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作类型"
            prop="operateType"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作时间"
            prop="ctime"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作的信息"
            prop="remark"
            align="center"
          ></el-table-column>
        </ele-table>
      </div>
    </div>
  </div>
</template>
<script>
import EleTable from '@/components/Table/EleTable'
import { LOGINTYPE } from '@/utils/enums'
import { formatData, isToss } from '@/utils/index'
export default {
  data() {
    return {
      recordList: [],
      tableHeight: 'auto',
      totalElements: 0,
      tableQuery: {
        size: 20,
        loading: false,
        uid: '',
        type: 'TOSS',
        page: 1
      }
    }
  },
  components: {
    EleTable
  },
  created() {
    const teacherId = isToss()
    let itemType = 'teacher'
    if (!teacherId) {
      itemType = 'staff'
      this.tableQuery.type = 'BOSS'
    }
    const userInfo = localStorage.getItem(itemType)

    this.tableQuery.uid = JSON.parse(userInfo).id
    this.getLoginRecord()
  },
  mounted() {
    this.calcTableHeight()
  },
  methods: {
    async getLoginRecord() {
      /**
       *
       * @param operateType: "LOGIN": 登录/ "ADD"：新增员工：
       */
      const {
        payload: { content = [], totalElements = 0 }
      } = await this.$http.Login.getLoginRecord(this.tableQuery)

      this.pakageListData(content)

      this.recordList = content
      this.totalElements = +totalElements
    },
    pakageListData(list) {
      list.forEach((item) => {
        const { ctime = null, operateType = 'LOGIN' } = item

        item.ctime = +ctime ? formatData(ctime, 'm') : ''
        item.operateType = LOGINTYPE[operateType] || ''
      })
    },
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      this.tableQuery.page = page
      this.getLoginRecord(this.tableQuery)
    },
    calcTableHeight() {
      this.$nextTick(() => {
        const tableTopHeight = this.$refs.tbC.getBoundingClientRect().y
        const tableHeight = document.body.clientHeight - tableTopHeight - 60
        this.tableHeight = tableHeight + ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-record {
  background: #fff;
  padding: 20px;
  .record-contriner {
    min-height: calc(100vh - 90px);
    text-align: center;
    display: flex;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
