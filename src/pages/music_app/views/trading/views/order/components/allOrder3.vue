<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-11 16:16:08
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-11 16:16:08
 * @Description: 活动订单 - 统计 及 列表
 * o_order:  regtype, 4-宝石兑换（推荐有礼），5-积分兑换（小熊商城），6-赠送（邀请有奖）
 -->
<template>
  <div class="order-call">
    <!-- 统计数据 -->
    <article class="top-box">
      <el-row :gutter="20" type="flex" justify="flex-start">
        <!-- 已完成 3 -->
        <el-col :span="5">
          <div
            class="grid-content"
            :class="{ current: status === '3' }"
            @click="chnageStatus('3')"
          >
            <div class="oride-top">已完成</div>
            <div class="oride-middle">
              <em>{{ statistics.complete ? statistics.complete.count : 0 }}</em
              >笔
            </div>
            <div class="oride-bottom">
              <p>
                {{ statistics.complete ? statistics.complete.bear : 0 }} 小熊币
              </p>
              <p>
                {{ statistics.complete ? statistics.complete.gem : 0 }} 宝石
              </p>
            </div>
          </div>
        </el-col>
        <!-- 未支付 0，1 -->
        <el-col :span="5">
          <div
            class="grid-content"
            :class="{ current: status === '0,1' }"
            @click="chnageStatus('0,1')"
          >
            <div class="oride-top">未支付</div>
            <div class="oride-middle">
              <em>{{ statistics.nopay ? statistics.nopay.count : 0 }}</em
              >笔
            </div>
            <div class="oride-bottom">
              <p>{{ statistics.nopay ? statistics.nopay.bear : 0 }} 小熊币</p>
              <p>{{ statistics.nopay ? statistics.nopay.gem : 0 }} 宝石</p>
            </div>
          </div>
        </el-col>
        <!-- 退费： 退费中 5，已退费 6，7 -->
        <!-- <el-col :span="5">
          <div
            class="grid-content"
            :class="{ current: status === '5,6,7' }"
            @click="chnageStatus('5,6,7')"
          >
            <div class="oride-top">退费</div>
            <div class="oride-middle">
              <em>{{ statistics.refun ? statistics.refun.count : 0 }}</em
              >笔
            </div>
            <div class="oride-bottom">
              <p>{{ statistics.refun ? statistics.refun.bear : 0 }} 小熊币</p>
              <p>{{ statistics.refun ? statistics.refun.gem : 0 }} 宝石</p>
            </div>
          </div>
        </el-col> -->
        <!-- 订单总计 3 -->
        <el-col :span="5">
          <div
            class="grid-content"
            :class="{ current: !status }"
            @click="chnageStatus('')"
          >
            <div class="oride-top">订单总计</div>
            <div class="oride-middle">
              <em>{{ statistics.total ? statistics.total.count : 0 }}</em
              >笔
            </div>
            <div class="oride-bottom">
              <p>{{ statistics.total ? statistics.total.bear : 0 }} 小熊币</p>
              <p>{{ statistics.total ? statistics.total.gem : 0 }} 宝石</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </article>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <section class="bottom-box">
      <table-order3
        :topic="topic"
        :status="status"
        :search="searchIn"
        @statistics="getStatistics"
      />
    </section>
  </div>
</template>

<script>
import TableOrder3 from './tableOrder3.vue'
import { isToss } from '@/utils/index'
export default {
  props: {
    // 当前tab - 商品主题
    topic: {
      type: String,
      default: ''
    },
    search: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    TableOrder3
  },
  data() {
    return {
      status: '3',
      // 搜索条件
      searchIn: [],
      teacherId: null,
      statistics: {}
    }
  },
  watch: {
    // 切换tab - 商品主题
    topic(val) {
      // this.reset()
    },
    // 搜索
    search(val) {
      this.searchIn = val
    }
  },
  created() {
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
    }
  },
  methods: {
    chnageStatus(status) {
      this.status = status
    },

    getStatistics(statistics) {
      this.statistics = statistics
    }
  }
}
</script>

<style lang="scss" scoped>
@import './statistics.scss';
</style>
