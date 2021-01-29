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
                  @click="changeActivityTime"
                  >添加</el-button
                >
              </div>
            </div>
            <section ref="tableContainer">
              <ele-table
                :tableSize="'small'"
                :dataList="tableData"
                :tableHeight="tableHeight"
                :size="sourchParams.pageSize"
                :page="sourchParams.pageIndex"
                :total="totalElements"
                @pageChange="pageChange_handler"
                class="mytable"
              >
                <!-- <el-table-column label="序号" align="center">
                  <template slot-scope="scope">
                    <span>{{
                      (sourchParams.pageIndex - 1) * sourchParams.pageSize +
                      scope.$index +
                      1
                    }}</span>
                  </template>
                </el-table-column> -->
                <el-table-column
                  label="id"
                  prop="id"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="手机"
                  prop="mobile"
                  align="center"
                ></el-table-column>
                <el-table-column label="状态" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.del == '0' ? '未删' : '已删' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <div class="editStyle" v-if="scope.row.del === '0'">
                      <el-button
                        class="editStyle_btn"
                        type="text"
                        @click="activityDetails(scope.row, '3')"
                        >删除</el-button
                      >
                    </div>
                    <div class="editStyle" v-if="scope.row.del === '1'">
                      <el-button
                        class="editStyle_btn"
                        type="text"
                        @click="activityDetails(scope.row, '3')"
                        >启用</el-button
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
    <el-dialog title="添加手机号码" :visible.sync="activityTimeDialog">
      <el-form :model="activityTime">
        <el-form-item label="手机号码">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入手机号"
            v-model="activityTime.mobiles"
          >
          </el-input>
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
        pageIndex: 0,
        pageSize: 20,
      },
      totalElements: 0,
      activityTimeDialog: false,
      activityTime: {
        mobiles: '',
      },
      id: '',
    }
  },
  created() {
    this.calcTableHeight()
    this.get_PromotionsPageList()
  },
  mounted() {},
  components: {
    EleTable,
    activitySearch,
  },
  computed: {},
  methods: {
    // 获取search
    getSearch(res) {
      if (res.mobile !== '') {
        this.sourchParams = {
          pageIndex: 1,
          pageSize: 20,
          mobile: res.mobile,
        }
      } else {
        this.sourchParams = {
          pageIndex: 1,
          pageSize: 20,
        }
      }
      this.get_PromotionsPageList()
    },
    // 活动管理列表
    get_PromotionsPageList() {
      let sourchParams = this.sourchParams

      let pageIndex = 0
      if (sourchParams.pageIndex == 1) {
        pageIndex = 0
      } else if (sourchParams.pageIndex > 1) {
        pageIndex = sourchParams.pageIndex - 1
      }
      this.getTestUserList({
        ...sourchParams,
        pageSize: sourchParams.pageSize,
        pageIndex,
      }).then((res) => {
        console.log(res)
        this.tableData = res.payload.content
        this.totalElements = Number(res.payload.totalElements)
      })
    },
    async getTestUserList(data) {
      try {
        const tmpInfo = await this.$http.Marketing.getMktWhites(data)
        return tmpInfo
      } catch (err) {
        console.log(err)
      }
    },
    // 换页
    pageChange_handler(res) {
      // this.tableParams.page = res
      this.sourchParams.pageIndex = res
      this.get_PromotionsPageList()
    },
    // 修改活动时间
    changeActivityTime(row) {
      this.activityTimeDialog = true
    },
    // 删除
    activityDetails(row, type) {
      const arr = []
      arr.push(row.id)
      let del = 0
      if (row.del === '0') {
        del = 1
      } else if (row.del === '1') {
        del = 0
      }

      const params = {
        ids: arr,
        del,
      }
      this.$http.Marketing.updateMktWhite(params).then((res) => {
        console.log(res, '-------------')
        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
          })
          this.get_PromotionsPageList()
        }
      })
      this.activityTimeDialog = false
    },
    // 确定
    _changeActivityTime() {
      const arr = this.activityTime.mobiles.split(',')
      const params = {
        mobiles: arr,
      }
      this.$http.Marketing.addMktWhite(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: '保存成功',
            type: 'success',
          })
          this.get_PromotionsPageList()
        }
      })
      this.activityTime.mobiles = ''
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
    },
  },
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
.wenjuan-css {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding-right: 20px;
  height: 50px;
  background: #fff;
}
</style>
