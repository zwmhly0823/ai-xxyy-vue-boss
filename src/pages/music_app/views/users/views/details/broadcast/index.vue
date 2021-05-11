<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-19 21:41:12
-->
<template>
  <div class="logistics">
    <el-radio-group
      v-model="changeType"
      size="mini"
      style="margin-bottom: 10px"
    >
      <el-radio-button :label="-1">全部</el-radio-button>
      <el-radio-button :label="1">进入直播间</el-radio-button>
      <el-radio-button :label="0">未进入直播间</el-radio-button>
    </el-radio-group>
    <!-- 数据table -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="act_id" label="活动ID"></el-table-column>
      <el-table-column prop="live" label="直播活动名称">
        <template slot-scope="scope">
          {{ scope.row.live ? scope.row.live.live_name : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="live" label="活动开启时间">
        <template slot-scope="scope">
          {{ scope.row.live ? formatTime(scope.row.live.open_time) : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="is_in_room_text" label="进入直播间">
        <template slot-scope="scope">
          {{ scope.row.is_in_room_text }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="addTime" label="进入直播时机"></el-table-column> -->
      <el-table-column prop="first_join_time" label="首次进入时间">
        <template slot-scope="scope">
          {{
            scope.row.first_join_time && scope.row.first_join_time !=0
              ? formatTime(scope.row.first_join_time * 1000)
              : '-'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="live_watch_time"
        label="观看直播总时长/分钟"
      ></el-table-column>
      <!-- <el-table-column prop="addTime" label="观看回放总时长"></el-table-column> -->
      <el-table-column prop="chat_count" label="评论数"></el-table-column>
      <!-- <el-table-column prop="like_count" label="点赞数">
        <template slot-scope="scope">
          {{ scope.row.like_count ? scope.row.like_count : '-' }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="addTime" label="进入购物袋"></el-table-column> -->
      <!-- <el-table-column prop="addTime" label="查看商品"></el-table-column> -->
      <el-table-column prop="by_shop_flag" label="购买商品">
        <template slot-scope="scope">
          {{ scope.row.packages_name  ? scope.row.packages_name : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="live" label="进入终端">
        <template slot-scope="scope">
          {{ scope.row.live &&  scope.row.live.push_terminal? scope.row.live.push_terminal : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="user_status" label="系统课转化">
        <template slot-scope="scope">
          {{ transformStatus(scope.row.user_status) }}
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination_lk">
      <el-pagination
        layout="prev,pager,next,total"
        :page-size="listQuery.pageSize"
        :total="listQuery.totalElements"
        :current-page="listQuery.currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'broadcast',
  components: {},
  mounted() {
    const { id } = this.$route.params
    this.uid = id
    this.getActiveList()
  },
  data() {
    return {
      uid: '',
      in_room_num: undefined,
      changeType: -1,
      tableData: [],
      listQuery: {
        currentPage: 1,
        totalElements: 0,
        totalPages: 0,
        pageSize: 20,
        pageSizeArr: [20, 50, 100, 200, 500],
      },
    }
  },
  methods: {
    formatTime(str) {
      return moment(str * 1).format('YYYY-MM-DD HH:mm:ss')
    },
    transformStatus(val) {
      switch (+val) {
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
    getActiveList(
      page = this.listQuery.currentPage,
      size = this.listQuery.pageSize
    ) {
      Object.assign(this.listQuery, {
        currentPage: page,
        pageSize: size,
      })

      this.loading = true
      const params = {}
      Object.assign(params, { uid: this.uid, in_room_num: this.in_room_num })
      this.$http.liveBroadcast
        .getActiveList(params, {
          page,
          size,
        })
        .then((res) => {
          const { content = [], totalElements = 0, totalPages = 0 } =
            res?.data?.ActivityUserStatisticsPage || {}
          // this.tableData = this.formatUserData(content)
          this.tableData = content
          Object.assign(this.listQuery, {
            totalElements: +totalElements,
            totalPages: +totalPages,
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 翻页
    handleCurrentChange(val) {
      this.listQuery.currentPage = val
      this.getActiveList()
    },
  },
  watch: {
    changeType(newVal, oldVal) {
      if (newVal === -1) {
        this.in_room_num = undefined
        this.getActiveList()
      } else if (newVal === 0) {
        this.in_room_num = 0
        this.getActiveList()
      } else if (newVal === 1) {
        this.in_room_num = { gt: 0 }
        this.getActiveList()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.logistics {
  padding: 10px;
  // color: #5ea0f5;
  // text-decoration: underline;
  // cursor: pointer;
}
.pagination_lk {
  width: 100%;
  height: 40px;
  background-color: #fff;
  position: fixed;
  right: 0px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
