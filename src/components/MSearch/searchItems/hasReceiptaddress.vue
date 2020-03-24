<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-24 19:43:54
 -->
<template>
  <div class="search-item small">
    <el-select v-model="hasAddress" clearable placeholder="有无收货地址">
      <el-option
        v-for="(item, index) in hasAddressList"
        :key="index"
        :label="item.text"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'hasAddress'
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasAddressList: [
        {
          text: '有收货地址',
          value: 1
        },
        {
          text: '无收货地址',
          value: 0
        }
      ],
      hasAddress: null
    }
  },
  watch: {
    hasAddress(val) {
      console.log(val, 'val')
      if (val !== undefined) {
        this.$emit('result', this.onlyValue ? val : { [this.name]: val })
        return
      }
      this.$emit('result', '')
    }
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 140px !important;
  }
}
</style>
