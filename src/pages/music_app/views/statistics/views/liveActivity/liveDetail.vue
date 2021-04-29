<template>
  <el-row type="flex" class="activity-manage app-main">
    <el-col class="grop-container">
      <div class="scroll-container">
        <div class="detail_box">
          <div
            class="detail_item"
            v-for="(item, index) in showList"
            :key="index"
          >
            <p>{{ item.value + `${item.desc=='直播总时长'?'分钟':'人'}` }}</p>
            <p>{{ item.desc }}</p>
          </div>
        </div>

        <el-scrollbar wrap-class="scrollbar-wrapper">
          <search ref="searchC" @search="getSearchQuery" :key="currentDate" />
          <el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
            <el-tab-pane label="进入过直播学员" name="0"></el-tab-pane>
            <el-tab-pane label="未进入过直播学员" name="1"></el-tab-pane>
          </el-tabs>
          <base-table
            :loading="loading"
            :columns="headers"
            :list="list"
            :total="total"
            :pageNum.sync="tableParam.pageNum"
            :pageSize.sync="tableParam.pageSize"
            @sortChange="sortChange"
            @getList="initData"
            @operateEdit="operateEdit"
            @enterLive="enterLive"
            @discussLive="discussLive"
          ></base-table>
        </el-scrollbar>
      </div>
    </el-col>
    <!-- 进去直播间行为 -->
    <el-dialog
      :title="dia_type == 1 ? '进入直播间行为' : '直播评论'"
      :visible.sync="dialogVisible"
      :width="dia_type == 1 ? '40%' : '20%'"
      :before-close="handleClose"
    >
      <span class="studeng_name">学员:{{ phoneNumber }}</span>
      <base-table
        :loading="loading"
        :columns="headersDialogList"
        :tableHeight="380"
        :list="enterList"
        :total="total"
        :pageNum.sync="tableParam.pageNum"
        :pageSize.sync="tableParam.pageSize"
        @getList="initData"
      ></base-table>
      <el-pagination
        background
        @size-change="handleSizeChangeDialog"
        @current-change="handleCurrentChangeDialog"
        :current-page="1"
        :page-size="10"
        :pager-count="5"
        :total="enterTotal"
      >
      </el-pagination>
    </el-dialog>
  </el-row>
</template>
<script>
import baseTable from '@/components/newTable'
import { copyText, openBrowserTab, formatData } from '@/utils/index'
import search from '../../components/liveDetailSeach'
export default {
  name: 'liveActivityList',
  components: {
    // MPagination,
    baseTable,
    search,
  },
  data() {
    return {
      paramsToSearch: {},
      sortTab: {
        join_date: 'desc',
      },
      activeName: '0',
      dialogVisible: false,
      currentDate: '',
      showList: [],
      headersDialogList: [],
      dia_type: null,
      headersEnter: [
        {
          key: 'seq',
          title: '进入时间',
        },
        {
          key: 'content',
          title: '观看时长',
          width: '150',
        },
        {
          key: 'url',
          title: '是否进入购物袋',
          width: '150',
        },
        {
          key: 'putTime',
          title: '是否点击商品',
          width: '120',
        },
      ],
      headersDiscuss: [
        {
          key: 'chatTime',
          title: '评论时间',
          width: '150',
        },
        {
          key: 'chatContent',
          title: '评论内容',
        },
      ],
      headers: [
        {
          type: 'moreKey',
          key: 'user',
          title: '学员',
          width: '150',
        },
        {
          key: 'teacher_trial',
          type: 'classKey',
          title: '社销老师*体验课班级',
          width: '150',
        },
        {
          key: 'teacher_system',
          type: 'classKey1',
          title: '服务老师*服务班级',
          width: '150',
        },
        {
          key: 'is_in_room_text',
          title: '是否进直播间',
          width: '150',
        },
        {
          key: 'in_room_num',
          // type: 'operate',
          title: '进直播间次数',
          width: '120',
          sort: true,
          operates: [
            {
              emitKey: 'enterLive',
              escape: (row) => {
                return row.in_room_num ? row.in_room_num : '-'
              },
            },
          ],
        },
        {
          key: 'join_at',
          title: '首次进入时间',
          width: '120',
          escape: (row) => {
            return row.join_at ? formatData(row.join_at, 's') : '-'
          },
        },
        {
          key: 'watch_time',
          title: '观看直播总时长',
          width: '150',
          sort: true,
          escape: (row) => {
            return row.watch_time ? row.watch_time : '-'
          },
        },
         {
          key: 'watch_time',
          title: '观看回放总时长',
          width: '150',
          sort: true,
          escape: (row) => {
            return row.watch_time ? row.watch_time : '-'
          },
        },
        {
          key: 'chat_count',
          title: '评论数',
          type: 'operate',
          sort: true,
          operates: [
            {
              emitKey: 'discussLive',
              escape: (row) => {
                return row.chat_count ? row.chat_count : '-'
              },
            },
          ],
        },
        // {
        //   key: 'like_count',
        //   title: '点赞数',
        //   width: '120',
        //   sort: true,
        //   hidden:true,
        //   escape: (row) => {
        //     return row.like_count ? row.like_count : '-'
        //   },
        // },
        {
          key: 'packages_name',
          title: '购买商品',
          escape: (row) => {
            return row.packages_name ? row.packages_name : '-'
          },
        },
        // {
        //   key: 'push_terminal',
        //   title: '进入终端',
        //   hidden:true,
        //   escape: (row) => {
        //     return row.live ? row.live.push_terminal : '-'
        //   },
        // },
        {
          key: 'user_status',
          title: '系统课转化',
          escape: (row) => {
            switch (+row.user_status) {
              case 0:
              case 1:
              case 2:
                return '未转化'
                break
              case 3:
              case 4:
                return '已购月课'
                break
              case 5:
              case 6:
              case 7:
                return '已购年课'
                break
              case 8:
                return '注销失效'
                break
              case 9:
              case 10:
                return '已购季度课'
                break
              case 11:
              case 12:
                return '已购半年课'
                break
            }
          },
        },
        {
          type: 'operate',
          title: '操作',
          operates: [
            {
              emitKey: 'operateEdit',
              escape: (row) => {
                return row.user && row.user.id ? '详情' : '-'
              },
            },
          ],
        },
      ],
      // 总页数
      totalPages: 1,
      total: 0, // 总条数
      enterTotal: 0,
      // 当前页数
      tableParam: {
        pageNum: 1, // 页码
        pageSize: 10, // 页长
        activityId: this.$route.query.activityId,
        userId: null,
      },
      loading: false,
      phoneNumber: '-',
      // 订单列表
      list: [],
      enterList: [],
      activityId: this.$route.query.activityId,
    }
  },
  mounted() {
    this.initCount()
    this.initData()
  },
  watch: {
    paramsToSearch() {
      this.initData()
    },
  },
  methods: {
    async initData(page = 1, sort) {
      this.sortTab = Object.assign(this.sortTab, sort)
      this.paramsToSearch = Object.assign(this.paramsToSearch, {
        act_id: this.activityId,
      })
      let result = await this.$http.liveBroadcast.ActivityUserStatisticsPage(
        this.paramsToSearch,
        page,
        this.sortTab
      )
      let list = result.data.ActivityUserStatisticsPage.content
      if (list) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].team) {
            list[i].team.team_name = list[i].team.team_name.replace(/S/g, 'M')
          }
        }
        this.list = list
        this.total = Number(
          result.data.ActivityUserStatisticsPage.totalElements
        )
      }
    },
    // 进直播间次数
    async initEnter() {
      let result = await this.$http.liveBroadcast.liveBroadcastChatList(
        this.tableParam
      )
      if (result.code == 0) {
        this.enterList = result.payload.content
        this.enterTotal = Number(result.payload.totalElements)
      }
    },
    async initCount() {
      let params = {
        activityId: this.activityId,
      }
      let result = await this.$http.liveBroadcast.liveBroadcastActivityDetailCountDetail(
        params
      )
      if (result.status == 'OK') {
        this.showList = result.payload
      }
    },
    sortChange() {},
    // 编辑
    operateEdit(row) {
      let id = row.user.id
      openBrowserTab(`/music_app/#/details/${id}`)
    },
    getSearchQuery(res) {
      this.paramsToSearch = res
    },
    handleClose(done) {
      done()
    },
    enterLive(row) {
      this.phoneNumber = row.user.mobile
      this.dialogVisible = true
      this.dia_type = 1
      this.headersDialogList = this.headersEnter
    },
    discussLive(row) {
      this.phoneNumber = row.user.mobile
      this.tableParam.userId = row.user.id
      this.dialogVisible = true
      this.dia_type = 2
      this.headersDialogList = this.headersDiscuss
      this.initEnter()
    },
    getOrderSearch() {},
    // 订单列表
    async getOrderList(page = this.currentPage, status) {
      this.loading = true
      const queryObj = {}
    },
    handleClick(tab) {
      if (tab == 0) {
        this.paramsToSearch.in_room_num = { gt: 0 }
      } else if (tab == 1) {
        this.paramsToSearch.in_room_num = 0
      }
      this.initData()
    },
    handleSizeChangeDialog() {},
    handleCurrentChangeDialog(val) {
      this.tableParam.pageNum = val
      this.initEnter()
    },
  },
}
</script>
<style lang="scss" scoped>
.search-section {
  position: relative;
  ::v-deep .el-icon-search {
    top: 14px;
  }
}
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
      .form_search {
        padding: 10px 0 0 10px;
      }
      .el-scrollbar {
        flex: 1;
      }
    }

    .detail_box {
      display: flex;
      margin: 30px 50px 10px;
      padding: 30px 0;
      box-shadow: 0 1px 10px #dedede;
      border-radius: 10px;
      justify-content: space-around;
      .detail_item {
        text-align: center;
      }
    }
    p:nth-child(1) {
      font-size: 22px;
    }
    p:nth-child(2) {
      margin-top: 20px;
    }
  }
}
.studeng_name {
  color: #000;
  font-size: 16px;
  display: flex;
  padding-bottom: 10px;
  border-bottom: 1px solid #dedede;
}
.elard {
  border: none;
  margin-top: 5px;
}
/deep/.el-form-item {
  margin-top: 10px;
}
/deep/ .el-dialog__body {
  padding-top: 0 !important;
  padding-bottom: 20px !important;
}
/deep/ .el-pagination__jump {
  display: none !important;
}
/deep/ .el-pagination {
  margin-top: 10px;
}
/deep/ .el-tabs__nav-scroll {
  padding-left: 30px;
}
</style>