<template>
  <div class="channelAdd-box">
    <div class="channelAdd-top">
      <div class="channelAdd-top-search">
        <channel-search
          class="channelAdd-search"
          :tabIndex="tabIndex"
          @channelSearchValue="channelSearchValue"
          @channelLevelValue="channelLevelValue"
        ></channel-search>
      </div>
    </div>
    <div class="channelAdd-table">
      <el-table
        :header-cell-style="headerCss"
        :data="tableData"
        :cell-style="cellStyle"
        style="width: 100%"
      >
        <el-table-column width="20px">
          <template slot-scope="scope">
            <el-Popover popper-class="batch-btn" trigger="hover">
              <div size="mini" type="text" @click="batchBtn(scope.row)">
                <span style="cursor:pointer">编辑</span>
              </div>
              <div
                @mouseenter="handleEdit(scope.$index, scope.row)"
                slot="reference"
              >
                <img src="@/assets/images/point.png" />
              </div>
            </el-Popover>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="id" label="渠道id" align="center">
        </el-table-column>
        <el-table-column label="渠道分类" width="180" align="center">
          <template slot-scope="scope">
            {{ scope.row.channelClassParent.channel_class_name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="channel_class_name"
          label="二级渠道"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="channel_class_level"
          label="渠道等级"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.channel_level | channelLevelFilter }}
          </template>
        </el-table-column>
      </el-table>
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+currentPage"
        :total="+totalElements"
        open="calc(100vw - 95px - 100px)"
        close="calc(100vw - 23px - 50px)"
      />
    </div>
    <el-drawer
      class="drawer-detail"
      :show-close="showClose"
      :visible.sync="modifyDrawer"
      :modal="false"
      size="30%"
    >
      <modify-cahnnel
        v-if="modifyDrawer"
        :modifyRow="modifyRow"
        @modifyChannelShowBtn="modifyChannelShowBtn"
        @modifyChannelShow="modifyChannelShow"
      />
    </el-drawer>
  </div>
</template>

<script>
import channelSearch from '../components/componentsSearch/secChannelInfoSearch'
import modifyCahnnel from '../components/components/secModifyCahnnel'
import MPagination from '@/components/MPagination/index.vue'
export default {
  props: {
    tabIndex: {
      type: String,
      default: ''
    }
  },
  components: {
    channelSearch,
    MPagination,
    modifyCahnnel
  },
  filters: {
    channelLevelFilter(val) {
      var levelNames = { 0: 'B', 1: 'A', 2: 'S' }
      if (Object.prototype.hasOwnProperty.call(levelNames, val)) {
        return levelNames[val]
      }
      return '-'
    }
  },
  data() {
    return {
      showClose: false,
      modifyDrawer: false,
      currentPage: '1',
      totalElements: '',
      tableData: [], // 列表数据
      channelSearchIds: [], // 筛选条件选择的渠道id集合
      channelLevels: [], // 筛选条件选择的渠道等级集合
      modifyRow: '' // 传递给修改抽屉数据
    }
  },
  watch: {
    tabIndex(value) {
      if (value === '3') {
        this.channelSearchIds = []
        this.channelLevels = []
        this.currentPage = 1
        this.getSecChannelList()
      }
    }
  },
  methods: {
    // 获取二级渠道列表
    getSecChannelList() {
      console.log('dagag')

      // 默认查询数据
      const defaultQuery = { channel_class_parent_id: { gt: 0 } }
      // 如果有渠道筛选条件
      if (this.channelSearchIds.length !== 0) {
        defaultQuery.id = Array.from(new Set(this.channelSearchIds))
      }
      // 如果有渠道等级筛选条件
      if (this.channelLevels.length !== 0) {
        defaultQuery.channel_level = Array.from(new Set(this.channelLevels))
      }
      Object.assign(defaultQuery, {
        subject: this.$store.getters.subjects.subjectCode
      })
      console.log(defaultQuery, 'defaultQuery')

      const queryParamsJsonStr = JSON.stringify(JSON.stringify(defaultQuery))
      this.$http.writeApp.Operating.ChannelClassPage(
        queryParamsJsonStr,
        this.currentPage
      ).then((res) => {
        this.currentPage = res.data.ChannelClassPage.number
        this.totalElements = res.data.ChannelClassPage.totalElements
        this.tableData = res.data.ChannelClassPage.content
      })
    },
    // 渠道下拉框选择时回传数据
    channelSearchValue(data) {
      this.currentPage = 1
      if (data) {
        this.channelSearchIds = data
      } else {
        this.channelSearchIds = []
      }
      this.getSecChannelList()
    },
    // 渠道等级下拉框选择时回传数据
    channelLevelValue(data) {
      if (data) {
        this.channelLevels = data
      } else {
        this.channelLevels = []
      }
      this.getSecChannelList()
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSecChannelList()
    },
    handleEdit(index, row) {
      // 鼠标移入三个点上面触发的事件
    },
    // 点击编辑
    batchBtn(row) {
      this.modifyDrawer = true
      this.modifyRow = row
    },
    // 修改完成后刷洗列表
    modifyChannelShowBtn(data) {
      window.setTimeout(this.getSecChannelList, 800)
    },
    // 关闭编辑页面
    modifyChannelShow(data) {
      this.modifyDrawer = data
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      return 'font-size:12px;color:#666;font-weight:normal;background:#f0f1f2;'
    },
    // 单元格回调样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'max-height:50px;'
    }
  }
}
</script>
<style lang="scss" scoped>
.channelAdd-box {
  background: #f0f1f2;
  padding: 10px 10px 10px 10px;
  height: calc(100vh - 140px);
  padding-bottom: 30px;
  overflow: scroll;
  .channelAdd-top {
    .channelAdd-top-search {
      background: #fff;
      padding: 15px;
      .channelAdd-search {
        display: inline;
      }
    }
  }
  .channelAdd-table {
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
    background: #fff;
  }
  .drawer-detail {
    margin: 50px 10px 10px 10px;
  }
}
</style>
