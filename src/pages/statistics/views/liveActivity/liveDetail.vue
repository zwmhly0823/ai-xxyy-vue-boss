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
            <p>{{ item.num }}</p>
            <p>{{ item.title }}</p>
          </div>
        </div>

        <el-scrollbar wrap-class="scrollbar-wrapper">
          <search
            ref="searchC"
            @search="getSearchQuery"
            :key="currentDate"
            :paramsToSearch="paramsToSearch"
          />
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
import baseTable from '@/components/newTable'
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
      currentDate: '',
      showList: [
        {
          title: '活动覆盖人数',
          num: '100人',
        },
        {
          title: '活动覆盖人数',
          num: '100人',
        },
        {
          title: '活动覆盖人数',
          num: '100人',
        },
        {
          title: '活动覆盖人数',
          num: '100人',
        },
        {
          title: '活动覆盖人数',
          num: '100人',
        },
        {
          title: '活动覆盖人数',
          num: '100人',
        },
        {
          title: '活动覆盖人数',
          num: '100人',
        },
        {
          title: '活动覆盖人数',
          num: '100人',
        },
        {
          title: '活动覆盖人数',
          num: '100人',
        },
      ],
      headers: [
        {
          key: 'seq',
          title: '学员',
        },
        {
          key: 'title',
          title: '社销老师*体验课班级',
          width: '150',
        },
        {
          key: 'content',
          title: '服务老师*服务班级',
          width: '150',
        },
        {
          key: 'url',
          title: '是否进直播间',
          width: '150',
        },
        {
          key: 'putTime',
          title: '进直播间次数',
          width: '120',
          sort:true,
        },
        {
          key: 'failureTime',
          title: '进直播间时机',
          width: '120',
        },
        {
          key: 'failureTime',
          title: '首次进入时间',
          width: '120',
        },
        {
          key: 'failureTime',
          title: '观看直播总时长',
          width: '150',
          sort:true,
        },
        {
          key: 'failureTime',
          title: '观看回放总时长',
          width: '150',
          sort:true,
        },
        
        {
          key: 'failureTime',
          title: '评论数',
          sort:true,
        },
        {
          key: '点赞数',
          title: '首次进入时间',
          width: '120',
          sort:true,
        },
        {
          key: 'failureTime',
          title: '进入购物袋',
        },
        {
          key: 'failureTime',
          title: '查看商品',
        },
        {
          key: 'failureTime',
          title: '购买商品',
        },
        {
          key: 'failureTime',
          title: '进入终端',
        },
        {
          key: 'failureTime',
          title: '系统课转化',
        },

        {
          type: 'operate',
          title: '操作',
          operates: [
            {
              emitKey: 'operateEdit',
              escape: (row) => {
                return row.status == '0' ? '详情' : ''
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
      list: [
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
          status: 0,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
          status: 0,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
          status: 0,
        },
        {
          seq: '121323',
          title: '你好嗷嗷',
          content: '2020-11-12',
          url: '你好',
          putTime: '33',
          failureTime: 'ios',
          isHomePageShow: true,
          status: 0,
        },
      ],
    }
  },
  methods: {
    initData() {},
    // 编辑
    operateEdit() {},
    getSearchQuery(res) {
      this.search = res
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

    .detail_box {
      display: flex;
      margin: 30px 50px 10px;
      padding: 30px 0;
      border: 2px solid #dedede;
      border-radius: 10px;
      justify-content: space-around;
      .detail_item {
        text-align: center;
      }
    }
    p:nth-child(2) {
      margin-top: 20px;
    }
  }
}
.elard {
  border: none;
  margin-top: 5px;
}
/deep/.el-form-item {
  margin-top: 10px;
}
</style>