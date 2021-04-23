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
          <!-- <el-table :data="orderList" v-loading="loading">
            <el-table-column
              label="活动ID"
              prop="user"
              width="150"
              align="center"
            >
            </el-table-column>
            <el-table-column label="直播活动名称" prop="user">
            </el-table-column>
            <el-table-column label="活动开启时间-关闭时间" prop="user">
            </el-table-column>
            <el-table-column label="售卖商品" prop="user"> </el-table-column>
            <el-table-column label="活动覆盖人数" prop="user">
            </el-table-column>
            <el-table-column label="支持终端" prop="user"> </el-table-column>
            <el-table-column label="直播状态"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  type="text"
                  size="small"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table> -->
        </el-scrollbar>
      </div>
      </el-col>
  </el-row>
</template>
<script>
import liveActivityName from '@/components/MSearch/searchItems/liveActivityName'
import selectStartTime from '@/components/MSearch/searchItems/selectStartTime'
// import MPagination from '@/components/MPagination/index.vue'
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
          key: 'seq',
          title: '活动ID',
        },
        {
          key: 'title',
          title: '直播活动名称',
        },
        {
          key: 'content',
          title: '活动开启时间-关闭时间',
          width: '300',
        },
        {
          key: 'url',
          title: '售卖商品',
        },
        {
          key: 'putTime',
          title: '活动覆盖人数',
        },
        {
          key: 'failureTime',
          title: '支持终端',
        },
        {
          key: 'isHomePageShow',
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
                return row.status == '0' ? '查看' : ''
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
      list: [{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
         status:0
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
         status:0
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
         status:0
      },{
         seq:"121323",
         title:"你好嗷嗷",
         content:"2020-11-12",
         url:"你好",
         putTime:"33",
         failureTime:"ios",
         isHomePageShow:true,
         status:0
      }],
    }
  },
  methods: {
    initData() {

    },
    // 查看
    operateEdit() {
      this.$router.push({
        path:'/liveDetail'
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