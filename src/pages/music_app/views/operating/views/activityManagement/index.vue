<<<<<<< HEAD
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
                @get_PromotionsPageList="get_PromotionsPageList"
                :sourchParams="sourchParams"
              />
              <div class="add-btn">
                <el-button
                  type="primary"
                  size="mini"
                  @click="new_activity_handle"
                  >新建活动</el-button
                >
              </div>
            </div>
            <section ref="tableContainer">
              <ele-table
                :tableSize="'small'"
                :dataList="tableData"
                :tableHeight="tableHeight"
                :size="sourchParams.size"
                :page="sourchParams.page"
                :total="totalElements"
                @pageChange="pageChange_handler"
                class="mytable"
              >
                <el-table-column label="序号" align="center">
                  <template slot-scope="scope">
                    <span>{{
                      (sourchParams.page - 1) * sourchParams.size +
                        scope.$index +
                        1
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="活动名称"
                  prop="promotionsName"
                  align="center"
                ></el-table-column>
                <el-table-column label="活动类型" align="center">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.promotionsType === 'GIFT' ? '关单赠品' : '-'
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="活动范围" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.promotionsRange === 2">
                      <span
                        >{{ scope.row.orderStartDate }} ~
                        {{ scope.row.orderEndDate }}</span
                      >
                    </div>
                    <div v-else>
                      <span v-if="scope.row.trialTermsName"
                        >体验课:{{ scope.row.trialTermsName }}</span
                      ><br />
                      <span v-if="scope.row.systemTermsName"
                        >系统课:{{ scope.row.systemTermsName }}</span
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="活动时间"
                  prop="clusterNum"
                  align="center"
                  ><template slot-scope="scope">
                    <span
                      >{{ scope.row.startDate }}～{{ scope.row.endDate }}</span
                    >
                    <i
                      class="el-icon-edit"
                      style="margin-left:20px;"
                      @click="changeActivityTime(scope.row)"
                    ></i>
                  </template>
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
                      <el-button
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
import activitySearch from './components/activitySearch'
import EleTable from '@/components/Table/EleTable'
export default {
  data() {
    return {
      tableHeight: 'auto',
      tableData: [],
      sourchParams: {
        page: 1,
        size: 20,
        promotionsName: '',
        trialTerms: '',
        systemTerms: ''
      },
      totalElements: 0,
      activityTimeDialog: false,
      activityTime: {
        endTime: ''
      },
      id: ''
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
    activitySearch
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
        console.log(res)
        this.tableData = res.payload.content
        this.totalElements = Number(res.payload.totalElements)
      })
    },

    async getPromotionsPageList(data) {
      try {
        const tmpInfo = await this.$http.Operating.getPromotionsPageList(data)
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
      this.sourchParams.page = res
      this.get_PromotionsPageList()
      console.log(res)
    },
    /** 新建活动按钮 */
    new_activity_handle() {
      const promotionsId = '-1'
      this.$router.push({
        path: `/newActivityManage/${promotionsId}/0`
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
=======
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
                @get_PromotionsPageList="get_PromotionsPageList"
                :sourchParams="sourchParams"
              />
              <div class="add-btn">
                <el-button
                  type="primary"
                  size="mini"
                  @click="new_activity_handle"
                  >新建活动</el-button
                >
              </div>
            </div>
            <section ref="tableContainer">
              <ele-table
                :tableSize="'small'"
                :dataList="tableData"
                :tableHeight="tableHeight"
                :size="sourchParams.size"
                :page="sourchParams.page"
                :total="totalElements"
                @pageChange="pageChange_handler"
                class="mytable"
              >
                <el-table-column label="序号" align="center">
                  <template slot-scope="scope">
                    <span>{{
                      (sourchParams.page - 1) * sourchParams.size +
                        scope.$index +
                        1
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="活动名称"
                  prop="promotionsName"
                  align="center"
                ></el-table-column>
                <el-table-column label="活动类型" align="center">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.promotionsType === 'GIFT' ? '关单赠品' : '-'
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="活动范围" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.promotionsRange === 2">
                      <span
                        >{{ scope.row.orderStartDate }} ~
                        {{ scope.row.orderEndDate }}</span
                      >
                    </div>
                    <div v-else>
                      <span v-if="scope.row.trialTermsName"
                        >体验课:{{ scope.row.trialTermsName }}</span
                      ><br />
                      <span v-if="scope.row.systemTermsName"
                        >系统课:{{ scope.row.systemTermsName }}</span
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="活动时间"
                  prop="clusterNum"
                  align="center"
                  ><template slot-scope="scope">
                    <span
                      >{{ scope.row.startDate }}～{{ scope.row.endDate }}</span
                    >
                    <i
                      class="el-icon-edit"
                      style="margin-left:20px;"
                      @click="changeActivityTime(scope.row)"
                    ></i>
                  </template>
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
                      <el-button
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
import activitySearch from './components/activitySearch'
import EleTable from '@/components/Table/EleTable'
export default {
  data() {
    return {
      tableHeight: 'auto',
      tableData: [],
      sourchParams: {
        page: 1,
        size: 20,
        promotionsName: '',
        trialTerms: '',
        systemTerms: ''
      },
      totalElements: 0,
      activityTimeDialog: false,
      activityTime: {
        endTime: ''
      },
      id: ''
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
    activitySearch
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
        console.log(res)
        this.tableData = res.payload.content
        this.totalElements = Number(res.payload.totalElements)
      })
    },

    async getPromotionsPageList(data) {
      try {
        const tmpInfo = await this.$http.Operating.getPromotionsPageList(data)
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
      this.sourchParams.page = res
      this.get_PromotionsPageList()
      console.log(res)
    },
    /** 新建活动按钮 */
    new_activity_handle() {
      const promotionsId = '-1'
      this.$router.push({
        path: `/newActivityManage/${promotionsId}/0`
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
>>>>>>> feature/ossPlugin-20210204
