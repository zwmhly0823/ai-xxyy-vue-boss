<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 14:19:58
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-18 20:19:51
 -->
<template>
  <div>
    <div>
      <div class="tabs-tab">
        <el-tabs v-model="activeName" @tab-click="handleClick" width="500">
          <el-tab-pane label="加好友进群" name="group">
            <group-table
              @func="getMsgFormSon"
              @onGroup="onGroup"
              :tables="table"
            ></group-table>
          </el-tab-pane>
          <el-tab-pane label="物流" name="logistics">
            <details-table :tables="table"></details-table>
          </el-tab-pane>
          <el-tab-pane label="登陆" name="login"
            ><details-table :tables="table"></details-table
          ></el-tab-pane>
          <el-tab-pane label="参课" name="participateIn"
            ><details-table :tables="table"></details-table
          ></el-tab-pane>
          <el-tab-pane label="完课" name="finish"
            ><details-table :tables="table"></details-table
          ></el-tab-pane>
          <el-tab-pane label="传作品" name="works"
            ><details-table :tables="table"></details-table
          ></el-tab-pane>
          <el-tab-pane label="点评" name="comment"
            ><details-table :tables="table"></details-table
          ></el-tab-pane>
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
import detailsTable from './components/detailsTable'
import groupTable from './components/groupTable'
export default {
  components: {
    detailsTable,
    groupTable
  },
  data() {
    return {
      input: '',
      table: {
        tabs: '',
        // 表头信息
        tableLabel: [],
        // 列表数据
        tableData: [],
        group: '10',
        friend: '30',
        student: '60',
        currentPage: 1
      },
      // tabs标签默认状态
      activeName: 'group'
    }
  },
  mounted() {
    this.table.tableLabel = [{ label: '购买时间', prop: 'time' }]
    this.table.tableData = [
      {
        img: require('@/assets/images/character.png'),
        sex: '男',
        telephone: 13311113333,
        age: '2岁5个月',
        basics: '无基础',
        time: '2018-07-24',
        friend: '1',
        group: '1',
        follow: '已关注'
      },
      {
        img: require('@/assets/images/character.png'),
        sex: '男',
        telephone: 13311113333,
        age: '2岁67个月',
        basics: '无基础',
        time: '2018-07-24',
        friend: '2',
        group: '2',
        follow: '已关注'
      },
      {
        img: require('@/assets/images/character.png'),
        sex: '男',
        telephone: 13311113333,
        age: '2岁11个月',
        basics: '无基础',
        time: '2018-07-24',
        friend: '1',
        group: '1',
        follow: '已关注'
      }
    ]
    this.table.group = '10'
    this.table.friend = '30'
    this.table.student = '60'
    this.table.currentPage = 1
  },
  methods: {
    getMsgFormSon(data) {
      this.table.tableData[data.index].friend = data.command
    },
    onGroup(data) {
      this.table.tableData[data.index].group = data.command
    },
    handleClick(tab, event) {
      if (tab.index === '0') {
        console.log('加好友进群')
        this.table.tableLabel = [{ label: '购买时间', prop: 'time' }]
        this.table.tableData = [
          {
            img: require('@/assets/images/character.png'),
            sex: '男',
            telephone: 13311113333,
            age: '2岁5个月',
            basics: '无基础',
            time: '2018-07-24',
            friend: '1',
            group: '1',
            follow: '已关注'
          },
          {
            img: require('@/assets/images/character.png'),
            sex: '男',
            telephone: 13311113333,
            age: '2岁67个月',
            basics: '无基础',
            time: '2018-07-24',
            friend: '2',
            group: '2',
            follow: '已关注'
          },
          {
            img: require('@/assets/images/character.png'),
            sex: '男',
            telephone: 13311113333,
            age: '2岁11个月',
            basics: '无基础',
            time: '2018-07-24',
            friend: '1',
            group: '1',
            follow: '已关注'
          }
        ]
        this.table.group = '10'
        this.table.friend = '30'
        this.table.student = '60'
        this.table.currentPage = 1
      } else if (tab.index === '1') {
        console.log('物流')
        this.table.tabs = 1
        this.table.tableLabel = [
          { label: '订单号', prop: 'telephone' },
          { label: '物流地址', prop: 'time' },
          { label: '物流详情', prop: 'friend' },
          { label: '收货人', prop: 'group' },
          { label: '手机号', prop: 'follow' },
          { label: '地址详情', prop: 'wechat' }
        ]
        this.table.tableData = [
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          }
        ]
        this.table.group = '10'
        this.table.friend = '30'
        this.table.student = '60'
        this.table.currentPage = 1
      } else if (tab.index === '2') {
        console.log('登陆')
        this.table.tabs = 2
        this.table.tableLabel = [
          { label: '注册账号', prop: 'telephone' },
          { label: '是否登陆', prop: 'time' },
          { label: '是否有app', prop: 'friend' },
          { label: '姓名', prop: 'group' },
          { label: '手机号', prop: 'follow' }
        ]
        this.table.tableData = [
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          }
        ]
        this.table.group = '10'
        this.table.friend = '30'
        this.table.student = '60'
        this.table.currentPage = 1
      } else if (tab.index === '3') {
        console.log('参课')
        this.table.tabs = 3
        this.table.tableLabel = [
          { label: '参加课程', prop: 'telephone' },
          { label: '购买时间', prop: 'time' },
          { label: '课程进度', prop: 'friend' },
          { label: '姓名', prop: 'group' },
          { label: '手机号', prop: 'follow' },
          { label: '微信信息', prop: 'wechat' }
        ]
        this.table.tableData = [
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          }
        ]
        this.table.group = '10'
        this.table.friend = '30'
        this.table.student = '60'
        this.table.currentPage = 1
      } else if (tab.index === '4') {
        console.log('完课')
        this.table.tabs = 4
        this.table.tableLabel = [
          { label: '姓名', prop: 'telephone' },
          { label: '购买时间', prop: 'time' },
          { label: '完课时间', prop: 'friend' },
          { label: '手机号', prop: 'group' }
        ]
        this.table.tableData = [
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          }
        ]
        this.table.group = '10'
        this.table.friend = '30'
        this.table.student = '60'
        this.table.currentPage = 1
      } else if (tab.index === '5') {
        console.log('传作品')
        this.table.tabs = 5
        this.table.tableLabel = [
          { label: '姓名', prop: 'telephone' },
          { label: '手机号', prop: 'time' },
          { label: '作品名称', prop: 'friend' },
          { label: '学员老师', prop: 'group' },
          { label: '作品简介', prop: 'follow' }
        ]
        this.table.tableData = [
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          }
        ]
        this.table.group = '10'
        this.table.friend = '30'
        this.table.student = '60'
        this.table.currentPage = 1
      } else if (tab.index === '6') {
        console.log('点评')
        this.table.tabs = 6
        this.table.tableLabel = [
          { label: '学员姓名', prop: 'telephone' },
          { label: '作业名称', prop: 'time' },
          { label: '老师点评', prop: 'friend' },
          { label: '点评详情', prop: 'group' }
        ]
        this.table.tableData = [
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          },
          {
            telephone: 13311113333,
            time: '2018-07-24',
            friend: '已加',
            group: '已进',
            follow: '已关注',
            wechat: 'qwea'
          }
        ]
        this.table.group = '10'
        this.table.friend = '30'
        this.table.student = '60'
        this.table.currentPage = 1
      }
      // console.log(tab, event, tab.index, tab.label)
    },
    enter(val) {
      console.log('input', val)
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
