<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-25 12:09:03
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-30 12:22:05
 -->
<template>
  <div class="channel-box">
    <div class="channel-box-top">
      <div class="channel-box-top-search">
        <channel-search
          @channelSearchValue="channelSearchValue"
          @schedulingSearch="schedulingSearch"
          @dateSearch="dateSearch"
        ></channel-search>
      </div>

      <!-- <m-search
        class="channel-search"
        @search="handleSearch"
        date="date"
        channel="channel"
        searchTrialStage="searchTrialStage"
        :isMultiple="false"
        channelText="请选择渠道"
      /> -->
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
            <span>{{ allSystemUserAmounts }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p>累计转化率</p>
            <span>{{ conversionRate }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-row :gutter="20">
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-num">{{ allWechatAddNums }}</p>
                <span class="bg-purple-text">添加微信</span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-num">{{ unpaid }}</p>
                <span class="bg-purple-text">未支付</span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-num">{{ allJoinUserNums }}</p>
                <span class="bg-purple-text">参课数</span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-num">{{ allCompleteUserNums }}</p>
                <span class="bg-purple-text">完课数</span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-num">{{ allPayUserNums }}</p>
                <span class="bg-purple-text">成单数</span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-num">{{ allUserNums }}</p>
                <span class="bg-purple-text">线索数</span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-num">
                  {{ allJoinUserNumsPercent }}
                </p>
                <span class="bg-purple-text">参课率</span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-num">
                  {{ allCompleteUserNumsPercent }}
                </p>
                <span class="bg-purple-text">完课率</span>
              </el-col>
            </el-row>
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
          <!-- 查看详情 -->
          <!-- <el-table-column width="20px">
            <template slot-scope="scope">
              <el-Popover popper-class="batch-btn" trigger="hover">
                <div size="mini" type="text" @click="batchBtn">
                  <span style="cursor:pointer">查看详情</span>
                </div>
                <div
                  @mouseenter="handleEdit(scope.$index, scope.row)"
                  slot="reference"
                >
                  <img src="@/assets/images/point.png" />
                </div>
              </el-Popover>
            </template>
          </el-table-column> -->
          <el-table-column label="渠道分类" width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.channelParentName }}</span>
              <span style="margin-left:10px;">{{
                scope.row.channelClassName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="channelName" width="150" label="渠道名称">
          </el-table-column>
          <el-table-column prop="channelId" label="渠道ID"> </el-table-column>
          <el-table-column prop="orderUserAllNums" label="渠道线索">
          </el-table-column>
          <el-table-column prop="orderUserNoPayNums" label="未支付">
          </el-table-column>
          <el-table-column prop="wechatAddNums" label="添加微信数">
          </el-table-column>
          <el-table-column
            prop="address"
            width="130px"
            align="conent"
            label="参课数/参课率"
          >
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
            <template slot-scope="scope">
              <div>{{ scope.row.joinCourseNums }}</div>
              <div>{{ scope.row.joinCourseNumsPercent }}</div>
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
            <template slot-scope="scope">
              <div>{{ scope.row.completeCourseNums }}</div>
              <div>{{ scope.row.completeCourseNumsPercent }}</div>
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
            <template slot-scope="scope">
              <div>{{ scope.row.systemOrderNums }}</div>
              <div>{{ scope.row.systemOrderNumsPercent }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="systemOrderAmounts"
            width="100"
            label="成单金额"
          >
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
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.channelCtime }}
            </template>
          </el-table-column>
        </el-table>
        <m-pagination
          @current-change="handleCurrentChange"
          :current-page="totalNumber"
          :total="totalElements"
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
          <span class="drawer-box-text"> 线上推广 - 推广人</span>
        </p>
        <p>
          <span>渠道名称: </span>
          <span class="drawer-box-text">推广人</span>
        </p>
        <p>
          <span>渠道ID: </span>
          <span class="drawer-box-text">43433</span>
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
import channelSearch from '../components/componentsSearch/search'
import { timestamp } from '@/utils/index'
export default {
  props: {
    tabIndex: {
      type: String,
      default: ''
    }
  },
  components: {
    MPagination,
    channelSearch
  },
  data() {
    return {
      link: 'https://www.baidu.com',
      showClose: true,
      drawer: false,
      tableData: [],
      querysData: '',
      // 体验课排期参数
      querySearchTrialStage: null,
      // 开始时间
      stateTime: '',
      // 结束时间
      endTime: '',
      // 渠道查询传回来的数组
      channelList: [],
      // 总条数
      totalElements: 0,
      // 当前页
      totalNumber: 1,
      // 累计成单数
      allSystemUserAmounts: '',
      // 累计转化率
      conversionRate: '',
      // 添加微信
      allWechatAddNums: '',
      // 未支付
      unpaid: '',
      // 参课数
      allJoinUserNums: '',
      // 参课率
      allJoinUserNumsPercent: '',
      // 完课数
      allCompleteUserNums: '',
      // 完课率
      allCompleteUserNumsPercent: '',
      // 成单数
      allPayUserNums: '',
      // 线索数
      allUserNums: ''
    }
  },
  watch: {
    tabIndex(value) {
      console.log(value, 'watch')
    }
  },
  created() {
    this.getChannelDetailPage()
  },
  methods: {
    getChannelDetailPage() {
      if (
        this.query ||
        this.querySearchTrialStage ||
        this.stateTime ||
        this.endTime
      ) {
        const queryChannelList = this.query ? this.query : `{"match_all" : {}}`
        const SearchTrialStage = this.querySearchTrialStage
          ? this.querySearchTrialStage
          : 0
        const trialOrderStartCtime = this.stateTime
          ? `"${this.stateTime}"`
          : `"0"`
        const trialOrderEndCtime = this.endTime ? `"${this.endTime}"` : `"0"`
        this.querysData = `${JSON.stringify(
          queryChannelList
        )},trialStage:${SearchTrialStage},trialOrderEndCtime:${trialOrderEndCtime},trialOrderStartCtime:${trialOrderStartCtime},page:${
          this.totalNumber
        }`
      } else {
        this.querysData = `"{\\"match_all\\" : {}}",trialStage:0,trialOrderEndCtime:"0",trialOrderStartCtime:"0",page:${this.totalNumber}`
      }
      this.$http.Operating.channelDetailPage(this.querysData).then((res) => {
        const _data = res.data.channelDetailPage
        console.log(_data, 'resresresres')
        // 总条数
        this.totalElements = +_data.totalElements
        // 当前页
        this.totalNumber = +_data.number
        // 表格数据
        _data.content.forEach((res) => {
          if (res.channelCtime === '0') {
            res.channelCtime = '-'
          } else {
            res.channelCtime = timestamp(res.channelCtime, 5)
          }
          // 线索数
          const orderUserAllNums = +res.orderUserAllNums
          // 参课数
          const joinCourseNums = +res.joinCourseNums
          // 完课数
          const completeCourseNums = +res.completeCourseNums
          // 成单数
          const systemOrderNums = +res.systemOrderNums
          // 计算参课率
          if (joinCourseNums === 0 && orderUserAllNums === 0) {
            res.joinCourseNumsPercent = '0%'
          } else {
            const nums = (joinCourseNums / orderUserAllNums) * 100
            res.joinCourseNumsPercent = `${nums.toFixed(2)}%`
          }
          // 计算完课率
          if (completeCourseNums === 0 && orderUserAllNums === 0) {
            res.completeCourseNumsPercent = '0%'
          } else {
            const nums = (completeCourseNums / orderUserAllNums) * 100
            res.completeCourseNumsPercent = `${nums.toFixed(2)}%`
          }
          // 计算成单率
          if (systemOrderNums === 0 && orderUserAllNums === 0) {
            res.systemOrderNumsPercent = '0%'
          } else {
            const nums = (systemOrderNums / orderUserAllNums) * 100
            res.systemOrderNumsPercent = `${nums.toFixed(2)}%`
          }
        })
        // 模块数据
        const _datas = _data.counts
        // 累计成单金额
        this.allSystemUserAmounts = _datas.allSystemUserAmounts
        // 累计转化率
        const conversionRatePercentNums =
          (_datas.allSystemUserAmounts / _datas.allPayUserNums) * 100
        this.conversionRate = `${conversionRatePercentNums.toFixed(2)}%`
        // this.conversionRate = '-'
        // 添加微信
        this.allWechatAddNums = _datas.allWechatAddNums
        // 未支付
        this.unpaid = _datas.allUserNums - _datas.allPayUserNums
        // 参课数
        this.allJoinUserNums = _datas.allJoinUserNums
        // 参课率
        const allJoinUserNumsPercentNums =
          (_datas.allJoinUserNums / _datas.allPayUserNums) * 100
        this.allJoinUserNumsPercent = `${allJoinUserNumsPercentNums.toFixed(
          2
        )}%`
        // 完课数
        this.allCompleteUserNums = _datas.allCompleteUserNums
        // 完课率
        const allCompleteUserNumsPercentNums =
          (_datas.allCompleteUserNums / _datas.allPayUserNums) * 100
        this.allCompleteUserNumsPercent = `${allCompleteUserNumsPercentNums.toFixed(
          2
        )}%`
        // 成单数
        this.allPayUserNums = _datas.allPayUserNums
        // 线索数
        this.allUserNums = _datas.allUserNums

        this.tableData = _data.content
      })
    },
    // 组件 渠道传的值
    channelSearchValue(data) {
      if (data) {
        data.forEach((ele) => {
          console.log(ele, 'ele')
          this.channelList.push(ele)
        })
        this.query = `{"terms":{"id":[${this.channelList}]}}`
        console.log(this.query, 'this.query')
      } else {
        this.query = ''
        console.log(this.query, 'channelSearchValue')
      }
      this.getChannelDetailPage()
    },
    // 组件 排期传的值
    schedulingSearch(data) {
      this.querySearchTrialStage = data || 0
      console.log(this.querySearchTrialStage, 'schedulingSearch')
      this.getChannelDetailPage()
    },
    // 组件 时间回传的值
    dateSearch(data) {
      if (data) {
        this.stateTime = data.gte
        this.endTime = data.lte
      } else {
        this.stateTime = ''
        this.endTime = ''
      }
      console.log(this.stateTime, this.endTime, 'dateSearch')
      this.getChannelDetailPage()
    },
    // 分页
    handleCurrentChange(val) {
      this.totalNumber = val
      this.getChannelDetailPage()
      // this.$emit('onCurrentPage', val)
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
    margin: 10px 10px 10px 10px;
    .channel-box-top-search {
      background: #fff;
      padding: 15px;
    }
  }
  .channel-box-medium {
    background: #fff;
    margin: 0 10px 10px 10px;
    padding: 20px 20px 20px 30px;
    .bg-purple {
      margin-top: 10px;
      padding-bottom: 15px;
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
      .bg-purple-num {
        color: #409eff;
        font-weight: 600;
        font-size: 18px;
      }
      .bg-purple-text {
        font-family: 'number_font';
        font-size: 14px;
        color: #4d4d4d;
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
  .drawer-detail {
    margin: 50px 10px 10px 10px;

    .drawer-box {
      padding-left: 20px;
      .drawer-box-text {
        margin-left: 20px;
        font-family: 'number_font';
        font-size: 14px;
        color: #949494;
      }
      p {
        padding-top: 30px;
        padding-left: 30px;
      }
      a {
        margin-left: 10px;
        color: #409eff;
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
.el-popover {
  min-width: 50px !important;
}
</style>
