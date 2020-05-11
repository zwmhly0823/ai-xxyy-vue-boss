<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-11 16:16:08
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-11 16:16:08
 * @Description: 活动订单 - 统计 及 列表
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
            <div class="oride-middle"><em>123</em>笔</div>
            <div class="oride-bottom">
              <p>100 小熊币</p>
              <p>100 宝石</p>
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
            <div class="oride-middle"><em>123</em>笔</div>
            <div class="oride-bottom">
              <p>100 小熊币</p>
              <p>100 宝石</p>
            </div>
          </div>
        </el-col>
        <!-- 退费： 退费中 5，已退费 6，7 -->
        <el-col :span="5">
          <div
            class="grid-content"
            :class="{ current: status === '5,6,7' }"
            @click="chnageStatus('5,6,7')"
          >
            <div class="oride-top">退费</div>
            <div class="oride-middle"><em>123</em>笔</div>
            <div class="oride-bottom">
              <p>100 小熊币</p>
              <p>100 宝石</p>
            </div>
          </div>
        </el-col>
        <!-- 订单总计 3 -->
        <el-col :span="5">
          <div
            class="grid-content"
            :class="{ current: !status }"
            @click="chnageStatus('')"
          >
            <div class="oride-top">订单总计</div>
            <div class="oride-middle"><em>123</em>笔</div>
            <div class="oride-bottom">
              <p>100 小熊币</p>
              <p>100 宝石</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </article>
  </div>
</template>

<script>
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
  data() {
    return {
      status: '3'
    }
  },
  methods: {
    chnageStatus(status) {
      this.status = status
    },

    getOrderList() {}
  }
}
</script>

<style lang="scss" scoped>
@import './statistics.scss';
</style>
