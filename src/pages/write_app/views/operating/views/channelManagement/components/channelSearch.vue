<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-25 12:09:03
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-24 18:40:53
 -->
<template>
  <div id="channel-box" class="channel-box">
    <div class="channel-box-top">
      <div class="channel-box-top-search">
        <channel-search
          @channelSearchValue="channelSearchValue"
          @schedulingSearch="schedulingSearch"
          @dateSearch="dateSearch"
          @getChannelLeves="getChannelLeves"
          :tabIndex="tabIndex"
        ></channel-search>
      </div>
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
            <span>{{ allSystemUserAmounts || '-' }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p>累计转化率/系统课成单人数</p>
            <span>{{ conversionRate }} <em>/</em> {{ allSystemUser }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-row :gutter="20">
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-text">添加微信</p>
                <span class="bg-purple-num">{{ allWechatAddNums }}</span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-text">未支付</p>
                <span class="bg-purple-num">{{ unpaid }}</span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-text">参课数</p>
                <span class="bg-purple-num">{{ allJoinUserNums }}</span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-text">完课数</p>
                <span class="bg-purple-num">{{ allCompleteUserNums }}</span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-text">体验课成单数</p>
                <span class="bg-purple-num">{{ allPayUserNums }}</span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-text">线索数</p>
                <span class="bg-purple-num">{{ allUserNums }}</span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-text">参课率</p>
                <span class="bg-purple-num">
                  {{ allJoinUserNumsPercent }}
                </span>
              </el-col>
              <el-col :span="6" style="text-align:center;">
                <p class="bg-purple-text">完课率</p>
                <span class="bg-purple-num">
                  {{ allCompleteUserNumsPercent }}
                </span>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="channel-fixed" v-show="tableShow">
      <el-row class="channel-fixed-row">
        <el-col :span="2"><div>渠道分类</div></el-col>
        <el-col :span="2" class="row2"><div>渠道名称</div></el-col>
        <el-col :span="1" class="row3"><div>渠道ID</div></el-col>
        <el-col :span="2" class="row4"><div>体验课成单数</div></el-col>
        <el-col :span="2" class="row5"><div>体验课未支付</div></el-col>
        <el-col :span="1" class="row6"><div>添加微信数</div></el-col>
        <el-col :span="2" class="row7"
          ><div>
            <span>参课数/参课率</span>
            <el-tooltip placement="top">
              <div slot="content">
                参课数：此渠道下所有购买体验课的学员且参课的学员<br />参课率：参课数
                / 已购体验课数
              </div>
              <span class="bottom-tips">?</span>
            </el-tooltip>
          </div></el-col
        >
        <el-col :span="2" class="row8"
          ><div>
            <span>完课数/完课率</span>
            <el-tooltip placement="top">
              <div slot="content">
                完课数：此渠道下已购体验课且完成一次体验课即为完课<br />完课率：完课数
                / 已购体验课学员数
              </div>
              <span class="bottom-tips">?</span>
            </el-tooltip>
          </div></el-col
        >
        <el-col :span="2" class="row9"
          ><div>
            <span>成单数/转化率</span>
            <el-tooltip placement="top">
              <div slot="content">
                成单数：已购体验课且转化系统课数量<br />转化率：当前系统课成单数
                / 当前体验课成单数
              </div>
              <span class="bottom-tips">?</span>
            </el-tooltip>
          </div></el-col
        >
        <el-col :span="2" class="row10"
          ><div>
            <span>成单金额</span>
            <el-tooltip placement="top">
              <div slot="content">
                成单金额： 当前渠道购买系统课的订单总金额
              </div>
              <span class="bottom-tips">?</span>
            </el-tooltip>
          </div></el-col
        >
        <el-col :span="2" class="row11"><div>创建时间</div></el-col>
      </el-row>
    </div>
    <div class="channel-box-bottom">
      <template>
        <el-table
          :header-cell-style="headerCss"
          :data="tableData"
          style="width: 100%;"
        >
          <el-table-column label="渠道分类" width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.p_channel_class_name || '-' }}</span>
              <span style="margin-left:10px;">{{
                scope.row.channel_class_name || '-'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" label="渠道名称">
            <template slot-scope="scope">
              <a
                v-if="scope.row.channel_inner_name"
                style="color: #2a75ed;"
                :href="scope.row.channelNameLink"
                target="_blank"
                >{{ scope.row.channel_inner_name }}</a
              >
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="pay_channel" label="渠道ID"> </el-table-column>
          <el-table-column prop="trial_user_num" label="体验课成单数">
          </el-table-column>
          <el-table-column prop="order_user_no_pay_nums" label="体验课未支付">
          </el-table-column>
          <el-table-column prop="wet_nums" label="添加微信数">
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
                    参课数：此渠道下所有购买体验课的学员且参课的学员<br />参课率：参课数
                    / 已购体验课数
                  </div>
                  <span class="bottom-tips">?</span>
                </el-tooltip>
              </div>
            </template>
            <template slot-scope="scope">
              <div>{{ scope.row.join_user_num }}</div>
              <div>{{ scope.row.joinCourseNumsPercent }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="address" width="130px" label="完课数/完课率">
            <template slot="header">
              <div>
                <span>完课数/完课率</span>
                <el-tooltip placement="top">
                  <div slot="content">
                    完课数：此渠道下已购体验课且完成一次体验课即为完课<br />完课率：完课数
                    / 已购体验课学员数
                  </div>
                  <span class="bottom-tips">?</span>
                </el-tooltip>
              </div>
            </template>
            <template slot-scope="scope">
              <div>{{ scope.row.complete_user_num }}</div>
              <div>{{ scope.row.completeCourseNumsPercent }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="address" width="130px" label="成单数/转化率">
            <template slot="header">
              <div>
                <span>成单数/转化率</span>
                <el-tooltip placement="top">
                  <div slot="content">
                    成单数：已购体验课且转化系统课数量<br />转化率：当前系统课成单数
                    / 当前体验课成单数
                  </div>
                  <span class="bottom-tips">?</span>
                </el-tooltip>
              </div>
            </template>
            <template slot-scope="scope">
              <div>{{ scope.row.system_user_num }}</div>
              <div>{{ scope.row.systemOrderNumsPercent }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="system_user_amounts"
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
              {{ scope.row.ctime || '-' }}
            </template>
          </el-table-column>
        </el-table>
        <m-pagination
          @current-change="handleCurrentChange"
          :current-page="+totalNumber"
          :total="+totalElements"
          :pageSize="+60"
          open="calc(100vw - 147px - 50px)"
          close="calc(100vw - 26px - 50px)"
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
      tableShow: false,
      link: 'https://www.baidu.com',
      showClose: true,
      drawer: false,
      tableData: [],
      query: '',
      channelIds: '',
      querysData: '',
      // 体验课排期参数
      querySearchTrialStage: '',
      // 开始时间
      stateTime: '',
      // 结束时间
      endTime: '',
      // 渠道查询传回来的数组
      // channelList: [],
      // 总条数
      totalElements: 0,
      // 当前页
      totalNumber: 1,
      // 累计成单数
      allSystemUserAmounts: '',
      // 累计转化率
      conversionRate: '',
      // 系统课成单人数
      allSystemUser: '',
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
      allUserNums: '',
      // 获取到列表的一条数据
      channelIdRow: '',
      // 一级渠道emit的数据
      channelSearchValList: '',
      // 二级渠道emit数据

      // 参数渠道id
      channelValueList: []
    }
  },
  watch: {
    tabIndex(value) {
      if (value === '0') {
        this.query = ''
        this.channelIds = []
        this.querySearchTrialStage = ''
        this.stateTime = ''
        this.endTime = ''
        this.totalNumber = 1
        this.getChannelDetailPage()
        this.channelSearchValList = ''
        this.channelValueList = []
      }
    }
  },
  created() {
    this.getChannelDetailPage()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleScroll() {
      const dom = document.getElementById('channel-box').scrollTop
      dom > 289 ? (this.tableShow = true) : (this.tableShow = false)
    },
    // 渠道一级
    channelSearchValue(data) {
      this.totalNumber = 1
      this.channelSearchValList = data.toString()
      this.channelValueList = []
      this.getChannelDetailPage()
    },
    // 选择渠道
    getChannelLeves(data) {
      this.totalNumber = 1
      this.channelIds = data.toString()
      this.channelValueList = []
      this.getChannelDetailPage()
    },
    getChannelDetailPage() {
      const params = {
        trialChannels: this.channelIds,
        trialChannelClassIds: this.channelSearchValList,
        stage: this.querySearchTrialStage,
        startCtime: this.stateTime,
        endCtime: this.endTime,
        page: this.totalNumber,
        pageSzie: '60'
      }
      const paramsM = {
        trialChannels: this.channelIds,
        trialChannelClassIds: this.channelSearchValList,
        stage: this.querySearchTrialStage,
        startCtime: this.stateTime,
        endCtime: this.endTime
      }
      this.$http.Operating.countsByTrialChannel(params).then((res) => {
        const _data = res.content
        this.totalNumber = res.number
        this.totalElements = res.totalElements
        _data.forEach((res) => {
          res.channelNameLink = `https://www.xiaoxiongmeishu.com/activity/newFortyNine?changeImg=1&channelId=${res.pay_channel}`
          // 线索数
          // const orderUserAllNums = +res.orderUserAllNums
          // 购买体验课数
          const orderUserPayNums = +res.trial_user_num
          // 参课数
          const joinCourseNums = +res.join_user_num
          // 完课数
          const completeCourseNums = +res.complete_user_num
          // 成单数
          const systemOrderNums = +res.system_user_num
          // 计算参课率
          if (joinCourseNums === 0 && orderUserPayNums === 0) {
            res.joinCourseNumsPercent = '0%'
          } else {
            const nums = (joinCourseNums / orderUserPayNums) * 100
            res.joinCourseNumsPercent = `${nums.toFixed(2)}%`
          }
          // 计算完课率
          if (completeCourseNums === 0 && orderUserPayNums === 0) {
            res.completeCourseNumsPercent = '0%'
          } else {
            const nums = (completeCourseNums / orderUserPayNums) * 100
            res.completeCourseNumsPercent = `${nums.toFixed(2)}%`
          }
          // 计算成单率
          if (systemOrderNums === 0 && orderUserPayNums === 0) {
            res.systemOrderNumsPercent = '0%'
          } else {
            const nums = (systemOrderNums / orderUserPayNums) * 100
            res.systemOrderNumsPercent = `${nums.toFixed(2)}%`
          }

          this.channelValueList.push(res.pay_channel)
        })
        this.onGetChannelList(_data)
      })
      this.$http.Operating.countsByTrialChannelOfTotal(paramsM).then((ele) => {
        // 模块数据
        const _datas = ele.payload
        // 累计成单金额
        if (_datas.system_user_amounts !== 'null') {
          const allSystemUserAmountsNums = +_datas.system_user_amounts
          this.allSystemUserAmounts = `${allSystemUserAmountsNums.toFixed(2)}`
        } else {
          this.allSystemUserAmounts = '0'
        }
        // 累计转化率
        if (+_datas.system_user_num === 0 && _datas.trial_user_num === 'null') {
          this.conversionRate = `0%`
        } else {
          const conversionRatePercentNums =
            (_datas.system_user_num / _datas.trial_user_num) * 100
          this.conversionRate = `${conversionRatePercentNums.toFixed(2)}%`
        }
        // 系统课成单人数
        this.allSystemUser = _datas.system_user_num
        // 添加微信
        if (_datas.wet_nums !== 'null') {
          this.allWechatAddNums = _datas.wet_nums
        } else {
          this.allWechatAddNums = '0'
        }
        // 未支付
        this.unpaid = _datas.order_user_no_pay_nums
        // 参课数
        this.allJoinUserNums = _datas.join_user_num
        // 参课率
        if (+_datas.join_user_num === 0 && _datas.trial_user_num === 'null') {
          this.allJoinUserNumsPercent = `0%`
        } else {
          const allJoinUserNumsPercentNums =
            (_datas.join_user_num / _datas.trial_user_num) * 100
          this.allJoinUserNumsPercent = `${allJoinUserNumsPercentNums.toFixed(
            2
          )}%`
        }
        // 完课数
        this.allCompleteUserNums = _datas.complete_user_num
        // 完课率
        if (
          +_datas.complete_user_num === 0 &&
          _datas.trial_user_num === 'null'
        ) {
          this.allCompleteUserNumsPercent = `0%`
        } else {
          const allCompleteUserNumsPercentNums =
            (_datas.complete_user_num / _datas.trial_user_num) * 100
          this.allCompleteUserNumsPercent = `${allCompleteUserNumsPercentNums.toFixed(
            2
          )}%`
        }
        // 成单数
        if (_datas.trial_user_num !== 'null') {
          this.allPayUserNums = _datas.trial_user_num
        } else {
          this.allPayUserNums = '0'
        }
        // 线索数
        if (
          _datas.trial_user_num !== 'null' &&
          +_datas.order_user_no_pay_nums !== 0
        ) {
          this.allUserNums =
            +_datas.trial_user_num + +_datas.order_user_no_pay_nums
        } else {
          this.allUserNums = '0'
        }
      })

      //   this.tableData = _data.content
      // })
    },
    // 调取渠道分类  渠道名称接口
    onGetChannelList(_data) {
      const query = this.channelValueList
      const channelValue = `{"id":${JSON.stringify(query)}}`
      this.$http.Operating.ChannelDetailStatisticsList(channelValue).then(
        (ele) => {
          const __data = ele.data.ChannelDetailStatisticsList
          _data.forEach((val) => {
            __data.forEach((item) => {
              if (+item.id === +val.pay_channel) {
                val.channel_class_id = item.channel_class_id
                val.channel_class_name = item.channel_class_name
                val.channel_inner_name = item.channel_inner_name
                val.ctime = item.ctime
                if (+val.ctime === 0 && val.ctime) {
                  val.ctime = '-'
                } else {
                  val.ctime = timestamp(val.ctime, 5)
                }
                val.id = item.id
                val.p_channel_class_id = item.p_channel_class_id
                val.p_channel_class_name = item.p_channel_class_name
              }
            })
          })
          this.tableData = _data
        }
      )
    },
    // 组件 排期传的值
    schedulingSearch(data) {
      this.querySearchTrialStage = data
      this.totalNumber = 1
      this.channelValueList = []
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
      this.totalNumber = 1
      this.channelValueList = []
      this.getChannelDetailPage()
    },
    // 分页
    handleCurrentChange(val) {
      this.totalNumber = val
      this.channelValueList = []
      this.getChannelDetailPage()
      // this.$emit('onCurrentPage', val)
    },
    // handleEdit(index, row) {
    //   // 鼠标移入三个点上面触发的事件
    //   // 当没有点击复选框 直接点击加好友
    //   this.channelIdRow = row
    // },
    // onExtension() {
    //   // 渠道推广统计
    //   // this.drawer = true
    // },
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
  height: calc(100vh - 140px);
  overflow: scroll;
  padding-bottom: 30px;
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
        color: #2a75ed;
        font-weight: 600;
        font-size: 18px;
      }
      .bg-purple-num {
        color: #2a75ed;
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
  .channel-fixed {
    position: fixed;
    z-index: 9090;
    height: 45px;
    width: 100%;
    background: #fff;
    line-height: 45px;
    border-bottom: 1px solid #f0f1f2;
    .channel-fixed-row {
      margin-left: 85px;
      font-size: 12px;
      color: #666;
      font-weight: normal;
      .row1 {
      }
      .row2 {
        margin-left: 20px;
      }
      .row3 {
        margin-left: 30px;
      }
      .row4 {
        margin-left: 30px;
      }
      .row5 {
        margin-left: -30px;
      }
      .row6 {
        width: 5%;
        margin-left: -20px;
      }
      .row7 {
        margin-left: 20px;
      }
      .row8 {
        margin-left: 20px;
      }
      .row9 {
        margin-left: 20px;
      }
      .row10 {
        margin-left: 20px;
      }
      .row11 {
      }
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
  }
  @media (min-width: 1480px) and (max-width: 2880px) {
    .channel-fixed {
      position: fixed;
      z-index: 9090;
      height: 45px;
      width: 100%;
      background: #fff;
      line-height: 45px;
      border-bottom: 1px solid #f0f1f2;
      .channel-fixed-row {
        margin-left: 85px;
        font-size: 12px;
        color: #666;
        font-weight: normal;
        .row1 {
        }
        .row2 {
          margin-left: -20px;
        }
        .row3 {
          margin-left: -10px;
        }
        .row4 {
          margin-left: 120px;
        }
        .row5 {
          margin-left: 30px;
        }
        .row6 {
          margin-left: 20px;
        }
        .row7 {
          margin-left: 100px;
        }
        .row8 {
          margin-left: -10px;
        }
        .row9 {
          margin-left: -20px;
        }
        .row10 {
          margin-left: -20px;
        }
        .row11 {
          margin-left: -20px;
        }
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
    }
  }
  .channel-box-bottom {
    display: flex;
    flex: 1;
    background: #fff;
    margin-left: 10px;
    margin-right: 10px;
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
        color: #2a75ed;
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
