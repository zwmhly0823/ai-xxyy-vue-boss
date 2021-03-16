<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: Shentong
 * @LastEditTime: 2021-01-06 22:48:12
-->
<template>
  <div class="look-statistics">
    <el-dialog
      :visible.sync="showDialog"
      :before-close="dialogClose"
      :close-on-click-modal="false"
      width="70%"
    >
      <section
        class="section"
        v-loading="loadingList"
        element-loading-spinner="el-icon-loading"
        element-loading-text="玩命加载中"
        :class="{ 'no-padding': tabQuery.size > totalElements }"
      >
        <div class="tabs">
          <div>参课时间</div>
          <div>完课时间</div>
        </div>
        <div class="time-list">
          <div class="item" v-for="(item, index) in tableData" :key="index">
            <div class="scope-row" v-if="item.state == 0">
              <span>{{ item.ctime || '--' }}</span>
              <!-- <span class="loin-comp" v-if="item.buState == 0">
                当日参课
              </span>
              <span class="loin-comp" v-if="item.buState == 1">补参课</span> -->
              <!-- <span class="last-join-comp">最后一次参课</span> -->
            </div>
            <div class="scope-row" v-else>
              <span>{{ item.ctime || '--' }}</span>
              <!-- <span class="loin-comp" v-if="item.buState == 0">
                当日完课
              </span>
              <span class="loin-comp" v-if="item.buState == 1">补完课</span> -->
              <!-- <span class="last-join-comp">最后一次完课</span> -->
            </div>
          </div>
        </div>
        <div class="page_box" v-if="tabQuery.size <= totalElements">
          <el-pagination
            background
            layout="prev, pager, next, total"
            :total="totalElements"
            @current-change="pageChange_handler"
            :current-page="tabQuery.page"
            :page-size.sync="tabQuery.size"
          >
          </el-pagination>
        </div>
        <!-- <ele-table
          :tableHeight="tableHeight"
          :tableSize="'small'"
          :dataList="tableData"
          :size="tabQuery.size"
          :page="tabQuery.page"
          :total="totalElements"
          :showAllTotalNum="true"
          :headerRowClasFn="headerRowClasFn"
          @pageChange="pageChange_handler"
          class="mytable"
        > -->
        <!-- <el-table-column
            label="参课时间"
            min-width="120"
            prop="department_name"
            align="center"
          >
            <template slot-scope="scope">
              <div class="scope-row">
                <span>{{ scope.row.ctime || '--' }}</span>
                <span class="loin-comp" v-if="scope.row.buState == 0">
                  当日参课
                </span>
                <span class="loin-comp" v-if="scope.row.buState == 1"
                  >补参课</span
                >
                <span class="last-join-comp">最后一次参课</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="完课时间"
            min-width="120"
            prop="department_name"
            align="center"
          >
            <template slot-scope="scope">
              <div class="scope-row">
                <span>{{ scope.row.ctime || '--' }}</span>
                <span class="loin-comp" v-if="scope.row.buState == 0">
                  当日完课
                </span>
                <span class="loin-comp" v-if="scope.row.buState == 1"
                  >补完课</span
                >
                <span class="last-join-comp">最后一次完课</span>
              </div>
            </template>
          </el-table-column> -->
        <!-- </ele-table> -->
      </section>
    </el-dialog>
  </div>
</template>

<script>
import { formatDateByType } from '@/utils/mini_tool_lk'
// import EleTable from '@/components/Table/EleTable'

export default {
  name: 'taskDetail',

  props: {
    showJoinComp: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    // EleTable
  },
  computed: {
    showDialog() {
      return this.showJoinComp
    }
  },
  created() {
    this.studentId = this.$route.params.id
    this.getJoinCompStatistics()

    // const list = [
    //   {
    //     state: '0'
    //   },
    //   {
    //     state: '1'
    //   },
    //   {
    //     state: '1'
    //   },
    //   {
    //     state: '1'
    //   },
    //   {
    //     state: '0'
    //   },
    //   {
    //     state: '1'
    //   }
    // ]
    // this.buildList(list)
  },
  data() {
    return {
      loadingList: false,
      tableHeight: 'auto',
      tableData: [],
      totalElements: 0,
      tabQuery: {
        size: 100000,
        page: 1
      }
    }
  },
  methods: {
    headerRowClasFn() {
      return 'header-row-class'
    },
    // 查看参课完课
    async getJoinCompStatistics() {
      this.loadingList = true
      const params = {
        query: {
          student_id: this.studentId,
          course_id: this.rowData.course_id,
          subject: this.rowData.subjectCode,
          type: 0,
          del: 0
        },
        ...this.tabQuery
      }
      try {
        const { LookJoinCompStatistics } = this.$http.User

        const { data = {} } = await LookJoinCompStatistics(params)
        const { StudentLearnCourseLogPage = {} } = data
        const { content = [], totalElements } = StudentLearnCourseLogPage

        this.totalElements = +totalElements

        this.buildList(content)
        this.bundleList(content)

        this.tableData = content
      } catch (err) {
        console.info(err)
      } finally {
        this.loadingList = false
      }
    },
    /** 重新组装数据 */
    buildList(list = []) {
      // 先处理 0
      for (let i = 0; i < list.length; i++) {
        const j = i + 1
        if (list[j] && list[i].state === '0' && list[j].state === '0') {
          list.splice(j, 0, {
            state: '1',
            name: '补1'
          })
          i = j
        }
      }
      console.log('000', list)
      // 再处理 1
      for (let z = 0; z < list.length; z++) {
        const f = z + 1
        if (list[f] && list[z].state === '1' && list[f].state === '1') {
          list.splice(f, 0, {
            state: '0',
            name: '补0'
          })
          // z = f
        }
      }
      const L = list.length
      if (L && L % 2 === 1) {
        if (list[L - 1] === '0') {
          list.splice(L, 0, {
            state: '1'
          })
        } else {
          list.splice(L, 0, {
            state: '0'
          })
        }
      }

      console.log('list', list)
    },
    bundleList(list = []) {
      list.forEach((item) => {
        /**
         * state 参课0；完课1
         */
        const {
          bu_state: buState,
          ctime = 0,
          state,
          subject,
          subject_text: subjectText
        } = item

        Object.assign(item, {
          buState,
          ctime: formatDateByType(ctime, '-', 'M'),
          state,
          subject,
          subjectText
        })
      })
    },
    pageChange_handler(page) {
      this.tabQuery.page = page
      this.getJoinCompStatistics()
    },
    dialogClose() {
      this.$emit('update:showJoinComp', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.look-statistics {
  /deep/ .el-dialog__body {
    padding: 30px 3px 0 0;
  }
  .section {
    padding-bottom: 50px;
    min-height: 200px;
    &.no-padding {
      padding-bottom: 0;
    }
    .tabs {
      display: flex;
      height: 50px;
      div {
        flex: 1;
        display: flex;
        // justify-content: center;
        padding-left: 40px;
        align-items: center;
        background: #f5f7fa;
      }
    }
    .time-list {
      display: flex;
      flex-wrap: wrap;
      max-height: 500px;
      overflow-y: scroll;
      .item {
        height: 40px;
        display: flex;
        width: 49%;
        // justify-content: center;
        padding-left: 40px;
        align-items: center;
        .scope-row {
          span {
            margin-right: 10px;
          }
          .loin-comp {
            color: goldenrod;
          }
          .last-join-comp {
            color: #e4393c;
          }
        }
      }
    }
    .page_box {
      height: 50px;
      display: flex;
      align-items: center;
      text-align: right;
      text-align: right;
      position: absolute;
      bottom: 0;
      right: 15px;
    }
    // .mytable {
    //   /deep/ .header-row-class th {
    //     background: #f5f7fa;
    //     height: 50px;
    //   }
    //   .scope-row {
    //     span {
    //       margin-right: 10px;
    //     }
    //     .loin-comp {
    //       color: goldenrod;
    //     }
    //     .last-join-comp {
    //       color: #e4393c;
    //     }
    //   }
    // }
  }
}
</style>
