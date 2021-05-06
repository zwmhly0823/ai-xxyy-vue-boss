<template>
  <el-row type="flex" class="activity-manage app-main">
    <el-col class="grop-container">
      <div class="scroll-container">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="form_search">
            <el-form :inline="true" label-position="right" label-width="100px">
              <el-form-item label="直播活动名称:">
                <liveActivityName
                  class="allmini"
                  name="activityId"
                  @result="getOrderSearch"
                />
              </el-form-item>
              <el-form-item label="直播开启时间:">
                <selectStartTime
                  class="allmini"
                  name="openTime"
                  @result="getOrderSearch"
                />
              </el-form-item>
            </el-form>
          </div>
          <base-table
            :loading="loading"
            :tableHeight="680"
            :columns="headers"
            :list="list"
            :total="total"
            :pageNum.sync="tableParam.pageNum"
            :pageSize.sync="tableParam.pageSize"
            @getList="initData"
            @operateEdit="operateEdit"
          ></base-table>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>
<script>
let liveStatusLabel = {
  0:'--',
  1: '直播中',
  2: '预告',
  3: '回放',
  4: '结束',
  5: '关闭',
}
import liveActivityName from '@/components/MSearch/searchItems/liveActivityName'
import selectStartTime from '@/components/MSearch/searchItems/selectStartTime'
import baseTable from '@/components/newTable'
export default {
  name: 'liveActivityList',
  components: {
    liveActivityName,
    selectStartTime,
    // MPagination,
    baseTable,
  },
  data() {
    return {
      headers: [
        {
          key: 'activityId',
          title: '活动ID',
        },
        {
          key: 'liveName',
          title: '直播活动名称',
        },
        {
          key: 'timeRange',
          title: '活动开启时间-关闭时间',
          width: '300',
        },
        {
          type: 'arr',
          key: 'goodsInfos',
          title: '售卖商品',
        },
        {
          key: 'activityCoverNum',
          title: '活动覆盖人数',
        },
        {
          key: 'supportTerminal',
          title: '支持终端',
        },
        {
          key: 'liveStatus',
          title: '直播状态',
          escape: (row) => {
            return liveStatusLabel[row.liveStatus]
          },
        },
        {
          type: 'operate',
          title: '操作',
          operates: [
            {
              emitKey: 'operateEdit',
              escape: (row) => {
                return '查看'
              },
            },
          ],
        },
      ],
      // 总页数
      totalPages: 1,
      total: 0, // 总条数
      // 当前页数
      tableParam: {
        pageNum: 1, // 页码
        pageSize: 20, // 页长
      },
      loading: false,
      // 订单列表
      list: [],
    }
  },

  mounted() {
    this.initData()
  },
  methods: {
    async initData(page) {
      if (page) {
        this.tableParam.pageNum = page
      }
      let result = await this.$http.liveBroadcast.liveBroadcastActivityList(
        this.tableParam
      )
      if (result.code == 0) {
        this.list = result.payload.content
        this.total = Number(result.payload.totalElements)
      }
    },
    // 查看
    operateEdit(row) {
      let activityId = row.activityId
      this.$router.push({
        path: '/liveDetail',
        query: {
          activityId: activityId,
        },
      })
    },
    // 获取直播活动名称
    getOrderSearch(data) {
      this.tableParam = Object.assign(this.tableParam, data)
      this.initData()
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
  }
}
.elard {
  border: none;
  margin-top: 5px;
}
</style>