<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-23 15:23:48
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-24 17:39:49
-->
<template>
  <div class="push-config-box">
    <div class="push-select-box">
      <pushConfigSelect @onRefresh="onRefresh" />
    </div>
    <div class="push-table-box">
      <div
        style="font-size:18px;font-weight:500;padding:10px;padding-left:20px;"
      >
        问卷调查推送列表
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="headerCss"
        @cell-mouse-enter="hoverRow"
        style="width: 100%"
      >
        <el-table-column prop="type" label="课程类型" align="center">
        </el-table-column>
        <el-table-column prop="term" label="期数" align="center">
        </el-table-column>
        <el-table-column prop="pushDate" label="推送日期" align="center">
        </el-table-column>
        <el-table-column prop="pushUrl" label="问卷调查" align="center">
        </el-table-column>
        <el-table-column prop="executeTime" label="执行推送时间" align="center">
        </el-table-column>
        <el-table-column prop="operatorName" label="操作人" align="center">
        </el-table-column>
        <el-table-column prop="name" label="操作" align="center">
          <template slot-scope="scope">
            <div style="display:none">{{ scope.row }}</div>
            <div v-if="scope.row.operatorName">
              <el-button type="text" disabled>修改</el-button>
              <el-button type="text" disabled>执行推送</el-button>
            </div>
            <div v-else>
              <el-button @click="onUpdate" type="text">修改</el-button>
              <el-button @click="onPush" type="text">执行推送</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+currentPage"
        :total="+totalElements"
        open="calc(100vw - 147px - 50px)"
        close="calc(100vw - 26px - 50px)"
      />
    </div>
    <el-dialog
      title="修改推送信息"
      width="400px"
      :visible.sync="dialogFormVisible"
    >
      <updateForm
        @onRefreshForm="onRefreshForm"
        @closeForm="closeForm"
        v-if="dialogFormVisible"
        :tableRow="tableRow"
      />
    </el-dialog>
    <el-dialog :visible.sync="centerDialogVisible" width="30%" center>
      <span>
        当前任务将推送 {{ num }}人，将在此条线<span style="color:red;">{{
          pushTest
        }}</span
        >下执行，确认推送？
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onPushDetermine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pushConfigSelect from '../pushConfig/components/pushConfigSelect'
import updateForm from '../pushConfig/components/updateForm'
import { timestamp } from '@/utils/index'
import MPagination from '@/components/MPagination/index.vue'
export default {
  components: {
    pushConfigSelect,
    updateForm,
    MPagination
  },
  data() {
    return {
      currentPage: '1',
      totalElements: '',
      num: '',
      pushTest: '',
      tableRow: {},
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],

      dialogFormVisible: false,
      centerDialogVisible: false
    }
  },
  created() {
    this.getPushNotificationsList()
  },
  methods: {
    //  列表数据
    getPushNotificationsList() {
      this.$http.Operating.getPushNotificationsList(this.currentPage).then(
        (res) => {
          this.currentPage = res.payload.number + 1
          this.totalElements = res.payload.totalElements
          const _data = res.payload.content
          _data.forEach((res) => {
            res.pushDates = res.pushDate
            res.type = res.type === 0 ? '体验课' : '系统课'
            res.pushDate = timestamp(res.pushDate, 5)
            if (!res.executeTime || res.executeTime === '0') {
              res.executeTime = '-'
            } else {
              res.executeTime = timestamp(res.executeTime, 8)
            }
          })
          this.tableData = _data
        }
      )
    },
    onPush() {
      this.centerDialogVisible = true
      const date = timestamp(this.tableRow.pushDates, 7)
      this.pushTest = `"${this.tableRow.type}、${this.tableRow.term}、${date}、${this.tableRow.pushUrl}"`
      const query = `"term"=${this.tableRow.period}`
      if (this.tableRow.type === '体验课') {
        this.$http.Operating.StudentTrialCoursePage(JSON.stringify(query)).then(
          (res) => {
            const _data = res.data.StudentTrialCoursePage.totalElements
            this.num = _data
          }
        )
      } else {
        this.$http.Operating.StudentSystemCoursePage(
          JSON.stringify(query)
        ).then((res) => {
          const _data = res.data.StudentTrialCoursePage.totalElements
          this.num = _data
        })
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getPushNotificationsList()
    },
    onPushDetermine() {
      const teacher = JSON.parse(localStorage.getItem('teacher'))
      this.$http.Operating.pushNotificationsExecute(
        this.tableRow.id,
        teacher.id,
        teacher.realName
      ).then((res) => {
        if (res.code === 0) {
          this.$message.success('推送成功')
          this.centerDialogVisible = false
          setTimeout(() => {
            this.getPushNotificationsList()
          }, 500)
        }
      })
    },
    hoverRow(row) {
      this.tableRow = row
    },
    onRefresh() {
      this.getPushNotificationsList()
    },
    onRefreshForm() {
      this.dialogFormVisible = false
      this.getPushNotificationsList()
    },
    closeForm() {
      this.dialogFormVisible = false
    },
    onUpdate() {
      this.dialogFormVisible = true
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      //   return 'color:#666;background:#f0f0f0'
    }
  }
}
</script>

<style lang="scss" scoped>
.push-config-box {
  margin: 10px;
  .push-table-box {
    margin-top: 10px;
    background: #ffffff;
    margin-bottom: 70px;
  }
}
</style>
