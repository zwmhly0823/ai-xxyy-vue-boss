<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-07-23 16:26:04
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-24 18:35:35
-->
<template>
  <div class="history-box">
    <div>
      <groupSell
        @onHandover="onHandover"
        @onReceive="onReceive"
        @onType="onType"
      />
    </div>
    <div class="table-box">
      <el-table
        :header-cell-style="headerCss"
        :data="tableData"
        style="width: 100%;margin-bottom:50px;"
      >
        <el-table-column prop="studentSteamId" label="交接类型">
        </el-table-column>
        <el-table-column prop="sendRealName" label="交出方"> </el-table-column>
        <el-table-column label="交出内容">
          <template slot-scope="scope">
            {{ scope.row.content || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="receiveRealName" label="接收方">
        </el-table-column>
        <el-table-column prop="receiveWeixinNo" label="接收微信号">
        </el-table-column>
        <el-table-column prop="operatorName" label="操作人">
          <template slot-scope="scope">
            {{ scope.row.operatorName || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="operatTime" label="交接时间"> </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        style="bottom:0px;right:0px;"
        @current-change="handleCurrentChange"
        :current-page="+currentPage"
        :total="+totalElements"
        open="calc(100vw - 147px)"
        close="calc(100vw - 26px)"
      />
    </div>
  </div>
</template>

<script>
import { timestamp } from '@/utils/index'
import MPagination from '@/components/MPagination/index.vue'
import groupSell from './groupSell.vue'
export default {
  components: {
    groupSell,
    MPagination
  },
  data() {
    return {
      currentPage: '1',
      totalElements: '',
      tableData: [],
      teacherSendId: '',
      teacherReceiveId: '',
      handoverType: ''
    }
  },
  created() {
    this.onGetHandoverRecord()
  },
  methods: {
    onGetHandoverRecord() {
      const params = {
        teacherSendId: this.teacherSendId,
        teacherReceiveId: this.teacherReceiveId,
        handoverType: this.handoverType,
        page: this.currentPage,
        size: '20'
      }
      this.$http.WorkerHandover.getHandoverRecord(params).then((res) => {
        this.currentPage = res.payload.number
        this.totalElements = res.payload.totalElements
        const _data = res.payload.content

        _data.forEach((ele) => {
          ele.operatTime = timestamp(ele.operatTime, 2)
          if (ele.studentSteamId === '0') {
            ele.studentSteamId = '微信交接'
            ele.content = ele.sendWeixinNo
          } else {
            ele.studentSteamId = '班级交接'
            ele.content = ele.teamName
          }
        })
        console.log(res)
        this.tableData = _data
      })
    },
    onHandover(data) {
      this.teacherSendId = data
      console.log(data)
      this.onGetHandoverRecord()
    },
    onReceive(data) {
      this.teacherReceiveId = data
      console.log(data)
      this.onGetHandoverRecord()
    },
    onType(data) {
      this.handoverType = data
      console.log(data)
      this.onGetHandoverRecord()
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.onGetHandoverRecord()
    },
    headerCss({ row, column, rowIndex, columnIndex }) {
      return 'font-size:12px;color:#666;font-weight:normal;background:#f1f1f1;'
    }
  }
}
</script>

<style lang="scss" scoped>
.history-box {
  .table-box {
    // margin-bottom: 60px;
  }
}
</style>
