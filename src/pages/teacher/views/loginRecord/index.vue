<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-11-07 20:02:59
 * @LastEditors: Shentong
 * @LastEditTime: 2020-11-07 20:16:03
-->
<template>
  <div class="login-record app-main">
    <div class="record-contriner">
      <div ref="tbC">
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
            label="结课时间"
            min-width="120"
            prop="end_course_day"
            align="center"
          ></el-table-column>
        </ele-table>
      </div>
    </div>
  </div>
</template>
<script>
import EleTable from '@/components/Table/EleTable'
export default {
  data() {
    return {
      recordList: [],
      tableHeight: 'auto',
      totalElements: 0,
      tableQuery: {
        size: 20,
        loading: false,
        uid: 1,
        type: 1,
        page: 1
      }
    }
  },
  components: {
    EleTable
  },
  mounted() {
    this.calcTableHeight()
  },
  methods: {
    async getLoginRecord() {
      const recordList = await this.$http.Login.getLoginRecord(this.params)
      this.totalElements = +recordList.totalElements || 0
      console.log('recordList', recordList)
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
