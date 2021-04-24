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
            @sortChange="sortChange"
            @getList="initData"
            @StudentJump="StudentJump"
            @operateEdit="operateEdit"
            @experienceClass="experienceClass"
            @serviceClass="serviceClass"
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
      <span>学员:18910275255</span>
      <base-table
        :loading="loading"
        :columns="headersDialogList"
        :tableHeight="380"
        :list="list"
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
        :pager-count="4"
        :total="40"
      >
      </el-pagination>
    </el-dialog>
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
      dialogVisible: false,
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
      headersDialogList: [],
      dia_type: null,
      headersEnter: [
        {
          key: 'seq',
          title: '进入时间',
        },
        {
          key: 'title',
          title: '进入时机',
          width: '150',
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
          key: 'seq',
          title: '评论时间',
          width: '120',
        },
        {
          key: 'title',
          title: '评论内容',
        },
      ],
      headers: [
        {
          type: 'operate',
          key: 'seq',
          title: '学员',
          slot:"slot",
          operates: [
            {
              emitKey: 'StudentJump',
              escape: (row) => {
                return row.status == '0' ? '详情<h1>123123123123</h1>' : '18910275255'
              },
            },
          ],
        },
        {
          key: 'title',
          type: 'operate',
          title: '社销老师*体验课班级',
          width: '150',
          operates: [
            {
              emitKey: 'experienceClass',
              escape: (row) => {
                return '2020M1体验课'
              },
            },
          ],
        },
        {
          key: 'content',
          type: 'operate',
          title: '服务老师*服务班级',
          width: '150',
          operates: [
            {
              emitKey: 'serviceClass',
              escape: (row) => {
                return '2020M1体验课'
              },
            },
          ],
        },
        {
          key: 'url',
          title: '是否进直播间',
          width: '150',
        },
        {
          key: 'putTime',
          type: 'operate',
          title: '进直播间次数',
          width: '120',
          sort: true,
          operates: [
            {
              emitKey: 'enterLive',
              escape: (row) => {
                return '2020M1体验课'
              },
            },
          ],
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
          sort: true,
        },
        {
          key: 'failureTime',
          title: '观看回放总时长',
          width: '150',
          sort: true,
        },

        {
          key: 'failureTime',
          type: 'operate',
          title: '评论数',
          sort: true,
          operates: [
            {
              emitKey: 'discussLive',
              escape: (row) => {
                return '2020M1体验课'
              },
            },
          ],
        },
        {
          key: '点赞数',
          title: '首次进入时间',
          width: '120',
          sort: true,
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
    sortChange() {

    },
    // 编辑
    operateEdit() {},
    getSearchQuery(res) {
      this.search = res
    },
    handleClose(done) {
      done()
    },
    // 学员
    StudentJump() {
      console.log(111111)
    },
    experienceClass() {
      console.log('体验课班级跳转')
    },
    serviceClass() {
      console.log('服务班级跳转')
    },
    enterLive() {
      this.dialogVisible = true
      this.dia_type = 1
      this.headersDialogList = this.headersEnter
      console.log('进直播间次数')
    },
    discussLive() {
      console.log('评论数')
      this.dialogVisible = true
      this.dia_type = 2
      this.headersDialogList = this.headersDiscuss
    },
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
    handleSizeChangeDialog() {},
    handleCurrentChangeDialog() {},
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
</style>