<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-19 21:41:12
-->
<template>
  <div class="logistics">
    <el-radio-group v-model="changeType" size="mini">
      <el-radio-button :label="-1">全部</el-radio-button>
      <el-radio-button :label="0">随材物流</el-radio-button>
      <el-radio-button :label="1">赠品物流</el-radio-button>
      <el-radio-button :label="2">兑换物流</el-radio-button>
      <el-radio-button :label="3">活动物流</el-radio-button>
      <el-radio-button :label="4">补发物流</el-radio-button>
    </el-radio-group>
    <AllLogistics
      :Tabledata="logisticsTableData"
      v-show="changeType === -1"
      @reqgetOrderPage="reqgetOrderPage"
      @goTrack="goTrack"
    />
    <Normal
      :Tabledata="logisticsTableData"
      v-show="changeType !== 4 && changeType !== -1"
      @goTrack="goTrack"
    />
    <Reissue :Tabledata="logisticsTableData" v-show="changeType === 4" @goTrack="goTrack" />
    <div class="pagination_lk">
      <el-pagination
        layout="prev,pager,next,total"
        :page-size="20"
        :total="allDigit"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!--物流记录详情抽屉-->
    <express-detail :experId="experId" :order_id="order_id" ref="order_id" />
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
import ExpressDetail from '@/pages/music_app/views/trading/views/components/expressDetail'
import AllLogistics from './allLogistics'
import Normal from './normal'
import Reissue from './Reissue'
export default {
  name: 'logistics',
  components: {
    ExpressDetail,
    Normal,
    Reissue,
    AllLogistics
  },
  mounted() {
    // 初始化拿数据
    setTimeout(() => {
      this.reqgetOrderPage()
    }, 1000)
  },
  data() {
    return {
      order_id: '', // 物流详情抽屉
      experId: '',
      logisticsTableData: [], // table展示数据
      // 数据查询
      currentPage: 1, // 页码
      // 分页组件
      allDigit: 1, // 总量
      changeType: -1,
      regtype: [1, 2, 3, 4, 5, 7, 8]
    }
  },
  methods: {
    // 点击物流详情
    goTrack(val) {
      console.log(val)
      this.$refs.order_id.drawer = true
      this.order_id = val.order_id
      this.experId = val.id
      // if (val.express && val.express.express_total > 0) {
      //   this.$refs.order_id.drawer = true
      //   this.order_id = val.order_id
      // }
      // return this.$message('暂无物流')
    },
    // 翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.reqgetOrderPage()
    },
    // 数据接口_订单·物流
    reqgetOrderPage() {
      const query = {
        regtype: this.regtype,
        id: this.$route.params.id
      }
      this.$http.User.getExpressPage(
        query, // studentId
        this.currentPage
      ).then((res) => {
        if (res.data.ExpressPage) {
          console.log('订单物流模块接口', res.data.ExpressPage.content)
          const _data = res.data.ExpressPage.content
          _data.forEach((item) => {
            item.ctime = item.ctime ? formatData(item.ctime, 's') : '-'
            item.center_ctime = item.center_ctime
              ? formatData(item.center_ctime, 's')
              : '-'
            item.delivery_collect_time = item.delivery_collect_time
              ? formatData(item.delivery_collect_time, 's')
              : '-'
            item.signing_time = item.signing_time
              ? formatData(item.signing_time, 's')
              : '-'
          })
          this.allDigit = +res.data.ExpressPage.totalElements

          this.logisticsTableData = _data // 赋值
        }
      })
    }
  },
  computed: {
    hh2() {
      return 2
    }
  },
  watch: {
    changeType: function(val, oldval) {
      console.log(val, 'oldval')
      if (val === 0) {
        this.regtype = [1, 2, 3]
      } else if (val === -1) {
        this.regtype = [1, 2, 3, 4, 5, 7, 8]
      } else if (val === 1) {
        this.regtype = [4]
      } else if (val === 2) {
        this.regtype = [7, 8]
      } else if (val === 3) {
        this.regtype = [0]
      } else {
        this.regtype = [5]
      }
      this.reqgetOrderPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.logistics {
  padding: 10px;
  // color: #5ea0f5;
  // text-decoration: underline;
  // cursor: pointer;
}
.pagination_lk {
  width: 100%;
  height: 40px;
  background-color: #fff;
  position: fixed;
  right: 0px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
