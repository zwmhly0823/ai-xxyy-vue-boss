<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-04-25 17:10:01
 * @LastEditors: liukun
 * @LastEditTime: 2020-04-26 15:31:38
 -->
<template>
  <div>
    <el-input placeholder="请输入内容" v-model="value" size="mini">
      <el-select
        :class="$style.select"
        v-model="select"
        slot="prepend"
        placeholder="请选择"
        @change="changeop"
      >
        <el-option label="订单号" value="0"></el-option>
        <el-option label="下单人手机号" value="1"></el-option>
        <el-option label="收货人手机号" value="2"></el-option>
      </el-select>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'orderSearch',
  data() {
    return {
      value: '',
      select: '1'
    }
  },
  methods: {
    changeop(val) {
      console.info(val)
    }
  }
}
</script>

<style lang="scss" module>
.select {
  width: 125px;
}
</style>
