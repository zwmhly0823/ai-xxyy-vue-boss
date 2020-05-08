<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-05-06 16:33:15
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-08 19:24:11
 -->
<template>
  <div class="channelAdd-box">
    <div class="channelAdd-top">
      <div class="channelAdd-top-search">
        <channel-search
          :tabIndex="tabIndex"
          @channelSearchValue="channelSearchValue"
          @channelInputValue="channelInputValue"
        ></channel-search>
      </div>
    </div>
    <div class="channelAdd-table">
      <el-button class="add-btn" @click="onAddChannel" type="primary"
        >添加渠道</el-button
      >
      <el-table
        :header-cell-style="headerCss"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column width="20px">
          <template slot-scope="scope">
            <el-Popover popper-class="batch-btn" trigger="hover">
              <div size="mini" type="text" @click="batchBtn">
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
        <el-table-column prop="date" label="序号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="渠道id" width="180">
        </el-table-column>
        <el-table-column prop="address" label="渠道状态"> </el-table-column>
        <el-table-column prop="address" label="一级渠道"> </el-table-column>
        <el-table-column prop="address" label="二级渠道"> </el-table-column>
        <el-table-column prop="address" label="三级渠道"> </el-table-column>
        <el-table-column prop="address" label="渠道备注"> </el-table-column>
        <el-table-column prop="address" label="创建时间"> </el-table-column>
      </el-table>
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="1"
        :total="10"
        open="calc(100vw - 95px - 100px)"
        close="calc(100vw - 23px - 50px)"
      />
    </div>
    <el-drawer
      class="drawer-detail"
      :show-close="showClose"
      :visible.sync="addDrawer"
      :modal="false"
      size="35%"
    >
      <add-cahnnel @addChannelShow="addChannelShow" />
    </el-drawer>
    <el-drawer
      class="drawer-detail"
      :show-close="showClose"
      :visible.sync="modifyDrawer"
      :modal="false"
      size="35%"
    >
      <modify-cahnnel @modifyChannelShow="modifyChannelShow" />
    </el-drawer>
  </div>
</template>

<script>
import channelSearch from '../components/componentsSearch/channelInforSearch'
import addCahnnel from '../components/componentsChannel/addCahnnel'
import modifyCahnnel from '../components/componentsChannel/modifyCahnnel'
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
    addCahnnel,
    modifyCahnnel
  },
  data() {
    return {
      channelDate: false,
      scheduling: false,
      showClose: false,
      addDrawer: false,
      modifyDrawer: false,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  created() {},
  methods: {
    channelSearchValue(data) {
      console.log(data, 'datassss channel')
    },
    channelInputValue(data) {
      console.log(data, 'datassss input')
    },
    handleCurrentChange() {},
    handleEdit(index, row) {
      // 鼠标移入三个点上面触发的事件
      // 当没有点击复选框 直接点击加好友
      console.log(index, row, '点击查看详情11')
    },
    // 点击添加渠道
    onAddChannel() {
      this.addDrawer = true
    },
    addChannelShow(data) {
      this.addDrawer = data
    },
    // 点击编辑
    batchBtn() {
      this.modifyDrawer = true
    },
    modifyChannelShow(data) {
      this.modifyDrawer = data
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      return 'font-size:12px;color:#666;font-weight:normal;background:#f0f1f2;'
    }
  }
}
</script>

<style lang="scss" scoped>
.channelAdd-box {
  background: #f0f1f2;
  padding: 10px 10px 10px 10px;
  height: calc(100vh - 129px);
  overflow: scroll;
  .channelAdd-top {
    .channelAdd-top-search {
      background: #fff;
      padding: 15px;
    }
  }
  .channelAdd-table {
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
    background: #fff;
    .add-btn {
      margin-top: 10px;
      margin-left: 10px;
      margin-bottom: 20px;
      width: 120px;
      height: 40px;
    }
  }
  .drawer-detail {
    margin: 50px 10px 10px 10px;
  }
}
</style>
