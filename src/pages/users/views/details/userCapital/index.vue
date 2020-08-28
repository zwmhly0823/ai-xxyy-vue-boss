<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-27 10:17:03
 * @LastEditors: liukun
 * @LastEditTime: 2020-08-28 14:54:57
-->
<template>
  <el-tabs v-model="assetCurPane">
    <el-tab-pane label="优惠券" name="assetCoupon">
      <couponComponent />
    </el-tab-pane>
    <el-tab-pane label="小熊币" name="assetBearCoin">
      <coinComponent />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import couponComponent from './couponComponent'
import coinComponent from './coinComponent'

export default {
  components: {
    couponComponent,
    coinComponent
  },
  data() {
    return {
      assetCurPane: 'assetCoupon'
    }
  },
  methods: {}
}
</script>

<style lang="scss"></style>
