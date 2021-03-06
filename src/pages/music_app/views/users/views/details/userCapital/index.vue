<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-27 10:17:03
 * @LastEditors: Shentong
 * @LastEditTime: 2021-01-11 17:06:10
-->
<template>
  <div class="user-capital">
    <div :class="{ normalFlexCommon: true }">
      <section :class="['backCol']">
        <samp style="margin-right:30px"
          >剩余小熊币：<span style="color:#4a93dd;"
            >{{ topDatafour.bear }}个</span
          ></samp
        >
        <samp style="margin-right:30px"
          >剩余钻石：<span style="color:#4a93dd;"
            >{{ topDatafour.diamond }}个</span
          ></samp
        >
        <samp style="margin-right:30px"
          >可使用优惠券：<span style="color:#4a93dd;"
            >{{ topDatafour.coupon }}张</span
          ></samp
        >
        <samp style="margin-right:30px"
          >可提现金额：<span style="color:#4a93dd;"
            >{{ topDatafour.cash }}元</span
          ></samp
        >
      </section>
      <el-radio-group v-if="!isFrom1v1" v-model="changeSubject" size="mini">
        <!-- <el-radio-button :label="0">美术</el-radio-button>
        <el-radio-button :label="1">写字</el-radio-button> -->
        <el-radio-button :label="3">音乐</el-radio-button>
      </el-radio-group>
    </div>
    <el-tabs v-model="assetCurPane">
      <el-tab-pane
        :label="{ 0: '小熊币', 1: '点点币' }[changeSubject]"
        name="assetBearCoin"
      >
        <coinArt
          ref="colorBear"
          :changeSubject="changeSubject"
          :childTab="assetCurPane"
          v-if="changeSubject == '0'"
        />
        <coinWrite
          ref="colorBear"
          :changeSubject="changeSubject"
          :childTab="assetCurPane"
          v-else
        />
      </el-tab-pane>
      <el-tab-pane label="钻石" name="diamonds">
        <diamond ref="colorDiamond" :changeSubject="changeSubject" />
      </el-tab-pane>
      <el-tab-pane label="优惠券" name="assetCoupon">
        <couponComponent ref="colorCoupon" :changeSubject="changeSubject" />
      </el-tab-pane>
      <el-tab-pane
        label="考级券"
        name="gradingTicket"
        v-if="changeSubject == '0'"
      >
        <gradingTicket
          :changeSubject="changeSubject"
          v-bind="$attrs"
          :childTab="assetCurPane"
        />
      </el-tab-pane>
      <el-tab-pane label="京东卡" name="jdCard">
        <jdCard
          :changeSubject="changeSubject"
          v-bind="$attrs"
          :childTab="assetCurPane"
        />
      </el-tab-pane>
      <el-tab-pane label="提现记录" name="cashRecord">
        <cashRecord ref="colorCash" :changeSubject="changeSubject" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import couponComponent from './couponComponent'
import jdCard from './jdCard'
import gradingTicket from './gradingTicket'
import coinWrite from './coinWrite'
import coinArt from './coinArt'
// import coinComponent from './coinComponent'
import diamond from './diamond'
import cashRecord from './cashRecord'

export default {
  components: {
    couponComponent,
    gradingTicket,
    jdCard,
    coinWrite,
    coinArt,
    cashRecord,
    diamond
  },
  data() {
    return {
      topDatafour: { bear: 0, diamond: 0, coupon: 0, cash: 0 },
      assetCurPane: 'assetBearCoin',
      changeSubject: this.$store.state.subjects.subjectCode
    }
  },
  computed: {
    // 1v1跳过来的
    isFrom1v1() {
      const { from } = this.$route.query
      return from === '1v1'
    }
  },
  watch: {
    changeSubject: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        this.getTopData()
        if (newValue === 1 && this.assetCurPane === 'gradingTicket') {
          this.assetCurPane = 'assetBearCoin'
        }
      }
    }
  },
  mounted() {
    this.getTopData()
    this.getcolorData() // 获取背景色4个数据来源4个子组件
  },

  methods: {
    async getTopData() {
      const {
        data: { UserExtends }
      } = await this.$http.User._reqGetUserTop({
        u_id: this.$route.params.id,
        subject: this.changeSubject
      }).catch((err) => {
        console.error(err)
        this.$message.error('获取用户资产_头部数据_失败')
      })
      if (UserExtends) {
        this.$root.$emit('bearCoin', UserExtends.accountUserCollect) // 用户资产_小熊币
        this.$root.$emit('coupon', UserExtends.couponUserList) // 用户资产_优惠券
      } else {
        this.$root.$emit('bearCoin', []) // 用户资产_小熊币
        this.$root.$emit('coupon', []) // 用户资产_优惠券
      }
    },
    getcolorData() {
      this.$refs.colorBear.$on('colorBear', (r) => {
        this.topDatafour.bear = r
      })
      this.$refs.colorDiamond.$on('colorDiamond', (r) => {
        this.topDatafour.diamond = r
      })
      this.$refs.colorCoupon.$on('colorCoupon', (r) => {
        this.topDatafour.coupon = r
      })
      this.$refs.colorCash.$on('colorCash', (r) => {
        this.topDatafour.cash = r
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.normalFlexCommon {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.backCol {
  height: 30px;
  flex: 12;
  line-height: 30px;
  background-color: #f6f6ec;
  padding-left: 15px;
}
/deep/.normalFlexCommon .el-radio-group:nth-child(2) {
  margin-left: 30px;
  flex: 2;
}
.user-capital {
  padding: 10px;
}
</style>
