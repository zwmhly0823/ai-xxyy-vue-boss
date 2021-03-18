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
              <!-- <activitySearch
                @search="getSearch"
                @get_PromotionsPageList="get_PromotionsPageList"
                :sourchParams="sourchParams"
              /> -->
              <div class="add-btn">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleReviewBatch"
                  >批量审核</el-button
                >
              </div>
            </div>
            <section ref="tableContainer">
              <ele-table
                :tableSize="'small'"
                :dataList="tableData"
                :tableHeight="tableHeight"
                :size="sourchParams.pageSize"
                :page="sourchParams.pageNum"
                :total="totalElements"
                @pageChange="pageChange_handler"
                @selection-change="handleSelectionChange"
                :showAllTotalNum="true"
                class="mytable"
              >
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column label="序号" align="center">
                  <template slot-scope="scope">
                    <span>{{
                      (sourchParams.pageNum - 1) * sourchParams.pageSize +
                        scope.$index +
                        1
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="作品名称"
                  prop="title"
                  align="center"
                ></el-table-column>
                <el-table-column label="课程名称" align="center" prop="courseTitle">
                </el-table-column>
                <el-table-column label="封面图" align="center">
                  <template slot-scope="scope">
                    <el-popover
                      placement="top"
                      title="视频预览"
                      trigger="click"
                      width="260"
                      popper-class="preview-video"
                    >
                      <video
                        style="width: 220px;"
                        :src="scope.row.videoPath"
                        controls
                      />
                      <img slot="reference" :src="scope.row.coverPath" style="width: 40px;height:40px;" />
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                  <template slot-scope="scope">
                    <div>{{getEnumStatus(scope.row.status)}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="权重" align="center" prop="topLevel">

                </el-table-column>
                <el-table-column label="创建时间" prop="ctime" align="center">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.ctime ? formatTime(scope.row.ctime) : '-'
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <div class="editStyle">
                      <!-- <el-button
                        class="editStyle_btn"
                        type="text"
                        @click="activityDetails(scope.row, '1')"
                        >详情</el-button
                      >
                      <el-button
                        class="editStyle_btn"
                        type="text"
                        :disabled="isEditActivity(scope.row.startDate)"
                        :class="{
                          editStyle_unbtn: isEditActivity(scope.row.startDate)
                        }"
                        @click="activityDetails(scope.row, '2')"
                        >编辑</el-button
                      > -->
                      <!-- <el-button
                        class="editStyle_btn"
                        type="text"
                        @click="handleReview"
                        >审核</el-button
                      > -->
                      <el-button
                        class="editStyle_btn"
                        type="text"
                        @click="() => {handleTop(scope.row)}"
                        >置顶</el-button
                      >
                    </div>
                  </template>
                </el-table-column>
              </ele-table>
            </section>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
    <el-dialog title="审核作品" :visible.sync="statusDialog">
      <p v-for="(item,index) in uids" :key="index">
        {{item.title}}
      </p>
      <el-form :model="activityTime">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="4">未通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="作品置顶" :visible.sync="topDialog">
      <p>
        {{activeItem.title}}
      </p>
      <el-form :model="activityTime">
        <el-form-item label="权重值">
          <el-input v-model="activeItem.topLevel" placeholder="权重值越高作品越靠前"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="topDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleTopConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改活动结束时间" :visible.sync="activityTimeDialog">
      <el-form :model="activityTime">
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="activityTime.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="activityTimeDialog = false">取 消</el-button>
        <el-button type="primary" @click="_changeActivityTime">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
// import { isToss } from '@/utils/index'
// import activitySearch from './components/activitySearch'
import EleTable from '@/components/Table/EleTable'

const staff = JSON.parse(localStorage.getItem('staff') || '{}')
const operatorId = (staff && staff.id) || ''

export default {
  data() {
    return {
      tableHeight: 'auto',
      tableData: [],
      sourchParams: {
        pageNum: 1,
        pageSize: 20,
        uid: operatorId,
      },
      totalElements: 0,
      activityTimeDialog: false,
      statusDialog: false,
      topDialog: false,
      activityTime: {
        endTime: ''
      },
      id: '',
      uids: [],
      status: 0,
      activeItem: {
        topLevel: '',
      },
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
    this.calcTableHeight()
    this.get_PromotionsPageList()
    console.log('tableData')
    console.log(this.tableData)
  },
  mounted() {},
  components: {
    EleTable,
    // activitySearch
  },
  computed: {
    isEditActivity() {
      return (time) => {
        const date = new Date(time).getTime()
        const nowdate = new Date().getTime()
        if (nowdate >= date) {
          return true
        } else {
          return false
        }
      }
    }
  },

  methods: {
    handleTopConfirm() {
      this.$http.Operating.topLevel({
        topLevel: this.activeItem.topLevel,
        workId: this.activeItem.id,
      })
      .then(res => {
        if(res.code === 0) {
          this.$message({
            message: '置顶成功',
            type: 'success'
          })
          this.topDialog = false;
          this.activeItem = {
            topLevel: ''
          };
          this.get_PromotionsPageList();
        }
        else {
          this.$message({
            message: '置顶失败',
            type: 'error'
          })
        }
      })
    },
    handleConfirm() {
      const uids = [];
      if(this.uids.length === 0) {
        return
      }
      this.uids.map(item => {
        uids.push(item.id);
      });
      this.$http.Operating.auditWorks({
        status: this.status,
        workIds: uids,
      })
      .then(res => {
        if(res.code === 0) {
          this.$message({
            message: '审核成功',
            type: 'success'
          })
          this.statusDialog = false;
          this.status = 0;
          this.get_PromotionsPageList();
        }
        else {
          this.$message({
            message: '审核失败',
            type: 'error'
          })
        }
      })
    },
    getEnumStatus(val) {
      if(val === 1) {
        return '审核中'
      }
      if(val === 2) {
        return '发布成功'
      }
      if(val === 3) {
        return '被禁'
      }
      if(val === 4) {
        return '审核未通过'
      }
    },
    handleSelectionChange(val) {
      this.uids = val;
    },
    handleReviewBatch() {
      this.statusDialog = true;
    },
    handleTop(row) {
      this.topDialog = true;
      this.activeItem = row;
    },
    // 获取search
    getSearch(res) {
      console.log(res, 'res_getSearch=-=-=')
      this.sourchParams = {
        page: 1,
        size: 20,
        promotionsName: res.promotionsName,
        trialTerms: res.trialTerms,
        systemTerms: res.systemTerms
      }
      this.get_PromotionsPageList()
    },
    // 活动管理列表
    get_PromotionsPageList() {
      this.getPromotionsPageList(this.sourchParams).then((res) => {
        this.tableData = res.payload.items
        this.totalElements = Number(res.payload.totalCount)
      })
    },

    async getPromotionsPageList(data) {
      try {
        const tmpInfo = await this.$http.Operating.getReviewPageList(data)
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
    // 取消操作
    cancelOperation(row, type) {
      console.log(row, type)
    },
    // 换页
    pageChange_handler(res) {
      // this.tableParams.page = res
      this.sourchParams.pageNum = res
      this.get_PromotionsPageList()
      console.log(res)
    },
    /** 新建活动按钮 */
    new_activity_handle() {
      const promotionsId = '-1'
      this.$router.push({
        path: `/review/${promotionsId}/0`
      })
    },
    // 详情、编辑
    activityDetails(row, type) {
      const promotionsId = row.id
      this.$router.push({
        path: `/newActivityManage/${promotionsId}/${type}`
      })
    },
    // 修改活动时间
    changeActivityTime(row) {
      this.activityTimeDialog = true
      this.activityTime.endTime = row.endDate
      this.id = row.id
      console.log(row)
    },
    _changeActivityTime() {
      const params = {
        id: this.id,
        endDate: this.activityTime.endTime
      }
      this.$http.Operating.updatePromotionsDate(params).then((res) => {
        console.log(res, '-------------')
        if (res.code === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.get_PromotionsPageList()
        }
      })
      this.activityTimeDialog = false
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
.preview-video{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
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
.el-dialog {
  width: 30%;
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
      justify-content: center;
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
.editStyle_unbtn span {
  color: #c0c4cc !important;
  cursor: not-allowed;
}
</style>
