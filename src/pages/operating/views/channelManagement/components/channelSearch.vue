<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-25 12:09:03
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-28 11:08:12
 -->
<template>
  <div class="channel-box">
    <div class="channel-box-top">
      <m-search
        class="channel-search"
        @search="handleSearch"
        date="date"
        channel="channel"
        searchTrialStage="searchTrialStage"
        channelText="请选择渠道"
      />
    </div>
    <div class="channel-box-medium">
      <el-row :gutter="20">
        <!-- <el-col :span="3">
          <div class="grid-content2 bg-purple2">
            <span>
              数据汇总
            </span>
          </div>
        </el-col> -->
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p>累计成单金额</p>
            <span>989897</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p>累计转化率</p>
            <span>9%</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content1 bg-purple1">
            <div class="grid-content1-box1">
              <div>
                <p class="grid-content1-text1">192</p>
                <span class="grid-content1-text1-text">添加微信</span>
              </div>
              <div>
                <p class="grid-content1-text1">192</p>
                <span class="grid-content1-text1-text">未支付</span>
              </div>
              <div>
                <p class="grid-content1-text1">192</p>
                <span class="grid-content1-text1-text">参课数</span>
              </div>
              <div>
                <p class="grid-content1-text1">192</p>
                <span class="grid-content1-text1-text">完课数</span>
              </div>
            </div>
            <div class="grid-content1-box2">
              <div style="margin-left:5px;">
                <p class="grid-content1-text2">192</p>
                <span class="grid-content1-text2-text">成单数</span>
              </div>
              <div style="margin-left:10px;">
                <p class="grid-content1-text2">192</p>
                <span class="grid-content1-text2-text">线索数</span>
              </div>
              <div>
                <p class="grid-content1-text2">192</p>
                <span class="grid-content1-text2-text">参课率</span>
              </div>
              <div>
                <p class="grid-content1-text2">192</p>
                <span class="grid-content1-text2-text">完课率</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="channel-box-bottom">
      <template>
        <el-table
          :header-cell-style="headerCss"
          :data="tableData"
          style="width: 100%;"
        >
          <el-table-column width="20px">
            <template slot-scope="scope">
              <el-Popover
                class="batchbtn-css"
                popper-class="batch-btn"
                trigger="hover"
              >
                <!-- 气泡内容 -->
                <div size="mini" type="text" @click="batchBtn">
                  <span style="cursor: pointer;">查看详情</span>
                </div>
                <!-- 点击...图片 -->
                <div
                  @mouseenter="handleEdit(scope.$index, scope.row)"
                  slot="reference"
                >
                  <img src="@/assets/images/point.png" />
                </div>
              </el-Popover>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="渠道分类"> </el-table-column>
          <el-table-column prop="name" label="渠道名称"> </el-table-column>
          <el-table-column prop="address" label="渠道ID"> </el-table-column>
          <el-table-column prop="address" label="渠道线索"> </el-table-column>
          <el-table-column prop="address" label="未支付"> </el-table-column>
          <el-table-column prop="address" label="添加微信数"> </el-table-column>
          <el-table-column prop="address" width="130px" label="参课数/参课率">
            <template slot="header">
              <div>
                <span>参课数/参课率</span>
                <el-tooltip placement="top">
                  <div slot="content">
                    参课数：此渠道下所有参课学员汇总（参课定义：学员参加过一次即为参课）<br />参课率：参课率是指渠道中已上课的学生数/线索数（学生数）
                  </div>
                  <span class="bottom-tips">?</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" width="130px" label="完课数/完课率">
            <template slot="header">
              <div>
                <span>完课数/完课率</span>
                <el-tooltip placement="top">
                  <div slot="content">
                    完课数：1、视频看完即为本次完课 2、
                    所选时间范围内的学生，学生完课的数量/学生已放课的数量>=60%即为完课
                    在当前条件下，所有完课学员汇总<br />完课率：满足完课条件人数/线索数（学生数）
                  </div>
                  <span class="bottom-tips">?</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" width="130px" label="成单数/转化率">
            <template slot="header">
              <div>
                <span>成单数/转化率</span>
                <el-tooltip placement="top">
                  <div slot="content">
                    成单数：当前渠道购买系统课的订单总数量<br />转化率：成单数/线索数
                  </div>
                  <span class="bottom-tips">?</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="成单金额">
            <template slot="header">
              <div>
                <span>成单金额</span>
                <el-tooltip placement="top">
                  <div slot="content">
                    成单金额： 当前渠道购买系统课的订单总金额
                  </div>
                  <span class="bottom-tips">?</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="创建时间"> </el-table-column>
        </el-table>
        <m-pagination
          @current-change="handleCurrentChange"
          :current-page="1"
          :total="50"
          open="calc(100vw - 95px - 100px)"
          close="calc(100vw - 23px - 50px)"
        />
      </template>
    </div>
    <el-drawer
      class="drawer-detail"
      :show-close="showClose"
      :visible.sync="drawer"
      :modal="false"
      size="40%"
    >
      <div class="drawer-box">
        <h3>基本信息</h3>
        <p>
          <span>渠道分类: </span>
          <span> 线上推广 - 推广人</span>
        </p>
        <p>
          <span>渠道名称: </span>
          <span>推广人</span>
        </p>
        <p>
          <span>渠道ID: </span>
          <span>43433</span>
        </p>
        <p>
          <span>链接地址: </span>
          <a :href="link" target="_blank">{{ link }}</a>
        </p>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
import MSearch from '@/components/MSearch/index.vue'
export default {
  components: {
    MPagination,
    MSearch
  },
  data() {
    return {
      link: 'https://www.baidu.com',
      showClose: true,
      drawer: false,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎1',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎2',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎3',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎4',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎5',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎6',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎7',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎8',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎9',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎10',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  methods: {
    // 搜索传的值
    handleSearch(res) {
      console.log(res)
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('onCurrentPage', val)
    },
    handleEdit(index, row) {
      // 鼠标移入三个点上面触发的事件
      // 当没有点击复选框 直接点击加好友
      console.log(index, row, '点击查看详情11')
    },
    batchBtn() {
      // 点击查看详情
      this.drawer = true
      console.log('点击查看详情22')
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      return 'font-size:12px;color:#666;font-weight:normal;'
    }
  }
}
</script>
<style lang="scss" scoped>
.channel-box {
  display: flex;
  flex-direction: column;
  background: rgb(240, 241, 242);
  height: calc(100vh - 130px);
  overflow: scroll;
  .channel-box-top {
    margin: 10px 10px 0 10px;
    .channel-search {
      border: none;
    }
  }
  .channel-box-medium {
    background: #fff;
    margin: 0 10px 10px 10px;
    padding: 20px 20px;
    .bg-purple {
      margin-top: 10px;
      background: rgb(240, 241, 242);
      p {
        font-family: 'number_font';
        font-size: 14px;
        color: #4d4d4d;
      }
      span {
        color: #409eff;
        font-weight: 600;
        font-size: 18px;
      }
    }
    .grid-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 150px;
      border-radius: 4px;
    }
    .bg-purple1 {
      margin-top: 10px;
      background: rgb(240, 241, 242);
    }
    .grid-content1 {
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 150px;
      border-radius: 4px;
      .grid-content1-box1 {
        display: flex;
        justify-content: space-around;
        .grid-content1-text1 {
          display: flex;
          justify-content: center;
          font-style: normal;
          color: #409eff;
          font-weight: 600;
          font-size: 18px;
        }
        .grid-content1-text1-text {
          font-family: 'number_font';
          font-size: 14px;
          color: #4d4d4d;
        }
      }
      .grid-content1-box2 {
        display: flex;
        justify-content: space-around;
        .grid-content1-text2 {
          display: flex;
          font-weight: 600;
          font-size: 18px;
          justify-content: center;
          font-style: normal;
          color: #409eff;
        }
        .grid-content1-text2-text {
          font-family: 'number_font';
          font-size: 14px;
          color: #4d4d4d;
        }
      }
    }
    .bg-purple2 {
      margin-top: 20px;
      background: #fff;
    }
    .grid-content2 {
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      height: 150px;
      border-radius: 4px;
    }
  }
  .channel-box-bottom {
    display: flex;
    flex: 1;
    background: #fff;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 30px;
    .bottom-tips {
      color: #fff;
      margin-left: 5px;
      background: #9c9c9c;
      display: inline-block;
      width: 15px;
      font-weight: 900;
      height: 15px;
      border-radius: 50px;
      line-height: 15px;
      padding-left: 4px;
    }
  }
  .batchbtn-css {
    cursor: pointer;
  }
  .drawer-detail {
    margin: 50px 10px 10px 10px;

    .drawer-box {
      padding-left: 20px;
      p {
        padding-top: 30px;
        padding-left: 30px;
      }
    }
  }
}
</style>
<style lang="scss">
.channel-box {
  .channel-box-top {
    .el-tabs__content {
      padding: 5px;
    }
  }
  .el-drawer__header {
    margin-bottom: 5px !important;
  }
}
</style>
