<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-03-16 14:19:58
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-16 20:56:03
 -->
<template>
  <div>
    <div>
      <div class="tabs-tab">
        <el-tabs v-model="activeName" @tab-click="handleClick" width="500">
          <el-tab-pane label="加好友进群" name="group">
            <detailsTable></detailsTable>
          </el-tab-pane>
          <el-tab-pane label="物流" name="logistics">配置管理</el-tab-pane>
          <el-tab-pane label="登陆" name="login">角色管理</el-tab-pane>
          <el-tab-pane label="参课" name="participateIn">角色管理</el-tab-pane>
          <el-tab-pane label="完课" name="finish">角色管理</el-tab-pane>
          <el-tab-pane label="传作品" name="works">角色管理</el-tab-pane>
          <el-tab-pane label="点评" name="comment">角色管理</el-tab-pane>
        </el-tabs>
        <el-input
          class="el-input-search"
          size="mini"
          placeholder="昵称、手机号、微信信息"
          prefix-icon="el-icon-search"
          v-model="input"
          @keyup.enter.native="enter"
        >
        </el-input>
      </div>
    </div>
  </div>
</template>
<script>
import detailsTable from '../components/detailsComponents/detailsTable'
export default {
  components: {
    detailsTable
  },
  data() {
    return {
      group: '10',
      friend: '30',
      student: '60',
      input: '',
      table: {
        tableData: [
          {
            date: '2016-05-03',
            name: '王小虎1',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-08',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-06',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-08',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-06',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-08',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-06',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-08',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-06',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }
        ],
        multipleSelection: [],
        currentPage3: 1
      },
      activeName: 'group'
    }
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    enter(val) {
      console.log(this.input, 'input', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.tabs-tab {
  position: relative;
  .el-input-search {
    position: absolute;
    top: 0;
    right: 0;
    float: right;
    width: 180px;
  }
}
.table-flex {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
}

.el-button--default {
  border-radius: 15px;
}
.div {
  padding-top: 20px;
}
</style>
