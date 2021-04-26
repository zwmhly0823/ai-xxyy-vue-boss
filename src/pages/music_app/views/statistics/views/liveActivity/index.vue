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
                  :name="name"
                  @result="getOrderSearch"
                />
              </el-form-item>
              <el-form-item label="直播开启时间:">
                <selectStartTime
                  class="allmini"
                  :name="name"
                  @result="getOrderSearch"
                />
              </el-form-item>
            </el-form>
          </div>
          <base-table
            :loading="loading"
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
          type:"arr",
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
            return row.isHomePageShow ? '是' : '否'
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
      name: '123',
      // 总页数
      totalPages: 1,
      total: 0, // 总条数
      // 当前页数
      tableParam: {
        pageNum: 1, // 页码
        pageSize: 10, // 页长
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
    async initData() {
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
    getOrderSearch() {},
    // 点击分页
    handleSizeChange(val) {
      this.currentPage = val
    },
    // 订单列表
    async getOrderList(page = this.currentPage, status) {
      this.loading = true
      const queryObj = {}
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