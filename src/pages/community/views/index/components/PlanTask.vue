<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 17:10:10
 * @LastEditors: shasen
 * @LastEditTime: 2020-07-04 18:29:22
-->
<template>
  <div class="plan-task-container">
    <div class="operete-row">
      <planTaskSearch
        @getlistJobTaskPage="getlistJobTaskPage"
        :sourchParams="sourchParams"
      />
      <div class="add-btn">
        <el-button type="primary" size="mini" @click="new_sop_handle"
          >新建SOP任务</el-button
        >
      </div>
    </div>
    <section ref="tableContainer">
      <ele-table
        :tableSize="'small'"
        :dataList="tableData"
        :tableHeight="tableHeight"
        :size="sourchParams.pageSize"
        :page="sourchParams.pageNo"
        :total="totalElements"
        @pageChange="pageChange_handler"
        class="mytable"
      >
        <el-table-column label="序号" align="center">
          <template slot-scope="scope">
            <span>{{
              (sourchParams.pageNo - 1) * sourchParams.pageSize +
                scope.$index +
                1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="计划名称"
          prop="taskName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="调用模版"
          prop="templateName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="发送微信号"
          prop="wechatNo"
          align="center"
        ></el-table-column>
        <el-table-column
          label="接受群数量"
          prop="clusterNum"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建人"
          prop="cname"
          align="center"
        ></el-table-column>
        <el-table-column
          label="职级"
          prop="rankName"
          align="center"
        ></el-table-column>
        <el-table-column label="创建时间" prop="ctime" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.ctime ? formatTime(scope.row.ctime) : '-'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="任务进度"
          prop="taskStatus"
          align="center"
          :formatter="formatTaskStatus"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus === 'AWAIT'">待执行</span>
            <span v-if="scope.row.taskStatus === 'FINISH'">已完成</span>
            <span v-if="scope.row.taskStatus === 'PROCESSING'">
              {{ scope.row.processingDay }}</span
            >
            <span v-if="scope.row.taskStatus === 'STOP'">已终止</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="editStyle">
              <el-button
                class="editStyle_btn"
                type="text"
                @click="taskDetails(scope.row, '1')"
                >详情</el-button
              >
              <el-button
                class="editStyle_btn"
                type="text"
                @click="taskRevise(scope.row, '2')"
                :class="{ editStyle_unbtn: scope.row.taskStatus !== 'AWAIT' }"
                :disabled="scope.row.taskStatus !== 'AWAIT'"
                >修改</el-button
              >
              <el-popconfirm
                confirmButtonText="确定"
                cancelButtonText="取消"
                icon="el-icon-info"
                iconColor="red"
                title="你确定要取消该项内容吗？"
                @onConfirm="confirmCancelRow(scope.row)"
              >
                <el-button
                  type="text"
                  @click="cancelOperation(scope.row, '3')"
                  slot="reference"
                  :class="{
                    editStyle_unbtn:
                      scope.row.taskStatus === 'STOP' ||
                      scope.row.taskStatus === 'FINISH'
                  }"
                  :disabled="
                    scope.row.taskStatus === 'STOP' ||
                      scope.row.taskStatus === 'FINISH'
                  "
                  >取消</el-button
                >
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </ele-table>
    </section>
    <el-drawer title="任务详情" :visible.sync="taskDetails_drawer">
      <section style="padding:0 10px;">
        <el-steps direction="vertical" :active="activeStatus">
          <el-step v-for="(item, index) in taskDetailsCon" :key="index">
            <template class="steptop" slot="title"
              ><span class="steptop_active">第{{ item.day }}天</span>
              <span v-if="item.templateStatus === 0">待开始</span>
              <span v-if="item.templateStatus === 1">已完成</span>
              <span v-if="item.templateStatus === 2">进行中</span>
              <span v-if="item.templateStatus === 3">已终止</span>
            </template>
            <template slot="description">
              <div class="step-row">
                <p>将于{{ item.startTime }}开始发送</p>
                <ul>
                  <li
                    v-for="(_item, _index) in item.templateDetails"
                    :key="_index"
                  >
                    <p>{{ _item.startTime }}</p>
                    <div>
                      <span class="ordernumber">{{ _index + 1 }}</span>
                      <span
                        style=" width: calc(100% - 50px);"
                        v-if="_item.msgType === 1"
                        >{{ _item.msgContent }}</span
                      >
                      <span style=" width: calc(100% - 50px);" v-else
                        ><img :src="_item.msgContent" alt=""
                      /></span>
                    </div>
                  </li>
                </ul>
              </div>
            </template>
          </el-step>
        </el-steps>
      </section>
    </el-drawer>
  </div>
</template>
<script>
import { isToss } from '@/utils/index'
import planTaskSearch from './planTaskSearch'
import EleTable from '@/components/Table/EleTable'
export default {
  data() {
    return {
      tableHeight: 'auto',
      tableData: [],
      activeStatus: 0,
      taskDetails_drawer: false,
      taskDetailsCon: [],
      sourchParams: {
        pageNo: 1,
        pageSize: 20,
        type: '',
        username: '',
        jobTaskName: '',
        templateId: '',
        startTime: '',
        endTime: ''
      },
      totalElements: 0
    }
  },
  created() {
    const teacherId = isToss()
    if (teacherId) {
      this.sourchParams.type = 1
    } else {
      this.sourchParams.type = 2
    }
    this.calcTableHeight()
    this.getlistJobTaskPage()
    console.log('tableData')
    console.log(this.tableData)
  },
  mounted() {},
  components: {
    EleTable,
    planTaskSearch
  },
  computed: {},

  methods: {
    // 任务列表
    getlistJobTaskPage() {
      this.listJobTaskPage(this.sourchParams).then((res) => {
        this.tableData = res.content
        this.totalElements = Number(res.totalElements)
        console.log(res)
      })
    },

    async listJobTaskPage(data) {
      try {
        const tmpInfo = await this.$http.Community.listJobTaskPage(data)
        return tmpInfo
      } catch (err) {
        console.log(err)
      }
    },
    formatTime(timestamp) {
      var date = new Date(timestamp * 1)
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
      var s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    // 任务进度
    formatTaskStatus(row, column) {
      console.log('123123123123123')
      console.log(row, column)
    },
    /** 详情 */
    taskDetails(row, type) {
      this.getViewSopJobTask(row.id)
      console.log(row, type)
    },
    getViewSopJobTask(id) {
      this.viewSopJobTask(id).then((res) => {
        if (res.code === 0) {
          this.active_Status()
          this.taskDetails_drawer = true
          this.taskDetailsCon = res.payload
        }
        console.log(res)
      })
    },
    async viewSopJobTask(id) {
      try {
        const tmpInfo = await this.$http.Community.viewSopJobTask({ id })
        return tmpInfo
      } catch (err) {
        console.log(err)
      }
    },
    // activeStatus状态
    active_Status() {
      this.taskDetailsCon.forEach((item, index) => {
        if (item.templateStatus === 2) {
          console.log(item, '=====')
          this.activeStatus = item.day - 1
        } else {
          this.activeStatus = 0
        }
        console.log(item, index)
      })
    },
    // 修改
    taskRevise(row, type) {
      console.log(row)
      this.$router.push({
        path: `/newPlantask/${row.id}`
      })
    },
    // 取消操作
    cancelOperation(row, type) {
      console.log(row, type)
    },
    /** 表格取消某一行确认按钮 */
    confirmCancelRow(row) {
      console.log('删除了', row)
      const params = {
        id: row.id,
        taskstatus: 'STOP'
      }
      console.log(params)
      this.$http.Community.updateStatus(params).then((res) => {
        console.log(res, '-------------')
        if (res.code === 0) {
          this.$message({
            message: '取消成功',
            type: 'success'
          })
          setTimeout(() => {
            this.getlistJobTaskPage()
          }, 1500)
        }
      })
    },
    // 换页
    pageChange_handler(res) {
      // this.tableParams.page = res
      this.sourchParams.pageNo = res
      this.getlistJobTaskPage()
      console.log(res)
    },
    /** 新建sop按钮 */
    new_sop_handle() {
      const id = '-1'
      this.$router.push({
        path: `/newPlantask/${id}`
      })
    },
    // 计算表格高度
    calcTableHeight() {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
        const tableTopHeight = this.$refs.tableContainer.getBoundingClientRect()
          .y
        //  document.body.clientHeight 返回body元素内容的高度
        const tableHeight = document.body.clientHeight - tableTopHeight - 60
        this.tableHeight = tableHeight + ''
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.steptop {
  color: #000 !important;
}
.steptop_active {
  display: inline-block;
  background: #99ccff;
  padding: 0px 10px;
  border-radius: 20px;
  color: #000000;
}
.steptop_unactive {
  display: inline-block;
  background: #e4e4e4;
  padding: 0px 10px;
  border-radius: 20px;
  color: #000000;
}
.step-row ul,
li {
  list-style: none;
}
.step-row li p {
  margin: 0 !important;
}
.step-row li {
  margin: 10px 0;
}
.step-row li img {
  width: 100px;
}
.step-row li div {
  display: flex;
  justify-content: stretch;
  align-items: center;
  background: #e7e7e7;
  border-radius: 5px;
}
.el-drawer__body {
  height: 100%;
  overflow: scroll;
}
.ordernumber {
  width: 50px !important;
  display: inline-block;
  text-align: center;
  margin: 0 !important;
  background: #cccccc;
  border-radius: 30px;
}
.margin_l10 {
  margin-left: 10px;
}
.editStyle {
  display: flex;
  justify-content: space-around;
  .editStyle_btn span {
    color: #2a75ed;
    cursor: pointer;
  }
  .editStyle_unbtn span {
    color: #c0c4cc !important;
    cursor: not-allowed;
  }
}
.el-input {
  width: 150px;
}

.el-popconfirm__action {
  display: flex;
  justify-content: space-around;
}
</style>
