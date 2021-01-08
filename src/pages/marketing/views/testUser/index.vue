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
            <div class="wenjuan-css">
              <el-button @click="changeActivityTime" size="mini" type="primary"
                ><i class="el-icon-plus"></i>添加</el-button
              >
            </div>
            <!-- <div class="operete-row">
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
                  >添加</el-button
                >
              </div>
            </div> -->
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
                  label="id"
                  prop="id"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="手机"
                  prop="mobile"
                  align="center"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope" v-if="scope.row.del === '0'">
                    <div class="editStyle">
                      <el-button
                        class="editStyle_btn"
                        type="text"
                        @click="activityDetails(scope.row, '3')"
                        >删除</el-button
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
// import activitySearch from './components/activitySearch'
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
        mobiles: ''
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
  },
  mounted() {},
  components: {
    EleTable
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
      this.getTestUserList(this.sourchParams).then((res) => {
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
    // 修改活动时间
    changeActivityTime(row) {
      this.activityTimeDialog = true
    },
    // 删除
    activityDetails(row, type) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const arr = []
          arr.push(row.id)
          const params = {
            ids: arr
          }
          this.$http.Marketing.delMktWhite(params).then((res) => {
            console.log(res, '-------------')
            if (res.code === 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.get_PromotionsPageList()
            }
          })
          this.activityTimeDialog = false
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
          this.activityTimeDialog = false
        })
    },
    _changeActivityTime() {
      const arr = this.activityTime.mobiles.split(',')
      console.log(arr)
      const params = {
        mobiles: arr
      }
      this.$http.Marketing.addMktWhite(params).then((res) => {
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
.wenjuan-css {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding-right: 20px;
  height: 50px;
  background: #fff;
}
</style>
