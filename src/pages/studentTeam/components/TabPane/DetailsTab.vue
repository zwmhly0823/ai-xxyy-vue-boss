<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 14:19:58
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-21 15:40:51
 -->
<template>
  <div>
    <div>
      <div class="tabs-tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="加好友进群" name="group">
            <details-table
              @onTotalPages="onTotalPages"
              @commandFriend="onCommandFriend"
              @onGroup="onGroup"
              :tables="table"
            ></details-table>
          </el-tab-pane>
          <el-tab-pane label="物流" name="logistics">
            <details-table :tables="table"></details-table>
          </el-tab-pane>
          <el-tab-pane label="登陆" name="login"
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
        // 总条数
        totalElements: null,
        // 当前页
        totalPages: 1
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
      }
    }
  },
  mounted() {
    this.table.tableLabel = [{ label: '购买时间', prop: 'buytime' }]
  },
  methods: {
    // 加好友进群接口
    getGroup() {
      const querys = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`
      axios
        .post('/graphql/user', {
          query: `{
            userListForTeam(query:${JSON.stringify(querys)} , page: ${
            this.table.totalPages
          }, size: 10) {
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
                added_wechat_time
                added_group_time
                follow_time
              }
            }
          }`
        })
        .then((res) => {
          this.table.tableData = []
          // 1男 2 女
          // 0 不显示  1 无基础  2 一年以下 3 一年以上
          // 0 叉 1 对号
          this.table.totalElements = res.data.userListForTeam.totalElements * 1
          // this.table.totalPages = res.data.userListForTeam.totalPages * 1
          const _data = res.data.userListForTeam.content
          _data.forEach((item) => {
            item.birthday = GetAgeByBrithday(item.birthday)
            // const birthday = item.birthday.substring(0, 2)
            // console.log(birthday, 'birthdaybirthdaybirthdaybirthday')
            if (item.birthday.indexOf(50) !== -1) {
              item.birthday = '-'
            }
            item.buytime = timestamp(item.buytime, 6)
            item.added_wechat_time = timestamp(item.added_wechat_time, 6)
            item.added_group_time = timestamp(item.added_group_time, 6)
            item.follow_time = timestamp(item.follow_time, 6)
            if (item.base_painting === '0') {
              item.base_painting = ' '
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
    gitLogistics() {
      const querys = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`
      axios
        .post('/graphql/express', {
          query: `{
            stuExpressPage(query:${JSON.stringify(querys)} , page: ${
            this.table.totalPages
          }, size: 10) {
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
                head
                nickname
                username
                address_detail
                province
                city
                area
                express_status
                ctime
                mobile
                receipt_tel
                receipt_name
                product_name
              }
            }
          }`
        })
        .then((res) => {
          this.table.tableData = []
          this.table.totalElements = res.data.stuExpressPage.totalElements * 1
          const _data = res.data.stuExpressPage.content
          _data.forEach((item) => {
            item.ctime = timestamp(item.ctime, 6)
            if (item.nickname === '') {
              item.nickname = ''
            } else {
              item.nickname = `微信昵称: ${item.nickname}`
            }
            if (item.express_status === '1') {
              item.express_status = '未发货'
            } else if (
              item.express_status === '2' ||
              item.express_status === '3'
            ) {
              item.express_status = '已发货'
            } else if (item.express_status === '5') {
              item.express_status = '已签收'
            }
          })
          this.table.tableData = _data
          console.log(this.table.tableData, 'this.table.tableData112121212')
        })
    },
    // 登陆接口
    geiLogin() {
      const querys = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`
      axios
        .post('/graphql/getClassLogin', {
          query: `{
          stuLoginPage(query:${JSON.stringify(querys)}, page: ${
            this.table.totalPages
          }, size: 10) {
            first
            last
            number
            size
            totalPages
            totalElements
            content {
              id
              head
              username
              nickname
              ctime
              mobile
              login_time
              express_ctime
              first_login_time
              page_origin
            }
          }
        }`
        })
        .then((res) => {
          console.log(res, 'login res')
          const _data = res.data.stuLoginPage.content
          _data.forEach((item) => {
            item.express_ctime = timestamp(item.express_ctime, 6)
            item.ctime = timestamp(item.ctime, 2)
            if (item.nickname === '') {
              item.nickname = ''
            } else {
              item.nickname = `微信昵称: ${item.nickname}`
            }
            if (item.page_origin === '') {
              item.page_origin = ''
            }
          })
          this.table.tableData = _data
        })
    },
    // 加好友进群 已加好友子组建传值方法
    onCommandFriend(data) {
      this.table.tableData[data.index].added_wechat = data.command
    },
    // 加好友进群 已进群子组建传值方法
    onGroup(data) {
      this.table.tableData[data.index].added_group = data.command
    },
    handleClick(tab, event) {
      // this.table.totalElements = []
      this.table.tableData = []
      if (tab.index === '0') {
        // 加好友进群
        this.getGroup()
        // console.log(this.table.tableData, 'this.table.tableData')
        this.table.tableLabel = [{ label: '购买时间', prop: 'buytime' }]
        this.table.tabs = 0
      } else if (tab.index === '1') {
        // 物流
        this.gitLogistics()
        this.table.tabs = 1
      } else if (tab.index === '2') {
        // 登陆
        this.geiLogin()
        console.log('登陆')
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
      } else if (tab.index === '3') {
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
      } else if (tab.index === '4') {
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
      }
      // console.log(tab, event, tab.index, tab.label)
    },
    onTotalPages(data) {
      this.table.totalPages = data
      if (this.table.tabs === '0') {
        this.getGroup()
      } else if (this.table.tabs === '1') {
        this.gitLogistics()
      } else if (this.table.tabs === '2') {
      } else if (this.table.tabs === '3') {
      } else if (this.table.tabs === '4') {
      }
      var dom = document.getElementById('right-scroll')
      dom.querySelector('.scrollbar-wrapper').scrollTo(0, 0)
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
