<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-07-22 10:31:00
 * @LastEditors: liukun
 * @LastEditTime: 2020-07-25 17:20:01
-->
<template>
  <el-dialog title="用户地址" :visible.sync="showAddress" width="40%">
    <div>
      <el-row type="flex" justify="start" align="middle" class="marginb10">
        <el-col :span="5">收件人:</el-col>
        <el-col :span="18" :offset="1">{{
          addressData.receipt_name || '-'
        }}</el-col>
      </el-row>
      <el-row type="flex" justify="start" align="middle" class="marginb10">
        <el-col :span="5">电话:</el-col>
        <el-col :span="18" :offset="1">{{
          addressData.receipt_tel || '-'
        }}</el-col>
      </el-row>
      <el-row type="flex" justify="start" align="middle" class="marginb10">
        <el-col :span="5">收件地址:</el-col>
        <el-col :span="18" :offset="1"
          >{{ addressData.province || '-' }}{{ addressData.city || '-' }}
          {{ addressData.area || '-' }}
          {{ addressData.address_detail || '-' }}</el-col
        >
      </el-row>
      <el-row type="flex" justify="start" align="middle" class="marginb10">
        <el-col :span="5">操作:</el-col>
        <el-col :span="18" :offset="1" v-if="Object.keys(addressData).length">
          <el-button type="text" @click="changeAddress1">修改</el-button>
        </el-col>
        <el-col :span="18" :offset="1" v-else>
          <el-button type="text" @click="changeAddress1">增加</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'showAddress',
  props: {
    addressData: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data() {
    return {
      showAddress: false
    }
  },
  methods: {
    changeAddress1() {
      this.$emit('changeAddress')
      this.showAddress = false
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-button {
  padding: 0px;
}
.marginb10 {
  margin-bottom: 10px;
  font-size: 16px;
}
.marginb10:nth-last-of-type(1) {
  margin-bottom: 0px;
}
.marginb10 .el-col-5 {
  text-align: right;
}
</style>
