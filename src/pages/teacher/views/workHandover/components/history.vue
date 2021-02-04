<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-07-23 16:26:04
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-21 13:45:24
-->
<template>
  <div class="history-box">
    <div>
      <groupSell
        @onHandover="onHandover"
        @onReceive="onReceive"
        @onType="onType"
        @searchFun="searchFun"
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
        <el-table-column prop="operatorTime" label="交接时间">
        </el-table-column>
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
import { formatTeamNameSup } from '@/utils/supList'
import MPagination from '@/components/MPagination/index.vue'
import groupSell from './groupSell.vue'
export default {
  props: {
    tabIndex: {
      type: String,
      default: ''
    }
  },
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
      handoverType: '',
      searchParams: {}
    }
  },
  watch: {
    tabIndex(value) {
      this.currentPage = '1'
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
      Object.assign(params, this.searchParams)
      this.$http.WorkerHandover.getHandoverRecord(params).then((res) => {
        this.currentPage = res.payload.number
        this.totalElements = res.payload.totalElements
        const _data = res.payload.content

        _data.forEach((ele) => {
          ele.operatorTime = timestamp(ele.operatorTime, 2)
          if (ele.studentSteamId === '0') {
            ele.studentSteamId = '微信交接'
            ele.content = ele.sendWeixinNo
          } else {
            ele.studentSteamId = '班级交接'
            ele.content = formatTeamNameSup(ele.teamName) || ''
          }
        })
        this.tableData = _data
      })
    },
    onHandover(data) {
      this.teacherSendId = data
      this.currentPage = '1'
      this.onGetHandoverRecord()
    },
    onReceive(data) {
      this.teacherReceiveId = data
      this.currentPage = '1'
      this.onGetHandoverRecord()
    },
    onType(data) {
      this.handoverType = data
      this.currentPage = '1'
      this.onGetHandoverRecord()
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.onGetHandoverRecord()
    },
    headerCss({ row, column, rowIndex, columnIndex }) {
      return 'font-size:12px;color:#666;font-weight:normal;background:#f1f1f1;'
    },
    searchFun(name, val) {
      this.searchParams[name] = val
      this.currentPage = '1'
      this.onGetHandoverRecord()
    }
  }
}
</script>

<style lang="scss" scoped></style>
