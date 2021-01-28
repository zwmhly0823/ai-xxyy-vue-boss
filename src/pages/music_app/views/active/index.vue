<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-05-14 14:11:21
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-17 20:01:58
 -->
<template>
  <el-row type="flex" class="app-main team-container">
    <el-col class="team-container-content">
      <div class="grid-content">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div ref="tableContainer">
            <ele-table
              :tableHeight="tableHeight"
              :tableSize="'small'"
              :dataList="tableData"
              :loading="flags.loading"
              :size="tabQuery.size"
              :page="tabQuery.page + 1"
              :total="totalElements"
              :showAllTotalNum="true"
              @pageChange="pageChange_handler"
              class="mytable"
            >
              <el-table-column
                label="姓名"
                min-width="80"
                align="center"
                prop="name"
              >
              </el-table-column>
              <el-table-column
                label="年龄"
                min-width="80"
                prop="age"
                align="center"
              ></el-table-column>
              <el-table-column
                label="电话"
                width="120"
                prop="mobile"
                align="center"
              ></el-table-column>
              <el-table-column
                label="地址"
                min-width="80"
                align="center"
                prop="address"
              >
              </el-table-column>
              <el-table-column
                label="详细地址"
                min-width="70"
                prop="addressDetail"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="是否购过买小熊美术课程"
                min-width="60"
                prop="isBuy"
                align="center"
              >
              <template slot-scope="scope">
                <div>
                  {{ scope.row.isBuy === 1 ? '是' : '否'}}
                </div>
              </template>
              </el-table-column>
              <el-table-column
                label="兑换码"
                min-width="70"
                prop="code"
                align="center"
              >
              </el-table-column>
              <!-- <el-table-column
                label="创建时间"
                min-width="70"
                prop="createTime"
                align="center"
              >
              </el-table-column> -->
            </ele-table>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import _ from 'lodash'
import { calculateWD } from '@/utils/validate'
import { formatTeamNameSup } from '@/utils/supList'
import EleTable from '@/components/Table/EleTable'
import { formatData, openBrowserTab } from '@/utils/index'
// import ScheduleTable from './components/index.vue'

export default {
  props: [],
  components: {
    EleTable
  },
  data() {
    return {
      tableHeight: 'auto',
      flags: {
        loading: false
      },
      // 总页数
      totalElements: 0,
      tableData: [],
      tabQuery: {
        size: 20,
        page: 0,
      },
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$http.Active.test(this.tabQuery)
      .then(res => {
        if(res.code === 0) {
          this.tableData = res.payload.content;
          this.totalElements = res.payload.totalElements | 0;
        }
        else {

        }
      })
    },
    pageChange_handler(page) {
      this.tabQuery.page = page - 1;
      this.init();
    },
  }
}
</script>
<style lang="scss" scoped>
.team-container {
  &-content {
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
  }
  .team-name-pointer {
    cursor: pointer;
    color: #2a75ed;
  }
  // 排序css
  .sort-operate-box {
    position: relative;
    .sort-icon-arrow {
      display: inline-block;
      position: relative;
      top: -2px;
      .top {
        position: absolute;
        bottom: 0;
      }
      .active {
        color: #2a75ed;
      }
      .top-color {
        position: absolute;
        bottom: 0;
      }
      .bottom {
        position: absolute;
        top: -6px;
      }
      .bottom-color {
        position: absolute;
        top: -6px;
      }
    }
  }
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header-search-container {
      // height: 50px;
      display: flex;
      padding-left: 15px;
      border-bottom: 1px solid #eee;
    }
    .tabs-operate {
      height: 40px;
      background: #f5f7fa;
      display: flex;
      > div {
        height: 100%;
        padding: 0 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &.active {
          background: #fff;
          span {
            color: #2a75ed;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.add-first-cell-bg > .el-table tbody tr:hover > td:first-child {
  background-color: #2a75ed !important;
  .team-name-pointer {
    color: #ffffff;
  }
}
.grid-content .scrollbar-wrapper {
  overflow-x: hidden;
}
.grid-content .el-scrollbar {
  flex: 1;
}
</style>
