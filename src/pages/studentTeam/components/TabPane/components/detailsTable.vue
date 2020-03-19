<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-03-16 20:22:24
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-19 12:39:08
 -->
<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tables.tableData"
      tooltip-effect="dark"
      :header-cell-style="headerCss"
      :row-class-name="tableRowClassName"
      @row-click="onClick"
      @selection-change="handleSelectionChange"
    >
      <!-- 加好友进群 - 复选框 -->
      <el-table-column
        v-if="this.tables.tabs == 0"
        type="selection"
        width="50"
      ></el-table-column>
      <!-- 加好友进群 - 基本信息 -->
      <el-table-column
        v-if="this.tables.tabs == 0"
        width="260"
        label="基本信息"
      >
        <template slot-scope="scope">
          <div class="scope-info-box">
            <img class="scope-info-img" :src="scope.row.img" alt="" />
            <img class="scope-info-img1" :src="scope.row.img" alt="" />
            <div class="info-telephone">{{ scope.row.telephone }}</div>
            <span class="info-age">{{ scope.row.age }}</span>
            <span class="info-basics">{{ scope.row.basics }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 组建遍历表头 -->
      <el-table-column
        align="center"
        v-for="(item, index) in tables.tableLabel"
        :key="index"
        :prop="item.prop"
        :width="item.width"
        :label="item.label"
      >
      </el-table-column>
      <!-- 加好友进群 - 已加好友 -->
      <el-table-column
        v-if="this.tables.tabs == 0"
        align="center"
        label="已加好友"
      >
        <template slot-scope="scope">
          <span class="icon-warp">
            <!-- <span>{{ scope.row.friend }}</span> -->
            <i v-if="scope.row.friend == 1" class="el-icon-error"></i>
            <i v-else-if="scope.row.friend == 2" class="el-icon-success"></i>
          </span>
          <el-dropdown @command="commandFriend" trigger="click">
            <span class="el-dropdown-link icon-warps">
              <i
                v-show="scope.row.friend == 1 ? true : false"
                class="el-icon-caret-bottom el-icon--right"
              ></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                style="font-size:20px"
                command="2"
                icon="el-icon-success"
              ></el-dropdown-item>
              <el-dropdown-item
                style="font-size:20px"
                command="1"
                icon="el-icon-error"
              ></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div>{{ scope.row.date }}</div>
          <span style="display: none;"> {{ scope.row.group }}</span>
        </template>
      </el-table-column>
      <!-- 加好友进群 - 已进群 -->
      <el-table-column
        v-if="this.tables.tabs == 0"
        align="center"
        label="已进群"
      >
        <template slot-scope="scope">
          <span class="icon-warp">
            <!-- <span>{{ scope.row.group }}</span> -->
            <i v-if="scope.row.group == 1" class="el-icon-error"></i>
            <i v-else-if="scope.row.group == 2" class="el-icon-success"></i>
          </span>
          <el-dropdown @command="onGroup" trigger="click">
            <span class="el-dropdown-link icon-warps">
              <i
                v-show="scope.row.group == 1 ? true : false"
                class="el-icon-caret-bottom el-icon--right"
              ></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                style="font-size:20px"
                command="2"
                icon="el-icon-success"
              ></el-dropdown-item>
              <el-dropdown-item
                style="font-size:20px"
                command="1"
                icon="el-icon-error"
              ></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div>{{ scope.row.date }}</div>
          <span style="display: none;"> {{ scope.row.group }}</span>
        </template>
      </el-table-column>
      <!-- 加好友进群 - 关注公众号 -->
      <el-table-column
        v-if="this.tables.tabs == 0"
        align="center"
        label="关注公众号"
      >
        <template slot-scope="scope">
          <span class="icon-warp">
            <i class="el-icon-error"></i>
          </span>
          <div>{{ scope.row.date }}</div>
          <span style="display: none;"> {{ scope.row }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-flex">
      <span class="table-text"
        >当前结果：共计<span class="table-flex-text">{{ tables.student }}</span
        >个学员，<span class="table-flex-text">{{ tables.friend }}</span
        >已加好友，<span class="table-flex-text">{{ tables.group }}</span>
        已进微信群</span
      >
      <el-pagination
        class="page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="tables.currentPage"
        :page-size="100"
        layout="prev, pager, next, jumper"
        :total="1000"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'detailsTable',
  props: ['tables'],
  data() {
    return {
      multipleSelection: [],
      index: null
      // tableData: []
    }
  },
  mounted() {},
  created() {
    this.tableData = this.tables.tableData
    // console.log(this.tables.table.tableData, 'this.tables.table.tableData')
    // this.tableData = this.tables.table.tableData
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    onClick(row, column, event) {
      this.index = row.index
      // console.log(row, column, event, index)
    },
    commandFriend(command) {
      const val = {
        command: command,
        index: this.index
      }
      this.$emit('commandFriend', val)
      // this.tableData.friend = command
    },
    onGroup(command) {
      console.log('onGroup', command)
      const val = {
        command: command,
        index: this.index
      }
      this.$emit('onGroup', val)
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex, 'headerCss')
    },
    // 复选框
    handleSelectionChange(val) {
      console.log(val, 'val', this.table)
      this.multipleSelection = val
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.scope-info-box {
  position: relative;
  .scope-info-img {
    display: inline-block;
    height: 50px;
    width: 50px;
  }
  .scope-info-img1 {
    position: absolute;
    left: 26px;
    top: 28px;
    display: inline-block;
    height: 20px;
    width: 20px;
  }
  .info-telephone {
    position: absolute;
    left: 70px;
    top: 0;
  }
  .info-age {
    margin-left: 10px;
  }
  .info-basics {
    margin-left: 10px;
  }
}
.icon-warp {
  margin-left: 10px;
  font-size: 20px;
}
.icon-warps {
  margin-left: -8px;
  font-size: 20px;
}
.table-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  .table-text {
    padding-top: 5px;
    .table-flex-text {
      color: #1e90ff;
    }
  }
  .page {
    padding-top: 5px;
  }
}
</style>
