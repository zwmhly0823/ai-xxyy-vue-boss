<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-04-25 17:10:01
 * @LastEditors: liukun
 * @LastEditTime: 2020-04-28 15:26:04
 -->
<template>
  <div>
    <el-select
      :class="$style.select"
      v-model="select"
      size="mini"
      slot="prepend"
      placeholder="请选择"
      @change="onChange"
    >
      <el-option label="订单号" value="0"></el-option>
      <el-option label="下单手机号" value="1"></el-option>
      <el-option label="收货人手机号" value="2"></el-option>
    </el-select>
    <el-autocomplete
      placeholder="请输入内容"
      v-model="value"
      size="mini"
      clearable
      :fetch-suggestions="querySearch"
      :maxlength="select !== '0' ? 11 : 50"
      @select="handleSelect"
    >
    </el-autocomplete>
  </div>
</template>

<script>
export default {
  name: 'orderSearch',
  data() {
    return {
      value: '',
      select: '0'
      // keyword: 'out_trade_no'
    }
  },
  methods: {
    onChange(val) {
      console.info(val)
      this.value = ''
    },
    querySearch(query, cb) {
      console.log(query)
      const result = []
      cb(result)
    },
    handleSelect(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" module>
.select {
  width: 140px;
}
</style>
