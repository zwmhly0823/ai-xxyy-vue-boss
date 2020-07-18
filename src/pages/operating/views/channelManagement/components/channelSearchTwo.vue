<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-25 12:09:03
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-18 17:08:17
 -->
<template>
  <div id="channel-box-two" class="channel-box">
    <div class="channel-box-top">
      <div class="channel-box-top-search">
        <channel-search-two
          @channelSearchValue="channelSearchValue"
          @schedulingSearch="schedulingSearch"
          @dateSearch="dateSearch"
          :tabIndex="tabIndex"
        ></channel-search-two>
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
            <span>{{ allSystemUserAmounts }}</span>
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
              <span>{{ scope.row.channelParentName }}</span>
              <span style="margin-left:10px;">{{
                scope.row.channelClassName
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column width="150" label="渠道名称">
            <template slot-scope="scope">
              <a
                style="color: #2a75ed;"
                :href="scope.row.channelNameLink"
                target="_blank"
                >{{ scope.row.channelName }}</a
              >
            </template>
          </el-table-column>
          <el-table-column prop="channelId" label="渠道ID"> </el-table-column> -->
          <el-table-column prop="orderUserPayNums" label="体验课成单数">
          </el-table-column>
          <el-table-column prop="orderUserNoPayNums" label="体验课未支付">
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
                    参课数：此渠道下所有购买体验课的学员且参课的学员<br />参课率：参课数
                    / 已购体验课数
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
                    完课数：此渠道下已购体验课且完成一次体验课即为完课<br />完课率：完课数
                    / 已购体验课学员数
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
                    成单数：已购体验课且转化系统课数量<br />转化率：当前系统课成单数
                    / 当前体验课成单数
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
// import MPagination from '@/components/MPagination/index.vue'
import channelSearchTwo from '../components/componentsSearch/searchTwo'
import { timestamp } from '@/utils/index'
export default {
  props: {
    tabIndex: {
      type: String,
      default: ''
    }
  },
  components: {
    // MPagination,
    channelSearchTwo
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
      channelSearchValList: []
      // 二级渠道emit数据
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
        this.channelSearchValList = []
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
      // const jump = document.getElementById('el_table').scrollHeight

      // this.$nextTick(() => {
      //   const dom =
      //     document.documentElement.scrollTop || document.body.scrollTop
      // })
      const dom = document.getElementById('channel-box-two').scrollTop
      dom > 289 ? (this.tableShow = true) : (this.tableShow = false)
    },
    // 渠道一级
    channelSearchValue(data) {
      this.channelSearchValList = data
      if (data.length) {
        this.query = this.channelIds.length
          ? `{"bool":{"must_not":{"terms":{"channel_class_id":["17","36"]}},"must":[{"terms":{"channel_class_id":${JSON.stringify(
              data
            )}}},{"terms":{"id":${JSON.stringify(this.channelIds)}}}]}}`
          : `{"bool":{"must_not":{"terms":{"channel_class_id":["17","36"]}},"must":[{"terms":{"channel_class_id":${JSON.stringify(
              data
            )}}}]}}`
      } else {
        this.query = this.channelIds.length
          ? `{"bool":{"must_not":{"terms":{"channel_class_id":["17","36"]}},"must":[{"terms":{"id":${JSON.stringify(
              this.channelIds
            )}}}]}}`
          : `{"bool":{"must_not":{"terms":{"channel_class_id":["17","36"]}}}}`
      }
      this.totalNumber = 1
      this.getChannelDetailPage()
    },
    // TODO:
    // getChannelLeves(data) {
    //   this.channelIds = data
    //   if (data.length) {
    //     this.query = this.channelSearchValList.length
    //       ? `{"bool":{"must_not":{"terms":{"channel_class_id":["17","36"]}},"must":[{"terms":{"channel_class_id":${JSON.stringify(
    //           this.channelSearchValList
    //         )}}},{"terms":{"id":${JSON.stringify(this.channelIds)}}}]}}`
    //       : `{"bool":{"must_not":{"terms":{"channel_class_id":["17","36"]}},"must":{"terms":{"id":${JSON.stringify(
    //           data
    //         )}}}}}`
    //   } else {
    //     this.query = this.channelSearchValList.length
    //       ? `{"bool":{"must_not":{"terms":{"channel_class_id":["17","36"]}},"must":[{"terms":{"channel_class_id":${JSON.stringify(
    //           this.channelSearchValList
    //         )}}}]}}`
    //       : `{"bool":{"must_not":{"terms":{"channel_class_id":["17","36"]}}}}`
    //   }
    //   this.totalNumber = 1
    //   this.getChannelDetailPage()
    // },
    getChannelDetailPage() {
      if (
        this.query ||
        this.channelIds.length ||
        this.querySearchTrialStage ||
        this.stateTime ||
        this.endTime
      ) {
        const queryChannelList = this.query
          ? this.query
          : `{"bool":{"must_not":{"terms":{"channel_class_id":["17","36"]}}}}`
        const channelId = this.channelIds.length
          ? `${JSON.stringify(this.channelIds.join())}`
          : `""`
        const SearchTrialStage = this.querySearchTrialStage
          ? `"${this.querySearchTrialStage}"`
          : `"0"`
        const trialOrderStartCtime = this.stateTime
          ? `"${this.stateTime}"`
          : `"0"`
        const trialOrderEndCtime = this.endTime ? `"${this.endTime}"` : `"0"`
        const channelSearchValList = this.channelSearchValList.length
          ? this.channelSearchValList.join()
          : ''
        this.querysData = `${JSON.stringify(
          queryChannelList
        )},channelClassIds:${JSON.stringify(
          channelSearchValList
        )},channelIds:${channelId},trialStage:${SearchTrialStage},trialOrderEndCtime:${trialOrderEndCtime},trialOrderStartCtime:${trialOrderStartCtime},page:${
          this.totalNumber
        }`
      } else {
        this.querysData = `"{\\"bool\\":{\\"must_not\\":{\\"terms\\":{\\"channel_class_id\\":[\\"17\\",\\"36\\"]}}}}",trialStage:"",trialOrderEndCtime:"0",trialOrderStartCtime:"0",page:${this.totalNumber}`
      }
      this.$http.Operating.channelDetailPage(this.querysData).then((res) => {
        const _data = res.data.channelDetailPage
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
          res.channelNameLink = `https://www.xiaoxiongmeishu.com/activity/newFortyNine?changeImg=1&channelId=${res.channelId}`
          // 线索数
          // const orderUserAllNums = +res.orderUserAllNums
          // 购买体验课数
          const orderUserPayNums = +res.orderUserPayNums
          // 参课数
          const joinCourseNums = +res.joinCourseNums
          // 完课数
          const completeCourseNums = +res.completeCourseNums
          // 成单数
          const systemOrderNums = +res.systemOrderNums
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
        })
        // 模块数据
        const _datas = _data.counts
        // 累计成单金额
        const allSystemUserAmountsNums = +_datas.allSystemUserAmounts
        // const allSystemUserAmountsNums = 1234567.23456789
        this.allSystemUserAmounts = `${allSystemUserAmountsNums.toFixed(2)}`
        // 累计转化率
        if (+_datas.allSystemUserNums === 0 && +_datas.allPayUserNums === 0) {
          this.conversionRate = `0%`
        } else {
          const conversionRatePercentNums =
            (_datas.allSystemUserNums / _datas.allPayUserNums) * 100
          this.conversionRate = `${conversionRatePercentNums.toFixed(2)}%`
        }
        // 系统课成单人数
        this.allSystemUser = _datas.allSystemUserNums
        // 添加微信
        this.allWechatAddNums = _datas.allWechatAddNums
        // 未支付
        this.unpaid = _datas.allUserNums - _datas.allPayUserNums
        // 参课数
        this.allJoinUserNums = _datas.allJoinUserNums
        // 参课率
        if (+_datas.allJoinUserNums === 0 && +_datas.allPayUserNums === 0) {
          this.allJoinUserNumsPercent = `0%`
        } else {
          const allJoinUserNumsPercentNums =
            (_datas.allJoinUserNums / _datas.allPayUserNums) * 100
          this.allJoinUserNumsPercent = `${allJoinUserNumsPercentNums.toFixed(
            2
          )}%`
        }
        // 完课数
        this.allCompleteUserNums = _datas.allCompleteUserNums
        // 完课率
        if (+_datas.allCompleteUserNums === 0 && +_datas.allPayUserNums === 0) {
          this.allCompleteUserNumsPercent = `0%`
        } else {
          const allCompleteUserNumsPercentNums =
            (_datas.allCompleteUserNums / _datas.allPayUserNums) * 100
          this.allCompleteUserNumsPercent = `${allCompleteUserNumsPercentNums.toFixed(
            2
          )}%`
        }
        // 成单数
        this.allPayUserNums = _datas.allPayUserNums
        // 线索数
        this.allUserNums = _datas.allUserNums

        this.tableData = _data.content
      })
    },
    // 组件 排期传的值
    schedulingSearch(data) {
      this.querySearchTrialStage = data
      this.totalNumber = 1
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
      this.getChannelDetailPage()
    },
    // 分页
    // handleCurrentChange(val) {
    // this.totalNumber = val
    // this.getChannelDetailPage()
    // this.$emit('onCurrentPage', val)
    // },
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
      .row4 {
        margin-left: 10px;
      }
      .row5 {
        margin-left: 20px;
      }
      .row6 {
        width: 5%;
        margin-left: 60px;
      }
      .row7 {
        margin-left: 90px;
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
        .row4 {
          margin-left: -20px;
        }
        .row5 {
          margin-left: 80px;
        }
        .row6 {
          margin-left: 80px;
        }
        .row7 {
          margin-left: 130px;
        }
        .row8 {
          // margin-left: -10px;
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
