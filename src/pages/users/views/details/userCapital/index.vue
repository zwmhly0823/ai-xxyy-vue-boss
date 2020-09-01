<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-27 10:17:03
 * @LastEditors: liukun
 * @LastEditTime: 2020-09-01 11:31:25
-->
<template>
  <div>
    <el-radio-group v-model="changeSubject" size="mini">
      <el-radio-button :label="0">美术</el-radio-button>
      <el-radio-button :label="1">写字</el-radio-button>
    </el-radio-group>
    <el-tabs v-model="assetCurPane">
      <el-tab-pane label="优惠券" name="assetCoupon">
        <couponComponent :changeSubject="changeSubject" />
      </el-tab-pane>
      <el-tab-pane
        :label="{ 0: '小熊币', 1: '点点币' }[changeSubject]"
        name="assetBearCoin"
      >
        <coinComponent :changeSubject="changeSubject" />
      </el-tab-pane>
    </el-tabs>
  </div>
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
      assetCurPane: 'assetCoupon',
      changeSubject: this.$store.state.subjects.subjectCode
    }
  },
  methods: {}
}
</script>

<style lang="scss"></style>
