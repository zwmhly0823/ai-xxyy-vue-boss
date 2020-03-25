<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 14:19:58
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-25 22:10:19
 -->
<template>
  <div>
    <div>
      <div class="tabs-tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="加好友进群" name="group">
            <details-table
              @onCurrentPage="onCurrentPage"
              @commandFriend="onCommandFriend"
              @onGroup="onGroup"
              :tables="table"
              :classId="classId"
              :audioTabs="audioTabs"
            ></details-table>
          </el-tab-pane>
          <el-tab-pane label="物流" name="logistics">
            <details-table
              @onCurrentPage="onCurrentPage"
              :tables="table"
              :audioTabs="audioTabs"
            ></details-table>
          </el-tab-pane>
          <el-tab-pane label="打开APP" name="login"
            ><details-table
              @onCurrentPage="onCurrentPage"
              :tables="table"
              :audioTabs="audioTabs"
            ></details-table
          ></el-tab-pane>
          <el-tab-pane label="参课和完课" name="participateIn"
            ><details-table
              @onCurrentPage="onCurrentPage"
              :tables="table"
              :audioTabs="audioTabs"
            ></details-table
          ></el-tab-pane>
          <el-tab-pane label="作品及点评" name="works"
            ><details-table
              @onCurrentPage="onCurrentPage"
              :tables="table"
              :audioTabs="audioTabs"
            ></details-table
          ></el-tab-pane>
        </el-tabs>
        <!-- <el-input
          class="el-input-search"
          size="mini"
          placeholder="昵称、手机号、微信信息"
          prefix-icon="el-icon-search"
          v-model="input"
          @keyup.enter.native="enter"
        >
        </el-input> -->
      </div>
    </div>
  </div>
</template>
<script>
import detailsTable from './components/detailsTable'
import axios from '@/api/axios'
import { timestamp, GetAgeByBrithday } from '@/utils/index'
import status from '@/utils/status'
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
      type: null,
      input: '',
      audioTabs: '0',
      table: {
        tabs: 0,
        // 表头信息
        tableLabel: [],
        // 列表数据
        tableData: [],
        // 总条数
        totalElements: null,
        // 当前页
        currentPage: 1,
        audioList: [
          // {
          //   // src: require('@/assets/images/shaonian.mp3')
          //   src:
          //     'http://s1.meixiu.mobi/iOSAcc/30b1075beebb7e1debe9e0a67bde7611.aac'
          // },
          // {
          //   src: require('@/assets/images/zuimeideshangkou.mp3')
          // },
          // {
          //   src: require('@/assets/images/shaonian.mp3')
          // },
          // {
          //   src: require('@/assets/images/zuimeideshangkou.mp3')
          // }
        ]
        // audioIndex: 10000
      },
      // tabs标签默认状态
      activeName: 'group',
      tablsName: '',
      codeHandle: {}
    }
  },
  watch: {
    classId(value) {
      // 切换标签 语音停止
      const audios = this.$refs
      const audiosList = Object.values(audios)
      audiosList.forEach((item, index) => {
        item[0].load()
      })
      // this.table.audioIndex = 10000
      this.table.currentPage = 1
      if (value.classId) {
        if (value.classId.team_type === 0) {
          this.type = 'TRAIL'
        } else if (value.classId.team_type === 1) {
          this.type = 'MONTH'
        } else if (value.classId.team_type === 2) {
          this.type = 'YEAR'
        } else {
          this.type = ''
        }
        this.getGroup()
        if (this.tabsName === '加好友进群') {
          setTimeout(() => {
            this.getGroup()
          }, 200)
        } else if (this.tabsName === '物流') {
          setTimeout(() => {
            this.gitLogistics()
          }, 200)
        } else if (this.tabsName === '打开APP') {
          setTimeout(() => {
            this.geiLogin()
          }, 200)
        } else if (this.tabsName === '参课和完课') {
          setTimeout(() => {
            this.getClassCompPage()
          }, 200)
        } else if (this.tabsName === '作品及点评') {
          setTimeout(() => {
            this.getStuComment()
          }, 200)
        }
      } else {
        this.table.tableData = []
      }
    }
  },
  mounted() {
    console.log(status, 'status')
    this.table.tableLabel = [{ label: '购买时间', prop: 'buytime' }]
  },
  methods: {
    // 加好友进群 修改已加好友 已进群 接口
    getCodeHandle() {
      this.$http.User.updateTeamStudent({
        studentId: this.codeHandle.studentId,
        teamId: this.classId.classId.id,
        courseType: this.type,
        addedGroup: this.codeHandle.addedGroup,
        addedWechat: this.codeHandle.addedWechat
      })
        .catch((err) => console.log(err, '修改失败'))
        .then((res) => {
          if (this.codeHandle.type === 'wechat') {
            this.table.tableData[
              this.codeHandle.index
            ].added_wechat = this.codeHandle.command
          } else if (this.codeHandle.type === 'group') {
            this.table.tableData[
              this.codeHandle.index
            ].added_group = this.codeHandle.command
          }
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
    },
    // 加好友进群接口
    getGroup() {
      const querys = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`
      axios
        .post('/graphql/user', {
          query: `{
            userListForTeam(query:${JSON.stringify(querys)} , page: ${
            this.table.currentPage
          }, size: 20) {
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
          // 0 默认 1 男 2 女 3 保密
          // 0 默认  1 无基础  2 一年以下 3 一年以上
          // 0 叉 1 对号
          this.table.totalElements = res.data.userListForTeam.totalElements * 1
          const _data = res.data.userListForTeam.content
          _data.forEach((item) => {
            item.birthday = GetAgeByBrithday(item.birthday)
            if (item.sex === '0') {
              item.sex = '- ·'
            } else if (item.sex === '1') {
              item.sex = '男 ·'
            } else if (item.sex === '2') {
              item.sex = '女 ·'
            } else if (item.sex === '3') {
              item.sex = '保密 ·'
            }
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
            this.table.currentPage
          }, size: 20) {
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
            if (!item.nickname) {
              item.nickname = ''
              item.head = ''
            }
            if (item.product_name) {
              item.product_name = `「${item.product_name}」`
            } else {
              item.product_name = '-'
            }
            if (item.express_status === '0') {
              item.express_status = '已创建无地址'
            } else if (item.express_status === '1') {
              item.express_status = '待发货有地址'
            } else if (item.express_status === '2') {
              item.express_status = '已发货'
            } else if (item.express_status === '3') {
              item.express_status = '已签收'
            } else if (item.express_status === '4') {
              item.express_status = '签收失败'
            } else if (item.express_status === '5') {
              item.express_status = '已退货'
            } else if (item.express_status === '6') {
              item.express_status = '待确认'
            } else if (item.express_status === '7') {
              item.express_status = '无效'
            }
          })
          this.table.tableData = _data
        })
    },
    // 打开APP接口
    geiLogin() {
      const querys = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`
      axios
        .post('/graphql/getClassLogin', {
          query: `{
          stuLoginPage(query:${JSON.stringify(querys)}, page: ${
            this.table.currentPage
          }, size: 20) {
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
              status
              login_time
              express_ctime
              first_login_time
              page_origin
            }
          }
        }`
        })
        .then((res) => {
          this.table.totalElements = res.data.stuLoginPage.totalElements * 1
          const _data = res.data.stuLoginPage.content
          _data.forEach((item) => {
            item.express_ctime = timestamp(item.express_ctime, 6)
            item.first_login_time = timestamp(item.first_login_time, 2)
            if (!item.nickname) {
              item.nickname = ''
              item.head = ''
            }
            if (!item.login_time || item.login_time === '0') {
              item.login_time = '-'
              item.first_login_time = ''
            } else {
              item.first_login_time = `首次登录: ${item.first_login_time}`
            }
            if (item.page_origin === '') {
              item.page_origin = ''
            }
            if (item.status === '0') {
              item.status = '已注册'
            } else if (item.status === '1') {
              item.status = '已体验课'
            } else if (item.status === '2') {
              item.status = '体验完课'
            } else if (item.status === '3') {
              item.status = '已月课'
            } else if (item.status === '4') {
              item.status = '月课完课'
            } else if (item.status === '5') {
              item.status = '已年课'
            } else if (item.status === '6') {
              item.status = '年课完课'
            } else if (item.status === '7') {
              item.status = '年课续费'
            } else if (item.status === '8') {
              item.status = '注销失败'
            } else if (item.status === '9') {
              item.status = '已季课'
            } else if (item.status === '10') {
              item.status = '季课完课'
            } else if (item.status === '11') {
              item.status = '已半年课'
            } else if (item.status === '12') {
              item.status = '半年课完课'
            }
          })
          this.table.tableData = _data
        })
    },
    // 参课和完课接口
    getClassCompPage() {
      const querys = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`
      axios
        .post('/graphql/getClassComplete', {
          query: `{
            getClassCompPage(query:${JSON.stringify(querys)}, page: ${
            this.table.currentPage
          }, size: 20) {
              first
              last
              number
              size
              totalPages
              totalElements
              content {
                mobile
                buy_time
                username
                nickname
                head
                status
                course_id
                course_title
                course_begin_time
                course_current_num
                join_course_state
                join_course_time
                complete_course_state
                complete_course_time
              }
            }
          }`
        })
        .then((res) => {
          // ctime 已参课 utime 完课
          // 0 1 已参加课  1 已完课
          this.table.totalElements = res.data.getClassCompPage.totalElements * 1
          const _data = res.data.getClassCompPage.content
          _data.forEach((item) => {
            if (item.buy_time) {
              item.buy_time = timestamp(item.buy_time, 6)
            } else {
              item.buy_time = '-'
            }
            if (!item.nickname) {
              item.nickname = ''
              item.head = ''
            }
            if (item.course_current_num) {
              item.course_begin_time = timestamp(item.course_begin_time, 7)
              item.course_current_num = `${item.course_current_num}·${item.course_begin_time}`
            } else {
              item.course_current_num = '-'
            }
            if (item.join_course_state) {
              item.join_course_time = timestamp(item.join_course_time, 6)
            } else {
              item.join_course_state = '-'
              item.join_course_time = ''
            }
            if (item.complete_course_state) {
              item.complete_course_time = timestamp(
                item.complete_course_time,
                6
              )
            } else {
              item.complete_course_state = '-'
              item.complete_course_time = ''
            }
            // if (!item.current_lesson) {
            //   item.current_lesson = '-'
            // }
            // if (
            //   item.add_class_status === '0' ||
            //   item.add_class_status === '1'
            // ) {
            //   item.attend_class = '已参课'
            //   item.add_class_ctime = timestamp(item.add_class_ctime, 6)
            // } else {
            //   item.attend_class = '-'
            // }
            // if (item.add_class_status === '1') {
            //   item.finish_class = '已完课'
            //   item.add_class_utime = timestamp(item.add_class_utime, 6)
            // } else {
            //   item.finish_class = '-'
            // }
            // if (item.status === '0') {
            //   item.status = '已注册'
            // } else if (item.status === '1') {
            //   item.status = '已体验课'
            // } else if (item.status === '2') {
            //   item.status = '体验完课'
            // } else if (item.status === '3') {
            //   item.status = '已月课'
            // } else if (item.status === '4') {
            //   item.status = '月课完课'
            // } else if (item.status === '5') {
            //   item.status = '已年课'
            // } else if (item.status === '6') {
            //   item.status = '年课完课'
            // } else if (item.status === '7') {
            //   item.status = '年课续费'
            // } else if (item.status === '11') {
            //   item.status = '已半年课'
            // } else if (item.status === '12') {
            //   item.status = '半年课完课'
            // } else {
            //   item.status = '-'
            // }
          })
          this.table.tableData = _data
        })
    },
    // 作品及点评
    getStuComment() {
      const querys = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`
      axios
        .post('/graphql/getStuComment', {
          query: `{
            getStuCommentPage(query:${JSON.stringify(querys)}, page: ${
            this.table.currentPage
          }, size: 20) {
              first
              last
              number
              size
              totalPages
              totalElements
              content {
                id
                buytime
                team_name
                head
                mobile
                username
                status
                has_comment_ctime
                has_comment_utime
                sound_comment
                sound_comment_second
                nickname
                classTitle
                current_lesson 
                listenInfoArr {
                  works_ctime
                  task_sound 
                  task_video
                  task_video_second
                  task_sound_second
                  task_image
                }
              }
            }
          }`
        })
        .then((res) => {
          // classTitle 课程名字
          // has_listen_comment_ctime  已听点评的时间
          // task_sound 点评的音频
          // task_sound_second 音频多少秒
          const _data = res.data.getStuCommentPage.content
          _data.forEach((item, index) => {
            item.buytime = timestamp(item.buytime, 6)
            item.works_ctime = timestamp(item.works_ctime, 6)
            if (!item.nickname) {
              item.nickname = ''
              item.head = ''
            }
            // if (!item.task_image) {
            //   item.item.task_image = '-'
            //   item.works_ctime = ''
            // }

            // item.audioIndex = 10000
            item.audioList = [
              {
                // src: require('@/assets/images/shaonian.mp3')
                src:
                  'http://s1.meixiu.mobi/iOSAcc/30b1075beebb7e1debe9e0a67bde7611.aac'
              },
              {
                src: require('@/assets/images/zuimeideshangkou.mp3')
              }
            ]
            Number(index) === 1 &&
              (item.audioList = [
                {
                  src: require('@/assets/images/zuimeideshangkou.mp3')
                },
                {
                  src: require('@/assets/images/shaonian.mp3')
                }
              ])
          })
          this.table.tableData = _data
        })
    },
    // 加好友进群 已加好友子组建传值方法
    onCommandFriend(data) {
      this.codeHandle = data
      this.getCodeHandle()
    },
    // 加好友进群 已进群子组建传值方法
    onGroup(data) {
      this.codeHandle = data
      this.getCodeHandle()
    },
    // 播放语音传值
    // onAudioIndex(data) {
    //   this.table.audioIndex = data
    // },
    handleClick(tab, event) {
      this.tabsName = tab.label
      this.table.currentPage = 1
      this.table.tableData = []
      // 切换标签 语音停止
      const audios = this.$refs
      const audiosList = Object.values(audios)
      audiosList.forEach((item, index) => {
        item[0].load()
      })
      // this.table.audioIndex = 10000
      if (tab.index === '0') {
        // 加好友进群
        setTimeout(() => {
          this.getGroup()
        }, 200)
        this.table.tableLabel = [{ label: '购买时间', prop: 'buytime' }]
        this.table.tabs = 0
        this.audioTabs = '0'
      } else if (tab.index === '1') {
        // 物流
        setTimeout(() => {
          this.gitLogistics()
        }, 200)
        this.table.tabs = 1
        this.audioTabs = '1'
      } else if (tab.index === '2') {
        // 登陆
        setTimeout(() => {
          this.geiLogin()
        }, 200)
        this.table.tabs = 2
        this.audioTabs = '2'
      } else if (tab.index === '3') {
        // 参课和完课
        setTimeout(() => {
          this.getClassCompPage()
        }, 200)
        this.table.tabs = 3
        this.audioTabs = '3'
      } else if (tab.index === '4') {
        // 作品及点评
        setTimeout(() => {
          // this.getStuComment()
        }, 200)
        this.table.tabs = 4
        this.audioTabs = '4'
      }
    },
    // 分页
    onCurrentPage(data) {
      this.table.currentPage = data
      if (this.table.tabs === 0) {
        setTimeout(() => {
          this.getGroup()
        }, 200)
      } else if (this.table.tabs === 1) {
        setTimeout(() => {
          this.gitLogistics()
        }, 200)
      } else if (this.table.tabs === 2) {
        setTimeout(() => {
          this.geiLogin()
        }, 200)
      } else if (this.table.tabs === 3) {
        setTimeout(() => {
          this.getClassCompPage()
        }, 200)
      } else if (this.table.tabs === 4) {
        setTimeout(() => {
          this.getStuComment()
        }, 200)
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
  // padding-left: 20px;
  margin-top: 10px;
  position: relative;
  .el-input-search {
    position: absolute;
    top: 5px;
    right: 16px;
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
  .el-tabs__nav {
    padding-left: 16px;
  }
  .el-tabs__nav-wrap::after {
    background-color: #fff !important;
  }
  .el-tabs__active-bar {
    width: 50%;
    top: 34px;
    margin-left: 16px;
  }
  .el-tabs__item {
    color: #999;
  }
  .el-tabs__item.is-active {
    color: #409eff;
  }
}
</style>
