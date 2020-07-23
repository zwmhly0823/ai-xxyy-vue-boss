<!--
 * @Descripttion: BOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 17:10:10
 * @LastEditors: shasen
 * @LastEditTime: 2020-07-04 18:29:22
-->
<template>
  <el-row type="flex" class="activity-manage app-main">
    <el-col class="grop-container">
      <div class="scroll-container">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="activity-manage-container">
            <div class="operete-row">
              <activitySearch
                @search="getSearch"
                @getlistJobTaskPage="getlistJobTaskPage"
                :sourchParams="sourchParams"
              />
              <div class="add-btn">
                <el-button
                  type="primary"
                  size="mini"
                  @click="new_sop_handle"
                  v-if="sourchParams.type === 1"
                  >新建活动</el-button
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
                        v-if="sourchParams.type === 1"
                        class="editStyle_btn"
                        type="text"
                        @click="taskRevise(scope.row, '2')"
                        :class="{
                          editStyle_unbtn: scope.row.taskStatus !== 'AWAIT'
                        }"
                        :disabled="scope.row.taskStatus !== 'AWAIT'"
                        >修改</el-button
                      >
                      <el-popconfirm
                        v-if="sourchParams.type === 1"
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
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { isToss } from '@/utils/index'
import activitySearch from './components/activitySearch'
import EleTable from '@/components/Table/EleTable'
export default {
  data() {
    return {
      tableHeight: 'auto',
      tableData: [],
      taskDetailsCon: [],
      sourchParams: {
        pageNo: 1,
        pageSize: 20,
        type: '',
        username: '',
        jobTaskName: '',
        templateId: '',
        startTime: '',
        endTime: '',
        uid: ''
      },
      totalElements: 0
    }
  },
  // watch: {
  //   activeStatus(val) {
  //     if (!val) {
  //       this.activeStatus = 0
  //     } else {
  //       this.activeStatus = val
  //     }
  //   }
  // },
  created() {
    const teacherId = isToss()
    if (teacherId) {
      const tossteacher = JSON.parse(localStorage.getItem('teacher'))
      this.sourchParams.type = 1
      this.sourchParams.uid = tossteacher.id
    } else {
      const staff = JSON.parse(localStorage.getItem('staff'))
      this.sourchParams.type = 2
      this.sourchParams.uid = staff.id || ''
    }
    this.calcTableHeight()
    this.getlistJobTaskPage()
    console.log('tableData')
    console.log(this.tableData)
  },
  activated() {
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
    activitySearch
  },
  computed: {},

  methods: {
    // 获取search
    getSearch(res) {
      console.log(res, 'res_getSearch=-=-=')
    },
    // 任务列表
    getlistJobTaskPage() {
      this.listJobTaskPage(this.sourchParams).then((res) => {
        this.tableData = res.content
        this.totalElements = Number(res.totalElements)
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
    // 修改
    taskRevise(row, type) {
      console.log(row)
      this.$router.push({
        path: `/newActivityManage/${row.id}/-1`
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
        path: `/newActivityManage/${id}/-1`
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
.activity-manage {
  .grop-container {
    position: relative;
    margin: 10px;
    background: #fff;
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
    .scroll-container {
      background: white;
      height: 100%;
      display: flex;
      flex-direction: column;
      .scrollbar-wrapper {
        overflow-x: hidden;
      }
      .el-scrollbar {
        flex: 1;
      }
    }
  }
}
.operete-row {
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  .search-container {
    .search-item {
      position: relative;
      /deep/ input {
        padding-left: 25px;
      }
    }
    b {
      position: absolute;
      left: 10px;
      top: 7px;
      color: #999;
    }
  }
}
section {
  .mytable {
    .editStyle {
      display: flex;
      justify-content: space-around;
      span {
        color: #2a75ed;
        cursor: pointer;
        &.btn-disabled {
          color: #ccc;
          cursor: no-drop;
        }
      }
    }
  }
}
</style>
