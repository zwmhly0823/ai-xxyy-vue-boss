<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 14:19:58
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-20 22:03:49
 -->
<template>
  <div>
    <div>
      <div class="tabs-tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="加好友进群" name="group">
            <details-table
              @commandFriend="onCommandFriend"
              @onGroup="onGroup"
              :tables="table"
            ></details-table>
          </el-tab-pane>
          <el-tab-pane label="物流" name="logistics">
            <details-table :tables="table"></details-table>
          </el-tab-pane>
          <el-tab-pane label="登录" name="login"
            ><details-table :tables="table"></details-table
          ></el-tab-pane>
          <el-tab-pane label="参课和完课" name="participateIn"
            ><details-table :tables="table"></details-table
          ></el-tab-pane>
          <el-tab-pane label="作品及点评" name="works"
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
import axios from '@/api/axios'
import { GetAgeByBrithday } from '@/utils/menuItems'
import { timestamp } from '@/utils/index'
export default {
  components: {
    detailsTable
  },
  props: {
    classId: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      input: '',
      table: {
        tabs: '0',
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
  watch: {
    classId(value) {
      if (value.classId) {
        console.log(value, 'getGroup value')
        this.getGroup() // 加好友进群
      } else {
        this.table.tableData = []
      }
    }
  },
  mounted() {
    this.table.tableLabel = [{ label: '购买时间', prop: 'buytime' }]
    this.table.group = '10'
    this.table.friend = '30'
    this.table.student = '60'
  },
  methods: {
    // 加好友进群接口
    getGroup() {
      const querys = `{"bool":{"must":[{"terms":{"team_id":${this.classId.classId.id}}},{"term":{"team_type":${this.classId.type}}}]}}`
      axios
        .post('/graphql/user', {
          query: `{
            userListForTeam(query:${JSON.stringify(
              querys
            )} , page: 1, size: 20) {
              empty
              first
              last
              number
              size
              numberOfElements
              totalElements
              totalPages
              content {
                id
                nickname
                sex
                birthday
                head
                mobile
                base_painting
                follow
                added_group
                added_wechat
                buytime
              }
            }
          }`
        })
        .then((res) => {
          this.table.tableData = []
          // console.log(res.data.userListForTeam.content, 'getGroupRes')
          // 1男 2 女
          // 0 不显示  1 无基础  2 一年以下 3 一年以上
          // 0 叉 1 对号
          const _data = res.data.userListForTeam.content
          _data.forEach((item) => {
            item.birthday = GetAgeByBrithday(item.birthday)
            item.buytime = timestamp(item.buytime, 6)
            if (item.base_painting === '0') {
              item.base_painting = '-'
            } else if (item.base_painting === '1') {
              item.base_painting = '无基础'
            } else if (item.base_painting === '2') {
              item.base_painting = '一年以下'
            } else if (item.base_painting === '3') {
              item.base_painting = '一年以上'
            }
          })
          this.table.tableData = _data
        })
    },
    // 物流接口
    // gitLogistics() {
    //   const querys = `{"bool":{"must":[{"terms":{"team_id":${this.classId.classId.id}}},{"term":{"team_type":${this.classId.type}}}]}}`
    //   axios
    //     .post('/graphql/express', {
    //       query: `{
    //         stuExpressPage(query:${JSON.stringify(
    //           querys
    //         )} , page: 2, size: 10) {
    //           empty
    //           first
    //           last
    //           number
    //           size
    //           numberOfElements
    //           totalElements
    //           totalPages
    //           content {
    //             id
    //             head
    //             nickname
    //             username
    //             address_detail
    //             province
    //             city
    //             area
    //             express_status
    //             ctime
    //             mobile
    //           }
    //         }
    //       }`
    //     })
    //     .then((res) => {
    //       this.table.tableData = []
    //       console.log(this.table.tableData, '_data121212121')
    //       const _data = res.data.stuExpressPage.content
    //       console.log(_data, '_data')
    //       this.table.tableData = _data
    //     })
    // },
    // 加好友进群 已加好友子组建传值方法
    onCommandFriend(data) {
      this.table.tableData[data.index].added_wechat = data.command
    },
    // 加好友进群 已进群子组建传值方法
    onGroup(data) {
      this.table.tableData[data.index].added_group = data.command
    },
    handleClick(tab, event) {
      if (tab.index === '0') {
        this.table.tableData = []
        // 加好友进群
        this.getGroup()
        // console.log(this.table.tableData, 'this.table.tableData')
        this.table.tableLabel = [{ label: '购买时间', prop: 'buytime' }]
        this.table.group = '10'
        this.table.friend = '30'
        this.table.student = '60'
        this.table.currentPage = 1
        this.table.tabs = 0
      } else if (tab.index === '1') {
        this.table.tableData = []
        // 物流
        // this.gitLogistics()
        console.log('物流')
        console.log(this.table.tableData, 'this.table.tableData112121212')
        this.table.tabs = 1
        // this.table.tableData = [
        //   {
        //     telephone: 13311113333,
        //     time: '2018-07-24',
        //     friend: '已加',
        //     group: '已进',
        //     follow: '已关注',
        //     wechat: 'qwea'
        //   }
        // ]
        this.table.group = '10'
        this.table.friend = '30'
        this.table.student = '60'
        this.table.currentPage = 1
      } else if (tab.index === '2') {
        this.table.tableData = []
        // 登录
        console.log('登录')
        this.table.tabs = 2
        // this.table.tableData = [
        //   {
        //     telephone: 13311113333,
        //     time: '2018-07-24',
        //     friend: '已加',
        //     group: '已进',
        //     follow: '已关注',
        //     wechat: 'qwea'
        //   }
        // ]
        this.table.group = '10'
        this.table.friend = '30'
        this.table.student = '60'
        this.table.currentPage = 1
      } else if (tab.index === '3') {
        this.table.tableData = []
        // 参课和完课
        console.log('参课和完课')
        this.table.tabs = 3
        // this.table.tableData = [
        //   {
        //     telephone: 13311113333,
        //     time: '2018-07-24',
        //     friend: '已加',
        //     group: '已进',
        //     follow: '已关注',
        //     wechat: 'qwea'
        //   }
        // ]
        this.table.group = '10'
        this.table.friend = '30'
        this.table.student = '60'
        this.table.currentPage = 1
      } else if (tab.index === '4') {
        this.table.tableData = []
        // 作品及点评
        console.log('作品及点评')
        this.table.tabs = 4
        // this.table.tableData = [
        //   {
        //     telephone: 13311113333,
        //     time: '2018-07-24',
        //     friend: '已加',
        //     group: '已进',
        //     follow: '已关注',
        //     wechat: 'qwea'
        //   }
        // ]
        this.table.group = '10'
        this.table.friend = '30'
        this.table.student = '60'
        this.table.currentPage = 1
      }
      // console.log(tab, event, tab.index, tab.label)
    },
    enter(val) {
      console.log('input', val, this.input)
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
    right: 10px;
    float: right;
    width: 180px;
  }
  .el-tabs__nav-scroll {
    background: #fff;
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
<style lang="scss">
.tabs-tab {
  .el-tabs__nav-scroll {
    padding-left: 10px !important;
    background: #fff !important;
  }
}
</style>
